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
      title: 'Watch Everywhere',
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

  // Trigger fade-in on open
  useEffect(() => {
    if (isOpen) setIsVisible(true);
    return () => setIsVisible(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const { title, imageSrc, description } = tabs[currentIndex];

  return (
    <div
      className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 py-6 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl transform transition-all duration-700 scale-95 opacity-0 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-800 px-6 py-4 border-b border-gray-700">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">{title}</h2>
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
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </div>

          {/* Description */}
          <div className="text-gray-300 space-y-4">
            <p className="leading-relaxed">{description}</p>
          </div>

          {/* Tab Indicators */}
          <div className="flex justify-center space-x-2">
            {tabs.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-8 rounded-full transition-colors duration-300 ${
                  idx === currentIndex ? 'bg-yellow-400' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-6 pb-6">
          <button
            onClick={() => setCurrentIndex((idx) => Math.max(idx - 1, 0))}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              currentIndex === 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm">Previous</span>
          </button>

          <button
            onClick={() => setCurrentIndex((idx) => Math.min(idx + 1, tabs.length - 1))}
            disabled={currentIndex === tabs.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              currentIndex === tabs.length - 1
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
            }`}
          >
            <span className="text-sm">Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Footer: Join Discord */}
        <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 text-center">
          <p className="text-gray-400 italic mb-3">
            Everything here is a demo — features may be incomplete or non-functional.
          </p>
          <a
            href="https://discord.gg/XDwTABQr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-[#5865F2] text-white font-semibold rounded-lg hover:bg-[#4752C4] transition-colors"
          >
            Join Our Discord Server
          </a>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionModal;
