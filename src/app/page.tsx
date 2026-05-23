"use client";

import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { AIInsight } from "@/components/AIInsight";
import { Search, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { TrendsChart } from "@/components/TrendsChart";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background selection:bg-primary/30">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl md:text-4xl font-bold font-space-grotesk tracking-tight">Visão Geral</h1>
            <p className="text-muted text-sm mt-1">Bem-vindo ao centro de comando do TikTok Hunter.</p>
          </motion.div>

          <header-actions className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Buscar produtos ou nichos..." 
                className="bg-card border border-card-border rounded-full py-2.5 pl-10 pr-4 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm backdrop-blur-md"
              />
            </div>
            <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-premium hover:scale-105 active:scale-95 flex items-center gap-2">
              <Zap size={16} fill="currentColor" /> Novo Alerta
            </button>
          </header-actions>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard title="Total Monitorado" value="2,481" change="+18%" />
          <StatCard title="Em Alta Hoje" value="126" change="+34.2%" />
          <StatCard title="Crescimento 24h" value="48.2%" change="+12.1%" />
          <StatCard title="Vendas Estimadas" value="R$ 842k" change="+15.8%" />
        </div>

        {/* main grid section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trends Chart Area */}
          <div className="lg:col-span-2 glass rounded-3xl p-8 border border-card-border overflow-hidden relative">
            <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 blur-[60px] rounded-full" />
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-bold text-xl font-space-grotesk">Tendência de Viralização</h2>
                <p className="text-xs text-muted mt-1">Volume de vídeos e engajamento acumulado</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-white/5 px-3 py-1 rounded-lg text-[10px] font-bold border border-white/5 hover:border-white/10 transition-colors uppercase tracking-widest text-muted hover:text-white">7 Dias</button>
                <button className="bg-primary/20 px-3 py-1 rounded-lg text-[10px] font-bold border border-primary/20 transition-colors uppercase tracking-widest text-primary">30 Dias</button>
              </div>
            </div>
            
            {/* Real Chart */}
            <div className="h-72 w-full mt-4">
              <TrendsChart />
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="glass rounded-3xl p-8 border border-card-border grow">
              <div className="flex items-center gap-2 mb-8">
                 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 </div>
                 <h2 className="font-bold text-lg font-space-grotesk tracking-tight">IA Insights</h2>
              </div>
              
              <div className="space-y-4">
                <AIInsight text="Produto 'Mini Projetor' crescendo 240% nas últimas 48h." type="burst" delay={0.1} />
                <AIInsight text="Nicho de Decoração Home Office com baixa saturação." type="opportunity" delay={0.2} />
                <AIInsight text="Alto potencial para afiliados no setor de Pets." type="potencial" delay={0.3} />
                <AIInsight text="Atenção: Nicho de 'Fidget Toys' apresenta queda de 15% no engajamento." type="alert" delay={0.4} />
              </div>

              <button className="w-full mt-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold uppercase tracking-widest transition-all">
                Ver todos os insights
              </button>
            </div>
            
            <div className="glass rounded-3xl p-6 border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="font-bold text-sm mb-1">Upgrade para Pro</h3>
                <p className="text-[10px] text-muted mb-4">Acesse filtros avançados e alertas em tempo real.</p>
                <button className="w-full py-2 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-premium group-hover:scale-[1.02] transition-all">
                  Desbloquear
                </button>
              </div>
              <Zap className="absolute -bottom-4 -right-4 w-20 h-20 text-primary/10 -rotate-12 group-hover:scale-125 transition-transform" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TrendingUp({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  );
}
