'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter } from 'lucide-react';
import { getAllDemos, getFilteredDemos, getTrendingDemos, getLatestDemos, getDemosByMap, getDemosByPosition, getFilterOptions, updateDemoStats, updateDemoTags, updateDemoPositions } from '@/lib/supabase';
import YouTubeEmbed from './POVlib/YouTubeEmbed';
import DemoCard from './POVlib/DemoCard';
import VideoPlayerModal from './POVlib/VideoPlayerModal';
import TaggingModal from './POVlib/TaggingModal';
import FilterModal from './POVlib/FilterModal';
import Navbar from './POVlib/Navbar';
import DemoCarousel from './POVlib/DemoCarousel';

const POVlib = () => {
  const [activeFilter, setActiveFilter] = useState('all');
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
    search: ''
  });
  
  const scrollContainerRef = useRef(null);
  const featuredVideoRef = useRef(null);
  
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
  
  useEffect(() => {
    const updateFilteredDemos = async () => {
      try {
        setIsLoading(true);
        const demos = await getFilteredDemos({
          ...filtersApplied,
          search: searchQuery
        }, demoType);
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
          setMapDemos(prev => ({
            ...prev,
            [map]: mappedDemos
          }));
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
          setPositionDemos(prev => ({
            ...prev,
            [position]: mappedDemos
          }));
        } catch (err) {
          console.error(`Error loading demos for position ${position}:`, err);
        }
      }
    };
    
    if (!filtersApplied.position) {
      loadPositionDemos('AWPer');
    }
  }, [positionDemos, filtersApplied.position]);
  
  useEffect(() => {
    const updateViews = async () => {
      if (selectedDemo) {
        try {
          const result = await updateDemoStats(selectedDemo.id, 'views', 1);
          if (result.success) {
            setFilteredDemos(prev => 
              prev.map(demo => 
                demo.id === selectedDemo.id 
                  ? { ...demo, views: demo.views + 1 } 
                  : demo
              )
            );
            
            if (trendingDemos.some(demo => demo.id === selectedDemo.id)) {
              setTrendingDemos(prev => 
                prev.map(demo => 
                  demo.id === selectedDemo.id 
                    ? { ...demo, views: demo.views + 1 } 
                    : demo
                )
              );
            }
            
            if (latestDemos.some(demo => demo.id === selectedDemo.id)) {
              setLatestDemos(prev => 
                prev.map(demo => 
                  demo.id === selectedDemo.id 
                    ? { ...demo, views: demo.views + 1 } 
                    : demo
                )
              );
            }
            
            Object.keys(mapDemos).forEach(map => {
              if (mapDemos[map].some(demo => demo.id === selectedDemo.id)) {
                setMapDemos(prev => ({
                  ...prev,
                  [map]: prev[map].map(demo => 
                    demo.id === selectedDemo.id 
                      ? { ...demo, views: demo.views + 1 } 
                      : demo
                  )
                }));
              }
            });
            
            Object.keys(positionDemos).forEach(position => {
              if (positionDemos[position].some(demo => demo.id === selectedDemo.id)) {
                setPositionDemos(prev => ({
                  ...prev,
                  [position]: prev[position].map(demo => 
                    demo.id === selectedDemo.id 
                      ? { ...demo, views: demo.views + 1 } 
                      : demo
                  )
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
          prev.map(demo => 
            demo.id === demoId 
              ? { ...demo, likes: updatedDemo.likes } 
              : demo
          )
        );
        
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({
            ...selectedDemo,
            likes: updatedDemo.likes
          });
        }
        
        if (trendingDemos.some(demo => demo.id === demoId)) {
          setTrendingDemos(prev => 
            prev.map(demo => 
              demo.id === demoId 
                ? { ...demo, likes: updatedDemo.likes } 
                : demo
            )
          );
        }
        
        if (latestDemos.some(demo => demo.id === demoId)) {
          setLatestDemos(prev => 
            prev.map(demo => 
              demo.id === demoId 
                ? { ...demo, likes: updatedDemo.likes } 
                : demo
            )
          );
        }
        
        Object.keys(mapDemos).forEach(map => {
          if (mapDemos[map].some(demo => demo.id === demoId)) {
            setMapDemos(prev => ({
              ...prev,
              [map]: prev[map].map(demo => 
                demo.id === demoId 
                  ? { ...demo, likes: updatedDemo.likes } 
                  : demo
              )
            }));
          }
        });
        
        Object.keys(positionDemos).forEach(position => {
          if (positionDemos[position].some(demo => demo.id === demoId)) {
            setPositionDemos(prev => ({
              ...prev,
              [position]: prev[position].map(demo => 
                demo.id === demoId 
                  ? { ...demo, likes: updatedDemo.likes } 
                  : demo
              )
            }));
          }
        });
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
          prev.map(demo => 
            demo.id === demoId 
              ? { ...demo, tags: updatedDemo.tags } 
              : demo
          )
        );
        
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({
            ...selectedDemo,
            tags: updatedDemo.tags
          });
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
          prev.map(demo => 
            demo.id === demoId 
              ? { ...demo, positions: updatedDemo.positions } 
              : demo
          )
        );
        
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({
            ...selectedDemo,
            positions: updatedDemo.positions
          });
        }
      }
    } catch (err) {
      console.error('Error updating positions:', err);
    }
  };
  
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 300;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  const onSelectDemo = (demo) => {
    setSelectedDemo(demo);
    setActiveVideoId(demo.videoId);
  };
  
  const onSwitchDemoType = (type) => {
    setDemoType(type);
  };
  
  const onResetFilters = () => {
    setFiltersApplied({
      map: '',
      position: '',
      player: '',
      team: '',
      year: '',
      event: '',
      result: '',
      search: searchQuery
    });
  };
  
  const onApplyFilters = () => {
    setIsFilterModalOpen(false);
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 0;
          width: 0;
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
        onSwitchDemoType={onSwitchDemoType}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      />
      
      {filteredDemos.length > 0 && !selectedDemo && (
        <div className="mb-12">
          <YouTubeEmbed videoId={filteredDemos[0].videoId} title={filteredDemos[0].title} autoplay={autoplayVideo} controls={false} className="scale-110 opacity-60" />
        </div>
      )}
      
      <main className="container mx-auto px-6 py-12 bg-pattern">
        {/* Hier können weitere UI-Elemente wie Tabs etc. eingefügt werden */}
        {activeTab === 'all' && (
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
                  demos={mapDemos['Mirage'] || []} 
                  onSelectDemo={onSelectDemo}
                  handleScroll={handleScroll}
                />
                <DemoCarousel 
                  title="Inferno POVs" 
                  demos={mapDemos['Inferno'] || []} 
                  onSelectDemo={onSelectDemo}
                  handleScroll={handleScroll}
                />
              </>
            )}
            
            {!filtersApplied.position && (
              <DemoCarousel 
                title="AWP Plays" 
                demos={positionDemos['AWPer'] || []} 
                onSelectDemo={onSelectDemo}
                handleScroll={handleScroll}
              />
            )}
          </>
        )}
        
        {activeTab === 'trending' && (
          <DemoCarousel 
            title="Trending POVs"
            demos={trendingDemos}
            description="Most viewed demos right now"
            onSelectDemo={onSelectDemo}
            handleScroll={handleScroll}
          />
        )}
        
        {activeTab === 'latest' && (
          <DemoCarousel 
            title="Latest Uploads"
            demos={latestDemos}
            description="Fresh POV content from this year"
            onSelectDemo={onSelectDemo}
            handleScroll={handleScroll}
          />
        )}
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
      
      {selectedDemo && (
        <VideoPlayerModal 
          selectedDemo={selectedDemo}
          activeVideoId={activeVideoId}
          onClose={() => {
            setSelectedDemo(null);
            setActiveVideoId('');
          }}
          onLike={handleLikeDemo}
          onOpenTagModal={() => setIsTaggingModalOpen(true)}
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
    </div>
  );
};

export default POVlib;
