// components/POVlib/ComparePlansModal.jsx
'use client';

import React from 'react';
import { X } from 'lucide-react';

const ComparePlansModal = ({ isOpen, onClose, onSelectPlan, currentPlan }) => {
  if (!isOpen) return null;

  // Render the correct button state for each plan
  const renderButton = (planKey, priceLabel) => {
    if (currentPlan === planKey) {
      return (
        <button
          disabled
          className="mt-6 px-4 py-2 font-semibold rounded-lg w-full bg-gray-700 text-gray-500 cursor-not-allowed"
        >
          Current Plan
        </button>
      );
    }
    // Highlight selection button for “advanced” as “Recommended”
    const isRecommended = planKey === 'advanced';
    return (
      <button
        onClick={() => onSelectPlan(planKey)}
        className={`mt-6 px-4 py-2 font-semibold rounded-lg w-full transition 
          ${isRecommended
            ? 'bg-gray-900 text-yellow-400 hover:bg-gray-800 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
            : 'bg-gray-700 text-white hover:bg-gray-600'}`}
      >
        {isRecommended ? `Choose for ${priceLabel}` : `Select ${priceLabel}`}
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-6xl w-full overflow-y-auto shadow-[0_0_30px_rgba(250,204,21,0.15)]">
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

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Free Tier */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-200">Free</h3>
                <p className="text-3xl font-extrabold text-yellow-400 mb-4">Free</p>
                <ul className="space-y-2 text-gray-400">
                  <li>2 halftime demos per week</li>
                  <li>Access to the full demo library</li>
                  <li>Community support & discussion</li>
                </ul>
                <p className="mt-2 text-sm text-gray-400 italic">Perfect for trying us out.</p>
              </div>
              {renderButton('free', 'Free')}
            </div>

            {/* Basic Tier */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-200">Basic</h3>
                <p className="text-3xl font-extrabold text-yellow-400 mb-4">$6.99/mo</p>
                <ul className="space-y-2 text-gray-400">
                  <li>10 full demos per month</li>
                  <li>Up to 1080p @ 30 FPS</li>
                  <li>Access to the Pro Utility Book</li>
                  <li>Standard processing queue</li>
                  <li>Community support</li>
                </ul>
                <p className="mt-2 text-sm text-gray-400 italic">Steady, reliable monthly plan.</p>
              </div>
              {renderButton('basic', '$6.99/mo')}
            </div>

            {/* Advanced Tier (Recommended) */}
            <div className="relative bg-yellow-400 rounded-lg p-6 flex flex-col justify-between shadow-lg ring-2 ring-yellow-300">
              {/* “Recommended” Badge */}
              <div className="absolute -top-3 right-3 bg-gray-900 text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full">
                Recommended
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Advanced</h3>
                <p className="text-3xl font-extrabold text-gray-900 mb-4">$12.99/mo</p>
                <ul className="space-y-2 text-gray-900">
                  <li>Create highlight clips & quick replays</li>
                  <li>Up to 30 demos per month</li>
                  <li>Design & customize your own Utility Book</li>
                  <li>Generate 2D views from any demo</li>
                  <li>Multiple POV options</li>
                  <li>Interactive quizzes during POV playback</li>
                  <li>Create demos for any player</li>
                  <li>Capture keystrokes in-game</li>
                  <li>Priority processing queue</li>
                  <li>Premium support</li>
                </ul>
                <p className="mt-2 text-sm text-gray-800 italic">
                  Perfect balance of power & value for serious players.
                </p>
              </div>
              {renderButton('advanced', '$12.99/mo')}
            </div>

            {/* Pro Tier */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-200">Pro</h3>
                <p className="text-3xl font-extrabold text-yellow-400 mb-4">$25.99/mo</p>
                <ul className="space-y-2 text-gray-400">
                  <li>Up to 4K demo resolution</li>
                  <li>Customized death screens</li>
                  <li>Early access to new features</li>
                  <li>Dedicated custom support</li>
                  <li>Professional analytics video overlay</li>
                  <li>Fully customizable video exports</li>
                  <li>Connect multiple games under one account</li>
                  <li>Select & analyze specific rounds</li>
                  <li>Fastest generation times</li>
                  <li>Express processing priority</li>
                  <li>24/7 priority support</li>
                </ul>
                <p className="mt-2 text-sm text-gray-400 italic">
                  The ultimate toolkit for pro-level analysis.
                </p>
              </div>
              {renderButton('pro', '$25.99/mo')}
            </div>

            {/* Pro Annual Tier */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between bg-gray-900">
              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Pro (Annual)</h3>
                <p className="text-3xl font-extrabold text-yellow-400 mb-4">$249.99/yr</p>
                <ul className="space-y-2 text-gray-200">
                  <li>All Pro features (4K demos, custom death screens, etc.)</li>
                  <li>Save 20% vs. the monthly Pro plan</li>
                  <li>Billed once per year for convenience</li>
                  <li>Dedicated custom support & early feature access</li>
                </ul>
                <p className="mt-2 text-sm text-gray-200 italic">
                  Best value if you’re committed for the long term.
                </p>
              </div>
              {renderButton('pro_annual', '$249.99/yr')}
            </div>

            {/* Team Tier */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-200">Team (7 seats)</h3>
                <p className="text-3xl font-extrabold text-yellow-400 mb-4">$149.99/mo</p>
                <ul className="space-y-2 text-gray-400">
                  <li>All Pro features for up to 7 team members</li>
                  <li>Team analytics dashboard & centralized billing</li>
                  <li>Admin controls to manage seats & permissions</li>
                  <li>Volume-discounted pricing vs. individual Pro accounts</li>
                  <li>Dedicated priority support for your entire team</li>
                  <li>Early access to new enterprise tools</li>
                </ul>
                <p className="mt-2 text-sm text-gray-400 italic">
                  Perfect for small squads, coaches & organizations.
                </p>
              </div>
              {renderButton('team', '$149.99/mo')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePlansModal;
