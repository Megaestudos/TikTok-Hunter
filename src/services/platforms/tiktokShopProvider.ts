import { Product } from "../productService";
import { ProductExtractorService } from "../utils/productExtractor";

const APIFY_TOKEN = process.env.APIFY_TOKEN;
const CACHE_TTL = 1000 * 60 * 15; // 15 minutos
const MAX_CACHE_SIZE = 50;

/**
 * Interface para Tipagem Segura do Apify
 */
interface TiktokRawItem {
  id: string;
  text: string;
  playCount: number;
  diggCount: number;
  shareCount: number;
  commentCount: number;
  webVideoUrl: string;
  videoMeta?: { coverUrl: string };
  covers?: { origin: string };
  authorMeta?: { name: string; verified: boolean };
}

const ttCache = new Map<string, { data: Product[], timestamp: number }>();

/**
 * Limpa o cache para evitar estouro de memória
 */
function pruneCache() {
  if (ttCache.size > MAX_CACHE_SIZE) {
    const oldestKey = Array.from(ttCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
    ttCache.delete(oldestKey);
  }
}

/**
 * Sanitização robusta de métricas
 */
const sanitize = (val: any): number => {
  const n = parseInt(val);
  return isNaN(n) || n < 0 ? 0 : n;
};

/**
 * Gera uma curva de tendência baseada no engajamento real
 */
function generateTrendFromMetrics(views: number, engagement: number): number[] {
  const trend: number[] = [];
  const base = Math.min(100, (views / 2000000) * 50 + engagement * 200);
  for (let i = 0; i < 7; i++) {
    const growth = base + (i * 2); // Crescimento linear simples
    trend.push(Math.min(100, Math.max(10, Math.floor(growth))));
  }
  return trend;
}

export const TikTokShopProvider = {
  search: async (query: string): Promise<Product[]> => {
    // 1. Verificação de Cache
    const cached = ttCache.get(query);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    if (!APIFY_TOKEN) {
       console.error("[TikTokShopProvider] APIFY_TOKEN Ausente.");
       throw new Error("Missing APIFY_TOKEN");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); 

    try {
      const response = await fetch(
        `https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            searchQueries: [query],
            hashtags: ["tiktokshop", "viralproduct"],
            resultsPerPage: 20,
            shouldDownloadVideos: false,
            shouldDownloadCovers: true
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeout);
      if (!response.ok) throw new Error(`Apify Error: ${response.status}`);

      const rawItems: TiktokRawItem[] = await response.json();
      
      // Cache local de extração para performance por sessão
      const extractorCache = new Map<string, string>();
      const getProductName = (text: string) => {
        if (!extractorCache.has(text)) extractorCache.set(text, ProductExtractorService.extract(text));
        return extractorCache.get(text)!;
      };

      // 2. Consolidação de Itens
      const groups = new Map<string, TiktokRawItem[]>();
      rawItems.forEach(item => {
        const name = getProductName(item.text);
        if (name === "Produto Viral") return;
        const key = ProductExtractorService.getFingerprint(name);
        groups.set(key, [...(groups.get(key) || []), item]);
      });

      // 3. Processamento de Produtos Consolidados
      const products: Product[] = Array.from(groups.values()).map(items => {
        // Seleciona o melhor item (relevância: views + likes)
        const bestItem = items.sort((a, b) => 
          (sanitize(b.playCount) + sanitize(b.diggCount)) - (sanitize(a.playCount) + sanitize(a.diggCount))
        )[0];

        const totalViews = items.reduce((acc, i) => acc + sanitize(i.playCount), 0);
        const totalLikes = items.reduce((acc, i) => acc + sanitize(i.diggCount), 0);
        const totalShares = items.reduce((acc, i) => acc + sanitize(i.shareCount), 0);
        const totalComments = items.reduce((acc, i) => acc + sanitize(i.commentCount), 0);
        
        const engRate = totalViews > 0 ? (totalLikes + totalShares + totalComments) / totalViews : 0;
        const prodName = getProductName(bestItem.text);
        const extractorScore = ProductExtractorService.getConfidenceScore(prodName);

        // Score de Confiança Avançado
        let confidence = Math.floor((extractorScore * 0.6) + (items.length > 1 ? 30 : 0) + (bestItem.authorMeta?.verified ? 10 : 0));
        confidence = Math.min(100, confidence);

        // Métricas de Sucesso
        const viral = Math.min(100, Math.floor((totalViews / (800000 * items.length)) * 70 + (engRate * 400)));
        // Opportunity Score com amortecimento (Damping)
        const opportunity = Math.min(100, Math.floor((engRate * 500) + (Math.log10(totalShares + 1) * 10)));
        
        const winner = Math.min(100, Math.floor((viral * 0.3) + (opportunity * 0.4) + (confidence * 0.3)));
        const growth = Math.min(500, Math.floor(engRate * 1000));

        return {
          id: `tt-hard-${bestItem.id}`,
          name: prodName,
          price: "R$ ---", 
          sales: totalViews > 1000000 ? "Explosivo" : "Viral",
          growth: `+${growth}%`,
          videos: items.length,
          affiliates: Math.floor(totalShares / 500),
          image: bestItem.videoMeta?.coverUrl || bestItem.covers?.origin || "/images/no-product.png",
          category: ProductExtractorService.detectCategory(prodName),
          link: bestItem.webVideoUrl,
          platform: "TikTok Shop",
          viralScore: viral,
          opportunityScore: opportunity,
          competitionScore: Math.max(20, Math.min(100, 100 - (items.length * 10))),
          saturationLevel: Math.floor((items.length / Math.max(1, rawItems.length)) * 100), // Estimativa local baseado no dataset
          engagement: engRate > 0.05 ? "Explosiva" : "Alta",
          tags: ["TikTok Shop", ProductExtractorService.detectBrandAndModel(prodName).brand],
          trendData: generateTrendFromMetrics(totalViews, engRate),
          badge: winner > 85 ? "Explodindo" : (opportunity > 80 ? "Oportunidade" : undefined),
          winnerScore: winner,
          confidenceScore: confidence
        };
      });

      // 4. Ordenação e Finalização
      products.sort((a, b) => (b.winnerScore || 0) - (a.winnerScore || 0));
      
      pruneCache();
      ttCache.set(query, { data: products, timestamp: Date.now() });

      return products;
    } catch (error) {
      clearTimeout(timeout);
      console.error("[TikTokShopProvider] Critical Error:", error);
      throw error;
    }
  }
};
