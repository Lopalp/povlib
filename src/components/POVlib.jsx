// components/POVlib/POVlib.jsx
'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, X, Menu } from 'lucide-react';
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
  getPlayerInfo
} from '../lib/supabase';
import { useRouter } from 'next/navigation';
import VideoPlayerPage from './POVlib/VideoPlayerPage';
import TaggingModal from './POVlib/TaggingModal';
import FilterModal from './POVlib/FilterModal';
import Navbar from './POVlib/Navbar';
import Footer from './POVlib/Footer';
import CompetitionModule from './POVlib/CompetitionModule';
import FeaturedHero from './POVlib/FeaturedHero';
import SelectedFilters from './POVlib/SelectedFilters';
import { CategorySection } from './containers/CategorySection';
import { LoadingFullscreen } from './loading/LoadingFullscreen';
import DemoCard from './POVlib/DemoCard'; // Import DemoCard to pass handleTagClick
import PlanComparisonModule from './POVlib/PlanComparisonModule'; // <-- Plan comparison import

// Helper function for mapping a demo object
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
  isPro: demo.is_pro
});

const POVlib = () => {
  const router = useRouter();

  // -------------------------------
  // Plan state for comparison module
  // -------------------------------
  const [currentPlan, setCurrentPlan] = useState('free'); // default—could come from user profile/API
  const handleUpgrade = (nextPlanKey) => {
    if (!nextPlanKey) {
      // User is already on the highest tier or clicked "Manage Subscription"
      // Implement logic for opening billing portal / subscription management
      console.log('Manage subscription clicked');
      return;
    }
    // Example API call to upgrade plan, then update local state:
    fetch('/api/upgrade-plan', {
      method: 'POST',
      body: JSON.stringify({ newPlan: nextPlanKey }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Upgrade failed');
        return res.json();
      })
      .then((data) => {
        setCurrentPlan(nextPlanKey);
      })
      .catch((err) => {
        console.error(err);
        alert('Upgrade failed. Please try again.');
      });
  };

  // -------------------------------
  // UI States
  // -------------------------------
  const [searchActive, setSearchActive] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);

  const handleTagClick = (tag) => {
    setActiveTag(tag);
  };
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoId, setActiveVideoId] = useState('');
  const [demoType, setDemoType] = useState('pro');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [autoplayVideo, setAutoplayVideo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoPlayerPage, setIsVideoPlayerPage] = useState(false);

  // -------------------------------
  // Data States
  // -------------------------------
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
    players: []
  });
  const [filtersApplied, setFiltersApplied] = useState({
    map: '',
    position: '',
    player: '',
    team: '',
    year: '',
    event: '',
    result: '',
    search: searchQuery
  });

  // Dynamische Tags
  const dynamicTags = useMemo(() => {
    const tagsSet = new Set();
    filteredDemos.forEach(demo => {
      demo.tags.forEach(tag => tagsSet.add(tag));
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

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const options = await getFilterOptions();
        setFilterOptions(options);

        const [demos, trending, latest] = await Promise.all([
          getFilteredDemos(filtersApplied, demoType),
          getTrendingDemos(5, demoType),
          getLatestDemos(5, demoType)
        ]);

        const mappedDemos = demos.map(mapDemo);
        setFilteredDemos(mappedDemos);
        if (mappedDemos.length > 0) setActiveVideoId(mappedDemos[0].videoId);
        setTrendingDemos(trending.map(mapDemo));
        setLatestDemos(latest.map(mapDemo));

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load data. Please try again later.');
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [demoType]);

  // Update filtered demos
  useEffect(() => {
    const updateFilteredDemos = async () => {
      try {
        setIsLoading(true);
        const demos = await getFilteredDemos({ ...filtersApplied, search: searchQuery }, demoType);
        setFilteredDemos(demos.map(mapDemo));
        setIsLoading(false);
      } catch (err) {
        console.error('Error updating filtered demos:', err);
        setError('Failed to update data. Please try again later.');
        setIsLoading(false);
      }
    };
    updateFilteredDemos();
  }, [filtersApplied, searchQuery, demoType]);

  // Load Map demos
  useEffect(() => {
    const loadMapDemos = async (map) => {
      if (!mapDemos[map]) {
        try {
          const demos = await getDemosByMap(map);
          setMapDemos(prev => ({ ...prev, [map]: demos.map(mapDemo) }));
        } catch (err) {
          console.error(`Error loading demos for map ${map}:`, err);
        }
      }
    };
    if (!filtersApplied.map) {
      loadMapDemos('Mirage');
      loadMapDemos('Inferno');
    }
  }, [mapDemos, filtersApplied.map]);

  // Load Position demos
  useEffect(() => {
    const loadPositionDemos = async (position) => {
      if (!positionDemos[position]) {
        try {
          const demos = await getDemosByPosition(position);
          setPositionDemos(prev => ({ ...prev, [position]: demos.map(mapDemo) }));
        } catch (err) {
          console.error(`Error loading demos for position ${position}:`, err);
        }
      }
    };
    if (!filtersApplied.position) {
      loadPositionDemos('AWPer');
    }
  }, [positionDemos, filtersApplied.position]);

  // Update views on demo selection
  useEffect(() => {
    if (selectedDemo) {
      const updateViews = async () => {
        try {
          const result = await updateDemoStats(selectedDemo.id, 'views', 1);
          if (result.success) {
            const updateList = (list) =>
              list.map(demo =>
                demo.id === selectedDemo.id ? { ...demo, views: demo.views + 1 } : demo
              );
            setFilteredDemos(prev => updateList(prev));
          }
        } catch (err) {
          console.error('Error updating views:', err);
        }
      };
      updateViews();
    }
  }, [selectedDemo]);

  const handleDemoUpdate = async (demoId, updateFn, updater) => {
    try {
      const result = await updateFn(demoId, updater);
      if (result.success) {
        const updatedDemo = mapDemo(result.demo);
        const updateList = (list) =>
          list.map(demo => demo.id === demoId ? { ...demo, ...updatedDemo } : demo);
        setFilteredDemos(prev => updateList(prev));
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, ...updatedDemo });
        }
      }
    } catch (err) {
      console.error(`Error updating demo ${demoId}:`, err);
    }
  };

  const handleLikeDemo = async (demoId) => {
    await handleDemoUpdate(demoId, updateDemoStats, { field: 'likes', increment: 1 });
  };

  const handleUpdateTags = async (demoId, tags) => {
    try {
      const result = await updateDemoTags(demoId, tags);
      if (result.success) {
        const updatedDemo = mapDemo(result.demo);
        const updateList = (list) =>
          list.map(demo => demo.id === demoId ? { ...demo, tags: updatedDemo.tags } : demo);
        setFilteredDemos(prev => updateList(prev));
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, tags: updatedDemo.tags });
        }
        setIsTaggingModalOpen(false);
      }
    } catch (err) {
      console.error('Error updating tags:', err);
    }
  };

  const handleUpdatePositions = async (demoId, positions) => {
    try {
      const result = await updateDemoPositions(demoId, positions);
      if (result.success) {
        const updatedDemo = mapDemo(result.demo);
        const updateList = (list) =>
          list.map(demo => demo.id === demoId ? { ...demo, positions: updatedDemo.positions } : demo);
        setFilteredDemos(prev => updateList(prev));
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, positions: updatedDemo.positions });
        }
      }
    } catch (err) {
      console.error('Error updating positions:', err);
    }
  };

  const recentlyAddedDemos = useMemo(() => {
    if (activeTag === null) {
      return filteredDemos.slice(0, 12);
    } else {
      return filteredDemos.filter(demo => demo.tags.includes(activeTag));
    }
  }, [activeTag, filteredDemos]);

  // Video selection and navigation
  const onSelectDemo = (demo) => {
    router.push(`/demos/${demo.id}`);
  };

  const onCloseVideoPlayer = () => {
    setSelectedDemo(null);
    setActiveVideoId('');
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
          <h2 className="text-white text-2xl font-bold mb-2">Error Loading Data</h2>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200">
      <style jsx>{`
        .bg-pattern {
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      <Navbar
        demoType={demoType}
        onSwitchDemoType={setDemoType}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      />

      {filteredDemos.length > 0 && !selectedDemo && (
        <FeaturedHero
          demo={filteredDemos[0]}
          autoplayVideo={autoplayVideo}
          setSelectedDemo={onSelectDemo}
          setActiveVideoId={setActiveVideoId}
          setIsFilterModalOpen={setIsFilterModalOpen}
        />
      )}

      <main className="container mx-auto px-6 py-6 bg-pattern">
        <SelectedFilters
          filtersApplied={filtersApplied}
          setFiltersApplied={setFiltersApplied}
          searchQuery={searchQuery}
        />

        {/* Filter Icon + Tag Bar */}
        <div className="flex items-center gap-2 mb-2">
          <Filter
            onClick={() => setIsFilterModalOpen(true)}
            className="text-yellow-400 cursor-pointer"
          />
          <div className="flex flex-wrap items-center gap-2">
            {dynamicTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-yellow-400/20 transition-colors"
              >
                {tag}
              </button>
            ))}
            <Link href="/demos" className="text-yellow-400 text-sm underline hover:text-yellow-500 transition-colors">
              View All Demos
            </Link>
          </div>
        </div>

        {/* Category Sections */}
        <CategorySection
          title={activeTag === null ? 'Recently Added' : activeTag}
          demos={recentlyAddedDemos}
          onSelectDemo={onSelectDemo}
          onTagClick={handleTagClick}
        />

        {/* Competition Module */}
        <CompetitionModule />

        {/* Plan Comparison Module inserted directly under CompetitionModule */}
        <div className="mt-8">
          <PlanComparisonModule currentPlan={currentPlan} onUpgrade={handleUpgrade} />
        </div>

        {!filtersApplied.map && (
          <>
            <CategorySection
              title="Mirage POVs"
              demos={getFilteredDemosByMap("Mirage")}
              onSelectDemo={onSelectDemo}
            />
            <CategorySection
              title="Inferno POVs"
              demos={getFilteredDemosByMap("Inferno")}
              onSelectDemo={onSelectDemo}
            />
          </>
        )}

        {/* Revised Navigation Cards Below - Use the template image you had for Maps here */}
        <section className="mt-8 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href="/players" className="relative block rounded-xl overflow-hidden group">
              <img
                src="/images/players-example.png"
                alt="Players"
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                <h3 className="text-white text-2xl font-bold group-hover:underline">Players</h3>
                <p className="text-gray-300">View all players</p>
              </div>
            </Link>
            <Link href="/maps" className="relative block rounded-xl overflow-hidden group">
              <img
                src="/images/maps-example.png"
                alt="Maps"
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                <h3 className="text-white text-2xl font-bold group-hover:underline">Maps</h3>
                <p className="text-gray-300 text-center">View all maps</p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {isFilterModalOpen && (
        <FilterModal
          demoType={demoType}
          filterOptions={filterOptions}
          filtersApplied={filtersApplied}
          onClose={() => setIsFilterModalOpen(false)}
          onFilterChange={(changed) => setFiltersApplied(prev => ({ ...prev, ...changed }))}
          onResetFilters={() => setFiltersApplied({
              map: '',
              position: '',
              player: '',
              team: '',
              year: '',
              event: '',
              result: '',
              search: searchQuery
            })}
          onApplyFilters={() => setIsFilterModalOpen(false)}
        />
      )}

      {isTaggingModalOpen && selectedDemo && (
        <TaggingModal
          selectedDemo={selectedDemo}
          filterOptions={filterOptions}
          onClose={() => setIsTaggingModalOpen(false)}
          onUpdateTags={handleUpdateTags}
          onUpdatePositions={handleUpdatePositions}
        />
      )}

      <Footer />
    </div>
  );
};

export default POVlib;
