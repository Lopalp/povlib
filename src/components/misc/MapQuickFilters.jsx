import React from "react";
import { MapPin } from "lucide-react";

const MapQuickFilters = ({ filterOptions, demos, setFiltersApplied }) => {
  if (!filterOptions.maps || filterOptions.maps.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-gray-100 text-2xl font-bold mb-6">
        <span className="border-l-4 border-yellow-400 pl-3 py-1">
          Browse by Map
        </span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filterOptions.maps.map((map) => (
          <button
            key={map}
            onClick={() => setFiltersApplied((prev) => ({ ...prev, map }))}
            className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 border border-gray-700 hover:border-yellow-400/30 transition-all"
          >
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
              <span className="text-white font-medium">{map}</span>
            </div>
            <span className="text-xs text-gray-400">
              {demos.filter((d) => d.map === map).length} POVs
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapQuickFilters;
