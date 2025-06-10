// components/POVlib/SharedComponents.jsx
"use client";

import React from "react";

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
          checked ? "bg-yellow-400" : "bg-gray-700"
        }`}
      />
      <div
        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </div>
    {label && <span className="ml-3 select-none text-gray-200">{label}</span>}
  </label>
);
