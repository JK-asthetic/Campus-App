import { useState, useEffect } from "react";
import { fetchCategories, fetchAllItems } from "@/lib/supabase-service";
import { Item } from "@/assets/types/items";
import { Category } from "@/assets/types/category";
import { supabase } from "@/lib/supabase";

export const useStoreData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get proper image URL for category images
  const getCategoryImageUrl = (path: string) => {
    const { data } = supabase.storage.from("categories").getPublicUrl(path);
    return data?.publicUrl || "";
  };

  // Process items - heroImage is already a full URL so no processing needed
  const processItems = (items: Item[]) => {
    return items.map(item => ({
      ...item,
      // No need to process URLs that are already complete
      heroImage: item.heroImage 
        ? { uri: item.heroImage } 
        : require("@/assets/images/cake-2.jpeg")
    }));
  };

  // Process categories - imageUrl is just a filename that needs to be converted to full URL
  const processCategories = (categories: Category[]) => {
    return categories.map(category => ({
      ...category,
      imageUrl: category.imageUrl 
        ? getCategoryImageUrl(category.imageUrl) 
        : ""
    }));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesData, itemsData] = await Promise.all([
          fetchCategories(),
          fetchAllItems()
        ]);

        setCategories(processCategories(categoriesData));
        setItems(processItems(itemsData));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get items for a specific category
  const getItemsByCategory = (categoryId: number) => {
    return items.filter(item => item.category_id === categoryId);
  };

  // Get a specific item by ID
  const getItemById = (id: number) => {
    return items.find(item => item.id === id);
  };

  return {
    categories,
    items,
    loading,
    error,
    getItemsByCategory,
    getItemById
  };
};