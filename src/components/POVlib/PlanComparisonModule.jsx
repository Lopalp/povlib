// components/POVlib/PlanComparisonModule.jsx
'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import ComparePlansModal from './ComparePlansModal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PlanComparisonModule = ({ currentPlan }) => {
  const router = useRouter();
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // 1) Alle Pläne in aufsteigender Reihenfolge
  const allPlans = useMemo(
    () => [
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
        highlight: 'Start for free and explore all basics.',
      },
      {
        key: 'basic',
        name: 'Basic',
        priceLabel: '$6.99/mo',
        features: [
          '10 full demos per month',
          'Up to 1080p @ 30fps',
          'Access to the Pro Utility Book',
          'Standard processing queue',
        ],
        highlight: 'Most popular entry-level pack.',
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
        highlight: 'Everything you need to level up.',
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
        highlight: 'For serious players and teams.',
      },
    ],
    []
  );

  // 2) Aktuellen Plan und nächsten Plan finden
  const { currentPlanData, nextPlanData } = useMemo(() => {
    const idx = allPlans.findIndex((p) => p.key === currentPlan);
    const current = idx >= 0 ? allPlans[idx] : null;
    const next = idx >= 0 && idx < allPlans.length - 1 ? allPlans[idx + 1] : null;
    return { currentPlanData: current, nextPlanData: next };
  }, [currentPlan, allPlans]);

  if (!currentPlanData) {
    return (
      <div className="bg-red-800 text-red-200 rounded-2xl p-6">
        <p className="text-sm font-semibold">Error: Unknown plan "{currentPlan}".</p>
      </div>
    );
  }

  // 3) Wenn der Nutzer schon beim höchsten Plan ist
  if (!nextPlanData) {
    return (
      <>
        <div className="bg-gray-900 rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            You’re on the highest plan!
          </h2>
          <p className="text-sm text-gray-300 mb-6">
            You already have the <span className="font-semibold text-yellow-400">{currentPlanData.name}</span> plan, which offers all available features.
          </p>
          <button
            onClick={() => router.push(`/checkout?plan=${currentPlanData.key}`)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md border-2 border-yellow-400 text-yellow-400 font-semibold hover:bg-yellow-400 hover:text-black transition"
          >
            <X className="w-5 h-5" />
            <span className="text-sm">Manage Subscription</span>
          </button>
          <div className="mt-4">
            <button
              onClick={() => setIsCompareOpen(true)}
              className="text-yellow-400 text-sm underline hover:text-yellow-500 transition-colors"
            >
              View All Plans
            </button>
          </div>
        </div>
        <ComparePlansModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          currentPlan={currentPlan}
        />
      </>
    );
  }

  // 4) Anzeige der aktuellen Plan-Karte und des nächsten Plankarte
  return (
    <>
      <section className="bg-gray-900 rounded-2xl p-8 space-y-6 shadow-lg">
 <style jsx>{`
 .bg-pattern-fade {
 background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
 background-size: 20px 20px;
 mask-image: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
 }
 `}</style>
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Compare Your Plan</h2>
        </div>

        {/* Vergleichsgitter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aktueller Plan */}
          <div className="border border-gray-700 rounded-2xl p-6 flex flex-col bg-gray-800">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-200">{currentPlanData.name}</h3>
            <p className="text-3xl font-extrabold text-yellow-400 mb-4">{currentPlanData.priceLabel}</p>
            <ul className="space-y-2 text-gray-400 flex-grow text-sm">
              {currentPlanData.features.map((feat, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 text-xs">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <button
              disabled
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md border-2 border-yellow-400 bg-gray-700 text-gray-500 cursor-not-allowed"
            >
              <span className="text-sm">Current Plan</span>
            </button>
          </div>

          {/* Nächster Plan */}
          <div className="border border-gray-700 rounded-2xl p-6 flex flex-col bg-gray-900 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg md:text-xl font-bold text-white">{nextPlanData.name}</h3>
              <span className="text-sm text-yellow-400 font-semibold">Upgrade</span>
            </div>
            <p className="text-3xl font-extrabold text-white mb-4">{nextPlanData.priceLabel}</p>
            <ul className="space-y-2 text-gray-200 flex-grow text-sm">
              {nextPlanData.features.map((feat, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 text-xs text-yellow-400">★</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <Link href={`/checkout?plan=${nextPlanData.key}`}>
              <button className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md border-2 border-yellow-400 text-yellow-400 font-semibold hover:bg-yellow-400 hover:text-black transition w-full">
                <span className="text-sm">Upgrade to {nextPlanData.name}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        <div>
          <button
            onClick={() => setIsCompareOpen(true)}
            className="text-yellow-400 text-sm underline hover:text-yellow-500 transition-colors"
          >
            View All Plans
          </button>
        </div>
      </section>

      <ComparePlansModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentPlan={currentPlan}
      />
    </>
  );
};

export default PlanComparisonModule;
