"use client"
import Script from 'next/script.js';
import POVlib from '../components/POVlib.jsx';
import { UserContext } from '../../context/UserContext.js';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '../lib/supabaseClient.js';

export default function Home() {

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createSupabaseBrowserClient()

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
        console.log('Auth state changed:', _event, session);
        setSession(session);
        console.debug("Session:", session.user.user_metadata);
        session?.user ?? setUser(session.user.user_metadata);
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      console.debug("User changed:", user);
    }
  }, [user]);
  
  return (
    <main>
      <UserContext.Provider value={user}>
        <Script src="https://accounts.google.com/gsi/client" async></Script>
        <POVlib />
      </UserContext.Provider>
    </main>
  )
}