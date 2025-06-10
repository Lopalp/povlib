"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FileVideo } from "lucide-react";
import { useNavbar } from "../../context/NavbarContext";

import FilterModal from "../../components/modals/FilterModal";
import { PrimaryButton, SecondaryButton } from "../../components/buttons";
import ErrorDisplay from "../../components/error/ErrorDisplay";
import HeroHeader from "../../components/sections/HeroHeader";
import DemoGrid from "../../components/sections/DemoGrid";
import FilterTags from "../../components/misc/FilterTags";
import MapQuickFilters from "../../components/misc/MapQuickFilters";

import { getFilteredDemos, getFilterOptions } from "@/lib/supabase";
import {
  mapDemoData,
  filterDemosBySearchQuery,
  createInitialFilterState,
} from "../../lib/utils";

const DemosPage = () => {
  const { demoType, handleSwitchDemoType } = useNavbar();
  const [demos, setDemos] = useState([]);
  const [filteredDemos, setFilteredDemos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filtersApplied, setFiltersApplied] = useState(
    createInitialFilterState()
  );
  const [filterOptions, setFilterOptions] = useState({
    maps: [],
    positions: {},
    teams: [],
    years: [],
    events: [],
    results: [],
    players: [],
  });

  const observer = useRef();
  const lastDemoElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreDemos();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const options = await getFilterOptions();
        setFilterOptions(options);
        const demosData = await getFilteredDemos(
          { ...filtersApplied, search: searchQuery },
          demoType
        );
        if (!demosData || demosData.length === 0) {
          setDemos([]);
          setFilteredDemos([]);
          setHasMore(false);
          setIsLoading(false);
          return;
        }
        const mappedDemos = demosData.map(mapDemoData);
        setDemos(mappedDemos);
        setFilteredDemos(mappedDemos);
        setHasMore(mappedDemos.length >= 20);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading demos:", err);
        setError("Failed to load demos. Please try again later.");
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [demoType, filtersApplied]);

  useEffect(() => {
    const filtered = filterDemosBySearchQuery(demos, searchQuery);
    setFilteredDemos(filtered);
  }, [searchQuery, demos]);

  const loadMoreDemos = async () => {
    if (!hasMore || isLoading) return;
    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const demosData = await getFilteredDemos(
        { ...filtersApplied, search: searchQuery },
        demoType
      );
      const existingIds = demos.map((d) => d.id);
      const newDemos = demosData
        .filter((d) => !existingIds.includes(d.id))
        .map(mapDemoData);
      if (newDemos.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      setDemos((prev) => [...prev, ...newDemos]);
      const filteredNewDemos = filterDemosBySearchQuery(newDemos, searchQuery);
      setFilteredDemos((prev) => [...prev, ...filteredNewDemos]);
      setPage(nextPage);
      setHasMore(newDemos.length >= 10);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading more demos:", err);
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleResetFilters = () =>
    setFiltersApplied(createInitialFilterState(searchQuery));

  const handleApplyFilters = () => setIsFilterModalOpen(false);

  if (isLoading && !demos.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading demos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay error={error} onBack={() => window.location.reload()} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200">
      <HeroHeader
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
        setIsFilterModalOpen={setIsFilterModalOpen}
      />

      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4 w-full">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Tools</h3>
            <PrimaryButton
              onClick={() => setIsFilterModalOpen(true)}
              className="w-full mb-3"
            >
              Open Filters
            </PrimaryButton>
            <SecondaryButton onClick={handleResetFilters} className="w-full">
              Reset Filters
            </SecondaryButton>
          </div>
        </aside>

        <main className="md:w-3/4 w-full flex-1 min-w-0">
          <FilterTags
            filtersApplied={filtersApplied}
            setFiltersApplied={setFiltersApplied}
            handleResetFilters={handleResetFilters}
          />

          {filteredDemos.length > 0 ? (
            <DemoGrid
              demos={filteredDemos}
              lastDemoElementRef={lastDemoElementRef}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="text-yellow-400 text-6xl mb-4">
                <FileVideo />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">
                No demos found
              </h3>
              <p className="text-gray-400">
                Try changing your search or filters
              </p>
              {(searchQuery ||
                Object.values(filtersApplied).some((v) => v)) && (
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

          {!hasMore && demos.length > 0 && (
            <div className="text-center my-12 py-6 border-t border-gray-800">
              <p className="text-gray-400">
                You've reached the end of the demos list
              </p>
            </div>
          )}

          {!Object.values(filtersApplied).some((v) => v) &&
            filterOptions.maps &&
            filterOptions.maps.length > 0 && (
              <MapQuickFilters
                filterOptions={filterOptions}
                demos={demos}
                setFiltersApplied={setFiltersApplied}
              />
            )}
        </main>
      </div>

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
    </div>
  );
};

export default DemosPage;
