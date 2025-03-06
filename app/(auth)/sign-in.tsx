import { View, StyleSheet, ActivityIndicator } from "react-native";
import Auth from "@/components/Auth";
import Account from "@/components/Account";
import { useAuth } from "@/providers/auth-provider";

export default function SignIn() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Auth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});
