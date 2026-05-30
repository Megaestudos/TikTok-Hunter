import { NextResponse } from "next/server";
import { WinnerService } from "@/services/winnerService";
import { Platform } from "@/services/productService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const platformsParam = searchParams.get("platforms");
  
  const platforms = platformsParam ? platformsParam.split(",") as Platform[] : undefined;

  try {
    const winners = await WinnerService.discoverWinners(query, platforms);
    
    // Cache de 15 minutos para evitar excesso de chamadas a APIs pagas
    return NextResponse.json(winners, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    });
  } catch (error: any) {
    console.error("Erro na API de Vencedores:", error);
    return NextResponse.json({ error: "Falha ao buscar vencedores reais" }, { status: 500 });
  }
}
