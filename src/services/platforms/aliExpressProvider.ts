import { Product } from "../productService";

export const AliExpressProvider = {
  search: async (query: string): Promise<Product[]> => {
    try {
      // Audit: AliExpress requires specialized scrapers or API for production.
      // Returning empty until Enterprise Scraper/API is integrated.
      return [];
    } catch (error) {
      console.error("Erro no AliExpress Provider:", error);
      return [];
    }
  }
};
