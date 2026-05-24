"use client";

import { motion } from "framer-motion";
import { Eye, Heart, Share2, MessageCircle, TrendingUp, ExternalLink, Play } from "lucide-react";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass rounded-3xl overflow-hidden border border-card-border bg-zinc-950/40 group flex flex-col h-full"
    >
      {/* Video Preview Area */}
      <div className="relative aspect-[9/16] w-full overflow-hidden">
        <Image
          src={video.coverImage}
          alt={video.text}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        {/* Trend Score Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-premium">
            <TrendingUp size={14} className="text-primary" />
            <span className="text-xs font-bold text-white">Trend Score: {video.trendScore}%</span>
          </div>
        </div>

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 rounded-full bg-primary/80 backdrop-blur-md flex items-center justify-center text-white shadow-premium scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play fill="currentColor" size={24} />
          </div>
        </div>

        {/* Stats Overlay Bottom */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2 text-white/90">
                <Eye size={14} />
                <span className="text-xs font-bold">{formatNumber(video.views)}</span>
             </div>
             <p className="text-[10px] text-white/60 font-medium">@{video.author}</p>
          </div>
          <a 
            href={video.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary transition-all"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-sm text-foreground/90 line-clamp-2 font-medium mb-6 leading-relaxed">
          {video.text || "Sem legenda disponível"}
        </p>

        <div className="grid grid-cols-3 gap-4 mt-auto">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-pink-500">
              <Heart size={14} fill="currentColor" />
              <span className="text-xs font-bold">{formatNumber(video.likes)}</span>
            </div>
            <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Likes</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-blue-400">
              <Share2 size={14} />
              <span className="text-xs font-bold">{formatNumber(video.shares)}</span>
            </div>
            <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Shares</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <MessageCircle size={14} />
              <span className="text-xs font-bold">{formatNumber(video.comments)}</span>
            </div>
            <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Comments</span>
          </div>
        </div>

        <button className="w-full mt-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
          Análise Detalhada
        </button>
      </div>
    </motion.div>
  );
}
