import { ProductExtractorService } from "../utils/productExtractor";
import { SimilarityService } from "../utils/similarityService";
import { 
  TikTokProvider, 
  YouTubeProvider, 
  FBAdsProvider, 
  PinterestProvider, 
  GoogleImagesProvider, 
  InstagramProvider,
  MediaProvider
} from "./providers/mediaProviders";

/**
 * Interface rigorosa para evidências (Scout v3)
 */
export interface MediaEvidence {
  url: string;
  thumbnail: string;
  title: string;
  platform: string;
  type: 'video' | 'image' | 'ad';
  confidenceScore: number;
  relevanceScore: number;
  discoveredAt: string;
  metadata: Record<string, any>;
}

export interface MediaSearchMetrics {
  searchDuration: number;
  providerSuccessRate: number;
  cacheHit: boolean;
  totalResults: number;
}

interface CacheEntry {
  data: MediaEvidence[];
  timestamp: number;
}

const CACHE = new Map<string, CacheEntry>();
const CACHE_TTL = 15 * 60 * 1000;
const MAX_CACHE_SIZE = 50;

/**
 * Enterprise Media Intelligence Engine (Orchestrator v3)
 */
export const MediaSearchService = {
  /**
   * Executa a varredura profissional com métricas e resiliência
   */
  search: async (productName: string): Promise<{ results: MediaEvidence[]; metrics: MediaSearchMetrics }> => {
    const startTime = Date.now();
    
    // 1. Chave Canônica via Fingerprint
    const fingerprint = ProductExtractorService.getFingerprint(
      ProductExtractorService.extract(productName)
    );

    // 2. Cache Check (Metrics: cacheHit)
    const cached = CACHE.get(fingerprint);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log(`[MediaCache] Hit for: ${fingerprint}`);
      return {
        results: cached.data,
        metrics: {
          searchDuration: Date.now() - startTime,
          providerSuccessRate: 100,
          cacheHit: true,
          totalResults: cached.data.length
        }
      };
    }

    // 3. Orquestração Paralela com allSettled e AbortController
    const providers: MediaProvider[] = [
      TikTokProvider, YouTubeProvider, FBAdsProvider, 
      InstagramProvider, PinterestProvider, GoogleImagesProvider
    ];

    console.log(`[MediaSearch] Starting high-precision scout: ${productName}`);

    const scoutResponses = await Promise.allSettled(
      providers.map(async (provider) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), provider.timeout);

        try {
          const results = await provider.search(productName, controller.signal);
          return results;
        } finally {
          clearTimeout(timeoutId);
        }
      })
    );

    // 4. Processamento de Métricas e Consolidação
    const successfulResults: MediaEvidence[] = [];
    let successCount = 0;

    scoutResponses.forEach((response, index) => {
      if (response.status === 'fulfilled') {
        successfulResults.push(...response.value);
        successCount++;
        console.log(`[MediaProvider] SUCCESS: ${providers[index].platform}`);
      } else {
        console.error(`[MediaProvider] FAILED: ${providers[index].platform} - ${response.reason}`);
      }
    });

    // 5. Deduplicação e Scoring
    const uniqueResults = MediaSearchService.deduplicate(successfulResults);
    
    const processedResults = uniqueResults.map(item => {
      const confidence = SimilarityService.calculateSimilarity(productName, item.title);
      const platformWeight = MediaSearchService.getPlatformWeight(item.platform);
      const typeWeight = MediaSearchService.getTypeWeight(item.type);

      return {
        ...item,
        confidenceScore: confidence,
        relevanceScore: Math.floor((confidence * 0.4) + (platformWeight * 30) + (typeWeight * 30))
      };
    });

    // Ordenação Multi-Critério
    const finalResults = processedResults.sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
      return b.confidenceScore - a.confidenceScore;
    });

    // 6. Persistência de Cache e Métricas Finais
    MediaSearchService.updateCache(fingerprint, finalResults);

    const metrics: MediaSearchMetrics = {
      searchDuration: Date.now() - startTime,
      providerSuccessRate: Math.floor((successCount / providers.length) * 100),
      cacheHit: false,
      totalResults: finalResults.length
    };

    console.log(`[MediaMetrics] Search completed in ${metrics.searchDuration}ms. Success rate: ${metrics.providerSuccessRate}%`);

    return { results: finalResults, metrics };
  },

  /**
   * Deduplicação Avançada [MediaDedupe]
   */
  deduplicate: (items: MediaEvidence[]): MediaEvidence[] => {
    const seen = new Set<string>();
    return items.filter(item => {
      const fingerprint = `${item.url}|${SimilarityService.normalizeName(item.title)}`;
      if (seen.has(fingerprint)) return false;
      seen.add(fingerprint);
      return true;
    });
  },

  getPlatformWeight: (platform: string): number => {
    const weights: Record<string, number> = {
      'TikTok': 1.0, 'YouTube': 0.9, 'Facebook Ads': 0.8,
      'Instagram': 0.7, 'Pinterest': 0.6, 'Google Images': 0.4
    };
    return weights[platform] || 0.5;
  },

  getTypeWeight: (type: string): number => {
    const weights: Record<string, number> = {
      'video': 1.0, 'ad': 0.8, 'image': 0.6
    };
    return weights[type] || 0.5;
  },

  updateCache: (key: string, data: MediaEvidence[]) => {
    if (CACHE.size >= MAX_CACHE_SIZE) {
      const oldest = CACHE.keys().next().value;
      if (oldest) CACHE.delete(oldest);
    }
    CACHE.set(key, { data, timestamp: Date.now() });
  }
};
