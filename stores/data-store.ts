import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Item {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category_id: number;
  // Add other item properties as needed
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  // Add other category properties as needed
}

interface DataStore {
  items: Item[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  lastFetched: {
    items: number;
    categories: number;
  };
  fetchItems: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  getItemsByCategory: (categoryId: number) => Item[];
  getItemById: (id: number) => Item | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useDataStore = create<DataStore>((set, get) => ({
  items: [],
  categories: [],
  loading: false,
  error: null,
  lastFetched: {
    items: 0,
    categories: 0,
  },

  fetchItems: async () => {
    const now = Date.now();
    const lastFetch = get().lastFetched.items;

    // Return cached data if it's still fresh
    if (now - lastFetch < CACHE_DURATION && get().items.length > 0) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data: items, error } = await supabase
        .from('items')
        .select('*');

      if (error) throw error;

      set({
        items: items || [],
        lastFetched: {
          ...get().lastFetched,
          items: now,
        },
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    const now = Date.now();
    const lastFetch = get().lastFetched.categories;

    // Return cached data if it's still fresh
    if (now - lastFetch < CACHE_DURATION && get().categories.length > 0) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*');

      if (error) throw error;

      set({
        categories: categories || [],
        lastFetched: {
          ...get().lastFetched,
          categories: now,
        },
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  getItemsByCategory: (categoryId: number) => {
    return get().items.filter(item => item.category_id === categoryId);
  },

  getItemById: (id: number) => {
    return get().items.find(item => item.id === id);
  },

  getCategoryBySlug: (slug: string) => {
    return get().categories.find(category => category.slug === slug);
  },
}));