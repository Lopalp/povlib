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
      }, 200);
    }
  };

  const handleNext = () => {
    if (currentIndex < tabs.length - 1) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((idx) => idx + 1);
        setIsVisible(true);
      }, 200);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-transparent rounded-2xl overflow-hidden shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-300 hover:text-yellow-400 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Image Section */}
        <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Glass Panel with Content */}
        <div
          className={`bg-black/40 backdrop-blur-lg border border-gray-700 rounded-b-2xl px-6 py-8 transform transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
            {title}
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed text-center mb-8">
            {description}
          </p>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mb-6">
            {currentIndex > 0 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>
            ) : <div /> }

            {currentIndex < tabs.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors ml-auto"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : <div /> }
          </div>

          {/* Footer / Call to Action */}
          <div className="text-center">
            <p className="text-gray-400 italic mb-4">
              Everything here is a demo—features may be incomplete or non-functional.
            </p>
            <a
              href="https://discord.gg/XDwTABQr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] text-white font-semibold text-sm sm:text-base rounded-md hover:bg-[#4752C4] transition-colors shadow-[0_0_15px_rgba(88,101,242,0.5)]"
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
