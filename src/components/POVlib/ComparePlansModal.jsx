// components/POVlib/ComparePlansModal.jsx
'use client';

import React from 'react';
import { X } from 'lucide-react';

const ComparePlansModal = ({ isOpen, onClose, onUpgradeToPro, currentPlan }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-2xl w-full overflow-y-auto shadow-[0_0_30px_rgba(250,204,21,0.15)]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-4">Standard</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>5 Credits / Month</li>
                  <li>Basic Utility Book</li>
                  <li>Standard Processing</li>
                  <li>Community Support</li>
                </ul>
              </div>
              <button
                disabled={currentPlan === 'standard'}
                className={`mt-6 px-4 py-2 font-semibold rounded-lg w-full transition
                  ${currentPlan === 'standard'
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                {currentPlan === 'standard' ? 'Current Plan' : 'Active'}
              </button>
            </div>

            {/* Pro */}
            <div className="bg-yellow-400 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-900">Pro</h3>
                <ul className="space-y-2 text-gray-900">
                  <li>Unlimited Credits</li>
                  <li>Full Utility Book</li>
                  <li>Priority Processing</li>
                  <li>Premium Support</li>
                  <li>Early Access Demos</li>
                </ul>
              </div>
              <button
                onClick={onUpgradeToPro}
                className="mt-6 px-4 py-2 bg-gray-900 text-yellow-400 font-semibold rounded-lg w-full hover:bg-gray-800 transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)]"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePlansModal;
