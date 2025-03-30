import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { Order, OrderStatus } from "@/assets/types/order";
import { Item } from "@/assets/types/items";
import { v4 as uuidv4 } from 'uuid';

// Properly define order item type
type OrderItem = {
  item_id: number;
  quantity: number;
  price_at_purchase: number;
};

// Order data structure to match the database schema
type OrderData = {
  items: OrderItem[];
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  notes?: string;
  status: OrderStatus;
};

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  createOrder: (orderData: OrderData) => Promise<string>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (id: string, reason: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          total_amount,
          shipping_address,
          payment_method,
          tracking_number,
          notes,
          created_at,
          order_items (
            id,
            item_id,
            quantity,
            price_at_purchase
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match our Order type
      const orders = data.map((order): Order => {
        return {
          id: order.id,
          slug: order.id.substring(0, 8), // Using first 8 chars of UUID as slug
          status: order.status as OrderStatus,
          date: new Date(order.created_at).toLocaleDateString(),
          item: `${order.order_items.length} item${order.order_items.length !== 1 ? 's' : ''}`,
          details: `$${order.total_amount.toFixed(2)}`,
          items: [], // We'll need to fetch the actual items in a separate call if needed
        };
      });

      set({ orders, isLoading: false });
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({ error: "Failed to fetch orders", isLoading: false });
    }
  },

  getOrderById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          total_amount,
          shipping_address,
          payment_method,
          tracking_number,
          notes,
          created_at,
          order_items (
            id,
            item_id,
            quantity,
            price_at_purchase,
            items (*)
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      // Extract items from order_items
      const items: Item[] = data.order_items.map(item => item.items);

      // Transform to our Order type
      const order: Order = {
        id: data.id,
        slug: data.id.substring(0, 8),
        status: data.status as OrderStatus,
        date: new Date(data.created_at).toLocaleDateString(),
        item: `${data.order_items.length} item${data.order_items.length !== 1 ? 's' : ''}`,
        details: `$${data.total_amount.toFixed(2)}`,
        items: items,
      };

      set({ isLoading: false });
      return order;
    } catch (error) {
      console.error("Error fetching order:", error);
      set({ error: "Failed to fetch order details", isLoading: false });
      return null;
    }
  },

  createOrder: async (orderData: OrderData) => {
    set({ isLoading: true, error: null });
    try {
      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      // Generate a proper UUID string
      const orderId = uuidv4();
      
      // 1. Insert the order
      const { error: orderError } = await supabase
        .from("orders")
        .insert({
          id: orderId,
          user_id: userData.user.id, // Use the actual user ID from auth
          status: orderData.status,
          total_amount: orderData.total_amount,
          shipping_address: orderData.shipping_address,
          payment_method: orderData.payment_method,
          notes: orderData.notes || null,
        });

      if (orderError) throw orderError;

      // 2. Insert order items
      const orderItems = orderData.items.map(item => ({
        id: uuidv4(), // Generate a unique UUID for each item
        order_id: orderId,
        item_id: item.item_id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      set({ isLoading: false });
      return orderId;
    } catch (error) {
      console.error("Error creating order:", error);
      set({ error: error instanceof Error ? error.message : "Failed to create order", isLoading: false });
      throw error;
    }
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      set(state => ({
        orders: state.orders.map(order =>
          order.id === id ? { ...order, status } : order
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating order status:", error);
      set({ error: "Failed to update order status", isLoading: false });
    }
  },

  cancelOrder: async (id: string, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      // First create a cancellation request
      const { error: requestError } = await supabase
        .from("order_change_requests")
        .insert({
          id: uuidv4(),
          order_id: id,
          request_type: "cancel",
          details: reason,
          status: "pending",
        });

      if (requestError) throw requestError;

      // Then update the order status
      const { error: orderError } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (orderError) throw orderError;

      // Update local state
      set(state => ({
        orders: state.orders.map(order =>
          order.id === id ? { ...order, status: "cancelled" } : order
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error cancelling order:", error);
      set({ error: "Failed to cancel order", isLoading: false });
    }
  },
}));