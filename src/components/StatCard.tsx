import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
}

export function StatCard({ title, value, change, isPositive = true }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass p-5 rounded-2xl border border-card-border hover:border-primary/30 transition-all group cursor-default"
    >
      <p className="text-muted text-xs mb-1 group-hover:text-primary transition-colors">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold font-space-grotesk text-foreground">{value}</h3>
        <span className={`text-xs font-medium mb-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
      </div>
      
      {/* Background Glow Effect on Hover */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl -z-10 pointer-events-none" />
    </motion.div>
  );
}
