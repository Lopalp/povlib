"use client";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PrimaryButton, SecondaryButton } from "../../components/buttons";

const plans = [
  {
    key: "basic",
    name: "Basic",
    priceLabel: "$6.99/mo",
    features: [
      "10 full demos per month",
      "Up to 1080p @ 30fps",
      "Access to the Pro Utility Book",
      "Standard processing queue",
    ],
  },
  {
    key: "advanced",
    name: "Advanced",
    priceLabel: "$12.99/mo",
    features: [
      "Create highlight clips",
      "Up to 30 demos per month",
      "Build your own Utility Book",
      "2D views & multiple POVs",
      "Custom quizzes while watching demos",
      "Generate demos for any player",
      "Get your own keystrokes in your games",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    priceLabel: "$25.99/mo",
    features: [
      "Up to 4K demo exports",
      "Customized death screens",
      "Early access to new features",
      "Dedicated support",
      "Professional analytics video view",
      "Customizable videos",
      "Connect multiple games",
      "Select specific rounds",
      "Fastest generation times",
    ],
  },
];

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan") || "basic";

  const plan = useMemo(() => plans.find((p) => p.key === planKey) || plans[0], [
    planKey,
  ]);

  return (
    <main className="min-h-screen pt-24 pb-12 bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Benefits */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Benefits of {plan.name}</h2>
            <ul className="space-y-2 text-gray-300 text-sm">
              {plan.features.map((feat, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-xs">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Invoice & payment */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Your Order</h2>
            <p className="text-gray-400 text-sm">Plan</p>
            <p className="text-2xl font-bold text-white mb-2">{plan.name}</p>
            <p className="text-4xl font-extrabold text-yellow-400 mb-6">{plan.priceLabel}</p>
            <PrimaryButton className="w-full mb-3">Proceed to Payment</PrimaryButton>
            <Link href="/">
              <SecondaryButton className="w-full">Cancel</SecondaryButton>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-400">Loading...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
