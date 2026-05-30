import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, TrendingUp, Users, Video, ExternalLink, Heart, Play, BarChart3, Target, Search } from "lucide-react";
import Image from "next/image";
import { Product, Platform } from "../services/productService";
import { useStorage } from "../services/storageService";
import { useState } from "react";
import { cn } from "../lib/utils";

interface ProductCardProps {
  product: Product;
  onSearchMedia?: (product: Product) => void;
  onAnalyze?: (product: Product) => void;
}

export function ProductCard({ product, onSearchMedia, onAnalyze }: ProductCardProps) {
  const { toggleFavorite, favorites, addToHistory } = useStorage();
  const isFavorite = favorites.some(p => p.id === product.id);
  const [isHovered, setIsHovered] = useState(false);

  // Cast para WinnerProfile se disponível
  const winnerData = product as any;
  const isWinnerProfile = !!winnerData.detectedOn;

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      onViewportEnter={() => addToHistory(product)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-[#0A0A0A]/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 flex flex-col h-full shadow-2xl"
    >
      {/* Platform & Winner Seals */}
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
        <div className="flex gap-2">
          {isWinnerProfile ? (
            <div className="flex -space-x-1.5 overflow-hidden">
               {winnerData.detectedOn.map((p: Platform) => (
                 <div key={p} className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-[10px] shadow-lg ring-1 ring-white/10" title={p}>
                   {getPlatformIcon(p)}
                 </div>
               ))}
            </div>
          ) : (
            <div className="px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 shadow-lg">
              <span>{getPlatformIcon(product.platform)}</span>
              {product.platform}
            </div>
          )}
          
          {isWinnerProfile && (
            <div className={cn(
              "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-md border",
              winnerData.winnerSeal.includes("Alta") ? "bg-green-500/30 border-green-500/50" : 
              winnerData.winnerSeal.includes("Saturado") ? "bg-red-500/30 border-red-500/50" : 
              "bg-amber-500/30 border-amber-500/50"
            )}>
              {winnerData.winnerSeal}
            </div>
          )}
        </div>
      </div>

      {/* Product Image Area */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-90" />
        
        {/* Quick Actions (Floating) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 z-30">
          <button 
            onClick={() => toggleFavorite(product)}
            className={cn(
              "p-2 rounded-xl backdrop-blur-md transition-all border",
              isFavorite 
                ? "bg-red-500/20 border-red-500 text-red-500" 
                : "bg-black/40 border-white/10 text-white/70 hover:text-red-500"
            )}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Viral / Winner Score Indicator */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 z-20">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/50 uppercase font-black tracking-widest bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full w-fit mb-1">
              {isWinnerProfile ? "WINNER SCORE" : "VIRAL SCORE"}
            </span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${isWinnerProfile ? winnerData.consolidatedScore : product.viralScore}%` }}
                   className={cn(
                     "h-full rounded-full",
                     (isWinnerProfile ? winnerData.consolidatedScore : product.viralScore) > 80 ? "bg-primary shadow-[0_0_10px_rgba(139,92,246,0.6)]" : "bg-secondary"
                   )}
                />
              </div>
              <span className="text-xs font-black text-white">{isWinnerProfile ? winnerData.consolidatedScore : product.viralScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-bold text-white text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors pr-8">
            {product.name}
          </h3>
          <div className="flex flex-col items-end">
             <span className="text-lg font-black text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
               {product.price}
             </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5 opacity-70">
          {product.tags.map(tag => (
            <span key={tag} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-white/70">
              #{tag}
            </span>
          ))}
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="flex flex-col gap-1">
             <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/40 uppercase font-black tracking-tighter">Oportunidade</span>
                <span className="text-[10px] font-bold text-primary">{product.opportunityScore}%</span>
             </div>
             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${product.opportunityScore}%` }} />
             </div>
          </div>

          <div className="flex flex-col gap-1">
             <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/40 uppercase font-black tracking-tighter">Saturação</span>
                <span className={cn(
                  "text-[10px] font-bold",
                  product.saturationLevel > 70 ? "text-red-400" : "text-green-400"
                )}>{product.saturationLevel}%</span>
             </div>
             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={cn(
                  "h-full",
                  product.saturationLevel > 70 ? "bg-red-500" : "bg-green-500"
                )} style={{ width: `${product.saturationLevel}%` }} />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/10">
              <BarChart3 size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 uppercase font-bold">Competição</span>
              <span className="text-xs font-bold text-white uppercase">{product.competitionScore < 40 ? "Baixa" : "Média"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500 border border-green-500/10">
              <Target size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 uppercase font-bold">Trending</span>
              <span className="text-xs font-bold text-green-400 uppercase">Em Alta</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex gap-2">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => onSearchMedia?.(product)}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Search size={14} className="text-primary" />
              BUSCAR MÍDIA
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => onAnalyze?.(product)}
              className="flex-1 bg-primary text-white text-xs font-bold py-2.5 rounded-xl shadow-premium hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
            >
              <Play size={14} fill="currentColor" />
              ANÁLISE IA
            </motion.button>
          </div>
          
          <div className="flex justify-between items-center px-1">
             <div className="flex items-center gap-1.5 opacity-60">
                <Users size={12} />
                <span className="text-[10px] font-medium">{product.affiliates} afiliados</span>
             </div>
             <div className="flex items-center gap-1.5 opacity-60">
                <Video size={12} />
                <span className="text-[10px] font-medium">{product.videos} vídeos</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
