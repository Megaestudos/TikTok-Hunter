import { Product, Platform, ProductService } from "./productService";
import { SearchService } from "./searchService";
import { ProductCorrelationService, ConsolidatedProduct } from "./productCorrelationService";

export const WinnerService = {
  /**
   * Transforma buscas brutas em perfis de "Produtos Vencedores" consolidados de alta qualidade
   */
  discoverWinners: async (query: string, platforms?: Platform[]): Promise<ConsolidatedProduct[]> => {
    // 1. Definição de Termos de Busca (Fallback para Tendências se a query for vazia)
    // Usamos múltiplos termos em paralelo para maximizar o volume de resultados
    const trendingKeywords = ["mais vendidos", "oferta do dia", "utilidades domésticas", "tecnologia", "beleza", "gadgets"];
    
    // Se não houver query, buscamos pelos 3 primeiros termos de tendência em paralelo
    const queriesToRun = query ? [query] : trendingKeywords.slice(0, 3);

    // 2. Busca em todas as plataformas selecionadas para cada query
    const allSearchPromises = queriesToRun.map(q => SearchService.search({ 
      query: q,
      platforms: platforms
    }));

    const searchResultsArrays = await Promise.all(allSearchPromises);
    const rawResults = searchResultsArrays.flat();
    
    // 3. Filtro de Segurança: Oculta o que não parece um produto real ou não tem imagem
    const validResults = rawResults.filter(p => 
      p.name.length > 8 && 
      p.image && !p.image.includes("no-product") &&
      !p.name.includes("???")
    );

    // 4. Inteligência de Correlação Enterprise (Deduplicação Semântica + Scoring)
    let consolidated = await ProductCorrelationService.correlate(validResults);

    // 5. Fail-Safe Fallback: Se a internet falhar ou retornar pouco, usamos o baseline real curado
    if (consolidated.length < 10) {
      const baseline = await ProductService.getTrendingProducts();
      const consolidatedBaseline = baseline.map(p => ({
        ...p,
        platforms: [p.platform],
        globalWinnerScore: p.viralScore,
        confidenceScore: 100,
        trendCategory: p.viralScore > 90 ? "Explosivo" : "Emergente",
        similarityConfidence: 100
      } as ConsolidatedProduct));

      const existingNames = new Set(consolidated.map(p => p.name.toLowerCase().substring(0, 20)));
      const additional = consolidatedBaseline
        .filter(p => !existingNames.has(p.name.toLowerCase().substring(0, 20)))
        .slice(0, 20 - consolidated.length);
      
      consolidated = [...consolidated, ...additional];
    }

    // 6. Ranking Final e Limite de Volume
    return consolidated
      .sort((a, b) => b.globalWinnerScore - a.globalWinnerScore)
      .slice(0, 100); // Exibe até 100 produtos para maximizar a grade
  },

  /**
   * Retorna os Top 10 Vencedores Globais
   */
  getTopWinners: async (query: string = ""): Promise<ConsolidatedProduct[]> => {
    const winners = await WinnerService.discoverWinners(query);
    return winners.slice(0, 10);
  }
};
