// app/_layout.tsx

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "@/components/OnboardingScreen";
import AuthProvider from "@/providers/auth-provider";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

const ONBOARDING_KEY = "has_seen_onboarding";

export default function RootLayout() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<"order" | "payment">(
    "order"
  );

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      checkOnboardingStatus();
    }
  }, [loaded]);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (value !== "true") {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  };

  const handleOnboardingComplete = async () => {
    if (onboardingStep === "order") {
      setOnboardingStep("payment");
    } else {
      try {
        await AsyncStorage.setItem(ONBOARDING_KEY, "true");
        setShowOnboarding(false);
      } catch (error) {
        console.error("Error saving onboarding status:", error);
      }
    }
  };

  if (!loaded) {
    return null;
  }

  if (showOnboarding) {
    return (
      <OnboardingScreen
        type={onboardingStep}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: "Shop" }}
        />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="categories"
          options={{ headerShown: false, title: "Categories" }}
        />
        <Stack.Screen
          name="items"
          options={{ headerShown: false, title: "Items" }}
        />
        <Stack.Screen
          name="notifications"
          options={{ headerShown: false, title: "Notifications" }}
        />
        <Stack.Screen
          name="cart"
          options={{
            presentation: "modal",
            title: "Shopping Cart",
            headerShown: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
