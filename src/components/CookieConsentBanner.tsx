"use client";

import React from "react";
import { useCookieConsent } from "../context/CookieConsentContext";
import BodyText from "./typography/BodyText";
import PrimaryButton from "./buttons/PrimaryButton";
import SecondaryButton from "./buttons/SecondaryButton";

const CookieConsentBanner: React.FC = () => {
  const {
    showBanner,
    showPreferences,
    setShowPreferences,
    acceptAll,
    rejectAll,
    updateConsent,
    consent,
  } = useCookieConsent();

  if (!showBanner && !showPreferences) return null;

  const handleSavePreferences = () => {
    if (!consent) return;
    updateConsent(consent);
  };

  return (
    <>
      {/* Main Banner */}
      {showBanner && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" />
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900/75 backdrop-blur-sm shadow-lg border-t border-gray-700 p-6 z-50">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-semibold text-white">
                  Cookie Settings
                </h3>
                <BodyText size="sm" className="max-w-2xl">
                  We use cookies to enhance your browsing experience, serve
                  personalized content, and analyze our traffic. By clicking
                  &quot;Accept All&quot;, you consent to our use of cookies.
                </BodyText>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <SecondaryButton onClick={rejectAll}>
                  Reject All
                </SecondaryButton>
                <SecondaryButton onClick={() => setShowPreferences(true)}>
                  Manage Preferences
                </SecondaryButton>
                <PrimaryButton onClick={acceptAll}>Accept All</PrimaryButton>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-8 text-white">
                Cookie Preferences
              </h2>

              {/* Essential Cookies */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">
                      Essential Cookies
                    </h3>
                    <BodyText size="sm">
                      Required for the website to function properly. These
                      cannot be disabled.
                    </BodyText>
                  </div>
                  <div className="flex items-center ml-6">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="h-5 w-5 text-yellow-500 rounded border-gray-600 bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">
                      Analytics Cookies
                    </h3>
                    <BodyText size="sm">
                      Help us understand how visitors interact with our website.
                    </BodyText>
                  </div>
                  <div className="flex items-center ml-6">
                    <input
                      type="checkbox"
                      checked={consent?.analytics ?? false}
                      onChange={(e) =>
                        updateConsent({ analytics: e.target.checked })
                      }
                      className="h-5 w-5 text-yellow-500 rounded border-gray-600 bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">
                      Marketing Cookies
                    </h3>
                    <BodyText size="sm">
                      Used to track visitors across websites to display relevant
                      advertisements.
                    </BodyText>
                  </div>
                  <div className="flex items-center ml-6">
                    <input
                      type="checkbox"
                      checked={consent?.marketing ?? false}
                      onChange={(e) =>
                        updateConsent({ marketing: e.target.checked })
                      }
                      className="h-5 w-5 text-yellow-500 rounded border-gray-600 bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <SecondaryButton onClick={() => setShowPreferences(false)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton onClick={handleSavePreferences}>
                  Save Preferences
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsentBanner;
