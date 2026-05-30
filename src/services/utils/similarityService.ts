import { ProductExtractorService } from "./productExtractor";

/**
 * Serviço de Inteligência de Similaridade para Correlação de Produtos
 */
export const SimilarityService = {
  /**
   * Normaliza o nome removendo acentos, pontuação e espaços extras
   */
  normalizeName: (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^\w\s]/g, " ") // Remove pontuação
      .replace(/\s+/g, " ")
      .trim();
  },

  /**
   * Transforma o nome em um conjunto de tokens (palavras-chave) únicos
   */
  tokenize: (name: string): Set<string> => {
    const normalized = SimilarityService.normalizeName(name);
    const words = normalized.split(" ").filter(w => w.length > 2);
    // Usa o ProductExtractor para garantir consistência nas stopwords
    return new Set(words.filter(w => !ProductExtractorService.getComparisonKey(w).includes(w)));
  },

  /**
   * Calcula a similaridade entre dois nomes (0 a 100)
   * Baseado no Índice de Jaccard com pesos para Marca e Modelo
   */
  calculateSimilarity: (nameA: string, nameB: string): number => {
    const tokensA = SimilarityService.tokenize(nameA);
    const tokensB = SimilarityService.tokenize(nameB);

    if (tokensA.size === 0 || tokensB.size === 0) return 0;

    // Interseção e União para Jaccard
    const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
    const union = new Set([...tokensA, ...tokensB]);
    
    let baseScore = (intersection.size / union.size) * 100;

    // Validação de Marca (Incompatibilidade de marca é um bloqueio forte)
    const brandA = ProductExtractorService.detectBrandAndModel(nameA).brand;
    const brandB = ProductExtractorService.detectBrandAndModel(nameB).brand;
    
    if (brandA !== "Generic" && brandB !== "Generic" && brandA !== brandB) {
      baseScore *= 0.3; // Penalidade pesada se as marcas forem diferentes e conhecidas
    }

    // Validação de Modelo
    const modelA = ProductExtractorService.detectBrandAndModel(nameA).model;
    const modelB = ProductExtractorService.detectBrandAndModel(nameB).model;

    if (modelA !== "Standard" && modelB !== "Standard") {
      if (modelA === modelB) baseScore += 20; // Bônus por modelo idêntico
      else baseScore *= 0.5; // Penalidade por modelos diferentes
    }

    // Validação de Categoria
    const catA = ProductExtractorService.detectCategory(nameA);
    const catB = ProductExtractorService.detectCategory(nameB);
    if (catA === catB && catA !== "Outros") baseScore += 10;

    return Math.min(100, Math.floor(baseScore));
  },

  /**
   * Identifica se os produtos são virtualmente idênticos
   */
  isSimilar: (nameA: string, nameB: string): { matches: boolean; score: number } => {
    const score = SimilarityService.calculateSimilarity(nameA, nameB);
    return {
      matches: score >= 80,
      score
    };
  }
};
