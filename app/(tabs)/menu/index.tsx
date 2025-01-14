// // app/menu/index.tsx
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   Pressable,
//   FlatList,
//   Dimensions,
//   TextInput,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { Category } from "@/types/categories";
// import { Item } from "@/types/items";
// import { CATEGORIES } from "@/assets/categories"; // Import your categories data
// import { router } from "expo-router";

// const MenuCard = ({ item }: { item: Item }) => (
//   <Pressable
//     style={({ pressed }) => [styles.menuCard, { opacity: pressed ? 0.9 : 1 }]}
//     onPress={() => router.push(`/items/${item.id}`)}
//   >
//     <Image source={item.heroImage} style={styles.menuImage} />
//     <View style={styles.menuInfo}>
//       <Text style={styles.menuName}>{item.title}</Text>
//       <View style={styles.menuBottom}>
//         <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
//         {item.Orderable && (
//           <Pressable
//             style={({ pressed }) => [
//               styles.addButton,
//               { opacity: pressed ? 0.8 : 1 },
//             ]}
//             onPress={() => console.log("Add to cart:", item.title)}
//           >
//             <Ionicons name="add" size={20} color="white" />
//           </Pressable>
//         )}
//       </View>
//     </View>
//     {!item.Orderable && (
//       <View style={styles.unavailableOverlay}>
//         <Text style={styles.unavailableText}>Unavailable</Text>
//       </View>
//     )}
//   </Pressable>
// );

// const CategoryButton = ({
//   category,
//   isSelected,
//   onPress,
// }: {
//   category: Category;
//   isSelected: boolean;
//   onPress: () => void;
// }) => (
//   <Pressable
//     style={({ pressed }) => [
//       styles.categoryButton,
//       isSelected && styles.categoryButtonSelected,
//       { opacity: pressed ? 0.8 : 1 },
//     ]}
//     onPress={onPress}
//   >
//     <Image source={{ uri: category.imageUrl }} style={styles.categoryImage} />
//     <Text
//       style={[styles.categoryName, isSelected && styles.categoryNameSelected]}
//     >
//       {category.name}
//     </Text>
//   </Pressable>
// );

// export default function MenuPage() {
//   const [selectedCategory, setSelectedCategory] = useState<string>(
//     CATEGORIES[0].slug
//   );
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   // Filter items based on selected category and search query
//   const currentCategory = CATEGORIES.find(
//     (cat) => cat.slug === selectedCategory
//   );
//   const filteredItems =
//     currentCategory?.items.filter((item) =>
//       item.title.toLowerCase().includes(searchQuery.toLowerCase())
//     ) || [];

//   return (
//     <View style={styles.container}>
//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <View style={styles.searchBar}>
//           <Ionicons name="search-outline" size={20} color="gray" />
//           <TextInput
//             placeholder="Search menu items..."
//             style={styles.searchInput}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor="gray"
//           />
//         </View>
//       </View>

//       {/* Categories */}
//       <View style={styles.categoriesContainer}>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoriesScroll}
//         >
//           {CATEGORIES.map((category) => (
//             <CategoryButton
//               key={category.slug}
//               category={category}
//               isSelected={selectedCategory === category.slug}
//               onPress={() => setSelectedCategory(category.slug)}
//             />
//           ))}
//         </ScrollView>
//       </View>

//       {/* Menu Items Grid */}
//       <FlatList
//         data={filteredItems}
//         renderItem={({ item }) => <MenuCard item={item} />}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={2}
//         columnWrapperStyle={styles.menuGrid}
//         contentContainerStyle={styles.menuList}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <Ionicons name="restaurant-outline" size={48} color="gray" />
//             <Text style={styles.emptyStateText}>
//               {searchQuery
//                 ? "No items found"
//                 : `No items in ${currentCategory?.name}`}
//             </Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   searchContainer: {
//     padding: 15,
//     backgroundColor: "#fff",
//   },
//   searchBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 25,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   categoriesContainer: {
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   categoriesScroll: {
//     paddingHorizontal: 15,
//     gap: 15,
//   },
//   categoryButton: {
//     alignItems: "center",
//     backgroundColor: "#f8f8f8",
//     borderRadius: 15,
//     padding: 10,
//     width: 100,
//   },
//   categoryButtonSelected: {
//     backgroundColor: "#E7F6EC",
//   },
//   categoryImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginBottom: 8,
//   },
//   categoryName: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "gray",
//   },
//   categoryNameSelected: {
//     color: "#1BC464",
//     fontWeight: "600",
//   },
//   menuGrid: {
//     justifyContent: "space-between",
//     paddingHorizontal: 15,
//   },
//   menuList: {
//     paddingVertical: 15,
//   },
//   menuCard: {
//     width: Dimensions.get("window").width / 2 - 23,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     marginBottom: 15,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//     overflow: "hidden",
//   },
//   menuImage: {
//     width: "100%",
//     height: 120,
//     resizeMode: "cover",
//   },
//   menuInfo: {
//     padding: 12,
//   },
//   menuName: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 8,
//   },
//   menuBottom: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   menuPrice: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#1BC464",
//   },
//   addButton: {
//     backgroundColor: "#1BC464",
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   unavailableOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(255, 255, 255, 0.8)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   unavailableText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#FF4B4B",
//   },
//   emptyState: {
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 40,
//   },
//   emptyStateText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "gray",
//   },
// });

// app/categories/index.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { CATEGORIES } from "@/assets/categories";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "@/assets/types/category";

const CategoryCard = ({ category }: { category: Category }) => (
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
            {category.items.length} items
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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>
          Explore our wide range of delicious options
        </Text>
      </View>

      <FlatList
        data={CATEGORIES}
        renderItem={({ item }) => <CategoryCard category={item} />}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
});
