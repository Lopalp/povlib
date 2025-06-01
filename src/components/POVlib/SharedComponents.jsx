// components/POVlib/SharedComponents.jsx
'use client';

import React, { useState } from 'react';

// Apple-style Switch
export const Switch = ({ checked, onChange, label }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`block w-10 h-6 rounded-full transition-colors ${
          checked ? 'bg-yellow-400' : 'bg-gray-700'
        }`}
      />
      <div
        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </div>
    {label && <span className="ml-3 select-none text-gray-200">{label}</span>}
  </label>
);

// Collapsible section wrapper
export const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-700">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-4 py-3 text-left bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        <span className="text-lg font-semibold text-gray-200">{title}</span>
        <span className="text-gray-400">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="px-6 py-4">{children}</div>}
    </div>
  );
};
