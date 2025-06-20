// components/POVlib/PlanComparisonModule.jsx
"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import ComparePlansModal from "../modals/ComparePlansModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SecondaryButton } from "../buttons";

const PlanComparisonModule = ({ currentPlan }) => {
  const router = useRouter();
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // 1) Alle Pläne in aufsteigender Reihenfolge
  const allPlans = useMemo(
    () => [
      {
        key: "free",
        name: "Free",
        priceLabel: "Free",
        features: [
          "2 Halftime demos per week",
          "Access to the full demo library",
          "Risk-free entry into POVLib",
          "Community support",
        ],
        highlight: "Start for free und erkunde alle Grundlagen.",
      },
      {
        key: "basic",
        name: "Basic",
        priceLabel: "$6.99/mo",
        features: [
          "10 Full-Demos pro Monat",
          "Bis zu 1080p @ 30fps",
          "Zugriff auf das Pro Utility Book",
          "Standard-Verarbeitungs-Queue",
        ],
        highlight: "Beliebter Einstiegspack.",
      },
      {
        key: "advanced",
        name: "Advanced",
        priceLabel: "$12.99/mo",
        features: [
          "Highlight-Clips erstellen",
          "Bis zu 30 Demos pro Monat",
          "Baue dein eigenes Utility Book",
          "2D-Views & mehrere POVs",
          "Custom-Quizzes beim Anschauen der Demos",
          "Demos für jeden Spieler generieren",
          "Eigene Tastenanschläge in Spielen sehen",
        ],
        highlight: "Alles, um auf das nächste Level zu kommen.",
      },
      {
        key: "pro",
        name: "Pro",
        priceLabel: "$25.99/mo",
        features: [
          "Bis zu 4K Demo-Exporte",
          "Individualisierte Death-Screens",
          "Früher Zugriff auf neue Features",
          "Dedizierter Support",
          "Professionelle Analytics-Video-Ansicht",
          "Anpassbare Videos",
          "Mehrere Spiele verbinden",
          "Bestimmte Runden auswählen",
          "Schnellste Generierungszeiten",
        ],
        highlight: "Für ernste Spieler und Teams.",
      },
    ],
    []
  );

  // 2) Aktuellen Plan und nächsten Plan finden
  const { currentPlanData, nextPlanData } = useMemo(() => {
    const idx = allPlans.findIndex((p) => p.key === currentPlan);
    const current = idx >= 0 ? allPlans[idx] : null;
    const next =
      idx >= 0 && idx < allPlans.length - 1 ? allPlans[idx + 1] : null;
    return { currentPlanData: current, nextPlanData: next };
  }, [currentPlan, allPlans]);

  if (!currentPlanData) {
    return (
      <div className="bg-red-800 text-red-200 rounded-2xl p-6">
        <p className="text-sm font-semibold">
          Error: Unbekannter Plan „{currentPlan}“.
        </p>
      </div>
    );
  }

  // 3) Wenn der Nutzer schon beim höchsten Plan ist
  if (!nextPlanData) {
    return (
      <>
        <div className="bg-gray-900 rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            You're on the highest plan!
          </h2>
          <p className="text-sm text-gray-300 mb-6">
            Du hast bereits den{" "}
            <span className="font-semibold text-yellow-400">
              {currentPlanData.name}
            </span>
            -Plan, der alle Features enthält.
          </p>
          <button
            onClick={() => router.push(`/checkout?plan=${currentPlanData.key}`)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-gray-700 text-gray-500 font-semibold cursor-pointer hover:bg-gray-600 transition"
          >
            <X className="w-5 h-5" />
            <span className="text-sm">Manage Subscription</span>
          </button>
          <div className="mt-4">
            <button
              onClick={() => setIsCompareOpen(true)}
              className="text-yellow-400 text-sm underline hover:text-yellow-500 transition-colors"
            >
              View All Plans
            </button>
          </div>
        </div>
        <ComparePlansModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          currentPlan={currentPlan}
        />
      </>
    );
  }

  // 4) Anzeige der aktuellen Plan-Karte und des nächsten Plankarte
  return (
    <>
      <section className="bg-gray-900 rounded-2xl p-8 space-y-6 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-fade pointer-events-none"></div>
        <style jsx>{`
          .bg-pattern-fade {
            /* Von rechts nach links verlaufende, subtilere Punkte: */
            background-image: radial-gradient(
              rgba(255, 255, 255, 0.05) 1.5px,
              transparent 1.5px
            );
            background-size: 28px 28px;
            mask-image: linear-gradient(
              to left,
              rgba(0, 0, 0, 1) 0%,
              rgba(0, 0, 0, 0) 100%
            );
          }
        `}</style>

        {/* Nur eine Überschrift */}
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Compare Your Plan
        </h2>

        {/* Vergleichsgitter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aktueller Plan */}
          <div className="border border-gray-700 rounded-2xl p-6 flex flex-col bg-gray-800">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-200 relative z-10">
              {currentPlanData.name}
            </h3>
            <p className="text-3xl font-extrabold text-yellow-400 mb-4">
              {currentPlanData.priceLabel}
            </p>
            <ul className="space-y-2 text-gray-400 flex-grow text-sm">
              {currentPlanData.features.map((feat, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 text-xs">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <SecondaryButton
              disabled
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2"
            >
              <span className="text-sm">Current Plan</span>
            </SecondaryButton>
          </div>

          {/* Nächster Plan */}
          <div className="border border-gray-700 rounded-2xl p-6 flex flex-col bg-gray-900 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg md:text-xl font-bold text-white relative z-10">
                {nextPlanData.name}
              </h3>
              <span className="text-sm text-yellow-400 font-semibold">
                Upgrade
              </span>
            </div>
            <p className="text-3xl font-extrabold text-white mb-4">
              {nextPlanData.priceLabel}
            </p>
            <ul className="space-y-2 text-gray-200 flex-grow text-sm">
              {nextPlanData.features.map((feat, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 text-xs text-yellow-400">★</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <Link href={`/checkout?plan=${nextPlanData.key}`}>
              <button className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md border-2 border-yellow-400 text-yellow-400 font-semibold hover:bg-yellow-400 hover:text-black transition w-full">
                <span className="text-sm">Upgrade to {nextPlanData.name}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        <div className="relative z-10">
          <button
            onClick={() => setIsCompareOpen(true)}
            className="text-yellow-400 text-sm underline hover:text-yellow-500 transition-colors"
          >
            View All Plans
          </button>
        </div>
      </section>

      <ComparePlansModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentPlan={currentPlan}
      />
    </>
  );
};

export default PlanComparisonModule;
