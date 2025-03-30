import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Order, OrderStatus } from "@/assets/types/order";
import { Item } from "@/assets/types/items";
import { useOrderStore } from "@/stores/order-store";

const OrderCard = ({ order }: { order: Order }) => {
  const router = useRouter();

  const handleOrderPress = () => {
    router.push(`/(tabs)/orders/${order.id}`);
  };

  return (
    <Pressable style={styles.orderCard} onPress={handleOrderPress}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>{order.date}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                order.status === "delivered"
                  ? "#E7F6EC"
                  : order.status === "pending"
                  ? "#FFF4E5"
                  : order.status === "shipped"
                  ? "#EDE7F6"
                  : "#FFE8E8",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  order.status === "delivered"
                    ? "#1BC464"
                    : order.status === "pending"
                    ? "#FFA500"
                    : order.status === "shipped"
                    ? "#673AB7"
                    : "#FF4B4B",
              },
            ]}
          >
            {order.status}
          </Text>
        </View>
      </View>

      {order.items.length > 0 ? (
        <FlatList
          data={order.items}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Image source={item.heroImage} style={styles.productImage} />
              <Text style={styles.productTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.orderItemCount}>{order.item}</Text>
      )}

      <View style={styles.orderFooter}>
        <Text style={styles.totalItems}>{order.item}</Text>
        <Text style={styles.totalPrice}>{order.details}</Text>
      </View>
    </Pressable>
  );
};

const OrdersList = ({ status }: { status: OrderStatus }) => {
  const { orders, isLoading, error, fetchOrders } = useOrderStore();
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => order.status === status);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1BC464" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF4B4B" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredOrders}
      renderItem={({ item }) => <OrderCard order={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.ordersList}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color="gray" />
          <Text style={styles.emptyStateText}>
            No {status.toLowerCase()} orders
          </Text>
        </View>
      }
    />
  );
};

export default function OrdersPage() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "pending", title: "Pending" },
    { key: "shipped", title: "Shipped" },
    { key: "delivered", title: "Delivered" },
    { key: "cancelled", title: "Cancelled" },
  ]);

  const renderScene = SceneMap({
    pending: () => <OrdersList status="pending" />,
    shipped: () => <OrdersList status="shipped" />,
    delivered: () => <OrdersList status="delivered" />,
    cancelled: () => <OrdersList status="cancelled" />,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get("window").width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          style={styles.tabBar}
          labelStyle={styles.tabLabel}
          indicatorStyle={styles.tabIndicator}
          activeColor="#1BC464"
          inactiveColor="gray"
          scrollEnabled={true}
          tabStyle={{ width: 'auto' }}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tabLabel: {
    textTransform: "none",
    fontWeight: "600",
    fontSize: 14,
    paddingHorizontal: 8,
  },
  tabIndicator: {
    backgroundColor: "#1BC464",
  },
  ordersList: {
    padding: 15,
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  orderDate: {
    fontSize: 14,
    color: "gray",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  productItem: {
    marginRight: 15,
    width: 100,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: "#1BC464",
    fontWeight: "600",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalItems: {
    fontSize: 14,
    color: "gray",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1BC464",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
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
    marginTop: 10,
    fontSize: 16,
    color: "#FF4B4B",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#1BC464",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  orderItemCount: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
});