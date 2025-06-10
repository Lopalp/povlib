import React from "react";
import Tag from "../typography/Tag";

const FilterTags = ({
  filtersApplied,
  setFiltersApplied,
  handleResetFilters,
}) => {
  const hasFilters = Object.values(filtersApplied).some(
    (value) => value !== ""
  );
  if (!hasFilters) return null;

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3 p-4 bg-gray-800 rounded-xl border border-gray-700">
      {Object.entries(filtersApplied).map(([key, value]) => {
        if (!value || key === "search") return null;
        return (
          <Tag
            key={key}
            variant="default"
            className="group hover:bg-gray-600 transition-colors"
          >
            <span className="capitalize mr-1 text-gray-400">{key}:</span>
            <span className="font-bold text-yellow-400">{value}</span>
            <button
              onClick={() => {
                setFiltersApplied((prev) => ({
                  ...prev,
                  [key]: "",
                }));
              }}
              className="ml-2 text-gray-500 group-hover:text-yellow-400 transition-colors"
            >
              &times;
            </button>
          </Tag>
        );
      })}
      <button
        onClick={handleResetFilters}
        className="text-xs text-gray-400 hover:text-yellow-400 ml-2 font-bold transition-colors"
      >
        Reset All Filters
      </button>
    </div>
  );
};

export default FilterTags;
