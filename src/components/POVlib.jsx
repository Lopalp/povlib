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

import YouTubeEmbed from './POVlib/YouTubeEmbed';
import DemoCard from './POVlib/DemoCard';
import VideoPlayerPage from './POVlib/VideoPlayerPage';
import TaggingModal from './POVlib/TaggingModal';
import FilterModal from './POVlib/FilterModal';
import Navbar from './POVlib/Navbar';
import Footer from './POVlib/Footer';
import FeaturedHero from './POVlib/FeaturedHero';
import SelectedFilters from './POVlib/SelectedFilters';
// (ContentTabs und DemoCarousel wurden entfernt)


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
  // (topPlayers wird nicht mehr benötigt, da wir eigene Cards für Players verwenden)
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

  const scrollContainerRef = useRef(null);
  const featuredVideoRef = useRef(null);

  // Dynamische Tags generieren (basierend auf den Demo-Tags und einigen Beispielen)
  const dynamicTags = useMemo(() => {
    const tagsSet = new Set();
    filteredDemos.forEach(demo => {
      demo.tags.forEach(tag => tagsSet.add(tag));
    });
    // Zusätzliche Beispiel-Tags:
    tagsSet.add("Karten");
    tagsSet.add("Spieler");
    tagsSet.add("Teams");
    tagsSet.add("Karte + CT Position");
    return Array.from(tagsSet);
  }, [filteredDemos]);

  // Handler für Klick auf einen Tag (setzt den Suchbegriff oder Filter)
  const handleTagClick = (tag) => {
    // Hier könntest Du differenzierter filtern – beispielhaft setzen wir den Suchbegriff:
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

        // Parallel geladen: gefilterte, trending und neueste Demos
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

  // Aktualisierung der gefilterten Demos bei Änderung von Filtern oder Suchbegriff
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

  // Laden von Map-Demos, falls nicht bereits vorhanden
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

  // Laden von Positions-Demos, falls nicht bereits vorhanden
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

  // Ermittlung verwandter Demos basierend auf ausgewählter Demo
  useEffect(() => {
    if (selectedDemo) {
      const related = filteredDemos.filter(demo =>
        demo.id !== selectedDemo.id &&
        (demo.map === selectedDemo.map ||
          demo.players.some(p => selectedDemo.players.includes(p)) ||
          demo.positions.some(p => selectedDemo.positions.includes(p)))
      );
      // Bei Bedarf können hier weitere Demos aus trending ergänzt werden
      // (vereinfachte Logik)
    }
  }, [selectedDemo, filteredDemos, trendingDemos]);

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

  // Gemeinsame Handler-Funktion für Updates (Likes, Tags, Positions)
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
          // relatedDemos können hier nach Bedarf ergänzt werden
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
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .bg-pattern { background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px; }
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
        
        {/* Demo-Abschnitte als feste Karten */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <section className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Recently Added</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredDemos.map(demo => (
                  <DemoCard key={demo.id} demo={demo} onSelectDemo={onSelectDemo} />
                ))}
              </div>
            </section>
            
            {!filtersApplied.map && (
              <>
                <section className="mt-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Mirage POVs</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {getFilteredDemosByMap("Mirage").map(demo => (
                      <DemoCard key={demo.id} demo={demo} onSelectDemo={onSelectDemo} />
                    ))}
                  </div>
                </section>
                <section className="mt-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Inferno POVs</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {getFilteredDemosByMap("Inferno").map(demo => (
                      <DemoCard key={demo.id} demo={demo} onSelectDemo={onSelectDemo} />
                    ))}
                  </div>
                </section>
              </>
            )}
            
            {!filtersApplied.position && (
              <section className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">AWP Plays</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {getFilteredDemosByPosition("AWPer").map(demo => (
                    <DemoCard key={demo.id} demo={demo} onSelectDemo={onSelectDemo} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
        
        {/* Statt des bisherigen Browse-Buttons und der unteren Bereiche:
            Zwei Karten, eine für Players und eine für Maps */}
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
