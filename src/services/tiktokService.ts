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
  detectedProduct?: string;
  productUrl?: string;
  badges?: string[];
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

    if (!APIFY_TOKEN || APIFY_TOKEN === "seu_token_aqui") {
      console.warn("APIFY_TOKEN não configurado. Usando dados mockados.");
      const mock = getMockVideos();
      videoCache = { data: mock, timestamp: Date.now() };
      return mock;
    }

    try {
      const response = await fetch(
        `https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hashtags: ["tiktokmademebuyit", "amazonfinds", "viralproducts", "skincare", "beautyhacks"],
            resultsPerPage: 12,
            profileScrapeSections: ["videos"],
            profileSorting: "popular"
          }),
        }
      );

      if (!response.ok) throw new Error("Falha ao buscar dados do Apify");

      const items = await response.json();
      const mappedData = items.map((item: any) => {
        const views = item.playCount || 0;
        const likes = item.diggCount || 0;
        const shares = item.shareCount || 0;
        const text = item.text || "";
        const detectedProduct = detectProductName(text);
        
        return {
          id: item.id || Math.random().toString(36).substr(2, 9),
          url: item.webVideoUrl,
          text: text,
          views: views,
          likes: likes,
          shares: shares,
          comments: item.commentCount || 0,
          author: item.authorMeta?.uniqueId || "tiktok_user",
          createTime: item.createTime,
          coverImage: item.videoMeta?.coverUrl || item.covers?.origin || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60",
          trendScore: calculateTrendScore(views, likes, shares),
          detectedProduct: detectedProduct,
          productUrl: `https://www.amazon.com/s?k=${encodeURIComponent(detectedProduct)}`,
          badges: assignBadges(views, likes, shares)
        };
      });

      videoCache = { data: mappedData, timestamp: Date.now() };
      return mappedData;
    } catch (error) {
      console.error("Erro na integração com Apify:", error);
      return getMockVideos();
    }
  }
};

function detectProductName(text: string): string {
  // Simulação de IA para extração de produto
  const commonProducts = [
    "Projetor", "Luminária", "Escova", "Fone", "Umidificador", "Liquidificador", 
    "Sérum", "Massageador", "Teclado", "Câmera", "Mochila", "Tênis", "Garrafa"
  ];
  
  const found = commonProducts.find(p => text.toLowerCase().includes(p.toLowerCase()));
  if (found) return found;
  
  // Se não achar na lista, tenta pegar a primeira palavra após o #
  const match = text.match(/#(\w+)/);
  return match ? match[1].charAt(0).toUpperCase() + match[1].slice(1) : "Produto Viral";
}

function assignBadges(views: number, likes: number, shares: number): string[] {
  const badges = [];
  if (views > 1000000) badges.push("Trending");
  if (likes / views > 0.08) badges.push("High Growth");
  if (shares > 5000) badges.push("Low Competition"); // Simulação
  return badges.slice(0, 2);
}

function calculateTrendScore(views: number, likes: number, shares: number): number {
  if (!views) return 0;
  const engagementRate = ((likes + shares * 2) / views) * 100;
  return Math.min(100, Math.floor(engagementRate * 5 + (views > 100000 ? 20 : 0)));
}

function getMockVideos(): TikTokVideo[] {
  return [
    {
      id: "mock1",
      url: "https://tiktok.com",
      text: "Esse mini projetor 4K é insano! #projetor #cinemaemcasa",
      views: 2400000,
      likes: 185000,
      shares: 42000,
      comments: 1240,
      author: "tech_review",
      createTime: Date.now(),
      trendScore: 98,
      coverImage: "https://images.unsplash.com/photo-1535016120720-40c646bebbdc?w=800&auto=format&fit=crop&q=60",
      detectedProduct: "Mini Projetor 4K",
      productUrl: "https://www.amazon.com/s?k=mini+projector+4k",
      badges: ["Trending", "High Growth"]
    },
    {
      id: "mock2",
      url: "https://tiktok.com",
      text: "Melhor luminária magnética que já vi #amazonfinds",
      views: 850000,
      likes: 42000,
      shares: 8000,
      comments: 200,
      author: "decor_home",
      createTime: Date.now(),
      trendScore: 85,
      coverImage: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800&auto=format&fit=crop&q=60",
      detectedProduct: "Luminária Magnética",
      productUrl: "https://www.amazon.com/s?k=magnetic+lamp",
      badges: ["High Growth"]
    },
    {
      id: "mock3",
      url: "https://tiktok.com",
      text: "O segredo para uma pele perfeita #skincare #beauty",
      views: 1500000,
      likes: 95000,
      shares: 15000,
      comments: 800,
      author: "beauty_guru",
      createTime: Date.now(),
      trendScore: 94,
      coverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=800&auto=format&fit=crop&q=60",
      detectedProduct: "Sérum Skincare",
      productUrl: "https://www.amazon.com/s?k=skincare+serum",
      badges: ["Trending", "Low Competition"]
    }
  ];
}
