import { motion } from "framer-motion";
import { Sparkles, Zap, AlertCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightProps {
  text: string;
  type: "burst" | "opportunity" | "alert" | "potencial";
  delay?: number;
}

export function AIInsight({ text, type, delay = 0 }: AIInsightProps) {
  const getColors = () => {
    switch (type) {
      case "burst": return "bg-primary/20 text-primary-hover border-primary/20";
      case "opportunity": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/20";
      case "alert": return "bg-rose-500/20 text-rose-400 border-rose-500/20";
      case "potencial": return "bg-sky-500/20 text-sky-400 border-sky-500/20";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "burst": return <Zap size={14} className="text-primary-hover" />;
      case "opportunity": return <TrendingUp size={14} className="text-emerald-400" />;
      case "alert": return <AlertCircle size={14} className="text-rose-400" />;
      case "potencial": return <Sparkles size={14} className="text-sky-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, x: 5 }}
      className="glass-premium p-4 rounded-2xl flex items-start gap-4 group cursor-default"
    >
      <div className={cn(
        "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-300 group-hover:shadow-glow",
        getColors()
      )}>
        {getIcon()}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
          {type === "burst" ? "Explosão" : type === "opportunity" ? "Oportunidade" : type === "alert" ? "Alerta" : "Potencial"}
        </span>
        <p className="text-xs text-white/70 leading-relaxed font-medium group-hover:text-white transition-colors">
          {text}
        </p>
      </div>
    </motion.div>
  );
}
