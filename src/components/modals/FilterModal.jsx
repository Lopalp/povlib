import React from "react";
import {
  X,
  MapPin as MapIcon,
  Users,
  Calendar,
  Trophy,
  Zap,
  ShieldCheck,
  Sliders,
  Search,
  Filter,
} from "lucide-react";

const PrimaryButton = ({ children, onClick, className = "", ...props }) => (
  <button
    onClick={onClick}
    className={`bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${className}`}
    {...props}
  >
    {children}
  </button>
);

const FilterModal = ({
  demoType = "pro",
  filterOptions = {
    maps: ["Dust2", "Mirage", "Inferno", "Cache", "Overpass"],
    positions: {
      "Dust2": ["A Site", "B Site", "Long", "Short", "Mid"],
      "Mirage": ["A Site", "B Site", "Mid", "Palace", "Ramp"],
    },
    roles: ["IGL", "Support", "Entry", "Lurk", "AWP", "Rifle"]
  },
  filtersApplied = {},
  onClose = () => {},
  onFilterChange = () => {},
  onResetFilters = () => {},
  onApplyFilters = () => {},
}) => {
  // Helper to toggle items in array filters
  const toggleArrayFilter = (key, value) => {
    const currentArray = filtersApplied[key] || [];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    onFilterChange({ [key]: updatedArray });
  };

  const CustomCheckbox = ({ checked, onChange, label, id }) => (
    <label htmlFor={id} className="group flex items-center space-x-3 cursor-pointer">
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 ${
          checked 
            ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-400 shadow-lg shadow-yellow-400/25' 
            : 'border-gray-500 bg-gray-700/50 group-hover:border-yellow-400/50'
        }`}>
          {checked && (
            <svg className="w-3 h-3 text-black absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
    </label>
  );

  const CustomToggle = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-800 ${
          checked ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const InputField = ({ icon: Icon, label, children, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center text-sm font-medium text-gray-300">
        <Icon className="h-4 w-4 mr-2 text-yellow-400" />
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 px-6 py-4 border-b border-gray-700/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-400/20 rounded-lg">
                <Filter className="h-5 w-5 text-yellow-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Filter POV Demos</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-yellow-400 transition-all duration-200 hover:bg-gray-700/50 p-2 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-8">
            {/* PRO vs COMMUNITY toggle */}
            <div className="bg-gray-800/30 rounded-xl p-1 border border-gray-700/50">
              <div className="flex">
                <button
                  className={`flex-1 px-6 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${
                    demoType === "pro"
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                  onClick={() => onFilterChange({ demoType: "pro" })}
                >
                  PRO POVs
                </button>
                <button
                  className={`flex-1 px-6 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${
                    demoType === "community"
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                  onClick={() => onFilterChange({ demoType: "community" })}
                >
                  COMMUNITY POVs
                </button>
              </div>
            </div>

            {/* Map & Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField icon={MapIcon} label="Map">
                <select
                  className="w-full p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-200 hover:bg-gray-700/50"
                  value={filtersApplied.map || ""}
                  onChange={(e) =>
                    onFilterChange({ map: e.target.value, position: "" })
                  }
                >
                  <option value="">All Maps</option>
                  {filterOptions.maps.map((map) => (
                    <option key={map} value={map}>
                      {map}
                    </option>
                  ))}
                </select>
              </InputField>

              <InputField icon={ShieldCheck} label="CT Position">
                <select
                  value={filtersApplied.position || ""}
                  onChange={(e) => onFilterChange({ position: e.target.value })}
                  disabled={!filtersApplied.map}
                  className="w-full p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-200 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">All Positions</option>
                  {filtersApplied.map
                    ? (filterOptions.positions[filtersApplied.map] || []).map(
                        (pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        )
                      )
                    : Object.values(filterOptions.positions)
                        .flat()
                        .filter((pos, i, arr) => arr.indexOf(pos) === i)
                        .map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                </select>
              </InputField>
            </div>

            {/* Player & Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField icon={Search} label="Player">
                <div className="relative">
                  <input
                    className="w-full p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-200 hover:bg-gray-700/50 pl-10"
                    value={filtersApplied.player || ""}
                    onChange={(e) => onFilterChange({ player: e.target.value })}
                    placeholder="Search Player"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </InputField>

              {demoType === "pro" && (
                <InputField icon={Users} label="Team">
                  <div className="relative">
                    <input
                      className="w-full p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-200 hover:bg-gray-700/50 pl-10"
                      value={filtersApplied.team || ""}
                      onChange={(e) => onFilterChange({ team: e.target.value })}
                      placeholder="Search Team"
                    />
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </InputField>
              )}
            </div>

            {/* Year, Event & Platform */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <InputField icon={Calendar} label="Year">
                <input
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                  className="w-full p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-200 hover:bg-gray-700/50"
                  value={filtersApplied.year || ""}
                  onChange={(e) => onFilterChange({ year: e.target.value })}
                  placeholder="Enter Year"
                />
              </InputField>

              {demoType === "pro" && (
                <>
                  <InputField icon={Trophy} label="Event">
                    <div className="relative">
                      <input
                        className="w-full p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-200 hover:bg-gray-700/50 pl-10"
                        value={filtersApplied.event || ""}
                        onChange={(e) =>
                          onFilterChange({ event: e.target.value })
                        }
                        placeholder="Search Event"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </InputField>

                  <InputField icon={Zap} label="Platform">
                    <select
                      className="w-full p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-200 hover:bg-gray-700/50"
                      value={filtersApplied.platform || ""}
                      onChange={(e) =>
                        onFilterChange({ platform: e.target.value })
                      }
                    >
                      <option value="">All Platforms</option>
                      <option value="Faceit">Faceit</option>
                      <option value="Pro Game">Pro Game</option>
                    </select>
                  </InputField>
                </>
              )}
            </div>

            {/* Advanced Filters Section */}
            <div className="bg-gray-800/20 rounded-xl p-6 border border-gray-700/30">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <Sliders className="h-5 w-5 mr-2 text-yellow-400" />
                Advanced Filters
              </h3>
              
              <div className="space-y-8">
                {/* Elo Range */}
                <InputField icon={Sliders} label="Faceit Elo Range">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="50"
                          value={filtersApplied.eloMin || 0}
                          onChange={(e) =>
                            onFilterChange({ eloMin: Number(e.target.value) })
                          }
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="text-xs text-gray-400 mt-2 text-center">
                          Min: {filtersApplied.eloMin || 0}
                        </div>
                      </div>
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="50"
                          value={filtersApplied.eloMax || 5000}
                          onChange={(e) =>
                            onFilterChange({ eloMax: Number(e.target.value) })
                          }
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="text-xs text-gray-400 mt-2 text-center">
                          Max: {filtersApplied.eloMax || 5000}
                        </div>
                      </div>
                    </div>
                  </div>
                </InputField>

                {/* Roles */}
                <InputField icon={Users} label="Role">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filterOptions.roles.map((role) => (
                      <CustomCheckbox
                        key={role}
                        id={`role-${role}`}
                        checked={(filtersApplied.roles || []).includes(role)}
                        onChange={() => toggleArrayFilter("roles", role)}
                        label={role}
                      />
                    ))}
                  </div>
                </InputField>

                {/* POVlib Originals */}
                <div className="bg-gray-700/20 rounded-lg p-4">
                  <CustomToggle
                    checked={filtersApplied.povlib || false}
                    onChange={(checked) => onFilterChange({ povlib: checked })}
                    label="POVlib Originals"
                  />
                </div>

                {/* Additional Platforms */}
                <InputField icon={Zap} label="Additional Platforms">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "Faceit Top 1000",
                      "Faceit Pro League", 
                      "ESEA",
                      "Pro Esport",
                      "Pros Playing Faceit",
                    ].map((plat) => (
                      <CustomCheckbox
                        key={plat}
                        id={`platform-${plat}`}
                        checked={(filtersApplied.extraPlatforms || []).includes(plat)}
                        onChange={() => toggleArrayFilter("extraPlatforms", plat)}
                        label={plat}
                      />
                    ))}
                  </div>
                </InputField>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 px-6 py-4 border-t border-gray-700/50">
          <div className="flex justify-between items-center">
            <button
              onClick={onResetFilters}
              className="text-gray-400 hover:text-yellow-400 text-sm font-bold transition-all duration-200 hover:bg-gray-700/50 px-4 py-2 rounded-lg"
            >
              Reset Filters
            </button>

            <PrimaryButton onClick={onApplyFilters}>
              Apply Filters
            </PrimaryButton>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
        }
      `}</style>
    </div>
  );
};

export default FilterModal;