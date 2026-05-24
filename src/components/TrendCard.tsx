"use client";

import { motion } from "framer-motion";
import { Eye, Heart, Share2, MessageCircle, TrendingUp, ExternalLink, Play, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import { TikTokVideo } from "@/services/tiktokService";

export function TrendCard(video: TikTokVideo) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="glass rounded-[32px] overflow-hidden border border-white/5 bg-zinc-950/40 group flex flex-col h-full relative"
    >
      {/* Product Image area with premium overlay */}
      <div className="relative aspect-[10/14] w-full overflow-hidden">
        <Image
          src={video.coverImage}
          alt={video.text}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80" />
        
        {/* Floating Badges */}
        <div className="absolute top-5 left-5 flex flex-wrap gap-2 pr-5">
          {video.badges?.map((badge, idx) => (
            <span 
              key={idx}
              className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] backdrop-blur-xl border border-white/10 shadow-2xl ${
                badge === "Trending" ? "bg-red-500/20 text-red-400 border-red-500/20" :
                badge === "High Growth" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" :
                "bg-amber-500/20 text-amber-400 border-amber-500/10"
              }`}
            >
              {badge}
            </span>
          ))}
          {!video.badges?.length && (
             <span className="px-3 py-1.5 rounded-full bg-primary/20 text-primary-hover text-[9px] font-black uppercase tracking-[0.1em] backdrop-blur-xl border border-primary/20">
                New Trend
             </span>
          )}
        </div>

        {/* Hot Trend Score Indicator */}
        <div className="absolute top-5 right-5">
           <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 group-hover:border-primary/50 transition-colors">
              <span className="text-[10px] font-black text-primary">{video.trendScore}</span>
           </div>
        </div>

        {/* Play Button - Centered */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 backdrop-blur-[2px] transition-all opacity-0 group-hover:opacity-100"
        >
          <a 
            href={video.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-110 transition-transform active:scale-95"
          >
            <Play fill="black" size={28} className="translate-x-1" />
          </a>
        </motion.div>

        {/* Floating Metrics Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
           <div className="flex items-center justify-between">
              <div className="flex flex-col">
                 <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">@{video.author}</span>
                 </div>
                 <h4 className="text-white font-bold text-base leading-tight drop-shadow-lg line-clamp-1">
                    {video.detectedProduct || "Produto Viral Detetado"}
                 </h4>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">Views</span>
                 <span className="text-white font-black text-sm">{formatNumber(video.views)}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Info & Action Area */}
      <div className="p-7 flex-1 flex flex-col">
        <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-8 font-medium">
          {video.text || "Conteúdo viral monitorado em tempo real."}
        </p>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-3 gap-6 p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-8">
          <div className="flex flex-col items-center gap-1">
            <Heart size={14} className="text-rose-500" />
            <span className="text-xs font-black text-white">{formatNumber(video.likes)}</span>
            <span className="text-[8px] text-muted font-bold uppercase">Likes</span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <MessageCircle size={14} className="text-sky-400" />
            <span className="text-xs font-black text-white">{formatNumber(video.comments)}</span>
            <span className="text-[8px] text-muted font-bold uppercase">Comments</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Share2 size={14} className="text-emerald-400" />
            <span className="text-xs font-black text-white">{formatNumber(video.shares)}</span>
            <span className="text-[8px] text-muted font-bold uppercase">Shares</span>
          </div>
        </div>

        {/* Final CTA Buttons */}
        <div className="mt-auto flex gap-3">
          <a 
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-[1.5] py-4 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(139,92,246,0.3)] hover:shadow-primary/50 hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center gap-2 group/btn"
          >
            Ver Vídeo Viral <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </a>
          {video.productUrl && (
            <a 
              href={video.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center group/prod"
              title="Ver Produto na Loja"
            >
              <ShoppingBag size={18} className="group-hover/prod:scale-110 transition-transform text-emerald-400" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
