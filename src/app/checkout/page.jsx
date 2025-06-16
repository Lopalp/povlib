"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PrimaryButton, SecondaryButton } from "../../components/buttons";
import React, { useMemo } from "react";

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

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan") || "basic";

  const plan = useMemo(() => plans.find((p) => p.key === planKey) || plans[0], [planKey]);

  return (
    <main className="min-h-screen pt-24 pb-12 bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-lg mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-sm text-gray-400 mb-6">
            You are upgrading to the <span className="text-yellow-400 font-semibold">{plan.name}</span> plan.
          </p>
          <p className="text-4xl font-extrabold text-yellow-400 mb-6">{plan.priceLabel}</p>
          <ul className="text-left space-y-2 mb-6 text-gray-300 text-sm">
            {plan.features.map((feat, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 text-xs">•</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
          <PrimaryButton className="w-full mb-3">Proceed to Payment</PrimaryButton>
          <Link href="/">
            <SecondaryButton className="w-full">Cancel</SecondaryButton>
          </Link>
        </div>
      </div>
    </main>
  );
}
