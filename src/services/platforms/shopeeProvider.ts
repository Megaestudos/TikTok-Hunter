import { Product } from "../productService";

export const ShopeeProvider = {
  search: async (query: string): Promise<Product[]> => {
    // Shopee uses an internal API endpoint for its search:
    // https://shopee.com.br/api/v4/search/search_items?keyword={query}&limit=10
    
    try {
      const response = await fetch(`https://shopee.com.br/api/v4/search/search_items?keyword=${encodeURIComponent(query)}&limit=40`, {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'referer': 'https://shopee.com.br/',
          'x-requested-with': 'XMLHttpRequest'
        }
      });
      
      // Shopee often has anti-bot protections, so we need a robust fallback
      if (!response.ok) {
        throw new Error("Shopee anti-bot or network error");
      }
      
      const data = await response.json();
      
      if (!data.items) throw new Error("No items found on Shopee");

      return data.items.map((item: any) => {
        const info = item.item_basic;
        return {
          id: `shope-${info.itemid}`,
          name: info.name,
          price: `R$ ${(info.price / 100000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          sales: info.historical_sold > 0 ? `${info.historical_sold}` : "0",
          growth: "0%",
          videos: 0,
          affiliates: 0,
          image: `https://down-br.img.susercontent.com/file/${info.image}`,
          category: "Marketplace",
          link: `https://shopee.com.br/${info.name.replace(/ /g, "-")}-i.${info.shopid}.${info.itemid}`,
          platform: "Shopee",
          viralScore: 0,
          opportunityScore: 0,
          competitionScore: 0,
          saturationLevel: 0,
          engagement: "N/A",
          tags: ["Shopee"],
          trendData: []
        };
      });
    } catch (error) {
      console.error("Erro no Shopee Provider:", error);
      throw error;
    }
  }
};
