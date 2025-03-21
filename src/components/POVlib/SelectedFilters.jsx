import React from 'react';
import { X } from 'lucide-react';

const SelectedFilters = ({ filtersApplied, setFiltersApplied, searchQuery }) => {
  const hasFilters = Object.values(filtersApplied).some(val => val !== '');
  if (!hasFilters) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
      {Object.entries(filtersApplied).map(([key, value]) => {
        if (!value || key === 'search') return null;
        return (
          <div key={key} className="flex items-center bg-gray-700 text-xs rounded-full px-3 py-2 group hover:bg-gray-600 transition-colors">
            <span className="capitalize mr-1 text-gray-400">{key}:</span>
            <span className="font-bold text-yellow-400">{value}</span>
            <button 
              onClick={() => {
                setFiltersApplied(prev => ({
                  ...prev,
                  [key]: ''
                }));
              }}
              className="ml-2 text-gray-500 group-hover:text-yellow-400 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
      <button 
        onClick={() => {
          setFiltersApplied({
            map: '',
            position: '',
            player: '',
            team: '',
            year: '',
            event: '',
            result: '',
            search: searchQuery
          });
        }}
        className="text-xs text-gray-400 hover:text-yellow-400 ml-2 font-bold transition-colors"
      >
        Reset All Filters
      </button>
    </div>
  );
};

export default SelectedFilters;
