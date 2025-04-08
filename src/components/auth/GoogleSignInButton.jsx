// components/Auth/LoginButton.jsx (or .tsx)
"use client";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function LoginButton() {
  const supabase = createSupabaseBrowserClient()

  const handleGoogleLogin = async () => {
    console.log("Attempting Google Sign In...");
    // Basic call without options first
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {    
        redirectTo: "https://pepxdktfatcqjfpeyrui.supabase.co/auth/v1/callback",
      },
    });

    if (error) {
      console.error("signInWithOAuth Error:", error);
      alert(`Error: ${error.message}`);
    } else {
      console.log("signInWithOAuth successful (redirect should happen):");
      console.debug(data);
    }
  };

  return <button onClick={handleGoogleLogin}>Login with Google</button>;
}