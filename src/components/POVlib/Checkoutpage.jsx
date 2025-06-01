// components/POVlib/CheckoutPage.jsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CreditCard, Paypal, Shield } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

// 1) Hier definieren wir einmalig alle Details zu jedem Plan
const PLAN_DETAILS = {
  free: {
    key: 'free',
    name: 'Free',
    features: [
      '2 Halftime demos per week',
      'Access to the full demo library',
      'Risk-free entry into POVLib',
      'Community support',
    ],
    baseMonthlyRate: 0,
  },
  basic: {
    key: 'basic',
    name: 'Basic',
    features: [
      '10 full demos per month',
      'Up to 1080p @ 30fps',
      'Access to the Pro Utility Book',
      'Standard processing queue',
    ],
    baseMonthlyRate: 6.99,
  },
  advanced: {
    key: 'advanced',
    name: 'Advanced',
    features: [
      'Create highlight clips',
      'Up to 30 demos per month',
      'Build your own Utility Book',
      '2D views & multiple POVs',
      'Custom quizzes while watching demos',
      'Generate demos for any player',
      'Get your own keystrokes in your games',
    ],
    baseMonthlyRate: 12.99,
  },
  pro: {
    key: 'pro',
    name: 'Pro',
    features: [
      'Up to 4K demo exports',
      'Customized death screens',
      'Early access to new features',
      'Dedicated support',
      'Professional analytics video view',
      'Customizable videos',
      'Connect multiple games',
      'Select specific rounds',
      'Fastest generation times',
    ],
    baseMonthlyRate: 25.99,
  },
};

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 2) Auslesen des Query-Parameters „plan“
  const planKey = searchParams.get('plan') || 'free';
  const plan = PLAN_DETAILS[planKey] || PLAN_DETAILS.free;

  const [selectedMethod, setSelectedMethod] = useState('card');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [isTeam, setIsTeam] = useState(false);

  // 3) Basis-Monatsrate aus den PLAN_DETAILS
  const baseMonthlyRate = useMemo(
    () => plan.baseMonthlyRate,
    [plan]
  );

  // 4) Einheitspreis berechnen (Annual = 20% Rabatt)
  const unitPrice = useMemo(() => {
    if (billingCycle === 'annual') {
      return +(baseMonthlyRate * 12 * 0.8).toFixed(2);
    }
    return +baseMonthlyRate.toFixed(2);
  }, [baseMonthlyRate, billingCycle]);

  // 5) Finaler Gesamtpreis (Team = 7 Sitze mit zusätzlichem Rabatt)
  const finalPrice = useMemo(() => {
    if (isTeam) {
      const seats = 7;
      if (billingCycle === 'annual') {
        return +((unitPrice * seats) * 0.85).toFixed(2); // 15 % extra off
      }
      return +((unitPrice * seats) * 0.9).toFixed(2); // 10 % off
    }
    return +unitPrice.toFixed(2);
  }, [unitPrice, isTeam, billingCycle]);

  // 6) Label z. B. „$44.00 /mo“ oder „$399.00 /yr“
  const priceLabel = useMemo(() => {
    const currency = '$';
    if (billingCycle === 'annual') {
      return `${currency}${finalPrice.toFixed(2)} /yr`;
    }
    // Für „Free“ setzen wir /mo auch auf 0
    return `${currency}${finalPrice.toFixed(2)} /mo`;
  }, [finalPrice, billingCycle]);

  // 7) Klartext unterhalb des Betrags
  const billingText = useMemo(() => {
    if (billingCycle === 'annual') return 'billed annually (20% off)';
    return 'billed monthly';
  }, [billingCycle]);

  const seatText = isTeam ? 'Team License (7 seats)' : 'Individual';

  // 8) Falls ein unbekannter planKey in der URL steht, zurück zur Start-Seite umleiten
  useEffect(() => {
    if (!PLAN_DETAILS[planKey]) {
      router.replace('/');
    }
  }, [planKey, router]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ─────────────
            Linke Spalte: Benefits
            ───────────── */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-lg flex flex-col">
          <h2 className="text-3xl font-extrabold mb-4 text-yellow-400">
            You’re One Step Away from {plan.name}!
          </h2>
          <p className="mb-6 text-gray-300">
            Upgrade now and unlock everything <span className="font-semibold">{plan.name}</span> has to offer.
            Join hundreds of players who’ve already improved with POVLib’s tools.
            <span className="font-semibold text-yellow-400"> No risk, all reward.</span>
          </p>

          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3 text-gray-200">
              Why {plan.name}?
            </h3>
            <ul className="space-y-2 text-gray-300">
              {plan.features.map((feat, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-yellow-400">★</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500 italic">
              30-day money-back guarantee • Secure SSL checkout • Priority support
            </p>
          </div>
        </div>

        {/* ─────────────
            Rechte Spalte: Checkout
            ───────────── */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-lg flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-white">Checkout</h2>

          {/* Plan-Zusammenfassung */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium">{plan.name} Plan</span>
              <span className="text-2xl font-extrabold text-yellow-400">
                {priceLabel}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {seatText}, {billingText} — cancel anytime.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">
              Billing Cycle
            </h3>
            <div className="flex space-x-4">
              <label
                className={`px-4 py-2 rounded-lg cursor-pointer border 
                  ${billingCycle === 'monthly'
                    ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                    : 'bg-gray-700 text-gray-300 border-gray-600'}
                  transition-colors`}
              >
                <input
                  type="radio"
                  name="billing"
                  value="monthly"
                  checked={billingCycle === 'monthly'}
                  onChange={() => setBillingCycle('monthly')}
                  className="sr-only"
                />
                Monthly
              </label>
              <label
                className={`px-4 py-2 rounded-lg cursor-pointer border 
                  ${billingCycle === 'annual'
                    ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                    : 'bg-gray-700 text-gray-300 border-gray-600'}
                  transition-colors`}
              >
                <input
                  type="radio"
                  name="billing"
                  value="annual"
                  checked={billingCycle === 'annual'}
                  onChange={() => setBillingCycle('annual')}
                  className="sr-only"
                />
                Annual <span className="text-sm text-gray-300">(20% off)</span>
              </label>
            </div>
          </div>

          {/* Team-Checkbox */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">
              License Type
            </h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isTeam}
                onChange={() => setIsTeam((prev) => !prev)}
                className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600 rounded"
              />
              <span className="text-gray-300">Team License (7 seats)</span>
              {isTeam && (
                <span className="ml-2 text-xs text-gray-400">
                  {billingCycle === 'annual' ? '(15% off total)' : '(10% off total)'}
                </span>
              )}
            </label>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-200">
              Payment Method
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="method"
                  value="card"
                  checked={selectedMethod === 'card'}
                  onChange={() => setSelectedMethod('card')}
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600"
                />
                <CreditCard className="w-5 h-5 ml-2 text-gray-300" />
                <span className="ml-2">Credit / Debit Card</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="method"
                  value="paypal"
                  checked={selectedMethod === 'paypal'}
                  onChange={() => setSelectedMethod('paypal')}
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600"
                />
                <Paypal className="w-5 h-5 ml-2 text-gray-300" />
                <span className="ml-2">PayPal</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="method"
                  value="crypto"
                  checked={selectedMethod === 'crypto'}
                  onChange={() => setSelectedMethod('crypto')}
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600"
                />
                <Shield className="w-5 h-5 ml-2 text-gray-300" />
                <span className="ml-2">Crypto (Bitcoin, Ethereum)</span>
              </label>
            </div>
          </div>

          {/* Credit Card Form (nur bei Auswahl „card“) */}
          {selectedMethod === 'card' && (
            <form className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-300"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label
                    htmlFor="expiry"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    id="expiry"
                    placeholder="MM/YY"
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="cvc"
                    className="block text-sm font-medium text-gray-300"
                  >
                    CVC
                  </label>
                  <input
                    type="text"
                    name="cvc"
                    id="cvc"
                    placeholder="123"
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="nameOnCard"
                  className="block text-sm font-medium text-gray-300"
                >
                  Name on Card
                </label>
                <input
                  type="text"
                  name="nameOnCard"
                  id="nameOnCard"
                  placeholder="Full Name"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
            </form>
          )}

          {/* Abschluss-Button */}
          <button
            type="button"
            className="w-full py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors shadow-[0_0_15px_rgba(250,204,21,0.3)]"
          >
            Complete Purchase
          </button>

          {/* Security & Trust */}
          <div className="mt-6 flex items-center text-sm text-gray-500">
            <Shield className="w-5 h-5 text-gray-500 mr-2" />
            <span>Secure payment • 256-bit SSL encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
