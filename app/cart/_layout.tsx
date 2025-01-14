import { Stack } from "expo-router";

export default function CartLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Shopping Cart",
          headerShown: true,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
