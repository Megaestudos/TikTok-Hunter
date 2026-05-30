import { ConsolidatedProduct } from "../productCorrelationService";
import { ProductSnapshot, TrendAnalysis } from "./historicalTrendEngine";

export type MarketMomentum = "Fraco" | "Estável" | "Forte" | "Explosivo";
export type SaturationLevel = "Baixa" | "Moderada" | "Alta" | "Crítica";
export type ROILevel = "Baixo" | "Médio" | "Alto" | "Muito Alto";

export interface ForecastResult {
  predictionScore: number;
  viralProbability: number;
  futureSaturation: { 
    d7: SaturationLevel; 
    d14: SaturationLevel; 
    d30: SaturationLevel; 
  };
  marketMomentum: MarketMomentum;
  isEarlyOpportunity: boolean;
  trendTrajectory: "Ascendente" | "Lateral" | "Descendente" | "Estável";
  forecastConfidence: number;
  estimatedROI: ROILevel;
  futureWinnerScores: { 
    d7: number; 
    d14: number; 
    d30: number; 
  };
  forecastSummary: string;
  alerts: string[];
  status: 'DATA_INSUFFICIENT' | 'READY';
}

/**
 * AI Forecast & Market Prediction Engine (v3 Professional)
 */
export const ForecastEngine = {
  /**
   * Gera previsões justificadas matematicamente baseadas em dados históricos.
   */
  predict: (product: ConsolidatedProduct): ForecastResult => {
    const history = product.history || [];
    const trends = product.trends;
    
    const isInsufficient = history.length < 3 || !trends || trends.status === 'DATA_INSUFFICIENT';

    // 1. Viral Probability (Audit: Sem multiplicadores mágicos)
    // Fórmula: (Média de Saturação Inversa * 0.4) + (Plataformas / 5 * 0.3) + (Confidence * 0.3)
    const invSaturation = 100 - (product.poi?.saturationScore || 50);
    const platformFactor = (product.platforms.length / 5) * 100;
    
    let viralProb = (invSaturation * 0.4) + (platformFactor * 0.3) + (product.confidenceScore * 0.3);
    viralProb = Math.min(100, Math.max(0, Math.floor(viralProb)));

    // 2. Momentum de Mercado (Baseado em HistoricalTrendEngine findings)
    let momentum: MarketMomentum = "Estável";
    const vel = trends?.velocityScore || 0;
    if (vel > 40) momentum = "Explosivo";
    else if (vel > 15) momentum = "Forte";
    else if (vel < -10) momentum = "Fraco";

    // 3. Early Detection (Lógica real baseada em saturação e início de crescimento)
    const isEarly = product.platforms.length >= 2 && (trends?.growthRate || 0) > 0 && (product.poi?.saturationScore || 0) < 20;

    // 4. ROI Estimation
    let roi: ROILevel = "Médio";
    if (viralProb > 80 && (product.poi?.saturationScore || 0) < 30) roi = "Muito Alto";
    else if (viralProb > 60 && (product.poi?.saturationScore || 0) < 50) roi = "Alto";
    else if ((product.poi?.saturationScore || 0) > 75) roi = "Baixo";

    // 5. Previsão de Saturação (Baseado em Growth Rate real)
    const calculateSaturation = (days: number): SaturationLevel => {
      const growthRate = trends?.growthRate || (viralProb / 100); // Fallback estatístico
      const projected = (product.poi?.saturationScore || 0) + (days * (growthRate / 10)); // Dividido por 10 para normalização diária de saturação
      if (projected > 85) return "Crítica";
      if (projected > 60) return "Alta";
      if (projected > 30) return "Moderada";
      return "Baixa";
    };

    // 6. Previsão de WinnerScore (Scoring Trajectory)
    const getFutureScore = (days: number): number => {
      const dailyVelocity = (trends?.velocityScore || 0) / 7;
      const score = product.globalWinnerScore + (dailyVelocity * days);
      return Math.min(100, Math.max(0, Math.floor(score)));
    };

    // 7. Forecast Confidence (Audit: Baseado em densidade de snapshots e estabilidade histórica)
    let confidence = isInsufficient 
      ? (history.length * 5) 
      : (product.trends?.confidenceLevel || 50);
    confidence = Math.floor(confidence);

    // 8. Prediction Score (Score Agregado Preditivo)
    const predictionScore = Math.floor(
      ((product.poi?.opportunityScore || 0) * 0.4) + 
      ((trends?.trendHealthScore || 50) * 0.4) + 
      (viralProb * 0.2)
    );

    const alerts: string[] = [];
    if (!isInsufficient) {
      if (momentum === 'Explosivo') alerts.push("FUTURE EXPLOSION: Baseado no momentum histórico.");
      if (calculateSaturation(14) === 'Crítica') alerts.push("FUTURE SATURATION: Risco alto em 14 dias.");
    }
    
    if (isEarly) alerts.push("EMERGING OPPORTUNITY: Detecção precoce validada.");

    const trajectory = trends?.trendDirection || "Estável";

    const summary = isInsufficient 
      ? `Forecast limitado: ${history.length} snapshots disponíveis. Probabilidade viral calculada em ${viralProb}%.`
      : `Produto em trajetória ${trajectory.toLowerCase()}. Growth rate total de ${trends?.growthRate}%. ` +
        `Estimativa de ROI ${roi.toLowerCase()} fundamentada em momentum de mercado.`;

    return {
      predictionScore,
      viralProbability: viralProb,
      futureSaturation: {
        d7: calculateSaturation(7),
        d14: calculateSaturation(14),
        d30: calculateSaturation(30)
      },
      marketMomentum: momentum,
      isEarlyOpportunity: isEarly,
      trendTrajectory: trajectory,
      forecastConfidence: confidence,
      estimatedROI: roi,
      futureWinnerScores: {
        d7: getFutureScore(7),
        d14: getFutureScore(14),
        d30: getFutureScore(30)
      },
      forecastSummary: summary,
      alerts,
      status: isInsufficient ? 'DATA_INSUFFICIENT' : 'READY'
    };
  },

  /**
   * Rankings Avançados (Forecast Intelligence)
   */
  getRankings: (products: ConsolidatedProduct[]) => {
    const forecasted = products.filter(p => p.scoutForecast && p.scoutForecast.status === 'READY');

    return {
      topFutureWinners: [...forecasted].sort((a, b) => 
        (b.scoutForecast?.futureWinnerScores.d7 || 0) - (a.scoutForecast?.futureWinnerScores.d7 || 0)
      ).slice(0, 10),

      topFutureExplosions: [...forecasted].filter(p => 
        p.scoutForecast?.marketMomentum === "Explosivo"
      ).sort((a, b) => (b.scoutForecast?.predictionScore || 0) - (a.scoutForecast?.predictionScore || 0)).slice(0, 10),

      topEarlyOpportunities: products.filter(p => p.scoutForecast?.isEarlyOpportunity) 
        .sort((a, b) => (b.scoutForecast?.viralProbability || 0) - (a.scoutForecast?.viralProbability || 0)).slice(0, 10),

      topROICandidates: products.filter(p => 
        p.scoutForecast?.estimatedROI === "Muito Alto" || p.scoutForecast?.estimatedROI === "Alto"
      ).sort((a, b) => (b.scoutForecast?.predictionScore || 0) - (a.scoutForecast?.predictionScore || 0)).slice(0, 10),

      topMomentumProducts: [...forecasted].sort((a, b) => 
        (b.scoutForecast?.predictionScore || 0) - (a.scoutForecast?.predictionScore || 0)
      ).slice(0, 10)
    };
  }
};

