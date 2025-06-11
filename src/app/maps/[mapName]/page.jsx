"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNavbar } from "../../../context/NavbarContext";
import { Filter } from "lucide-react";
import HeroHeading from "../../../components/headings/HeroHeading";
import SectionHeading from "../../../components/headings/SectionHeading";

import DemoCard from "../../../components/cards/DemoCard";
import VideoPlayerPage from "../../../components/features/VideoPlayerPage";
import TaggingModal from "../../../components/modals/TaggingModal";
import FilterModal from "../../../components/modals/FilterModal";
import YouTubeEmbed from "../../../components/media/YouTubeEmbed";
import { ToggleButton } from "../../../components/buttons";
import ErrorDisplay from "../../../components/error/ErrorDisplay";

import {
  getDemosByMap,
  getFilterOptions,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions,
} from "@/lib/supabase";

const MapPage = ({ params }) => {
  const { mapName } = React.use(params);
  const formattedMapName = mapName.charAt(0).toUpperCase() + mapName.slice(1);
  const router = useRouter();
  const { demoType, handleSwitchDemoType } = useNavbar();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [allDemos, setAllDemos] = useState([]);
  const [demosByPosition, setDemosByPosition] = useState({});
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [relatedDemos, setRelatedDemos] = useState([]);
  const [activeTab, setActiveTab] = useState("all-demos");
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [yearRange, setYearRange] = useState({ from: "", to: "" });
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

  const mapDescriptions = {
    mirage: {
      callouts: [
        "A Site",
        "B Site",
        "Mid",
        "Palace",
        "Apartments",
        "CT Spawn",
        "T Spawn",
        "Connector",
        "Jungle",
        "Window",
        "Underpass",
        "B Halls",
        "Market",
        "Catwalk",
        "Ticket Booth",
        "Firebox",
        "Ninja",
        "Dark",
        "Van",
        "Bench",
        "Chair",
        "Stairs",
        "Ramp",
        "Triple Box",
      ],
      strategy:
        "Mirage requires careful mid control and effective rotations. T-side usually focuses on securing mid control to split defenses, while CT-side often relies on crossfires and smart utility usage.",
    },
    inferno: {
      callouts: [
        "A Site",
        "B Site",
        "Banana",
        "Mid",
        "Apartments",
        "Pit",
        "Graveyard",
        "Library",
        "Arch",
        "CT Spawn",
        "T Spawn",
        "Second Mid",
        "Boiler",
        "Dark",
        "New Box",
        "Orange",
        "Construction",
        "Ruins",
        "Coffins",
        "Logs",
        "Car",
        "Sandbags",
      ],
      strategy:
        "Control of Banana is crucial for both teams. T-side often uses flashbangs and molotovs to clear tight angles, while CT-side focuses on crossfires and fallback positions. Utility management is especially important on Inferno due to its narrow pathways.",
    },
    ancient: {
      callouts: [
        "A Site",
        "B Site",
        "Mid",
        "Donut",
        "Temple",
        "Cave",
        "Main",
        "Ramp",
        "CT Spawn",
        "T Spawn",
        "Snake",
        "Alley",
        "Water",
        "Tunnel",
        "Street",
        "Jungle",
      ],
      strategy:
        "Ancient rewards methodical play and good utility usage. T-side often focuses on gaining mid control before committing to a site, while CT-side relies on crossfires and well-timed rotations. The tight corridors make flashbangs especially effective.",
    },
    nuke: {
      callouts: [
        "A Site",
        "B Site",
        "Outside",
        "Ramp",
        "Secret",
        "Lobby",
        "Heaven",
        "Hell",
        "Rafters",
        "Radio",
        "Silo",
        "Garage",
        "T Spawn",
        "CT Spawn",
        "Vents",
        "Catwalk",
        "Marshmallow",
        "Trophy",
        "Squeaky",
      ],
      strategy:
        "Nuke heavily favors the CT-side due to quick rotation options between sites. T-side strategies often involve splitting between outside and ramp, or using vents for sneaky B-site executes. Sound cues are critical on Nuke due to its vertical layout.",
    },
    overpass: {
      callouts: [
        "A Site",
        "B Site",
        "Long",
        "Monster",
        "Connector",
        "Bank",
        "Bathrooms",
        "Playground",
        "Short",
        "Heaven",
        "Water",
        "Sewers",
        "Bridge",
        "Park",
        "Fountain",
        "Construction",
        "Pillar",
        "Truck",
        "Toxic",
      ],
      strategy:
        "Overpass is CT-sided at higher levels of play. T-side strategies often involve gaining control of connector or water for mid-round rotations. Fast B executes through monster and unique boosts are common tactics on this map.",
    },
    anubis: {
      callouts: [
        "A Site",
        "B Site",
        "Mid",
        "Palace",
        "Canal",
        "Connector",
        "Street",
        "Bridge",
        "Alley",
        "CT Spawn",
        "T Spawn",
        "Garden",
        "Heaven",
        "Tunnels",
        "Fountain",
      ],
      strategy:
        "As a newer map, Anubis strategies are still evolving. The mid area offers crucial control for both teams. T-side often uses mid to split defenses, while CT-side must balance resources between multiple entry points to both sites.",
    },
    vertigo: {
      callouts: [
        "A Site",
        "B Site",
        "Mid",
        "CT Spawn",
        "T Spawn",
        "Ramp",
        "Ladder",
        "Scaffold",
        "Elevator",
        "Heaven",
        "Catwalk",
        "Electric",
        "Generator",
        "Window",
        "Sandbags",
      ],
      strategy:
        "Vertigo favors quick executes and close-quarters combat. T-side often relies on fast A executes or mid control to enable B splits. CT rotations are critical as the map can be difficult to retake once a site is lost.",
    },
    dust2: {
      callouts: [
        "A Site",
        "B Site",
        "Long",
        "Short",
        "Mid",
        "Cat",
        "Tunnels",
        "Doors",
        "CT Spawn",
        "T Spawn",
        "Lower Tunnels",
        "Upper Tunnels",
        "Pit",
        "Car",
        "Goose",
        "Platform",
        "Suicide",
        "Xbox",
        "Blue",
      ],
      strategy:
        "Dust2 is considered one of the most balanced maps. T-side often focuses on gaining long control or establishing mid presence for splits. The AWP is particularly powerful on this map due to the long sightlines at mid, long, and B doors.",
    },
  };

  const mapSectionRef = useRef(null);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        setIsLoading(true);

        const mapInfo = mapDescriptions[mapName];
        if (!mapInfo) {
          setError("Map not found");
          setIsLoading(false);
          return;
        }
        setMap({ name: formattedMapName, ...mapInfo });

        const options = await getFilterOptions();
        setFilterOptions({
          positions: options.positions || {},
          teams: options.teams || [],
          years: options.years || [],
          events: options.events || [],
          players: options.players || [],
        });

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

  const handleSelectDemo = (demo) => {
    setSelectedDemo(demo);
    setIsVideoPlayerOpen(true);
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

  const handleCloseVideoPlayer = () => {
    setSelectedDemo(null);
    setIsVideoPlayerOpen(false);
  };

  const handleUpdateTags = async (demoId, tags) => {
    try {
      const result = await updateDemoTags(demoId, tags);
      if (result.success) {
        const updatedDemo = {
          ...result.demo,
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

        setAllDemos((prev) =>
          prev.map((demo) =>
            demo.id === demoId ? { ...demo, tags: updatedDemo.tags } : demo
          )
        );

        const updatedDemosByPosition = { ...demosByPosition };
        Object.keys(updatedDemosByPosition).forEach((position) => {
          updatedDemosByPosition[position] = updatedDemosByPosition[
            position
          ].map((demo) =>
            demo.id === demoId ? { ...demo, tags: updatedDemo.tags } : demo
          );
        });
        setDemosByPosition(updatedDemosByPosition);

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
          ...result.demo,
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

        setAllDemos((prev) =>
          prev.map((demo) =>
            demo.id === demoId
              ? { ...demo, positions: updatedDemo.positions }
              : demo
          )
        );

        const updatedDemosByPosition = {};
        const updatedAllDemos = allDemos.map((demo) =>
          demo.id === demoId
            ? { ...demo, positions: updatedDemo.positions }
            : demo
        );

        if (
          filterOptions.positions &&
          filterOptions.positions[formattedMapName]
        ) {
          filterOptions.positions[formattedMapName].forEach((position) => {
            const positionDemos = updatedAllDemos.filter((demo) =>
              demo.positions.includes(position)
            );
            if (positionDemos.length > 0) {
              updatedDemosByPosition[position] = positionDemos;
            }
          });
        }
        setDemosByPosition(updatedDemosByPosition);

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

  const handleLikeDemo = async (demoId) => {
    try {
      const result = await updateDemoStats(demoId, "likes", 1);
      if (result.success) {
        const updatedDemo = {
          ...result.demo,
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

        setAllDemos((prev) =>
          prev.map((demo) =>
            demo.id === demoId ? { ...demo, likes: updatedDemo.likes } : demo
          )
        );

        const updatedDemosByPosition = { ...demosByPosition };
        Object.keys(updatedDemosByPosition).forEach((position) => {
          updatedDemosByPosition[position] = updatedDemosByPosition[
            position
          ].map((demo) =>
            demo.id === demoId ? { ...demo, likes: updatedDemo.likes } : demo
          );
        });
        setDemosByPosition(updatedDemosByPosition);

        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, likes: updatedDemo.likes });
        }
      }
    } catch (err) {
      console.error("Error liking demo:", err);
    }
  };

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

  const backgroundDemoId = allDemos[0]?.videoId || "";

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

  if (error) {
    return <ErrorDisplay error={error} onBack={() => router.back()} />;
  }

  const bestDemos = [...allDemos].sort((a, b) => b.views - a.views).slice(0, 5);
  const recentDemos = [...allDemos]
    .sort((a, b) => {
      if (b.year !== a.year) return parseInt(b.year) - parseInt(a.year);
      return b.id - a.id;
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200">
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

      {/* Map Hero Header with background demo */}
      <div className="relative overflow-hidden bg-black group w-full aspect-[16/9] max-h-[75vh] h-auto">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute inset-0 w-full h-full">
            {backgroundDemoId && (
              <YouTubeEmbed
                videoId={backgroundDemoId}
                autoplay={true}
                controls={false}
                showInfo={false}
                fillParent={true}
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-30 container mx-auto h-full flex items-center justify-center px-6">
          <div className="text-center">
            <HeroHeading>{formattedMapName}</HeroHeading>
          </div>
        </div>

        {/* Bottom fade overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-16 z-30">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto custom-scrollbar">
            <ToggleButton
              active={activeTab === "callouts"}
              onClick={() => setActiveTab("callouts")}
            >
              Callouts
            </ToggleButton>
            <ToggleButton
              active={activeTab === "positions"}
              onClick={() => setActiveTab("positions")}
            >
              Positions
            </ToggleButton>
            <ToggleButton
              active={activeTab === "all-demos"}
              onClick={() => setActiveTab("all-demos")}
            >
              All POVs
            </ToggleButton>
            <ToggleButton
              active={activeTab === "strategies"}
              onClick={() => setActiveTab("strategies")}
            >
              Strategies
            </ToggleButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        className="container mx-auto px-6 py-12 bg-pattern"
        ref={mapSectionRef}
      >
        {/* Callouts Tab */}
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

        {/* Positions Tab */}
        {activeTab === "positions" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              <span className="border-l-4 border-yellow-400 pl-3 py-1">
                Positions
              </span>
            </h2>
            {Object.keys(demosByPosition).length > 0 ? (
              Object.keys(demosByPosition).map((position, idx) => (
                <div key={idx} className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">{position}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {demosByPosition[position].map((demo) => (
                      <DemoCard
                        key={demo.id}
                        demo={demo}
                        onSelectDemo={handleSelectDemo}
                        onLike={handleLikeDemo}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-300">
                No demos available for this map's positions.
              </p>
            )}
          </div>
        )}

        {/* Overview: Best and Recent modules only when NOT 'all-demos' */}
        {activeTab !== "all-demos" && allDemos.length > 0 && (
          <>
            {/* Best POVs */}
            {bestDemos.length > 0 && (
              <div className="mb-12">
                <SectionHeading>{formattedMapName}'s Best POVs</SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {bestDemos.map((demo) => (
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

            {/* Recent POVs */}
            {recentDemos.length > 0 && (
              <div className="mb-12">
                <SectionHeading>
                  {formattedMapName}'s Recent POVs
                </SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {recentDemos.map((demo) => (
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
          </>
        )}

        {/* All POVs Tab */}
        {activeTab === "all-demos" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                <span className="border-l-4 border-yellow-400 pl-3 py-1">
                  {formattedMapName}'s All POVs
                </span>
              </h2>
              <div className="text-gray-400">
                {allDemos.length} demos by{" "}
                {new Set(allDemos.flatMap((d) => d.players)).size} players
              </div>
            </div>
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

        {/* Strategies Tab */}
        {activeTab === "strategies" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              <span className="border-l-4 border-yellow-400 pl-3 py-1">
                Strategies
              </span>
            </h2>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <p className="text-gray-300 mb-4">{map.strategy}</p>
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
    </div>
  );
};

export default MapPage;
