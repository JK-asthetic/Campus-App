import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useCartStore } from "@/stores/cart-store";
import { useOrderStore } from "@/stores/order-store";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { OrderStatus } from "@/assets/types/order";

type PaymentMethod = "creditCard" | "paypal" | "applePay";

export default function CheckoutScreen() {
  const { items, getTotalPrice, resetCart } = useCartStore();
  const { createOrder, isLoading } = useOrderStore();

  // Form state
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("creditCard");
  const [notes, setNotes] = useState("");

  // Payment method options
  const paymentMethods = [
    { id: "creditCard" as PaymentMethod, label: "Credit Card" },
    { id: "paypal" as PaymentMethod, label: "PayPal" },
    { id: "applePay" as PaymentMethod, label: "Apple Pay" },
  ];

  const validateForm = () => {
    if (!shippingAddress.trim()) {
      Alert.alert("Error", "Please enter a shipping address");
      return false;
    }

    if (!paymentMethod) {
      Alert.alert("Error", "Please select a payment method");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (items.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    try {
      const orderData = {
        items: items.map((item) => ({
          item_id: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price,
        })),
        total_amount: parseFloat(getTotalPrice()),
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        notes: notes,
        status: "pending" as OrderStatus,
      };

      const orderId = await createOrder(orderData);

      // Clear cart after successful order placement
      resetCart();

      // Navigate to confirmation screen
      router.replace({
        pathname: "/screens/OrderConfirmationScreen",
        params: { orderId },
      });
    } catch (error) {
      console.error("Order placement failed:", error);
      Alert.alert(
        "Order Failed",
        "We couldn't process your order. Please try again."
      );
    }
  };

  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your shipping address"
            value={shippingAddress}
            onChangeText={setShippingAddress}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                paymentMethod === method.id && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentMethod === method.id &&
                    styles.selectedPaymentOptionText,
                ]}
              >
                {method.label}
              </Text>
              {paymentMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Add any special instructions or notes for your order"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.summaryItem}>
              <Text style={styles.summaryItemTitle}>
                {item.title} × {item.quantity}
              </Text>
              <Text style={styles.summaryItemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>${getTotalPrice()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  notesInput: {
    height: 100,
    textAlignVertical: "top",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPaymentOption: {
    borderColor: "#4ADE80",
    backgroundColor: "rgba(74, 222, 128, 0.1)",
  },
  paymentOptionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedPaymentOptionText: {
    fontWeight: "600",
    color: "#4ADE80",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  summaryItemTitle: {
    fontSize: 16,
  },
  summaryItemPrice: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4ADE80",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  placeOrderButton: {
    backgroundColor: "#4ADE80",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  placeOrderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
