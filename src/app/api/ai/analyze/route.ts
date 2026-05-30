import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY não configurada no servidor." }, { status: 500 });
  }

  try {
    const { productName, productCategory } = await req.json();

    if (!productName || !productCategory) {
      return NextResponse.json({ error: "Dados do produto ausentes." }, { status: 400 });
    }

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
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return NextResponse.json(JSON.parse(jsonMatch[0]));
    }
    
    throw new Error("JSON não encontrado na resposta da IA");
  } catch (error: any) {
    console.error("Erro na API de IA:", error);
    return NextResponse.json({ error: error.message || "Falha na análise de IA" }, { status: 500 });
  }
}
