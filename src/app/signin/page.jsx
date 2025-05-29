import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import LogoHeading from "@/components/typography/LogoHeading";
import BackButton from '@/components/buttons/BackButton';
import React, { useState } from 'react';

export default function SignInPage() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center relative flex-col">
            <div className="bg-gray-800 p-20 rounded-lg shadow-lg text-left space-y-8 w-150 relative">
                <BackButton text={"Back to home"} />
                <div style={{height: 30}}></div>
                <LogoHeading size={5}/>
                <p className="text-white text-lg font-medium m-0">Sign in to build your own POVlib.</p>
                <div style={{height: 30}}></div>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-white text-sm font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200">
                        Sign In
                    </button>
                </form>
                <div style={{height: 20}}></div> {/* Add some space between the forms */}
                <GoogleSignInButton />
            </div>
        </div>
    );
} 