import { Category } from "@/assets/types/category";
import { Item } from "@/assets/types/items";
import { supabase } from "@/lib/supabase";

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  return data || [];
};

export const fetchItemsByCategory = async (categoryId: number): Promise<Item[]> => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching items:", error);
    throw error;
  }

  return data || [];
};

export const fetchAllItems = async (): Promise<Item[]> => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all items:", error);
    throw error;
  }

  return data || [];
};

export const fetchItemById = async (id: number): Promise<Item | null> => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching item with id ${id}:`, error);
    throw error;
  }

  return data;
};

// For completeness, keeping the function but it should not be needed
// if your database already stores full URLs
export const getImageUrl = (path: string): string => {
  // If the path is already a full URL, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // For paths that aren't full URLs, generate the URL
  const { data } = supabase.storage.from("items").getPublicUrl(path);
  return data?.publicUrl || "";
};