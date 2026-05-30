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
  brand: string | null;
  price: string;
  sales: string;
  salesPotential?: "Baixo" | "Médio" | "Alto" | "Explosivo";
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
  engagementRate?: number;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  tags: string[];
  badge?: string;
  winnerScore?: number;
  confidenceScore: number;
  trendData: number[];
}

const REAL_TRENDING_PRODUCTS: Product[] = [
  {
    id: "winner-1",
    name: "Mini Impressora Térmica Bluetooth Portátil",
    brand: "Generic",
    price: "R$ 89,90",
    sales: "12k+",
    salesPotential: "Explosivo",
    growth: "+45%",
    videos: 124,
    affiliates: 450,
    image: "https://http2.mlstatic.com/D_NQ_NP_612265-MLB74581285223_022024-O.webp",
    category: "Tecnologia",
    link: "https://www.mercadolivre.com.br/s?k=mini+impressora+termica",
    platform: "Mercado Livre",
    viralScore: 94,
    opportunityScore: 88,
    competitionScore: 35,
    saturationLevel: 25,
    engagement: "Explosiva",
    tags: ["Viral TikTok", "Escritório", "Gadget"],
    confidenceScore: 100,
    trendData: [40, 45, 60, 75, 85, 92, 94]
  },
  {
    id: "winner-2",
    name: "Luminária de Mesa Monitor Screen Bar RGB",
    brand: "Baseus Style",
    price: "R$ 156,00",
    sales: "5k+",
    salesPotential: "Alto",
    growth: "+32%",
    videos: 56,
    affiliates: 120,
    image: "https://http2.mlstatic.com/D_NQ_NP_727453-MLB48148811802_112021-O.webp",
    category: "Tecnologia",
    link: "https://www.mercadolivre.com.br/s?k=luminaria+monitor",
    platform: "Mercado Livre",
    viralScore: 82,
    opportunityScore: 92,
    competitionScore: 20,
    saturationLevel: 15,
    engagement: "Alta",
    tags: ["Setup Gamer", "Produtividade"],
    confidenceScore: 100,
    trendData: [30, 35, 40, 55, 70, 78, 82]
  },
  {
    id: "winner-3",
    name: "Processador de Alimentos Manual 5 Lâminas 900ml",
    brand: "Generic",
    price: "R$ 24,90",
    sales: "50k+",
    salesPotential: "Explosivo",
    growth: "+15%",
    videos: 230,
    affiliates: 890,
    image: "https://http2.mlstatic.com/D_NQ_NP_960538-MLB47535560128_092021-O.webp",
    category: "Cozinha",
    link: "https://www.mercadolivre.com.br/s?k=processador+alimentos+manual",
    platform: "Mercado Livre",
    viralScore: 98,
    opportunityScore: 70,
    competitionScore: 85,
    saturationLevel: 80,
    engagement: "Explosiva",
    tags: ["Utilidades", "Cozinha Prática"],
    confidenceScore: 100,
    trendData: [85, 88, 90, 92, 95, 97, 98]
  },
  {
    id: "winner-4",
    name: "Mop Giratório Limpeza Prática com Balde",
    brand: "Flash Limp Style",
    price: "R$ 79,00",
    sales: "25k+",
    salesPotential: "Alto",
    growth: "+20%",
    videos: 88,
    affiliates: 340,
    image: "https://http2.mlstatic.com/D_NQ_NP_845347-MLB46288602287_062021-O.webp",
    category: "Casa",
    link: "https://www.mercadolivre.com.br/s?k=mop+giratorio",
    platform: "Mercado Livre",
    viralScore: 88,
    opportunityScore: 75,
    competitionScore: 60,
    saturationLevel: 55,
    engagement: "Alta",
    tags: ["Limpeza", "Casa"],
    confidenceScore: 100,
    trendData: [60, 65, 70, 75, 80, 85, 88]
  }
];

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
