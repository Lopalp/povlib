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
      description: `Our Demo Library is a curated collection of the best POV clips you’ve ever seen. Explore highlights from top matches, save your favorites, and discover new plays every day. While we put the finishing touches on this section, imagine having instant access to top-tier demos—all in one place.`,
    },
    {
      key: 'extendedPlayer',
      title: 'Extended Demo Player',
      imageSrc: '/images/under-construction/extended-player.png',
      description: `Experience your demos like never before with our Extended Demo Player. Slow motion, heatmaps, advanced scoreboard overlays, and multi-angle views are coming soon. Whether you’re analyzing a clutch moment or perfecting your angles, this player will be your go-to tool for deep, frame-by-frame breakdowns.`,
    },
    {
      key: 'watchAnywhere',
      title: 'Watch Anywhere',
      imageSrc: '/images/under-construction/watch-anywhere.png',
      description: `Never miss a beat—watch your demos on any device, wherever you go. Desktop, tablet, or mobile: our responsive viewer will let you relive your best plays on the bus, at the café, or while you’re on the road to the next LAN. Stay connected and keep your skills sharp, no matter where you are.`,
    },
    {
      key: 'utilityBook',
      title: 'Pro Players Utility Book',
      imageSrc: '/images/under-construction/utility-book.png',
      description: `Unlock exclusive strategies and grenade lineups straight from pro players with our Utility Book. Step-by-step breakdowns, annotated screenshots, and insider tips will elevate your game to the next level. Think of it as a living textbook—compiled by champions, for champions.`,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setCurrentIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const { title, imageSrc, description } = tabs[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((idx) => idx - 1);
        setIsVisible(true);
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentIndex < tabs.length - 1) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((idx) => idx + 1);
        setIsVisible(true);
      }, 300);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full p-4 sm:p-6 md:p-8 shadow-[0_0_25px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors z-20"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Content Container */}
        <div
          className={`transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
            {title}
          </h2>

          {/* Image */}
          <div className="w-full h-48 md:h-56 lg:h-64 mb-6 overflow-hidden rounded-lg border border-gray-700 shadow-lg">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description */}
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 px-2 sm:px-0 text-center">
            {description}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${
                currentIndex === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === tabs.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${
                currentIndex === tabs.length - 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-800 text-center">
          <p className="text-gray-400 italic mb-4">
            Everything here is a demo—features may be incomplete or non-functional.
          </p>
          <a
            href="https://discord.gg/XDwTABQr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] text-white font-semibold text-sm sm:text-base rounded-md hover:bg-[#4752C4] transition-all duration-200 shadow-[0_0_15px_rgba(88,101,242,0.5)]"
          >
            Join Our Server
          </a>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionModal;
