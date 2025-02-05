import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter, useSegments } from "expo-router";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasCompletedSetup: boolean;
  setHasCompletedSetup: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signOut: async () => {},
  hasCompletedSetup: false,
  setHasCompletedSetup: () => {},
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
    const inTabsGroup = segments[0] === "(tabs)";

    if (!session && !inAuthGroup) {
      // Not signed in, redirect to sign-in
      router.replace("/(auth)/sign-in");
    } else if (session && !hasCompletedSetup && !inAuthGroup) {
      // Signed in but hasn't completed setup, redirect to account setup
      router.replace("/(auth)/sign-in");
    } else if (session && hasCompletedSetup && inAuthGroup) {
      // Signed in and completed setup, redirect to main app
      router.replace("/(tabs)");
    }
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
      router.replace("/(auth)/sign-in");
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
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
