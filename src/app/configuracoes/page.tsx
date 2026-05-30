"use client";

export const dynamic = "force-dynamic";

import { Sidebar } from "@/components/Sidebar";
import { Settings, User, Bell, Shield, Wallet, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function Configuracoes() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-primary" size={28} />
            <h1 className="text-3xl font-bold font-space-grotesk tracking-tight">Configurações</h1>
          </div>
          <p className="text-muted text-sm">Gerencie sua conta, preferências e alertas do TikTok Hunter.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Nav */}
          <div className="lg:col-span-1 space-y-2 relative">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium text-sm transition-all text-left">
              <User size={18} /> Perfil da Conta
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-muted hover:text-foreground font-medium text-sm transition-all text-left">
              <Bell size={18} /> Alertas e Notificações
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-muted hover:text-foreground font-medium text-sm transition-all text-left">
              <Shield size={18} /> Segurança
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-muted hover:text-foreground font-medium text-sm transition-all text-left">
              <Wallet size={18} /> Assinatura (Pro)
            </button>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 md:p-8 rounded-3xl border border-card-border"
            >
              <h2 className="text-xl font-bold mb-6 font-space-grotesk">Perfil da Conta</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-muted mb-2 uppercase tracking-wide">Nome Completo</label>
                  <input 
                    type="text" 
                    defaultValue="Ismael Admin" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-muted mb-2 uppercase tracking-wide">Email</label>
                  <input 
                    type="email" 
                    defaultValue="admin@tiktokhunter.com" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  />
                  <p className="text-[10px] text-muted mt-1">Este email é usado para login e recebimento de relatórios.</p>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-premium hover:scale-105 active:scale-95 flex items-center gap-2">
                    <Save size={16} /> Salvar Alterações
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
