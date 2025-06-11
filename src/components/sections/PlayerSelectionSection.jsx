// components/POVlib/PlayerSelectionSection.jsx
"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react"; // Fallback user icon
import { Switch } from "../misc/Switch";
import CollapsibleSection from "./CollapsibleSection";
import { PrimaryButton } from "../buttons";

//
// Each PlayerCard includes ALL per-player demo options:
//   • Rounds (text field) – guarded against undefined
//   • Halves (1st half / 2nd half / overtime)
//   • Clips (Highlight / Fail)
//   • Resolution
//   • Economy filters (Skip Pistol / Skip Full Eco)
//   • Keystrokes
//   • Special Effects (Custom Death Screens / Remove Watermark)
//   • Quizzes (Generate + Util / Economy sub-options)
//   • Additional Render (2D view / Team1 Comms / Team2 Comms)
//   • "Apply this player's settings to all" if "Apply to All" is ON.
//

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
  // Highlight first player with a thick yellow border
  const borderClass = highlighted
    ? "border-2 border-yellow-400"
    : "border border-gray-700";

  return (
    <div className={`flex flex-col bg-gray-800 rounded-lg p-4 ${borderClass}`}>
      {/* Header: avatar, name, KDA, Faceit level, toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {player.avatarUrl ? (
            <img
              src={player.avatarUrl}
              alt={`${player.name} avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
          )}

          <div>
            <div className="text-gray-200 font-semibold">{player.name}</div>
            <div className="text-gray-400 text-sm">
              K/D/A: {player.kda} / Faceit LvL: {player.faceitLevel}
            </div>
          </div>
        </div>

        {/* Apple-style switch to include/exclude this player */}
        <Switch checked={isSelected} onChange={onToggleSelect} label="" />
      </div>

      {/* If selected, show a collapsible "Player Settings" section */}
      {isSelected && (
        <CollapsibleSection title="Player Settings" defaultOpen={true}>
          <div className="space-y-4">
            {/* 1) Specific Rounds (text input) */}
            <div className="space-y-1">
              <label className="block text-gray-300">
                Specific Rounds (e.g., 1,2,3):
              </label>
              <input
                type="text"
                // Guard against undefined before calling trim()
                value={typeof details.rounds === "string" ? details.rounds : ""}
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, rounds: e.target.value }))
                }
                placeholder="Comma-separated rounds"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none text-gray-200"
              />
            </div>

            {/* 2) Halves */}
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

            {/* 3) Clips */}
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
                  setDetails((prev) => ({
                    ...prev,
                    failClip: !prev.failClip,
                  }))
                }
                label="Fail Clip"
              />
            </div>

            {/* 4) Resolution */}
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

            {/* 5) Economy Filters */}
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

            {/* 6) Keystrokes */}
            <Switch
              checked={details.keystrokes}
              onChange={() =>
                setDetails((prev) => ({
                  ...prev,
                  keystrokes: !prev.keystrokes,
                }))
              }
              label="Show Keystrokes"
            />

            {/* 7) Special Effects */}
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

            {/* 8) Quizzes */}
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

            {/* 9) Additional Render Options */}
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

            {/* 10) "Apply to All" button (if that toggle is ON) */}
            {applyAll && (
              <button
                onClick={() => applySettingsToAll(index)}
                className="mt-2 w-full px-3 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Apply this player's settings to all selected
              </button>
            )}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
};

const PlayerSelectionSection = () => {
  // 10 sample players; in real usage you'd fetch these from the parsed match/demo
  const [players] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      name: `Player ${i + 1}`,
      kda: "0/0/0",
      faceitLevel: "1",
      avatarUrl: "", // empty == fallback icon
    }))
  );

  const [selectedPlayers, setSelectedPlayers] = useState(Array(10).fill(false));
  const [applyToAll, setApplyToAll] = useState(false);

  // Each player's settings object—every field has a safe default.
  const [playerDetails, setPlayerDetails] = useState(
    Array.from({ length: 10 }, () => ({
      rounds: "",
      firstHalf: false,
      secondHalf: false,
      overtime: false,
      highlightClip: false,
      failClip: false,
      resolution: "1080p",
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

  // Dynamically compute "estimated cost" whenever any toggle or selection changes.
  const [estimatedCost, setEstimatedCost] = useState(1);
  useEffect(() => {
    let cost = 1; // base cost
    selectedPlayers.forEach((isSel, idx) => {
      if (!isSel) return;
      cost++; // Each selected player adds 1
      const d = playerDetails[idx];

      // Only call trim() if it's a string
      if (typeof d.rounds === "string" && d.rounds.trim() !== "") cost++;
      if (d.firstHalf) cost++;
      if (d.secondHalf) cost++;
      if (d.overtime) cost++;
      if (d.highlightClip) cost++;
      if (d.failClip) cost++;
      if (d.resolution !== "1080p") cost++;
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
    });
    setEstimatedCost(cost);
  }, [selectedPlayers, playerDetails]);

  // Toggle one player's inclusion
  const togglePlayerSelect = (idx) => {
    setSelectedPlayers((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  // Copy one player's settings to all other checked players
  const applySettingsToAll = (sourceIdx) => {
    if (!selectedPlayers[sourceIdx]) return;
    const source = playerDetails[sourceIdx];
    setPlayerDetails((prev) =>
      prev.map((d, i) => (selectedPlayers[i] ? { ...source } : d))
    );
  };

  return (
    <div className="space-y-6">
      {/* 2 columns of PlayerCards */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-300">Select Players</h3>
        <Switch
          checked={applyToAll}
          onChange={() => setApplyToAll((prev) => !prev)}
          label="Apply settings to all selected"
        />
      </div>

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
            setDetails={(newD) =>
              setPlayerDetails((prev) =>
                prev.map((d, i) => (i === idx ? newD : d))
              )
            }
            highlighted={idx === 0} // first player is "highlighted"
            applySettingsToAll={applySettingsToAll}
          />
        ))}
      </div>

      {/* Footer: show total cost + "Create Demo" button */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <div className="text-gray-400">
          Total Estimated Cost:{" "}
          <span className="font-bold text-yellow-400">
            {estimatedCost} credits
          </span>
        </div>
        <PrimaryButton
          onClick={() => {
            // Collect only selected players + their settings
            const selectedData = players
              .map((p, i) => ({
                ...p,
                selected: selectedPlayers[i],
                settings: playerDetails[i],
              }))
              .filter((x) => x.selected);
            // Pass { players: selectedData } up to parent
            // e.g. props.onCreateDemo({ players: selectedData });
          }}
        >
          Create Demo
        </PrimaryButton>
      </div>
    </div>
  );
};

export default PlayerSelectionSection;
