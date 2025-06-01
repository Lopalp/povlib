// components/POVlib/PlanComparisonModule.jsx
'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import ComparePlansModal from './ComparePlansModal';

const PlanComparisonModule = ({ currentPlan, onUpgrade }) => {
  // 1) Define all plans in ascending order of price/feature set.
  const allPlans = useMemo(
    () => [
      {
        key: 'free',
        name: 'Free',
        priceLabel: 'Free',
        features: [
          '1 Credit / Month',
          'Community Support',
          'Basic Utility Book Excerpt',
          'Standard Processing Queue',
        ],
      },
      {
        key: 'basic',
        name: 'Basic',
        priceLabel: '$6.99',
        features: [
          '3 Credits / Month',
          'Basic Utility Book',
          'Standard Processing',
          'Community Support',
        ],
      },
      {
        key: 'standard',
        name: 'Standard',
        priceLabel: '$12.99',
        features: [
          '5 Credits / Month (+50% more)',
          'Full Utility Book',
          'Priority Processing',
          'Premium Support',
        ],
      },
      {
        key: 'pro',
        name: 'Pro',
        priceLabel: '$25.99',
        features: [
          'Unlimited Credits',
          'Complete Utility Book + Exclusive Chapters',
          'Express Processing',
          'Priority Support 24/7',
          'Exclusive Early-Access Demos',
        ],
      },
    ],
    []
  );

  // 2) Find index of current plan → determine next plan (if any).
  const { currentPlanData, nextPlanData } = useMemo(() => {
    const idx = allPlans.findIndex((p) => p.key === currentPlan);
    const current = idx >= 0 ? allPlans[idx] : null;
    const next = idx >= 0 && idx < allPlans.length - 1 ? allPlans[idx + 1] : null;
    return { currentPlanData: current, nextPlanData: next };
  }, [currentPlan, allPlans]);

  // 3) If currentPlanData is not found (unexpected key), bail out.
  if (!currentPlanData) {
    return (
      <div className="bg-red-800 text-red-200 rounded-lg p-6">
        <p className="font-semibold">Error: Unknown plan &quot;{currentPlan}&quot;.</p>
      </div>
    );
  }

  // 4) If user is on the highest tier, show a special message.
  if (!nextPlanData) {
    const [isCompareOpen, setIsCompareOpen] = useState(false);

    return (
      <>
        <div className="bg-gray-800 rounded-2xl p-8 shadow-lg text-center text-gray-200">
          <h2 className="text-2xl font-bold mb-4">You’re on the highest plan!</h2>
          <p className="mb-6">
            You already have the <span className="font-semibold">{currentPlanData.name}</span> plan,
            which offers all available features.
          </p>
          <button
            onClick={() => onUpgrade(null)}
            className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5 mr-2" />
            Manage Subscription
          </button>
          <button
            onClick={() => setIsCompareOpen(true)}
            className="mt-4 px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors shadow-[0_0_10px_rgba(250,204,21,0.2)]"
          >
            View All Plans
          </button>
        </div>
        <ComparePlansModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          onSelectPlan={onUpgrade}
          currentPlan={currentPlan}
        />
      </>
    );
  }

  // 5) Otherwise, render side-by-side comparison of currentPlanData vs. nextPlanData.
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  return (
    <>
      <section className="bg-gray-800 rounded-2xl p-8 space-y-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Compare Your Plan</h2>
          <span className="flex items-center text-gray-400 text-sm">
            Next tier: <span className="ml-1 font-semibold text-yellow-400">{nextPlanData.name}</span>
            <ArrowRight className="w-5 h-5 ml-1 text-yellow-400" />
          </span>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Plan Card */}
          <div className="border border-gray-700 rounded-lg p-6 flex flex-col">
            <h3 className="text-lg font-bold mb-2 text-gray-200">{currentPlanData.name}</h3>
            <p className="text-3xl font-extrabold text-yellow-400 mb-4">
              {currentPlanData.priceLabel}
            </p>
            <ul className="space-y-2 text-gray-400 flex-grow">
              {currentPlanData.features.map((feat, i) => (
                <li key={i} className="flex items-center">
                  <span className="mr-2 text-xs">•</span> {feat}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="mt-6 px-4 py-2 font-semibold rounded-lg w-full bg-gray-700 text-gray-500 cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Next Plan Card */}
          <div className="border border-gray-700 rounded-lg p-6 flex flex-col bg-gray-900 shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold mb-2 text-white">{nextPlanData.name}</h3>
              <span className="text-sm text-yellow-400 font-semibold">Upgrade</span>
            </div>
            <p className="text-3xl font-extrabold text-white mb-4">{nextPlanData.priceLabel}</p>
            <ul className="space-y-2 text-gray-200 flex-grow">
              {nextPlanData.features.map((feat, i) => (
                <li key={i} className="flex items-center">
                  <span className="mr-2 text-xs text-yellow-400">★</span> {feat}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onUpgrade(nextPlanData.key)}
              className="mt-6 px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg w-full hover:bg-yellow-300 transition-colors shadow-[0_0_10px_rgba(250,204,21,0.2)]"
            >
              Upgrade to {nextPlanData.name}
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsCompareOpen(true)}
          className="mt-6 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg w-full hover:bg-gray-600 transition-colors"
        >
          View All Plans
        </button>
      </section>

      <ComparePlansModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onSelectPlan={onUpgrade}
        currentPlan={currentPlan}
      />
    </>
  );
};

export default PlanComparisonModule;
