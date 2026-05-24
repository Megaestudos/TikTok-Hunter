import { motion } from "framer-motion";
import { ShoppingCart, TrendingUp, Users, Video, ExternalLink, Heart } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  sales: string;
  growth: string;
  videos: number;
  affiliates: number;
  image: string;
  category?: string;
  badge?: "Explodindo" | "Alta Conversão" | "Novo Viral" | "Oportunidade";
}

export function ProductCard({ 
  name, 
  price, 
  sales, 
  growth, 
  videos, 
  affiliates, 
  image, 
  badge 
}: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="glass rounded-2xl overflow-hidden border border-card-border group flex flex-col h-full bg-zinc-950/40"
    >
      {/* Product Image Area */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        
        {badge && (
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              badge === "Explodindo" ? "bg-red-500/80 text-white" : 
              badge === "Alta Conversão" ? "bg-green-500/80 text-white" : 
              badge === "Oportunidade" ? "bg-amber-500/80 text-white" :
              "bg-primary/80 text-white"
            } backdrop-blur-sm shadow-lg`}>
              {badge}
            </span>
          </div>
        )}

        <button className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-red-500 hover:bg-black/60 transition-all">
          <Heart size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors h-10">
            {name}
          </h3>
          <span className="font-bold text-primary whitespace-nowrap">{price}</span>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <ShoppingCart size={14} className="text-muted" />
            <div className="flex flex-col">
              <span className="text-[10px] text-muted uppercase">Vendas</span>
              <span className="text-xs font-bold">{sales}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-green-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-muted uppercase">Crescimento</span>
              <span className="text-xs font-bold text-green-500">{growth}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Video size={14} className="text-muted" />
            <div className="flex flex-col">
              <span className="text-[10px] text-muted uppercase">Vídeos</span>
              <span className="text-xs font-bold">{videos}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-muted" />
            <div className="flex flex-col">
              <span className="text-[10px] text-muted uppercase">Afiliados</span>
              <span className="text-xs font-bold">{affiliates}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs py-2 rounded-lg transition-all border border-white/5 flex items-center justify-center gap-2">
            Análise <ExternalLink size={12} />
          </button>
          <button className="flex-1 bg-primary-DEFAULT hover:bg-primary-hover text-white text-xs py-2 rounded-lg transition-all shadow-premium flex items-center justify-center gap-2 font-medium">
            Salvar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
