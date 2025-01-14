import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NotificationItem as NotificationItemType } from "@/assets/types/notification";

interface NotificationItemProps {
  item: NotificationItemType;
}

export const NotificationItem = ({ item }: NotificationItemProps) => {
  const getIconColor = () => {
    switch (item.type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#FF5252";
      case "warning":
        return "#FFC107";
      case "info":
        return "#2196F3";
      default:
        return "#757575";
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${getIconColor()}20` },
        ]}
      >
        <View style={[styles.dot, { backgroundColor: getIconColor() }]} />
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title}</Text>
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newText}>New</Text>
            </View>
          )}
        </View>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  message: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#999999",
  },
  newBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  newText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "500",
  },
});
