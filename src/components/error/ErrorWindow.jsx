import Link from 'next/link';
import React from 'react';

const ErrorWindow = ({ text }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
            <div className="text-center max-w-md mx-auto p-15 bg-gray-800 rounded-xl shadow-lg">
                <div className="text-red-500 text-5xl mb-4">!</div>
                <h2 className="text-white text-1xl mb-2 text-left">{text}</h2>
                <div style={{height: 30}}></div>
                <Link href="/" className="text-blue-500 hover:underline">Go back to home</Link>
            </div>
        </div>
    );
};

export default ErrorWindow;