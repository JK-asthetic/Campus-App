import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Href, useRouter, useSegments } from "expo-router";

// Define routes for better readability
const ROUTES = {
  SIGN_IN: "/(auth)/sign-in",
  TABS: "/(tabs)",
};

// Define which routes require authentication
const PROTECTED_ROUTES = ["profile", "settings", "create-post"]; // Add your protected routes here

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasCompletedSetup: boolean;
  setHasCompletedSetup: (value: boolean) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signOut: async () => {},
  hasCompletedSetup: false,
  setHasCompletedSetup: () => {},
  isAuthenticated: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(
  session: Session | null,
  loading: boolean,
  hasCompletedSetup: boolean
) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    // Check if current route requires authentication
    const currentRoute = segments[segments.length - 1];
    const requiresAuth = PROTECTED_ROUTES.includes(currentRoute);

    if (requiresAuth && !session) {
      // Only redirect to sign-in if trying to access a protected route without being signed in
      router.replace(ROUTES.SIGN_IN as Href);
    } else if (session && !hasCompletedSetup && !inAuthGroup && requiresAuth) {
      // Only redirect to account setup if accessing a protected route without setup
      router.replace(ROUTES.SIGN_IN as Href);
    } else if (session && hasCompletedSetup && inAuthGroup) {
      // Redirect to main app if already signed in and trying to access auth pages
      router.replace(ROUTES.TABS as Href);
    }
    // In all other cases, let the user view the page normally
  }, [session, segments, loading, hasCompletedSetup]);
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Check if user has completed setup by checking your profile table
        checkUserSetup(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await checkUserSetup(session.user.id);
      } else {
        setHasCompletedSetup(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUserSetup = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles") // Replace with your profile table name
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      // Determine if setup is complete based on your requirements
      const isSetupComplete = data && data.username; // Add your conditions
      setHasCompletedSetup(isSetupComplete);
    } catch (error) {
      console.error("Error checking user setup:", error);
      setHasCompletedSetup(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setHasCompletedSetup(false);
      router.replace(ROUTES.SIGN_IN as Href);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useProtectedRoute(session, loading, hasCompletedSetup);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signOut,
        hasCompletedSetup,
        setHasCompletedSetup,
        isAuthenticated: !!session && hasCompletedSetup,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
