"use client"
// components/GoogleSignInButton.tsx
import { useContext, useEffect, useRef, useState } from 'react'; // Import useState
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import Script from 'next/script';
import LoadingInline from '@/components/loading/LoadingInline'
import { UserContext } from '../../../context/UserContext';
import { useRouter } from 'next/navigation';

const GoogleSignInButton = () => {

  const supabase = createSupabaseBrowserClient();
  const googleButtonRef = useRef(null);
  const [isScriptReady, setIsScriptReady] = useState(false);
  const {user, setUser} = useContext(UserContext);
  const router = useRouter();

  const handleGoogleSignIn = async (response) => {
    // ... (keep the existing handleGoogleSignIn function exactly as it was) ...
    console.log('Google Credential Response received:', response);
    if (!response.credential) {
      console.error('Google Sign-In failed: No credential returned.');
      // TODO: Add user-facing error handling
      return;
    }
    console.log('Attempting Supabase sign-in with ID token...');
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    });
    if (error) {
      console.error('Supabase Sign-In Error:', error.message);
      // TODO: Add user-facing error handling
    } else {
      console.log('Supabase Sign-In Success:', data);
      setUser(data?.user.user_metadata);
      router.push('/');
    }
  };

  // This function will be called by the Script component's onReady prop
  const handleScriptLoad = () => {
    console.log('Google GSI Script loaded successfully via onReady.');
    setIsScriptReady(true); // Set state to true when script is ready
  };

  // Effect to initialize and render the button *after* the script is ready
  useEffect(() => {
    // Only proceed if the script is ready AND the button ref exists
    if (isScriptReady && googleButtonRef.current) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      /* console.log('Script is ready, attempting to initialize Google Identity Services...');
      console.log('Using Google Client ID:', clientId); */

      if (!clientId) {
        console.error("Google Client ID is missing. Check .env.local");
        return;
      }

      // Check if the google object is actually available (belt-and-suspenders check)
      if (!window.google?.accounts?.id) {
          console.error("Google script marked as ready, but window.google.accounts.id is not available!");
          return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleSignIn,
        });

        console.log('Rendering Google Sign-In button...');
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: 'outline', size: 'large', type: 'standard' }
        );
        // Optional: Prompt for One Tap sign-in
        // window.google.accounts.id.prompt();
      } catch (error) {
        console.error('Error initializing or rendering Google button:', error);
      }
    } else if (!isScriptReady) {
        console.log('useEffect ran, but script is not marked as ready yet.');
    } else if (!googleButtonRef.current) {
        console.log('useEffect ran, script ready, but button ref is not available yet.');
    }
  }, [isScriptReady]); // Re-run the effect when isScriptReady changes

  return (
    <>
        <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        async
        defer
        onReady={handleScriptLoad} // Call handleScriptLoad when ready
        onError={(e) => {
            console.error('Error loading Google GSI Script:', e);
            // Optionally set an error state here
        }}
      />

      {/* The div where the button will be rendered */}
      <div ref={googleButtonRef}></div>
      </>
  );
};

export default GoogleSignInButton;
