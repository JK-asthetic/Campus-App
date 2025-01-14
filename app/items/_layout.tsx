import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const items_details = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Item_page",
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

export default items_details;

const styles = StyleSheet.create({});
