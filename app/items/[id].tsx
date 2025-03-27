import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStoreData } from "@/hooks/use-store-data";
import { useCartStore } from "@/stores/cart-store";

export default function ItemPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const itemId = parseInt(id as string, 10);
  const { items, loading, error } = useStoreData();

  // Find the item
  const item = items.find((item) => item.id === itemId);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1BC464" />
        <Text style={styles.loadingText}>Loading item details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error loading item: {error.message}
        </Text>
        <Pressable
          style={styles.backToMenuButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Return to Menu</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView style={styles.container} bounces={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={item?.heroImage} style={styles.heroImage} />
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
        </View>

        {!item ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Item not found</Text>
            <Pressable
              style={styles.backToMenuButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Return to Menu</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Content */}
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
              </View>

              {item.description && (
                <Text style={styles.description}>{item.description}</Text>
              )}

              {item.nutritionalInfo && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Nutritional Information
                  </Text>
                  <Text style={styles.sectionContent}>
                    {item.nutritionalInfo}
                  </Text>
                </View>
              )}
            </View>
            {item.orderable && (
              <View style={styles.footer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.addToCartButton,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                  onPress={() => {
                    const cartItem = {
                      id: item.id,
                      title: item.title,
                      heroImage: item.heroImage,
                      price: item.price,
                      quantity: 1,
                    };

                    useCartStore.getState().addItem(cartItem);

                    // Show feedback to user
                    Alert.alert(
                      "Added to Cart",
                      `${item.title} has been added to your cart.`,
                      [
                        {
                          text: "Continue Shopping",
                          style: "cancel",
                        },
                        {
                          text: "View Cart",
                          onPress: () => router.push("/cart"),
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                  <Text style={styles.addToCartPrice}>
                    ₹{item.price.toFixed(2)}
                  </Text>
                </Pressable>
              </View>
            )}
            {!item.orderable && (
              <View style={styles.unavailableContainer}>
                <Text style={styles.unavailableText}>
                  Currently Unavailable
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1BC464",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  addToCartButton: {
    backgroundColor: "#1BC464",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addToCartText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  addToCartPrice: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  unavailableContainer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  unavailableText: {
    fontSize: 18,
    color: "#FF4B4B",
    fontWeight: "600",
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
  backToMenuButton: {
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
