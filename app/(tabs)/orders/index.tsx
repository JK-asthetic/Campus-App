// app/orders/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ORDERS } from "@/assets/orders";

const OrderCard = ({ order }: { order: Order }) => (
  <Pressable
    style={styles.orderCard}
    onPress={() => console.log(`Navigate to order ${order.id}`)}
  >
    <View style={styles.orderHeader}>
      <Text style={styles.orderDate}>
        {new Date(order.date).toLocaleDateString()}
      </Text>
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              order.status === "Completed"
                ? "#E7F6EC"
                : order.status === "Pending"
                ? "#FFF4E5"
                : "#FFE8E8",
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            {
              color:
                order.status === "Completed"
                  ? "#1BC464"
                  : order.status === "Pending"
                  ? "#FFA500"
                  : "#FF4B4B",
            },
          ]}
        >
          {order.status}
        </Text>
      </View>
    </View>

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

    <View style={styles.orderFooter}>
      <Text style={styles.totalItems}>{order.items.length} items</Text>
      <Text style={styles.totalPrice}>
        Total: $
        {order.items.reduce((sum: number, item: { price: any; }) => sum + item.price, 0).toFixed(2)}
      </Text>
    </View>
  </Pressable>
);

const OrdersList = ({ status }: { status: Order["status"] }) => {
  const filteredOrders = ORDERS.filter((order) => order.status === status);

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
    { key: "completed", title: "Completed" },
    { key: "cancelled", title: "Cancelled" },
  ]);

  const renderScene = SceneMap({
    pending: () => <OrdersList status="Pending" />,
    completed: () => <OrdersList status="Completed" />,
    cancelled: () => <OrdersList status="Cancelled" />,
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
  },
  tabIndicator: {
    backgroundColor: "#1BC464",
  },
  ordersList: {
    padding: 15,
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
});
