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
    let cost = 1;
    const flags = [
      rounds.trim() !== '',
      firstHalf,
      secondHalf,
      overtime,
      highlightClip,
      failClip,
      resolution !== '1080p',
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
    flags.forEach((f) => f && cost++);
    if (generateQuizzes) {
      utilQuizzes && cost++;
      economyQuizzes && cost++;
    }
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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-4xl w-full overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.15)]">
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

        {/* Body */}
        <div className="px-8 py-6 text-gray-200 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Kosteninfo */}
          <p className="text-gray-400">
            Jede Ausführung kostet{' '}
            <span className="font-bold text-yellow-400">1 Basis-Credit</span> +
            Extras je nach Auswahl. Aktuelle Gesamtkosten:{' '}
            <span className="font-bold text-yellow-400">
              {estimatedCost} Credits
            </span>
            .
          </p>

          {/* 1. Eingabe: Match-Link oder Datei */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">
              Match-Daten einreichen
            </h3>
            <div className="flex gap-4">
              <form onSubmit={onMatchLinkSubmit} className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={matchLink}
                  onChange={(e) => onMatchLinkChange(e.target.value)}
                  placeholder="Match-Link einfügen"
                  className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!matchLink}
                  className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg disabled:opacity-50"
                >
                  Link ausführen
                </button>
              </form>
              <span className="self-center text-gray-500">ODER</span>
              <form onSubmit={onFileSubmit} className="flex-1 flex items-center gap-2">
                <label className="flex-1 px-4 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition text-center">
                  {selectedFile ? selectedFile.name : '.dem-Datei hochladen'}
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
                  Upload ausführen
                </button>
              </form>
            </div>
            {uploadError && <p className="text-red-500">{uploadError}</p>}
            <button
              onClick={onLinkAccount}
              className="mt-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Faceit-Account verbinden
            </button>
          </section>

          {/* 2. Grundlegende Video-/Clip-Optionen */}
          <section className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300">
                Runden & Phasen
              </h3>
              <div className="space-y-2">
                <label className="block text-gray-300">
                  Bestimmte Runden (z.B. 1,2,3)
                </label>
                <input
                  type="text"
                  value={rounds}
                  onChange={(e) => setRounds(e.target.value)}
                  placeholder="Komma-getrennte Runden"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={firstHalf}
                    onChange={() => setFirstHalf(!firstHalf)}
                    className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                  />
                  <span className="ml-2">1. Halbzeit</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={secondHalf}
                    onChange={() => setSecondHalf(!secondHalf)}
                    className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                  />
                  <span className="ml-2">2. Halbzeit</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={overtime}
                    onChange={() => setOvertime(!overtime)}
                    className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                  />
                  <span className="ml-2">Verlängerung</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300">
                Clips & Auflösung
              </h3>
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={highlightClip}
                    onChange={() => setHighlightClip(!highlightClip)}
                    className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                  />
                  <span className="ml-2">Highlight-Clip</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={failClip}
                    onChange={() => setFailClip(!failClip)}
                    className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                  />
                  <span className="ml-2">Fail-Clip</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="block text-gray-300">Auflösung</label>
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
            </div>
          </section>

          {/* 3. Economy & Keystrokes */}
          <section className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300">
                Runden-Filter
              </h3>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={skipPistol}
                    onChange={() => setSkipPistol(!skipPistol)}
                    className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                  />
                  <span className="ml-2">Pistol-Runden überspringen</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={skipFullEco}
                    onChange={() => setSkipFullEco(!skipFullEco)}
                    className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                  />
                  <span className="ml-2">Full-Eco überspringen</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300">
                Keystrokes
              </h3>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showKeystrokes}
                  onChange={() => setShowKeystrokes(!showKeystrokes)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">Globale Keystrokes anzeigen</span>
              </label>
            </div>
          </section>

          {/* 4. Per-Player-Darstellung */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-300">
              Optionen pro Spieler
            </h3>
            <div className="h-48 overflow-y-auto border border-gray-700 rounded-lg p-4 grid grid-cols-2 gap-4">
              {perPlayerOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className="flex flex-col bg-gray-800 rounded-lg p-3"
                >
                  <label className="inline-flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={opt.enabled}
                      onChange={() => togglePlayerOption(idx, 'enabled')}
                      className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-700 rounded"
                    />
                    <span className="ml-2">{players[idx]}</span>
                  </label>
                  {opt.enabled && (
                    <label className="inline-flex items-center mt-auto">
                      <input
                        type="checkbox"
                        checked={opt.keystrokes}
                        onChange={() =>
                          togglePlayerOption(idx, 'keystrokes')
                        }
                        className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-700 rounded"
                      />
                      <span className="ml-2 text-sm">Keystrokes</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 5. Zusätzliche Rendering-Optionen */}
          <section className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300">
                Spezial-Effekte
              </h3>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={customDeathScreens}
                  onChange={() =>
                    setCustomDeathScreens(!customDeathScreens)
                  }
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
                <span className="ml-2">Watermark entfernen</span>
              </label>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300">
                Quizzes generieren
              </h3>
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
                <span className="ml-2">Quizzes erstellen</span>
              </label>
              {generateQuizzes && (
                <div className="ml-6 space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={utilQuizzes}
                      onChange={() => setUtilQuizzes(!utilQuizzes)}
                      className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                    />
                    <span className="ml-2">Util-Quizzes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={economyQuizzes}
                      onChange={() => setEconomyQuizzes(!economyQuizzes)}
                      className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                    />
                    <span className="ml-2">Economy-Quizzes</span>
                  </label>
                </div>
              )}
            </div>
          </section>

          {/* 6. Weitere Rendering-Optionen */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-300">
              Zusätzliche Render-Optionen
            </h3>
            <div className="flex flex-wrap gap-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={render2DView}
                  onChange={() => setRender2DView(!render2DView)}
                  className="form-checkbox h-5 w-5 text-yellow-400 bg-gray-800 rounded"
                />
                <span className="ml-2">2D-Ansicht rendern</span>
              </label>
              <label className="inline-flex items-center">
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
          </section>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center px-8 py-6 border-t border-gray-700 bg-gray-800">
          <button
            onClick={onClose}
            className="mr-4 px-5 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={() => {
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
              // z.B. props.onCreateDemo(options);
            }}
            className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Demo erstellen
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDemoModal;
