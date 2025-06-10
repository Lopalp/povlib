// components/POVlib/UnderConstructionModal.jsx
"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  PlayCircle,
  Tv,
  BookOpen,
  Settings2,
  Library,
  Play,
  Video,
} from "lucide-react";
import ModalHeading from "../headings/ModalHeading";
import BodyText from "../typography/BodyText";
import Tag from "../typography/Tag";
import { NavigationButton } from "../buttons";

const UnderConstructionModal = ({ isOpen, onClose }) => {
  const tabs = [
    {
      title: "Demo Libary",
      description: "A searchable library of pro-level utility demos.",
      features: [
        "Search by map",
        "Filter by type",
        "Pro player demos",
        "Download & share",
        "Demo analysis",
      ],
      icon: <Library className="h-12 w-12" />,
      imageSrc: "/demo.png",
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
      imageSrc: "/demo.png",
    },
    {
      title: "Utility Book",
      description: "A searchable library of pro-level utility demos.",
      features: [
        "Search by map",
        "Filter by type",
        "Pro player demos",
        "Download & share",
        "Demo analysis",
      ],
      icon: <BookOpen className="h-12 w-12" />,
      imageSrc: "/demo.png",
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
      imageSrc: "/demo.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const { title, icon, imageSrc, description } = tabs[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < tabs.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      <div
        className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative w-full max-w-4xl h-[60vh] rounded-2xl overflow-hidden shadow-2xl">
          {/* Full-background Image */}
          <img
            src={imageSrc}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          {/* Dark overlay behind content */}
          <div className="absolute inset-0 bg-black/60 z-10" />

          {/* Content Panel (Glass Effect) */}
          <div className="relative z-20 h-full mx-4 sm:mx-0 bg-black/30 backdrop-blur-lg border border-gray-700 rounded-2xl px-6 py-8 sm:px-8 sm:py-10 flex flex-col">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Title + Icon */}
              <div className="flex flex-col items-center mb-6">
                <div className="bg-yellow-400/20 rounded-full p-4 mb-7">
                  {React.cloneElement(icon, {
                    className: "h-12 w-12 text-yellow-400",
                  })}
                </div>
                <ModalHeading>{title}</ModalHeading>
              </div>

              {/* Description */}
              <div className="flex justify-center">
                <BodyText
                  size="lg"
                  className="text-center mb-6 font-light max-w-2xl"
                >
                  {description}
                </BodyText>
              </div>

              {/* Features List */}
              <div className="flex justify-center mb-8">
                <div className="text-center max-w-3xl">
                  {tabs[currentIndex].features.map((feature, index) => (
                    <Tag key={index} variant="yellow" className="mx-1 my-1">
                      <span className="mr-1.5">★</span>
                      {feature}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            {/* Fixed Bottom Section */}
            <div className="mt-auto pt-6">
              {/* Feedback Banner */}
              <div className="flex items-center justify-center gap-4 bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-4">
                <MessageCircle className="h-8 w-8 text-yellow-300 flex-shrink-0" />
                <div className="text-yellow-300">
                  <p className="text-yellow-300/90 text-sm mb-2.5 font-medium">
                    Everything here is a demo—features may be incomplete or
                    non-functional.
                  </p>
                  <p className="text-sm">
                    We need your feedback!{" "}
                    <a
                      href="https://discord.gg/XDwTABQr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:text-yellow-300 underline underline-offset-2"
                    >
                      Join our Discord
                    </a>{" "}
                    and let us know your thoughts.
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                {currentIndex > 0 ? (
                  <NavigationButton
                    onClick={handlePrev}
                    icon={ChevronLeft}
                    iconPosition="left"
                  >
                    <span className="hidden sm:inline">Previous</span>
                  </NavigationButton>
                ) : (
                  <div className="w-24" />
                )}
                {currentIndex < tabs.length - 1 ? (
                  <NavigationButton
                    onClick={handleNext}
                    icon={ChevronRight}
                    iconPosition="right"
                    className="ml-auto"
                  >
                    <span className="hidden sm:inline">Next</span>
                  </NavigationButton>
                ) : (
                  <div className="w-24" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionModal;
