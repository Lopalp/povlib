// components/POVlib/UnderConstructionModal.jsx
'use client';

import React from 'react';
import { X } from 'lucide-react';

const UnderConstructionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-lg w-full p-6 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Site Under Construction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="text-gray-300 space-y-4">
          <p>
            <span className="font-semibold">Disclaimer:</span> This website is currently under
            construction. All content and functionality are provided <span className="italic">as-is</span>
            for demonstration purposes only. No guarantees of uptime, feature completeness, or
            accuracy are offered. You should not rely on any feature working in a production
            capacity.
          </p>
          <p>
            By using this site, you acknowledge that nothing here is guaranteed and you understand
            this is strictly a demo environment. Many features may be incomplete, non-functional, or
            subject to change at any time without notice.
          </p>
        </div>

        {/* Footer / Call to Action */}
        <div className="mt-6 flex justify-center">
          <a
            href="https://discord.gg/XDwTABQr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-[#5865F2] text-white font-semibold rounded-lg hover:bg-[#4752C4] transition-colors"
          >
            Join Our Server
          </a>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionModal;
