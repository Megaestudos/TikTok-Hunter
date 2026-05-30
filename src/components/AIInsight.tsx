import { Zap, TrendingUp, AlertCircle, Target } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface AIInsightProps {
  text: string;
  type: 'burst' | 'opportunity' | 'potencial' | 'alert';
  delay?: number;
}

export function AIInsight({ text, type, delay = 0 }: AIInsightProps) {
  const configs = {
    burst: {
      color: 'border-orange-500/20 bg-orange-500/5 text-orange-200/90',
      icon: <Zap size={14} className="text-orange-500 shrink-0" />
    },
    opportunity: {
      color: 'border-green-500/20 bg-green-500/5 text-green-200/90',
      icon: <Target size={14} className="text-green-500 shrink-0" />
    },
    potencial: {
      color: 'border-blue-500/20 bg-blue-500/5 text-blue-200/90',
      icon: <TrendingUp size={14} className="text-blue-500 shrink-0" />
    },
    alert: {
      color: 'border-red-500/20 bg-red-500/5 text-red-200/90',
      icon: <AlertCircle size={14} className="text-red-500 shrink-0" />
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={cn(
        "p-4 rounded-2xl border text-xs leading-relaxed flex gap-3 items-center group transition-all cursor-default backdrop-blur-md",
        configs[type].color
      )}
    >
      <div className="p-2 rounded-xl bg-black/20 border border-white/5 shadow-inner">
        {configs[type].icon}
      </div>
      <p className="flex-1 font-medium">{text}</p>
    </motion.div>
  );
}
