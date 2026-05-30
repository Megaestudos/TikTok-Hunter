import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "../lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  icon?: keyof typeof Icons;
}

export function StatCard({ title, value, change, isPositive = true, icon }: StatCardProps) {
  const IconComponent = icon ? (Icons[icon] as any) : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-[#0A0A0A]/40 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 hover:border-primary/50 transition-all group relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{title}</p>
          {IconComponent && (
            <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/10 group-hover:scale-110 transition-transform">
              <IconComponent size={16} />
            </div>
          )}
        </div>
        
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-black font-space-grotesk text-white tracking-tighter">{value}</h3>
          <div className={cn(
            "px-2 py-1 rounded-lg text-[10px] font-bold",
            isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          )}>
            {change}
          </div>
        </div>
      </div>
      
      {/* Premium Glow */}
      <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
