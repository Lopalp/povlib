import React from "react";
import LogoHeading from "../typography/LogoHeading";

export const LoadingFullscreen = ({ spinnerOnly = false }) => {
  if (spinnerOnly) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mb-2"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
        <LogoHeading size={1.5} />
        <p className="text-white text-lg font-medium mt-4">Loading POVs...</p>
      </div>
    </div>
  );
};
