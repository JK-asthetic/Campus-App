// app/menu/_layout.tsx
import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown:false
        }}
      />
    </Stack>
  );
}