"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CookieConsent,
  defaultConsent,
  getCookieConsent,
  setCookieConsent,
} from "@/lib/cookies";

interface CookieConsentContextType {
  consent: CookieConsent | null;
  showBanner: boolean;
  showPreferences: boolean;
  setShowPreferences: (show: boolean) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  updateConsent: (consent: Partial<CookieConsent>) => void;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
};

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const storedConsent = getCookieConsent();
    setConsent(storedConsent);
    setShowBanner(!storedConsent);
  }, []);

  const acceptAll = () => {
    const newConsent = {
      ...defaultConsent,
      analytics: true,
      marketing: true,
    };
    setCookieConsent(newConsent);
    setConsent(newConsent);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const rejectAll = () => {
    const newConsent = {
      ...defaultConsent,
      analytics: false,
      marketing: false,
    };
    setCookieConsent(newConsent);
    setConsent(newConsent);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const updateConsent = (newConsent: Partial<CookieConsent>) => {
    const updatedConsent = {
      ...consent,
      ...newConsent,
      timestamp: Date.now(),
    } as CookieConsent;
    setCookieConsent(updatedConsent);
    setConsent(updatedConsent);
    setShowBanner(false);
    setShowPreferences(false);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        showBanner,
        showPreferences,
        setShowPreferences,
        acceptAll,
        rejectAll,
        updateConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};
