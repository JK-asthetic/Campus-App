import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const Notification_layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Notifications",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
        }}
      />
    </Stack>
  );
};

export default Notification_layout;

const styles = StyleSheet.create({});
