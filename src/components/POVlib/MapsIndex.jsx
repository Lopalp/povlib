"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, MapPin, Server } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FilterModal from "./FilterModal";
import HeroHeading from "../typography/HeroHeading";

import { getFilterOptions } from "@/lib/supabase";

const MapsIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demoType, setDemoType] = useState("pro");
  const [maps, setMaps] = useState([]);
  const [filteredMaps, setFilteredMaps] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState({
    // Add any filters specific to maps if needed
  });
  const [filterOptions, setFilterOptions] = useState({
    maps: [],
    positions: {},
  });

  // Placeholder maps data with additional information (until we fetch from API)
  const mapsData = [
    {
      name: "Mirage",
      description:
        "A classic CS2 map set in Morocco with a mix of long sight lines and close-quarters combat.",
      demoCount: 0, // Placeholder
      thumbnail:
        "https://raw.githubusercontent.com/ghostcap-gaming/cs2-map-images/main/cs2/de_mirage.png",
      positions: [
        "A Site",
        "B Site",
        "Mid",
        "Palace",
        "Apartments",
        "CT",
        "A Ramp",
        "B Short",
        "Window",
        "Underpass",
        "Jungle",
        "Connector",
      ],
    },
    {
      name: "Inferno",
      description:
        "A tight map set in Italy featuring narrow corridors and choke points, requiring strong teamwork.",
      demoCount: 0, // Placeholder
      thumbnail:
        "https://raw.githubusercontent.com/ghostcap-gaming/cs2-map-images/main/cs2/de_inferno.png",
      positions: [
        "A Site",
        "B Site",
        "Banana",
        "Mid",
        "Pit",
        "Apartments",
        "Library",
        "CT",
        "Car",
        "Construction",
        "Boiler",
      ],
    },
    {
      name: "Nuke",
      description:
        "A unique vertical map with two bomb sites stacked on top of each other in a nuclear facility.",
      demoCount: 0, // Placeholder
      thumbnail:
        "https://raw.githubusercontent.com/ghostcap-gaming/cs2-map-images/main/cs2/de_nuke.png",
      positions: [
        "A Site",
        "B Site",
        "Outside",
        "Ramp",
        "Secret",
        "Heaven",
        "Hell",
        "Radio",
        "Lobby",
        "Squeaky",
        "Vents",
      ],
    },
    {
      name: "Ancient",
      description:
        "A newer map set in a mystical temple with tight corridors and unique layout.",
      demoCount: 0, // Placeholder
      thumbnail:
        "https://raw.githubusercontent.com/ghostcap-gaming/cs2-map-images/main/cs2/de_ancient.png",
      positions: [
        "A Site",
        "B Site",
        "Mid",
        "Cave",
        "Temple",
        "Donut",
        "Jungle",
        "T Ramp",
        "CT Ramp",
      ],
    },
    {
      name: "Overpass",
      description:
        "A large map with two distinct areas, featuring unique elevation changes and rotation paths.",
      demoCount: 0, // Placeholder
      thumbnail:
        "https://raw.githubusercontent.com/ghostcap-gaming/cs2-map-images/main/cs2/de_overpass.png",
      positions: [
        "A Site",
        "B Site",
        "Long",
        "Monster",
        "Connector",
        "Bathrooms",
        "Bank",
        "Playground",
        "Short",
        "Heaven",
      ],
    },
    {
      name: "Anubis",
      description:
        "A newer Egyptian-themed map with open bombsites and multiple approaches.",
      demoCount: 0, // Placeholder
      thumbnail:
        "https://raw.githubusercontent.com/ghostcap-gaming/cs2-map-images/main/cs2/de_anubis.png",
      positions: [
        "A Site",
        "B Site",
        "Palace",
        "Canal",
        "Connector",
        "Mid",
        "Street",
        "Bridge",
        "Alley",
      ],
    },
    {
      name: "Vertigo",
      description:
        "A high-rise construction site map with tight corners and vertical gameplay elements.",
      demoCount: 0, // Placeholder
      thumbnail:
        "https://raw.githubusercontent.com/ghostcap-gaming/cs2-map-images/main/cs2/de_vertigo.png",
      positions: [
        "A Site",
        "B Site",
        "Mid",
        "CT",
        "Ramp",
        "Ladder",
        "Scaffold",
        "Elevators",
        "Heaven",
      ],
    },
    {
      name: "Dust2",
      description:
        "The iconic Counter-Strike map with its classic layout and mid-centric design.",
      demoCount: 0, // Placeholder
      thumbnail:
        "https://raw.githubusercontent.com/ghostcap-gaming/cs2-map-images/main/cs2/de_dust2.png",
      positions: [
        "A Site",
        "B Site",
        "Long",
        "Short",
        "Mid",
        "Lower Tunnels",
        "Upper Tunnels",
        "CT",
        "Pit",
        "Car",
      ],
    },
  ];

  // Load maps data on initial render
  useEffect(() => {
    const loadMaps = async () => {
      try {
        setIsLoading(true);

        // In a real implementation, load from API
        // For now, we'll use the placeholder data
        setMaps(mapsData);
        setFilteredMaps(mapsData);

        // Load filter options
        const options = await getFilterOptions();
        setFilterOptions({
          maps: options.maps || [],
          positions: options.positions || {},
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Error loading maps:", err);
        setError("Failed to load maps. Please try again later.");
        setIsLoading(false);
      }
    };

    loadMaps();
  }, []);

  // Filter maps based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMaps(maps);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = maps.filter(
      (map) =>
        map.name.toLowerCase().includes(query) ||
        map.description.toLowerCase().includes(query) ||
        map.positions.some((pos) => pos.toLowerCase().includes(query))
    );

    setFilteredMaps(filtered);
  }, [searchQuery, maps]);

  // Handler functions
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Already filtering in the useEffect
  };

  const handleSwitchDemoType = (type) => setDemoType(type);

  const handleResetFilters = () => setFiltersApplied({});

  const handleApplyFilters = () => setIsFilterModalOpen(false);

  // Render loading state
  if (isLoading && !maps.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading maps...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-white text-2xl font-bold mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200">
      <Navbar
        demoType={demoType}
        onSwitchDemoType={handleSwitchDemoType}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      />

      {/* Hero Header */}
      <div className="relative py-16 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-yellow-400/5 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 text-center">
          <HeroHeading>CS2 Maps</HeroHeading>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Browse all official CS2 maps and watch POV demos for specific
            positions and strategies.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search maps or positions..."
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

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Map Grid */}
        {filteredMaps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaps.map((map) => (
              <Link
                key={map.name}
                href={`/maps/${map.name.toLowerCase()}`}
                className="block group"
              >
                <div className="relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg border border-gray-700 hover:border-yellow-400/30 h-full">
                  {/* Map Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={map.thumbnail}
                      alt={map.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

                    {/* Map name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h2 className="text-white font-bold text-xl group-hover:text-yellow-400 transition-colors">
                        {map.name}
                      </h2>
                    </div>
                  </div>

                  {/* Map Info */}
                  <div className="p-4">
                    <p className="text-gray-300 text-sm line-clamp-2 mb-3 min-h-[40px]">
                      {map.description}
                    </p>

                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-yellow-400">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          {map.positions.length} positions
                        </span>
                      </div>

                      <div className="flex items-center text-gray-400">
                        <Server className="h-4 w-4 mr-1" />
                        <span className="text-sm">{map.demoCount} demos</span>
                      </div>
                    </div>

                    {/* Positions Preview */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {map.positions.slice(0, 3).map((position, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-700 px-2 py-0.5 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors"
                        >
                          {position}
                        </span>
                      ))}
                      {map.positions.length > 3 && (
                        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                          +{map.positions.length - 3}
                        </span>
                      )}
                    </div>

                    {/* View button */}
                    <button className="w-full mt-4 py-2 bg-gray-700 hover:bg-yellow-400 text-white hover:text-gray-900 rounded-lg text-sm font-medium transition-colors">
                      View Map Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="text-yellow-400 text-6xl mb-4">
              <MapPin />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">No maps found</h3>
            <p className="text-gray-400">Try changing your search</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </main>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <FilterModal
          demoType={demoType}
          filterOptions={filterOptions}
          filtersApplied={filtersApplied}
          onClose={() => setIsFilterModalOpen(false)}
          onFilterChange={(changed) =>
            setFiltersApplied((prev) => ({ ...prev, ...changed }))
          }
          onResetFilters={handleResetFilters}
          onApplyFilters={handleApplyFilters}
        />
      )}

      <Footer />
    </div>
  );
};

export default MapsIndex;
