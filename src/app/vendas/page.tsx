"use client";

export const dynamic = "force-dynamic";

import { Sidebar } from "@/components/Sidebar";
import { motion } from "framer-motion";
import { ShoppingBag, TrendingUp, DollarSign, ExternalLink, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ProductService, Product } from "@/services/productService";
import Image from "next/image";

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await ProductService.getTrendingProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <header className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold font-space-grotesk tracking-tight">Mais Vendidos</h1>
            <p className="text-muted text-sm mt-1">Produtos reais que estão dominando o mercado agora.</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard icon={<ShoppingBag className="text-primary" />} title="Volume Total Monitorado" value="520k+" />
          <SummaryCard icon={<TrendingUp className="text-green-500" />} title="Ticket Médio" value="R$ 138,40" />
          <SummaryCard icon={<DollarSign className="text-blue-500" />} title="Receita Estimada" value="R$ 2.4M" />
        </div>

        <div className="glass rounded-[32px] border border-card-border overflow-hidden bg-zinc-950/40 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Produto</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">Preço</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">Vendas</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">Receita</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="p-8 h-20 bg-white/5" />
                    </tr>
                  ))
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="group hover:bg-white/[0.03] transition-all">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-2xl">
                             <Image 
                               src={product.image} 
                               alt={product.name} 
                               fill 
                               className="object-cover group-hover:scale-110 transition-transform duration-500"
                             />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{product.name}</span>
                            <span className="text-[10px] text-muted font-bold uppercase tracking-widest">{product.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <span className="text-sm font-black text-white/90 tracking-tighter">{product.price}</span>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-black text-emerald-400">{product.sales}</span>
                          <span className="text-[10px] text-emerald-400/50 font-bold">{product.growth}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                         <span className="text-sm font-black text-primary">R$ {(parseFloat(product.price.replace("R$ ", "").replace(",", ".")) * parseFloat(product.sales.replace("k", ""))).toFixed(0)}k</span>
                      </td>
                      <td className="p-6 text-right">
                        <a 
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:border-primary transition-all group/btn"
                        >
                          Ver Produto <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-8 rounded-[32px] border border-white/5 flex items-center gap-6 bg-zinc-950/20"
    >
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner">{icon}</div>
      <div>
        <p className="text-[10px] text-muted font-black uppercase tracking-[0.2em] mb-1">{title}</p>
        <p className="text-2xl font-black font-space-grotesk tracking-tighter text-white">{value}</p>
      </div>
    </motion.div>
  );
}
