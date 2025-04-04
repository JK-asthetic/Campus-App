import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStoreData } from "@/hooks/use-store-data";
import { Item } from "@/assets/types/items";

export default function CategoryPage() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Use the store
  const {
    categories,
    loading,
    error,
    fetchData,
    getItemsByCategory,
    getCategoryBySlug,
  } = useStoreData();

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Find the current category using the store helper
  const category = getCategoryBySlug(slug as string);

  // Get items for this category using the store helper
  const categoryItems = category ? getItemsByCategory(category.id) : [];

  // Filter items based on search query
  const filteredItems = categoryItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Rest of your component remains the same...
  const MenuCard = ({ item }: { item: Item }) => (
    <Pressable
      style={({ pressed }) => [styles.menuCard, { opacity: pressed ? 0.9 : 1 }]}
      onPress={() => router.push(`/items/${item.id}`)}
    >
      <Image source={item.heroImage} style={styles.menuImage} />
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.title}</Text>
        <View style={styles.menuBottom}>
          <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
          {item.orderable && (
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                { opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={() => console.log("Add to cart:", item.title)}
            >
              <Ionicons name="add" size={20} color="white" />
            </Pressable>
          )}
        </View>
      </View>
      {!item.orderable && (
        <View style={styles.unavailableOverlay}>
          <Text style={styles.unavailableText}>Unavailable</Text>
        </View>
      )}
    </Pressable>
  );
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1BC464" />
        <Text style={styles.loadingText}>Loading category...</Text>
      </View>
    );
  }

  // Rest of your render logic remains the same...

  return (
    <>
      <Stack.Screen
        options={{
          title: category?.name,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                padding: 8,
              })}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
          ),
        }}
      />

      <View style={styles.container}>
        {/* Category Header */}
        <View style={styles.categoryHeader}>
          <Image
            source={{ uri: category?.imageUrl }}
            style={styles.categoryImage}
          />
          <Text style={styles.categoryDescription}>{category?.name}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="gray" />
            <TextInput
              placeholder="Search in this category..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="gray"
            />
          </View>
        </View>

        {/* Items Grid */}
        <FlatList
          data={filteredItems}
          renderItem={({ item }) => <MenuCard item={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.menuGrid}
          contentContainerStyle={styles.menuList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={48} color="gray" />
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? "No items found"
                  : `No items in ${category?.name}`}
              </Text>
            </View>
          }
        />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  categoryHeader: {
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  categoryDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  menuGrid: {
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  menuList: {
    paddingVertical: 15,
  },
  menuCard: {
    width: Dimensions.get("window").width / 2 - 23,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  menuImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  menuInfo: {
    padding: 12,
  },
  menuName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  menuBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1BC464",
  },
  addButton: {
    backgroundColor: "#1BC464",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  unavailableText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF4B4B",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#1BC464",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
