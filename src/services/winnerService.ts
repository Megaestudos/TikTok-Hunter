import { Product, Platform, ProductService } from "./productService";
import { SearchService } from "./searchService";
import { ProductCorrelationService, ConsolidatedProduct } from "./productCorrelationService";

export const WinnerService = {
  /**
   * Transforma buscas brutas em perfis de "Produtos Vencedores" consolidados de alta qualidade
   */
  discoverWinners: async (query: string, platforms?: Platform[]): Promise<ConsolidatedProduct[]> => {
    // 1. Definição de Termos de Busca (Fallback para Tendências se a query for vazia)
    const trendingKeywords = ["mais vendidos", "oferta do dia", "viral products", "utilidades domésticas", "tecnologia", "beleza"];
    const effectiveQuery = query || trendingKeywords[Math.floor(Date.now() / (1000 * 60 * 60)) % trendingKeywords.length];

    // 2. Busca em todas as plataformas selecionadas
    const rawResults = await SearchService.search({ 
      query: effectiveQuery,
      platforms: platforms
    });
    
    // 3. Filtro de Segurança: Oculta o que não parece um produto real ou não tem imagem
    const validResults = rawResults.filter(p => 
      p.name.length > 8 && 
      p.image && !p.image.includes("no-product") &&
      !p.name.includes("???")
    );

    // 4. Inteligência de Correlação Enterprise (Deduplicação Semântica + Scoring)
    let consolidated = await ProductCorrelationService.correlate(validResults);

    // 5. Fail-Safe Fallback: Se a internet falhar ou retornar pouco, usamos o baseline real curado
    if (consolidated.length < 5) {
      const baseline = await ProductService.getTrendingProducts();
      // Converte baseline para ConsolidatedProduct format
      const consolidatedBaseline = baseline.map(p => ({
        ...p,
        platforms: [p.platform],
        globalWinnerScore: p.viralScore,
        confidenceScore: 100,
        trendCategory: p.viralScore > 90 ? "Explosivo" : "Emergente",
        similarityConfidence: 100
      } as ConsolidatedProduct));

      // Merge e remoção de duplicatas simples por ID
      const existingIds = new Set(consolidated.map(p => p.id));
      const needed = 15 - consolidated.length;
      const additional = consolidatedBaseline
        .filter(p => !existingIds.has(p.id))
        .slice(0, needed);
      
      consolidated = [...consolidated, ...additional];
    }

    // 6. Ranking Final
    return consolidated.sort((a, b) => b.globalWinnerScore - a.globalWinnerScore);
  },

  /**
   * Retorna os Top 10 Vencedores Globais
   */
  getTopWinners: async (query: string = ""): Promise<ConsolidatedProduct[]> => {
    const winners = await WinnerService.discoverWinners(query);
    return winners.slice(0, 10);
  }
};
