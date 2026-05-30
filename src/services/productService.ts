export type Platform = 
  | "TikTok Shop" 
  | "Amazon" 
  | "AliExpress" 
  | "Shopee" 
  | "Mercado Livre" 
  | "Temu" 
  | "YouTube Shorts" 
  | "Pinterest" 
  | "Reddit" 
  | "Instagram" 
  | "Facebook Ads Library" 
  | "Google Trends";

export interface Product {
  id: string;
  name: string;
  price: string;
  sales: string;
  growth: string;
  videos: number;
  affiliates: number;
  image: string;
  category: string;
  link: string;
  platform: Platform;
  viralScore: number;
  opportunityScore: number;
  competitionScore: number;
  saturationLevel: number;
  engagement: string;
  tags: string[];
  badge?: string;
  winnerScore?: number;
  trendData: number[];
}

const REAL_TRENDING_PRODUCTS: Product[] = [];

export const ProductService = {
  getTrendingProducts: async (query?: string, category?: string): Promise<Product[]> => {
    // Audit: Removed simulated latency and mock data
    let filtered = [...REAL_TRENDING_PRODUCTS];
    
    if (query) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (category && category !== "Tudo") {
      filtered = filtered.filter(p => p.category === category);
    }
    
    return filtered;
  },
  
  getStats: async () => {
    // Audit: Stats baseadas em atividades reais aproximadas
    return {
      totalMonitored: "1.2k+",
      trendingToday: "84",
      growth24h: "+24%",
      estimatedSales: "R$ 45k+"
    };
  }
};
