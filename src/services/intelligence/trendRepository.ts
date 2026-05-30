import { ProductSnapshot } from "./historicalTrendEngine";

/**
 * Enterprise Trend Intelligence Repository (v4)
 * Arquitetura preparada para escalabilidade global e persistência multi-provider.
 */

export enum RepositoryProvider {
  IN_MEMORY = "IN_MEMORY",
  SUPABASE = "SUPABASE",
  POSTGRES = "POSTGRES",
  FIREBASE = "FIREBASE",
  REDIS = "REDIS"
}

export interface RepositoryMetrics {
  totalSnapshots: number;
  lastExecutionTimeMs: number;
  operationsCount: number;
  cacheHitRate: number;
  cacheMissRate: number;
  hitCount: number;
  missCount: number;
}

export interface ITrendRepository {
  saveSnapshot(productId: string, snapshot: ProductSnapshot): Promise<void>;
  getHistory(productId: string, days?: number): Promise<ProductSnapshot[]>;
  getLatestSnapshot(productId: string): Promise<ProductSnapshot | null>;
  getTopGaining(days: number, limit?: number): Promise<{ productId: string; gain: number }[]>;
  getMetrics(): RepositoryMetrics;
}

/**
 * Enterprise Logger Estruturado
 */
const Logger = {
  info: (context: string, message: string, data?: any) => {
    console.log(`[TrendRepo][${context}] ${message}`, data || "");
  },
  warn: (context: string, message: string) => {
    console.warn(`[TrendRepo][${context}] ${message}`);
  }
};

/**
 * IMPLEMENTAÇÃO IN-MEMORY (ENTERPRISE GA)
 * Cache Layer com TTL, Auto-Cleanup e Métricas de Performance.
 */
class InMemoryTrendRepository implements ITrendRepository {
  private store = new Map<string, ProductSnapshot[]>();
  
  // Cache Layer
  private historyCache = new Map<string, { data: ProductSnapshot[], timestamp: number }>();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutos para Enterprise

  private metrics = { 
    totalSnapshots: 0, 
    lastExecutionTimeMs: 0, 
    operationsCount: 0,
    hits: 0,
    misses: 0
  };
  
  private readonly MAX_SNAPSHOTS_PER_PRODUCT = 200; // Aumentado para escala

  constructor() {
    // Daemon de Limpeza Automática
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanupCache(), 5 * 60 * 1000); // Roda a cada 5m
    }
  }

  private trackOperation(startTime: number) {
    this.metrics.operationsCount++;
    this.metrics.lastExecutionTimeMs = parseFloat((performance.now() - startTime).toFixed(4));
  }

  private cleanupCache() {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, entry] of this.historyCache.entries()) {
      if (now - entry.timestamp > this.CACHE_TTL) {
        this.historyCache.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) Logger.info("Cleanup", `Removidos ${cleaned} itens expirados do cache.`);
  }

  async saveSnapshot(productId: string, snapshot: ProductSnapshot): Promise<void> {
    const start = performance.now();
    try {
      const history = this.store.get(productId) || [];
      const snapshotDate = new Date(snapshot.timestamp).toISOString().split('T')[0];
      const hasToday = history.some(h => new Date(h.timestamp).toISOString().split('T')[0] === snapshotDate);
      
      if (!hasToday) {
        let updatedHistory = [...history, snapshot];
        if (updatedHistory.length > this.MAX_SNAPSHOTS_PER_PRODUCT) {
          updatedHistory = updatedHistory.slice(-this.MAX_SNAPSHOTS_PER_PRODUCT);
        }
        
        this.store.set(productId, updatedHistory.sort((a, b) => a.timestamp - b.timestamp));
        this.metrics.totalSnapshots++;
        
        // Invalidação Proativa de Cache
        this.historyCache.delete(productId);
        
        Logger.info("Snapshot", `Persistido: ${productId}.`);
      }
    } finally {
      this.trackOperation(start);
    }
  }

  async getHistory(productId: string, days: number = 30): Promise<ProductSnapshot[]> {
    const start = performance.now();
    
    // 1. Hit Check
    const cached = this.historyCache.get(productId);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      this.metrics.hits++;
      this.trackOperation(start);
      return [...cached.data];
    }

    this.metrics.misses++;
    const history = this.store.get(productId) || [];
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    const filtered = history
      .filter(h => h.timestamp >= cutoff)
      .sort((a, b) => a.timestamp - b.timestamp);
      
    // 2. Cache Population
    this.historyCache.set(productId, { data: filtered, timestamp: Date.now() });

    this.trackOperation(start);
    return [...filtered];
  }

  async getLatestSnapshot(productId: string): Promise<ProductSnapshot | null> {
    const history = this.store.get(productId) || [];
    if (history.length === 0) return null;
    return { ...history[history.length - 1] };
  }

  async getTopGaining(days: number, limit: number = 10): Promise<{ productId: string; gain: number }[]> {
    const start = performance.now();
    const rankings: { productId: string; gain: number }[] = [];
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);

    for (const [productId, snapshots] of this.store.entries()) {
      const filtered = snapshots.filter(s => s.timestamp >= cutoff);
      if (filtered.length < 2) continue;

      const latest = filtered[filtered.length - 1];
      const oldest = filtered[0];
      const gain = latest.winnerScore - oldest.winnerScore;

      rankings.push({ productId, gain });
    }

    const result = rankings
      .sort((a, b) => b.gain - a.gain)
      .slice(0, limit);

    this.trackOperation(start);
    return result;
  }

  getMetrics(): RepositoryMetrics {
    const totalRequests = this.metrics.hits + this.metrics.misses;
    return { 
      ...this.metrics, 
      hitCount: this.metrics.hits,
      missCount: this.metrics.misses,
      cacheHitRate: totalRequests > 0 ? parseFloat(((this.metrics.hits / totalRequests) * 100).toFixed(2)) : 0,
      cacheMissRate: totalRequests > 0 ? parseFloat(((this.metrics.misses / totalRequests) * 100).toFixed(2)) : 0
    };
  }
}

/**
 * REPOSITORY FACTORY (SOLID)
 */
export const RepositoryFactory = {
  create: (provider: RepositoryProvider): ITrendRepository => {
    switch (provider) {
      case RepositoryProvider.IN_MEMORY:
        return new InMemoryTrendRepository();
      default:
        // Escalável para SupabaseRepository, PostgresRepository, etc.
        return new InMemoryTrendRepository();
    }
  }
};

export const TrendRepository = RepositoryFactory.create(RepositoryProvider.IN_MEMORY);
