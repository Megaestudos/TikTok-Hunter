import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Copy, Bookmark, Search, Image as ImageIcon, Video, Play, Info } from "lucide-react";
import { Product } from "../services/productService";
import { MediaResult } from "../services/mediaService";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "../lib/utils";

interface MediaDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  results: MediaResult[];
  isLoading: boolean;
}

export function MediaDrawer({ product, isOpen, onClose, results, isLoading }: MediaDrawerProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-zinc-950 border-l border-white/10 z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Media Intelligence</span>
                <h2 className="text-xl font-black text-white line-clamp-1">{product?.name}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="relative">
                    <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Search className="absolute inset-0 m-auto text-primary animate-pulse" size={24} />
                  </div>
                  <p className="text-white/50 text-sm font-medium animate-pulse">Buscando criativos e referências...</p>
                </div>
              ) : (
                <>
                  {/* Results Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((result, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all shadow-lg"
                      >
                        <div className="relative h-40 w-full">
                          <Image 
                            src={result.thumbnail} 
                            alt={result.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-3 bg-primary text-white rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform"
                            >
                              <Play size={20} fill="currentColor" />
                            </a>
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleCopy(result.url)}
                              className="p-1.5 bg-black/60 backdrop-blur-md text-white rounded-lg hover:bg-primary transition-colors"
                              title="Copiar Link"
                            >
                              {copiedLink === result.url ? <X size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-bold text-white uppercase tracking-tighter">
                            {result.platform}
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="text-xs font-bold text-white/90 line-clamp-2 leading-relaxed mb-3">
                            {result.title}
                          </h4>
                          <div className="flex gap-2">
                             <a 
                               href={result.url} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="flex-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-white flex items-center justify-center gap-2 transition-all"
                             >
                               ABRIR <ExternalLink size={10} />
                             </a>
                             <button className="px-3 py-1.5 bg-white/5 hover:bg-primary/20 border border-white/10 rounded-lg text-[10px] font-bold text-white flex items-center justify-center transition-all">
                               <Bookmark size={10} />
                             </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* AI Quick Insight in Drawer */}
                  <div className="p-5 bg-primary/10 border border-primary/20 rounded-3xl relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs">
                        <Info size={14} />
                        DICA DA IA
                      </div>
                      <p className="text-white/80 text-xs leading-relaxed italic">
                        "Este produto performa melhor com vídeos de unboxing em luz natural. 
                        Recomendamos focar nas dores de praticidade no primeiro gancho (0-3s)."
                      </p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 text-primary/5 opacity-20">
                      <Search size={120} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-zinc-900/50">
               <button 
                 className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-premium hover:shadow-premium-hover transition-all flex items-center justify-center gap-3"
               >
                 GERAR CRIATIVOS AGORA
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
