"use client";

import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { AIInsight } from "@/components/AIInsight";
import { Search, Zap, Loader2, TrendingUp, Sparkles, Play } from "lucide-react";
import { motion } from "framer-motion";
import { TrendsChart } from "@/components/TrendsChart";
import { useState, useEffect } from "react";
import { ProductService } from "@/services/productService";
import { TikTokService, TikTokVideo } from "@/services/tiktokService";
import { TrendCard } from "@/components/TrendCard";

export default function Home() {
  const [stats, setStats] = useState<any>(null);
  const [trendingVideos, setTrendingVideos] = useState<TikTokVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, videosData] = await Promise.all([
          ProductService.getStats(),
          TikTokService.getTrendingVideos()
        ]);
        setStats(statsData);
        setTrendingVideos(videosData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-background selection:bg-primary/30">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl md:text-4xl font-bold font-space-grotesk tracking-tight flex items-center gap-2">
              Dashboard <Sparkles className="text-primary" size={24} />
            </h1>
            <p className="text-muted text-sm mt-1">Dados reais do TikTok Shop monitorados via Apify.</p>
          </motion.div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Buscar produtos ou nichos..." 
                className="bg-card border border-card-border rounded-full py-2.5 pl-10 pr-4 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm backdrop-blur-md"
              />
            </div>
            <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-premium hover:scale-105 active:scale-95 flex items-center gap-2 text-nowrap">
              <Zap size={16} fill="currentColor" /> Novo Alerta
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 glass animate-pulse rounded-3xl" />
            ))
          ) : (
            <>
              <StatCard title="Vídeos Analisados" value={stats?.totalMonitored || "0"} change="+18%" />
              <StatCard title="Trends em Alta" value={stats?.trendingToday || "0"} change="+34.2%" />
              <StatCard title="Alcance Viral" value={stats?.growth24h || "0%"} change="+12.1%" />
              <StatCard title="Conversão Est." value={stats?.estimatedSales || "R$ 0"} change="+15.8%" />
            </>
          )}
        </div>

        {/* main grid section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Trends Chart Area */}
          <div className="lg:col-span-2 glass rounded-3xl p-8 border border-card-border overflow-hidden relative">
            <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 blur-[60px] rounded-full" />
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-bold text-xl font-space-grotesk flex items-center gap-2">
                  <TrendingUp className="text-primary" size={20} />
                  Curva de Viralização
                </h2>
                <p className="text-xs text-muted mt-1">Interações e propagação de conteúdos virais</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-white/5 px-3 py-1 rounded-lg text-[10px] font-bold border border-white/5 hover:border-white/10 transition-colors uppercase tracking-widest text-muted hover:text-white">7 Dias</button>
                <button className="bg-primary/20 px-3 py-1 rounded-lg text-[10px] font-bold border border-primary/20 transition-colors uppercase tracking-widest text-primary">30 Dias</button>
              </div>
            </div>
            
            {/* Real Chart */}
            <div className="h-72 w-full mt-4">
              <TrendsChart />
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="glass rounded-3xl p-8 border border-card-border grow">
              <div className="flex items-center gap-2 mb-8">
                 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 </div>
                 <h2 className="font-bold text-lg font-space-grotesk tracking-tight">Análise Preditiva</h2>
              </div>
              
              <div className="space-y-4">
                <AIInsight text={`Hashtag #${trendingVideos[0]?.badges?.[0] || 'viral'} cresceu 28% na última hora.`} type="burst" delay={0.1} />
                <AIInsight text="Nicho de Beleza Hacks com baixa saturação no Brasil." type="opportunity" delay={0.2} />
                <AIInsight text={`Vídeo de @${trendingVideos[0]?.author || 'user'} está gerando 15k views/min.`} type="potencial" delay={0.3} />
                <AIInsight text="Aviso: Alta saturação detectada em nichos de 'Kitchen Gadgets'." type="alert" delay={0.4} />
              </div>

              <button className="w-full mt-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold uppercase tracking-widest transition-all">
                Ver Relatório Completo
              </button>
            </div>
          </div>
        </div>

        {/* NEW: Live Trend Feed Section */}
        <section className="mt-12">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-space-grotesk flex items-center gap-3">
                 <div className="p-2 rounded-xl bg-primary/20"><Play className="text-primary fill-primary" size={20} /></div>
                 Feed de Tendências Live
              </h2>
              <button className="text-sm font-bold text-primary hover:underline transition-all">Ver todos</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[9/16] glass animate-pulse rounded-[32px]" />
                ))
              ) : (
                trendingVideos.slice(0, 3).map((video) => (
                   <TrendCard key={video.id} {...video} />
                ))
              )}
           </div>
        </section>
      </main>
    </div>
  );
}
