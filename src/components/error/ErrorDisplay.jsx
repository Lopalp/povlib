import { useRouter } from "next/navigation";

const ErrorDisplay = ({ error, onBack }) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-lg">
        <div className="text-red-500 text-5xl mb-4">!</div>
        <h2 className="text-white text-2xl font-bold mb-2">
          Error Loading Data
        </h2>
        <p className="text-gray-300 mb-4">{error}</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
