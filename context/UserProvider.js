// context/UserProvider.jsx
"use client";
import { UserContext } from './UserContext';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    // Put the session fetching and auth listener logic here
    setLoading(true);
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user.user_metadata ?? null);
      setLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user.user_metadata ?? null);
        setLoading(false); // Also set loading false on auth change
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Add supabase as dependency if needed, though browser client instance might be stable

  // Optional: You might want to pass loading state too
  const contextValue = {
    user,
    setUser
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}
