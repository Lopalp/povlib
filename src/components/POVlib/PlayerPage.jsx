'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Filter, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Navbar from './Navbar';
import Footer from './Footer';
import DemoCard from './DemoCard';
import VideoPlayerPage from './VideoPlayerPage';
import TaggingModal from './TaggingModal';
import FilterModal from './FilterModal';

// Die neuen Module:
import CategorySection from './containers/CategorySection';
import CategorySectionFeatured from './containers/CategorySectionFeatured';
import CategoryCarousel from './containers/CategoryCarousel';

import {
  getPlayerInfo,
  getDemosByPlayer,
  getFilterOptions,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions
} from '@/lib/supabase';

// Hilfsfunktion, um Demos nach einer Eigenschaft zu gruppieren
const groupDemosByProperty = (demos, property) => {
  return demos.reduce((acc, demo) => {
    const key = demo[property] || 'Unbekannt';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(demo);
    return acc;
  }, {});
};

const PlayerPage = ({ playerName }) => {
  const router = useRouter();
  const [player, setPlayer] = useState(null);
  const [allDemos, setAllDemos] = useState([]);
  const [demosByMap, setDemosByMap] = useState({});
  const [demosByEvent, setDemosByEvent] = useState({});
  const [demosByYear, setDemosByYear] = useState({});
  const [trendingDemos, setTrendingDemos] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState('');
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [demoType, setDemoType] = useState('all');
  const [filtersApplied, setFiltersApplied] = useState({
    map: '',
    position: '',
    team: '',
    year: '',
    event: '',
    result: '',
  });
  const [relatedDemos, setRelatedDemos] = useState([]);
  const [isFullScreenPlayer, setIsFullScreenPlayer] = useState(false);

  const infiniteScrollRef = useRef(null);

  // Lade Spieler- und Demo-Daten
  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        setIsLoading(true);

        // Filter-Optionen laden
        const options = await getFilterOptions();
        setFilterOptions(options);

        // Spieler-Info laden
        const playerData = await getPlayerInfo(playerName);
        if (!playerData) {
          setError('Player not found');
          setIsLoading(false);
          return;
        }
        setPlayer(playerData);

        // Erste Seite Demos laden
        const demosData = await getDemosByPlayer(playerName, demoType, 1, 12, filtersApplied);
        if (!demosData || demosData.length === 0) {
          setAllDemos([]);
          setHasMore(false);
          setIsLoading(false);
          return;
        }
        const mappedDemos = demosData.map(mapDemoData);
        setAllDemos(mappedDemos);

        // Demos gruppieren
        setDemosByMap(groupDemosByProperty(mappedDemos, 'map'));
        setDemosByEvent(groupDemosByProperty(mappedDemos, 'event'));
        setDemosByYear(groupDemosByProperty(mappedDemos, 'year'));

        // Trending-Demos nach Views sortieren (Top 5)
        const sorted = [...mappedDemos].sort((a, b) => b.views - a.views);
        setTrendingDemos(sorted.slice(0, 5));

        setHasMore(demosData.length === 12);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading player data:', err);
        setError('Failed to load player data. Please try again later.');
        setIsLoading(false);
      }
    };

    loadPlayerData();
  }, [playerName, demoType, filtersApplied]);

  // Hilfsfunktion: Rohdaten in gewünschtes Objekt umwandeln
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
    isPro: demo.is_pro
  });

  // Weitere Demos laden (Infinite Scroll)
  const loadMoreDemos = async () => {
    if (!hasMore || isLoading) return;
    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const demosData = await getDemosByPlayer(playerName, demoType, nextPage, 12, filtersApplied);
      if (!demosData || demosData.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      const mappedDemos = demosData.map(mapDemoData);
      setAllDemos(prev => [...prev, ...mappedDemos]);

      // Aktualisiere Gruppierungen
      const updatedByMap = { ...demosByMap };
      const updatedByEvent = { ...demosByEvent };
      const updatedByYear = { ...demosByYear };
      mappedDemos.forEach(demo => {
        // Map
        if (!updatedByMap[demo.map]) updatedByMap[demo.map] = [];
        updatedByMap[demo.map].push(demo);
        // Event
        if (demo.event) {
          if (!updatedByEvent[demo.event]) updatedByEvent[demo.event] = [];
          updatedByEvent[demo.event].push(demo);
        }
        // Year
        if (!updatedByYear[demo.year]) updatedByYear[demo.year] = [];
        updatedByYear[demo.year].push(demo);
      });
      setDemosByMap(updatedByMap);
      setDemosByEvent(updatedByEvent);
      setDemosByYear(updatedByYear);

      setPage(nextPage);
      setHasMore(demosData.length === 12);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading more demos:', err);
      setIsLoading(false);
    }
  };

  // IntersectionObserver für Infinite Scroll
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

  // Handler: Demo auswählen (startet VideoPlayer)
  const handleSelectDemo = (demo) => {
    setSelectedDemo(demo);
    setActiveVideoId(demo.videoId);
    setIsFullScreenPlayer(true);
    findRelatedDemos(demo);
    updateDemoStats(demo.id, 'views', 1).catch((err) =>
      console.error('Error updating views:', err)
    );
    window.scrollTo(0, 0);
  };

  // Verwandte Demos finden
  const findRelatedDemos = (demo) => {
    const related = allDemos.filter(
      (d) =>
        d.id !== demo.id &&
        (d.map === demo.map ||
          d.players.some((p) => demo.players.includes(p)) ||
          d.positions.some((pos) => demo.positions.includes(pos)))
    );
    setRelatedDemos(related.slice(0, 10));
  };

  // VideoPlayer schließen
  const handleCloseVideoPlayer = () => {
    setSelectedDemo(null);
    setActiveVideoId('');
    setIsFullScreenPlayer(false);
    setRelatedDemos([]);
  };

  // Demo liken
  const handleLikeDemo = async (demoId) => {
    try {
      const result = await updateDemoStats(demoId, 'likes', 1);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        // allDemos aktualisieren
        setAllDemos((prev) =>
          prev.map((d) => (d.id === demoId ? { ...d, likes: updatedDemo.likes } : d))
        );
        // Falls aktuell ausgewählt, ebenfalls updaten
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, likes: updatedDemo.likes });
        }
      }
    } catch (err) {
      console.error('Error liking demo:', err);
    }
  };

  // Tags aktualisieren
  const handleUpdateTags = async (demoId, tags) => {
    try {
      const result = await updateDemoTags(demoId, tags);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setAllDemos((prev) =>
          prev.map((d) => (d.id === demoId ? { ...d, tags: updatedDemo.tags } : d))
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, tags: updatedDemo.tags });
        }
        setIsTaggingModalOpen(false);
      }
    } catch (err) {
      console.error('Error updating tags:', err);
    }
  };

  // Positionen aktualisieren
  const handleUpdatePositions = async (demoId, positions) => {
    try {
      const result = await updateDemoPositions(demoId, positions);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setAllDemos((prev) =>
          prev.map((d) => (d.id === demoId ? { ...d, positions: updatedDemo.positions } : d))
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, positions: updatedDemo.positions });
        }
      }
    } catch (err) {
      console.error('Error updating positions:', err);
    }
  };

  const handleSwitchDemoType = (type) => setDemoType(type);

  const handleResetFilters = () =>
    setFiltersApplied({
      map: '',
      position: '',
      team: '',
      year: '',
      event: '',
      result: '',
    });
  const handleApplyFilters = () => setIsFilterModalOpen(false);

  const handleSelectRelatedDemo = (demo) => {
    setSelectedDemo(demo);
    setActiveVideoId(demo.videoId);
    findRelatedDemos(demo);
    updateDemoStats(demo.id, 'views', 1).catch((err) =>
      console.error('Error updating views:', err)
    );
    window.scrollTo(0, 0);
  };

  // Lade-Zustand (fullscreen, bevor Content da ist)
  if (isLoading && !allDemos.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading player data...</p>
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
          <h2 className="text-white text-2xl font-bold mb-2">Error Loading Data</h2>
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

  // Fullscreen-Player anzeigen
  if (isFullScreenPlayer && selectedDemo) {
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
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
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

      {/* Player Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>

        <div className="container mx-auto px-6 pt-12 pb-16 relative z-20">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Player Image */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 overflow-hidden rounded-full border-4 border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
              {player?.avatar ? (
                <img src={player.avatar} alt={playerName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-yellow-400 text-6xl font-bold">
                  {playerName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Player Info */}
            <div className="md:flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{playerName}</h1>

              {player?.team && (
                <div className="inline-flex items-center bg-gray-800/80 px-3 py-1 rounded-full text-yellow-400 text-sm font-medium mb-4">
                  <Shield className="w-4 h-4 mr-2" />
                  {player.team}
                </div>
              )}

              <p className="text-gray-300 mb-6 max-w-2xl">
                {player?.bio ||
                  `Watch the best POV demos from ${playerName}. Analyze positioning, setups, and gameplay to improve your own CS2 skills.`}
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {player?.stats && (
                  <>
                    <div className="bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <div className="text-yellow-400 font-bold text-2xl">
                        {player.stats.totalDemos || allDemos.length}
                      </div>
                      <div className="text-gray-400 text-xs">Total Demos</div>
                    </div>

                    {player.stats.totalViews && (
                      <div className="bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <div className="text-yellow-400 font-bold text-2xl">
                          {player.stats.totalViews.toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-xs">Total Views</div>
                      </div>
                    )}

                    {player.stats.avgRating && (
                      <div className="bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <div className="text-yellow-400 font-bold text-2xl">
                          {player.stats.avgRating}
                        </div>
                        <div className="text-gray-400 text-xs">Avg. Rating</div>
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="px-4 py-2 bg-gray-800/60 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700 border border-gray-700 hover:border-yellow-400/30 transition-all duration-300 flex items-center"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filter POVs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 bg-pattern">
        {/* === 1. Most Popular POVs als Featured-Section === */}
        {trendingDemos.length > 0 && (
          <CategorySectionFeatured
            title="Most Popular POVs"
            demos={trendingDemos}
            onSelectDemo={handleSelectDemo}
            gap={24}
          />
        )}

        {/* === 2. Demos nach Map als Carousel === */}
        {Object.entries(demosByMap).map(([map, demos]) => (
          <div className="mb-16" key={`map-${map}`}>
            <CategoryCarousel
              title={`${map} Demos`}
              demos={demos}
              onSelectDemo={handleSelectDemo}
              gap={24}
            />
          </div>
        ))}

        {/* === 3. Demos nach Event als Carousel === */}
        {Object.entries(demosByEvent)
          .filter(([event]) => event)
          .map(([event, demos]) => (
            <div className="mb-16" key={`event-${event}`}>
              <CategoryCarousel
                title={event}
                demos={demos}
                onSelectDemo={handleSelectDemo}
                gap={24}
              />
            </div>
          ))}

        {/* === 4. Demos nach Year als Carousel === */}
        {Object.entries(demosByYear)
          .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
          .map(([year, demos]) => (
            <div className="mb-16" key={`year-${year}`}>
              <CategoryCarousel
                title={`${year} POVs`}
                demos={demos}
                onSelectDemo={handleSelectDemo}
                gap={24}
              />
            </div>
          ))}

        {/* === 5. All POVs als Grid mit Load More === */}
        <div className="mb-16">
          <CategorySection
            title="All POVs"
            demos={allDemos}
            onSelectDemo={handleSelectDemo}
            minCardWidth={280}
            gap={24}
          />
        </div>
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

export default PlayerPage;
