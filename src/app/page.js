"use client";
import Script from "next/script.js";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Link from "next/link";
import { Search, Filter, X, Menu } from "lucide-react";
import {
  getFilteredDemos,
  getTrendingDemos,
  getLatestDemos,
  getDemosByMap,
  getDemosByPosition,
  getFilterOptions,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions,
  getPlayerInfo,
} from "../lib/supabase";
import { useRouter } from "next/navigation";
import VideoPlayerPage from "../components/features/VideoPlayerPage";
import TaggingModal from "../components/modals/TaggingModal";
import FilterModal from "../components/modals/FilterModal";

import CompetitionModule from "../components/features/CompetitionModule";
import FeaturedHero from "../components/features/FeaturedHero";
import SelectedFilters from "../components/misc/SelectedFilters";
import { CategorySection } from "../components/features/CategorySection";
import { LoadingFullscreen } from "../components/loading/LoadingFullscreen";
import PlanComparisonModule from "../components/features/PlanComparisonModule";
import UnderConstructionModal from "../components/modals/UnderConstructionModal";
import { Tag } from "../components/tags";
import { UserContext } from "../../context/UserContext.js";
import { createSupabaseBrowserClient } from "../lib/supabaseClient.js";
import { useNavbar } from "../context/NavbarContext";

