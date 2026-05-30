"use client";

import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { AIInsight } from "@/components/AIInsight";
import { Search, Zap, Loader2, TrendingUp, Sparkles, Play, Filter, Box } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendsChart } from "@/components/TrendsChart";
import { useState, useEffect } from "react";
import { ProductService, Product, Platform } from "@/services/productService";
import { TikTokService, TikTokVideo } from "@/services/tiktokService";
import { SearchService } from "@/services/searchService";
import { MediaSearchService, MediaEvidence } from "@/services/media/mediaSearchService";
import { MediaAnalyzerService, ValidationReport } from "@/services/media/mediaAnalyzerService";
import { AIService, AIAnalysisResult } from "@/services/aiService";
import { ProductCorrelationService, ConsolidatedProduct, TrendScore } from "@/services/productCorrelationService";
import { TrendCard } from "@/components/TrendCard";
import { ProductCard } from "@/components/ProductCard";
import { ProductEvidenceDrawer } from "@/components/ProductEvidenceDrawer";
import { MediaDrawer } from "@/components/MediaDrawer";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useQuery } from "@tanstack/react-query";
import { useStorage } from "@/services/storageService";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tudo");
  const [selectedTrend, setSelectedTrend] = useState<TrendScore | "Tudo">("Tudo");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["TikTok Shop", "Amazon", "AliExpress", "Mercado Livre", "Shopee"]);
  
  // Media Evidence State
  const [selectedProductForMedia, setSelectedProductForMedia] = useState<Product | null>(null);
  const [evidenceResults, setEvidenceResults] = useState<MediaEvidence[]>([]);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [isMediaLoading, setIsMediaLoading] = useState(false);

  // AI Analysis State
  const [analyzingProduct, setAnalyzingProduct] = useState<Product | null>(null);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  const { addSearch } = useStorage();

  // Queries
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => ProductService.getStats()
  });

  const { data: trendingVideos = [], isLoading: isVideosLoading } = useQuery({
    queryKey: ['trending-videos'],
    queryFn: () => TikTokService.getTrendingVideos()
  });

  const { data: winners = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['winners', searchQuery, selectedCategory, selectedPlatforms, selectedTrend],
    queryFn: async () => {
      // 1. Busca Bruta em todas as plataformas selecionadas
      // Audit: Se a query for vazia, usamos um termo de tendência padrão para popular o dashboard
      const effectiveQuery = searchQuery || "viral";
      
      const rawResults = await SearchService.search({ 
        query: effectiveQuery,
        platforms: selectedPlatforms
      });

      // 2. Correlação e Inteligência Cross-Platform
      let results = await ProductCorrelationService.correlate(rawResults);
      
      if (selectedCategory !== "Tudo") {
        results = results.filter(w => w.category === selectedCategory);
      }
      
      if (selectedTrend !== "Tudo") {
        results = (results as any).filter((w: any) => w.trendCategory === selectedTrend);
      }
      
      return results;
    }
  });

  const topWinners = winners.slice(0, 10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) addSearch(searchQuery);
  };

  const openMediaDrawer = async (product: Product) => {
    setSelectedProductForMedia(product);
    setIsMediaLoading(true);
    setEvidenceResults([]);
    setValidationReport(null);
    try {
      const { results: evidence } = await MediaSearchService.search(product.name);
      setEvidenceResults(evidence);
      
      const report = MediaAnalyzerService.analyze(product, evidence);
      setValidationReport(report);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMediaLoading(false);
    }
  };

  const startAIAnalysis = async (product: Product) => {
    setAnalyzingProduct(product);
    setAiResult(null);
    try {
      const result = await AIService.analyzeProduct(product.name, product.category);
      setAiResult(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-background selection:bg-primary/30 text-foreground">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 relative">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-1">
               <div className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded-md border border-primary/20">PRO VERSION</div>
               <span className="text-white/40 text-[10px] font-bold">V 2.0.6</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-space-grotesk tracking-tighter flex items-center gap-3 text-white">
              TikTok Hunter <div className="p-2 bg-primary rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.4)]"><Sparkles className="text-white" size={24} /></div>
            </h1>
            <p className="text-white/50 text-sm mt-3 max-w-md">Sua central definitiva de inteligência de produtos. Encontre virais em segundos.</p>
          </motion.div>

          <div className="flex flex-col gap-3">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="relative group flex-1 md:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="O que você quer vender hoje?" 
                  className="bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm backdrop-blur-xl text-white placeholder:text-white/20"
                />
              </div>
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white p-3.5 rounded-2xl transition-all shadow-premium hover:scale-105 active:scale-95"
              >
                <Zap size={20} fill="currentColor" />
              </button>
            </form>
          </div>
        </header>

        {/* Categories / Platforms Quick Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2 mr-2">
             <Filter size={14} className="text-primary" />
             <span className="text-[10px] font-bold text-white/40 uppercase mr-2 border-r border-white/10 pr-3">Filtros</span>
             {["Tudo", "Saúde", "Beleza", "Eletrônicos", "Moda"].map(cat => (
               <button 
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={cn(
                   "px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                   selectedCategory === cat ? "bg-primary text-white shadow-lg" : "text-white/40 hover:text-white hover:bg-white/5"
                 )}
               >
                 {cat}
               </button>
             ))}
          </div>

          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-2">
             <Zap size={14} className="text-primary" />
             <span className="text-[10px] font-bold text-primary/60 uppercase mr-2 border-r border-primary/20 pr-3">Inteligência</span>
             {["Tudo", "Emergente", "Explosivo", "Saturado"].map(trend => (
               <button 
                 key={trend}
                 onClick={() => setSelectedTrend(trend as any)}
                 className={cn(
                   "px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                   selectedTrend === trend ? "bg-primary text-white shadow-lg" : "text-primary/40 hover:text-primary hover:bg-primary/10"
                 )}
               >
                 {trend}
               </button>
             ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {isStatsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-white/5 animate-pulse rounded-3xl border border-white/10" />
            ))
          ) : (
            <>
              <StatCard title="Produtos Minerados" value={stats?.totalMonitored || "0"} change="+12% hoje" icon="Package" />
              <StatCard title="Oportunidades" value={stats?.trendingToday || "0"} change="+24.2%" icon="Zap" />
              <StatCard title="Taxa Viral" value={stats?.growth24h || "0%"} change="+8.1%" icon="TrendingUp" />
              <StatCard title="Alcance Est." value={stats?.estimatedSales || "R$ 0"} change="+15k" icon="Users" />
            </>
          )}
        </div>

        {/* Global Winners Ranking */}
        {topWinners.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <TrendingUp className="text-primary" size={24} />
                  Top 10 Global Winners
                </h2>
                <p className="text-white/40 text-xs mt-1">Os produtos com maior pontuação combinada em todas as plataformas</p>
              </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
              {topWinners.map((winner, index) => (
                <div key={winner.id} className="min-w-[320px] relative">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-premium z-40 border-4 border-background italic">
                    #{index + 1}
                  </div>
                  <ProductCard 
                    product={winner} 
                    onSearchMedia={openMediaDrawer}
                    onAnalyze={startAIAnalysis}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Products Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Box className="text-primary" size={24} />
                Descobertas Recentes
              </h2>
              <p className="text-white/40 text-xs mt-1">Produtos detectados com inteligência cross-platform</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 text-[10px] font-bold transition-all flex items-center gap-2">
                <Filter size={14} />
                MAIS RECENTES
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isProductsLoading ? (
              Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              winners.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onSearchMedia={openMediaDrawer}
                  onAnalyze={startAIAnalysis}
                />
              ))
            )}
            
            {!isProductsLoading && winners.length === 0 && (
              <div className="col-span-full py-24 text-center">
                 <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-20">
                    <Search size={32} />
                 </div>
                 <h3 className="text-white/40 font-bold">Nenhum vencedor detectado para estes filtros.</h3>
                 <p className="text-white/20 text-xs mt-1">Tente mudar os filtros ou realizar uma nova busca.</p>
              </div>
            )}
          </div>
        </section>

        {/* Analytics Section (Original + Enhanced) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 glass rounded-3xl p-8 border border-white/10 overflow-hidden relative bg-[#0A0A0A]/40 backdrop-blur-3xl">
            <div className="absolute top-0 right-0 h-48 w-48 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h2 className="font-bold text-xl flex items-center gap-2 text-white">
                  <TrendingUp className="text-primary" size={20} />
                  Análise Macro de Mercado
                </h2>
                <p className="text-xs text-white/40 mt-1">Interações e propagação em todas as plataformas</p>
              </div>
            </div>
            
            <div className="h-72 w-full mt-4">
              <TrendsChart />
            </div>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/10 bg-[#0A0A0A]/40 backdrop-blur-3xl">
            <div className="flex items-center gap-2 mb-8">
               <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="text-primary animate-pulse" size={18} />
               </div>
               <h2 className="font-bold text-lg tracking-tight text-white">Market Insights IA</h2>
            </div>
            
            <div className="space-y-4">
              <AIInsight text="Forte tendência de 'Home Office Comfort' crescendo na Temu e Amazon." type="burst" delay={0.1} />
              <AIInsight text="Oportunidade: Nicho de 'Car Gadgets' com baixa saturação no Instagram Reels." type="opportunity" delay={0.2} />
              <AIInsight text="Alerta: Custos de ads subindo 15% no nicho de Beleza." type="alert" delay={0.3} />
              <AIInsight text="Público de 18-24 anos migrando buscas para o Pinterest." type="potencial" delay={0.4} />
            </div>

            <button className="w-full mt-8 py-4 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-widest transition-all">
              GERAR RELATÓRIO PDF
            </button>
          </div>
        </div>

        {/* Media Drawer Component */}
        <ProductEvidenceDrawer 
          isOpen={!!selectedProductForMedia}
          product={selectedProductForMedia}
          onClose={() => setSelectedProductForMedia(null)}
          evidence={evidenceResults}
          report={validationReport}
          isLoading={isMediaLoading}
        />

        {/* AI Analysis Drawer (Simplified implementation inside main page for speed) */}
        <AnimatePresence>
          {analyzingProduct && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setAnalyzingProduct(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150]"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#050505] border-t border-primary/30 z-[151] rounded-t-[40px] p-8 overflow-y-auto"
              >
                {!aiResult ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-6">
                    <div className="relative">
                      <div className="h-24 w-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto text-primary animate-pulse" size={40} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-black text-white mb-2">IA Analisando Oportunidade...</h3>
                      <p className="text-white/40 max-w-sm">O Gemini está gerando roteiros, copys e identificando o público-alvo ideal para este produto.</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-start mb-10">
                       <div>
                         <div className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full mb-3 inline-block">INTELIGÊNCIA GEMINI PRO</div>
                         <h2 className="text-4xl font-black text-white">{analyzingProduct.name}</h2>
                       </div>
                       <button onClick={() => setAnalyzingProduct(null)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all text-white/50">
                         <Loader2 size={24} />
                       </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-8">
                          <section>
                            <h4 className="text-primary font-black text-sm uppercase tracking-widest mb-4">Headline Sugerida</h4>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-xl font-bold text-white">
                              "{aiResult.headline}"
                            </div>
                          </section>

                          <section>
                            <h4 className="text-primary font-black text-sm uppercase tracking-widest mb-4">Público Alvo</h4>
                            <p className="text-white/70 leading-relaxed">{aiResult.targetAudience}</p>
                          </section>

                          <section>
                            <h4 className="text-primary font-black text-sm uppercase tracking-widest mb-4">Roteiro UGC (Influencer)</h4>
                            <pre className="p-6 bg-black/50 border border-white/10 rounded-3xl text-sm text-white/80 whitespace-pre-wrap font-sans">
                              {aiResult.ugcScript}
                            </pre>
                          </section>
                       </div>

                       <div className="space-y-8">
                          <section>
                            <h4 className="text-primary font-black text-sm uppercase tracking-widest mb-4">Copy Curta (Ads)</h4>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-sm text-white/80">
                              {aiResult.shortCopy}
                            </div>
                          </section>

                          <section>
                            <h4 className="text-primary font-black text-sm uppercase tracking-widest mb-4">Interesses Sugeridos</h4>
                            <div className="flex flex-wrap gap-2">
                               {aiResult.adInterests.map(interest => (
                                 <span key={interest} className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl font-bold text-xs">
                                   {interest}
                                 </span>
                               ))}
                            </div>
                          </section>

                          <section>
                            <h4 className="text-primary font-black text-sm uppercase tracking-widest mb-4">Análise Técnica</h4>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                 <span className="text-[10px] text-white/40 block mb-1">DIFICULDADE DE VENDA</span>
                                 <span className="font-bold text-white uppercase">{aiResult.sellingDifficulty}</span>
                               </div>
                               <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                 <span className="text-[10px] text-white/40 block mb-1">SCORE VIRAL IA</span>
                                 <span className="font-bold text-white">{aiResult.viralPotential}/100</span>
                               </div>
                            </div>
                          </section>
                       </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
