// app/orders/_layout.tsx
import { Stack } from "expo-router";

export default function OrdersLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "My Orders",
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
        name="[id].tsx"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
