import { Product, Platform } from "./productService";
import { SearchService } from "./searchService";
import { ProductCorrelationService, ConsolidatedProduct } from "./productCorrelationService";

export const WinnerService = {
  /**
   * Transforma buscas brutas em perfis de "Produtos Vencedores" consolidados de alta qualidade
   */
  discoverWinners: async (query: string, platforms?: Platform[]): Promise<ConsolidatedProduct[]> => {
    // 1. Definição de Termos de Busca (Fallback para Tendências se a query for vazia)
    const trendingKeywords = ["mais vendidos", "oferta do dia", "viral products", "tiktok made me buy it", "utilidades domésticas", "cozinha inteligente"];
    const effectiveQuery = query || trendingKeywords[Math.floor(Date.now() / (1000 * 60 * 60)) % trendingKeywords.length];

    // 2. Busca em todas as plataformas selecionadas
    const rawResults = await SearchService.search({ 
      query: effectiveQuery,
      platforms: platforms
    });
    
    // 3. Filtro de Segurança: Oculta o que não parece um produto real ou não tem imagem
    const validResults = rawResults.filter(p => 
      p.name.length > 10 && 
      p.image && !p.image.includes("no-product") &&
      !p.name.includes("???")
    );

    // 4. Inteligência de Correlação Enterprise (Deduplicação Semântica + Scoring)
    const consolidated = await ProductCorrelationService.correlate(validResults);

    // 5. Ranking Final
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
