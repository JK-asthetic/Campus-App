import { Stack } from "expo-router";
import { View } from "react-native";

export default function AccountLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "My Account",
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
      <Stack.Screen
        name="edit_profile"
        options={{
          headerTitle: "My Account",
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
}