import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Library,
  Play,
  BookOpen,
  Video,
} from "lucide-react";

const UnderConstructionModal = ({ isOpen, onClose }) => {
  const tabs = [
    {
      title: "Demo Library",
      description: "A searchable library of pro-level utility demos.",
      features: [
        "Search by map",
        "Filter by type",
        "Pro player demos",
        "Download & share",
        "Demo analysis",
      ],
      icon: <Library className="h-12 w-12" />,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      title: "Extended Player",
      description:
        "Advanced demo playback with enhanced controls and features.",
      features: [
        "Free cam mode",
        "Speed control",
        "Player highlights",
        "Map overlays",
        "Recording tools",
      ],
      icon: <Play className="h-12 w-12" />,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Utility Book",
      description: "Master every grenade lineup with our comprehensive guide.",
      features: [
        "Interactive maps",
        "Video tutorials",
        "Success rates",
        "Community ratings",
        "Practice mode",
      ],
      icon: <BookOpen className="h-12 w-12" />,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
    },
    {
      title: "Watch Your Own Demo",
      description: "Automated POV video generation from your demos.",
      features: [
        "Auto highlights",
        "Custom effects",
        "Music sync",
        "Export options",
        "Share clips",
      ],
      icon: <Video className="h-12 w-12" />,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTab = tabs[currentIndex];

  const handleTabChange = (newIndex) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 200);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleTabChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < tabs.length - 1) {
      handleTabChange(currentIndex + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-5xl h-[80vh] md:h-[75vh] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500">
        {/* Glass Container with Gradient Accent */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentTab.bgGradient} opacity-20 transition-all duration-500`} />
        
        <div className="relative h-full flex flex-col bg-white/5 dark:bg-gray-900/5 backdrop-blur-md border border-white/30 dark:border-white/20">
          {/* Header Section */}
          <div className="px-6 md:px-8 pt-6 pb-4">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 rounded-full bg-white/10 text-gray-700 dark:text-white/60 hover:bg-white/20 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:rotate-90"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Progress Dots */}
            <div className="flex justify-center items-center gap-3 mb-6">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTabChange(idx)}
                  className="relative group"
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      idx === currentIndex
                        ? `w-16 bg-gradient-to-r ${tab.gradient}`
                        : "w-2 bg-gray-400/50 dark:bg-white/30 hover:bg-gray-500/50 dark:hover:bg-white/50 hover:w-3"
                    }`}
                  />
                  {idx === currentIndex && (
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${tab.gradient} blur-md opacity-50`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className={`flex-1 px-6 md:px-8 pb-6 overflow-y-auto transition-all duration-300 ${
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}>
            {/* Icon Container */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${currentTab.gradient} blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
                <div className={`relative p-7 rounded-3xl bg-gradient-to-br ${currentTab.gradient} bg-opacity-90 shadow-2xl transform transition-all duration-300 group-hover:scale-110`}>
                  <div className="text-white">
                    {currentTab.icon}
                  </div>
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 tracking-tight">
                {currentTab.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-200/80 leading-relaxed">
                {currentTab.description}
              </p>
            </div>

            {/* Features Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {currentTab.features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/30 dark:border-white/10 p-5 hover:bg-white/30 dark:hover:bg-white/10 hover:border-white/40 dark:hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentTab.gradient} opacity-20`} />
                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${currentTab.gradient}`} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-100 font-medium text-sm md:text-base">{feature}</span>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${currentTab.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Section */}
          <div className="px-6 md:px-8 pb-6 md:pb-8">
            {/* Discord CTA */}
            <div className="relative mb-6 overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10" />
              <div className="relative p-5 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-amber-500/30">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-800 dark:text-amber-100 font-semibold mb-1">
                      Preview Build - Your Input Matters!
                    </h3>
                    <p className="text-gray-700 dark:text-amber-200/70 text-sm">
                      These features are under active development.{" "}
                      <a
                        href="https://discord.gg/XDwTABQr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-100 underline underline-offset-2 font-semibold transition-colors"
                      >
                        Join Discord
                      </a>{" "}
                      to help shape the future!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentIndex === 0
                    ? "invisible"
                    : "bg-white/20 dark:bg-white/10 backdrop-blur-sm text-gray-700 dark:text-white hover:bg-white/30 dark:hover:bg-white/20"
                }`}
              >
                <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex-1 flex justify-center">
                <span className="text-gray-500 dark:text-white/40 text-sm">
                  {currentIndex + 1} of {tabs.length}
                </span>
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === tabs.length - 1}
                className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentIndex === tabs.length - 1
                    ? "invisible"
                    : "bg-white/20 dark:bg-white/10 backdrop-blur-sm text-gray-700 dark:text-white hover:bg-white/30 dark:hover:bg-white/20"
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionModal;