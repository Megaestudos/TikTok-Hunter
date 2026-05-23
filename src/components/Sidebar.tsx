import { Home, TrendingUp, ShoppingBag, BarChart3, Heart, Settings, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: <Home size={20} />, label: "Dashboard", href: "/" },
    { icon: <TrendingUp size={20} />, label: "Produtos Virais", href: "/viral" },
    { icon: <ShoppingBag size={20} />, label: "Mais Vendidos", href: "/vendas" },
    { icon: <BarChart3 size={20} />, label: "Análise IA", href: "/analise" },
  ];

  return (
    <aside className="w-64 border-r border-card-border bg-zinc-950/50 backdrop-blur-xl hidden md:flex flex-col p-4 fixed h-full z-50">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-premium">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="font-space-grotesk font-bold text-xl tracking-tight text-foreground">TikTok Hunter</span>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
              pathname === item.href
                ? "bg-primary/10 text-primary shadow-[inset_0_0_10px_rgba(139,92,246,0.1)]"
                : "text-muted hover:text-foreground hover:bg-white/5"
            }`}
          >
            <span className={`${pathname === item.href ? "text-primary" : "group-hover:text-primary transition-colors"}`}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="pt-4 border-t border-card-border space-y-1">
        <Link
          href="/favoritos"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 transition-all"
        >
          <Heart size={20} />
          Favoritos
        </Link>
        <Link
          href="/configuracoes"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 transition-all"
        >
          <Settings size={20} />
          Configurações
        </Link>
      </div>
    </aside>
  );
}
