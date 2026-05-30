import { Platform, Product } from "./productService";
import { MercadoLivreProvider } from "./platforms/mercadoLivreProvider";
import { TikTokShopProvider } from "./platforms/tiktokShopProvider";
import { AmazonProvider } from "./platforms/amazonProvider";
import { AliExpressProvider } from "./platforms/aliExpressProvider";
import { ShopeeProvider } from "./platforms/shopeeProvider";

export interface SearchOptions {
  query?: string;
  category?: string;
  platforms?: Platform[];
  minPrice?: number;
  maxPrice?: number;
}

export const SearchService = {
  search: async (options: SearchOptions): Promise<Product[]> => {
    const { query = "", category, platforms } = options;
    
    const targetPlatforms = platforms && platforms.length > 0 
      ? platforms 
      : ["TikTok Shop", "Amazon", "AliExpress", "Mercado Livre", "Shopee"] as Platform[];

    const results: Product[] = [];
    
    // Parallel fetching for performance
    const platformPromises = targetPlatforms.map(platform => 
      fetchFromPlatform(platform, query, category)
    );
    
    const platformResults = await Promise.all(platformPromises);
    platformResults.forEach(res => results.push(...res));
    
    return results;
  }
};

async function fetchFromPlatform(platform: Platform, query: string, category?: string): Promise<Product[]> {
  try {
    switch (platform) {
      case "Mercado Livre":
        return await MercadoLivreProvider.search(query);
      case "TikTok Shop":
        return await TikTokShopProvider.search(query);
      case "Shopee":
        return await ShopeeProvider.search(query);
      case "Amazon":
        return await AmazonProvider.search(query);
      case "AliExpress":
        return await AliExpressProvider.search(query);
      default:
        return [];
    }
  } catch (error) {
    console.warn(`Erro ao buscar em ${platform}.`, error);
    return [];
  }
}
