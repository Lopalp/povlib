"use client"
import { useContext, useEffect, useRef, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import Script from 'next/script';
import { UserContext } from '../../../context/UserContext';
import { useRouter } from 'next/navigation';
import ErrorWindow from '@/components/error/ErrorWindow';

const GoogleSignInButton = () => {

  const supabase = createSupabaseBrowserClient();
  const googleButtonRef = useRef(null);
  const [isScriptReady, setIsScriptReady] = useState(false);
  const {user, setUser} = useContext(UserContext);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async (response) => {
    console.log('Google Credential Response received:', response);
    if (!response.credential) {
      console.error('Google Sign-In failed: No credential returned.');
      setError(true);
      return;
    }
    console.log('Attempting Supabase sign-in with ID token...');
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    });
    if (error) {
      console.error('Supabase Sign-In Error:', error.message);
      setError(true);
    } else {
      console.log('Supabase Sign-In Success:', data);
      setUser(data?.user.user_metadata);
      router.push('/');
    }
  };

  // This function will be called by the Script component's onReady prop
  const handleScriptLoad = () => {
    console.log('Google GSI Script loaded successfully via onReady.');
    setIsScriptReady(true);
  };

  // Effect to initialize and render the button *after* the script is ready
  useEffect(() => {
    if (isScriptReady && googleButtonRef.current) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      console.log('Script is ready, attempting to initialize Google Identity Services...');
      console.log('Using Google Client ID:', clientId);

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
          locale: 'en'
        });

        console.log('Rendering Google Sign-In button...');
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: 'filled_black', size: 'large', type: 'standard' }
        );
      } catch (error) {
        console.error('Error initializing or rendering Google button:', error);
        setError(true);
      }
    } else if (!isScriptReady) {
        console.log('useEffect ran, but script is not marked as ready yet.');
    } else if (!googleButtonRef.current) {
        console.log('useEffect ran, script ready, but button ref is not available yet.');
    }
  }, [isScriptReady]);

  if (error) {
    return <ErrorWindow text={"Something went wrong during login, please try again later."} />
  }

  return (
    <>
        <Script
        src="https://accounts.google.com/gsi/client?hl=en"
        strategy="afterInteractive"
        async
        defer
        onReady={handleScriptLoad}
        onError={(e) => {
            console.error('Error loading Google GSI Script:', e);
            setError(true);
        }}
      />
      <div ref={googleButtonRef}></div>
      </>
  );
};

export default GoogleSignInButton;
