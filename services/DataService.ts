import { supabase } from "@/lib/supabase";
import { CacheService } from "./cacheService";

interface Item {
  id: string;
  // Add other item properties
}

interface Category {
  id: string;
  // Add other category properties
}

export class DataService {
  private static CACHE_KEYS = {
    ITEMS: 'items',
    CATEGORIES: 'categories'
  };

  private static CACHE_DURATION = {
    ITEMS: 5 * 60 * 1000, // 5 minutes
    CATEGORIES: 15 * 60 * 1000 // 15 minutes - categories change less frequently
  };

  static async getItems(): Promise<Item[]> {
    // Try to get from cache first
    const cachedItems = CacheService.get<Item[]>(this.CACHE_KEYS.ITEMS);
    if (cachedItems) {
      return cachedItems;
    }

    // If not in cache, fetch from Supabase
    const { data: items, error } = await supabase
      .from('items')
      .select('*');

    if (error) {
      throw error;
    }

    // Store in cache before returning
    CacheService.set(this.CACHE_KEYS.ITEMS, items, this.CACHE_DURATION.ITEMS);
    return items;
  }

  static async getCategories(): Promise<Category[]> {
    // Try to get from cache first
    const cachedCategories = CacheService.get<Category[]>(this.CACHE_KEYS.CATEGORIES);
    if (cachedCategories) {
      return cachedCategories;
    }

    // If not in cache, fetch from Supabase
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      throw error;
    }

    // Store in cache before returning
    CacheService.set(this.CACHE_KEYS.CATEGORIES, categories, this.CACHE_DURATION.CATEGORIES);
    return categories;
  }

  // Optional: Method to force refresh the cache
  static async refreshData(): Promise<void> {
    await Promise.all([
      this.getItems(),
      this.getCategories()
    ]);
  }
}