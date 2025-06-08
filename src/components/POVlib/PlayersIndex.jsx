"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Filter, Users } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PlayerCard from "./PlayerCard";
import FilterModal from "./FilterModal";
import HeroHeading from "../typography/HeroHeading";

import { getAllPlayers, getFilterOptions } from "@/lib/supabase";

const PlayersIndex = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [demoType, setDemoType] = useState("pro");
  const [filtersApplied, setFiltersApplied] = useState({
    team: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    teams: [],
  });

  // Load all players on initial render
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setIsLoading(true);

        // Load filter options
        const options = await getFilterOptions();
        setFilterOptions({
          teams: options.teams || [],
        });

        // Load initial set of players
        const playersData = await getAllPlayers(
          demoType,
          1,
          20,
          filtersApplied
        );
        if (!playersData) {
          setPlayers([]);
          setFilteredPlayers([]);
          setHasMore(false);
          setIsLoading(false);
          return;
        }

        setPlayers(playersData);
        setFilteredPlayers(playersData);
        setHasMore(playersData.length === 20);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading players:", err);
        setError("Failed to load players. Please try again later.");
        setIsLoading(false);
      }
    };

    loadPlayers();
  }, [demoType, filtersApplied]);

  // Filter players based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPlayers(players);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = players.filter(
      (player) =>
        player.name.toLowerCase().includes(query) ||
        (player.team && player.team.toLowerCase().includes(query))
    );

    setFilteredPlayers(filtered);
  }, [searchQuery, players]);

  // Load more players as user scrolls
  const loadMorePlayers = async () => {
    if (!hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const playersData = await getAllPlayers(
        demoType,
        nextPage,
        20,
        filtersApplied
      );

      if (!playersData || playersData.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      setPlayers((prev) => [...prev, ...playersData]);
      setPage(nextPage);
      setHasMore(playersData.length === 20);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading more players:", err);
      setIsLoading(false);
    }
  };

  // Intersection Observer for infinite scroll
  const observer = useRef();
  const lastPlayerElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePlayers();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMorePlayers]
  );

  // Handler functions
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Already filtering in the useEffect
  };

  const handleSwitchDemoType = (type) => setDemoType(type);

  const handleResetFilters = () => {
    setFiltersApplied({
      team: "",
    });
    setSearchQuery("");
  };

  const handleApplyFilters = () => setIsFilterModalOpen(false);

  // Render loading state
  if (isLoading && !players.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading players...</p>
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
          <HeroHeading>CS2 Pro Players</HeroHeading>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Browse all professional CS2 players and their POV demos. Watch and
            learn from the best players in the world.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search players by name or team..."
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
        {/* Filter tags */}
        {filtersApplied.team && (
          <div className="mb-8 flex items-center">
            <span className="text-gray-400 mr-2">Filtered by:</span>
            <div className="bg-gray-800 px-3 py-1 rounded-full text-yellow-400 text-sm font-medium flex items-center">
              Team: {filtersApplied.team}
              <button
                onClick={() =>
                  setFiltersApplied((prev) => ({ ...prev, team: "" }))
                }
                className="ml-2 text-gray-400 hover:text-yellow-400"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Player Grid */}
        {filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPlayers.map((player, index) => {
              // If this is the last item, attach the ref for intersection observer
              if (index === filteredPlayers.length - 1) {
                return (
                  <div ref={lastPlayerElementRef} key={player.name}>
                    <PlayerCard
                      player={player}
                      demoCount={player.stats?.totalDemos}
                      viewCount={player.stats?.totalViews}
                    />
                  </div>
                );
              } else {
                return (
                  <PlayerCard
                    key={player.name}
                    player={player}
                    demoCount={player.stats?.totalDemos}
                    viewCount={player.stats?.totalViews}
                  />
                );
              }
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="text-yellow-400 text-6xl mb-4">
              <Users />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">
              No players found
            </h3>
            <p className="text-gray-400">Try changing your search or filters</p>
            {(searchQuery || filtersApplied.team) && (
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center mt-8">
            <div className="w-10 h-10 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin"></div>
          </div>
        )}

        {!hasMore && players.length > 0 && (
          <div className="text-center my-12 py-6 border-t border-gray-800">
            <p className="text-gray-400">
              You've reached the end of the players list
            </p>
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

export default PlayersIndex;
