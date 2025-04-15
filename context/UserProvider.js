"use client";
import {
  useEffect,
  useState,
  createContext,
  useContext, // Import useContext
  useMemo, // Import useMemo
} from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

// Initialize with null for better checking in the hook
export const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Keep loading state

  // Memoize the Supabase client instance if createSupabaseBrowserClient is stable
  // If it creates a new instance every time, this won't help much.
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    // Attempt to get the session on initial load
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user.user_metadata ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error getting initial session:', error);
        setLoading(false);
      });

    // Listen for auth state changes (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user.user_metadata);
        }
        else {
          setSession(null);
          setUser(null);
        }
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Memoize the context value to optimize consumers
  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      session,
      loading,
    }),
    [user, session, loading]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

// --- Custom Hook ---
export function useUser() {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
