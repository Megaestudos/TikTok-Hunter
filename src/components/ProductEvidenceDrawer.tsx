"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ShieldCheck, Users, Play, ImageIcon, Search, Zap, TrendingUp, BarChart3, Clock, LayoutGrid } from "lucide-react";
import { Product } from "@/services/productService";
import { MediaEvidence } from "@/services/media/mediaSearchService";
import { ValidationReport } from "@/services/media/mediaAnalyzerService";
import { cn } from "@/lib/utils";

interface ProductEvidenceDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  evidence: MediaEvidence[];
  report: ValidationReport | null;
  isLoading: boolean;
}

export function ProductEvidenceDrawer({ product, isOpen, onClose, evidence, report, isLoading }: ProductEvidenceDrawerProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-background border-l border-white/10 z-[101] shadow-2xl overflow-y-auto scrollbar-hide"
          >
            {/* Header Section */}
            <div className="sticky top-0 bg-background/80 backdrop-blur-2xl border-b border-white/5 p-8 flex items-center justify-between z-20">
               <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl border-2 border-primary/20 overflow-hidden bg-white/5 shadow-premium">
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white leading-tight">{product.name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-md border border-blue-500/20">Market Validation</span>
                       <span className="text-white/20 text-[10px] font-bold">•</span>
                       <span className="text-white/40 text-[10px] font-bold uppercase">{product.category}</span>
                    </div>
                  </div>
               </div>
               <button 
                  onClick={onClose}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white"
               >
                  <X size={24} />
               </button>
            </div>

            <div className="p-8 space-y-10 pb-20">
              {/* Intelligence Summary */}
              <div className="grid grid-cols-2 gap-5">
                 <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Users size={48} />
                    </div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">Social Proof Score</span>
                    <div className="flex items-baseline gap-2">
                       <span className="text-4xl font-black text-white">{isLoading ? "---" : (report?.socialProofScore || 0)}</span>
                       <span className="text-xs text-white/20 font-bold">/100</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${report?.socialProofScore || 0}%` }}
                          className="h-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                       />
                    </div>
                 </div>

                 <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       <ShieldCheck size={48} />
                    </div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">Media Confidence</span>
                    <div className="flex items-baseline gap-2">
                       <span className="text-4xl font-black text-white">{isLoading ? "---" : (report?.mediaConfidenceScore || 0)}</span>
                       <span className="text-xs text-white/20 font-bold">/100</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${report?.mediaConfidenceScore || 0}%` }}
                          className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                       />
                    </div>
                 </div>
              </div>

              {/* Discovery Stats */}
              <div className="grid grid-cols-3 gap-4">
                 <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col items-center">
                    <BarChart3 size={18} className="text-blue-400 mb-2" />
                    <span className="text-[9px] font-black text-white/30 uppercase">Plataformas</span>
                    <span className="text-sm font-black text-white mt-0.5">{report?.platformDistribution.length || 0}</span>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col items-center">
                    <LayoutGrid size={18} className="text-purple-400 mb-2" />
                    <span className="text-[9px] font-black text-white/30 uppercase">Imagens</span>
                    <span className="text-sm font-black text-white mt-0.5">{evidence.filter(e => e.type === 'image').length}</span>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col items-center">
                    <Play size={18} className="text-orange-400 mb-2" />
                    <span className="text-[9px] font-black text-white/30 uppercase">Vídeos</span>
                    <span className="text-sm font-black text-white mt-0.5">{evidence.filter(e => e.type === 'video').length}</span>
                 </div>
              </div>

              {/* History Bar */}
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Clock size={16} className="text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Descoberta em</span>
                 </div>
                 <span className="text-xs font-bold text-white">{report?.discoveryDate || "Agora"}</span>
              </div>

              {/* Visual Evidence Feed */}
              <div>
                 <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                    <LayoutGrid size={14} className="text-primary" />
                    Visual Evidence Feed
                 </h3>

                 <div className="space-y-4">
                    {isLoading ? (
                       Array(4).fill(0).map((_, i) => (
                          <div key={i} className="h-28 bg-white/5 rounded-3xl animate-pulse border border-white/5" />
                       ))
                    ) : (
                       evidence.map((item, i) => (
                          <motion.a
                             key={i}
                             href={item.url}
                             target="_blank"
                             rel="noopener noreferrer"
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: i * 0.1 }}
                             className="group flex gap-5 p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-3xl transition-all"
                          >
                             <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 shrink-0 relative">
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                   <ExternalLink size={20} className="text-white" />
                                </div>
                             </div>
                             <div className="flex flex-col justify-center gap-1.5 overflow-hidden">
                                <div className="flex items-center gap-2">
                                   <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.platform}</span>
                                   <span className="text-white/20 text-[10px]">•</span>
                                   <span className="text-[10px] font-bold text-white/40 uppercase">{item.type}</span>
                                </div>
                                <h4 className="text-xs font-bold text-white leading-relaxed line-clamp-2">{item.title}</h4>
                             </div>
                          </motion.a>
                       ))
                    )}
                 </div>
              </div>

              {/* Performance Summary Footnote */}
              <div className="p-6 rounded-[32px] bg-gradient-to-r from-primary/20 to-transparent border border-primary/10">
                 <div className="flex items-center gap-3 mb-3">
                    <TrendingUp size={16} className="text-primary" />
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Global Performance</h4>
                 </div>
                 <p className="text-xs text-white/50 leading-relaxed">
                    Este produto apresenta uma correlação de mercado de <span className="text-white font-bold">{product.winnerScore}%</span>. 
                    A validação de mídia sugere um potencial viral <span className="text-primary font-bold uppercase italic">{report?.socialProofScore && report.socialProofScore > 80 ? 'Extremo' : 'Elevado'}</span>.
                 </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
