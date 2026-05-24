"use client";

import { Sidebar } from "@/components/Sidebar";
import { ProductCard } from "@/components/ProductCard";
import { Search, Heart } from "lucide-react";
import { motion } from "framer-motion";

const FAVORITE_PRODUCTS = [
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
    id: "3",
    name: "Luminária de Mesa Magnética Anti-Gravidade",
    price: "R$ 156,00",
    sales: "5.1k",
    growth: "+850%",
    videos: 320,
    affiliates: 56,
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800&auto=format&fit=crop&q=60",
    badge: "Novo Viral" as const
  }
];

export default function Favoritos() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Heart className="text-primary fill-primary/20" size={20} />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-space-grotesk tracking-tight">Meus Favoritos</h1>
                <p className="text-muted text-sm mt-1">Produtos e nichos que você está monitorando de perto.</p>
              </div>
            </div>
            
            <div className="relative group w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Buscar em favoritos..." 
                className="bg-card border border-card-border rounded-full py-2.5 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm backdrop-blur-md"
              />
            </div>
          </div>
        </header>

        {FAVORITE_PRODUCTS.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {FAVORITE_PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 glass rounded-3xl border border-card-border text-center">
            <Heart size={48} className="text-muted/30 mb-4" />
            <h3 className="text-lg font-bold mb-2">Nenhum favorito ainda</h3>
            <p className="text-muted text-sm max-w-md">Você ainda não adicionou nenhum produto aos seus favoritos. Navegue pelos produtos virais e salve os que deseja monitorar.</p>
          </div>
        )}
      </main>
    </div>
  );
}
