import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "@/assets/types/category";
import { useStoreData } from "@/hooks/use-store-data";

const CategoryCard = ({ category, itemCount }: { category: Category; itemCount: number }) => (
  <Pressable
    style={({ pressed }) => [
      styles.categoryCard,
      { opacity: pressed ? 0.9 : 1 },
    ]}
    onPress={() => router.push(`/categories/${category.slug}`)}
  >
    <Image source={{ uri: category.imageUrl }} style={styles.categoryImage} />
    <LinearGradient
      colors={["transparent", "rgba(0,0,0,0.8)"]}
      style={styles.gradient}
    />
    <View style={styles.categoryContent}>
      <Text style={styles.categoryName}>{category.name}</Text>
      <View style={styles.categoryInfo}>
        <View style={styles.itemCount}>
          <Ionicons name="restaurant-outline" size={16} color="#fff" />
          <Text style={styles.itemCountText}>
            {itemCount} items
          </Text>
        </View>
        <View style={styles.arrow}>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </View>
      </View>
    </View>
  </Pressable>
);

export default function CategoriesPage() {
  const { categories, items, loading, error, getItemsByCategory } = useStoreData();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading categories: {error.message}</Text>
      </View>
    );
  }

  // Get item count for each category
  const getCategoryItemCount = (categoryId: number) => {
    return items.filter(item => item.category_id === categoryId).length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>
          Explore our wide range of delicious options
        </Text>
      </View>

      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryCard 
            category={item} 
            itemCount={getCategoryItemCount(item.id)} 
          />
        )}
        keyExtractor={(item) => item.slug || item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        }
      />
    </View>
  );
}

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 180;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 16,
  },
  categoryCard: {
    height: CARD_HEIGHT,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: CARD_HEIGHT,
  },
  categoryContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemCount: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  itemCountText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
  },
  arrow: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});