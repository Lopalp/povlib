// components/POVlib/UnderConstructionModal.jsx
'use client';

import React, { useState } from 'react';
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

  if (!isOpen) return null;

  const handlePrev = () => {
    setCurrentIndex((idx) => (idx > 0 ? idx - 1 : idx));
  };

  const handleNext = () => {
    setCurrentIndex((idx) => (idx < tabs.length - 1 ? idx + 1 : idx));
  };

  const { title, imageSrc, description } = tabs[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full p-6 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Image */}
        <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description */}
        <div className="text-gray-300 mb-6">
          <p>{description}</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors
              ${currentIndex === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-600'}`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === tabs.length - 1}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors
              ${currentIndex === tabs.length - 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-600'}`}
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Footer: Join Discord */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 mb-2 italic">
            Everything here is a demo—features may be incomplete or non-functional.
          </p>
          <a
            href="https://discord.gg/XDwTABQr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-[#5865F2] text-white font-semibold rounded-lg hover:bg-[#4752C4] transition-colors"
          >
            Join Our Server
          </a>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionModal;
