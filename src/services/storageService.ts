import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './productService';
import { useState, useEffect } from 'react';

interface StorageState {
  favorites: Product[];
  history: Product[];
  searchHistory: string[];
  collections: Record<string, Product[]>;
  _hasHydrated: boolean;
  
  toggleFavorite: (product: Product) => void;
  addToHistory: (product: Product) => void;
  addSearch: (query: string) => void;
  createCollection: (name: string) => void;
  addToCollection: (collectionName: string, product: Product) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useStorage = create<StorageState>()(
  persist(
    (set) => ({
      favorites: [],
      history: [],
      searchHistory: [],
      collections: { 'Geral': [] },
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      toggleFavorite: (product) => set((state) => {
        const isFavorite = state.favorites.some(p => p.id === product.id);
        if (isFavorite) {
          return { favorites: state.favorites.filter(p => p.id !== product.id) };
        } else {
          return { favorites: [product, ...state.favorites] };
        }
      }),

      addToHistory: (product) => set((state) => {
        const filteredHistory = state.history.filter(p => p.id !== product.id);
        return { history: [product, ...filteredHistory].slice(0, 50) }; // Keep last 50
      }),

      addSearch: (query) => set((state) => {
        const filtered = state.searchHistory.filter(q => q !== query);
        return { searchHistory: [query, ...filtered].slice(0, 20) };
      }),

      createCollection: (name) => set((state) => ({
        collections: { ...state.collections, [name]: [] }
      })),

      addToCollection: (collectionName, product) => set((state) => {
        const collection = state.collections[collectionName] || [];
        if (collection.some(p => p.id === product.id)) return state;
        return {
          collections: {
            ...state.collections,
            [collectionName]: [...collection, product]
          }
        };
      }),
    }),
    {
      name: 'tiktok-hunter-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);

/**
 * Hook customizado para usar o storage com segurança no Next.js (evita Hydration Mismatch)
 */
export function useHydratedStorage() {
  const storage = useStorage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return {
    ...storage,
    isHydrated: isClient && storage._hasHydrated
  };
}

