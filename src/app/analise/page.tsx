"use client";

export const dynamic = "force-dynamic";

import { Sidebar } from "@/components/Sidebar";
import { AIInsight } from "@/components/AIInsight";
import { motion } from "framer-motion";
import { Brain, Sparkles, TrendingUp, Search, AlertCircle } from "lucide-react";

export default function AIAnalysis() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <header className="mb-12 relative">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
          <div className="flex items-center gap-3 mb-2">
            <Brain className="text-primary" size={28} />
            <h1 className="text-3xl font-bold font-space-grotesk tracking-tight">Análise IA</h1>
          </div>
          <p className="text-muted text-sm">Insights inteligentes para detectar tendências antes que elas se tornem saturadas.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Trend Detection Section */}
          <section className="glass p-8 rounded-3xl border border-card-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={120} />
            </div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-green-500" size={20} />
              Early Trends (Oportunidades)
            </h2>
            <div className="space-y-4">
              <AIInsight type="burst" text="Cuidado de Pele Masculino: Aumento de 140% em buscas nas últimas 72 horas." delay={0.1} />
              <AIInsight type="opportunity" text="Acessórios para Meta Quest: Baixa concorrência de afiliados e alto volume de vídeos." delay={0.2} />
              <AIInsight type="potencial" text="Decoração Estilo 'Cozy Gaming': Potencial de ticket médio alto (R$ 150+)." delay={0.3} />
            </div>
          </section>

          {/* Saturação Section */}
          <section className="glass p-8 rounded-3xl border border-card-border relative overflow-hidden group">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertCircle className="text-red-500" size={20} />
              Alertas de Saturação
            </h2>
            <div className="space-y-4">
              <AIInsight type="alert" text="Mini Liquidificador: Saturação alta. Já existem mais de 5,000 lojas ativas com o mesmo criativo." delay={0.1} />
              <AIInsight type="alert" text="Escova 5 em 1: Crescimento estagnado nas últimas 24h. Custo por clique subindo." delay={0.2} />
              <AIInsight type="potencial" text="Dica: Procure variações de cor ou novos ângulos de uso para produtos antigos." delay={0.3} />
            </div>
          </section>
        </div>

        {/* Search for Insights */}
        <div className="max-w-2xl mx-auto glass p-6 rounded-2xl border border-primary/20 bg-primary/5 text-center">
          <h3 className="font-bold mb-2">Quer analisar um nicho específico?</h3>
          <p className="text-xs text-muted mb-4">Nossa IA analisa milhões de dados do TikTok Shop para você.</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Digite um produto ou nicho..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-hover text-white text-xs px-4 py-1.5 rounded-lg font-medium transition-all">
              Analisar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

