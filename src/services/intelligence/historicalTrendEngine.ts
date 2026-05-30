import { Platform } from "../productService";

/**
 * Snapshot dos dados de um produto em um momento específico
 */
export interface ProductSnapshot {
  timestamp: number;
  winnerScore: number;
  viralScore: number;
  opportunityScore: number;
  saturationLevel: number;
  competitionScore: number;
  confidenceScore: number;
  platforms: Platform[];
  mediaEvidenceCount: number;
  growthValue: number;
}

export type AccelerationType = 'positivo' | 'estagnado' | 'declínio' | 'unknown';

export interface TrendAnalysis {
  velocityScore: number; 
  slopeScore: number; 
  momentumScore: number; 
  trendDirection: "Ascendente" | "Descendente" | "Lateral" | "Estável";
  confidenceLevel: number;
  acceleration: AccelerationType;
  trendHealthScore: number;
  momentum: number;
  movingAverage: number;
  growthRate: number;
  lifecycleStage: "Discovery" | "Emergente" | "Crescimento" | "Explosão" | "Saturação" | "Declínio";
  alerts: string[];
  status: 'DATA_INSUFFICIENT' | 'READY';
  confidenceScore: number;
}

/**
 * Historical Trend Intelligence Engine (v4 Enterprise Edition)
 */
export const HistoricalTrendEngine = {
  /**
   * Utilitários de segurança matemática para evitar NaN/Infinity
   */
  utils: {
    safeDiv: (n: number, d: number): number => (d === 0 || isNaN(d) ? 0 : n / d),
    clamp: (v: number, min: number, max: number): number => {
      const val = isNaN(v) ? 0 : v;
      return Math.min(max, Math.max(min, val));
    }
  },

  /**
   * Calcula a trajetória do produto com modelos financeiros e temporais rigorosos.
   */
  analyzeTrend: (history: ProductSnapshot[]): TrendAnalysis => {
    const { safeDiv, clamp } = HistoricalTrendEngine.utils;
    const minSnapshots = 3;
    const now = Date.now();

    if (history.length < minSnapshots) {
      return {
        velocityScore: 0,
        slopeScore: 0,
        momentumScore: 0,
        trendDirection: "Estável",
        confidenceLevel: clamp((history.length / minSnapshots) * 100, 0, 100),
        acceleration: 'unknown',
        trendHealthScore: 0,
        momentum: 0,
        movingAverage: 0,
        growthRate: 0,
        lifecycleStage: 'Discovery',
        status: 'DATA_INSUFFICIENT',
        confidenceScore: 0,
        alerts: [`Dados insuficientes (${history.length}/${minSnapshots})`]
      };
    }

    // 1. Médias Móveis Temporais Reais (7 e 14 dias)
    const getTemporalMA = (days: number): number => {
      const cutoff = now - (days * 24 * 60 * 60 * 1000);
      const window = history.filter(h => h.timestamp >= cutoff);
      if (window.length === 0) return history[history.length -1].winnerScore;
      return window.reduce((a, b) => a + b.winnerScore, 0) / window.length;
    };

    const ma7 = getTemporalMA(7);
    const ma14 = getTemporalMA(14);

    // 2. Regressão Linear Temporal
    const n = history.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    const firstTs = history[0].timestamp;
    
    history.forEach(h => {
      const x = (h.timestamp - firstTs) / (24 * 60 * 60 * 1000); // X em dias desde o início
      const y = h.winnerScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const den = (n * sumX2 - sumX * sumX);
    const slope = den === 0 ? 0 : (n * sumXY - sumX * sumY) / den;

    // 3. Score Normalizado de Slope (0-100)
    // Slope de 5.0 (5 pontos/dia) = 100
    const slopeScore = clamp(50 + (slope * 10), 0, 100);

    // 4. Score Normalizado de Momentum (0-100)
    const rawMomentum = ma14 === 0 ? 1 : ma7 / ma14;
    const momentumScore = clamp(rawMomentum * 50, 0, 100);

    // 5. Velocity Score Ponderado (Audit Rule 8: No Negatives)
    const velocityScore = clamp((slopeScore * 0.6) + (momentumScore * 0.4), 0, 100);

    // 6. Growth Rate Real
    const current = history[history.length - 1].winnerScore;
    const oldest = history[0].winnerScore;
    const growthRate = safeDiv(current - oldest, oldest || 1) * 100;

    // 7. Confidence Level Avançado (Estabilidade + Quantidade + Regularidade)
    const intervals = [];
    for(let i=1; i<n; i++) intervals.push(history[i].timestamp - history[i-1].timestamp);
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const varianceInterval = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length;
    const regularityScore = clamp(100 - (Math.sqrt(varianceInterval) / (24 * 60 * 60 * 1000) * 10), 0, 100);
    
    const stabilityScore = clamp(100 - (Math.abs(current - ma7) / (ma7 || 1) * 100), 0, 100);
    const quantityScore = clamp(n * 4, 0, 100);
    const confidenceLevel = Math.floor((stabilityScore * 0.4) + (quantityScore * 0.3) + (regularityScore * 0.3));

    // 8. Lifecycle Detection Avançado
    let lifecycle: TrendAnalysis["lifecycleStage"] = "Discovery";
    const saturation = history[history.length - 1].saturationLevel;

    if (saturation > 80) lifecycle = "Saturação";
    else if (slope < -1 && rawMomentum < 0.9) lifecycle = "Declínio";
    else if (slope > 3 && rawMomentum > 1.2) lifecycle = "Explosão";
    else if (slope > 0.5) lifecycle = "Crescimento";
    else if (n >= 5 && slope > 0.1) lifecycle = "Emergente";

    const alerts: string[] = [];
    if (slope < 0 && ma7 < ma14) alerts.push("TREND REVERSAL: Queda confirmada em múltiplos períodos.");
    if (slope > 4) alerts.push("EXPLOSION SIGNAL: Crescimento vertical detectado.");
    if (saturation > 75) alerts.push("SATURATION RISK: Baixa margem de crescimento residual.");
    if (rawMomentum < 0.8 && slope > 0) alerts.push("MOMENTUM LOSS: Perda de força apesar do crescimento nominal.");
    if (n < 6 && slope > 2) alerts.push("EARLY OPPORTUNITY: Detecção precoce de tendência forte.");

    return {
      velocityScore: Math.floor(velocityScore),
      slopeScore: Math.floor(slopeScore),
      momentumScore: Math.floor(momentumScore),
      trendDirection: slope > 0.5 ? "Ascendente" : (slope < -0.5 ? "Descendente" : (Math.abs(slope) > 0.1 ? "Lateral" : "Estável")),
      confidenceLevel,
      acceleration: slope > 0 ? "positivo" : (slope < 0 ? "declínio" : "estagnado"),
      trendHealthScore: Math.floor(stabilityScore),
      momentum: Math.floor(rawMomentum * 100),
      movingAverage: Math.floor(ma7),
      growthRate: Math.floor(growthRate),
      lifecycleStage: lifecycle,
      alerts,
      status: 'READY',
      confidenceScore: confidenceLevel
    };
  }
};
