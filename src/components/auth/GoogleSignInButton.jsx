// components/Auth/LoginButton.jsx (or .tsx)
"use client";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function LoginButton() {
  const supabase = createSupabaseBrowserClient()

  const handleGoogleLogin = async () => {
    console.log("Attempting Google Sign In..."); // Add log
    // Basic call without options first
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      // Temporarily remove options like redirectTo
    });

    if (error) {
      console.error("signInWithOAuth Error:", error); // Log the full error object
      alert(`Error: ${error.message}`); // Show error to user
    } else {
      console.log("signInWithOAuth successful (redirect should happen):", data);
    }
  };

  return <button onClick={handleGoogleLogin}>Login with Google</button>;
}