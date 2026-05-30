import { Product, Platform } from "./productService";
import { SearchService } from "./searchService";
import { ProductExtractorService } from "./utils/productExtractor";

export type TrendType = "Emergente" | "Explosivo" | "Saturado" | "Oportunidade";

export interface WinnerProfile extends Product {
  detectedOn: Platform[];
  consolidatedScore: number;
  winnerSeal: "🟢 Alta" | "🟡 Média" | "🔴 Saturado";
  trendCategory: TrendType;
  platformPrices: Record<string, string>;
}

export const WinnerService = {
  /**
   * Transforma buscas brutas em perfis de "Produtos Vencedores" consolidados
   */
  discoverWinners: async (query: string): Promise<WinnerProfile[]> => {
    // 1. Busca em todas as plataformas
    const rawResults = await SearchService.search({ query });
    
    // 2. Filtro de Produtos Reais: Oculta o que não parece um produto real
    const validResults = rawResults.filter(p => 
      p.name !== "TikTok Viral Product" && 
      p.name.length > 8 && 
      !p.name.includes("???")
    );

    // 3. Inteligência de Consolidação (Deduplicação)
    const consolidatedMap = new Map<string, WinnerProfile>();

    validResults.forEach(product => {
      const normalizedName = ProductExtractorService.extract(product.name)
        .toLowerCase()
        .substring(0, 15); 
      
      const existing = consolidatedMap.get(normalizedName);
      if (existing) {
        // Merge de plataformas
        if (!existing.detectedOn.includes(product.platform)) {
          existing.detectedOn.push(product.platform);
        }
        
        // Merge de preços
        existing.platformPrices[product.platform] = product.price;
        
        // Atualiza métricas (pega a melhor/mais recente)
        existing.viralScore = Math.max(existing.viralScore, product.viralScore);
        existing.opportunityScore = Math.max(existing.opportunityScore, product.opportunityScore);
        existing.winnerScore = Math.max(existing.winnerScore || 0, product.winnerScore || 0);
      } else {
        consolidatedMap.set(normalizedName, {
          ...product,
          detectedOn: [product.platform],
          consolidatedScore: 0,
          winnerSeal: "🟡 Média",
          trendCategory: "Emergente",
          platformPrices: { [product.platform]: product.price }
        });
      }
    });

    // 4. Scoring e Categorização Final
    const winners = Array.from(consolidatedMap.values()).map(winner => {
      // Cálculo de Score Consolidado
      const platformBonus = (winner.detectedOn.length - 1) * 15;
      const baseScore = winner.winnerScore || winner.viralScore || 0;
      const finalScore = Math.min(100, baseScore + platformBonus);

      // Definição de Selo
      let seal: WinnerProfile["winnerSeal"] = "🟡 Média";
      if (finalScore > 80 && winner.saturationLevel < 40) seal = "🟢 Alta";
      if (winner.saturationLevel > 70 || winner.competitionScore > 85) seal = "🔴 Saturado";

      // Definição de Categoria de Tendência
      let category: TrendType = "Emergente";
      if (winner.viralScore > 85 && winner.opportunityScore > 75) category = "Explosivo";
      else if (seal === "🔴 Saturado") category = "Saturado";
      else if (winner.opportunityScore > 80) category = "Oportunidade";

      return {
        ...winner,
        consolidatedScore: finalScore,
        winnerSeal: seal,
        trendCategory: category,
        // Tag especial de vencedor
        tags: [...winner.tags, seal.replace(/[^\w\s]/gi, '').trim()]
      };
    });

    // 5. Ranking Global: Ordena por score consolidado
    return winners.sort((a, b) => b.consolidatedScore - a.consolidatedScore);
  },

  /**
   * Retorna os Top 10 Vencedores Globais
   */
  getTopWinners: async (query: string = ""): Promise<WinnerProfile[]> => {
    const winners = await WinnerService.discoverWinners(query);
    return winners.slice(0, 10);
  }
};
