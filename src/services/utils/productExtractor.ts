/**
 * Dicionários e Regras de Inteligência
 */
const STOPWORDS = [
  "de", "da", "o", "a", "do", "dos", "das", "um", "uma", "com", "para", "em", "no", "na",
  "for", "to", "at", "the", "and", "but", "this", "that", "it", "with", "is", "of", "on"
];

const PROMOTIONAL_WORDS = [
  "promoção", "oferta", "desconto", "sale", "off", "free", "grátis", "envio", "entrega",
  "viral", "top", "imperdível", "compre", "check", "link", "bio", "shop", "comprar"
];

const SYNONYM_MAP: Record<string, string> = {
  "printer": "impressora",
  "printer bluetooth": "impressora bluetooth",
  "mini printer": "mini impressora",
  "phone": "celular",
  "smartphone": "celular",
  "earbuds": "fone",
  "headphones": "fone",
  "light": "luz",
  "led": "led",
  "case": "capinha",
  "cover": "capinha",
  "watch": "relogio",
  "smartwatch": "relogio inteligente",
  "fitness": "academia",
  "training": "academia",
  "beauty": "beleza",
  "makeup": "maquiagem"
};

const CATEGORY_MAP: Record<string, string[]> = {
  "Eletrônicos": ["fone", "relogio", "celular", "printer", "impressora", "led", "cabo", "carregador", "caixa de som", "projetor", "pc", "computador"],
  "Beleza": ["maquiagem", "beleza", "pele", "skincare", "cabelo", "batom", "creme"],
  "Fitness": ["academia", "treino", "fitness", "proteina", "whey", "garrafa", "esporte"],
  "Casa": ["cozinha", "limpeza", "decoracao", "luz", "lampada", "quarto", "banheiro", "organizador"],
  "Pets": ["pet", "cachorro", "gato", "coleira", "racao", "animal"],
  "Ferramentas": ["furadeira", "ferramenta", "conserto", "chave", "obra", "parafuso"]
};

const BRAND_LIST = [
  "Apple", "Samsung", "Xiaomi", "Nike", "Adidas", "Sony", "JBL", "Logitech", "Philips", "Lenovo", "Dell"
];

/**
 * Product Intelligence Engine (v2)
 */
export const ProductExtractorService = {
  /**
   * Extrai e Padroniza o nome do produto (Canonical Name)
   */
  extract: (text: string): string => {
    if (!text) return "Produto Viral";

    // 1. Limpeza profunda
    let clean = text
      .replace(/#\w+/g, '') 
      .replace(/http\S+/g, '') 
      .replace(/@\w+/g, '') 
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\u200D|\uFE0F/g, '') 
      .toLowerCase();

    // 2. Extração estrutural
    const tokens = clean
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOPWORDS.includes(w) && !PROMOTIONAL_WORDS.includes(w));

    if (tokens.length < 2) return "Produto Viral";

    // 3. Canonização de Termos (Sinônimos)
    const canonicalTokens = tokens.map(t => SYNONYM_MAP[t] || t);

    // 4. Reconhecimento de Marca (prioriza início)
    const brand = BRAND_LIST.find(b => canonicalTokens.includes(b.toLowerCase()));
    
    // 5. Gera nome amigável (Title Case)
    const finalName = canonicalTokens
      .slice(0, 6)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return brand ? `${brand} ${finalName.replace(new RegExp(brand, 'gi'), '').trim()}` : finalName;
  },

  /**
   * Gera o Product Fingerprint (Chave única de comparação)
   */
  getFingerprint: (name: string): string => {
    const tokens = name.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOPWORDS.includes(w))
      .map(t => SYNONYM_MAP[t] || t); // Aplica sinônimos na chave

    return Array.from(new Set(tokens)).sort().join('');
  },

  /**
   * Alias para compatibilidade
   */
  getComparisonKey: (name: string): string => {
    return ProductExtractorService.getFingerprint(name);
  },

  /**
   * Mede a similaridade entre duas strings usando Levenshtein
   */
  calculateSimilarity: (s1: string, s2: string): number => {
    const source = s1.toLowerCase();
    const target = s2.toLowerCase();
    
    if (source === target) return 100;
    
    const costs = new Array();
    for (let i = 0; i <= source.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= target.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (source.charAt(i - 1) !== target.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[target.length] = lastValue;
    }
    
    const distance = costs[target.length];
    const maxLength = Math.max(source.length, target.length);
    return Math.floor((1 - distance / maxLength) * 100);
  },

  /**
   * Confiabilidade da Extração (Confidence Engine)
   */
  getConfidenceScore: (name: string): number => {
    if (name === "Produto Viral") return 0;
    
    let score = 30;
    const tokens = name.split(' ');
    
    if (tokens.length >= 3) score += 30;
    if (BRAND_LIST.some(b => name.toLowerCase().includes(b.toLowerCase()))) score += 20;
    if (/\d+/.test(name)) score += 10; // Contém números (provavelmente modelo)
    if (name.length > 15) score += 10;
    
    return Math.min(100, score);
  },

  /**
   * Detecção Automática de Categoria
   */
  detectCategory: (name: string): string => {
    const lowerName = name.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
      if (keywords.some(k => lowerName.includes(k))) return category;
    }
    return "Outros";
  },

  /**
   * Detecta marca e modelo
   */
  detectBrandAndModel: (name: string) => {
    const brand = BRAND_LIST.find(b => name.toLowerCase().includes(b.toLowerCase()));
    // Tenta capturar códigos alfanuméricos comuns (ex: H1, V2, iPhone 15, S24)
    const modelMatch = name.match(/\b[a-z]{1,2}\d{1,4}[a-z]?\b/i) || name.match(/\b\d{2,4}\b/);
    
    return {
      brand: brand || "Generic",
      model: modelMatch ? modelMatch[0] : "Standard"
    };
  }
};
