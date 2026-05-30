import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface AIAnalysisResult {
  headline: string;
  shortCopy: string;
  longCopy: string;
  ugcScript: string;
  videoScript: string;
  targetAudience: string;
  adInterests: string[];
  viralPotential: number;
  sellingDifficulty: string;
}

export const AIService = {
  analyzeProduct: async (productName: string, productCategory: string): Promise<AIAnalysisResult> => {
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, productCategory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro na análise de IA");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro no serviço de IA (Client):", error);
      return getMockAIAnalysis(productName);
    }
  }
};

function getMockAIAnalysis(productName: string): AIAnalysisResult {
  return {
    headline: `O Segredo para ${productName} Finalmente Revelado!`,
    shortCopy: `Garanta já o seu ${productName} com 50% de desconto! Estoque limitado. 🚀`,
    longCopy: `Você já sentiu que precisava de algo para facilitar o seu dia a dia? O ${productName} foi desenvolvido pensando exatamente em você. Com tecnologia de ponta e design inovador, ele resolve as suas maiores dores enquanto entrega um resultado profissional. Não perca a oportunidade de transformar sua rotina hoje mesmo.`,
    ugcScript: `Cena 1: Mostre o produto na caixa. "Gente, acabou de chegar meu ${productName}!" \nCena 2: Testando o produto. "Olha como é fácil de usar..." \nCena 3: Resultado final. "Sério, eu não vivo mais sem isso!"`,
    videoScript: `[00:00] Gancho visual forte usando o ${productName}. \n[00:05] Problema que o produto resolve. \n[00:15] Apresentação das funcionalidades. \n[00:25] Prova social e oferta. \n[00:30] Call to Action final.`,
    targetAudience: "Homens e mulheres de 25-45 anos, interessados em inovação, praticidade e soluções rápidas para problemas do cotidiano.",
    adInterests: ["Compras Online", "Gadgets", "Inovação", "Lifestyle", "Tecnologia"],
    viralPotential: 85,
    sellingDifficulty: "Média"
  };
}
