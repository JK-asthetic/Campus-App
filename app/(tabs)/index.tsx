import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React from "react";
import { ItemList } from "@/components/Items-list";
import ListHeader from "@/components/ListHeader";
import { useStoreData } from "@/hooks/use-store-data";
import { router } from "expo-router";

const Home = () => {
  const { items, loading, error, fetchData } = useStoreData();

  // Fetch data when component mounts
  React.useEffect(() => {
    fetchData();
  }, []);

  // Limit items to first 10 (5 rows x 2 columns)
  const limitedItems = items.slice(0, 10);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1BC464" />
        <Text style={styles.loadingText}>Loading items...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error loading items: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={limitedItems}
        renderItem={({ item }) => <ItemList item={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.flatListColumn}
        style={styles.flatList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        }
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  flatListColumn: {
    justifyContent: "space-between",
  },
  flatList: {
    paddingVertical: 5,
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
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  viewAllButton: {
    backgroundColor: "#1BC464",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  viewAllButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
