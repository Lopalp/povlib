import React from "react";
import { Search, Filter } from "lucide-react";
import HeroHeading from "../headings/HeroHeading";

const HeroHeader = ({
  searchQuery,
  handleSearchChange,
  handleSearchSubmit,
  setIsFilterModalOpen,
}) => (
  <div className="relative py-24 bg-gradient-to-b from-gray-800 to-gray-900">
    <div className="absolute inset-0 bg-yellow-400/5 mix-blend-overlay"></div>
    <div className="container mx-auto px-6 text-center">
      <HeroHeading>CS2 Pro POVs Library</HeroHeading>
      <p className="text-gray-300 max-w-2xl mx-auto mb-8">
        Browse all professional CS2 demos. Watch and learn from the best players
        and teams to improve your gameplay.
      </p>
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search demos, maps, players, or teams..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-4 pl-12 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-400"
          />
          <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="absolute right-3 top-3 p-1 bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 rounded-lg transition-colors"
          >
            <Filter className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  </div>
);

export default HeroHeader;
