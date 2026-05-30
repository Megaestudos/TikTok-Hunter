import { Product } from "../productService";

// Simple memory cache
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes
const searchCache = new Map<string, { data: Product[], timestamp: number }>();

// Category mapping helper
const CATEGORY_MAP: Record<string, string> = {
  "MLB1051": "Celulares",
  "MLB1648": "Eletrônicos",
  "MLB1430": "Games",
  "MLB1144": "Casa e Cozinha",
  "MLB1276": "Beleza",
  "MLB1039": "Ferramentas",
  "MLB5672": "Acessórios",
  "MLB1403": "Alimentos",
  "MLB1071": "Pet Shop",
  "MLB1895": "Saúde",
  "MLB1176": "Carros e Peças",
};

export const MercadoLivreProvider = {
  search: async (query: string): Promise<Product[]> => {
    // Check Cache
    const cached = searchCache.get(query);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(
        `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=50`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeout);
      
      if (!response.ok) throw new Error(`Meli API error: ${response.status}`);
      
      const data = await response.json();
      const totalResults = data.paging?.total || 0;
      
      const products = data.results.map((item: any) => {
        const sold = item.sold_quantity || 0;
        const isOfficial = !!item.official_store_id;
        const isFreeShipping = item.shipping?.free_shipping;
        const price = item.price || 0;
        
        // --- IMAGE LOGIC ---
        let imageUrl = item.secure_thumbnail || item.thumbnail;
        if (imageUrl.includes("-I.jpg")) {
          imageUrl = imageUrl.replace("-I.jpg", "-O.jpg");
        } else if (item.thumbnail_id) {
          imageUrl = `https://http2.mlstatic.com/D_NQ_NP_${item.thumbnail_id}-O.webp`;
        }

        // --- CALCULATED METRICS ---
        
        // Viral Score: Baseado em vendas e relevância
        const viralScore = Math.min(100, Math.floor((sold / 200) * 60 + (isOfficial ? 30 : 10) + (item.listing_type_id === 'gold_pro' ? 10 : 0)));
        
        // Competition Score: Baseado no total de resultados da busca
        const competitionScore = Math.min(100, Math.floor((totalResults / 10000) * 100));
        
        // Opportunity Score: Inverso da competição + bônus de frete grátis e vendas
        const opportunityScore = Math.floor(
          ((100 - competitionScore) * 0.4) + 
          (Math.min(50, (sold / 100) * 50) * 0.4) + 
          (isFreeShipping ? 20 : 0)
        );

        // Saturation Level: Estimativa baseada em resultados massivos
        const saturationLevel = Math.min(100, Math.floor((totalResults / 50000) * 100));

        // Growth: Estimado pela competitividade do anúncio
        const growthVal = Math.floor((sold / (sold + 50)) * 40) + (item.listing_type_id === 'gold_pro' ? 15 : 5);

        // Trend Data: Curva estável baseada na performance de vendas
        const trendData = generateCoherentTrend(viralScore);

        return {
          id: `meli-${item.id}`,
          name: item.title,
          brand: isOfficial ? (item.official_store_name || "Official Store") : null,
          price: `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          sales: sold > 0 ? `${sold}` : "Início",
          growth: `+${growthVal}%`,
          videos: Math.floor(sold / 50), 
          affiliates: Math.floor(sold / 100) + (isOfficial ? 15 : 2),
          image: imageUrl,
          category: CATEGORY_MAP[item.category_id] || "Geral",
          link: item.permalink,
          platform: "Mercado Livre",
          viralScore,
          opportunityScore,
          competitionScore,
          saturationLevel,
          engagement: sold > 100 ? "Explosiva" : (sold > 20 ? "Alta" : "Em crescimento"),
          tags: [
            isOfficial ? "Loja Oficial" : "Vendedor",
            isFreeShipping ? "Frete Grátis" : "",
            item.condition === "new" ? "Novo" : "Usado"
          ].filter(Boolean),
          trendData,
          confidenceScore: 100, // Mercado Livre data is considered high confidence
          // Extra props
          stock: item.available_quantity
        };
      });

      // Save to cache
      searchCache.set(query, { data: products, timestamp: Date.now() });
      
      return products;
    } catch (error) {
      clearTimeout(timeout);
      console.error("Erro no Mercado Livre Provider:", error);
      throw error;
    }
  }
};

/**
 * Gera uma curva de tendência estável e crescente baseada no score viral
 */
function generateCoherentTrend(baseScore: number): number[] {
  const points = 7;
  const trend: number[] = [];
  let current = baseScore * 0.7;
  
  for (let i = 0; i < points; i++) {
    // Crescimento suave com pequena oscilação
    const noise = (Math.sin(i) * 5);
    current += (baseScore / 10) + noise;
    trend.push(Math.min(100, Math.max(0, Math.floor(current))));
  }
  
  return trend;
}
