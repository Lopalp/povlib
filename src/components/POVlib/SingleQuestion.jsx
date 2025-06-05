'use client';

import React from 'react';

const SingleQuestion = ({
  questionText,
  type,
  options = [],
  answer,
  onChange,
  onSubmit,
  disabled,
}) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
      <label className="block text-gray-200 font-medium">{questionText}</label>

      {type === 'radio' && options.length > 0 ? (
        <div className="flex gap-4">
          {options.map((opt) => (
            <label key={opt} className="inline-flex items-center gap-1 text-gray-200">
              <input
                type="radio"
                name="singleQuestion"
                value={opt}
                checked={answer === opt}
                onChange={(e) => onChange(e.target.value)}
                className="form-radio h-4 w-4 text-yellow-500"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      ) : (
        <input
          type="text"
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Deine Antwort"
        />
      )}

      <button
        onClick={onSubmit}
        disabled={disabled}
        className={`mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${
          !disabled
            ? 'bg-yellow-500 text-black hover:bg-yellow-600 transition'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        Absenden
      </button>
    </div>
  );
};

export default SingleQuestion;
