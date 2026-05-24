import { NextResponse } from "next/server";
import { TikTokService } from "@/services/tiktokService";

export async function GET() {
  try {
    const videos = await TikTokService.getTrendingVideos();
    
    // Configurar cache no Client Side (5 minutos)
    return NextResponse.json(videos, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("API Trending Error:", error);
    return NextResponse.json({ error: "Falha ao buscar tendências" }, { status: 500 });
  }
}
