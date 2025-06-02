import React, { useState, useEffect } from 'react';
import { X, Map as MapIcon, Users, Calendar, Trophy, Zap, Slider, Tag } from 'lucide-react';

const FilterModal = ({
  demoType,
  filtersApplied,
  onClose,
  onFilterChange,
  onResetFilters,
  onApplyFilters
}) => {
  // Hardcoded map list
  const maps = ['Dust2', 'Mirage', 'Inferno', 'Nuke', 'Overpass'];

  // For each map, exactly 5 CT default positions (example placeholders)
  const positions = {
    Dust2: ['A Long CT', 'A Site CT', 'Mid CT', 'B Site CT', 'CT Spawn'],
    Mirage: ['A Ramp CT', 'A Site CT', 'Palace CT', 'Connector CT', 'CT Spawn'],
    Inferno: ['A Site CT', 'Arch CT', 'Balcony CT', 'Library CT', 'CT Spawn'],
    Nuke: ['Ramp CT', 'Silo CT', 'Heaven CT', 'Lobby CT', 'CT Spawn'],
    Overpass: ['A Site CT', 'Heaven CT', 'Connector CT', 'B Site CT', 'CT Spawn'],
  };

  // Hardcoded roles list
  const roles = ['IGL', 'Support', 'Entry', 'Lurk', 'AWP', 'Rifler'];

  // Hardcoded platform/league options
  const leagueOptions = [
    'Faceit',
    'Faceit Top 1000',
    'Faceit Pro League',
    'ESEA',
    'Pro Esport',
    'Pros Playing Faceit',
  ];

  const [availablePositions, setAvailablePositions] = useState([]);

  // Update availablePositions whenever the selected map changes
  useEffect(() => {
    if (filtersApplied.map) {
      setAvailablePositions(positions[filtersApplied.map] || []);
    } else {
      // If no map is selected, show all positions de-duplicated
      const allPos = Object.values(positions)
        .flat()
        .filter((pos, idx, arr) => arr.indexOf(pos) === idx);
      setAvailablePositions(allPos);
    }
  }, [filtersApplied.map]);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_30px_rgba(250,204,21,0.15)]">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Filter POV Demos</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Demo Type Tabs */}
            <div className="flex border-b border-gray-700 mb-4">
              <button
                className={`px-6 py-3 text-sm font-bold ${
                  demoType === 'pro'
                    ? 'text-yellow-400 border-b-2 border-yellow-400'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => onFilterChange({ demoType: 'pro' })}
              >
                PRO POVs
              </button>
              <button
                className={`px-6 py-3 text-sm font-bold ${
                  demoType === 'community'
                    ? 'text-yellow-400 border-b-2 border-yellow-400'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => onFilterChange({ demoType: 'community' })}
              >
                COMMUNITY POVs
              </button>
            </div>

            {/* Row: Map & Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Map Selector */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <MapIcon className="h-4 w-4 mr-2 text-yellow-400" />
                  Map
                </label>
                <select
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                  value={filtersApplied.map || ''}
                  onChange={(e) =>
                    onFilterChange({ map: e.target.value, position: '' })
                  }
                >
                  <option value="">All Maps</option>
                  {maps.map((mapName) => (
                    <option key={mapName} value={mapName}>
                      {mapName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Position Selector */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <MapIcon className="h-4 w-4 mr-2 text-yellow-400" />
                  CT Position
                </label>
                <select
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                  value={filtersApplied.position || ''}
                  onChange={(e) => onFilterChange({ position: e.target.value })}
                  disabled={!filtersApplied.map}
                >
                  <option value="">All Positions</option>
                  {availablePositions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Roles Selector */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <Users className="h-4 w-4 mr-2 text-yellow-400" />
                Role
              </label>
              <select
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                value={filtersApplied.role || ''}
                onChange={(e) => onFilterChange({ role: e.target.value })}
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Elo Range */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <Slider className="h-4 w-4 mr-2 text-yellow-400" />
                Faceit Elo Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  max="10000"
                  className="w-1/2 p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                  placeholder="Min Elo"
                  value={filtersApplied.eloMin || ''}
                  onChange={(e) => onFilterChange({ eloMin: e.target.value })}
                />
                <input
                  type="number"
                  min="0"
                  max="10000"
                  className="w-1/2 p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                  placeholder="Max Elo"
                  value={filtersApplied.eloMax || ''}
                  onChange={(e) => onFilterChange({ eloMax: e.target.value })}
                />
              </div>
            </div>

            {/* POVlib Originals Toggle */}
            <div className="flex items-center space-x-2">
              <input
                id="povlib-originals"
                type="checkbox"
                checked={filtersApplied.povlibOriginals || false}
                onChange={(e) =>
                  onFilterChange({ povlibOriginals: e.target.checked })
                }
                className="h-4 w-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
              />
              <label
                htmlFor="povlib-originals"
                className="text-sm font-medium text-gray-300"
              >
                Show only “POVlib Originals”
              </label>
            </div>

            {/* Platform / League Checkboxes */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <Tag className="h-4 w-4 mr-2 text-yellow-400" />
                Platform / League
              </label>
              <div className="grid grid-cols-2 gap-2">
                {leagueOptions.map((league) => (
                  <label key={league} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={league}
                      checked={filtersApplied.platforms?.includes(league) || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const prev = filtersApplied.platforms || [];
                        if (checked) {
                          onFilterChange({
                            platforms: [...prev, league]
                          });
                        } else {
                          onFilterChange({
                            platforms: prev.filter((p) => p !== league)
                          });
                        }
                      }}
                      className="h-4 w-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                    />
                    <span className="text-sm text-gray-300">{league}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Player & Team (Pro Only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <Users className="h-4 w-4 mr-2 text-yellow-400" />
                  Player
                </label>
                <input
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                  value={filtersApplied.player || ''}
                  onChange={(e) => onFilterChange({ player: e.target.value })}
                  placeholder="Search Player"
                />
              </div>

              {demoType === 'pro' && (
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Users className="h-4 w-4 mr-2 text-yellow-400" />
                    Team
                  </label>
                  <input
                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                    value={filtersApplied.team || ''}
                    onChange={(e) => onFilterChange({ team: e.target.value })}
                    placeholder="Search Team"
                  />
                </div>
              )}
            </div>

            {/* Year, Event, and Platform (Pro Only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                  Year
                </label>
                <input
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                  value={filtersApplied.year || ''}
                  onChange={(e) => onFilterChange({ year: e.target.value })}
                  placeholder="Enter Year"
                />
              </div>

              {demoType === 'pro' && (
                <>
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                      <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
                      Event
                    </label>
                    <input
                      className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                      value={filtersApplied.event || ''}
                      onChange={(e) => onFilterChange({ event: e.target.value })}
                      placeholder="Search Event"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                      <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                      Platform
                    </label>
                    <select
                      className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                      value={filtersApplied.platform || ''}
                      onChange={(e) => onFilterChange({ platform: e.target.value })}
                    >
                      <option value="">All Platforms</option>
                      <option value="Faceit">Faceit</option>
                      <option value="Pro Game">Pro Game</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-700">
              <button
                onClick={onResetFilters}
                className="text-gray-400 hover:text-yellow-400 text-sm font-bold transition-colors"
              >
                Reset Filters
              </button>

              <button
                onClick={onApplyFilters}
                className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
