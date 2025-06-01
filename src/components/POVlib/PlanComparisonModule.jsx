// components/POVlib/PlanComparisonModule.jsx
'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import ComparePlansModal from './ComparePlansModal';

const PlanComparisonModule = ({ currentPlan, onUpgrade }) => {
  // 1) Define all plans in ascending order of price/feature set.
  const allPlans = useMemo(
    () => [
      {
        key: 'free',
        name: 'Free',
        priceLabel: 'Kostenlos',
        features: [
          '2 Halbzeit-Demos pro Woche – ständig neues Lernmaterial',
          'Zugriff auf die gesamte Demo-Bibliothek',
          'Perfekt zum Reinschnuppern ohne Verpflichtung',
          'Community-Support und Austausch',
        ],
        highlight: 'Starte direkt ohne Risiko und entdecke alle Basics.',
      },
      {
        key: 'basic',
        name: 'Basic',
        priceLabel: '6,99 €',
        features: [
          '10 komplette Demos pro Monat – klare Schritte zum Aufstieg',
          'Qualität bis zu 1080p & 30 FPS für kristallklare Sicht',
          'Zugang zum Pro Utility Book – Profi-Wissen zum Greifen nah',
          'Schneller Support über unser Community-Forum',
        ],
        highlight: 'Ideal für Einsteiger, die regelmäßig trainieren wollen.',
      },
      {
        key: 'advanced',
        name: 'Advanced',
        priceLabel: '14,99 €',
        features: [
          'Bis zu 30 Demos pro Monat – maximales Lernvolumen',
          'Erstelle eigene Highlight-Clips & Utility Books',
          '2D-Ansichten deiner Demos & mehrere POV-Optionen',
          'Interaktive Quizze beim Anschauen unserer Demo-Videos',
          'Demo-Erstellung für jeden Spieler – volle Flexibilität',
          'Zeige deine eigenen Keystrokes in jedem Spiel',
        ],
        highlight: 'Für ambitionierte Spieler, die ihre Skills schärfen wollen.',
      },
      {
        key: 'pro',
        name: 'Pro',
        priceLabel: '25,99 €',
        features: [
          'Demos in bis zu 4K-Auflösung – jedes Detail überzeugt',
          'Individuelle Deathscreens & komplett anpassbare Videos',
          'Exklusiver Early-Access zu neuen Features',
          'Persönlicher, priorisierter Support rund um die Uhr',
          'Professionelle Analyse-Videos mit erweiterten Statistiken',
          'Verknüpfe mehrere Spiele & wähle gezielt Runden aus',
          'Superschnelle Generierungszeiten – keine Wartezeit',
        ],
        highlight: 'Für Profis und Teams, die keine Kompromisse eingehen.',
      },
    ],
    []
  );

  // 2) Find index of current plan → determine next plan (if any).
  const { currentPlanData, nextPlanData } = useMemo(() => {
    const idx = allPlans.findIndex((p) => p.key === currentPlan);
    const current = idx >= 0 ? allPlans[idx] : null;
    const next = idx >= 0 && idx < allPlans.length - 1 ? allPlans[idx + 1] : null;
    return { currentPlanData: current, nextPlanData: next };
  }, [currentPlan, allPlans]);

  // 3) If currentPlanData is not found (unexpected key), bail out.
  if (!currentPlanData) {
    return (
      <div className="bg-red-800 text-red-200 rounded-lg p-6">
        <p className="font-semibold">Fehler: Unbekannter Plan &quot;{currentPlan}&quot;.</p>
      </div>
    );
  }

  // 4) If user is on the highest tier, show a special message.
  if (!nextPlanData) {
    const [isCompareOpen, setIsCompareOpen] = useState(false);

    return (
      <>
        <div className="bg-gray-800 rounded-2xl p-8 shadow-lg text-center text-gray-200">
          <h2 className="text-2xl font-bold mb-4">Du bist bereits im Top-Level!</h2>
          <p className="mb-6">
            Du nutzt den <span className="font-semibold">{currentPlanData.name}</span>-Plan mit allen verfügbaren Features.
          </p>
          <button
            onClick={() => onUpgrade(null)}
            className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5 mr-2" />
            Abo verwalten
          </button>
          <button
            onClick={() => setIsCompareOpen(true)}
            className="mt-4 px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors shadow-[0_0_10px_rgba(250,204,21,0.2)]"
          >
            Alle Pläne anzeigen
          </button>
        </div>
        <ComparePlansModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          onSelectPlan={onUpgrade}
          currentPlan={currentPlan}
        />
      </>
    );
  }

  // 5) Otherwise, render side-by-side comparison of currentPlanData vs. nextPlanData.
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  return (
    <>
      <section className="bg-gray-800 rounded-2xl p-8 space-y-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Vergleiche deinen Plan</h2>
          <span className="flex items-center text-gray-400 text-sm">
            Nächstes Level: <span className="ml-1 font-semibold text-yellow-400">{nextPlanData.name}</span>
            <ArrowRight className="w-5 h-5 ml-1 text-yellow-400" />
          </span>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Plan Card */}
          <div className="border border-gray-700 rounded-lg p-6 flex flex-col">
            <h3 className="text-lg font-bold mb-2 text-gray-200">{currentPlanData.name}</h3>
            <p className="text-3xl font-extrabold text-yellow-400 mb-4">
              {currentPlanData.priceLabel}
            </p>
            <ul className="space-y-2 text-gray-400 flex-grow">
              {currentPlanData.features.map((feat, i) => (
                <li key={i} className="flex items-center">
                  <span className="mr-2 text-xs">•</span> {feat}
                </li>
              ))}
            </ul>
            <p className="mt-4 italic text-sm text-gray-500">{currentPlanData.highlight}</p>
            <button
              disabled
              className="mt-6 px-4 py-2 font-semibold rounded-lg w-full bg-gray-700 text-gray-500 cursor-not-allowed"
            >
              Aktueller Plan
            </button>
          </div>

          {/* Next Plan Card */}
          <div className="border border-gray-700 rounded-lg p-6 flex flex-col bg-gray-900 shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold mb-2 text-white">{nextPlanData.name}</h3>
              <span className="text-sm text-yellow-400 font-semibold">Upgrade</span>
            </div>
            <p className="text-3xl font-extrabold text-white mb-4">{nextPlanData.priceLabel}</p>
            <ul className="space-y-2 text-gray-200 flex-grow">
              {nextPlanData.features.map((feat, i) => (
                <li key={i} className="flex items-center">
                  <span className="mr-2 text-xs text-yellow-400">★</span> {feat}
                </li>
              ))}
            </ul>
            <p className="mt-4 italic text-sm text-gray-300">{nextPlanData.highlight}</p>
            <button
              onClick={() => onUpgrade(nextPlanData.key)}
              className="mt-6 px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg w-full hover:bg-yellow-300 transition-colors shadow-[0_0_10px_rgba(250,204,21,0.2)]"
            >
              Upgrade auf {nextPlanData.name}
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsCompareOpen(true)}
          className="mt-6 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg w-full hover:bg-gray-600 transition-colors"
        >
          Alle Pläne anzeigen
        </button>
      </section>

      <ComparePlansModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onSelectPlan={onUpgrade}
        currentPlan={currentPlan}
      />
    </>
  );
};

export default PlanComparisonModule;
