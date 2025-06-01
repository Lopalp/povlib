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
          '2 halftime demos per week – constantly fresh training material',
          'Access to the full demo library',
          'Community support & discussion',
        ],
        highlight: 'Start risk-free and explore the basics.',
      },
      {
        key: 'basic',
        name: 'Basic',
        priceLabel: '$6.99/month',
        features: [
          '10 full demos per month for steady progress',
          'Up to 1080p @ 30 FPS for crystal-clear playback',
          'Access to the Pro Utility Book',
          'Standard processing queue',
          'Community support',
        ],
        highlight: 'Best for players who want a reliable monthly boost.',
      },
      {
        key: 'advanced',
        name: 'Advanced',
        priceLabel: '$12.99/month',
        features: [
          'Create highlight clips & quick replays',
          'Up to 30 demos per month',
          'Design and customize your own Utility Book',
          'Generate 2D views from any demo',
          'Multiple POV options for varied perspectives',
          'Interactive quizzes during POV playback',
          'Create demos for any player, anytime',
          'Capture and display your keystrokes in matches',
          'Priority processing queue',
          'Premium support',
        ],
        highlight: 'For ambitious players ready to fine-tune every detail.',
      },
      {
        key: 'pro',
        name: 'Pro',
        priceLabel: '$25.99/month',
        features: [
          'Up to 4K demo resolution',
          'Customized death screens for instant feedback',
          'Early access to all new features',
          'Dedicated custom support',
          'Professional analytics video overlay',
          'Fully customizable video exports',
          'Connect multiple games under one account',
          'Select and analyze specific rounds at will',
          'Fastest generation times in our queue',
          'Express processing priority',
          '24/7 priority support',
        ],
        highlight: 'Everything you need for a pro‐level analysis workflow.',
      },
      {
        key: 'pro_annual',
        name: 'Pro (Annual)',
        priceLabel: '$249.99/year',
        features: [
          'All Pro features (4K demos, custom death screens, etc.)',
          'Save 20% compared to the monthly Pro plan',
          'Billed once per year for hassle-free access',
          'Dedicated custom support & early feature access',
        ],
        highlight: 'Maximize savings with a full year of Pro advantages.',
      },
      {
        key: 'team',
        name: 'Team (7 seats)',
        priceLabel: '$149.99/month',
        features: [
          'All Pro features for up to 7 team members',
          'Team analytics dashboard & centralized billing',
          'Admin controls to manage seats & permissions',
          'Volume-discounted pricing vs. individual Pro accounts',
          'Dedicated priority support for your entire team',
          'Early access to new enterprise tools',
        ],
        highlight: 'Perfect for small squads and coaching staff—unite your team.',
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
        <p className="font-semibold">Error: Unknown plan “{currentPlan}”.</p>
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
