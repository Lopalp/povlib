import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import LogoHeading from "@/components/typography/LogoHeading";
import BackButton from '@/components/buttons/BackButton';

export default function SignInPage() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center relative flex-col">
            <div className="bg-gray-800 p-20 rounded-lg shadow-lg text-left space-y-8 w-150 relative">
                <BackButton text={"Back to home"} />
                <div style={{height: 30}}></div>
                <LogoHeading size={5}/>
                <p className="text-white text-lg font-medium m-0">Sign in to build your own POVlib.</p>
                <div style={{height: 30}}></div>
                <GoogleSignInButton />
            </div>
        </div>
    );
} 