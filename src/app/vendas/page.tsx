"use client";

import { Sidebar } from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, TrendingUp, DollarSign, ExternalLink, ArrowRight, Loader2, Sparkles, X, BarChart3, Target, Search, Users, Video, Play } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { ProductService, Product, Platform } from "@/services/productService";
import { WinnerService } from "@/services/winnerService";
import { ConsolidatedProduct } from "@/services/productCorrelationService";
import { AIService, AIAnalysisResult } from "@/services/aiService";
import { ProductEvidenceDrawer } from "@/components/ProductEvidenceDrawer";
import { MediaSearchService, MediaEvidence } from "@/services/media/mediaSearchService";
import { MediaAnalyzerService, ValidationReport } from "@/services/media/mediaAnalyzerService";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function BestSellers() {
  const [products, setProducts] = useState<ConsolidatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for Interactivity
  const [selectedProduct, setSelectedProduct] = useState<ConsolidatedProduct | null>(null);
  const [analyzingProduct, setAnalyzingProduct] = useState<ConsolidatedProduct | null>(null);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  
  // Media Evidence State
  const [selectedProductForMedia, setSelectedProductForMedia] = useState<Product | null>(null);
  const [evidenceResults, setEvidenceResults] = useState<MediaEvidence[]>([]);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [isMediaLoading, setIsMediaLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/search/winners");
        if (!response.ok) throw new Error("Falha na resposta da API");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar vencedores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const stats = useMemo(() => {
    if (products.length === 0) return { totalSales: "0", avgPrice: "0", totalRevenue: "0" };
    
    const totalSalesNum = products.reduce((acc, p) => acc + parseInt(p.sales?.replace(/[^0-9]/g, "") || "0"), 0);
    const avgPriceNum = products.reduce((acc, p) => acc + parseFloat(p.price?.replace(/[^0-9,.]/g, "").replace(",", ".") || "0"), 0) / products.length;
    
    const totalRevenueNum = products.reduce((acc, p) => {
      const price = parseFloat(p.price?.replace(/[^0-9,.]/g, "").replace(",", ".") || "0");
      const sales = parseInt(p.sales?.replace(/[^0-9]/g, "") || "0");
      return acc + (price * sales);
    }, 0);

    return {
      totalSales: totalSalesNum > 1000 ? `${(totalSalesNum/1000).toFixed(1)}k+` : totalSalesNum.toString(),
      avgPrice: `R$ ${avgPriceNum.toFixed(2).replace(".", ",")}`,
      totalRevenue: totalRevenueNum > 1000000 
        ? `R$ ${(totalRevenueNum/1000000).toFixed(1)}M` 
        : `R$ ${(totalRevenueNum/1000).toFixed(0)}k`
    };
  }, [products]);

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "Amazon": return "📦";
      case "TikTok Shop": return "🎵";
      case "AliExpress": return "🌏";
      case "Shopee": return "🛒";
      case "Mercado Livre": return "🤝";
      default: return "🌟";
    }
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

  const startAIAnalysis = async (product: ConsolidatedProduct) => {
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
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 relative">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
               <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-md border border-emerald-500/20 uppercase tracking-widest">Live Market Data</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-space-grotesk tracking-tighter text-white">Mais Vendidos</h1>
            <p className="text-white/40 text-sm mt-3 max-w-md">Análise profunda de volume, receita e maturidade de mercado.</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <SummaryCard icon={<ShoppingBag className="text-primary" />} title="Vendas Monitoradas" value={stats.totalSales} />
          <SummaryCard icon={<TrendingUp className="text-emerald-400" />} title="Ticket Médio" value={stats.avgPrice} />
          <SummaryCard icon={<DollarSign className="text-blue-400" />} title="Receita Estimada" value={stats.totalRevenue} />
        </div>

        <div className="glass-premium rounded-[32px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Produto</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-center">Preço</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-center">Vendas</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-center">Receita Est.</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array(8).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="p-8">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl" />
                            <div className="space-y-2">
                               <div className="w-32 h-3 bg-white/10 rounded-full" />
                               <div className="w-20 h-2 bg-white/5 rounded-full" />
                            </div>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  products.map((product) => {
                    const priceNum = parseFloat(product.price?.replace(/[^0-9,.]/g, "").replace(",", ".") || "0");
                    const salesNum = parseInt(product.sales?.replace(/[^0-9]/g, "") || "0");
                    const revenue = priceNum * salesNum;
                    
                    return (
                      <tr key={product.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-2xl">
                               <Image 
                                 src={product.image} 
                                 alt={product.name} 
                                 fill 
                                 className="object-cover group-hover:scale-110 transition-transform duration-700"
                               />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{product.name}</span>
                              <div className="flex items-center gap-3">
                                 <div className="flex -space-x-1">
                                    {product.platforms.map(p => (
                                      <div key={p} className="w-4 h-4 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-[8px]" title={p}>
                                        {getPlatformIcon(p)}
                                      </div>
                                    ))}
                                 </div>
                                 <div className="w-1 h-1 rounded-full bg-white/10" />
                                 <span className={cn(
                                   "text-[9px] font-black uppercase tracking-widest",
                                   product.trendCategory === "Explosivo" ? "text-emerald-400" : "text-primary"
                                 )}>{product.trendCategory}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-center">
                          <span className="text-sm font-black text-white/80 tabular-nums">{product.price}</span>
                        </td>
                        <td className="p-6 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-black text-emerald-400 tabular-nums">{product.sales}</span>
                            <span className="text-[10px] text-emerald-400/50 font-black uppercase tracking-tighter">Estimadas</span>
                          </div>
                        </td>
                        <td className="p-6 text-center">
                           <span className="text-base font-black text-primary drop-shadow-[0_0_10px_rgba(167,139,250,0.3)] tabular-nums">
                             R$ {revenue > 1000 ? `${(revenue/1000).toFixed(0)}k` : revenue.toFixed(0)}
                           </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <button 
                              onClick={() => openMediaDrawer(product)}
                              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                              title="Análise de Mídia"
                            >
                              <Search size={16} />
                            </button>
                            <button 
                              onClick={() => startAIAnalysis(product)}
                              className="px-5 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-premium hover:shadow-glow transition-all flex items-center gap-2"
                            >
                              Análise IA <ArrowRight size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            
            {!loading && products.length === 0 && (
               <div className="p-24 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 opacity-20">
                     <ShoppingBag size={40} />
                  </div>
                  <h3 className="text-white/40 font-bold text-lg">Nenhum dado de vendas disponível no momento.</h3>
                  <p className="text-white/20 text-xs mt-2">Nossos scouts estão minerando novas oportunidades.</p>
               </div>
            )}
          </div>
        </div>

        {/* Reusing Components for Premium Experience */}
        <ProductEvidenceDrawer 
          isOpen={!!selectedProductForMedia}
          product={selectedProductForMedia}
          onClose={() => setSelectedProductForMedia(null)}
          evidence={evidenceResults}
          report={validationReport}
          isLoading={isMediaLoading}
        />

        <AnimatePresence>
          {analyzingProduct && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setAnalyzingProduct(null)}
                className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[150]"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#030303] border-t border-primary/20 z-[151] rounded-t-[48px] p-8 md:p-12 overflow-y-auto"
              >
                {!aiResult ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-8">
                    <div className="relative">
                      <div className="h-32 w-32 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto text-primary animate-pulse" size={48} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-3xl font-black text-white mb-3">Gerando Estratégia Vencedora...</h3>
                      <p className="text-white/40 max-w-sm mx-auto">O Gemini Pro está analisando a concorrência e o comportamento do consumidor para este produto.</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-5xl mx-auto pb-12">
                    <div className="flex justify-between items-start mb-16">
                       <div className="flex gap-6 items-center">
                         <div className="relative w-24 h-24 rounded-3xl overflow-hidden border border-white/10 shadow-glow">
                            <Image src={analyzingProduct.image} alt={analyzingProduct.name} fill className="object-cover" />
                         </div>
                         <div>
                           <div className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full mb-3 inline-block tracking-widest">GEMINI PRO ANALYSIS</div>
                           <h2 className="text-4xl font-black text-white tracking-tighter">{analyzingProduct.name}</h2>
                         </div>
                       </div>
                       <button onClick={() => setAnalyzingProduct(null)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/50 group">
                         <X size={24} className="group-hover:rotate-90 transition-transform" />
                       </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                       <div className="space-y-12">
                          <section>
                            <h4 className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                               <div className="w-8 h-[1px] bg-primary/30" /> Headline Sugerida
                            </h4>
                            <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[32px] text-2xl font-bold text-white leading-tight">
                              "{aiResult.headline}"
                            </div>
                          </section>

                          <section>
                            <h4 className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                               <div className="w-8 h-[1px] bg-primary/30" /> Público Alvo
                            </h4>
                            <p className="text-white/60 text-base leading-relaxed">{aiResult.targetAudience}</p>
                          </section>

                          <section>
                            <h4 className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                               <div className="w-8 h-[1px] bg-primary/30" /> Roteiro UGC (Hook + Body + CTA)
                            </h4>
                            <pre className="p-8 bg-black/50 border border-white/10 rounded-[32px] text-sm text-white/70 whitespace-pre-wrap font-sans leading-relaxed">
                              {aiResult.ugcScript}
                            </pre>
                          </section>
                       </div>

                       <div className="space-y-12">
                          <section>
                            <h4 className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                               <div className="w-8 h-[1px] bg-primary/30" /> Ads Copy (Persuasivo)
                            </h4>
                            <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[32px] text-sm text-white/70 leading-relaxed italic">
                              "{aiResult.shortCopy}"
                            </div>
                          </section>

                          <section>
                            <h4 className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                               <div className="w-8 h-[1px] bg-primary/30" /> Segmentação Sugerida
                            </h4>
                            <div className="flex flex-wrap gap-3">
                               {aiResult.adInterests.map(interest => (
                                 <span key={interest} className="px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest">
                                   {interest}
                                 </span>
                               ))}
                            </div>
                          </section>

                          <section>
                            <h4 className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                               <div className="w-8 h-[1px] bg-primary/30" /> Score de Viabilidade
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="p-6 bg-white/[0.02] rounded-[24px] border border-white/5">
                                 <span className="text-[9px] text-white/30 block mb-2 font-black uppercase tracking-widest">DIFICULDADE</span>
                                 <span className="font-bold text-white uppercase text-sm">{aiResult.sellingDifficulty}</span>
                               </div>
                               <div className="p-6 bg-white/[0.02] rounded-[24px] border border-white/5">
                                 <span className="text-[9px] text-white/30 block mb-2 font-black uppercase tracking-widest">VIRAL SCORE</span>
                                 <span className="font-bold text-emerald-400 text-sm">{aiResult.viralPotential}/100</span>
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

function SummaryCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-premium p-8 rounded-[40px] flex items-center gap-8 group cursor-default"
    >
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">{icon}</div>
      <div>
        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mb-2">{title}</p>
        <p className="text-3xl font-black font-space-grotesk tracking-tighter text-white group-hover:text-primary transition-colors">{value}</p>
      </div>
    </motion.div>
  );
}