const mapDemo = (demo) => ({
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

export default function Home() {
  // -------------------------------------
  // Get navbar state from context
  // -------------------------------------
  const { demoType } = useNavbar();

  // -------------------------------------
  // User Authentication State
  // -------------------------------------
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  // -------------------------------------
  // Under Construction Modal (show on load)
  // -------------------------------------
  const [isUnderConstructionOpen, setIsUnderConstructionOpen] = useState(false);

  // -------------------------------------
  // Plan state for comparison module
  // -------------------------------------
  const [currentPlan, setCurrentPlan] = useState("free"); // default—could come from user profile/API
  const handleUpgrade = (nextPlanKey) => {
    if (!nextPlanKey) {
      // User is already on the highest tier or clicked "Manage Subscription"
      console.log("Manage subscription clicked");
      return;
    }
    // Example API call to upgrade plan, then update local state:
    fetch("/api/upgrade-plan", {
      method: "POST",
      body: JSON.stringify({ newPlan: nextPlanKey }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Upgrade failed");
        return res.json();
      })
      .then((data) => {
        setCurrentPlan(nextPlanKey);
      })
      .catch((err) => {
        console.error(err);
        alert("Upgrade failed. Please try again.");
      });
  };

  // -------------------------------------
  // UI States
  // -------------------------------------
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);

  const handleTagClick = (tag) => {
    setActiveTag(tag);
  };
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideoId, setActiveVideoId] = useState("");
  const [autoplayVideo, setAutoplayVideo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoPlayerPage, setIsVideoPlayerPage] = useState(false);

  // -------------------------------------
  // Data States
  // -------------------------------------
  const [filteredDemos, setFilteredDemos] = useState([]);
  const [trendingDemos, setTrendingDemos] = useState([]);
  const [latestDemos, setLatestDemos] = useState([]);
  const [mapDemos, setMapDemos] = useState({});
  const [positionDemos, setPositionDemos] = useState({});
  const [filterOptions, setFilterOptions] = useState({
    maps: [],
    positions: {},
    teams: [],
    years: [],
    events: [],
    results: [],
    players: [],
  });
  const [filtersApplied, setFiltersApplied] = useState({
    map: "",
    position: "",
    player: "",
    team: "",
    year: "",
    event: "",
    result: "",
    search: searchQuery,
  });

  // Dynamische Tags
  const dynamicTags = useMemo(() => {
    const tagsSet = new Set();
    filteredDemos.forEach((demo) => {
      demo.tags.forEach((tag) => tagsSet.add(tag));
    });
    tagsSet.add("Maps");
    tagsSet.add("Players");
    tagsSet.add("Teams");
    tagsSet.add("Map + CT Position");
    const allTags = Array.from(tagsSet);

    // Shuffle the array randomly
    for (let i = allTags.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTags[i], allTags[j]] = [allTags[j], allTags[i]];
    }
    return allTags.slice(0, 5); // Take only the first 5 elements
  }, [filteredDemos]);

  // Helper functions for Map/Positions filters
  const getFilteredDemosByMap = useCallback(
    (map) => mapDemos[map] || [],
    [mapDemos]
  );
  const getFilteredDemosByPosition = useCallback(
    (position) => positionDemos[position] || [],
    [positionDemos]
  );

  // User Authentication Effect
  useEffect(() => {
    // Attempt to get the session on initial load
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user.user_metadata ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting initial session:", error);
        setLoading(false);
      });

    // Listen for auth state changes (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user.user_metadata);
        } else {
          setSession(null);
          setUser(null);
        }
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      console.debug("User changed:", user);
    }
  }, [user]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log("Starting to load initial data...");
        setIsLoading(true);
        const options = await getFilterOptions();
        setFilterOptions(options);
        console.log("Filter options loaded:", options);

        const [demos, trending, latest] = await Promise.all([
          getFilteredDemos(filtersApplied, demoType),
          getTrendingDemos(5, demoType),
          getLatestDemos(5, demoType),
        ]);

        console.log("Raw demos from Supabase:", demos);
        console.log("Raw trending:", trending);
        console.log("Raw latest:", latest);

        // If no demos from database, use fallback data
        if (!demos || demos.length === 0) {
          console.warn("No demos found in database, using fallback data");
          const fallbackDemos = [
            {
              id: 999,
              title: "Fallback Demo - s1mple Ace on Mirage",
              thumbnail: "/img/1.png",
              video_id: "dQw4w9WgXcQ",
              map: "Mirage",
              positions: ["A Site", "Connector"],
              tags: ["ace", "clutch"],
              players: ["s1mple"],
              team: "NAVI",
              year: "2024",
              event: "BLAST Premier",
              result: "Win",
              views: 15420,
              likes: 892,
              is_pro: true,
            },
          ];
          setFilteredDemos(fallbackDemos.map(mapDemo));
          setTrendingDemos(fallbackDemos.map(mapDemo));
          setLatestDemos(fallbackDemos.map(mapDemo));
        } else {
          const mappedDemos = demos.map(mapDemo);
          console.log("Mapped demos:", mappedDemos);
          setFilteredDemos(mappedDemos);

          const mappedTrending = trending.map(mapDemo);
          console.log("Mapped trending:", mappedTrending);
          setTrendingDemos(mappedTrending);

          const mappedLatest = latest.map(mapDemo);
          setLatestDemos(mappedLatest);
        }

        setIsLoading(false);
        console.log("Initial data loading completed");
      } catch (error) {
        console.error("Error loading initial data:", error);

        // Use fallback data on error
        console.warn("Database error occurred, using fallback data");
        const fallbackDemos = [
          {
            id: 998,
            title: "Error Fallback - Test Video",
            thumbnail: "/img/1.png",
            video_id: "dQw4w9WgXcQ",
            map: "Mirage",
            positions: ["A Site"],
            tags: ["test"],
            players: ["TestPlayer"],
            team: "TestTeam",
            year: "2024",
            event: "Test Event",
            result: "Win",
            views: 1000,
            likes: 50,
            is_pro: true,
          },
        ];
        setFilteredDemos(fallbackDemos.map(mapDemo));
        setTrendingDemos(fallbackDemos.map(mapDemo));
        setLatestDemos(fallbackDemos.map(mapDemo));

        setError(`Database connection failed: ${error.message}`);
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [demoType]);

  // Watch for filter changes and update demos
  useEffect(() => {
    const updateFilteredDemos = async () => {
      try {
        const demos = await getFilteredDemos(filtersApplied, demoType);
        const mappedDemos = demos.map(mapDemo);
        setFilteredDemos(mappedDemos);
        if (mappedDemos.length > 0 && !activeVideoId) {
          setActiveVideoId(mappedDemos[0].videoId);
        }
      } catch (err) {
        console.error("Error updating filtered demos:", err);
      }
    };

    updateFilteredDemos();
  }, [filtersApplied, demoType, activeVideoId]);

  // Load map-specific demos
  const loadMapDemos = async (map) => {
    try {
      const demos = await getDemosByMap(map, demoType);
      const mappedDemos = demos.map(mapDemo);
      setMapDemos((prev) => ({
        ...prev,
        [map]: mappedDemos,
      }));
    } catch (err) {
      console.error(`Error loading demos for map ${map}:`, err);
    }
  };

  // Load position-specific demos
  const loadPositionDemos = async (position) => {
    try {
      const demos = await getDemosByPosition(position, demoType);
      const mappedDemos = demos.map(mapDemo);
      setPositionDemos((prev) => ({
        ...prev,
        [position]: mappedDemos,
      }));
    } catch (err) {
      console.error(`Error loading demos for position ${position}:`, err);
    }
  };

  // Load demos for maps we want to display
  useEffect(() => {
    if (!filtersApplied.map) {
      loadMapDemos("Mirage");
      loadMapDemos("Inferno");
    }
  }, [filtersApplied.map, demoType]);

  // Update views for active video
  useEffect(() => {
    if (activeVideoId && filteredDemos.length > 0) {
      const updateViews = async () => {
        try {
          // Find the demo with the matching video ID
          const demo = filteredDemos.find((d) => d.videoId === activeVideoId);
          if (demo) {
            await updateDemoStats(demo.id, "views");
            const updateList = (list) =>
              list.map((demo) =>
                demo.videoId === activeVideoId
                  ? { ...demo, views: demo.views + 1 }
                  : demo
              );
            setFilteredDemos(updateList);
            setTrendingDemos(updateList);
            setLatestDemos(updateList);
          }
        } catch (err) {
          console.error("Error updating views:", err);
        }
      };
      updateViews();
    }
  }, [activeVideoId, filteredDemos.length]);

  // Generic function to update demo across all lists
  const handleDemoUpdate = async (demoId, updateFn, updater) => {
    try {
      await updateFn(demoId);
      const updateList = (list) =>
        list.map((demo) => (demo.id === demoId ? updater(demo) : demo));

      setFilteredDemos(updateList);
      setTrendingDemos(updateList);
      setLatestDemos(updateList);
      setMapDemos((prev) => {
        const updated = {};
        Object.keys(prev).forEach((key) => {
          updated[key] = updateList(prev[key]);
        });
        return updated;
      });
    } catch (err) {
      console.error("Error updating demo:", err);
    }
  };

  const handleLikeDemo = async (demoId) => {
    await handleDemoUpdate(
      demoId,
      (id) => updateDemoStats(id, "likes"),
      (demo) => ({ ...demo, likes: demo.likes + 1 })
    );
  };

  const handleUpdateTags = async (demoId, tags) => {
    await handleDemoUpdate(
      demoId,
      (id) => updateDemoTags(id, tags),
      (demo) => ({ ...demo, tags })
    );
    const updateList = (list) =>
      list.map((demo) => (demo.id === demoId ? { ...demo, tags } : demo));

    setFilteredDemos(updateList);
    setTrendingDemos(updateList);
    setLatestDemos(updateList);
    setMapDemos((prev) => {
      const updated = {};
      Object.keys(prev).forEach((key) => {
        updated[key] = updateList(prev[key]);
      });
      return updated;
    });
  };

  const handleUpdatePositions = async (demoId, positions) => {
    await handleDemoUpdate(
      demoId,
      (id) => updateDemoPositions(id, positions),
      (demo) => ({ ...demo, positions })
    );
    const updateList = (list) =>
      list.map((demo) => (demo.id === demoId ? { ...demo, positions } : demo));

    setFilteredDemos(updateList);
    setTrendingDemos(updateList);
    setLatestDemos(updateList);
    setPositionDemos((prev) => {
      const updated = {};
      Object.keys(prev).forEach((key) => {
        updated[key] = updateList(prev[key]);
      });
      return updated;
    });
  };

  const recentlyAddedDemos = useMemo(() => {
    if (activeTag === null) {
      return filteredDemos.slice(0, 12);
    } else {
      return filteredDemos.filter((demo) => demo.tags.includes(activeTag));
    }
  }, [activeTag, filteredDemos]);

  // Video selection and navigation
  const onSelectDemo = (demo) => {
    router.push(`/demos/${demo.id}`);
  };

  const onCloseVideoPlayer = () => {
    setSelectedDemo(null);
    setActiveVideoId("");
    setIsVideoPlayerPage(false);
  };

  if (isLoading && !filteredDemos.length) {
    return <LoadingFullscreen />;
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

  if (isVideoPlayerPage && selectedDemo) {
    return (
      <>
        <VideoPlayerPage
          selectedDemo={selectedDemo}
          onClose={onCloseVideoPlayer}
          onLike={handleLikeDemo}
          onOpenTagModal={() => setIsTaggingModalOpen(true)}
          user={user}
          session={session}
        />
        {isTaggingModalOpen && selectedDemo && (
          <TaggingModal
            selectedDemo={selectedDemo}
            filterOptions={filterOptions}
            onClose={() => setIsTaggingModalOpen(false)}
            onUpdateTags={handleUpdateTags}
            onUpdatePositions={handleUpdatePositions}
            user={user}
            session={session}
          />
        )}
      </>
    );
  }

  return (
    <main>
      <div className="min-h-screen bg-gray-950 text-white">
        <style jsx>{`
          .bg-pattern {
            background-image: radial-gradient(
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
            background-size: 20px 20px;
          }
        `}</style>

        <UnderConstructionModal
          isOpen={isUnderConstructionOpen}
          onClose={() => setIsUnderConstructionOpen(false)}
        />

        {filteredDemos.length > 0 && !selectedDemo && (
          <FeaturedHero
            demo={filteredDemos[0]}
            autoplayVideo={autoplayVideo}
            setSelectedDemo={onSelectDemo}
            setActiveVideoId={setActiveVideoId}
            setIsFilterModalOpen={setIsFilterModalOpen}
            user={user}
            session={session}
          />
        )}

        <div className="container mx-auto px-6 pt-8 pb-12 bg-pattern">
          <SelectedFilters
            filtersApplied={filtersApplied}
            setFiltersApplied={setFiltersApplied}
            searchQuery={searchQuery}
          />
          {/* Filter Icon + Tag Bar */}
          <div className="flex items-center gap-2 mb-4">
            <Filter
              onClick={() => setIsFilterModalOpen(true)}
              className="text-yellow-400 cursor-pointer"
            />
            <div className="flex flex-wrap items-center gap-2">
              {dynamicTags.map((tag) => (
                <Tag
                  key={tag}
                  variant="secondary"
                  size="xs"
                  className="cursor-pointer hover:border-yellow-400 transition-colors"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Tag>
              ))}
              <Link
                href="/demos"
                className="text-yellow-400 text-sm underline hover:text-yellow-500 transition-colors"
              >
                View All Demos
              </Link>
            </div>
          </div>
          {/* Category Sections */}
          <CategorySection
            title={activeTag === null ? "Recently Added" : activeTag}
            demos={recentlyAddedDemos}
            onSelectDemo={onSelectDemo}
            onTagClick={handleTagClick}
            user={user}
            session={session}
          />
          {/* Competition Module */}
          <div className="mt-8">
            <CompetitionModule user={user} session={session} />
          </div>
          {/* Plan Comparison Module inserted directly under CompetitionModule */}
          <div className="mt-8">
            <PlanComparisonModule
              currentPlan={currentPlan}
              onUpgrade={handleUpgrade}
              user={user}
              session={session}
            />
          </div>
          {!filtersApplied.map && (
            <>
              <CategorySection
                title="Mirage POVs"
                demos={getFilteredDemosByMap("Mirage")}
                onSelectDemo={onSelectDemo}
                user={user}
                session={session}
              />
              <CategorySection
                title="Inferno POVs"
                demos={getFilteredDemosByMap("Inferno")}
                onSelectDemo={onSelectDemo}
                user={user}
                session={session}
              />
            </>
          )}
          {/* Revised Navigation Cards Below */}
          <section className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Link
                href="/players"
                className="relative block rounded-2xl overflow-hidden shadow-lg group"
              >
                <img
                  src="/images/players-example.png"
                  alt="Players"
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                  <h3 className="text-white text-2xl font-bold group-hover:underline">
                    Players
                  </h3>
                  <p className="text-gray-300">View all players</p>
                </div>
              </Link>
              <Link
                href="/maps"
                className="relative block rounded-2xl overflow-hidden shadow-lg group"
              >
                <img
                  src="/img/maps.png"
                  alt="Maps"
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                  <h3 className="text-white text-2xl font-bold group-hover:underline">
                    Maps
                  </h3>
                  <p className="text-gray-300 text-center">View all maps</p>
                </div>
              </Link>
            </div>
          </section>
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
            onResetFilters={() =>
              setFiltersApplied({
                map: "",
                position: "",
                player: "",
                team: "",
                year: "",
                event: "",
                result: "",
                search: searchQuery,
              })
            }
            onApplyFilters={() => setIsFilterModalOpen(false)}
            user={user}
            session={session}
          />
        )}

        {isTaggingModalOpen && selectedDemo && (
          <TaggingModal
            selectedDemo={selectedDemo}
            filterOptions={filterOptions}
            onClose={() => setIsTaggingModalOpen(false)}
            onUpdateTags={handleUpdateTags}
            onUpdatePositions={handleUpdatePositions}
            user={user}
            session={session}
          />
        )}
      </div>
    </main>
  );
}
