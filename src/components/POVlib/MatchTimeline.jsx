// components/POVlib/MatchTimeline.jsx
'use client';

import React, { useState, useMemo } from 'react';
import { Zap, Skull, Crosshair } from 'lucide-react';

/**
 * Props:
 * - matchData: {
 *     rounds: [
 *       {
 *         roundNumber: number,
 *         events: [
 *           { type: 'kill' | 'death' | 'utility', time: number (seconds), player: string }
 *         ]
 *       }, ...
 *     ]
 *   }
 *
 * Example matchData (for illustration):
 * const matchData = {
 *   rounds: [
 *     {
 *       roundNumber: 1,
 *       events: [
 *         { type: 'utility', time: 10, player: 'PlayerA' },
 *         { type: 'kill', time: 45, player: 'PlayerB' },
 *         { type: 'death', time: 46, player: 'PlayerA' },
 *       ]
 *     },
 *     {
 *       roundNumber: 2,
 *       events: [
 *         { type: 'utility', time: 5, player: 'PlayerC' },
 *         { type: 'kill', time: 30, player: 'PlayerA' },
 *         { type: 'death', time: 30, player: 'PlayerB' },
 *       ]
 *     },
 *     // ...
 *   ]
 * };
 */

const ICON_SIZE = 18;

export default function MatchTimeline({ matchData }) {
  // Derive list of unique players
  const players = useMemo(() => {
    const set = new Set();
    matchData.rounds.forEach(round => {
      round.events.forEach(evt => set.add(evt.player));
    });
    return Array.from(set).sort();
  }, [matchData]);

  const [selectedPlayer, setSelectedPlayer] = useState(players[0] || '');

  return (
    <div className="bg-gray-800 rounded-2xl p-6 space-y-6 shadow-lg">
      {/* Player Selection */}
      <div className="flex items-center space-x-2">
        <label htmlFor="player-select" className="text-gray-300 font-medium">
          Select Player:
        </label>
        <select
          id="player-select"
          value={selectedPlayer}
          onChange={e => setSelectedPlayer(e.target.value)}
          className="bg-gray-700 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          {players.map(p => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {matchData.rounds.map((round, idx) => {
          // Filter events for selected player
          const playerEvents = round.events.filter(evt => evt.player === selectedPlayer);

          return (
            <div
              key={round.roundNumber}
              className={`
                flex items-center p-4 rounded-lg
                ${idx % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}
              `}
            >
              {/* Round Label */}
              <div className="w-12 flex-shrink-0">
                <span className="text-gray-300 font-bold">R{round.roundNumber}</span>
              </div>

              {/* Event Markers */}
              <div className="flex-1 flex space-x-2">
                {playerEvents.length === 0 ? (
                  <span className="text-gray-500 italic">No events</span>
                ) : ( 
                  playerEvents.map((evt, i) => {
                    let IconComponent = null;
                    let color = '';
                    switch (evt.type) {
                      case 'kill':
                        IconComponent = Crosshair;
                        color = 'text-green-400';
                        break;
                      case 'death':
                        IconComponent = Skull;
                        color = 'text-red-500';
                        break;
                      case 'utility':
                        IconComponent = Zap;
                        color = 'text-yellow-400';
                        break;
                      default:
                        return null;
                    }
                    return (
                      <div key={i} className="flex items-center space-x-1">
                        <IconComponent className={`${color}`} size={ICON_SIZE} />
                        <span className="text-gray-300 text-xs">{`${evt.type} @${evt.time}s`}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
