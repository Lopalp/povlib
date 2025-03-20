'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  getAllDemos,
  getFilteredDemos,
  getTrendingDemos,
  getLatestDemos,
  getDemosByMap,
  getDemosByPosition,
  getFilterOptions,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions
} from '@/lib/supabase';

// Importiere Komponenten aus den aufgeteilten Dateien
import { DemoCard, FeaturedHero, DemoCarousel, YouTubeEmbed } from './DemoComponents';
import { VideoPlayerModal, TaggingModal, FilterModal } from './ModalComponents';
import { Navbar, SelectedFilters, ContentTabs } from './Navigation';
import { MainContent, Footer } from './Layout';

const POVlib = () => {
  // State für Navigation und UI
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchActive, setSearchActive] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoId, setActiveVideoId] = useState('');
  const [demoType, setDemoType] = useState('pro'); // Toggle zwischen 'pro' und 'community'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [autoplayVideo, setAutoplayVideo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Daten-States
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
  
  // Refs für Custom Scrolling
  const scrollContainerRef = useRef(null);
  const featuredVideoRef = useRef(null);
  
  // Daten laden, wenn die Komponente montiert wird
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Filter-Optionen laden
        const options = await getFilterOptions();
        setFilterOptions(options);
        
        // Initial gefilterte Demos laden
        const demos = await getFilteredDemos(filtersApplied, demoType);
        
        // Datenfeld-Mapping (Supabase -> Frontend)
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
        
        // Trending und neueste Demos laden
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
        
        // Video ID für das erste Demo setzen (falls vorhanden)
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
  
  // Demos aktualisieren, wenn sich Filter ändern
  useEffect(() => {
    const updateFilteredDemos = async () => {
      try {
        setIsLoading(true);
        
        // Gefilterte Demos laden
        const demos = await getFilteredDemos({
          ...filtersApplied,
          search: searchQuery
        }, demoType);
        
        // Datenfeld-Mapping (Supabase -> Frontend)
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
  
  // Map-spezifische Demos laden, wenn benötigt
  useEffect(() => {
    const loadMapDemos = async (map) => {
      if (!mapDemos[map]) {
        try {
          const demos = await getDemosByMap(map);
          
          // Datenfeld-Mapping (Supabase -> Frontend)
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
    
    // Für einige Standard-Maps vorladen
    if (!filtersApplied.map) {
      loadMapDemos('Mirage');
      loadMapDemos('Inferno');
    }
  }, [mapDemos, filtersApplied.map]);
  
  // Position-spezifische Demos laden, wenn benötigt
  useEffect(() => {
    const loadPositionDemos = async (position) => {
      if (!positionDemos[position]) {
        try {
          const demos = await getDemosByPosition(position);
          
          // Datenfeld-Mapping (Supabase -> Frontend)
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
    
    // AWP Demos vorladen
    if (!filtersApplied.position) {
      loadPositionDemos('AWPer');
    }
  }, [positionDemos, filtersApplied.position]);
  
  // Views aktualisieren, wenn ein Demo ausgewählt wird
  useEffect(() => {
    const updateViews = async () => {
      if (selectedDemo) {
        try {
          const result = await updateDemoStats(selectedDemo.id, 'views', 1);
          
          if (result.success) {
            // Lokalen State aktualisieren (damit wir nicht neu laden müssen)
            setFilteredDemos(prev => 
              prev.map(demo => 
                demo.id === selectedDemo.id 
                  ? { ...demo, views: demo.views + 1 } 
                  : demo
              )
            );
            
            // Wenn das Demo in anderen Listen ist, dort auch aktualisieren
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
            
            // Auch in mapDemos und positionDemos aktualisieren, falls vorhanden
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
  
  // Demo-Like-Handler
  const handleLikeDemo = async (demoId) => {
    try {
      const result = await updateDemoStats(demoId, 'likes', 1);
      
      if (result.success) {
        // Remap Supabase-Felder auf Frontend-Felder
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
        
        // Lokalen State aktualisieren
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
        
        // Auch in anderen Listen aktualisieren
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
        
        // Auch in mapDemos und positionDemos aktualisieren
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
  
  // Tags aktualisieren
  const handleUpdateTags = async (demoId, tags) => {
    try {
      const result = await updateDemoTags(demoId, tags);
      
      if (result.success) {
        // Remap Supabase-Felder auf Frontend-Felder
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
        
        // Lokalen State aktualisieren
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
        
        // Modal schließen
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
        // Remap Supabase-Felder auf Frontend-Felder
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
        
        // Lokalen State aktualisieren
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
  
  // Custom scroll handling mit enhanced smooth behavior
  const handleScroll = (direction, speed = 400) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 300; // Ungefähre Breite einer Karte inkl. Margins
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Helferfunktionen für gefilterte Demos
  const getFilteredDemosByMap = (map) => {
    return mapDemos[map] || [];
  };
  
  const getFilteredDemosByPosition = (position) => {
    return positionDemos[position] || [];
  };

  // Loading-Anzeige
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
  
  // Fehler-Anzeige
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
      {/* Custom CSS für Scrollbars und Effekte */}
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .custom-scrollbar::-webkit-scrollbar {
          height: 0;
          width: 0;
          display: none;
        }
        
        /* Hide scrollbar for Firefox */
        .custom-scrollbar {
          scrollbar-width: none;
        }
        
        /* Hide scrollbar for IE and Edge */
        .custom-scrollbar {
          -ms-overflow-style: none;
        }
        
        /* Background pattern overlay */
        .bg-pattern {
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
      
      {/* Navbar Komponente */}
      <Navbar 
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        demoType={demoType}
        setDemoType={setDemoType}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setIsFilterModalOpen={setIsFilterModalOpen}
        filtersApplied={filtersApplied}
        setFiltersApplied={setFiltersApplied}
      />
      
      {/* Featured Hero Banner für ausgewähltes Demo */}
      {filteredDemos.length > 0 && !selectedDemo && (
        <FeaturedHero 
          demo={filteredDemos[0]} 
          setSelectedDemo={setSelectedDemo}
          setActiveVideoId={setActiveVideoId}
          autoplayVideo={autoplayVideo}
          setIsFilterModalOpen={setIsFilterModalOpen}
          featuredVideoRef={featuredVideoRef}
        />
      )}
      
      {/* Main Content */}
      <MainContent
        activeTab={activeTab}
        isLoading={isLoading}
        filtersApplied={filtersApplied}
        setFiltersApplied={setFiltersApplied}
        filteredDemos={filteredDemos}
        trendingDemos={trendingDemos}
        latestDemos={latestDemos}
        mapDemos={mapDemos}
        getFilteredDemosByMap={getFilteredDemosByMap}
        getFilteredDemosByPosition={getFilteredDemosByPosition}
        filterOptions={filterOptions}
        searchQuery={searchQuery}
        selectedDemo={selectedDemo}
        setSelectedDemo={setSelectedDemo}
        activeVideoId={activeVideoId}
        setActiveVideoId={setActiveVideoId}
        handleScroll={handleScroll}
        scrollContainerRef={scrollContainerRef}
        setActiveTab={setActiveTab}
      />
      
      {/* Footer */}
      <Footer />
      
      {/* Modals */}
      {isFilterModalOpen && (
        <FilterModal 
          setIsFilterModalOpen={setIsFilterModalOpen}
          filterOptions={filterOptions}
          filtersApplied={filtersApplied}
          setFiltersApplied={setFiltersApplied}
          demoType={demoType}
          setDemoType={setDemoType}
        />
      )}
      
      {selectedDemo && (
        <VideoPlayerModal 
          selectedDemo={selectedDemo}
          setSelectedDemo={setSelectedDemo}
          activeVideoId={activeVideoId}
          setActiveVideoId={setActiveVideoId}
          handleLikeDemo={handleLikeDemo}
          setIsTaggingModalOpen={setIsTaggingModalOpen}
        />
      )}
      
      {isTaggingModalOpen && selectedDemo && (
        <TaggingModal 
          selectedDemo={selectedDemo}
          setIsTaggingModalOpen={setIsTaggingModalOpen}
          handleUpdateTags={handleUpdateTags}
          handleUpdatePositions={handleUpdatePositions}
          filterOptions={filterOptions}
        />
      )}
    </div>
  );
};

export default POVlib;