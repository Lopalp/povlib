// components/auth/DiscordLoginButton.jsx
'use client';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { FaDiscord } from 'react-icons/fa';
// Removed Image as it's not used in the current structure for the Discord logo

export default function DiscordLoginButton() {
  const supabase = createSupabaseBrowserClient();

  async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
    });
    if (error) {
      console.error('Error signing in with Discord:', error.message);
      // You might want to handle this error in the UI
    } else {
      console.log('Discord sign-in initiated:', data);
    }
  }

  return (
    <button
      onClick={signInWithDiscord}
      // Use Tailwind classes for styling instead of inline styles
      className='
        bg-[#202124] hover:bg-[#7F7F7F]
        cursor-pointer rounded-sm h-10 w-[187px]
        flex items-center
        transition-colors ease-in-out duration-300 // Added transition classes
      '
    >
      <div
        className="
          bg-white rounded-sm h-9 w-9
          flex items-center justify-center p-1.5
        "
        style={{marginTop: 1, margin: 2, marginBottom: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0}}
      >
        <FaDiscord fontSize={"1.5rem"} color="#7289da"/>
      </div>
      {/* Use a utility class for spacing instead of an empty div */}
      <div className="w-3"></div> {/* Equivalent to width: 13px */}
      <span className="text-base font-thin text-white text-[14px]" style={{fontWeight: 500}}>Sign in with Discord</span>
    </button>
  );
}