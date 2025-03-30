import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useOrderStore } from "@/stores/order-store";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Order } from "@/assets/types/order";

export default function OrderConfirmationScreen() {
  const { orderId } = useLocalSearchParams();
  const { getOrderById, isLoading, error: storeError } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      try {
        const orderData = await getOrderById(orderId as string);
        if (orderData) {
          setOrder(orderData);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(storeError || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, getOrderById, storeError]);

  if (loading || isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ADE80" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={84} color="#4ADE80" />
          </View>
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.message}>
            Your order has been successfully placed.
          </Text>
          <View style={styles.orderInfoCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderLabel}>Order Number:</Text>
              <Text style={styles.orderValue}>#{order?.slug}</Text>
            </View>
            <View style={styles.orderInfo}>
              <Text style={styles.orderLabel}>Date:</Text>
              <Text style={styles.orderValue}>{order?.date}</Text>
            </View>
            <View style={styles.orderInfo}>
              <Text style={styles.orderLabel}>Status:</Text>
              <View 
                style={[
                  styles.statusBadge, 
                  { 
                    backgroundColor: order?.status === "delivered" 
                      ? "#E7F6EC" 
                      : order?.status === "pending" 
                      ? "#FFF4E5" 
                      : "#E6F2FF" 
                  }
                ]}
              >
                <Text 
                  style={[
                    styles.statusText, 
                    { 
                      color: order?.status === "delivered" 
                        ? "#1BC464" 
                        : order?.status === "pending" 
                        ? "#FFA500" 
                        : "#0066CC" 
                    }
                  ]}
                >
                  {order?.status.charAt(0).toUpperCase() + order?.status.slice(1)}
                </Text>
              </View>
            </View>
            <View style={styles.orderInfo}>
              <Text style={styles.orderLabel}>Total:</Text>
              <Text style={styles.totalValue}>{order?.details}</Text>
            </View>

            {order?.items && order.items.length > 0 && (
              <View style={styles.orderItemsSummary}>
                <Text style={styles.itemsLabel}>
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>

        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace(`/(tabs)/orders/${order.id}`)}
        >
          <Text style={styles.primaryButtonText}>View Order Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.tertiaryButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  message: {
    fontSize: 18,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  orderInfoCard: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#eee",
  },
  orderInfo: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderLabel: {
    fontSize: 16,
    color: "#666",
  },
  orderValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4ADE80",
  },
  orderItemsSummary: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  itemsLabel: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  instructions: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  button: {
    backgroundColor: "#4ADE80",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#4ADE80",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#E6F2FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: "#0066CC",
    fontSize: 16,
    fontWeight: "600",
  },
  tertiaryButton: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  tertiaryButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});