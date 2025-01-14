import { StyleSheet, View, FlatList, SafeAreaView } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { notificationData } from "@/assets/notifications";
import { NotificationItem } from "@/components/NotificationItem";

const Notification = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Notification",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#F5F5F5" },
        }}
      />
      <FlatList
        data={notificationData}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  listContainer: {
    padding: 16,
  },
});
