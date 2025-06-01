// components/POVlib/ComparePlansModal.jsx
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
          Aktueller Plan
        </button>
      );
    }
    return (
      <button
        onClick={() => onSelectPlan(planKey)}
        className={`mt-6 px-4 py-2 font-semibold rounded-lg w-full transition 
          ${planKey === 'advanced' 
            ? 'bg-gray-900 text-yellow-400 hover:bg-gray-800 shadow-[0_0_15px_rgba(250,204,21,0.3)]' 
            : 'bg-gray-700 text-white hover:bg-gray-600'}`}
      >
        {planKey === 'advanced' 
          ? `Wähle für ${priceLabel}` 
          : `Wähle ${priceLabel}`}
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
      <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-5xl w-full overflow-y-auto shadow-[0_0_30px_rgba(250,204,21,0.15)]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Vergleiche alle Pläne</h2>
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
                <p className="text-3xl font-extrabold text-yellow-400 mb-4">Kostenlos</p>
                <ul className="space-y-2 text-gray-400">
                  <li>2 Halbzeit-Demos pro Woche</li>
                  <li>Zugriff auf die gesamte Demo-Bibliothek</li>
                  <li>Ideal zum Reinschnuppern ohne Risiko</li>
                  <li>Community-Support & Austausch</li>
                </ul>
              </div>
              {renderButton('free', 'Kostenlos')}
            </div>

            {/* Basic Tier */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-200">Basic</h3>
                <p className="text-3xl font-extrabold text-yellow-400 mb-4">6,99 €</p>
                <ul className="space-y-2 text-gray-400">
                  <li>10 komplette Demos pro Monat</li>
                  <li>Auflösungen bis zu 1080p & 30 FPS</li>
                  <li>Zugang zum Pro Utility Book</li>
                  <li>Schneller Community-Support</li>
                </ul>
                <p className="mt-2 text-sm text-gray-400 italic">
                  Perfekt für ambitionierte Einsteiger.
                </p>
              </div>
              {renderButton('basic', '6,99 €')}
            </div>

            {/* Advanced Tier (Empfohlen) */}
            <div className="relative bg-yellow-400 rounded-lg p-6 flex flex-col justify-between shadow-lg ring-2 ring-yellow-300">
              {/* “Empfohlen”-Badge */}
              <div className="absolute -top-3 right-3 bg-gray-900 text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full">
                Empfohlen
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Advanced</h3>
                <p className="text-3xl font-extrabold text-gray-900 mb-4">14,99 €</p>
                <ul className="space-y-2 text-gray-900">
                  <li>Bis zu 30 Demos pro Monat</li>
                  <li>Eigene Highlight-Clips & Utility Books erstellen</li>
                  <li>2D-Ansichten & mehrere POV-Optionen</li>
                  <li>Interaktive Quizze beim Demo-Anschauen</li>
                  <li>Demos für jeden gewünschten Spieler</li>
                  <li>Zeige deine eigenen Keystrokes</li>
                </ul>
                <p className="mt-2 text-sm text-gray-800 italic">
                  Für Spieler, die ihre Skills auf das nächste Level heben.
                </p>
              </div>
              {renderButton('advanced', '14,99 €')}
            </div>

            {/* Pro Tier */}
            <div className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-200">Pro</h3>
                <p className="text-3xl font-extrabold text-yellow-400 mb-4">25,99 €</p>
                <ul className="space-y-2 text-gray-400">
                  <li>Demos in bis zu 4K-Auflösung</li>
                  <li>Individualisierte Deathscreens & Videos</li>
                  <li>Exklusiver Early-Access zu neuen Features</li>
                  <li>24/7 persönlicher Priority-Support</li>
                  <li>Professionelle Analyse-Videos mit Stats</li>
                  <li>Mehrere Spiele verbinden & Runden auswählen</li>
                  <li>Blitzschnelle Generierung ohne Wartezeit</li>
                </ul>
                <p className="mt-2 text-sm text-gray-400 italic">
                  Optimal für Profis und Teams ohne Kompromisse.
                </p>
              </div>
              {renderButton('pro', '25,99 €')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePlansModal;
