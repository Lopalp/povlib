// components/POVlib/PlayerSelectionSection.jsx
'use client';

import React, { useState, useEffect } from 'react';

// Apple-style Switch (dark theme, yellow when on)
export const Switch = ({ checked, onChange, label }) => (
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

// CollapsibleSection component
export const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
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

// PlayerCard: all demo‐options moved into each player’s card
export const PlayerCard = ({
  player,
  index,
  isSelected,
  onToggleSelect,
  applyAll,
  details,
  setDetails,
  highlighted,
  applySettingsToAll,
}) => {
  // Highlight the first player (index 0) with a thicker yellow border
  const borderClass = highlighted
    ? 'border-2 border-yellow-400'
    : 'border border-gray-700';

  return (
    <div className={`flex flex-col bg-gray-800 rounded-lg p-4 ${borderClass}`}>
      {/* Card Header: avatar, name, K/D/A, Faceit lvl, and switch to select player */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
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
        <Switch checked={isSelected} onChange={onToggleSelect} label="" />
      </div>

      {/* If selected, show all demo‐options in a collapsible panel */}
      {isSelected && (
        <CollapsibleSection title="Player Settings" defaultOpen={true}>
          <div className="space-y-4">
            {/* Specific Rounds */}
            <div className="space-y-1">
              <label className="block text-gray-300">
                Specific Rounds (e.g., 1,2,3):
              </label>
              <input
                type="text"
                value={details.rounds}
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, rounds: e.target.value }))
                }
                placeholder="Comma-separated rounds"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none text-gray-200"
              />
            </div>

            {/* Halves */}
            <div className="space-y-1">
              <span className="text-gray-300">Halves:</span>
              <div className="flex gap-4">
                <Switch
                  checked={details.firstHalf}
                  onChange={() =>
                    setDetails((prev) => ({
                      ...prev,
                      firstHalf: !prev.firstHalf,
                    }))
                  }
                  label="1st Half"
                />
                <Switch
                  checked={details.secondHalf}
                  onChange={() =>
                    setDetails((prev) => ({
                      ...prev,
                      secondHalf: !prev.secondHalf,
                    }))
                  }
                  label="2nd Half"
                />
                <Switch
                  checked={details.overtime}
                  onChange={() =>
                    setDetails((prev) => ({
                      ...prev,
                      overtime: !prev.overtime,
                    }))
                  }
                  label="Overtime"
                />
              </div>
            </div>

            {/* Highlight + Fail Clips */}
            <div className="flex flex-wrap gap-6">
              <Switch
                checked={details.highlightClip}
                onChange={() =>
                  setDetails((prev) => ({
                    ...prev,
                    highlightClip: !prev.highlightClip,
                  }))
                }
                label="Highlight Clip"
              />
              <Switch
                checked={details.failClip}
                onChange={() =>
                  setDetails((prev) => ({ ...prev, failClip: !prev.failClip }))
                }
                label="Fail Clip"
              />
            </div>

            {/* Video Resolution */}
            <div className="space-y-1">
              <label className="block text-gray-300">Video Resolution:</label>
              <select
                value={details.resolution}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    resolution: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none text-gray-200"
              >
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
                <option value="1440p">1440p</option>
                <option value="4K">4K</option>
              </select>
            </div>

            {/* Economy (Skip Pistol / Skip Full Eco) */}
            <div className="flex flex-wrap gap-6">
              <Switch
                checked={details.skipPistol}
                onChange={() =>
                  setDetails((prev) => ({
                    ...prev,
                    skipPistol: !prev.skipPistol,
                  }))
                }
                label="Skip Pistol Rounds"
              />
              <Switch
                checked={details.skipFullEco}
                onChange={() =>
                  setDetails((prev) => ({
                    ...prev,
                    skipFullEco: !prev.skipFullEco,
                  }))
                }
                label="Skip Full Ecos"
              />
            </div>

            {/* Keystrokes */}
            <Switch
              checked={details.keystrokes}
              onChange={() =>
                setDetails((prev) => ({ ...prev, keystrokes: !prev.keystrokes }))
              }
              label="Show Keystrokes"
            />

            {/* Special Effects (Death Screens + Watermark) */}
            <div className="flex flex-wrap gap-6">
              <Switch
                checked={details.customDeathScreens}
                onChange={() =>
                  setDetails((prev) => ({
                    ...prev,
                    customDeathScreens: !prev.customDeathScreens,
                  }))
                }
                label="Custom Death Screens"
              />
              <Switch
                checked={details.removeWatermark}
                onChange={() =>
                  setDetails((prev) => ({
                    ...prev,
                    removeWatermark: !prev.removeWatermark,
                  }))
                }
                label="Remove Watermark"
              />
            </div>

            {/* Quizzes */}
            <div className="space-y-2">
              <Switch
                checked={details.generateQuizzes}
                onChange={() => {
                  setDetails((prev) => ({
                    ...prev,
                    generateQuizzes: !prev.generateQuizzes,
                    utilQuizzes: false,
                    economyQuizzes: false,
                  }));
                }}
                label="Create Quizzes"
              />
              {details.generateQuizzes && (
                <div className="ml-6 space-y-2">
                  <Switch
                    checked={details.utilQuizzes}
                    onChange={() =>
                      setDetails((prev) => ({
                        ...prev,
                        utilQuizzes: !prev.utilQuizzes,
                      }))
                    }
                    label="Utility Quizzes"
                  />
                  <Switch
                    checked={details.economyQuizzes}
                    onChange={() =>
                      setDetails((prev) => ({
                        ...prev,
                        economyQuizzes: !prev.economyQuizzes,
                      }))
                    }
                    label="Economy Quizzes"
                  />
                </div>
              )}
            </div>

            {/* Additional Render Options */}
            <div className="flex flex-wrap gap-6">
              <Switch
                checked={details.render2DView}
                onChange={() =>
                  setDetails((prev) => ({
                    ...prev,
                    render2DView: !prev.render2DView,
                  }))
                }
                label="Render 2D View"
              />
              <Switch
                checked={details.team1Comms}
                onChange={() =>
                  setDetails((prev) => ({
                    ...prev,
                    team1Comms: !prev.team1Comms,
                  }))
                }
                label="Team 1 Voice Comms"
              />
              <Switch
                checked={details.team2Comms}
                onChange={() =>
                  setDetails((prev) => ({
                    ...prev,
                    team2Comms: !prev.team2Comms,
                  }))
                }
                label="Team 2 Voice Comms"
              />
            </div>

            {/* “Apply this player’s settings to all selected” */}
            {applyAll && (
              <button
                onClick={() => applySettingsToAll(index)}
                className="mt-2 w-full px-3 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Apply this player’s settings to all selected
              </button>
            )}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
};

const PlayerSelectionSection = () => {
  // Dummy player data (name, KDA, Faceit level, avatar)
  const [players] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      name: `Player ${i + 1}`,
      kda: '0/0/0',
      faceitLevel: '1',
      avatarUrl: '', // You can replace with real URLs later
    }))
  );

  // Track which players are checked
  const [selectedPlayers, setSelectedPlayers] = useState(Array(10).fill(false));
  // “Apply to all selected” switch
  const [applyToAll, setApplyToAll] = useState(false);

  // Each player’s set of options
  const [playerDetails, setPlayerDetails] = useState(
    Array.from({ length: 10 }, () => ({
      rounds: '',
      firstHalf: false,
      secondHalf: false,
      overtime: false,
      highlightClip: false,
      failClip: false,
      resolution: '1080p',
      skipPistol: false,
      skipFullEco: false,
      keystrokes: false,
      customDeathScreens: false,
      removeWatermark: false,
      generateQuizzes: false,
      utilQuizzes: false,
      economyQuizzes: false,
      render2DView: false,
      team1Comms: false,
      team2Comms: false,
    }))
  );

  // Dynamically compute total cost
  const [estimatedCost, setEstimatedCost] = useState(1);
  useEffect(() => {
    let cost = 1; // base credit
    selectedPlayers.forEach((sel, idx) => {
      if (sel) {
        cost++;
        const d = playerDetails[idx];
        if (d.rounds.trim()) cost++;
        if (d.firstHalf) cost++;
        if (d.secondHalf) cost++;
        if (d.overtime) cost++;
        if (d.highlightClip) cost++;
        if (d.failClip) cost++;
        if (d.resolution !== '1080p') cost++;
        if (d.skipPistol) cost++;
        if (d.skipFullEco) cost++;
        if (d.keystrokes) cost++;
        if (d.customDeathScreens) cost++;
        if (d.removeWatermark) cost++;
        if (d.generateQuizzes) cost++;
        if (d.utilQuizzes) cost++;
        if (d.economyQuizzes) cost++;
        if (d.render2DView) cost++;
        if (d.team1Comms) cost++;
        if (d.team2Comms) cost++;
      }
    });
    setEstimatedCost(cost);
  }, [selectedPlayers, playerDetails]);

  // Toggle a single player’s checkbox
  const togglePlayerSelect = (idx) => {
    setSelectedPlayers((prev) =>
      prev.map((v, i) => (i === idx ? !v : v))
    );
  };

  // Copy one player’s settings to all other selected players
  const applySettingsToAll = (sourceIdx) => {
    if (!selectedPlayers[sourceIdx]) return;
    const source = playerDetails[sourceIdx];
    setPlayerDetails((prev) =>
      prev.map((d, i) => (selectedPlayers[i] ? { ...source } : d))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with “Apply to All” switch */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-300">Select Players</h3>
        <Switch
          checked={applyToAll}
          onChange={() => setApplyToAll((prev) => !prev)}
          label="Apply settings to all selected"
        />
      </div>

      {/* Two-column grid of PlayerCard components */}
      <div className="grid grid-cols-2 gap-6">
        {players.map((player, idx) => (
          <PlayerCard
            key={player.id}
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
            highlighted={idx === 0} // highlight top-left player
            applySettingsToAll={applySettingsToAll}
          />
        ))}
      </div>

      {/* Footer: cost + “Create Demo” button */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <div className="text-gray-400">
          Total Estimated Cost:{' '}
          <span className="font-bold text-yellow-400">{estimatedCost} credits</span>
        </div>
        <button
          onClick={() => {
            const selectedData = players
              .map((p, i) => ({
                ...p,
                selected: selectedPlayers[i],
                settings: playerDetails[i],
              }))
              .filter((p) => p.selected);
            const options = { players: selectedData };
            // Call parent handler here, e.g. props.onCreateDemo(options)
          }}
          className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          Create Demo
        </button>
      </div>
    </div>
  );
};

export default PlayerSelectionSection;
