import { Home, TrendingUp, ShoppingBag, BarChart3, Heart, Settings, Zap, History, FolderHeart, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStorage } from "../services/storageService";
import { cn } from "../lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { favorites, history, searchHistory, collections } = useStorage();

  const navItems = [
    { icon: <Home size={20} />, label: "Dashboard", href: "/" },
    { icon: <TrendingUp size={20} />, label: "Produtos Virais", href: "/viral" },
    { icon: <ShoppingBag size={20} />, label: "Marketplaces", href: "/vendas" },
    { icon: <BarChart3 size={20} />, label: "Análise IA", href: "/analise" },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-[#050505] hidden md:flex flex-col p-6 fixed h-full z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
          <Zap className="w-6 h-6 text-white" fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-lg tracking-tighter text-white leading-none">TIKTOK</span>
          <span className="font-bold text-[10px] text-primary tracking-[0.2em] leading-none mt-1">HUNTER</span>
        </div>
      </div>

      <div className="space-y-8 flex-1 overflow-y-auto pr-2 scrollbar-hide">
        {/* Main Nav */}
        <section>
          <h4 className="px-3 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Plataforma</h4>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group",
                  pathname === item.href
                    ? "bg-primary/10 text-primary shadow-[inset_0_0_15px_rgba(139,92,246,0.1)] border border-primary/20"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  pathname === item.href ? "text-primary" : "group-hover:text-primary"
                )}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </section>

        {/* Your Library */}
        <section>
          <h4 className="px-3 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Sua Biblioteca</h4>
          <nav className="space-y-1">
            <Link
              href="/favoritos"
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all group",
                pathname === "/favoritos" ? "bg-white/5 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <Heart size={20} className={pathname === "/favoritos" ? "text-red-500" : "group-hover:text-red-500"} />
                <span>Favoritos</span>
              </div>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{favorites.length}</span>
            </Link>

            <Link
              href="/colecoes"
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all group",
                pathname === "/colecoes" ? "bg-white/5 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <FolderHeart size={20} className="group-hover:text-primary" />
                <span>Coleções</span>
              </div>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{Object.keys(collections).length}</span>
            </Link>

            <Link
              href="/historico"
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group",
                pathname === "/historico" ? "bg-white/5 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <History size={20} className="group-hover:text-primary" />
              <span>Histórico</span>
            </Link>
          </nav>
        </section>

        {/* Recent Searches */}
        {searchHistory.length > 0 && (
          <section>
            <h4 className="px-3 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Buscas Recentes</h4>
            <div className="space-y-2 px-3">
               {searchHistory.slice(0, 5).map((query, i) => (
                 <div key={i} className="flex items-center gap-2 text-xs text-white/40 hover:text-primary cursor-pointer transition-colors group">
                   <Search size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   <span className="truncate">{query}</span>
                 </div>
               ))}
            </div>
          </section>
        )}
      </div>

      <div className="pt-6 mt-6 border-t border-white/5 space-y-1">
        <Link
          href="/configuracoes"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings size={20} />
          Configurações
        </Link>
        <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
           <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Assinatura Pro</p>
           <p className="text-[9px] text-white/40 leading-relaxed">Você tem acesso ilimitado às ferramentas de IA.</p>
        </div>
      </div>
    </aside>
  );
}
