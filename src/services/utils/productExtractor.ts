/**
 * Blacklist Global de Termos Genéricos
 */
const BLACKLIST = [
  "tiktokshop", "tiktokmademebuyit", "amazonfinds", "amazonmusthaves", "fyp", 
  "foryou", "foryoupage", "trending", "sale", "discount", "shopnow", "viral", 
  "product", "dropshipping", "ecommerce", "affiliate", "deal", "deals", 
  "bestbuy", "musthave", "trendingproduct", "hotproduct", "tiktokvideo"
];

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
  "smartwatch": "relogio inteligente"
};

const CATEGORY_MAP: Record<string, string[]> = {
  "Cozinha": ["cozinha", "ice maker", "dispenser", "panela", "air fryer", "liquidificador", "faca", "talher"],
  "Casa": ["casa", "limpeza", "aspirador", "travesseiro", "manta", "organizacao", "quarto", "banheiro"],
  "Tecnologia": ["tecnologia", "fone", "relogio", "celular", "printer", "led", "cabo", "carregador", "caixa de som", "projetor", "pc"],
  "Beleza": ["maquiagem", "beleza", "pele", "skincare", "cabelo", "batom", "creme", "perfume"],
  "Saúde": ["saude", "suplemento", "vitamina", "massagem", "fisioterapia", "postura"],
  "Moda": ["moda", "camiseta", "vestido", "calca", "tenis", "bolsa", "acessorio", "joia"],
  "Pet": ["pet", "cachorro", "gato", "coleira", "racao", "animal", "brinquedo pet", "escova pet"],
  "Automotivo": ["automotivo", "carro", "acessorio carro", "limpeza carro", "gps", "aspirador carro"],
  "Organização": ["organizacao", "cabide", "caixa", "organizador", "gaveta", "prateleira"],
  "Bebês": ["bebe", "fralda", "mamadeira", "carrinho", "brinquedo bebe", "roupa bebe"],
  "Ferramentas": ["furadeira", "ferramenta", "conserto", "chave", "obra", "parafuso", "martelo"],
  "Fitness": ["academia", "treino", "fitness", "proteina", "whey", "garrafa", "esporte", "yoga", "pilates"],
  "Escritório": ["escritorio", "cadeira", "mesa", "mouse", "teclado", "monitor", "luminaria"],
  "Jardim": ["jardim", "planta", "rega", "ferramenta jardim", "piscina", "externo"],
  "Livros": ["livro", "e-book", "kindle", "leitura", "papelaria"]
};

const BRAND_LIST = [
  "Apple", "Samsung", "Xiaomi", "Nike", "Adidas", "Sony", "JBL", "Logitech", "Philips", "Lenovo", "Dell", "Stanley", "Dyson", "Ninja", "Shark"
];

export interface ExtractedProduct {
  productName: string;
  brand: string | null;
  category: string;
  confidence: number;
}

/**
 * Product Intelligence Engine (v3 Enterprise)
 */
export const ProductExtractorService = {
  /**
   * Extração estruturada de produtos com bloqueio de blacklist
   */
  extractDetailed: (text: string): ExtractedProduct => {
    if (!text) return { productName: "Produto não identificado", brand: null, category: "Outros", confidence: 0 };

    // 1. Limpeza profunda
    let clean = text
      .toLowerCase()
      .replace(/#\w+/g, (m) => BLACKLIST.includes(m.slice(1)) ? '' : m) // Remove hashtags blacklistadas
      .replace(/#\w+/g, ' ') 
      .replace(/http\S+/g, '') 
      .replace(/@\w+/g, '') 
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\u200D|\uFE0F/g, '');

    // 2. Extração estrutural
    let tokens = clean
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOPWORDS.includes(w) && !PROMOTIONAL_WORDS.includes(w));

    // 3. Verificação de Blacklist
    if (tokens.some(t => BLACKLIST.includes(t))) {
      // Se contiver termos fortes da blacklist no início ou como maioria, descarta
      const blacklistCount = tokens.filter(t => BLACKLIST.includes(t)).length;
      if (blacklistCount / tokens.length > 0.4 || BLACKLIST.includes(tokens[0])) {
        return { productName: "Produto não identificado", brand: null, category: "Outros", confidence: 0 };
      }
      tokens = tokens.filter(t => !BLACKLIST.includes(t));
    }

    if (tokens.length < 2) return { productName: "Produto não identificado", brand: null, category: "Outros", confidence: 0 };

    // 4. Reconhecimento de Marca
    const brand = BRAND_LIST.find(b => tokens.includes(b.toLowerCase())) || null;
    
    // 5. Canonização e Formatação
    const canonicalTokens = tokens.map(t => SYNONYM_MAP[t] || t);
    const finalName = canonicalTokens
      .slice(0, 6)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const prodName = brand ? `${brand} ${finalName.replace(new RegExp(brand, 'gi'), '').trim()}` : finalName;
    const category = ProductExtractorService.detectCategory(prodName);
    const confidence = ProductExtractorService.calculateConfidence(prodName, tokens.length);

    return { 
      productName: confidence >= 60 ? prodName : "Produto não identificado", 
      brand, 
      category, 
      confidence 
    };
  },

  /**
   * Facade para manter compatibilidade com v2
   */
  extract: (text: string): string => {
    return ProductExtractorService.extractDetailed(text).productName;
  },

  getFingerprint: (name: string): string => {
    if (name === "Produto não identificado") return "unknown";
    const tokens = name.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOPWORDS.includes(w))
      .map(t => SYNONYM_MAP[t] || t);

    return Array.from(new Set(tokens)).sort().join('');
  },

  calculateConfidence: (name: string, tokenCount: number): number => {
    if (name === "Produto não identificado") return 0;
    
    let score = 20;
    if (tokenCount >= 3) score += 30;
    if (BRAND_LIST.some(b => name.toLowerCase().includes(b.toLowerCase()))) score += 30;
    if (/\d+/.test(name)) score += 10; 
    if (name.length > 15) score += 10;
    
    // Penalização de termos genéricos residuais
    if (name.toLowerCase().includes("product") || name.toLowerCase().includes("item")) score -= 20;

    return Math.min(100, Math.max(0, score));
  },

  detectCategory: (name: string): string => {
    const lowerName = name.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
      if (keywords.some(k => lowerName.includes(k))) return category;
    }
    return "Outros";
  },

  detectBrandAndModel: (name: string) => {
    const brand = BRAND_LIST.find(b => name.toLowerCase().includes(b.toLowerCase()));
    const modelMatch = name.match(/\b[a-z]{1,2}\d{1,4}[a-z]?\b/i) || name.match(/\b\d{2,4}\b/);
    
    return {
      brand: brand || "Generic",
      model: modelMatch ? modelMatch[0] : "Standard"
    };
  }
};
