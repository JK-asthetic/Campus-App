import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useAuth } from "@/providers/auth-provider";
import { useStoreData } from "@/hooks/use-store-data";
import { ActivityIndicator } from "react-native";
import { Category } from "@/assets/types/category";

const ListHeader = () => {
  const { profile, user } = useAuth();
  const { categories, loading, error, fetchData } = useStoreData();

  // Fetch data when component mounts
  React.useEffect(() => {
    fetchData();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <View style={[styles.headerContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#1BC464" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={[styles.headerContainer, styles.errorContainer]}>
        <Text style={styles.errorText}>
          Failed to load categories. Please try again later.
        </Text>
        <Text style={styles.errorDetailText}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.headerContainer]}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
              }}
              style={styles.avatarImage}
            />
            <View style={styles.userInfoContainer}>
              <Text style={styles.avatarText}>
                {profile?.full_name || user?.email}
              </Text>
              <Text style={styles.subtitleText}>Welcome back! 👋</Text>
            </View>
          </View>
        </View>
        <View style={[styles.headerRight]}>
          <Link href={`/cart`} asChild>
            <Pressable>
              {({ pressed }) => (
                <View
                  style={[styles.iconContainer, { opacity: pressed ? 0.5 : 1 }]}
                >
                  <AntDesign name="shoppingcart" size={25} color="gray" />
                </View>
              )}
            </Pressable>
          </Link>
          <Link href={`/notifications`} asChild>
            <Pressable>
              {({ pressed }) => (
                <View
                  style={[styles.iconContainer, { opacity: pressed ? 0.5 : 1 }]}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={25}
                    color="gray"
                  />
                </View>
              )}
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.heroContainer}>
        <Image
          source={require("../assets/images/main_image.jpeg")}
          style={styles.heroImage}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Pressable onPress={() => router.push("/menu")}>
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>
        <FlatList
          data={categories}
          renderItem={({ item }: { item: Category }) => (
            <Link asChild href={`/categories/${item.slug}`}>
              <Pressable style={styles.category}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.categoryImage}
                />
                <Text style={styles.categoryText}>{item.name}</Text>
              </Pressable>
            </Link>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default ListHeader;
const styles = StyleSheet.create({
  headerContainer: {
    gap: 15,
    marginTop: 5,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
  },
  userInfoContainer: {
    justifyContent: "center",
  },
  subtitleText: {
    fontSize: 12,
    color: "gray",
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  cartContainer: {
    padding: 10,
  },
  signOutButton: {
    padding: 10,
  },
  heroContainer: {
    width: "100%",
    padding: 5,
    height: 200,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 40,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesHeader: {
    flexDirection: "row", // Align items horizontally
    justifyContent: "space-between", // Space between title and "View All"
    alignItems: "center", // Align items vertically
    marginBottom: 10, // Add spacing below the header
  },
  sectionTitle: {
    fontSize: 20, // Keeps the large text size
    fontWeight: "bold", // Emphasizes the title
    fontFamily: "Arial", // Replace with a custom font if needed
    letterSpacing: 1, // Adds spacing between letters
    lineHeight: 30, // Increases vertical spacing for better readability
    color: "#1A202C", // A rich dark color (adjust as needed)
  },

  viewAllText: {
    fontSize: 13,
    color: "#1BC464",
    fontWeight: "bold",
  },
  category: {
    width: 100,
    alignItems: "center",
    marginBottom: 16,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    textAlign: "center",
  },

  badgeContainer: {
    position: "absolute",
    top: -5,
    right: 10,
    backgroundColor: "#1BC464",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  iconContainer: {
    width: 45, // Width of the circle
    height: 45, // Height of the circle
    borderRadius: 22.5, // Half of width/height for a perfect circle
    borderWidth: 2, // Thickness of the circular outline
    borderColor: "lightgray", // Light gray outline
    justifyContent: "center", // Center the icon vertically
    alignItems: "center", // Center the icon horizontally
    marginRight: 15, // Add spacing between icons
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF4B4B",
    marginBottom: 10,
    textAlign: "center",
  },
  errorDetailText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
