import { MediaEvidence } from "./mediaSearchService";
import { Product } from "../productService";
import { SimilarityService } from "../utils/similarityService";

export interface ValidationReport {
  socialProofScore: number;
  mediaConfidenceScore: number;
  discoveryDate: string;
  sourceCount: number;
  platformDistribution: string[];
}

/**
 * Motor de Validação de Mídias e Prova Social
 */
export const MediaAnalyzerService = {
  /**
   * Analisa as evidências coletadas para extrair métricas de validação
   */
  analyze: (product: Product, evidence: MediaEvidence[]): ValidationReport => {
    if (!evidence || evidence.length === 0) {
      return {
        socialProofScore: 0,
        mediaConfidenceScore: 0,
        discoveryDate: new Date().toLocaleDateString(),
        sourceCount: 0,
        platformDistribution: []
      };
    }

    // 1. Cálculo de Social Proof Score (Baseado em densidade real)
    const platforms = new Set(evidence.map(e => e.platform));
    const videoCount = evidence.filter(e => e.type === 'video').length;
    const adCount = evidence.filter(e => e.type === 'ad').length;
    
    // Fórmula: (Plataformas * 15) + (Vídeos * 10) + (Anúncios * 15) - Penas por baixa variedade
    let spScore = (platforms.size * 15) + (videoCount * 12) + (adCount * 15);
    
    // Bônus por presença no "Big Three" (TikTok, YT, FB)
    const hasBigThree = ['TikTok', 'YouTube', 'Facebook Ads'].every(p => platforms.has(p));
    if (hasBigThree) spScore += 20;

    spScore = Math.min(100, Math.floor(spScore));

    // 2. Cálculo de Media Confidence Score (Baseado na qualidade individual)
    const avgEvidenceConfidence = evidence.reduce((acc, i) => acc + (i.confidenceScore || 0), 0) / evidence.length;
    const avgRelevance = evidence.reduce((acc, i) => acc + (i.relevanceScore || 0), 0) / evidence.length;

    let mcScore = (avgEvidenceConfidence * 0.6) + (avgRelevance * 0.4);
    mcScore = Math.min(100, Math.floor(mcScore));

    return {
      socialProofScore: spScore,
      mediaConfidenceScore: mcScore,
      discoveryDate: new Date().toLocaleDateString(),
      sourceCount: evidence.length,
      platformDistribution: Array.from(platforms)
    };
  }
};
