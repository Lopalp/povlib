// src/app/checkout/page.jsx
import React from 'react';
import CheckoutClient from '../../components/POVlib/CheckoutClient';

export default function CheckoutPage({ searchParams }) {
  // searchParams kommt von Next.js automatisch – es ist ein Objekt mit allen Query-Parametern
  // z. B. { plan: "basic" } wenn die URL /checkout?plan=basic aufgerufen wurde
  const planKey = searchParams.plan || 'free';

  return (
    // Wir übergeben planKey als Prop in unsere Client-Component
    <CheckoutClient initialPlanKey={planKey} />
  );
}
