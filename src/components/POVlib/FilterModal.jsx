import React from 'react';
import { X, Map as MapIcon, Users, Calendar, Trophy, Zap } from 'lucide-react';

const FilterModal = ({ demoType, filterOptions, filtersApplied, onClose, onFilterChange, onResetFilters, onApplyFilters }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      {/* Use the same glassmorphism effect as the Navbar */}
      <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_30px_rgba(250,204,21,0.15)]">
        <div className="p-6">
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
            <div className="flex border-b border-gray-700 mb-4">
              <button
                className={`px-6 py-3 text-sm font-bold ${demoType === 'pro' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => onFilterChange({ demoType: 'pro' })}
              >
                PRO POVs
              </button>
              <button
                className={`px-6 py-3 text-sm font-bold ${demoType === 'community' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => onFilterChange({ demoType: 'community' })}
              >
                COMMUNITY POVs
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <MapIcon className="h-4 w-4 mr-2 text-yellow-400" />
                  Map
                </label>
                <select 
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                  value={filtersApplied.map}
                  onChange={(e) => onFilterChange({ map: e.target.value })}
                >
                  <option value="">All Maps</option>
                  {filterOptions.maps.map(map => (
                    <option key={map} value={map}>{map}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <MapIcon className="h-4 w-4 mr-2 text-yellow-400" />
                  Position
                </label>
                <select 
 value={filtersApplied.position}
 onChange={(e) => onFilterChange({ position: e.target.value })}
 disabled={!filtersApplied.map} // Disable if no map is selected
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                >
                  <option value="">All Positions</option>
                  {filtersApplied.map 
                    ? ["Entry", "Lurk", "AWP", "Rifle", "Support Rifle", "IGL"].map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))
                    : Object.values(filterOptions.positions).flat().filter((pos, i, arr) => arr.indexOf(pos) === i).map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))
                  }
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <Users className="h-4 w-4 mr-2 text-yellow-400" />
                  Player
                </label>
                <input 
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                  value={filtersApplied.player}
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
                    value={filtersApplied.team}
                    onChange={(e) => onFilterChange({ team: e.target.value })}
                    placeholder="Search Team"
 />

                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                  Year
                </label>
                <input 
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                  value={filtersApplied.year}
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
                      value={filtersApplied.event}
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
 value={filtersApplied.platform}
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
