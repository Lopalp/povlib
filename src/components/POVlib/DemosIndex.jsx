"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Filter, FileVideo, MapPin } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DemoCard from "./DemoCard";
import VideoPlayerPage from "./VideoPlayerPage";
import TaggingModal from "./TaggingModal";
import FilterModal from "./FilterModal";
import HeroHeading from "../typography/HeroHeading";
import Tag from "../typography/Tag";

import {
  getFilteredDemos,
  getFilterOptions,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions,
} from "@/lib/supabase";

// --- Helper Components ---
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

const DemoGrid = ({ demos, lastDemoElementRef, handleSelectDemo }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
    {demos.map((demo, index) => {
      const isLastElement = index === demos.length - 1;
      return (
        <DemoCard
          key={demo.id}
          ref={isLastElement ? lastDemoElementRef : null}
          demo={demo}
          onSelect={handleSelectDemo}
        />
      );
    })}
  </div>
);

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

const DemosIndex = () => {
  const [demos, setDemos] = useState([]);
  const [filteredDemos, setFilteredDemos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [relatedDemos, setRelatedDemos] = useState([]);
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [searchActive, setSearchActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [demoType, setDemoType] = useState("pro");
  const [filtersApplied, setFiltersApplied] = useState({
    map: "",
    position: "",
    player: "",
    team: "",
    year: "",
    event: "",
    result: "",
    search: "",
  });
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

  const mapDemoData = (demo) => ({
    id: demo.id,
    title: demo.title,
    thumbnail: demo.thumbnail,
    videoId: demo.video_id,
    map: demo.map,
    positions: demo.positions || [],
    tags: demo.tags || [],
    players: demo.players || [],
    team: demo.team,
    year: demo.year,
    event: demo.event,
    result: demo.result,
    views: demo.views || 0,
    likes: demo.likes || 0,
    isPro: demo.is_pro,
  });

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
    if (!searchQuery.trim()) {
      setFilteredDemos(demos);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = demos.filter(
      (demo) =>
        demo.title.toLowerCase().includes(query) ||
        demo.map.toLowerCase().includes(query) ||
        demo.players.some((player) => player.toLowerCase().includes(query)) ||
        (demo.team && demo.team.toLowerCase().includes(query)) ||
        demo.positions.some((pos) => pos.toLowerCase().includes(query)) ||
        demo.tags.some((tag) => tag.toLowerCase().includes(query))
    );
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
      if (searchQuery.trim() === "") {
        setFilteredDemos((prev) => [...prev, ...newDemos]);
      } else {
        const query = searchQuery.toLowerCase();
        const filteredNewDemos = newDemos.filter(
          (demo) =>
            demo.title.toLowerCase().includes(query) ||
            demo.map.toLowerCase().includes(query) ||
            demo.players.some((player) =>
              player.toLowerCase().includes(query)
            ) ||
            (demo.team && demo.team.toLowerCase().includes(query)) ||
            demo.positions.some((pos) => pos.toLowerCase().includes(query)) ||
            demo.tags.some((tag) => tag.toLowerCase().includes(query))
        );
        setFilteredDemos((prev) => [...prev, ...filteredNewDemos]);
      }
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

  const handleSelectDemo = (demo) => {
    setSelectedDemo(demo);
    findRelatedDemos(demo);
    updateDemoStats(demo.id, "views", 1).catch((err) =>
      console.error("Error updating views:", err)
    );
  };

  const findRelatedDemos = (demo) => {
    const related = demos.filter(
      (d) =>
        d.id !== demo.id &&
        (d.map === demo.map ||
          d.players.some((p) => demo.players.includes(p)) ||
          d.positions.some((p) => demo.positions.includes(p)))
    );
    setRelatedDemos(related.slice(0, 10));
  };

  const handleCloseVideoPlayer = () => {
    setSelectedDemo(null);
    setRelatedDemos([]);
  };

  const handleLikeDemo = async (demoId) => {
    try {
      const result = await updateDemoStats(demoId, "likes", 1);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setDemos((prev) =>
          prev.map((demo) =>
            demo.id === demoId ? { ...demo, likes: updatedDemo.likes } : demo
          )
        );
        setFilteredDemos((prev) =>
          prev.map((demo) =>
            demo.id === demoId ? { ...demo, likes: updatedDemo.likes } : demo
          )
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, likes: updatedDemo.likes });
        }
      }
    } catch (err) {
      console.error("Error liking demo:", err);
    }
  };

  const handleUpdateTags = async (demoId, tags) => {
    try {
      const result = await updateDemoTags(demoId, tags);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setDemos((prev) =>
          prev.map((demo) =>
            demo.id === demoId ? { ...demo, tags: updatedDemo.tags } : demo
          )
        );
        setFilteredDemos((prev) =>
          prev.map((demo) =>
            demo.id === demoId ? { ...demo, tags: updatedDemo.tags } : demo
          )
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, tags: updatedDemo.tags });
        }
        setIsTaggingModalOpen(false);
      }
    } catch (err) {
      console.error("Error updating tags:", err);
    }
  };

  const handleUpdatePositions = async (demoId, positions) => {
    try {
      const result = await updateDemoPositions(demoId, positions);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setDemos((prev) =>
          prev.map((demo) =>
            demo.id === demoId
              ? { ...demo, positions: updatedDemo.positions }
              : demo
          )
        );
        setFilteredDemos((prev) =>
          prev.map((demo) =>
            demo.id === demoId
              ? { ...demo, positions: updatedDemo.positions }
              : demo
          )
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({
            ...selectedDemo,
            positions: updatedDemo.positions,
          });
        }
      }
    } catch (err) {
      console.error("Error updating positions:", err);
    }
  };

  const handleSwitchDemoType = (type) => setDemoType(type);

  const handleResetFilters = () =>
    setFiltersApplied({
      map: "",
      position: "",
      player: "",
      team: "",
      year: "",
      event: "",
      result: "",
      search: searchQuery,
    });

  const handleApplyFilters = () => setIsFilterModalOpen(false);

  if (selectedDemo) {
    return (
      <>
        <VideoPlayerPage
          selectedDemo={selectedDemo}
          relatedDemos={relatedDemos}
          onClose={handleCloseVideoPlayer}
          onLike={handleLikeDemo}
          onOpenTagModal={() => setIsTaggingModalOpen(true)}
          onSelectRelatedDemo={handleSelectDemo}
          demoType={demoType}
          setDemoType={handleSwitchDemoType}
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
        {isTaggingModalOpen && (
          <TaggingModal
            selectedDemo={selectedDemo}
            filterOptions={filterOptions}
            onClose={() => setIsTaggingModalOpen(false)}
            onUpdateTags={handleUpdateTags}
            onUpdatePositions={handleUpdatePositions}
          />
        )}
      </>
    );
  }

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
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="w-full mb-3 px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Open Filters
            </button>
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset Filters
            </button>
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
              handleSelectDemo={handleSelectDemo}
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

      <Footer />
    </div>
  );
};

export default DemosIndex;
