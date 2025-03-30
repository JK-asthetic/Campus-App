import { create } from 'zustand';
import { fetchCategories, fetchAllItems } from "@/lib/supabase-service";
import { Item } from "@/assets/types/items";
import { Category } from "@/assets/types/category";
import { supabase } from "@/lib/supabase";

interface StoreState {
  categories: Category[];
  items: Item[];
  loading: boolean;
  error: Error | null;
  lastFetched: {
    items: number;
    categories: number;
  };
  fetchData: () => Promise<void>;
  getItemsByCategory: (categoryId: number) => Item[];
  getItemById: (id: number) => Item | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useStoreData = create<StoreState>((set, get) => ({
  categories: [],
  items: [],
  loading: true,
  error: null,
  lastFetched: {
    items: 0,
    categories: 0,
  },

  fetchData: async () => {
    const now = Date.now();
    const { lastFetched } = get();

    // Return if cache is still fresh and we have data
    if (
      now - lastFetched.items < CACHE_DURATION &&
      now - lastFetched.categories < CACHE_DURATION &&
      get().items.length > 0 &&
      get().categories.length > 0
    ) {
      return;
    }

    try {
      set({ loading: true, error: null });
      
      const [categoriesData, itemsData] = await Promise.all([
        fetchCategories(),
        fetchAllItems()
      ]);

      // Process categories - convert imageUrl to full URL
      const processedCategories = categoriesData.map(category => ({
        ...category,
        imageUrl: category.imageUrl 
          ? supabase.storage.from("categories").getPublicUrl(category.imageUrl).data?.publicUrl 
          : ""
      }));

      // Process items - ensure heroImage is proper format
      const processedItems = itemsData.map(item => ({
        ...item,
        heroImage: item.heroImage 
          ? { uri: item.heroImage } 
          : require("@/assets/images/cake-2.jpeg")
      }));

      set({
        categories: processedCategories,
        items: processedItems,
        lastFetched: {
          items: now,
          categories: now,
        }
      });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err : new Error('An unknown error occurred')
      });
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
  }
}));