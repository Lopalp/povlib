import Cookies from "js-cookie";

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export const COOKIE_CONSENT_KEY = "cookie_consent";
export const COOKIE_EXPIRY_DAYS = 365; // 1 year

export const defaultConsent: CookieConsent = {
  essential: true, // Always true as these are required
  analytics: false,
  marketing: false,
  timestamp: Date.now(),
};

export const getCookieConsent = (): CookieConsent | null => {
  const consent = Cookies.get(COOKIE_CONSENT_KEY);
  if (!consent) return null;

  try {
    return JSON.parse(consent) as CookieConsent;
  } catch {
    return null;
  }
};

export const setCookieConsent = (consent: CookieConsent): void => {
  Cookies.set(COOKIE_CONSENT_KEY, JSON.stringify(consent), {
    expires: COOKIE_EXPIRY_DAYS,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

export const removeCookieConsent = (): void => {
  Cookies.remove(COOKIE_CONSENT_KEY);
};

export const hasValidConsent = (): boolean => {
  const consent = getCookieConsent();
  if (!consent) return false;

  // Check if consent is older than 1 year
  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
  return consent.timestamp > oneYearAgo;
};
