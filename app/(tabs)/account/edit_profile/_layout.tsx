import { Stack } from "expo-router";
import { View } from "react-native";

export default function AccountLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
