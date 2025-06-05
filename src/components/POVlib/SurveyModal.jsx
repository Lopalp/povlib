'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

const SurveyModal = ({ isOpen, onClose, tabs, useCase, onSubmit }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || '');
  const [answers, setAnswers] = useState({});

  if (!isOpen) return null;

  const handleFieldChange = (tabKey, fieldName, value) => {
    setAnswers((prev) => ({
      ...prev,
      [tabKey]: {
        ...prev[tabKey],
        [fieldName]: value,
      },
    }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-bold text-white mb-4">
          {useCase === 'feedback'
            ? 'Alpha-Feedback Umfrage'
            : useCase === 'support'
            ? 'Support-Ticket Umfrage'
            : 'Profil-Umfrage'}
        </h3>

        {/* Tab-Navigation */}
        <div className="flex gap-2 mb-4 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab.key
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-300 hover:text-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Aktives Tab-Inhalt */}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {tabs.map((tab) =>
            tab.key === activeTab ? (
              <div key={tab.key}>
                {tab.fields.map((field) => {
                  const val =
                    answers[tab.key]?.[field.name] !== undefined
                      ? answers[tab.key][field.name]
                      : '';

                  switch (field.type) {
                    case 'text':
                      return (
                        <div key={field.name} className="mb-4">
                          <label className="block text-gray-200 mb-1">
                            {field.label}
                          </label>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) =>
                              handleFieldChange(tab.key, field.name, e.target.value)
                            }
                            className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                      );
                    case 'number':
                      return (
                        <div key={field.name} className="mb-4">
                          <label className="block text-gray-200 mb-1">
                            {field.label}
                          </label>
                          <input
                            type="number"
                            value={val}
                            onChange={(e) =>
                              handleFieldChange(tab.key, field.name, e.target.value)
                            }
                            className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                      );
                    case 'textarea':
                      return (
                        <div key={field.name} className="mb-4">
                          <label className="block text-gray-200 mb-1">
                            {field.label}
                          </label>
                          <textarea
                            value={val}
                            onChange={(e) =>
                              handleFieldChange(tab.key, field.name, e.target.value)
                            }
                            rows={4}
                            className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          ></textarea>
                        </div>
                      );
                    case 'radio':
                      return (
                        <div key={field.name} className="mb-4">
                          <span className="block text-gray-200 mb-1">
                            {field.label}
                          </span>
                          <div className="flex gap-4">
                            {field.options.map((opt) => (
                              <label
                                key={opt}
                                className="inline-flex items-center gap-1 text-gray-200"
                              >
                                <input
                                  type="radio"
                                  name={`${tab.key}-${field.name}`}
                                  value={opt}
                                  checked={val === opt}
                                  onChange={(e) =>
                                    handleFieldChange(tab.key, field.name, e.target.value)
                                  }
                                  className="form-radio h-4 w-4 text-yellow-500"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    case 'select':
                      return (
                        <div key={field.name} className="mb-4">
                          <label className="block text-gray-200 mb-1">
                            {field.label}
                          </label>
                          <select
                            value={val}
                            onChange={(e) =>
                              handleFieldChange(tab.key, field.name, e.target.value)
                            }
                            className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          >
                            <option value="">— Bitte wählen —</option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    case 'file':
                      return (
                        <div key={field.name} className="mb-4">
                          <label className="block text-gray-200 mb-1">
                            {field.label}
                          </label>
                          <input
                            type="file"
                            onChange={(e) =>
                              handleFieldChange(tab.key, field.name, e.target.files[0])
                            }
                            className="w-full text-gray-200"
                          />
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ) : null
          )}
        </div>

        {/* Submit-Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition"
          >
            Absenden
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;
