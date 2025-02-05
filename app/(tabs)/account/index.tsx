import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useAuth } from "@/providers/auth-provider";

// This would normally come from your auth context/store
const mockUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
  joinDate: "January 2024",
  totalOrders: 25,
};

type MenuOptionProps = {
  icon: keyof typeof Ionicons.glyphMap; // This ensures the icon name is valid
  title: string;
  subtitle?: string; // Making subtitle optional with ?
  onPress: () => void;
};

export default function AccountPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // The redirect will be handled automatically by the auth provider
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  const MenuOption: React.FC<MenuOptionProps> = ({
    icon,
    title,
    subtitle,
    onPress,
  }) => (
    <Pressable
      style={({ pressed }) => [
        styles.menuOption,
        { opacity: pressed ? 0.8 : 1 },
      ]}
      onPress={onPress}
    >
      <View style={styles.menuOptionLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color="#1BC464" />
        </View>
        <View>
          <Text style={styles.menuOptionTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.menuOptionSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="gray" />
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{mockUserData.name}</Text>
        <Text style={styles.userEmail}>{mockUserData.email}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockUserData.totalOrders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuSection}>
        <MenuOption
          icon="person-outline"
          title="Personal Details"
          subtitle="Update your information"
          onPress={() => console.log("Navigate to personal details")}
        />
        <MenuOption
          icon="receipt-outline"
          title="Order History"
          subtitle="View your past orders"
          onPress={() => router.push("/(tabs)")}
        />
        <MenuOption
          icon="card-outline"
          title="Payment Methods"
          subtitle="Manage your payment options"
          onPress={() => console.log("Navigate to payments")}
        />
        <MenuOption
          icon="settings-outline"
          title="Settings"
          subtitle="App preferences"
          onPress={() => console.log("Navigate to settings")}
        />
      </View>

      {/* Sign Out Button */}
      <Pressable
        style={({ pressed }) => [
          styles.signOutButton,
          { opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={24} color="#FF4B4B" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    backgroundColor: "#f8f8f8",
    borderRadius: 15,
    padding: 15,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#e0e0e0",
    marginHorizontal: 15,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1BC464",
  },
  statLabel: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  menuSection: {
    padding: 15,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f8f4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuOptionTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  menuOptionSubtitle: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 15,
    backgroundColor: "#FFF2F2",
    borderRadius: 12,
  },
  signOutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#FF4B4B",
  },
});
