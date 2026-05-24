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
  badge?: "Explodindo" | "Alta Conversão" | "Novo Viral" | "Oportunidade";
  trendData: number[];
}

const REAL_TRENDING_PRODUCTS: Product[] = [
  {
    id: "rt1",
    name: "15-Day Cleanse - Desintoxicação e Energia",
    price: "R$ 145,00",
    sales: "52.3k",
    growth: "+450%",
    videos: 1240,
    affiliates: 340,
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&auto=format&fit=crop&q=60",
    category: "Saúde",
    badge: "Explodindo",
    trendData: [10, 20, 15, 40, 80, 120, 150]
  },
  {
    id: "rt2",
    name: "Multi Collagen Peptides Powder - Colágeno Viral",
    price: "R$ 189,90",
    sales: "28.1k",
    growth: "+180%",
    videos: 850,
    affiliates: 120,
    image: "https://images.unsplash.com/photo-1550575110-59dd3448408a?w=800&auto=format&fit=crop&q=60",
    category: "Beleza",
    badge: "Alta Conversão",
    trendData: [50, 60, 55, 70, 90, 110, 130]
  },
  {
    id: "rt3",
    name: "COSRX Advanced Snail 96 Mucin Essence",
    price: "R$ 120,00",
    sales: "120k",
    growth: "+35%",
    videos: 4500,
    affiliates: 1200,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=60",
    category: "Beleza",
    trendData: [100, 95, 110, 105, 120, 115, 130]
  },
  {
    id: "rt4",
    name: "P.Louise Bad B*tch Energy Lip Duo",
    price: "R$ 210,00",
    sales: "12.5k",
    growth: "+820%",
    videos: 320,
    affiliates: 85,
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=60",
    category: "Beleza",
    badge: "Novo Viral",
    trendData: [5, 10, 25, 40, 80, 150, 300]
  },
  {
    id: "rt5",
    name: "Kenan Hijab Instantâneo - Esportivo Premium",
    price: "R$ 89,00",
    sales: "15.2k",
    growth: "+210%",
    videos: 640,
    affiliates: 92,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=60",
    category: "Moda",
    badge: "Oportunidade",
    trendData: [20, 25, 30, 45, 60, 85, 110]
  },
  {
    id: "rt6",
    name: "Saia Plissada Tenniscore Aesthetic",
    price: "R$ 134,00",
    sales: "8.4k",
    growth: "+145%",
    videos: 420,
    affiliates: 56,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=60",
    category: "Moda",
    trendData: [15, 20, 35, 50, 65, 80, 95]
  },
  {
    id: "rt7",
    name: "Mini Projetor Portátil Magcubic",
    price: "R$ 380,00",
    sales: "4.2k",
    growth: "+500%",
    videos: 120,
    affiliates: 45,
    image: "https://images.unsplash.com/photo-1535016120720-40c646bebbdc?w=800&auto=format&fit=crop&q=60",
    category: "Eletrônicos",
    badge: "Explodindo",
    trendData: [2, 5, 15, 30, 60, 120, 240]
  }
];

export const ProductService = {
  getTrendingProducts: async (query?: string, category?: string): Promise<Product[]> => {
    // Simulating API Latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
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
    return {
      totalMonitored: "2,481",
      trendingToday: "126",
      growth24h: "48.2%",
      estimatedSales: "R$ 842k"
    };
  }
};
