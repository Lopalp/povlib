export const LoadingFullscreen = () => {
    return <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-lg font-medium">Loading POVlib data...</p>
    </div>
  </div>
};