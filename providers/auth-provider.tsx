import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Href, useRouter, useSegments } from "expo-router";

// Define routes for better readability
const ROUTES = {
  SIGN_IN: "/(auth)/sign-in",
  TABS: "/(tabs)",
  PROFILE_SETUP: "/(auth)/profile-setup",
};

// Define which routes require authentication
const PROTECTED_ROUTES = ["profile", "settings", "create-post"];

// Define the Profile type based on your Supabase table structure
export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  city: string | null;
  country: string | null;
  updated_at: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasCompletedSetup: boolean;
  setHasCompletedSetup: (value: boolean) => void;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<Profile>) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  hasCompletedSetup: false,
  setHasCompletedSetup: () => {},
  isAuthenticated: false,
  updateProfile: async () => ({ success: false, error: null }),
  refreshProfile: async () => {},
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

    // Check if current route requires authentication
    const currentRoute = segments[segments.length - 1];
    const requiresAuth = PROTECTED_ROUTES.includes(currentRoute);

    if (requiresAuth && !session) {
      // Redirect to sign-in if trying to access a protected route without being signed in
      router.replace(ROUTES.SIGN_IN as Href);
    } else if (session && !hasCompletedSetup && !inAuthGroup && requiresAuth) {
      // Redirect to profile setup if accessing a protected route without completing setup
      router.replace(ROUTES.PROFILE_SETUP as Href);
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const router = useRouter();

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      // Set profile data
      setProfile(data as Profile);

      // Determine if setup is complete based on username presence
      const isSetupComplete = data && data.username;
      setHasCompletedSetup(isSetupComplete);

      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
      setHasCompletedSetup(false);
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) throw new Error("User is not authenticated");

      // Ensure we're not updating the ID
      const { id, ...updateData } = updates;

      // Add updated_at timestamp
      const updatedData = {
        ...updateData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updatedData)
        .eq("id", user.id);

      if (error) throw error;

      // Refresh profile after update
      await refreshProfile();

      return { success: true, error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error as Error };
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);

        if (session) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user || null);

      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setHasCompletedSetup(false);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
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
        user,
        profile,
        loading,
        signOut,
        hasCompletedSetup,
        setHasCompletedSetup,
        isAuthenticated: !!session && hasCompletedSetup,
        updateProfile,
        refreshProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
