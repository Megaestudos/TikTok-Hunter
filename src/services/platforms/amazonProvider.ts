import { Product } from "../productService";

export const AmazonProvider = {
  search: async (query: string): Promise<Product[]> => {
    try {
      // Audit: Amazon blocks simple fetches and requires proxies/API.
      // Returning empty until Enterprise Scraper or Rainforest API is integrated.
      return [];
    } catch (error) {
      console.error("Erro no Amazon Provider:", error);
      return [];
    }
  }
};
