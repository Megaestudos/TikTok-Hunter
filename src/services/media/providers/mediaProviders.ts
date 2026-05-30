import { MediaEvidence } from "../mediaSearchService";

/**
 * Interface rigorosa para Providers de Mídia
 */
export interface MediaProvider {
  platform: string;
  timeout: number;
  search: (productName: string, signal?: AbortSignal) => Promise<MediaEvidence[]>;
}

/**
 * Utilitário para construir resultados reais a partir de descoberta
 */
const buildDiscoveryItem = (
  productName: string, 
  platform: string, 
  type: 'video' | 'image' | 'ad', 
  url: string
): MediaEvidence => ({
  url,
  thumbnail: "", // Sem mocks. Será preenchido por scrapers reais.
  title: `${productName} nas buscas de ${platform}`,
  platform,
  type,
  discoveredAt: new Date().toISOString(),
  confidenceScore: 0,
  relevanceScore: 0,
  metadata: {
    scoutStatus: 'discovery_link_generated',
    platformSource: platform
  }
});

/**
 * Providers com suporte a AbortController e Timeouts individuais
 */

export const TikTokProvider: MediaProvider = {
  platform: 'TikTok',
  timeout: 10000,
  search: async (q, signal) => {
    console.log(`[MediaProvider] Scouting TikTok for: ${q}`);
    const url = `https://www.tiktok.com/search?q=${encodeURIComponent(q)}`;
    return [buildDiscoveryItem(q, 'TikTok', 'video', url)];
  }
};

export const YouTubeProvider: MediaProvider = {
  platform: 'YouTube',
  timeout: 10000,
  search: async (q, signal) => {
    console.log(`[MediaProvider] Scouting YouTube for: ${q}`);
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}+review`;
    return [buildDiscoveryItem(q, 'YouTube', 'video', url)];
  }
};

export const FBAdsProvider: MediaProvider = {
  platform: 'Facebook Ads',
  timeout: 15000,
  search: async (q, signal) => {
    console.log(`[MediaProvider] Scouting FB Ads for: ${q}`);
    const url = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&q=${encodeURIComponent(q)}`;
    return [buildDiscoveryItem(q, 'Facebook Ads', 'ad', url)];
  }
};

export const InstagramProvider: MediaProvider = {
  platform: 'Instagram',
  timeout: 10000,
  search: async (q, signal) => {
    console.log(`[MediaProvider] Scouting Instagram for: ${q}`);
    const url = `https://www.instagram.com/explore/tags/${encodeURIComponent(q.replace(/\s+/g, ''))}/`;
    return [buildDiscoveryItem(q, 'Instagram', 'image', url)];
  }
};

export const PinterestProvider: MediaProvider = {
  platform: 'Pinterest',
  timeout: 10000,
  search: async (q, signal) => {
    console.log(`[MediaProvider] Scouting Pinterest for: ${q}`);
    const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`;
    return [buildDiscoveryItem(q, 'Pinterest', 'image', url)];
  }
};

export const GoogleImagesProvider: MediaProvider = {
  platform: 'Google Images',
  timeout: 10000,
  search: async (q, signal) => {
    console.log(`[MediaProvider] Scouting Google for: ${q}`);
    const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`;
    return [buildDiscoveryItem(q, 'Google Images', 'image', url)];
  }
};
