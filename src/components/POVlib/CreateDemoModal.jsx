// components/POVlib/CreateDemoModal.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Switch component (Apple-style)
const Switch = ({ checked, onChange, label }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`block w-10 h-6 rounded-full transition-colors ${
          checked ? 'bg-yellow-400' : 'bg-gray-700'
        }`}
      />
      <div
        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </div>
    {label && <span className="ml-3 select-none text-gray-200">{label}</span>}
  </label>
);

// Collapsible section component
const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-700">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-4 py-3 text-left bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        <span className="text-lg font-semibold text-gray-200">{title}</span>
        <span className="text-gray-400">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="px-6 py-4">{children}</div>}
    </div>
  );
};

// Player card component
const PlayerCard = ({
  player,
  index,
  isSelected,
  onToggleSelect,
  onToggleApplyAll,
  applyAll,
  details,
  setDetails,
  highlighted,
}) => {
  const bgClass = highlighted
    ? 'border-2 border-yellow-400'
    : 'border border-gray-700';
  return (
    <div
      className={`flex flex-col bg-gray-800 rounded-lg p-4 ${bgClass}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Placeholder for profile image */}
          <img
            src={player.avatarUrl || '/placeholder-avatar.png'}
            alt={`${player.name} avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="text-gray-200 font-semibold">{player.name}</div>
            <div className="text-gray-400 text-sm">
              K/D/A: {player.kda} / Faceit LvL: {player.faceitLevel}
            </div>
          </div>
        </div>
        <Switch
          checked={isSelected}
          onChange={onToggleSelect}
          label=""
        />
      </div>

      <CollapsibleSection title="Player Details" defaultOpen={false}>
        <div className="space-y-4">
          <Switch
            checked={details.keystrokes}
            onChange={() =>
              setDetails((prev) => ({ ...prev, keystrokes: !prev.keystrokes }))
            }
            label="Show Keystrokes"
          />
          <div className="space-y-2">
            <span className="text-gray-300">Halves:</span>
            <div className="flex gap-4">
              <Switch
                checked={details.firstHalf}
                onChange={() =>
                  setDetails((prev) => ({ ...prev, firstHalf: !prev.firstHalf }))
                }
                label="1st Half"
              />
              <Switch
                checked={details.secondHalf}
                onChange={() =>
                  setDetails((prev) => ({ ...prev, secondHalf: !prev.secondHalf }))
                }
                label="2nd Half"
              />
              <Switch
                checked={details.overtime}
                onChange={() =>
                  setDetails((prev) => ({ ...prev, overtime: !prev.overtime }))
                }
                label="Overtime"
              />
            </div>
          </div>
          <Switch
            checked={details.highlightClip}
            onChange={() =>
              setDetails((prev) => ({ ...prev, highlightClip: !prev.highlightClip }))
            }
            label="Generate Highlight Clip"
          />
          <Switch
            checked={details.failClip}
            onChange={() =>
              setDetails((prev) => ({ ...prev, failClip: !prev.failClip }))
            }
            label="Generate Fail Clip"
          />
        </div>
      </CollapsibleSection>
    </div>
  );
};

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
  // Global states
  const [players, setPlayers] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      name: `Player ${i + 1}`,
      kda: '0/0/0',
      faceitLevel: '1',
      avatarUrl: '', // can be replaced with real URLs
    }))
  );
  const [selectedPlayers, setSelectedPlayers] = useState(
    Array(10).fill(false)
  );
  const [applyToAll, setApplyToAll] = useState(false);

  // Per-player details state array
  const [playerDetails, setPlayerDetails] = useState(
    Array.from({ length: 10 }, () => ({
      keystrokes: false,
      firstHalf: false,
      secondHalf: false,
      overtime: false,
      highlightClip: false,
      failClip: false,
    }))
  );

  // Global options (collapsible sections below players)
  const [rounds, setRounds] = useState('');
  const [resolution, setResolution] = useState('1080p');
  const [skipPistol, setSkipPistol] = useState(false);
  const [skipFullEco, setSkipFullEco] = useState(false);
  const [globalKeystrokes, setGlobalKeystrokes] = useState(false);
  const [customDeathScreens, setCustomDeathScreens] = useState(false);
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [generateQuizzes, setGenerateQuizzes] = useState(false);
  const [utilQuizzes, setUtilQuizzes] = useState(false);
  const [economyQuizzes, setEconomyQuizzes] = useState(false);
  const [render2DView, setRender2DView] = useState(false);
  const [team1Comms, setTeam1Comms] = useState(false);
  const [team2Comms, setTeam2Comms] = useState(false);

  // Cost calculation
  const [estimatedCost, setEstimatedCost] = useState(1);
  useEffect(() => {
    let cost = 1;
    const flags = [
      rounds.trim() !== '',
      resolution !== '1080p',
      skipPistol,
      skipFullEco,
      globalKeystrokes,
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
    selectedPlayers.forEach((sel, idx) => {
      if (sel) {
        cost++;
        const details = playerDetails[idx];
        if (details.keystrokes) cost++;
        if (details.firstHalf) cost++;
        if (details.secondHalf) cost++;
        if (details.overtime) cost++;
        if (details.highlightClip) cost++;
        if (details.failClip) cost++;
      }
    });
    setEstimatedCost(cost);
  }, [
    rounds,
    resolution,
    skipPistol,
    skipFullEco,
    globalKeystrokes,
    customDeathScreens,
    removeWatermark,
    generateQuizzes,
    utilQuizzes,
    economyQuizzes,
    render2DView,
    team1Comms,
    team2Comms,
    selectedPlayers,
    playerDetails,
  ]);

  // Toggle selection of a single player
  const togglePlayerSelect = (idx) => {
    setSelectedPlayers((prev) =>
      prev.map((v, i) => (i === idx ? !v : v))
    );
  };

  // Apply one player's settings to all selected players
  const applySettingsToAll = (sourceIdx) => {
    if (!selectedPlayers[sourceIdx]) return;
    const sourceDetails = playerDetails[sourceIdx];
    setPlayerDetails((prev) =>
      prev.map((details, i) => {
        if (selectedPlayers[i] && i !== sourceIdx) {
          return { ...sourceDetails };
        }
        return details;
      })
    );
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

        {/* Content */}
        <div className="px-8 py-6 text-gray-200 overflow-y-auto custom-scrollbar space-y-8">
          {/* Cost info */}
          <p className="text-gray-400">
            Each run costs{' '}
            <span className="font-bold text-yellow-400">1 base credit</span> plus extras. Current total:{' '}
            <span className="font-bold text-yellow-400">
              {estimatedCost} credits
            </span>
            .
          </p>

          {/* 1. Submit Match Data */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-300">
              Submit Match Data
            </h3>
            <div className="flex gap-4">
              <form onSubmit={onMatchLinkSubmit} className="flex-1 flex gap-2">
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
              <form onSubmit={onFileSubmit} className="flex-1 flex items-center gap-2">
                <label className="flex-1 px-4 py-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition text-center text-gray-200">
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

          {/* 2. Player Selection */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-300">
                Select Players
              </h3>
              <Switch
                checked={applyToAll}
                onChange={() => setApplyToAll((prev) => !prev)}
                label="Apply one player's settings to all selected"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              {players.map((player, idx) => (
                <div key={player.id}>
                  <PlayerCard
                    player={player}
                    index={idx}
                    isSelected={selectedPlayers[idx]}
                    onToggleSelect={() => togglePlayerSelect(idx)}
                    applyAll={applyToAll}
                    details={playerDetails[idx]}
                    setDetails={(newDetails) =>
                      setPlayerDetails((prev) =>
                        prev.map((d, i) => (i === idx ? newDetails : d))
                      )
                    }
                    highlighted={idx === 0}
                  />
                  {applyToAll && selectedPlayers[idx] && (
                    <button
                      onClick={() => applySettingsToAll(idx)}
                      className="mt-2 w-full px-3 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Apply this player's settings to all
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 3. Global Options: collapsible from here onward */}
          <CollapsibleSection title="Rounds & Phases" defaultOpen={false}>
            <div className="space-y-4">
              <label className="block text-gray-300">Specific Rounds (e.g., 1,2,3):</label>
              <input
                type="text"
                value={rounds}
                onChange={(e) => setRounds(e.target.value)}
                placeholder="Comma-separated rounds"
                className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none text-gray-200"
              />
              <div className="flex flex-wrap gap-6">
                <Switch
                  checked={playerDetails.some((d, i) => selectedPlayers[i] && d.firstHalf)}
                  onChange={() => {
                    const newVal = !playerDetails.some((d, i) => selectedPlayers[i] && d.firstHalf);
                    setPlayerDetails((prev) =>
                      prev.map((d, i) =>
                        selectedPlayers[i]
                          ? { ...d, firstHalf: newVal }
                          : d
                      )
                    );
                  }}
                  label="1st Half for Selected"
                />
                <Switch
                  checked={playerDetails.some((d, i) => selectedPlayers[i] && d.secondHalf)}
                  onChange={() => {
                    const newVal = !playerDetails.some((d, i) => selectedPlayers[i] && d.secondHalf);
                    setPlayerDetails((prev) =>
                      prev.map((d, i) =>
                        selectedPlayers[i]
                          ? { ...d, secondHalf: newVal }
                          : d
                      )
                    );
                  }}
                  label="2nd Half for Selected"
                />
                <Switch
                  checked={playerDetails.some((d, i) => selectedPlayers[i] && d.overtime)}
                  onChange={() => {
                    const newVal = !playerDetails.some((d, i) => selectedPlayers[i] && d.overtime);
                    setPlayerDetails((prev) =>
                      prev.map((d, i) =>
                        selectedPlayers[i]
                          ? { ...d, overtime: newVal }
                          : d
                      )
                    );
                  }}
                  label="Overtime for Selected"
                />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Clips & Resolution" defaultOpen={false}>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-6">
                <Switch
                  checked={playerDetails.some((d, i) => selectedPlayers[i] && d.highlightClip)}
                  onChange={() => {
                    const newVal = !playerDetails.some((d, i) => selectedPlayers[i] && d.highlightClip);
                    setPlayerDetails((prev) =>
                      prev.map((d, i) =>
                        selectedPlayers[i]
                          ? { ...d, highlightClip: newVal }
                          : d
                      )
                    );
                  }}
                  label="Generate Highlight Clip"
                />
                <Switch
                  checked={playerDetails.some((d, i) => selectedPlayers[i] && d.failClip)}
                  onChange={() => {
                    const newVal = !playerDetails.some((d, i) => selectedPlayers[i] && d.failClip);
                    setPlayerDetails((prev) =>
                      prev.map((d, i) =>
                        selectedPlayers[i]
                          ? { ...d, failClip: newVal }
                          : d
                      )
                    );
                  }}
                  label="Generate Fail Clip"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-300">Video Resolution:</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none text-gray-200"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="1440p">1440p</option>
                  <option value="4K">4K</option>
                </select>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Economy & Keystrokes" defaultOpen={false}>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-6">
                <Switch
                  checked={skipPistol}
                  onChange={() => setSkipPistol((prev) => !prev)}
                  label="Skip Pistol Rounds"
                />
                <Switch
                  checked={skipFullEco}
                  onChange={() => setSkipFullEco((prev) => !prev)}
                  label="Skip Full Ecos"
                />
              </div>
              <Switch
                checked={globalKeystrokes}
                onChange={() => setGlobalKeystrokes((prev) => !prev)}
                label="Show Keystrokes (Global)"
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Special Effects" defaultOpen={false}>
            <div className="space-y-4">
              <Switch
                checked={customDeathScreens}
                onChange={() => setCustomDeathScreens((prev) => !prev)}
                label="Custom Death Screens"
              />
              <Switch
                checked={removeWatermark}
                onChange={() => setRemoveWatermark((prev) => !prev)}
                label="Remove Watermark"
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Generate Quizzes" defaultOpen={false}>
            <div className="space-y-4">
              <Switch
                checked={generateQuizzes}
                onChange={() => {
                  setGenerateQuizzes((prev) => !prev);
                  if (generateQuizzes) {
                    setUtilQuizzes(false);
                    setEconomyQuizzes(false);
                  }
                }}
                label="Create Quizzes"
              />
              {generateQuizzes && (
                <div className="ml-6 space-y-2">
                  <Switch
                    checked={utilQuizzes}
                    onChange={() => setUtilQuizzes((prev) => !prev)}
                    label="Utility Quizzes"
                  />
                  <Switch
                    checked={economyQuizzes}
                    onChange={() => setEconomyQuizzes((prev) => !prev)}
                    label="Economy Quizzes"
                  />
                </div>
              )}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Additional Render Options" defaultOpen={false}>
            <div className="flex flex-wrap gap-6">
              <Switch
                checked={render2DView}
                onChange={() => setRender2DView((prev) => !prev)}
                label="Render 2D View"
              />
              <Switch
                checked={team1Comms}
                onChange={() => setTeam1Comms((prev) => !prev)}
                label="Team 1 Voice Comms"
              />
              <Switch
                checked={team2Comms}
                onChange={() => setTeam2Comms((prev) => !prev)}
                label="Team 2 Voice Comms"
              />
            </div>
          </CollapsibleSection>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center px-8 py-6 border-t border-gray-700 bg-gray-800">
          <button
            onClick={onClose}
            className="mr-4 px-5 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Collect all settings and pass to parent handler
              const options = {
                players: players
                  .map((p, idx) => ({
                    id: p.id,
                    selected: selectedPlayers[idx],
                    details: playerDetails[idx],
                  }))
                  .filter((p) => p.selected),
                rounds,
                resolution,
                skipPistol,
                skipFullEco,
                globalKeystrokes,
                customDeathScreens,
                removeWatermark,
                quizzes: { generateQuizzes, utilQuizzes, economyQuizzes },
                render2DView,
                team1Comms,
                team2Comms,
              };
              // e.g. props.onCreateDemo(options);
            }}
            className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Create Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDemoModal;
