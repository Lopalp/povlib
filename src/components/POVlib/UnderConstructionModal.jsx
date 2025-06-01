// components/POVlib/UnderConstructionModal.jsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  PlayCircle,
  Tv,
  BookOpen,
  Settings2,
  ArrowRightCircle,
} from 'lucide-react';
import Link from 'next/link';

const UnderConstructionModal = ({ isOpen, onClose }) => {
  const tabs = [
    {
      key: 'demoLibrary',
      title: 'Demo Library',
      icon: <PlayCircle className="h-8 w-8 text-yellow-400" />,
      imageSrc: '/demo.png',
      description: `Our Demo Library is a curated collection of the best POV clips you’ve ever seen. Explore highlights from top matches, save your favorites, and discover new plays every day. While we put the finishing touches on this section, imagine having instant access to top-tier demos—all in one place.`,
      cta: {
        label: 'Go to Demo Library',
        href: '/demos',
      },
    },
    {
      key: 'extendedPlayer',
      title: 'Extended Demo Player',
      icon: <Settings2 className="h-8 w-8 text-yellow-400" />,
      imageSrc: '/demo.png',
      description: `Experience your demos like never before with our Extended Demo Player. Slow motion, heatmaps, advanced scoreboard overlays, and multi-angle views are coming soon. Whether you’re analyzing a clutch moment or perfecting your angles, this player will be your go-to tool for deep, frame-by-frame breakdowns.`,
      cta: {
        label: 'Try Extended Player',
        href: '/player',
      },
    },
    {
      key: 'watchAnywhere',
      title: 'Watch Anywhere',
      icon: <Tv className="h-8 w-8 text-yellow-400" />,
      imageSrc: '/demo.png',
      description: `Never miss a beat—watch your demos on any device, wherever you go. Desktop, tablet, or mobile: our responsive viewer will let you relive your best plays on the bus, at the café, or while you’re on the road to the next LAN. Stay connected and keep your skills sharp, no matter where you are.`,
      cta: {
        label: 'Learn More',
        href: '/watch-anywhere',
      },
    },
    {
      key: 'utilityBook',
      title: 'Pro Players Utility Book',
      icon: <BookOpen className="h-8 w-8 text-yellow-400" />,
      imageSrc: '/demo.png',
      description: `Unlock exclusive strategies and grenade lineups straight from pro players with our Utility Book. Step-by-step breakdowns, annotated screenshots, and insider tips will elevate your game to the next level. Think of it as a living textbook—compiled by champions, for champions.`,
      cta: {
        label: 'View Utility Book',
        href: '/utility-book',
      },
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

  const { title, icon, imageSrc, description, cta } = tabs[currentIndex];

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
      <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
        {/* Full-background Image */}
        <img
          src={imageSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Dark overlay behind content */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        {/* Content Panel (Glass Effect) */}
        <div
          className={`relative z-20 mx-4 sm:mx-0 bg-black/30 backdrop-blur-lg border border-gray-700 rounded-2xl px-6 py-8 sm:px-8 sm:py-10 transform transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 text-gray-300 hover:text-yellow-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Feedback Banner */}
          <div className="mb-6 flex items-center justify-center gap-2 bg-yellow-900/20 border border-yellow-800 rounded-full py-2 px-4">
            <MessageCircle className="h-5 w-5 text-yellow-300" />
            <p className="text-yellow-300 text-sm sm:text-base font-medium">
              We need your feedback!{' '}
              <a
                href="https://discord.gg/XDwTABQr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-yellow-400"
              >
                Join our Discord
              </a>{' '}
              and let us know your thoughts.
            </p>
          </div>

          {/* Icon and Title */}
          <div className="flex flex-col items-center mb-4">
            <div className="bg-yellow-400/20 rounded-full p-3 mb-2">
              {icon}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
              {title}
            </h2>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-700 my-4" />

          {/* Description */}
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed text-center mb-8">
            {description}
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-8">
            <Link href={cta.href}>
              <a className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 font-semibold text-sm sm:text-base rounded-md hover:bg-yellow-300 transition-all duration-200 shadow-[0_0_15px_rgba(250,204,21,0.6)]">
                {cta.label}
                <ArrowRightCircle className="h-5 w-5" />
              </a>
            </Link>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mb-4">
            {currentIndex > 0 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>
            ) : (
              <div className="w-24" />
            )}
            {currentIndex < tabs.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors ml-auto"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <div className="w-24" />
            )}
          </div>

          {/* Footer / Disclaimer */}
          <div className="text-center mt-2">
            <p className="text-gray-400 italic mb-4 text-sm sm:text-base">
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
