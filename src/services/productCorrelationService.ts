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
      const canonicalName = ProductExtractorService.extract(product.name);
      if (canonicalName === "Produto Viral") return;

      const fingerprint = ProductExtractorService.getFingerprint(canonicalName);
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
      const groupBrand = ProductExtractorService.detectBrandAndModel(group.representative.name).brand;
      const groupModel = ProductExtractorService.detectBrandAndModel(group.representative.name).model;
      
      for (const semanticGroup of semanticGroups) {
        const targetBrand = ProductExtractorService.detectBrandAndModel(semanticGroup.representative.name).brand;
        const targetModel = ProductExtractorService.detectBrandAndModel(semanticGroup.representative.name).model;

        // Regra de Ouro: Marcas ou Modelos específicos diferentes NUNCA agrupam
        if (groupBrand !== "Generic" && targetBrand !== "Generic" && groupBrand !== targetBrand) continue;
        if (groupModel !== "Standard" && targetModel !== "Standard" && groupModel !== targetModel) continue;

        const similarity = SimilarityService.calculateSimilarity(
          group.representative.name,
          semanticGroup.representative.name
        );

        if (similarity >= 85) { // Threshold aumentado para evitar falsos positivos
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

      const totalVideos = items.reduce((acc, i) => acc + (i.videos || 0), 0);
      const prodName = ProductExtractorService.extract(bestBase.name);
      const extractorConfidence = ProductExtractorService.getConfidenceScore(prodName);

      // Metodologia Winner Scoring (Scout v3)
      const maxViral = Math.max(...items.map(i => i.viralScore || 0));
      const maxOpp = Math.max(...items.map(i => i.opportunityScore || 0));
      const globalScore = Math.min(100, Math.floor((maxViral * 0.4) + (maxOpp * 0.6)) + platformBoost);

      const poi = ProductOpportunityEngine.analyze(
        { ...bestBase, winnerScore: globalScore },
        platforms.length,
        items.length,
        extractorConfidence
      );

      const productId = ProductExtractorService.getFingerprint(prodName);
      const history = await TrendRepository.getHistory(productId);
      const trends = HistoricalTrendEngine.analyzeTrend(history);

      const consolidatedProd = {
        ...bestBase,
        name: prodName,
        platforms,
        videos: totalVideos,
        globalWinnerScore: poi.globalRank,
        confidenceScore: extractorConfidence,
        similarityConfidence: group.confidence,
        trendCategory: poi.lifecycleStage === "Explosão" ? "Explosivo" : (poi.lifecycleStage === "Crescimento" ? "Oportunidade" : "Emergente"),
        badge: poi.lifecycleStage === "Explosão" ? "EXPLODINDO" : poi.recommendation,
        winnerScore: poi.globalRank,
        poi,
        history,
        trends,
        tags: Array.from(new Set([...bestBase.tags, ...platforms]))
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
        confidenceScore: extractorConfidence,
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
      ...ForecastEngine.getRankings(consolidated)
    };
  }
};


