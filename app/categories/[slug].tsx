import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES } from "@/assets/categories";
import { Item } from "@/types/items";

export default function CategoryPage() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Find the current category
  const category = CATEGORIES.find((cat) => cat.slug === slug);

  // Filter items based on search query
  const filteredItems =
    category?.items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

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
          {item.Orderable && (
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
      {!item.Orderable && (
        <View style={styles.unavailableOverlay}>
          <Text style={styles.unavailableText}>Unavailable</Text>
        </View>
      )}
    </Pressable>
  );

  if (!category) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Category not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Return to Menu</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: category.name,
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
            source={{ uri: category.imageUrl }}
            style={styles.categoryImage}
          />
          <Text style={styles.categoryDescription}>{category.name}</Text>
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
                  : `No items in ${category.name}`}
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
});
