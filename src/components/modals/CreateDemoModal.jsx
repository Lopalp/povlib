// components/POVlib/CreateDemoModal.jsx
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import PlayerSelectionSection from "../sections/PlayerSelectionSection";

const CreateDemoModal = ({
  isOpen,
  onClose,
  matchLink,
  onMatchLinkChange,
  onMatchLinkSubmit,
  selectedFile,
  onFileChange,
  onFileSubmit,
  uploadError,
  onLinkAccount,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);

  // 1) Handler for "Run Link"
  const handleMatchSubmit = (e) => {
    e.preventDefault();
    if (!matchLink) return;
    // Trigger parent callback (but do NOT close the modal)
    onMatchLinkSubmit(e);
    setHasSubmitted(true);
    setIsProcessing(true);

    // Simulate a brief preprocessing delay, then show players
    setTimeout(() => {
      setIsProcessing(false);
      setShowPlayers(true);
    }, 1500);
  };

  // 2) Handler for "Run Upload"
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    // Trigger parent callback (but do NOT close the modal)
    onFileSubmit(e);
    setHasSubmitted(true);
    setIsProcessing(true);

    // Simulate a brief preprocessing delay, then show players
    setTimeout(() => {
      setIsProcessing(false);
      setShowPlayers(true);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.15)]">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Create New Demo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content Container */}
        <div className="px-8 py-6 text-gray-200 overflow-y-auto custom-scrollbar">
          {/* Step 1: Match Data Input (only shown before any submission) */}
          {!hasSubmitted && (
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-300">
                Submit Match Data
              </h3>
              <div className="flex gap-4">
                {/* Paste Link */}
                <form
                  onSubmit={handleMatchSubmit}
                  className="flex-1 flex gap-2"
                >
                  <input
                    type="text"
                    value={matchLink}
                    onChange={(e) => onMatchLinkChange(e.target.value)}
                    placeholder="Paste match link here"
                    className="flex-1 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none text-gray-200"
                  />
                  <button
                    type="submit"
                    disabled={!matchLink}
                    className="px-4 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg disabled:opacity-50"
                  >
                    Run Link
                  </button>
                </form>

                <span className="self-center text-gray-500">OR</span>

                {/* Upload .dem File */}
                <form
                  onSubmit={handleFileSubmit}
                  className="flex-1 flex items-center gap-2"
                >
                  <label className="flex-1 px-4 py-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition text-center text-gray-200">
                    {selectedFile ? selectedFile.name : "Upload .dem file"}
                    <input
                      type="file"
                      accept=".dem"
                      onChange={onFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={!selectedFile}
                    className="px-4 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg disabled:opacity-50"
                  >
                    Run Upload
                  </button>
                </form>
              </div>
              {uploadError && <p className="text-red-500">{uploadError}</p>}

              <button
                onClick={onLinkAccount}
                className="mt-2 px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-gray-200"
              >
                Link Faceit Account
              </button>
            </section>
          )}

          {/* Step 2: Loading Indicator (shown immediately after submitting link/file) */}
          {hasSubmitted && isProcessing && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-pulse text-gray-300">
                Preprocessing match data…
              </div>
              <div className="text-gray-500 mt-2">This may take a moment.</div>
            </div>
          )}

          {/* Step 3: Player Selection (appears once preprocessing is done) */}
          {showPlayers && <PlayerSelectionSection />}
        </div>

        {/* Footer (only Cancel button until players appear) */}
        {!showPlayers && (
          <div className="flex justify-end items-center px-8 py-6 border-t border-gray-700 bg-gray-800">
            <button
              onClick={onClose}
              className="px-5 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-gray-200"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDemoModal;
