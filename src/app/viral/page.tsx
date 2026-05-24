"use client";

import { Sidebar } from "@/components/Sidebar";
import { TrendCard } from "@/components/TrendCard";
import { Search, Filter, ArrowUpDown, Loader2, Play, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { TikTokVideo } from "@/services/tiktokService";

export default function ViralProducts() {
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tudo");

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/trending");
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Erro ao buscar vídeos:", error);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(v => 
    v.text.toLowerCase().includes(search.toLowerCase()) ||
    v.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl font-bold font-space-grotesk tracking-tight flex items-center gap-3">
                <Play className="text-primary fill-primary" size={28} />
                Tendências TikTok
              </h1>
              <p className="text-muted text-sm mt-1">Dados reais via Apify • Atualizado em tempo real.</p>
            </motion.div>
            
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Pesquisar hashtags ou users..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-card border border-card-border rounded-xl py-2 pl-10 pr-4 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
              <button className="p-2.5 rounded-xl border border-card-border bg-card/50 text-muted hover:text-foreground transition-all">
                <Filter size={20} />
              </button>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-4">
             {["#tiktokmademebuyit", "#amazonfinds", "#viralproducts", "#skincare", "#beautyhacks"].map(tag => (
               <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-primary uppercase tracking-wider whitespace-nowrap">
                  {tag}
               </span>
             ))}
          </div>
        </header>

        {/* Video Grid */}
        <div className="relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-3xl">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <Zap className="absolute inset-0 m-auto text-primary animate-pulse" size={24} />
                </div>
                <p className="text-sm font-bold text-primary uppercase tracking-[0.2em] animate-pulse">Escaneando TikTok Live...</p>
              </div>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video) => (
                  <TrendCard key={video.id} {...video} />
                ))
              ) : !loading && (
                <div className="col-span-full py-20 text-center glass rounded-3xl border border-dashed border-white/10">
                  <p className="text-muted text-lg">Nenhum vídeo viral detectado para esta busca.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
