import { Product } from "./productService";

const APIFY_TOKEN = process.env.APIFY_TOKEN;
const ACTOR_ID = "clockworks/free-tiktok-scraper";

export interface TikTokVideo {
  id: string;
  url: string;
  text: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  author: string;
  createTime: number;
  trendScore: number;
  coverImage: string;
}

// Simple in-memory cache
let videoCache: { data: any[]; timestamp: number } | null = null;
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

export const TikTokService = {
  getTrendingVideos: async (): Promise<TikTokVideo[]> => {
    // Return cache if valid
    if (videoCache && Date.now() - videoCache.timestamp < CACHE_DURATION) {
      return videoCache.data;
    }

    if (!APIFY_TOKEN) {
      console.warn("APIFY_TOKEN não configurado. Usando dados mockados.");
      return getMockVideos();
    }

    try {
      const response = await fetch(
        `https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hashtags: ["tiktokmademebuyit", "amazonfinds", "viralproducts", "skincare", "beautyhacks"],
            resultsPerPage: 10,
            profileScrapeSections: ["videos"],
            profileSorting: "popular"
          }),
        }
      );

      if (!response.ok) throw new Error("Falha ao buscar dados do Apify");

      const items = await response.json();
      const mappedData = items.map((item: any) => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        url: item.webVideoUrl,
        text: item.text,
        views: item.playCount || 0,
        likes: item.diggCount || 0,
        shares: item.shareCount || 0,
        comments: item.commentCount || 0,
        author: item.authorMeta?.uniqueId || "tiktok_user",
        createTime: item.createTime,
        coverImage: item.videoMeta?.coverUrl || item.covers?.origin || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60",
        trendScore: calculateTrendScore(item.playCount, item.diggCount, item.shareCount)
      }));

      videoCache = { data: mappedData, timestamp: Date.now() };
      return mappedData;
    } catch (error) {
      console.error("Erro na integração com Apify:", error);
      return getMockVideos();
    }
  }
};

function calculateTrendScore(views: number, likes: number, shares: number): number {
  if (!views) return 0;
  // Pesos para o score de tendência
  const engagementRate = ((likes + shares * 2) / views) * 100;
  const score = Math.min(100, Math.floor(engagementRate * 5));
  return score;
}

function getMockVideos(): TikTokVideo[] {
  return [
    {
      id: "mock1",
      url: "https://tiktok.com",
      text: "Isso mudou minha vida! #skincare #beautyhacks",
      views: 1200000,
      likes: 85000,
      shares: 12000,
      comments: 450,
      author: "beauty_guru",
      createTime: Date.now(),
      trendScore: 92,
      coverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "mock2",
      url: "https://tiktok.com",
      text: "Melhor achado da Amazon de 2024! #amazonfinds",
      views: 850000,
      likes: 42000,
      shares: 8000,
      comments: 200,
      author: "gadget_lover",
      createTime: Date.now(),
      trendScore: 85,
      coverImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60"
    }
  ];
}
