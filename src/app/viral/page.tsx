"use client";

import { Sidebar } from "@/components/Sidebar";
import { ProductCard } from "@/components/ProductCard";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Mini Projetor Portátil 4K WiFi - Cinema em Casa",
    price: "R$ 297,00",
    sales: "12.4k",
    growth: "+340%",
    videos: 842,
    affiliates: 124,
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=60",
    badge: "Explodindo" as const
  },
  {
    id: "2",
    name: "Escova de Limpeza Elétrica 5 em 1 Multifuncional",
    price: "R$ 89,90",
    sales: "45.2k",
    growth: "+120%",
    videos: 1250,
    affiliates: 450,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60",
    badge: "Alta Conversão" as const
  },
  {
    id: "3",
    name: "Luminária de Mesa Magnética Anti-Gravidade",
    price: "R$ 156,00",
    sales: "5.1k",
    growth: "+850%",
    videos: 320,
    affiliates: 56,
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800&auto=format&fit=crop&q=60",
    badge: "Novo Viral" as const
  },
  {
    id: "4",
    name: "Fone de Ouvido Condução Óssea Esportivo",
    price: "R$ 198,00",
    sales: "8.9k",
    growth: "+45%",
    videos: 560,
    affiliates: 89,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "5",
    name: "Umidificador de Ar Vulcão com Efeito de Chama",
    price: "R$ 124,00",
    sales: "15.7k",
    growth: "+210%",
    videos: 890,
    affiliates: 167,
    image: "https://images.unsplash.com/photo-1519183071298-a2962edf1a5e?w=800&auto=format&fit=crop&q=60",
    badge: "Explodindo" as const
  },
  {
    id: "6",
    name: "Liquidificador Portátil USB Rechargeable",
    price: "R$ 67,00",
    sales: "98.2k",
    growth: "+15%",
    videos: 4500,
    affiliates: 1200,
    image: "https://images.unsplash.com/photo-1585238341267-1cfec2046a55?w=800&auto=format&fit=crop&q=60"
  }
];

export default function ViralProducts() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold font-space-grotesk tracking-tight">Produtos Virais</h1>
              <p className="text-muted text-sm mt-1">Descubra o que está dominando o TikTok agora.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl border border-card-border bg-card/50 text-muted hover:text-foreground transition-all">
                <Filter size={20} />
              </button>
              <button className="p-2.5 rounded-xl border border-card-border bg-card/50 text-muted hover:text-foreground transition-all">
                <ArrowUpDown size={20} />
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {["Tudo", "Eletrônicos", "Casa", "Beleza", "Pets", "Moda", "Kids"].map((cat) => (
              <button 
                key={cat} 
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                  cat === "Tudo" ? "bg-primary-DEFAULT border-primary-DEFAULT text-white" : "bg-card border-card-border text-muted hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Product Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </motion.div>
      </main>
    </div>
  );
}
