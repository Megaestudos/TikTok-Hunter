import { ProductOpportunityEngine, POIAnalysis } from "./intelligence/productOpportunityEngine";
import { HistoricalTrendEngine, TrendAnalysis, ProductSnapshot } from "./intelligence/historicalTrendEngine";
import { ForecastEngine, ForecastResult } from "./intelligence/forecastEngine";
import { TrendRepository } from "./intelligence/trendRepository";
import { Product, Platform } from "./productService";
import { ProductExtractorService } from "./utils/productExtractor";
import { SimilarityService } from "./utils/similarityService";

export type TrendScore = "Emergente" | "Explosivo" | "Saturado" | "Oportunidade";

export interface ConsolidatedProduct extends Product {
  platforms: Platform[];
  globalWinnerScore: number;
  confidenceScore: number;
  trendCategory: TrendScore;
  totalViews?: number;
  totalSales?: string;
  similarityConfidence: number; // 0-100
  poi?: POIAnalysis;
  history?: ProductSnapshot[];
  trends?: TrendAnalysis;
  scoutForecast?: ForecastResult;
}

/**
 * Enterprise Product Intelligence Service (v3)
 * Responsável por cruzar dados multiplataforma com alta precisão semântica.
 */
export const ProductCorrelationService = {
  /**
   * Ordena e Agrupa produtos usando Inteligência Cross-Platform
   */
  correlate: async (allProducts: Product[]): Promise<ConsolidatedProduct[]> => {
    // 1. Agrupamento por Fingerprint (Hash Unívoco)
    const initialGroups = new Map<string, Product[]>();

    allProducts.forEach(product => {
      const extraction = ProductExtractorService.extractDetailed(product.name);
      if (extraction.productName === "Produto não identificado" || extraction.confidence < 60) return;

      const fingerprint = ProductExtractorService.getFingerprint(extraction.productName);
      const existing = initialGroups.get(fingerprint) || [];
      initialGroups.set(fingerprint, [...existing, product]);
    });

    // 2. Refinamento por Similaridade Semântica e Bloqueio de Marca/Modelo
    const rawGroups = Array.from(initialGroups.values()).map(items => {
      const sorted = items.sort((a, b) => (b.winnerScore || 0) - (a.winnerScore || 0));
      return { representative: sorted[0], allItems: sorted };
    });

    const semanticGroups: { representative: Product; allItems: Product[]; confidence: number }[] = [];

    rawGroups.forEach(group => {
      let merged = false;
      const groupExtraction = ProductExtractorService.extractDetailed(group.representative.name);
      
      for (const semanticGroup of semanticGroups) {
        const targetExtraction = ProductExtractorService.extractDetailed(semanticGroup.representative.name);

        // Regra de Ouro: Marcas específicas diferentes NUNCA agrupam
        if (groupExtraction.brand && targetExtraction.brand && groupExtraction.brand !== targetExtraction.brand) continue;

        const similarity = ProductExtractorService.calculateSimilarity(
          group.representative.name,
          semanticGroup.representative.name
        );

        if (similarity >= 85) { 
          semanticGroup.allItems.push(...group.allItems);
          semanticGroup.confidence = Math.floor((semanticGroup.confidence + similarity) / 2);
          merged = true;
          break;
        }
      }

      if (!merged) {
        semanticGroups.push({ ...group, confidence: 100 });
      }
    });

    // 3. Consolidação e Inteligência de Mercado
    const consolidatedPromises = semanticGroups.map(async (group) => {
      const items = group.allItems;
      const bestBase = items.sort((a, b) => (b.winnerScore || 0) - (a.winnerScore || 0))[0];
      
      const platforms = Array.from(new Set<Platform>(items.map(i => i.platform)));
      const platformBoost = Math.min(30, (platforms.length - 1) * 15);

      const totalVideos = items.length;
      const totalViews = items.reduce((acc, i) => acc + (i.views || 0), 0);
      const extraction = ProductExtractorService.extractDetailed(bestBase.name);
      
      // Metodologia Winner Scoring (Scout v3)
      const maxViral = Math.max(...items.map(i => i.viralScore || 0));
      const maxOpp = Math.max(...items.map(i => i.opportunityScore || 0));
      const globalScore = Math.min(100, Math.floor((maxViral * 0.4) + (maxOpp * 0.6)) + platformBoost);

      const poi = ProductOpportunityEngine.analyze(
        { ...bestBase, winnerScore: globalScore },
        platforms.length,
        items.length,
        extraction.confidence
      );

      const productId = ProductExtractorService.getFingerprint(extraction.productName);
      const history = await TrendRepository.getHistory(productId);
      const trends = HistoricalTrendEngine.analyzeTrend(history);

      // Determina o Potencial de Venda Global
      let globalSalesPotential: "Baixo" | "Médio" | "Alto" | "Explosivo" = "Baixo";
      const potentials = items.map(i => i.salesPotential).filter(Boolean);
      if (potentials.includes("Explosivo") || (globalScore > 85 && totalViews > 2000000)) globalSalesPotential = "Explosivo";
      else if (potentials.includes("Alto") || globalScore > 70) globalSalesPotential = "Alto";
      else if (potentials.includes("Médio") || globalScore > 50) globalSalesPotential = "Médio";

      const consolidatedProd = {
        ...bestBase,
        name: extraction.productName,
        brand: extraction.brand,
        platforms,
        videos: totalVideos,
        views: totalViews,
        sales: globalSalesPotential,
        salesPotential: globalSalesPotential,
        globalWinnerScore: poi.globalRank,
        confidenceScore: extraction.confidence,
        similarityConfidence: group.confidence,
        trendCategory: poi.lifecycleStage === "Explosão" ? "Explosivo" : (poi.lifecycleStage === "Crescimento" ? "Oportunidade" : "Emergente"),
        badge: poi.lifecycleStage === "Explosão" ? "EXPLODINDO" : poi.recommendation,
        winnerScore: poi.globalRank,
        poi,
        history,
        trends,
        tags: Array.from(new Set([...bestBase.tags, ...platforms, extraction.category]))
      } as ConsolidatedProduct;

      consolidatedProd.scoutForecast = ForecastEngine.predict(consolidatedProd);

      // Snapshot Auto-Population
      await TrendRepository.saveSnapshot(productId, {
        timestamp: Date.now(),
        winnerScore: globalScore,
        viralScore: maxViral,
        opportunityScore: maxOpp,
        saturationLevel: poi.saturationScore,
        competitionScore: bestBase.competitionScore || 0,
        confidenceScore: extraction.confidence,
        platforms: platforms,
        mediaEvidenceCount: items.length,
        growthValue: parseInt(bestBase.growth?.replace(/[^\d]/g, "") || "0")
      });

      return consolidatedProd;
    });

    const consolidated = await Promise.all(consolidatedPromises);
    return consolidated.sort((a, b) => b.globalWinnerScore - a.globalWinnerScore);
  },

  getRankings: (consolidated: ConsolidatedProduct[]) => {
    return {
      topWinners: consolidated.slice(0, 10),
      topTrends: consolidated.filter(p => p.trendCategory === "Explosivo").slice(0, 20),
      topOpportunities: consolidated.filter(p => p.trendCategory === "Oportunidade").slice(0, 15),
      topLowCompetition: consolidated.filter(p => p.competitionScore < 40).sort((a, b) => b.globalWinnerScore - a.globalWinnerScore).slice(0, 15),
      topShared: [...consolidated].sort((a, b) => (b.shares || 0) - (a.shares || 0)).slice(0, 15),
      topCommented: [...consolidated].sort((a, b) => (b.comments || 0) - (a.comments || 0)).slice(0, 15),
      ...ForecastEngine.getRankings(consolidated)
    };
  }
};


