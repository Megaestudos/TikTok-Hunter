"use client";

import { Sidebar } from "@/components/Sidebar";
import { motion } from "framer-motion";
import { ShoppingBag, TrendingUp, DollarSign } from "lucide-react";

export default function BestSellers() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-space-grotesk">Mais Vendidos</h1>
          <p className="text-muted text-sm mt-1">Produtos que estão gerando mais receita no momento.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard icon={<ShoppingBag className="text-primary" />} title="Volume Total" value="R$ 1.2M" />
          <SummaryCard icon={<TrendingUp className="text-green-500" />} title="Ticket Médio" value="R$ 89,40" />
          <SummaryCard icon={<DollarSign className="text-blue-500" />} title="Lucro Estimado" value="R$ 420k" />
        </div>

        <div className="glass rounded-2xl border border-card-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border bg-white/5">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Produto</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted text-center">Preço</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted text-center">Unidades</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted text-center">Receita</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted text-right">Tendência</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-card-border hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden shrink-0" />
                      <span className="text-sm font-medium">Produto Exemplo #{i}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm font-bold tracking-tight">R$ 124,90</td>
                  <td className="p-4 text-center text-sm">4,284</td>
                  <td className="p-4 text-center text-sm font-bold text-primary">R$ 535k</td>
                  <td className="p-4 text-right">
                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full font-bold">+12.5%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <div className="glass p-6 rounded-2xl border border-card-border flex items-center gap-4">
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">{icon}</div>
      <div>
        <p className="text-xs text-muted font-medium">{title}</p>
        <p className="text-xl font-bold font-space-grotesk">{value}</p>
      </div>
    </div>
  );
}
