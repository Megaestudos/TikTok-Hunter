import { Product } from "../productService";

export type Recommendation = "COMPRAR" | "TESTAR" | "MONITORAR" | "EVITAR";
export type LifecycleStage = "Descoberta" | "Emergente" | "Crescimento" | "Explosão" | "Saturação" | "Declínio";

export interface POIAnalysis {
  winnerScore: number;
  opportunityScore: number;
  riskScore: number;
  saturationScore: number;
  confidenceScore: number;
  recommendation: Recommendation;
  lifecycleStage: LifecycleStage;
  analysisSummary: string;
  globalRank: number;
}

/**
 * Product Opportunity Intelligence (POI) Engine
 * Transforma métricas em decisões de negócio
 */
export const ProductOpportunityEngine = {
  /**
   * Analisa profundamente um produto para determinar seu potencial comercial
   */
  analyze: (product: Product, platformsCount: number, evidenceCount: number, confidence: number): POIAnalysis => {
    // Parsing de Growth (String -> Number)
    const growthValue = product.growth ? parseInt(product.growth.replace(/[^\d]/g, "")) : 0;

    // 1. Motor de Saturação e Risco
    const saturation = product.saturationLevel || 0;
    const competition = product.competitionScore || 0;
    
    // Risco baseado em Saturação, Concorrência e se o crescimento está estagnado
    let riskScore = (saturation * 0.5) + (competition * 0.4);
    if (growthValue < 5) riskScore += 10;
    riskScore = Math.min(100, Math.floor(riskScore));

    // 2. Motor de Oportunidade
    // Considera viralidade, plataformas e evidência visual
    let opportunityScore = (product.viralScore * 0.4) + (product.opportunityScore * 0.4) + (platformsCount * 10);
    opportunityScore = Math.min(100, Math.floor(opportunityScore));

    // 3. Detecção de Ciclo de Vida
    let lifecycle: LifecycleStage = "Descoberta";
    if (saturation > 80) lifecycle = "Saturação";
    else if (saturation > 60) lifecycle = "Declínio";
    else if (product.viralScore > 85 && growthValue > 50) lifecycle = "Explosão";
    else if (growthValue > 20) lifecycle = "Crescimento";
    else if (platformsCount >= 2) lifecycle = "Emergente";

    // 4. Recomendação Automática (Regras de Negócio)
    let recommendation: Recommendation = "MONITORAR";
    const winnerScore = product.winnerScore || 0;

    if (winnerScore > 85 && opportunityScore > 80 && riskScore < 30) recommendation = "COMPRAR";
    else if (winnerScore > 70 && riskScore < 50) recommendation = "TESTAR";
    else if (winnerScore < 40 || riskScore > 70) recommendation = "EVITAR";

    // 5. Global Rank (Ranking Cross-Platform)
    // Soma de influências: Viralidade + Presença + Validação de Mídia
    const globalRank = Math.floor((winnerScore * 0.6) + (opportunityScore * 0.2) + (confidence * 0.2));

    // 6. Explicação da IA (Análise Narrativa)
    const summary = `Produto detectado em ${platformsCount} plataformas. ` +
      `Possui crescimento ${growthValue > 20 ? 'acelerado' : 'estável'}, ` +
      `${saturation < 30 ? 'baixa saturação no mercado' : 'presença consolidada'} ` +
      `e ${evidenceCount > 3 ? 'alta recorrência de mídia' : 'validação visual em progresso'}.`;

    return {
      winnerScore,
      opportunityScore,
      riskScore,
      saturationScore: saturation,
      confidenceScore: confidence,
      recommendation,
      lifecycleStage: lifecycle,
      analysisSummary: summary,
      globalRank
    };
  }
};
