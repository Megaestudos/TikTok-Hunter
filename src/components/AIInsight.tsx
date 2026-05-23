import { Zap, TrendingUp, AlertCircle, Target } from "lucide-react";
import { motion } from "framer-motion";

interface AIInsightProps {
  text: string;
  type: 'burst' | 'opportunity' | 'potencial' | 'alert';
  delay?: number;
}

export function AIInsight({ text, type, delay = 0 }: AIInsightProps) {
  const configs = {
    burst: {
      color: 'border-orange-500/20 bg-orange-500/5 text-orange-200',
      icon: <Zap size={14} className="text-orange-500 shrink-0 mt-0.5" />
    },
    opportunity: {
      color: 'border-green-500/20 bg-green-500/5 text-green-200',
      icon: <Target size={14} className="text-green-500 shrink-0 mt-0.5" />
    },
    potencial: {
      color: 'border-blue-500/20 bg-blue-500/5 text-blue-200',
      icon: <TrendingUp size={14} className="text-blue-500 shrink-0 mt-0.5" />
    },
    alert: {
      color: 'border-red-500/20 bg-red-500/5 text-red-200',
      icon: <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-xl border ${configs[type].color} text-[13px] leading-relaxed flex gap-3 items-start animate-fade-in group hover:bg-white/5 transition-colors cursor-default`}
    >
      <div className="p-1 rounded-md bg-white/5 backdrop-blur-sm">
        {configs[type].icon}
      </div>
      <p className="flex-1">{text}</p>
    </motion.div>
  );
}
