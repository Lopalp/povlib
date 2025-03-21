'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import DemoCarousel from './POVlib/DemoCarousel';
import MapGrid from './POVlib/MapGrid';
import Footer from './POVlib/Footer';
import FeaturedHero from './POVlib/FeaturedHero';
import SelectedFilters from './POVlib/SelectedFilters';
import ContentTabs from './POVlib/ContentTabs';
import PlayerCard from './POVlib/PlayerCard';

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
  const [activeTab, setActiveTab] = useState('all');
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
  const [relatedDemos, setRelatedDemos] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
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
    search: ''
  });
  
  const scrollContainerRef = useRef(null);
  const featuredVideoRef = useRef(null);
  
  // Helper-Funktionen
  const getFilteredDemosByMap = (map) => mapDemos[map] || [];
  const getFilteredDemosByPosition = (position) => positionDemos[position] || [];
  
  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const options = await getFilterOptions();
        setFilterOptions(options);
        
        const demos = await getFilteredDemos(filtersApplied, demoType);
        const mappedDemos = demos.map(demo => ({
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
        }));
        setFilteredDemos(mappedDemos);
        
        const trendingData = await getTrendingDemos(5, demoType);
        setTrendingDemos(trendingData.map(demo => ({
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
        })));
        
        const latestData = await getLatestDemos(5, demoType);
        setLatestDemos(latestData.map(demo => ({
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
        })));
        
        // Load top players
        if (options.players && options.players.length > 0) {
          const playerPromises = options.players.slice(0, 5).map(async (playerName) => {
            try {
              return await getPlayerInfo(playerName);
            } catch (err) {
              console.error(`Error loading player info for ${playerName}:`, err);
              return null;
            }
          });
          
          const playerResults = await Promise.all(playerPromises);
          setTopPlayers(playerResults.filter(Boolean));
        }
        
        if (mappedDemos.length > 0) {
          setActiveVideoId(mappedDemos[0].videoId);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [demoType]);
  
  // Update filtered demos when filters change
  useEffect(() => {
    const updateFilteredDemos = async () => {
      try {
        setIsLoading(true);
        const demos = await getFilteredDemos({ ...filtersApplied, search: searchQuery }, demoType);
        const mappedDemos = demos.map(demo => ({
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
        }));
        setFilteredDemos(mappedDemos);
        setIsLoading(false);
      } catch (err) {
        console.error('Error updating filtered demos:', err);
        setError('Failed to update data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    updateFilteredDemos();
  }, [filtersApplied, searchQuery, demoType]);
  
  // Load map demos
  useEffect(() => {
    const loadMapDemos = async (map) => {
      if (!mapDemos[map]) {
        try {
          const demos = await getDemosByMap(map);
          const mappedDemos = demos.map(demo => ({
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
          }));
          setMapDemos(prev => ({ ...prev, [map]: mappedDemos }));
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
  
  // Load position demos
  useEffect(() => {
    const loadPositionDemos = async (position) => {
      if (!positionDemos[position]) {
        try {
          const demos = await getDemosByPosition(position);
          const mappedDemos = demos.map(demo => ({
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
          }));
          setPositionDemos(prev => ({ ...prev, [position]: mappedDemos }));
        } catch (err) {
          console.error(`Error loading demos for position ${position}:`, err);
        }
      }
    };
    if (!filtersApplied.position) {
      loadPositionDemos('AWPer');
    }
  }, [positionDemos, filtersApplied.position]);
  
  // Find related demos when a demo is selected
  useEffect(() => {
    if (selectedDemo) {
      // Find demos with same map or same players or same positions
      const related = filteredDemos.filter(demo => 
        demo.id !== selectedDemo.id && (
          demo.map === selectedDemo.map || 
          demo.players.some(p => selectedDemo.players.includes(p)) ||
          demo.positions.some(p => selectedDemo.positions.includes(p))
        )
      );
      
      // If we don't have enough related demos, add some from trending
      if (related.length < 5) {
        const additionalDemos = trendingDemos.filter(
          demo => demo.id !== selectedDemo.id && !related.some(r => r.id === demo.id)
        ).slice(0, 5 - related.length);
        
        setRelatedDemos([...related, ...additionalDemos]);
      } else {
        setRelatedDemos(related.slice(0, 10)); // Limit to 10 related demos
      }
    }
  }, [selectedDemo, filteredDemos, trendingDemos]);
  
  // Update views when a demo is selected
  useEffect(() => {
    const updateViews = async () => {
      if (selectedDemo) {
        try {
          const result = await updateDemoStats(selectedDemo.id, 'views', 1);
          if (result.success) {
            setFilteredDemos(prev => 
              prev.map(demo => demo.id === selectedDemo.id ? { ...demo, views: demo.views + 1 } : demo)
            );
            if (trendingDemos.some(demo => demo.id === selectedDemo.id)) {
              setTrendingDemos(prev => 
                prev.map(demo => demo.id === selectedDemo.id ? { ...demo, views: demo.views + 1 } : demo)
              );
            }
            if (latestDemos.some(demo => demo.id === selectedDemo.id)) {
              setLatestDemos(prev => 
                prev.map(demo => demo.id === selectedDemo.id ? { ...demo, views: demo.views + 1 } : demo)
              );
            }
            Object.keys(mapDemos).forEach(map => {
              if (mapDemos[map].some(demo => demo.id === selectedDemo.id)) {
                setMapDemos(prev => ({
                  ...prev,
                  [map]: prev[map].map(demo => demo.id === selectedDemo.id ? { ...demo, views: demo.views + 1 } : demo)
                }));
              }
            });
            Object.keys(positionDemos).forEach(position => {
              if (positionDemos[position].some(demo => demo.id === selectedDemo.id)) {
                setPositionDemos(prev => ({
                  ...prev,
                  [position]: prev[position].map(demo => demo.id === selectedDemo.id ? { ...demo, views: demo.views + 1 } : demo)
                }));
              }
            });
          }
        } catch (err) {
          console.error('Error updating views:', err);
        }
      }
    };
    updateViews();
  }, [selectedDemo]);
  
  // Handler-Funktionen (Like, Update Tags/Positions)
  const handleLikeDemo = async (demoId) => {
    try {
      const result = await updateDemoStats(demoId, 'likes', 1);
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
          isPro: result.demo.is_pro
        };
        setFilteredDemos(prev => 
          prev.map(demo => demo.id === demoId ? { ...demo, likes: updatedDemo.likes } : demo)
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, likes: updatedDemo.likes });
        }
      }
    } catch (err) {
      console.error('Error liking demo:', err);
    }
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
          isPro: result.demo.is_pro
        };
        setFilteredDemos(prev => 
          prev.map(demo => demo.id === demoId ? { ...demo, tags: updatedDemo.tags } : demo)
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
          isPro: result.demo.is_pro
        };
        setFilteredDemos(prev => 
          prev.map(demo => demo.id === demoId ? { ...demo, positions: updatedDemo.positions } : demo)
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, positions: updatedDemo.positions });
        }
      }
    } catch (err) {
      console.error('Error updating positions:', err);
    }
  };
  
  // Custom Scroll Handling
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 300;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  // Video selection and navigation
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
  
  const onSelectRelatedDemo = (demo) => {
    setSelectedDemo(demo);
    setActiveVideoId(demo.videoId);
    window.scrollTo(0, 0);
  };
  
  const onSwitchDemoType = (type) => setDemoType(type);
  const onResetFilters = () => setFiltersApplied({
    map: '',
    position: '',
    player: '',
    team: '',
    year: '',
    event: '',
    result: '',
    search: searchQuery
  });
  const onApplyFilters = () => setIsFilterModalOpen(false);
  
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
  
  // If we're in video player mode, render the video player page
  if (isVideoPlayerPage && selectedDemo) {
    return (
      <>
        <VideoPlayerPage 
          selectedDemo={selectedDemo}
          relatedDemos={relatedDemos}
          onClose={onCloseVideoPlayer}
          onLike={handleLikeDemo}
          onOpenTagModal={() => setIsTaggingModalOpen(true)}
          onSelectRelatedDemo={onSelectRelatedDemo}
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
        onSwitchDemoType={onSwitchDemoType}
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
        <SelectedFilters filtersApplied={filtersApplied} setFiltersApplied={setFiltersApplied} searchQuery={searchQuery} />
        <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {isLoading && (
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
        )}
        
        {!isLoading && activeTab === 'all' && (
          <>
            <DemoCarousel 
              title="Recently Added"
              demos={filteredDemos}
              description="Latest POV demos based on your filter criteria"
              onSelectDemo={onSelectDemo}
              handleScroll={handleScroll}
            />
            {!filtersApplied.map && (
              <>
                <DemoCarousel 
                  title="Mirage POVs" 
                  demos={getFilteredDemosByMap("Mirage")} 
                  onSelectDemo={onSelectDemo}
                  handleScroll={handleScroll}
                />
                <DemoCarousel 
                  title="Inferno POVs" 
                  demos={getFilteredDemosByMap("Inferno")} 
                  onSelectDemo={onSelectDemo}
                  handleScroll={handleScroll}
                />
              </>
            )}
            {!filtersApplied.position && (
              <DemoCarousel 
                title="AWP Plays" 
                demos={getFilteredDemosByPosition("AWPer")} 
                onSelectDemo={onSelectDemo}
                handleScroll={handleScroll}
              />
            )}
          </>
        )}
        
        {!isLoading && activeTab === 'trending' && (
          <DemoCarousel 
            title="Trending POVs"
            demos={trendingDemos}
            description="Most viewed demos right now"
            onSelectDemo={onSelectDemo}
            handleScroll={handleScroll}
          />
        )}
        
        {!isLoading && activeTab === 'latest' && (
          <DemoCarousel 
            title="Latest Uploads"
            demos={latestDemos}
            description="Fresh POV content from this year"
            onSelectDemo={onSelectDemo}
            handleScroll={handleScroll}
          />
        )}
        
        {!isLoading && activeTab === 'awp' && (
          <DemoCarousel 
            title="AWP Highlights"
            demos={getFilteredDemosByPosition("AWPer")}
            description="Best AWP plays from top players"
            onSelectDemo={onSelectDemo}
            handleScroll={handleScroll}
          />
        )}
        
        {!isLoading && activeTab === 'rifle' && (
          <DemoCarousel 
            title="Rifle Plays"
            demos={filteredDemos.filter(demo => 
              demo.tags.some(tag => tag.includes('Rifle')) || 
              demo.positions.some(pos => !pos.includes('AWP'))
            )}
            description="Top rifle gameplay and positioning"
            onSelectDemo={onSelectDemo}
            handleScroll={handleScroll}
          />
        )}
        
        {/* Featured Players Section */}
        {topPlayers.length > 0 && (
          <div className="mt-16 mb-12">
            <h2 className="text-2xl font-bold text-white mb-8">
              <span className="border-l-4 border-yellow-400 pl-3 py-1">Top Players</span>
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {topPlayers.map(player => (
                <PlayerCard 
                  key={player.name}
                  player={player}
                  demoCount={player.stats?.totalDemos}
                  viewCount={player.stats?.totalViews}
                />
              ))}
              
              <Link
                href="/players"
                className="flex items-center justify-center rounded-xl border border-gray-700 hover:border-yellow-400/30 bg-gradient-to-br from-gray-800 to-gray-900 p-6 transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-800 hover:bg-yellow-400/20 border-2 border-yellow-400/30 mb-4 flex items-center justify-center">
                    <span className="text-yellow-400 text-3xl font-bold">+</span>
                  </div>
                  <h3 className="text-white font-bold mb-1">View All Players</h3>
                  <p className="text-gray-400 text-sm">Browse the complete list</p>
                </div>
              </Link>
            </div>
          </div>
        )}
        
        {/* Map Grid */}
        <MapGrid 
          filterOptions={filterOptions} 
          getFilteredDemosByMap={getFilteredDemosByMap} 
          setFiltersApplied={setFiltersApplied} 
        />

        {/* Browse All Demos Button */}
        <div className="text-center py-8">
          <Link href="/demos" className="inline-block px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
            Browse All Demos
          </Link>
        </div>
      </main>
      
      {isFilterModalOpen && (
        <FilterModal 
          demoType={demoType}
          filterOptions={filterOptions}
          filtersApplied={filtersApplied}
          onClose={() => setIsFilterModalOpen(false)}
          onFilterChange={(changed) => setFiltersApplied(prev => ({ ...prev, ...changed }))}
          onResetFilters={onResetFilters}
          onApplyFilters={onApplyFilters}
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