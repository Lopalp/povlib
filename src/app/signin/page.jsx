import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import { supabase } from "../../lib/supabase";

export default function SignInPage() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
                <p className="text-white text-lg font-medium">Sign in</p>
                <GoogleSignInButton />
            </div>
        </div>
    );
}