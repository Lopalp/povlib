// components/POVlib/CreateDemoModal.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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
  players = Array.from({ length: 10 }, (_, i) => `Player ${i + 1}`),
}) => {
  const [rounds, setRounds] = useState('');
  const [firstHalf, setFirstHalf] = useState(false);
  const [secondHalf, setSecondHalf] = useState(false);
  const [overtime, setOvertime] = useState(false);
  const [highlightClip, setHighlightClip] = useState(false);
  const [failClip, setFailClip] = useState(false);
  const [resolution, setResolution] = useState('1080p');
  const [skipPistol, setSkipPistol] = useState(false);
  const [skipFullEco, setSkipFullEco] = useState(false);
  const [showKeystrokes, setShowKeystrokes] = useState(false);
  const [perPlayerOptions, setPerPlayerOptions] = useState(
    players.map(() => ({ enabled: false, keystrokes: false }))
  );
  const [customDeathScreens, setCustomDeathScreens] = useState(false);
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [generateQuizzes, setGenerateQuizzes] = useState(false);
  const [utilQuizzes, setUtilQuizzes] = useState(false);
  const [economyQuizzes, setEconomyQuizzes] = useState(false);
  const [render2DView, setRender2DView] = useState(false);
  const [team1Comms, setTeam1Comms] = useState(false);
  const [team2Comms, setTeam2Comms] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(1);

  useEffect(() => {
    // Base cost is 1 credit
    let cost = 1;
    // Each main-feature toggle adds 1
    const featureToggles = [
      rounds.trim() !== '',
      firstHalf,
      secondHalf,
      overtime,
      highlightClip,
      failClip,
      resolution !== '1080p', // assume default “1080p” is free
      skipPistol,
      skipFullEco,
      showKeystrokes,
      customDeathScreens,
      removeWatermark,
      generateQuizzes,
      render2DView,
      team1Comms,
      team2Comms,
    ];
    featureToggles.forEach((f) => f && cost++);
    // Quizzes sub-options
    if (generateQuizzes) {
      utilQuizzes && cost++;
      economyQuizzes && cost++;
    }
    // Per-player options: each enabled player adds cost, and if keystrokes for that player adds cost
    perPlayerOptions.forEach((opt) => {
      if (opt.enabled) {
        cost++;
        if (opt.keystrokes) cost++;
      }
    });
    setEstimatedCost(cost);
  }, [
    rounds,
    firstHalf,
    secondHalf,
    overtime,
    highlightClip,
    failClip,
    resolution,
    skipPistol,
    skipFullEco,
    showKeystrokes,
    perPlayerOptions,
    customDeathScreens,
    removeWatermark,
    generateQuizzes,
    utilQuizzes,
    economyQuizzes,
    render2DView,
    team1Comms,
    team2Comms,
  ]);

  const togglePlayerOption = (index, field) => {
    setPerPlayerOptions((prev) =>
      prev.map((opt, i) =>
        i === index ? { ...opt, [field]: !opt[field] } : opt
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-2xl w-full overflow-y-auto shadow-[0_0_30px_rgba(250,204,21,0.15)]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Create New Demo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-gray-200">
          <p>
            Each run consumes{' '}
            <span className="font-bold text-yellow-400">1 credit</span> +
            extra based on selected options. Current cost:{' '}
            <span className="font-bold text-yellow-400">
              {estimatedCost} credits
            </span>
            .
          </p>

          {/* Match Link Form */}
          <form onSubmit={onMatchLinkSubmit} className="flex gap-2">
            <input
              type="text"
              value={matchLink}
              onChange={(e) => onMatchLinkChange(e.target.value)}
              placeholder="Paste match link here"
              className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
            />
            <button
              type="submit"
              disabled={!matchLink}
              className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg disabled:opacity-50"
            >
              Run Link
            </button>
          </form>

          {/* or Upload .dem */}
          <div className="flex items-center justify-center text-gray-400">
            <span>— oder —</span>
          </div>
          <form onSubmit={onFileSubmit} className="flex items-center gap-2">
            <label className="flex-1 px-4 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition text-center">
              {selectedFile ? selectedFile.name : 'Upload .dem file'}
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
              className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg disabled:opacity-50"
            >
              Run Upload
            </button>
          </form>
          {uploadError && <p className="text-red-500">{uploadError}</p>}

          {/* Feature Options */}
          <div className="border-t border-gray-700 pt-6 space-y-4">
            {/* Round Selection */}
            <div className="space-y-1">
              <label className="block text-gray-300">
                Specific Rounds (e.g., 1,2,3):
              </label>
              <input
                type="text"
                value={rounds}
                onChange={(e) => setRounds(e.target.value)}
                placeholder="Comma-separated round numbers"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
              />
            </div>

            {/* Halves / Overtime */}
            <div>
              <span className="block text-gray-300 mb-1">
                Select Halves / Overtime:
              </span>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={firstHalf}
                  onChange={() => setFirstHalf(!firstHalf)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">First Half</span>
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={secondHalf}
                  onChange={() => setSecondHalf(!secondHalf)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Second Half</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={overtime}
                  onChange={() => setOvertime(!overtime)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Overtime</span>
              </label>
            </div>

            {/* Highlight / Fail Clips */}
            <div>
              <label className="inline-flex items-center mr-6">
                <input
                  type="checkbox"
                  checked={highlightClip}
                  onChange={() => setHighlightClip(!highlightClip)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Generate Highlight Clip</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={failClip}
                  onChange={() => setFailClip(!failClip)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Generate Fail Clip</span>
              </label>
            </div>

            {/* Video Resolution */}
            <div className="space-y-1">
              <label className="block text-gray-300">Video Resolution:</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
              >
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
                <option value="1440p">1440p</option>
                <option value="4K">4K</option>
              </select>
            </div>

            {/* Skip Pistols / Full Ecos */}
            <div>
              <label className="inline-flex items-center mr-6">
                <input
                  type="checkbox"
                  checked={skipPistol}
                  onChange={() => setSkipPistol(!skipPistol)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Skip Pistol Rounds</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={skipFullEco}
                  onChange={() => setSkipFullEco(!skipFullEco)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Skip Full Ecos</span>
              </label>
            </div>

            {/* Global Keystrokes */}
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showKeystrokes}
                  onChange={() => setShowKeystrokes(!showKeystrokes)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Show Keystrokes (Global)</span>
              </label>
            </div>

            {/* Per-Player Options */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                Per-Player Options:
              </h3>
              {perPlayerOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <label className="inline-flex items-center mr-6">
                    <input
                      type="checkbox"
                      checked={opt.enabled}
                      onChange={() => togglePlayerOption(idx, 'enabled')}
                      className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                    />
                    <span className="ml-2">{players[idx]}</span>
                  </label>
                  {opt.enabled && (
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={opt.keystrokes}
                        onChange={() => togglePlayerOption(idx, 'keystrokes')}
                        className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                      />
                      <span className="ml-2">Show Keystrokes</span>
                    </label>
                  )}
                </div>
              ))}
            </div>

            {/* Custom Death Screens & Watermark */}
            <div>
              <label className="inline-flex items-center mr-6">
                <input
                  type="checkbox"
                  checked={customDeathScreens}
                  onChange={() => setCustomDeathScreens(!customDeathScreens)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Custom Death Screens</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={removeWatermark}
                  onChange={() => setRemoveWatermark(!removeWatermark)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Remove Watermark</span>
              </label>
            </div>

            {/* Generate Quizzes */}
            <div className="space-y-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={generateQuizzes}
                  onChange={() => {
                    setGenerateQuizzes(!generateQuizzes);
                    if (generateQuizzes) {
                      setUtilQuizzes(false);
                      setEconomyQuizzes(false);
                    }
                  }}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Generate Quizzes</span>
              </label>
              {generateQuizzes && (
                <div className="ml-6 space-y-1">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={utilQuizzes}
                      onChange={() => setUtilQuizzes(!utilQuizzes)}
                      className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                    />
                    <span className="ml-2">Util Quizzes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={economyQuizzes}
                      onChange={() => setEconomyQuizzes(!economyQuizzes)}
                      className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                    />
                    <span className="ml-2">Economy Quizzes</span>
                  </label>
                </div>
              )}
            </div>

            {/* 2D View and Voice Comms */}
            <div>
              <label className="inline-flex items-center mr-6">
                <input
                  type="checkbox"
                  checked={render2DView}
                  onChange={() => setRender2DView(!render2DView)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Render 2D View</span>
              </label>
              <label className="inline-flex items-center mr-6">
                <input
                  type="checkbox"
                  checked={team1Comms}
                  onChange={() => setTeam1Comms(!team1Comms)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Team 1 Voice Comms</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={team2Comms}
                  onChange={() => setTeam2Comms(!team2Comms)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Team 2 Voice Comms</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center px-6 py-4 border-t border-gray-700 bg-gray-800 rounded-b-xl">
          <button
            onClick={onClose}
            className="mr-4 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          {/* Final “Create” button could trigger a handler passed via props */}
          <button
            onClick={() => {
              // Collect all options and call a parent handler here, if needed
              const options = {
                rounds,
                halves: { firstHalf, secondHalf, overtime },
                highlightClip,
                failClip,
                resolution,
                skipPistol,
                skipFullEco,
                showKeystrokes,
                perPlayerOptions,
                customDeathScreens,
                removeWatermark,
                quizzes: { generateQuizzes, utilQuizzes, economyQuizzes },
                render2DView,
                team1Comms,
                team2Comms,
              };
              // Example: props.onCreateDemo(options);
            }}
            className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Create Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDemoModal;
