// components/POVlib/ComparePlansModal.jsx
'use client';

import React from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

const ComparePlansModal = ({ isOpen, onClose, currentPlan }) => {
  if (!isOpen) return null;

  // Alle 4 Pläne in der Reihenfolge: free, basic, advanced, pro
  const plans = [
    {
      key: 'free',
      name: 'Free',
      priceLabel: 'Free',
      features: [
        '2 Halftime demos per week',
        'Access to the full demo library',
        'Risk-free entry into POVLib',
        'Community support',
      ],
      highlight: '',
    },
    {
      key: 'basic',
      name: 'Basic',
      priceLabel: '$6.99/mo',
      features: [
        '10 full demos per month',
        'Up to 1080p @ 30fps',
        'Access to the Pro Utility Book',
        'Standard processing queue',
      ],
      highlight: '',
    },
    {
      key: 'advanced',
      name: 'Advanced',
      priceLabel: '$12.99/mo',
      features: [
        'Create highlight clips',
        'Up to 30 demos per month',
        'Build your own Utility Book',
        '2D views & multiple POVs',
        'Custom quizzes while watching demos',
        'Generate demos for any player',
        'Get your own keystrokes in your games',
      ],
      highlight: 'Best balance of price & value',
    },
    {
      key: 'pro',
      name: 'Pro',
      priceLabel: '$25.99/mo',
      features: [
        'Up to 4K demo exports',
        'Customized death screens',
        'Early access to new features',
        'Dedicated support',
        'Professional analytics video view',
        'Customizable videos',
        'Connect multiple games',
        'Select specific rounds',
        'Fastest generation times',
      ],
      highlight: 'Ideal for serious players & teams',
    },
  ];

  // Label für den Button: „Choose for $XX“ oder „Select $XX“
  const buttonLabel = (planKey, priceLabel) =>
    planKey === 'advanced' ? `Choose for ${priceLabel}` : `Select ${priceLabel}`;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl w-full max-w-6xl max-h-[80vh] overflow-y-auto shadow-[0_0_30px_rgba(250,204,21,0.15)]"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-700">
          <h2 className="text-lg md:text-xl font-bold text-white">Compare Plans</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body: Grid mit responsiven Spalten */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {plans.map(({ key, name, priceLabel, features, highlight }) => (
              <div
                key={key}
                className={`
                  relative
                  flex flex-col justify-between
                  rounded-lg
                  overflow-hidden
                  ${
                    key === 'advanced'
                      ? 'bg-gray-900 ring-2 ring-yellow-400 shadow-lg'
                      : 'bg-gray-800 border border-gray-700'
                  }
                `}
              >
                {/* „Recommended“-Badge nur für Advanced */}
                {key === 'advanced' && (
                  <div className="absolute -top-3 right-3 bg-yellow-400 text-gray-900 text-xs font-semibold px-2 py-1 rounded-full">
                    Recommended
                  </div>
                )}

                <div className="p-4 md:p-6 flex-1">
                  <h3
                    className={`font-bold mb-2 ${
                      key === 'advanced' ? 'text-white' : 'text-gray-200'
                    } text-base md:text-lg`}
                  >
                    {name}
                  </h3>
                  <p
                    className={`font-extrabold mb-4 ${
                      key === 'advanced' ? 'text-yellow-400' : 'text-yellow-400'
                    } text-2xl md:text-3xl`}
                  >
                    {priceLabel}
                  </p>
                  <ul
                    className={`mb-4 space-y-2 ${
                      key === 'advanced' ? 'text-gray-300' : 'text-gray-400'
                    } text-sm md:text-base`}
                  >
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">
                          {key === 'advanced' ? '★' : '•'}
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {highlight && (
                    <p
                      className={`italic text-sm md:text-base ${
                        key === 'advanced' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {highlight}
                    </p>
                  )}
                </div>

                {/* Auswahl-Button */}
                <div className="p-4 md:p-6">
                  {currentPlan === key ? (
                    <button
                      disabled
                      className="w-full px-4 py-2 font-semibold rounded-lg bg-gray-700 text-gray-500 cursor-not-allowed text-sm md:text-base"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <Link href={`/checkout?plan=${key}`}>
                      {key === 'advanced' ? (
                        // Primär-Button auf dunklem Hintergrund
                        <button className="w-full flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-md border-2 border-yellow-400 text-yellow-400 font-semibold hover:bg-yellow-400 hover:text-black transition text-sm md:text-base">
                          {buttonLabel(key, priceLabel)}
                        </button>
                      ) : (
                        // Sekundär-Button
                        <button className="w-full flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-md border border-gray-600 text-white hover:border-yellow-400 transition text-sm md:text-base">
                          {buttonLabel(key, priceLabel)}
                        </button>
                      )}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePlansModal;
