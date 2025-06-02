// components/POVlib/ComparePlansModal.jsx
'use client';

import React from 'react';
import { X, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';

const ComparePlansModal = ({ isOpen, onClose, currentPlan }) => {
  if (!isOpen) return null;

  // Alle 4 Pläne in der Reihenfolge: free, basic, advanced, pro
  // Jährliche Preise mit 20 % Rabatt (Monatspreis * 12 * 0.8)
  const plans = [
    {
      key: 'free',
      name: 'Free',
      priceLabel: 'Kostenlos',
      yearlyLabel: '–',
      features: [
        '2 Halftime-Demos pro Woche',
        'Zugriff auf die komplette Demo-Bibliothek',
        'Risikoloser Einstieg',
        'Community-Support',
      ],
      highlight: '',
      badge: '',
      buttonStyle: 'border-gray-600 text-white hover:border-yellow-400',
      featureColor: 'text-gray-400',
      icon: <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />,
    },
    {
      key: 'basic',
      name: 'Basic',
      priceLabel: '€6.99/Monat',
      yearlyLabel: '€67,10/Jahr (20 % sparen)',
      features: [
        '10 Voll-Demos pro Monat',
        'Bis zu 1080p @ 30fps',
        'Zugriff auf das Pro Utility Book',
        'Standard-Verarbeitungswarteschlange',
      ],
      highlight: '',
      badge: '',
      buttonStyle: 'border-gray-600 text-white hover:border-yellow-400',
      featureColor: 'text-gray-400',
      icon: <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />,
    },
    {
      key: 'advanced',
      name: 'Advanced',
      priceLabel: '€12.99/Monat',
      yearlyLabel: '€124,70/Jahr (20 % sparen)',
      features: [
        'Highlight-Clips automatisch erstellen',
        'Bis zu 30 Demos pro Monat',
        'Eigenes Utility Book bauen',
        '2D-Ansichten & mehrere POVs',
        'Interaktive Quizze beim Anschauen',
        'Demos für jeden Spieler generieren',
        'Eigene Tastatureingaben in deinen Spielen sehen',
      ],
      highlight: 'Kundenliebling • Beste Preis-Leistung',
      badge: 'Most Popular',
      buttonStyle: 'bg-yellow-500 text-black hover:bg-yellow-600',
      featureColor: 'text-gray-300',
      icon: <Star className="h-5 w-5 text-yellow-400 flex-shrink-0" />,
    },
    {
      key: 'pro',
      name: 'Pro',
      priceLabel: '€25.99/Monat',
      yearlyLabel: '€249,50/Jahr (20 % sparen)',
      features: [
        '4K-Demo-Export möglich',
        'Individuelle Death-Screens',
        'Früher Zugriff auf neue Features',
        'Persönlicher Support',
        'Professionelle Analyse-Videos',
        'Vollständig anpassbare Videos',
        'Mehrere Spiele verbinden',
        'Runden-spezifische Auswahl',
        'Schnellste Generierungszeiten',
      ],
      highlight: 'Ideal für Teams & Profis',
      badge: '',
      buttonStyle: 'border-gray-500 text-white hover:bg-gray-700',
      featureColor: 'text-gray-300',
      icon: <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />,
    },
  ];

  const buttonLabel = (planKey, priceLabel) =>
    planKey === 'advanced' ? `Jetzt wählen: ${priceLabel}` : `Wählen: ${priceLabel}`;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`
          bg-gray-900 backdrop-blur-md border border-gray-700 rounded-xl w-full max-w-6xl
          max-h-[80vh] overflow-y-auto
          md:max-h-none md:overflow-visible
          shadow-[0_0_30px_rgba(250,204,21,0.25)]
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Pläne vergleichen</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors focus:outline-none"
            aria-label="Schließen"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body: Grid mit responsiven Spalten */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map(
              ({
                key,
                name,
                priceLabel,
                yearlyLabel,
                features,
                highlight,
                badge,
                buttonStyle,
                featureColor,
                icon,
              }) => (
                <div
                  key={key}
                  className={`
                    relative
                    flex flex-col justify-between
                    rounded-lg
                    overflow-visible
                    ${
                      key === 'advanced'
                        ? 'bg-gray-800 ring-2 ring-yellow-400 shadow-lg'
                        : key === 'pro'
                        ? 'bg-gray-800 ring-2 ring-gray-500 shadow-md'
                        : 'bg-gray-800 border border-gray-700'
                    }
                    transition-transform transform hover:scale-[1.02]
                  `}
                >
                  {/* Badge für Advanced */}
                  {badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-gray-900 text-xs font-semibold uppercase px-3 py-1 rounded-full shadow-xl">
                      {badge}
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <h3
                      className={`
                        font-bold mb-2 ${
                          key === 'advanced' || key === 'pro'
                            ? 'text-white'
                            : 'text-gray-200'
                        } text-lg
                      `}
                    >
                      {name}
                    </h3>

                    <div className="mb-4">
                      <p
                        className={`
                          font-extrabold mb-1 ${
                            key === 'advanced' || key === 'pro'
                              ? 'text-yellow-400'
                              : 'text-yellow-400'
                          } text-3xl
                        `}
                      >
                        {priceLabel}
                      </p>
                      {yearlyLabel !== '–' && (
                        <p className="text-sm md:text-base text-gray-400">
                          {yearlyLabel}
                        </p>
                      )}
                    </div>

                    <ul className={`mb-4 space-y-3 ${featureColor} text-sm md:text-base`}>
                      {features.map((f, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2 mt-0.5">{icon}</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {highlight && (
                      <p
                        className={`
                          italic text-sm md:text-base ${
                            key === 'advanced' || key === 'pro'
                              ? 'text-gray-300'
                              : 'text-gray-500'
                          }
                        `}
                      >
                        {highlight}
                      </p>
                    )}
                  </div>

                  {/* Auswahl-Button */}
                  <div className="p-6 pt-0">
                    {currentPlan === key ? (
                      <button
                        disabled
                        className="w-full px-4 py-2 font-semibold rounded-lg bg-gray-700 text-gray-500 cursor-not-allowed text-base"
                      >
                        Aktueller Plan
                      </button>
                    ) : (
                      <Link href={`/checkout?plan=${key}`} passHref>
                        <button
                          className={`
                            w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold text-base
                            ${buttonStyle}
                            transition hover:scale-[1.02]
                          `}
                        >
                          {buttonLabel(key, priceLabel)}
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePlansModal;
