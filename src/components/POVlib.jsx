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
} from '@/lib/supabase';

import DemoCard from './POVlib/DemoCard';
import VideoPlayerPage from './POVlib/VideoPlayerPage';
import TaggingModal from './POVlib/TaggingModal';
import FilterModal from './POVlib/FilterModal';
import Navbar from './POVlib/Navbar';
import Footer from './POVlib/Footer';
import FeaturedHero from './POVlib/FeaturedHero';
import SelectedFilters from './POVlib/SelectedFilters';

// Helper-Funktion zum Mapping eines Demo-Objekts
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

// ────────────────
// CategorySection
// ────────────────
// Diese Komponente rendert eine Kategorie (z. B. "Recently Added" oder "Mirage POVs")
// und zeigt standardmäßig nur eine Zeile (basierend auf dem Container-Bereich).
// Mit "View More" kann der Bereich um eine weitere Zeile erweitert werden.
// Dabei werden immer maximal so viele Videos pro Zeile gezeigt, wie der Container (aber höchstens 5).
const CategorySection = ({ title, demos, onSelectDemo, minCardWidth = 200, maxColumns = 5 }) => {
  const containerRef = useRef(null);
  const [itemsPerRow, setItemsPerRow] = useState(maxColumns);
  const [visibleRows, setVisibleRows] = useState(1);

  // Berechne die Anzahl der Videos pro Zeile anhand der Container-Breite
  useEffect(() => {
    const updateItemsPerRow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const calculated = Math.floor(containerWidth / minCardWidth) || 1;
        setItemsPerRow(Math.min(calculated, maxColumns));
      }
    };

    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);
    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, [minCardWidth, maxColumns]);

  const visibleCount = itemsPerRow * visibleRows;
  const visibleDemos = demos.slice(0, visibleCount);

  // Chunking der sichtbaren Demos in Zeilen
  const rows = [];
  for (let i = 0; i < visibleDemos.length; i += itemsPerRow) {
    rows.push(visibleDemos.slice(i, i + itemsPerRow));
  }

  const canViewMore = demos.length > visibleCount;

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div ref={containerRef} className="overflow-hidden">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 flex-nowrap mb-2">
            {row.map(demo => (
              <div key={demo.id} style={{ minWidth: minCardWidth }} className="flex-shrink-0">
                <DemoCard demo={demo} onSelectDemo={onSelectDemo} />
              </div>
            ))}
          </div>
        ))}
      </div>
      {canViewMore && (
        <div className="mt-2">
          <button
            onClick={() => setVisibleRows(visibleRows + 1)}
            className="text-yellow-400 text-sm underline"
          >
            View More
          </button>
        </div>
      )}
    </section>
  );
};

const POVlib = () => {
  // UI States
  const [searchActive, setSearchActive] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoId, setActiveVideoId] = useState('');
  const [demoType, setDemoType] = useState('pro');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [autoplayVideo, setAutoplayVideo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoPlayerPage, setIsVideoPlayerPage] = useState(false);

  // Data States
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

  // Dynamische Tags (wie zuvor)
  const dynamicTags = useMemo(() => {
    const tagsSet = new Set();
    filteredDemos.forEach(demo => {
      demo.tags.forEach(tag => tagsSet.add(tag));
    });
    tagsSet.add("Karten");
    tagsSet.add("Spieler");
    tagsSet.add("Teams");
    tagsSet.add("Karte + CT Position");
    return Array.from(tagsSet);
  }, [filteredDemos]);

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setFiltersApplied(prev => ({ ...prev, search: tag }));
  };

  // Helper-Funktionen für Map/Positions-Filter
  const getFilteredDemosByMap = useCallback(
    (map) => mapDemos[map] || [],
    [mapDemos]
  );
  const getFilteredDemosByPosition = useCallback(
    (position) => positionDemos[position] || [],
    [positionDemos]
  );

  // Laden der Initialdaten
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

  // Aktualisierung gefilterter Demos bei Änderung von Filtern oder Suchbegriff
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

  // Laden von Map- und Positions-Demos (wie zuvor)
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

  // Update der Views bei Demo-Auswahl
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

  // Video-Auswahl und Navigation
  const onSelectDemo = (demo) => {
    setSelectedDemo(demo);
    setActiveVideoId(demo.videoId);
    setIsVideoPlayerPage(true);
    window.scrollTo(0, 0);
  };

  const onCloseVideoPlayer = () => {
    setSelectedDemo(null);
    setActiveVideoId('');
    setIsVideoPlayerPage(false);
  };

  if (isLoading && !filteredDemos.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading POVlib data...</p>
        </div>
      </div>
    );
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
      
      <main className="container mx-auto px-6 py-12 bg-pattern">
        <SelectedFilters 
          filtersApplied={filtersApplied} 
          setFiltersApplied={setFiltersApplied} 
          searchQuery={searchQuery} 
        />
        
        {/* Dynamische Tag-Leiste */}
        <div className="my-4 flex flex-wrap items-center gap-2">
          {dynamicTags.map(tag => (
            <button 
              key={tag} 
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-yellow-400/20 transition-colors"
            >
              {tag}
            </button>
          ))}
          <Link href="/demos" className="text-yellow-400 text-sm underline ml-2">
            Alle Demos
          </Link>
        </div>
        
        {/* Kategorieabschnitte als feste Karten mit "View More"-Funktion */}
        <CategorySection 
          title="Recently Added" 
          demos={filteredDemos} 
          onSelectDemo={onSelectDemo} 
        />
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
        {!filtersApplied.position && (
          <CategorySection 
            title="AWP Plays" 
            demos={getFilteredDemosByPosition("AWPer")} 
            onSelectDemo={onSelectDemo} 
          />
        )}
        
        {/* Untere Navigationskarten */}
        <section className="mt-16 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href="/players"
              className="flex items-center justify-center rounded-xl border border-gray-700 hover:border-yellow-400/30 bg-gradient-to-br from-gray-800 to-gray-900 p-6 transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 hover:bg-yellow-400/20 border-2 border-yellow-400/30 mb-4 flex items-center justify-center">
                  <span className="text-yellow-400 text-3xl font-bold">P</span>
                </div>
                <h3 className="text-white font-bold mb-1">Players</h3>
                <p className="text-gray-400 text-sm">View all players</p>
              </div>
            </Link>
            <Link
              href="/maps"
              className="flex items-center justify-center rounded-xl border border-gray-700 hover:border-yellow-400/30 bg-gradient-to-br from-gray-800 to-gray-900 p-6 transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 hover:bg-yellow-400/20 border-2 border-yellow-400/30 mb-4 flex items-center justify-center">
                  <span className="text-yellow-400 text-3xl font-bold">M</span>
                </div>
                <h3 className="text-white font-bold mb-1">Maps</h3>
                <p className="text-gray-400 text-sm">View all maps</p>
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
