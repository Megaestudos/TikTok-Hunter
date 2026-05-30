import { motion } from "framer-motion";

export function SkeletonCard() {
  return (
    <div className="bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="relative h-56 w-full bg-white/5 overflow-hidden">
        <motion.div
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-1/2"
        />
      </div>
      
      <div className="p-5 flex-1 flex flex-col space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-white/5 rounded-md w-3/4 animate-pulse" />
          <div className="h-4 bg-white/5 rounded-md w-1/2 animate-pulse" />
        </div>
        
        <div className="flex justify-between items-center py-2">
          <div className="h-6 bg-white/5 rounded-md w-1/4 animate-pulse" />
          <div className="h-6 bg-white/5 rounded-md w-1/4 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
