'use client';

import React from 'react';
import { X } from 'lucide-react';

const ComparePlansModal = ({ isOpen, onClose, onSelectPlan, currentPlan }) => {
  if (!isOpen) return null;

  // Utility function to render each plan’s button
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
    return (
      <button
        onClick={() => onSelectPlan(planKey)}
        className={`mt-6 px-4 py-2 font-semibold rounded-lg w-full transition 
          ${planKey === 'standard'
            ? 'bg-gray-900 text-yellow-400 hover:bg-gray-800 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
            : 'bg-gray-700 text-white hover:bg-gray-600'}`}
      >
        {planKey === 'standard'
          ? `Choose for ${priceLabel}`
          : `Select ${priceLabel}`}
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
      <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-4xl w-full overflow-y-auto shadow-[0_0_30px_rgba(250,204,21,0.15)]">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Free Tier */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-200">Free</h3>
                <p className="text-3xl font-extrabold text-yellow-400 mb-4">Free</p>
                <ul className="space-y-2 text-gray-400">
                  <li>1 Credit / Month</li>
                  <li>Community Support</li>
                  <li>Basic Utility Book Excerpt</li>
                  <li>Standard Processing Queue</li>
                </ul>
              </div>
              {renderButton('free', 'Free')}
            </div>

            {/* Basic Tier */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-200">Basic</h3>
                <p className="text-3xl font-extrabold text-yellow-400 mb-4">6.99 $</p>
                <ul className="space-y-2 text-gray-400">
                  <li>3 Credits / Month</li>
                  <li>Basic Utility Book</li>
                  <li>Standard Processing</li>
                  <li>Community Support</li>
                </ul>
              </div>
              {renderButton('basic', '6.99 $')}
            </div>

            {/* Standard Tier (Recommended) */}
            <div className="relative bg-yellow-400 rounded-lg p-6 flex flex-col justify-between shadow-lg ring-2 ring-yellow-300">
              {/* “Recommended” Badge */}
              <div className="absolute -top-3 right-3 bg-gray-900 text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full">
                Recommended
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Standard</h3>
                <p className="text-3xl font-extrabold text-gray-900 mb-4">12.99 $</p>
                <ul className="space-y-2 text-gray-900">
                  <li>5 Credits / Month (+50 % more)</li>
                  <li>Full Utility Book</li>
                  <li>Priority Processing</li>
                  <li>Premium Support</li>
                </ul>
                <p className="mt-2 text-sm text-gray-800 italic">
                  Best balance of price &amp; value
                </p>
              </div>
              {renderButton('standard', '12.99 $')}
            </div>

            {/* Pro Tier */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-200">Pro</h3>
                <p className="text-3xl font-extrabold text-yellow-400 mb-4">25.99 $</p>
                <ul className="space-y-2 text-gray-400">
                  <li>Unlimited Credits</li>
                  <li>Complete Utility Book + Exclusive Chapters</li>
                  <li>Express Processing</li>
                  <li>Priority Support 24/7</li>
                  <li>Exclusive Early-Access Demos</li>
                </ul>
                <p className="mt-2 text-sm text-gray-400 italic">
                  Ideal for professionals &amp; teams
                </p>
              </div>
              {renderButton('pro', '25.99 $')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePlansModal;
