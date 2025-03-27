import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Item } from "@/assets/types/items";
import { Link, router } from "expo-router";

export const ItemList = ({ item }: { item: Item }) => {
  return (
    <>
      <Pressable
        style={styles.item}
        onPress={() => router.push(`/items/${item.id}`)}
      >
        <View style={styles.itemImageContainer}>
          <Image source={item.heroImage} style={styles.itemImage} />
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
        </View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "48%",
    backgroundColor: "white",
    marginVertical: 8,
    padding: 5,
    borderRadius: 10, // Round the edges
    overflow: "hidden", // Prevent content from overflowing the rounded corners
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for direction
    shadowOpacity: 0.2, // Shadow transparency
    shadowRadius: 4, // Shadow blur radius for a smooth look
    elevation: 3, // Shadow for Android
  },
  itemImageContainer: {
    borderRadius: 10, // Match with parent for uniform rounding
    width: "100%",
    height: 150,
    overflow: "hidden", // Prevent image overflow
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  itemTextContainer: {
    padding: 5,
    alignItems: "flex-start",
    gap: 4,
  },
  itemTitle: {
    fontSize: 16,
    color: "#888",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
