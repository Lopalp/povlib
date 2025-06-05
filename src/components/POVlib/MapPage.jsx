'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  Trophy,
  Info,
  Eye,
  Server,
  Tag,
} from "lucide-react";

import Navbar from "./Navbar";
import Footer from "./Footer";
import DemoCard from "./DemoCard";
import VideoPlayerPage from "./VideoPlayerPage";
import TaggingModal from "./TaggingModal";
import FilterModal from "./FilterModal";

// Die drei neuen Container‐Komponenten:
import CategorySectionFeatured from "../components/containers/CategorySectionFeatured";
import CategoryCarousel from "../components/containers/CategoryCarousel";
import CategorySection from "../components/containers/CategorySection";

import {
  getDemosByMap,
  getFilterOptions,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions,
} from "@/lib/supabase";

const MapPage = ({ mapName }) => {
  // Format map name for display (capitalize first letter)
  const formattedMapName = mapName.charAt(0).toUpperCase() + mapName.slice(1);

  // State
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [allDemos, setAllDemos] = useState([]);
  const [demosByPosition, setDemosByPosition] = useState({});
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [relatedDemos, setRelatedDemos] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchActive, setSearchActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [demoType, setDemoType] = useState("all");
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  // State to manage the year filter input fields
  const [yearRange, setYearRange] = useState({ from: "", to: "" });

  // Filter states
  const [filtersApplied, setFiltersApplied] = useState({
    position: "",
    player: "",
    team: "",
    year: "",
    event: "",
    role: "",
    result: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    positions: {},
    teams: [],
    events: [],
    roles: ["Entry", "Lurk", "AWP", "Rifle", "Support Rifle", "IGL"],
    players: [],
  });

  // Placeholder für Map-Beschreibung (steht weiter oben im Code, nicht wiederholt)

  // Ref für den Map-Bereich (Scroll-Ziel)
  const mapSectionRef = useRef(null);

  // Load map data und Demos
  useEffect(() => {
    const loadMapData = async () => {
      try {
        setIsLoading(true);

        // Map-Info aus Platzhaltern
        const mapDescriptions = {
          // … dieselben Beschreibungen wie vorher …
        };
        const mapInfo = mapDescriptions[mapName];
        if (!mapInfo) {
          setError("Map not found");
          setIsLoading(false);
          return;
        }
        setMap({
          name: formattedMapName,
          ...mapInfo,
        });

        // Filter-Optionen laden
        const options = await getFilterOptions();
        setFilterOptions({
          positions: options.positions || {},
          teams: options.teams || [],
          years: options.years || [],
          events: options.events || [],
          players: options.players || [],
        });

        // Demos für diese Map laden
        const demosData = await getDemosByMap(formattedMapName);
        const mappedDemos = demosData.map((demo) => ({
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
        }));

        setAllDemos(mappedDemos);

        // Gruppiere Demos nach Position
        const demosByPos = {};
        if (options.positions && options.positions[formattedMapName]) {
          options.positions[formattedMapName].forEach((position) => {
            const positionDemos = mappedDemos.filter((demo) =>
              demo.positions.includes(position)
            );
            if (positionDemos.length > 0) {
              demosByPos[position] = positionDemos;
            }
          });
        }
        setDemosByPosition(demosByPos);

        setIsLoading(false);
      } catch (err) {
        console.error("Error loading map data:", err);
        setError("Failed to load map data. Please try again later.");
        setIsLoading(false);
      }
    };

    loadMapData();
  }, [mapName, formattedMapName]);

  // Handler-Funktionen auch analog zur PlayerPage
  const handleSelectDemo = (demo) => {
    setSelectedDemo(demo);
    setIsVideoPlayerOpen(true);
    // Verwandte Demos finden
    const related = allDemos.filter(
      (d) =>
        d.id !== demo.id &&
        (d.positions.some((p) => demo.positions.includes(p)) ||
          d.players.some((p) => demo.players.includes(p)))
    );
    setRelatedDemos(related.slice(0, 10));

    updateDemoStats(demo.id, "views", 1).catch((err) =>
      console.error("Error updating views:", err)
    );

    window.scrollTo(0, 0);
  };

  const handleSwitchDemoType = (type) => {
    setDemoType(type);
  };

  const handleCloseVideoPlayer = () => {
    setSelectedDemo(null);
    setIsVideoPlayerOpen(false);
  };

  const handleUpdateTags = async (demoId, tags) => {
    try {
      const result = await updateDemoTags(demoId, tags);
      if (result.success) {
        const updatedDemo = {
          id: result.demo.id,
          title: result.demo.title,
          thumbnail: result.demo.thumbnail,
          videoId: result.demo.video_id,
          map: result.demo.map,
          positions: result.demo.positions || [],
          tags: result.demo.tags || [],
          players: result.demo.players || [],
          team: result.demo.team,
          year: result.demo.year,
          event: result.demo.event,
          result: result.demo.result,
          views: result.demo.views || 0,
          likes: result.demo.likes || 0,
          isPro: result.demo.is_pro,
        };
        // Update allDemos
        setAllDemos((prev) =>
          prev.map((demo) =>
            demo.id === demoId ? { ...demo, tags: updatedDemo.tags } : demo
          )
        );
        // Update demosByPosition
        const updatedDemosByPosition = { ...demosByPosition };
        Object.keys(updatedDemosByPosition).forEach((position) => {
          updatedDemosByPosition[position] = updatedDemosByPosition[
            position
          ].map((demo) =>
            demo.id === demoId ? { ...demo, tags: updatedDemo.tags } : demo
          );
        });
        setDemosByPosition(updatedDemosByPosition);
        // Update selectedDemo
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
        const updatedDemo = {
          id: result.demo.id,
          title: result.demo.title,
          thumbnail: result.demo.thumbnail,
          videoId: result.demo.video_id,
          map: result.demo.map,
          positions: result.demo.positions || [],
          tags: result.demo.tags || [],
          players: result.demo.players || [],
          team: result.demo.team,
          year: result.demo.year,
          event: result.demo.event,
          result: result.demo.result,
          views: result.demo.views || 0,
          likes: result.demo.likes || 0,
          isPro: result.demo.is_pro,
        };

        // Update allDemos
        const newAll = allDemos.map((demo) =>
          demo.id === demoId ? { ...demo, positions: updatedDemo.positions } : demo
        );
        setAllDemos(newAll);

        // Komplett neu nach Position gruppieren
        const updatedDemosByPosition = {};
        if (
          filterOptions.positions &&
          filterOptions.positions[formattedMapName]
        ) {
          filterOptions.positions[formattedMapName].forEach((position) => {
            const posDemos = newAll.filter((demo) =>
              demo.positions.includes(position)
            );
            if (posDemos.length > 0) {
              updatedDemosByPosition[position] = posDemos;
            }
          });
        }
        setDemosByPosition(updatedDemosByPosition);

        // Update selectedDemo
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, positions: updatedDemo.positions });
        }
      }
    } catch (err) {
      console.error("Error updating positions:", err);
    }
  };

  const handleLikeDemo = async (demoId) => {
    try {
      const result = await updateDemoStats(demoId, "likes", 1);
      if (result.success) {
        const updatedDemo = {
          id: result.demo.id,
          title: result.demo.title,
          thumbnail: result.demo.thumbnail,
          videoId: result.demo.video_id,
          map: result.demo.map,
          positions: result.demo.positions || [],
          tags: result.demo.tags || [],
          players: result.demo.players || [],
          team: result.demo.team,
          year: result.demo.year,
          event: result.demo.event,
          result: result.demo.result,
          views: result.demo.views || 0,
          likes: result.demo.likes || 0,
          isPro: result.demo.is_pro,
        };
        // Update allDemos
        setAllDemos((prev) =>
          prev.map((demo) =>
            demo.id === demoId ? { ...demo, likes: updatedDemo.likes } : demo
          )
        );
        // Update demosByPosition
        const updatedDemosByPosition = { ...demosByPosition };
        Object.keys(updatedDemosByPosition).forEach((position) => {
          updatedDemosByPosition[position] = updatedDemosByPosition[
            position
          ].map((demo) =>
            demo.id === demoId ? { ...demo, likes: updatedDemo.likes } : demo
          );
        });
        setDemosByPosition(updatedDemosByPosition);
        // Update selectedDemo
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, likes: updatedDemo.likes });
        }
      }
    } catch (err) {
      console.error("Error liking demo:", err);
    }
  };

  // Effect: Jahr-Range-Filter in filtersApplied packen
  useEffect(() => {
    const yearString =
      yearRange.from || yearRange.to ? `${yearRange.from}-${yearRange.to}` : "";
    setFiltersApplied((prev) => ({ ...prev, year: yearString }));
  }, [yearRange]);

  const handleResetFilters = () =>
    setFiltersApplied({
      position: "",
      player: "",
      team: "",
      year: "",
      event: "",
      result: "",
    });

  const handleApplyFilters = () => {
    console.log("Applying Filters:", filtersApplied);
    setIsFilterModalOpen(false);
  };

  const handleSelectRelatedDemo = (demo) => {
    setSelectedDemo(demo);
    const related = allDemos.filter(
      (d) =>
        d.id !== demo.id &&
        (d.positions.some((p) => demo.positions.includes(p)) ||
          d.players.some((p) => demo.players.includes(p)))
    );
    setRelatedDemos(related.slice(0, 10));
    updateDemoStats(demo.id, "views", 1).catch((err) =>
      console.error("Error updating views:", err)
    );
    window.scrollTo(0, 0);
  };

  const scrollToMapSection = () => {
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Falls Video-Player geöffnet
  if (isVideoPlayerOpen && selectedDemo) {
    return (
      <>
        <VideoPlayerPage
          selectedDemo={selectedDemo}
          relatedDemos={relatedDemos}
          onClose={handleCloseVideoPlayer}
          onLike={handleLikeDemo}
          onOpenTagModal={() => setIsTaggingModalOpen(true)}
          onSelectRelatedDemo={handleSelectRelatedDemo}
          demoType={demoType}
          setDemoType={handleSwitchDemoType}
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        {isTaggingModalOpen && selectedDemo && (
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

  // Lade-Zustand
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading map data...</p>
        </div>
      </div>
    );
  }

  // Fehler-Zustand
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
            onClick={() => router.back()}
            className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    // pt-20 für Navbar-Abstand
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .bg-pattern {
          background-image: radial-gradient(
            rgba(255, 255, 255, 0.05) 1px,
            transparent 1px
          );
          background-size: 20px 20px;
        }
      `}</style>

      <Navbar
        demoType={demoType}
        onSwitchDemoType={handleSwitchDemoType}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      />

      {/* Map Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>

        <div className="container mx-auto px-6 pt-32 pb-16 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              {formattedMapName}
            </h1>
            <p className="text-gray-300 text-lg mb-8">{map.description}</p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setActiveTab("overview");
                  scrollToMapSection();
                }}
                className="hidden px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Map Overview
              </button>

              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="px-6 py-3 bg-gray-800/40 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700 border border-gray-700 hover:border-yellow-400/30 transition-all flex items-center"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filter POVs
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <div className="flex items-center bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Eye className="h-4 w-4 mr-2 text-yellow-400" />
                <div>
                  <div className="text-white font-bold">{allDemos.length}</div>
                  <div className="text-gray-400 text-xs">POV Demos</div>
                </div>
              </div>

              <div className="flex items-center bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
                <div>
                  <div className="text-white font-bold">
                    {Object.keys(demosByPosition).length}
                  </div>
                  <div className="text-gray-400 text-xs">Positions</div>
                </div>
              </div>

              <div className="flex items-center bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <User className="h-4 w-4 mr-2 text-yellow-400" />
                <div>
                  <div className="text-white font-bold">
                    {new Set(allDemos.flatMap((demo) => demo.players)).size}
                  </div>
                  <div className="text-gray-400 text-xs">Pro Players</div>
                </div>
              </div>
            </div>

            {/* Display Map Strategy */}
            <div className="mt-8">
              <h3 className="text-white font-bold mb-3 flex items-center">
                <Info className="h-4 w-4 mr-2 text-yellow-400" />
                Map Strategy
              </h3>
              <p className="text-gray-300 text-lg">{map.strategy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-16 z-30">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto custom-scrollbar">
            <button
              className={`px-4 py-4 text-sm font-bold whitespace-nowrap ${
                activeTab === "callouts"
                  ? "text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("callouts")}
            >
              Callouts
            </button>
            <button
              className={`px-4 py-4 text-sm font-bold whitespace-nowrap ${
                activeTab === "positions"
                  ? "text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("positions")}
            >
              Positions
            </button>
            <button
              className={`px-4 py-4 text-sm font-bold whitespace-nowrap ${
                activeTab === "all-demos"
                  ? "text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("all-demos")}
            >
              All POVs
            </button>
            <button
              className={`px-4 py-4 text-sm font-bold whitespace-nowrap ${
                activeTab === "strategies"
                  ? "text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("strategies")}
            >
              Strategies
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        className="container mx-auto px-6 py-12 bg-pattern"
        ref={mapSectionRef}
      >
        {/* == 1. Callouts Tab == */}
        {activeTab === "callouts" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              <span className="border-l-4 border-yellow-400 pl-3 py-1">
                Callouts
              </span>
            </h2>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <ul className="list-disc pl-5">
                {map.callouts &&
                  map.callouts.map((callout, index) => (
                    <li key={index} className="text-gray-300 mb-2">
                      {callout}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        {/* == 2. Positions Tab == */}
        {activeTab === "positions" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              <span className="border-l-4 border-yellow-400 pl-3 py-1">
                Positions
              </span>
            </h2>

            {Object.keys(demosByPosition).length > 0 ? (
              Object.keys(demosByPosition).map((position, idx) => {
                const demos = demosByPosition[position];
                const len = demos.length;
                // Bis zu 5 Demos nur verwenden, „nicht so viele“
                const sliceDemos = demos.slice(0, 5);

                // ≤ 3 → Featured, 4–5 → Carousel, ≥ 6 → Grid
                if (len <= 3) {
                  return (
                    <div key={`pos-featured-${position}`} className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">{position}</h3>
                      <CategorySectionFeatured
                        title=""
                        demos={sliceDemos}
                        onSelectDemo={handleSelectDemo}
                        gap={16}
                      />
                    </div>
                  );
                } else if (len <= 5) {
                  return (
                    <div key={`pos-carousel-${position}`} className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">{position}</h3>
                      <CategoryCarousel
                        title=""
                        demos={sliceDemos}
                        onSelectDemo={handleSelectDemo}
                        gap={16}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={`pos-grid-${position}`} className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">{position}</h3>
                      <CategorySection
                        title=""
                        demos={sliceDemos}
                        onSelectDemo={handleSelectDemo}
                        minCardWidth={240}
                        gap={16}
                      />
                    </div>
                  );
                }
              })
            ) : (
              <p className="text-gray-300">
                No demos available for this map's positions.
              </p>
            )}
          </div>
        )}

        {/* == 3. Recently Added POVs (wenn nicht „All POVs“ Tab) == */}
        {activeTab !== "all-demos" &&
          (allDemos.length > 0 ? (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">
                <span className="border-l-4 border-yellow-400 pl-3 py-1">
                  Recently Added POVs
                </span>
              </h2>

              {(() => {
                const sliceDemos = allDemos.slice(0, 5);
                const len = allDemos.length;
                // ≤ 3 → Featured, 4–5 → Carousel, ≥ 6 → Grid
                if (len <= 3) {
                  return (
                    <CategorySectionFeatured
                      title=""
                      demos={sliceDemos}
                      onSelectDemo={handleSelectDemo}
                      gap={16}
                    />
                  );
                } else if (len <= 5) {
                  return (
                    <CategoryCarousel
                      title=""
                      demos={sliceDemos}
                      onSelectDemo={handleSelectDemo}
                      gap={16}
                    />
                  );
                } else {
                  return (
                    <CategorySection
                      title=""
                      demos={sliceDemos}
                      onSelectDemo={handleSelectDemo}
                      minCardWidth={240}
                      gap={16}
                    />
                  );
                }
              })()}

              {allDemos.length > 5 && (
                <p className="text-gray-300 mt-4">
                  Scroll down to the "All POVs" tab for more!
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-300">
              No recently added demos available for this map.
            </p>
          ))}

        {/* == 4. All POVs Tab == */}
        {activeTab === "all-demos" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              <span className="border-l-4 border-yellow-400 pl-3 py-1">
                All POV Demos
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {allDemos.map((demo) => (
                <DemoCard
                  key={demo.id}
                  demo={demo}
                  onSelectDemo={handleSelectDemo}
                  onLike={handleLikeDemo}
                />
              ))}
            </div>
          </div>
        )}

        {/* == 5. Strategies Tab == */}
        {activeTab === "strategies" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              <span className="border-l-4 border-yellow-400 pl-3 py-1">
                Strategies
              </span>
            </h2>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <p className="text-gray-300 mb-4">{map.strategy}</p>
              {/* Weitere Strategie-Details können hier hin */}
            </div>
          </div>
        )}
      </main>

      {isFilterModalOpen && (
        <FilterModal
          filtersApplied={filtersApplied}
          setFiltersApplied={setFiltersApplied}
          filterOptions={filterOptions}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilters}
          yearRange={yearRange}
          setYearRange={setYearRange}
          onReset={handleResetFilters}
        />
      )}

      <Footer />
    </div>
  );
};

export default MapPage;
