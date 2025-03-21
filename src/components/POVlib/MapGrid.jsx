import React from 'react';

const MapGrid = ({ filterOptions, getFilteredDemosByMap, setFiltersApplied }) => {
  return (
    <div className="mt-16 mb-12">
      <h2 className="text-2xl font-bold text-white mb-8">
        <span className="border-l-4 border-yellow-400 pl-3 py-1">Browse Maps</span>
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filterOptions.maps.slice(0, 8).map(map => (
          <div 
            key={map}
            className="relative overflow-hidden h-36 rounded-xl cursor-pointer group"
            onClick={() => {
              setFiltersApplied(prev => ({
                ...prev,
                map: map
              }));
            }}
          >
            <img 
              src="https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true" 
              alt={map} 
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-yellow-400 z-0"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <h3 className="text-white font-bold text-lg mb-2">{map}</h3>
              <div className="flex justify-between items-center">
                <span className="text-xs text-yellow-400 font-medium">
                  {getFilteredDemosByMap(map).length} POVs
                </span>
                <span className="text-xs text-gray-300 group-hover:text-white transition-colors">View &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapGrid;
