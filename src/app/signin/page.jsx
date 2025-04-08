import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import LogoHeading from "@/components/typography/LogoHeading";

export default function SignInPage() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-dots-pattern opacity-20 pointer-events-none"></div>
            <div className="bg-gray-800 p-20 rounded-lg shadow-lg text-left space-y-8 w-150 relative">
                <LogoHeading size={5}/>
                <p className="text-white text-lg font-medium">Sign in to build your own POVlib.</p>
                <GoogleSignInButton />
            </div>
        </div>
    );
}