import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const catogaries_page = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "categories_page",
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

export default catogaries_page;

const styles = StyleSheet.create({});
