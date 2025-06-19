"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Die Preis- und Feature-Daten sind jetzt hier definiert.
const plansData = {
  free: {
    name: "Free",
    description: "The perfect start.",
    features: [
      { text: "2 halftime demos per week", included: true },
      { text: "Access to the demo library", included: true },
      { text: "Pro Utility Book", included: false },
    ],
  },
  basic: {
    name: "Basic",
    description: "For frequent players.",
    monthlyPrice: 6.99,
    yearlyMonthlyPrice: 6,
    yearlyTotal: 67.1,
    features: [
      { text: "10 full demos per month", included: true },
      { text: "Up to 1080p @ 30fps", included: true },
      { text: "Access to the Pro Utility Book", included: true },
      { text: "Standard processing queue", included: true },
    ],
  },
  pro: {
    name: "Pro",
    description: "For ambitious players & teams.",
    monthlyPrice: 25.99,
    yearlyMonthlyPrice: 20,
    yearlyTotal: 249.5,
    features: [
      { text: "Up to 30 demos per month", included: true },
      { text: "Up to 4K demo exports", included: true },
      { text: "Create highlight clips", included: true },
      { text: "Build your own Utility Book", included: true },
      { text: "Fastest generation times", included: true },
      { text: "Dedicated support", included: true },
    ],
  },
};


function CheckoutPageContent() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#f3f3f3]">
       {/* The 'jsx' and 'global' attributes have been removed to fix the React warning. */}
       <style>{`
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0E0E10;
            background-image: radial-gradient(ellipse at top, rgba(29, 78, 216, 0.15), transparent 60%),
                              radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.1), transparent 70%);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
      `}</style>

      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-10 fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Choose your POVlib Plan</h1>
          <p className="text-lg text-gray-400">Find the plan that best fits your needs.</p>
        </div>

        {/* Monthly/Yearly Button Group */}
        <div className="flex justify-center items-center space-x-2 mb-12 fade-in delay-1">
          <div className="p-1 rounded-full bg-[#1a1a21] border border-gray-700 flex items-center">
            <button 
              onClick={() => setIsYearly(false)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${!isYearly ? 'bg-gray-600 text-white' : 'text-gray-400'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsYearly(true)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${isYearly ? 'bg-gray-600 text-white' : 'text-gray-400'}`}
            >
              Yearly
            </button>
          </div>
          <span className="bg-blue-800 text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">SAVE 20%</span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Free Plan */}
          <div className="bg-[#1a1a21] border border-gray-700 rounded-2xl p-8 flex flex-col fade-in delay-2 opacity-0">
            <h3 className="text-2xl font-bold text-white mb-2">{plansData.free.name}</h3>
            <p className="text-gray-400 mb-6 h-10">{plansData.free.description}</p>
            <p className="text-5xl font-extrabold text-white mb-6">Free</p>
            <button disabled className="w-full bg-[#2a2a30] text-gray-500 font-semibold py-3 rounded-full mb-8 cursor-not-allowed">Current Plan</button>
            <ul className="space-y-3 text-gray-300 flex-grow text-sm">
              {plansData.free.features.map((feature, index) => (
                <li key={index} className={`flex items-center ${!feature.included && 'text-gray-500'}`}>
                   {feature.included ? (
                       <svg className="w-4 h-4 text-green-500 mr-3 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                   ) : (
                       <svg className="w-4 h-4 text-red-500 mr-3 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                   )}
                  {feature.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Basic Plan (Most Popular) */}
          <div className="relative p-px rounded-2xl fade-in delay-3 opacity-0" style={{background: 'linear-gradient(to bottom, #facc15, rgba(250, 204, 21, 0.1))'}}>
            <div className="bg-[#1a1a21] rounded-[15px] p-8 flex flex-col h-full">
              <div className="absolute top-4 right-4">
                   <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{plansData.basic.name}</h3>
              <p className="text-gray-400 mb-6 h-10">{plansData.basic.description}</p>
              <div className="mb-6">
                <p className="text-5xl font-extrabold text-white">
                  ${isYearly ? plansData.basic.yearlyMonthlyPrice : plansData.basic.monthlyPrice.toFixed(2)}
                  <span className="text-xl font-semibold text-gray-400">/mo</span>
                </p>
                <p className="text-sm text-gray-500 h-4">
                  {isYearly ? `Billed as $${plansData.basic.yearlyTotal.toFixed(2)} per year` : 'Save with yearly billing!'}
                </p>
              </div>
              <a href="/checkout?plan=basic" className="w-full bg-white text-center text-black font-semibold py-3 rounded-full mb-8 hover:bg-gray-200 transition-transform hover:scale-105">Subscribe</a>
              <ul className="space-y-3 text-gray-300 flex-grow text-sm">
                {plansData.basic.features.map((feature, index) => (
                    <li key={index} className="flex items-center"><svg className="w-4 h-4 text-green-500 mr-3 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>{feature.text}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#1a1a21] border border-gray-700 rounded-2xl p-8 flex flex-col relative fade-in delay-4 opacity-0">
              <h3 className="text-2xl font-bold text-white mb-2">{plansData.pro.name}</h3>
              <p className="text-gray-400 mb-6 h-10">{plansData.pro.description}</p>
               <div className="mb-6">
                  <p className="text-5xl font-extrabold text-white">
                    ${isYearly ? plansData.pro.yearlyMonthlyPrice : plansData.pro.monthlyPrice.toFixed(2)}
                    <span className="text-xl font-semibold text-gray-400">/mo</span>
                  </p>
                  <p className="text-sm text-gray-500 h-4">
                    {isYearly ? `Billed as $${plansData.pro.yearlyTotal.toFixed(2)} per year` : 'Save with yearly billing!'}
                  </p>
              </div>
              <a href="/checkout?plan=pro" className="w-full bg-[#36363d] text-center text-white font-semibold py-3 rounded-full mb-8 hover:bg-gray-600 transition-colors">Subscribe</a>
              <ul className="space-y-3 text-gray-300 flex-grow text-sm">
                {plansData.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-center"><svg className="w-4 h-4 text-green-500 mr-3 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>{feature.text}</li>
                ))}
              </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0E0E10] p-6 text-center text-gray-400">Loading...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
