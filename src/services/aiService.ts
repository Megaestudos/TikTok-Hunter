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
    if (!API_KEY || API_KEY.includes("AIza")) { // Check for real key pattern
       // If it looks like a valid key prefix, try to use it
    } else {
       return getMockAIAnalysis(productName);
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        Analise o seguinte produto para dropshipping/e-commerce:
        Nome: ${productName}
        Categoria: ${productCategory}
        
        Gere os seguintes itens em formato JSON:
        1. headline: Uma headline matadora e chamativa.
        2. shortCopy: Uma copy curta para anúncio (máximo 150 caracteres).
        3. longCopy: Uma copy longa persuasiva ouvindo o método AIDA.
        4. ugcScript: Um roteiro para um vídeo de conteúdo gerado pelo usuário (UGC).
        5. videoScript: Um roteiro para vídeo de vendas/anúncio.
        6. targetAudience: Descrição detalhada do público alvo (idade, dores, desejos).
        7. adInterests: Uma lista de 5 interesses para segmentação no Facebook/Instagram Ads.
        8. viralPotential: Nota de 0 a 100 para o potencial viral.
        9. sellingDifficulty: Nível de dificuldade de venda (Fácil, Média, Difícil).
        
        Responda APENAS o JSON.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error("JSON not found in response");
      } catch (e) {
        console.error("Falha ao parsear resposta da IA:", e);
        return getMockAIAnalysis(productName);
      }
    } catch (error) {
      console.error("Erro no serviço de IA:", error);
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
