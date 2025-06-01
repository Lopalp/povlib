// components/POVlib/UnderConstructionModal.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const UnderConstructionModal = ({ isOpen, onClose }) => {
  const tabs = [
    {
      key: 'demoLibrary',
      title: 'Demo Library',
      imageSrc: '/images/under-construction/demo-library.png',
      description: `Discover our curated Demo Library, a centralized hub for the finest POV clips in the world. Browse top-tier highlights, bookmark your favorites, and uncover fresh plays daily. While we perfect this feature, envision instant access to the best demos—right at your fingertips.`,
    },
    {
      key: 'extendedPlayer',
      title: 'Extended Demo Player',
      imageSrc: '/images/under-construction/extended-player.png',
      description: `Elevate your analysis with our forthcoming Extended Demo Player. Slow-motion playback, interactive heatmaps, advanced overlays, and multi-angle views—soon you’ll dissect every clutch moment frame by frame. Prepare for a next-level breakdown experience.`,
    },
    {
      key: 'watchAnywhere',
      title: 'Watch Everywhere',
      imageSrc: '/images/under-construction/watch-anywhere.png',
      description: `Never miss a moment—stream your demos on any device, wherever life takes you. Desktop, tablet, or mobile: our responsive viewer ensures you can relive your best plays on the go. Keep sharpening your skills, no matter where you are.`,
    },
    {
      key: 'utilityBook',
      title: 'Pro Players Utility Book',
      imageSrc: '/images/under-construction/utility-book.png',
      description: `Gain insider knowledge with our Pro Players Utility Book. Detailed grenade lineups, annotated snapshots, and championship strategies—compiled by pros, for pros. Think of it as a living playbook that’ll elevate your game to the next level.`,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFadeIn(true);
      return () => setFadeIn(false);
    }
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  const handlePrev = () => {
    setFadeIn(false);
    setTimeout(() => setCurrentIndex((idx) => Math.max(idx - 1, 0)), 200);
  };

  const handleNext = () => {
    setFadeIn(false);
    setTimeout(() => setCurrentIndex((idx) => Math.min(idx + 1, tabs.length - 1)), 200);
  };

  const { title, imageSrc, description } = tabs[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-800 px-6 py-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          <div className="w-full h-56 rounded-lg overflow-hidden shadow-lg">
            <img
              src={imageSrc}
              alt={title}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                fadeIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>

          {/* Description */}
          <div className="text-gray-300">
            <p className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
              {description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200
                ${
                  currentIndex === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === tabs.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200
                ${
                  currentIndex === tabs.length - 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Footer: Disclaimer & Discord */}
          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-gray-400 italic">
              Everything here is a demo—features may be incomplete or non-functional.
            </p>
            <a
              href="https://discord.gg/XDwTABQr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] text-white font-semibold rounded-lg shadow-lg hover:bg-[#4752C4] transition-colors duration-200"
            >
              Join Our Server
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionModal;
