import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { useOrderStore } from "@/stores/order-store";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Order, OrderStatus } from "@/assets/types/order";
import { Item } from "@/assets/types/items";

// Status badge component for reuse
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return { bg: "#E7F6EC", text: "#1BC464" };
      case "pending":
        return { bg: "#FFF4E5", text: "#FFA500" };
      case "cancelled":
        return { bg: "#FFE8E8", text: "#FF4B4B" };
      case "shipped":
        return { bg: "#E6F2FF", text: "#0066CC" };
      default:
        return { bg: "#F5F5F5", text: "#666666" };
    }
  };

  const colors = getStatusColor(status);

  return (
    <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.statusText, { color: colors.text }]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
};

// OrderTimeline to show order progress
const OrderTimeline = ({ status }: { status: OrderStatus }) => {
  const getStepStatus = (step: string) => {
    const statusOrder = ["pending", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(step);

    if (status === "cancelled") {
      return { completed: false, active: false };
    }

    if (stepIndex <= currentIndex) {
      return { completed: true, active: stepIndex === currentIndex };
    }

    return { completed: false, active: false };
  };

  return (
    <View style={styles.timeline}>
      {["pending", "shipped", "delivered"].map((step, index) => {
        const { completed, active } = getStepStatus(step);
        return (
          <View key={step} style={styles.timelineStep}>
            <View style={styles.timelineStepContent}>
              <View
                style={[
                  styles.timelineCircle,
                  completed && styles.timelineCircleCompleted,
                  active && styles.timelineCircleActive,
                ]}
              >
                {completed && (
                  <Ionicons name="checkmark" size={12} color="#fff" />
                )}
              </View>
              <Text
                style={[
                  styles.timelineText,
                  active && styles.timelineTextActive,
                  completed && styles.timelineTextCompleted,
                ]}
              >
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </Text>
            </View>
            {index < 2 && (
              <View
                style={[
                  styles.timelineLine,
                  completed && styles.timelineLineCompleted,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

export default function OrderDetailsPage() {
  const { id } = useLocalSearchParams();
  const {
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    isLoading,
    error: storeError,
  } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      try {
        const orderData = await getOrderById(id as string);
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
  }, [id, getOrderById, storeError]);

  const handleCancelOrder = () => {
    if (!order) return;

    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          Alert.prompt(
            "Cancellation Reason",
            "Please provide a reason for cancellation:",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Submit",
                onPress: async (reason: string) => {
                  if (reason.trim()) {
                    try {
                      await cancelOrder(order.id, reason);
                      setOrder((prev) =>
                        prev
                          ? { ...prev, status: "cancelled" as OrderStatus }
                          : null
                      );
                      Alert.alert(
                        "Success",
                        "Order has been cancelled successfully"
                      );
                    } catch (err) {
                      Alert.alert("Error", "Failed to cancel order");
                    }
                  } else {
                    Alert.alert(
                      "Error",
                      "Please provide a reason for cancellation"
                    );
                  }
                },
              },
            ],
            "plain-text"
          );
        },
      },
    ]);
  };

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;

    try {
      await updateOrderStatus(order.id, newStatus);
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      Alert.alert("Success", `Order status updated to ${newStatus}`);
    } catch (err) {
      Alert.alert("Error", "Failed to update order status");
    }
  };

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
          onPress={() => router.replace("/(tabs)/orders")}
        >
          <Text style={styles.buttonText}>Back to Orders</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Order #${order.slug}`,
          headerBackTitle: "Orders",
        }}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.orderMeta}>
              <Text style={styles.orderDate}>Placed on {order.date}</Text>
              <StatusBadge status={order.status} />
            </View>

            {order.status !== "cancelled" && (
              <OrderTimeline status={order.status} />
            )}

            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Order Total</Text>
              <Text style={styles.totalValue}>{order.details}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items</Text>
            <FlatList
              data={order.items}
              scrollEnabled={false}
              renderItem={({ item }: { item: Item }) => (
                <View style={styles.itemCard}>
                  {item.heroImage && (
                    <Image
                      source={
                        typeof item.heroImage === "string"
                          ? { uri: item.heroImage }
                          : item.heroImage
                      }
                      style={styles.itemImage}
                    />
                  )}
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemPrice}>
                      ${item.price?.toFixed(2)}
                    </Text>
                    {item.quantity && (
                      <Text style={styles.itemQuantity}>
                        Qty: {item.quantity}
                      </Text>
                    )}
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <View style={styles.emptyItems}>
                  <Ionicons name="cart-outline" size={48} color="#ddd" />
                  <Text style={styles.emptyItemsText}>No items found</Text>
                </View>
              }
            />
          </View>

          {order.shipping_address && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Shipping Address</Text>
              <View style={styles.infoCard}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color="#666"
                  style={styles.infoIcon}
                />
                <Text style={styles.addressText}>{order.shipping_address}</Text>
              </View>
            </View>
          )}

          {order.payment_method && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.infoCard}>
                <Ionicons
                  name="card-outline"
                  size={18}
                  color="#666"
                  style={styles.infoIcon}
                />
                <Text style={styles.paymentText}>{order.payment_method}</Text>
              </View>
            </View>
          )}

          {order.tracking_number && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tracking</Text>
              <View style={styles.trackingInfo}>
                <View style={styles.trackingNumberContainer}>
                  <Ionicons
                    name="navigate-outline"
                    size={18}
                    color="#666"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.trackingNumber}>
                    {order.tracking_number}
                  </Text>
                </View>
                <TouchableOpacity style={styles.trackingButton}>
                  <Text style={styles.trackingButtonText}>Track Package</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {order.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Notes</Text>
              <View style={styles.infoCard}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color="#666"
                  style={styles.infoIcon}
                />
                <Text style={styles.notesText}>{order.notes}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Action buttons based on order status */}
        {order.status !== "cancelled" && order.status !== "delivered" && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelOrder}
            >
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>

            {/* Admin actions - can be conditionally shown based on user role */}
            {/* <View style={styles.adminActions}>
              <Text style={styles.adminActionsTitle}>Admin Actions</Text>
              <View style={styles.statusButtons}>
                {["pending", "shipped", "delivered"].map(
                  (statusOption) =>
                    statusOption !== order.status && (
                      <TouchableOpacity
                        key={statusOption}
                        style={[
                          styles.statusButton,
                          {
                            backgroundColor: getStatusColor(
                              statusOption as OrderStatus
                            ).bg,
                            borderColor: getStatusColor(
                              statusOption as OrderStatus
                            ).text,
                          },
                        ]}
                        onPress={() =>
                          handleUpdateStatus(statusOption as OrderStatus)
                        }
                      >
                        <Text
                          style={[
                            styles.statusButtonText,
                            {
                              color: getStatusColor(statusOption as OrderStatus)
                                .text,
                            },
                          ]}
                        >
                          Mark as {statusOption}
                        </Text>
                      </TouchableOpacity>
                    )
                )}
              </View>
            </View> */}
          </View>
        )}

        {order.status === "delivered" && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => console.log("Leave a review")}
            >
              <Text style={styles.reviewButtonText}>Write a Review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reorderButton}
              onPress={() => console.log("Reorder")}
            >
              <Text style={styles.reorderButtonText}>Order Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {order.status === "cancelled" && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.reorderButton}
              onPress={() => console.log("Reorder")}
            >
              <Text style={styles.reorderButtonText}>Order Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case "delivered":
      return { bg: "#E7F6EC", text: "#1BC464" };
    case "pending":
      return { bg: "#FFF4E5", text: "#FFA500" };
    case "cancelled":
      return { bg: "#FFE8E8", text: "#FF4B4B" };
    case "shipped":
      return { bg: "#E6F2FF", text: "#0066CC" };
    default:
      return { bg: "#F5F5F5", text: "#666666" };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    paddingBottom: 20,
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
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  orderMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  orderDate: {
    fontSize: 15,
    color: "#666",
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
  timeline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  timelineStep: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  timelineStepContent: {
    alignItems: "center",
  },
  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  timelineCircleCompleted: {
    backgroundColor: "#4ADE80",
    borderColor: "#4ADE80",
  },
  timelineCircleActive: {
    borderColor: "#4ADE80",
    borderWidth: 2,
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
  },
  timelineLineCompleted: {
    backgroundColor: "#4ADE80",
  },
  timelineText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  timelineTextActive: {
    color: "#4ADE80",
    fontWeight: "500",
  },
  timelineTextCompleted: {
    color: "#666",
    fontWeight: "500",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4ADE80",
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  itemCard: {
    flexDirection: "row",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333",
  },
  itemPrice: {
    fontSize: 15,
    color: "#4ADE80",
    fontWeight: "600",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  emptyItems: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyItemsText: {
    marginTop: 10,
    fontSize: 16,
    color: "#999",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  addressText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  paymentText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  trackingInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  trackingNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackingNumber: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  trackingButton: {
    backgroundColor: "#E6F2FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  trackingButtonText: {
    color: "#0066CC",
    fontSize: 14,
    fontWeight: "500",
  },
  notesText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButton: {
    backgroundColor: "#FFE8E8",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  cancelButtonText: {
    color: "#FF4B4B",
    fontSize: 16,
    fontWeight: "600",
  },
  reviewButton: {
    backgroundColor: "#E6F2FF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  reviewButtonText: {
    color: "#0066CC",
    fontSize: 16,
    fontWeight: "600",
  },
  reorderButton: {
    backgroundColor: "#4ADE80",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  reorderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  adminActions: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  adminActionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },
  statusButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statusButton: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
});