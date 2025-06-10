// components/POVlib/ComparePlansModal.jsx
"use client";

import React from "react";
import { X } from "lucide-react";
import Link from "next/link";
import Tag from "../typography/Tag";
import { PrimaryButton, SecondaryButton, TertiaryButton } from "../buttons";

const ComparePlansModal = ({ isOpen, onClose, currentPlan }) => {
  if (!isOpen) return null;

  // Alle 4 Pläne in der Reihenfolge: free, basic, advanced, pro
  // Jährliche Preise mit 20 % Rabatt (Monatspreis * 12 * 0.8)
  const plans = [
    {
      key: "free",
      name: "Free",
      priceLabel: "Free",
      yearlyLabel: "", // kein Jahrespreis für Free
      features: [
        "2 Halftime demos per week",
        "Access to the full demo library",
        "Risk-free entry into POVLib",
        "Community support",
      ],
      highlight: "",
    },
    {
      key: "basic",
      name: "Basic",
      priceLabel: "$6.99/mo",
      yearlyLabel: "$67.10/yr (20 % off)",
      features: [
        "10 full demos per month",
        "Up to 1080p @ 30fps",
        "Access to the Pro Utility Book",
        "Standard processing queue",
      ],
      highlight: "",
    },
    {
      key: "advanced",
      name: "Advanced",
      priceLabel: "$12.99/mo",
      yearlyLabel: "$124.70/yr (20 % off)",
      features: [
        "Create highlight clips",
        "Up to 30 demos per month",
        "Build your own Utility Book",
        "2D views & multiple POVs",
        "Custom quizzes while watching demos",
        "Generate demos for any player",
        "Get your own keystrokes in your games",
      ],
      highlight: "Best balance of price & value",
    },
    {
      key: "pro",
      name: "Pro",
      priceLabel: "$25.99/mo",
      yearlyLabel: "$249.50/yr (20 % off)",
      features: [
        "Up to 4K demo exports",
        "Customized death screens",
        "Early access to new features",
        "Dedicated support",
        "Professional analytics video view",
        "Customizable videos",
        "Connect multiple games",
        "Select specific rounds",
        "Fastest generation times",
      ],
      highlight: "Ideal for serious players & teams",
    },
  ];

  // Label für den Button: "Choose for $XX" oder "Select $XX"
  const buttonLabel = (planKey, priceLabel) =>
    planKey === "advanced"
      ? `Choose for ${priceLabel}`
      : `Select ${priceLabel}`;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`
          bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl w-full max-w-6xl
          /* Auf kleinen Screens: max-height 80vh + Scroll */
          max-h-[80vh] overflow-y-auto
          /* Ab md: keine max-height, kein Scrollen */
          md:max-h-none md:overflow-visible
          shadow-[0_0_30px_rgba(250,204,21,0.15)]
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Competition
            </h2>
            <button className="p-1 rounded-full hover:bg-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 hover:text-white"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
          </div>
          <Tag variant="yellow" size="xs">
            Time Left
          </Tag>
        </div>

        {/* Body: Grid mit responsiven Spalten */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {plans.map(
              ({ key, name, priceLabel, yearlyLabel, features, highlight }) => (
                <div
                  key={key}
                  className={`
                  relative
                  flex flex-col justify-between
                  rounded-lg
                  overflow-visible
                  ${
                    key === "advanced"
                      ? "bg-gray-900 ring-2 ring-yellow-400 shadow-lg"
                      : key === "pro"
                      ? "bg-gray-900 ring-2 ring-gray-500 shadow-md"
                      : "bg-gray-800 border border-gray-700"
                  }
                `}
                >
                  {/* "Recommended"-Badge nur für Advanced */}
                  {key === "advanced" && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                      Recommended
                    </div>
                  )}

                  <div className="p-4 md:p-6 flex-1 flex flex-col">
                    <h3
                      className={`font-bold mb-2 ${
                        key === "advanced" || key === "pro"
                          ? "text-white"
                          : "text-gray-200"
                      } text-base md:text-lg`}
                    >
                      {name}
                    </h3>
                    <div>
                      <p
                        className={`font-extrabold mb-1 ${
                          key === "advanced" || key === "pro"
                            ? "text-yellow-400"
                            : "text-yellow-400"
                        } text-2xl md:text-3xl`}
                      >
                        {priceLabel}
                      </p>
                      {yearlyLabel && (
                        <p className="text-sm md:text-base text-gray-400 mb-4">
                          {yearlyLabel}
                        </p>
                      )}
                    </div>
                    <ul
                      className={`mb-4 space-y-2 ${
                        key === "advanced" || key === "pro"
                          ? "text-gray-300"
                          : "text-gray-400"
                      } text-sm md:text-base`}
                    >
                      {features.map((f, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">
                            {key === "advanced" || key === "pro" ? "★" : "•"}
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    {highlight && (
                      <p
                        className={`italic text-sm md:text-base ${
                          key === "advanced" || key === "pro"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {highlight}
                      </p>
                    )}
                  </div>

                  {/* Auswahl-Button */}
                  <div className="p-4 md:p-6">
                    {currentPlan === key ? (
                      <SecondaryButton disabled className="w-full">
                        Current Plan
                      </SecondaryButton>
                    ) : (
                      <Link href={`/checkout?plan=${key}`}>
                        {key === "advanced" ? (
                          // Primär-Button auf dunklem Hintergrund
                          <PrimaryButton className="w-full flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                            {buttonLabel(key, priceLabel)}
                          </PrimaryButton>
                        ) : key === "pro" ? (
                          // Pro-Button: etwas gehobenere Optik
                          <SecondaryButton className="w-full flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 border-2 border-gray-500 text-white hover:bg-gray-700">
                            {buttonLabel(key, priceLabel)}
                          </SecondaryButton>
                        ) : (
                          // Sekundär-Button für Basic und Free
                          <TertiaryButton className="w-full flex items-center justify-center gap-2 px-3 md:px-4 py-2">
                            {buttonLabel(key, priceLabel)}
                          </TertiaryButton>
                        )}
                      </Link>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePlansModal;
