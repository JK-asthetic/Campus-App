import React from "react";
import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

function TabBarIcon(props: {
  name: React.ComponentProps<typeof AntDesign>["name"];
  color: string;
}) {
  return <AntDesign size={20} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1BC464",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: 10 },
        tabBarStyle: {
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          paddingTop: 10,
          height: 70,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon(props) {
            return <TabBarIcon {...props} name="home" />;
          },
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon(props) {
            return <TabBarIcon {...props} name="menu-fold" />;
          },
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon(props) {
            return <TabBarIcon {...props} name="book" />;
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon(props) {
            return <TabBarIcon {...props} name="user" />;
          },
        }}
      />
    </Tabs>
  );
}
