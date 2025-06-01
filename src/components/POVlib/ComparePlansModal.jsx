// components/POVlib/ComparePlansModal.jsx
'use client';

import React from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

const ComparePlansModal = ({ isOpen, onClose, currentPlan }) => {
  if (!isOpen) return null;

  // Style-Helper: Button-Klassen je nach Plan-Typ
  const buttonClasses = (planKey) =>
    planKey === 'advanced'
      ? 'bg-gray-900 text-yellow-400 hover:bg-gray-800 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
      : 'bg-gray-700 text-white hover:bg-gray-600';

  // Label für den Button: „Choose for $XX“ oder „Select $XX“
  const buttonLabel = (planKey, priceLabel) =>
    planKey === 'advanced' ? `Choose for ${priceLabel}` : `Select ${priceLabel}`;

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
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Compare Plans</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body: Grid mit responsiven Spalten */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map(({ key, name, priceLabel, features, highlight }) => (
              <div
                key={key}
                className={`border border-gray-700 rounded-lg p-6 flex flex-col justify-between ${
                  key === 'advanced'
                    ? 'relative bg-yellow-400 shadow-lg ring-2 ring-yellow-300'
                    : 'bg-gray-800'
                }`}
              >
                {key === 'advanced' && (
                  <div className="absolute -top-3 right-3 bg-gray-900 text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full">
                    Recommended
                  </div>
                )}

                <div>
                  <h3
                    className={`text-lg font-bold mb-2 ${
                      key === 'advanced' ? 'text-gray-900' : 'text-gray-200'
                    }`}
                  >
                    {name}
                  </h3>
                  <p
                    className={`text-3xl font-extrabold mb-4 ${
                      key === 'advanced' ? 'text-gray-900' : 'text-yellow-400'
                    }`}
                  >
                    {priceLabel}
                  </p>
                  <ul
                    className={`mb-4 ${
                      key === 'advanced' ? 'text-gray-900' : 'text-gray-400'
                    } space-y-2`}
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
                      className={`mb-4 text-sm italic ${
                        key === 'advanced'
                          ? 'text-gray-800'
                          : key === 'pro'
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}
                    >
                      {highlight}
                    </p>
                  )}
                </div>

                {/* Auswahl-Button */}
                {currentPlan === key ? (
                  <button
                    disabled
                    className="mt-6 px-4 py-2 font-semibold rounded-lg w-full bg-gray-700 text-gray-500 cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                <Link href={`/checkout?plan=${key}`}>
                  <button className={`mt-6 px-4 py-2 font-semibold rounded-lg w-full transition ${buttonClasses(key)}`}>
                    {buttonLabel(key, priceLabel)}
                  </button>
                </Link>

                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePlansModal;
