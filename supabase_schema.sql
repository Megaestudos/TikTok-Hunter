-- TikTok Hunter SaaS - Supabase Schema (v4 Professional)
-- Preparado para alta performance e escalabilidade de histórico.

-- Tabela de Snapshots de Produtos
CREATE TABLE IF NOT EXISTS public.product_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL, -- Fingerprint / Chave Canônica
    winner_score INTEGER NOT NULL DEFAULT 0,
    viral_score INTEGER NOT NULL DEFAULT 0,
    opportunity_score INTEGER NOT NULL DEFAULT 0,
    saturation_level INTEGER NOT NULL DEFAULT 0,
    competition_score INTEGER NOT NULL DEFAULT 0,
    confidence_score INTEGER NOT NULL DEFAULT 0,
    platforms TEXT[] DEFAULT '{}', -- Array de plataformas onde foi detectado
    growth_value INTEGER DEFAULT 0, -- Valor numérico de crescimento
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Metadados Adicionais para Enterprise
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices Estratégicos para Alta Performance
CREATE INDEX IF NOT EXISTS idx_snapshots_product_id ON public.product_snapshots(product_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_created_at ON public.product_snapshots(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snapshots_winner_score ON public.product_snapshots(winner_score DESC);

-- View para Ranking de Ganhos (Top Gaining)
-- Útil para o motor de tendências explosivas
CREATE OR REPLACE VIEW public.vw_top_gaining_products AS
WITH last_snapshots AS (
    SELECT DISTINCT ON (product_id) 
        product_id, 
        winner_score, 
        created_at
    FROM public.product_snapshots
    ORDER BY product_id, created_at DESC
),
oldest_snapshots AS (
    SELECT DISTINCT ON (product_id) 
        product_id, 
        winner_score, 
        created_at
    FROM public.product_snapshots
    WHERE created_at > now() - interval '7 days'
    ORDER BY product_id, created_at ASC
)
SELECT 
    l.product_id,
    l.winner_score as current_score,
    o.winner_score as past_score,
    (l.winner_score - o.winner_score) as gain
FROM last_snapshots l
JOIN oldest_snapshots o ON l.product_id = o.product_id
ORDER BY gain DESC;

-- Tabela de Produtos Consolidados (Opcional, para Cache no Banco)
CREATE TABLE IF NOT EXISTS public.consolidated_products (
    productId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    last_global_score INTEGER,
    last_poi_analysis JSONB,
    last_forecast JSONB,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consolidated_category ON public.consolidated_products(category);
CREATE INDEX IF NOT EXISTS idx_consolidated_score ON public.consolidated_products(last_global_score DESC);

-- Políticas de Segurança (RLS - Row Level Security)
ALTER TABLE public.product_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.product_snapshots FOR SELECT USING (true);
-- Nota: Escrita deve ser protegida por API Key ou Service Role
