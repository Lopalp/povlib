'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Shield, Trophy, MapPin, Clock, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import DemoCard from './DemoCard';
import VideoPlayerPage from './VideoPlayerPage';
import TaggingModal from './TaggingModal';
import FilterModal from './FilterModal';

import {
  getPlayerInfo,
  getDemosByPlayer,
  getFilterOptions,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions
} from '@/lib/supabase';

// Helper function to group demos by a property
const groupDemosByProperty = (demos, property) => {
  return demos.reduce((acc, demo) => {
    const key = demo[property];
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
  
  // Load player info and initial demos
  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        setIsLoading(true);
        
        // Load filter options first
        const options = await getFilterOptions();
        setFilterOptions(options);
        
        // Load player info
        const playerData = await getPlayerInfo(playerName);
        if (!playerData) {
          setError('Player not found');
          setIsLoading(false);
          return;
        }
        setPlayer(playerData);
        
        // Load initial set of demos
        const demosData = await getDemosByPlayer(playerName, demoType, 1, 12, filtersApplied);
        if (!demosData || demosData.length === 0) {
          setAllDemos([]);
          setHasMore(false);
          setIsLoading(false);
          return;
        }
        
        const mappedDemos = demosData.map(mapDemoData);
        setAllDemos(mappedDemos);
        
        // Group demos by properties
        setDemosByMap(groupDemosByProperty(mappedDemos, 'map'));
        setDemosByEvent(groupDemosByProperty(mappedDemos, 'event'));
        setDemosByYear(groupDemosByProperty(mappedDemos, 'year'));
        
        // Sort trending demos by views
        const sorted = [...mappedDemos].sort((a, b) => b.views - a.views);
        setTrendingDemos(sorted.slice(0, 5));
        
        setHasMore(demosData.length === 12); // If we got 12 demos, there might be more
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading player data:', err);
        setError('Failed to load player data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    loadPlayerData();
  }, [playerName, demoType, filtersApplied]);
  
  // Helper function to map demo data
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
  
  // Load more demos as user scrolls
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
      
      // Update grouped demos
      const updatedByMap = { ...demosByMap };
      const updatedByEvent = { ...demosByEvent };
      const updatedByYear = { ...demosByYear };
      
      mappedDemos.forEach(demo => {
        // Update by map
        if (!updatedByMap[demo.map]) {
          updatedByMap[demo.map] = [];
        }
        updatedByMap[demo.map].push(demo);
        
        // Update by event
        if (demo.event) {
          if (!updatedByEvent[demo.event]) {
            updatedByEvent[demo.event] = [];
          }
          updatedByEvent[demo.event].push(demo);
        }
        
        // Update by year
        if (!updatedByYear[demo.year]) {
          updatedByYear[demo.year] = [];
        }
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
  
  // Intersection Observer for infinite scroll
  const observer = useRef();
  const lastDemoElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreDemos();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMoreDemos]);
  
  // Handler functions
  const handleSelectDemo = (demo) => {
    setSelectedDemo(demo);
    setActiveVideoId(demo.videoId);
    setIsFullScreenPlayer(true);
    // Find related demos
    findRelatedDemos(demo);
    updateDemoStats(demo.id, 'views', 1).catch(err => 
      console.error('Error updating views:', err)
    );
    window.scrollTo(0, 0);
  };

  const findRelatedDemos = (demo) => {
    // Find demos with same map or same players or same positions
    const related = allDemos.filter(d => 
      d.id !== demo.id && (
        d.map === demo.map || 
        d.players.some(p => demo.players.includes(p)) ||
        d.positions.some(p => demo.positions.includes(p))
      )
    );
    
    setRelatedDemos(related.slice(0, 10)); // Limit to 10 related demos
  };
  
  const handleCloseVideoPlayer = () => {
    setSelectedDemo(null);
    setActiveVideoId('');
    setIsFullScreenPlayer(false);
    setRelatedDemos([]);
  };
  
  const handleLikeDemo = async (demoId) => {
    try {
      const result = await updateDemoStats(demoId, 'likes', 1);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        
        // Update all demos
        setAllDemos(prev => 
          prev.map(demo => demo.id === demoId ? { ...demo, likes: updatedDemo.likes } : demo)
        );
        
        // Update selected demo if it's the one that was liked
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
        const updatedDemo = mapDemoData(result.demo);
        
        // Update all demos
        setAllDemos(prev => 
          prev.map(demo => demo.id === demoId ? { ...demo, tags: updatedDemo.tags } : demo)
        );
        
        // Update selected demo if it's the one that was updated
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
        const updatedDemo = mapDemoData(result.demo);
        
        // Update all demos
        setAllDemos(prev => 
          prev.map(demo => demo.id === demoId ? { ...demo, positions: updatedDemo.positions } : demo)
        );
        
        // Update selected demo if it's the one that was updated
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, positions: updatedDemo.positions });
        }
      }
    } catch (err) {
      console.error('Error updating positions:', err);
    }
  };
  
  const handleSwitchDemoType = (type) => setDemoType(type);
  
  const handleResetFilters = () => setFiltersApplied({
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
    updateDemoStats(demo.id, 'views', 1).catch(err => 
      console.error('Error updating views:', err)
    );
    window.scrollTo(0, 0);
  };
  
  // Render loading state
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
  
  // Render error state
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

  // If we're showing the full-screen player
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
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .bg-pattern { background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px; }
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
                <img 
                  src={player.avatar} 
                  alt={playerName} 
                  className="w-full h-full object-cover"
                />
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
                {player?.bio || `Watch the best POV demos from ${playerName}. Analyze positioning, setups, and gameplay to improve your own CS2 skills.`}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {player?.stats && (
                  <>
                    <div className="bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <div className="text-yellow-400 font-bold text-2xl">{player.stats.totalDemos || allDemos.length}</div>
                      <div className="text-gray-400 text-xs">Total Demos</div>
                    </div>
                    
                    {player.stats.totalViews && (
                      <div className="bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <div className="text-yellow-400 font-bold text-2xl">{player.stats.totalViews.toLocaleString()}</div>
                        <div className="text-gray-400 text-xs">Total Views</div>
                      </div>
                    )}
                    
                    {player.stats.avgRating && (
                      <div className="bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <div className="text-yellow-400 font-bold text-2xl">{player.stats.avgRating}</div>
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
        {/* Trending Demos */}
        {trendingDemos.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-gray-100 text-2xl font-bold">
                <span className="border-l-4 border-yellow-400 pl-3 py-1">Most Popular POVs</span>
              </h2>
              
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 group">
                  <ChevronLeft className="h-5 w-5 group-hover:scale-110 transition-all" />
                </button>
                <button className="p-2 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 group">
                  <ChevronRight className="h-5 w-5 group-hover:scale-110 transition-all" />
                </button>
              </div>
            </div>
            
            <div className="flex overflow-x-auto pb-4 custom-scrollbar gap-8">
              {trendingDemos.map(demo => (
                <DemoCard 
                  key={`trending-${demo.id}`} 
                  demo={demo} 
                  onSelect={handleSelectDemo} 
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Demos By Maps */}
        {Object.entries(demosByMap).map(([map, demos]) => (
          <div className="mb-16" key={`map-${map}`}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-gray-100 text-2xl font-bold flex items-center">
                  <span className="border-l-4 border-yellow-400 pl-3 py-1">{map} Demos</span>
                </h2>
                <p className="text-gray-400 text-sm mt-2 ml-4">
                  {demos.length} POVs on {map}
                </p>
              </div>
              
              {demos.length > 3 && (
                <div className="flex gap-2">
                  <button className="p-2 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 group">
                    <ChevronLeft className="h-5 w-5 group-hover:scale-110 transition-all" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 group">
                    <ChevronRight className="h-5 w-5 group-hover:scale-110 transition-all" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex overflow-x-auto pb-4 custom-scrollbar gap-8">
              {demos.map(demo => (
                <DemoCard 
                  key={`map-${map}-${demo.id}`} 
                  demo={demo} 
                  onSelect={handleSelectDemo} 
                />
              ))}
            </div>
          </div>
        ))}
        
        {/* Demos By Events */}
        {Object.entries(demosByEvent)
          .filter(([event]) => event) // Filter out undefined/null events
          .map(([event, demos]) => (
            <div className="mb-16" key={`event-${event}`}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-gray-100 text-2xl font-bold flex items-center">
                    <span className="border-l-4 border-yellow-400 pl-3 py-1">{event}</span>
                  </h2>
                  <p className="text-gray-400 text-sm mt-2 ml-4">
                    {demos.length} POVs from this event
                  </p>
                </div>
                
                {demos.length > 3 && (
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 group">
                      <ChevronLeft className="h-5 w-5 group-hover:scale-110 transition-all" />
                    </button>
                    <button className="p-2 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 group">
                      <ChevronRight className="h-5 w-5 group-hover:scale-110 transition-all" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex overflow-x-auto pb-4 custom-scrollbar gap-8">
                {demos.map(demo => (
                  <DemoCard 
                    key={`event-${event}-${demo.id}`} 
                    demo={demo} 
                    onSelect={handleSelectDemo} 
                  />
                ))}
              </div>
            </div>
          ))}
        
        {/* Demos By Years */}
        {Object.entries(demosByYear)
          .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA)) // Sort years descending
          .map(([year, demos]) => (
            <div className="mb-16" key={`year-${year}`}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-gray-100 text-2xl font-bold flex items-center">
                    <span className="border-l-4 border-yellow-400 pl-3 py-1">{year} POVs</span>
                  </h2>
                  <p className="text-gray-400 text-sm mt-2 ml-4">
                    {demos.length} demos from {year}
                  </p>
                </div>
                
                {demos.length > 3 && (
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 group">
                      <ChevronLeft className="h-5 w-5 group-hover:scale-110 transition-all" />
                    </button>
                    <button className="p-2 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 group">
                      <ChevronRight className="h-5 w-5 group-hover:scale-110 transition-all" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex overflow-x-auto pb-4 custom-scrollbar gap-8">
                {demos.map(demo => (
                  <DemoCard 
                    key={`year-${year}-${demo.id}`} 
                    demo={demo} 
                    onSelect={handleSelectDemo} 
                  />
                ))}
              </div>
            </div>
          ))}
        
        {/* All Demos */}
        <div className="mb-16">
          <h2 className="text-gray-100 text-2xl font-bold mb-8">
            <span className="border-l-4 border-yellow-400 pl-3 py-1">All POVs</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allDemos.map((demo, index) => {
              // If this is the last item, attach the ref for intersection observer
              if (index === allDemos.length - 1) {
                return (
                  <div ref={lastDemoElementRef} key={`all-${demo.id}`}>
                    <DemoCard 
                      demo={demo} 
                      onSelect={handleSelectDemo} 
                      className="w-full"
                    />
                  </div>
                );
              } else {
                return (
                  <DemoCard 
                    key={`all-${demo.id}`} 
                    demo={demo} 
                    onSelect={handleSelectDemo} 
                    className="w-full"
                  />
                );
              }
            })}
          </div>
          
          {isLoading && (
            <div className="flex justify-center mt-8">
              <div className="w-10 h-10 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin"></div>
            </div>
          )}
          
          {!hasMore && allDemos.length > 0 && (
            <div className="text-center my-12 py-6 border-t border-gray-800">
              <p className="text-gray-400">You've reached the end of available demos</p>
            </div>
          )}
          
          {allDemos.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="text-yellow-400 text-5xl mb-4">¯\_(ツ)_/¯</div>
              <h3 className="text-white text-xl font-bold mb-2">No demos found</h3>
              <p className="text-gray-400">Try changing your filters to see more content</p>
              {Object.values(filtersApplied).some(v => v) && (
                <button 
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Filter Modal */}
      {isFilterModalOpen && (
              <FilterModal 
                demoType={demoType}
                filterOptions={filterOptions}
                filtersApplied={filtersApplied}
                onClose={() => setIsFilterModalOpen(false)}
                onFilterChange={(changed) => setFiltersApplied(prev => ({ ...prev, ...changed }))}
                onResetFilters={handleResetFilters}
                onApplyFilters={handleApplyFilters}
              />
            )}
            
            <Footer />
          </div>
        );
      };

export default PlayerPage;