'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Play, X, Filter, Tag, Map, Users, Calendar, Trophy, Check, Eye, User, Heart, Menu, ArrowRight, ArrowLeft } from 'lucide-react';
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
          videoId: demo.video_id,  // Umbenannt von video_id zu videoId
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
          isPro: demo.is_pro // Umbenannt von is_pro zu isPro
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
  
  // YouTube embed component mit erweiterten Optionen
  const YouTubeEmbed = ({ videoId, title, autoplay = false, className = "", controls = true }) => {
    if (!videoId) return null;
    
    return (
      <div className={`relative w-full pb-56.25 h-0 rounded-lg overflow-hidden ${className}`}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&controls=${controls ? 1 : 0}&showinfo=0&mute=${autoplay ? 1 : 0}`}
          title={title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };
  
  // Redesigned Demo Card Component mit professional layout
  const DemoCard = ({ demo, featured = false, className = "" }) => (
    <div 
      className={`relative flex-shrink-0 ${featured ? 'w-full' : 'w-72'} overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group ${className}`}
      onClick={() => {
        setSelectedDemo(demo);
        setActiveVideoId(demo.videoId);
      }}
    >
      <div className="relative pt-6 px-6">
        {/* Status indicators positioned at the top with proper spacing */}
        <div className="flex justify-between items-center mb-2">
          <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded">
            {demo.map}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${demo.isPro ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 'bg-gray-700 text-white'}`}>
            {demo.isPro ? 'PRO' : 'COMMUNITY'}
          </span>
        </div>
        
        {/* Title with proper spacing */}
        <h3 className="text-white font-bold text-base mb-3 line-clamp-1">{demo.title}</h3>
        
        {/* Thumbnail container with gradient overlay */}
        <div className="relative rounded-lg overflow-hidden">
          {/* Hover effect with subtle glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 z-10"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-yellow-400 to-yellow-300 z-0"></div>
          
          <img 
            src={demo.thumbnail} 
            alt={demo.title} 
            className={`w-full ${featured ? 'h-48 object-cover' : 'h-40 object-cover'} group-hover:scale-110 transition-all duration-700 rounded-lg`}
          />
          
          {/* Social stats with clean positioning */}
          <div className="absolute bottom-3 right-3 flex items-center space-x-3 text-xs text-white z-20">
            <div className="flex items-center bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
              <Eye className="h-3 w-3 mr-1 text-yellow-400" />
              <span>{demo.views.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Play button with clean effect */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <button className="bg-yellow-400 rounded-full p-4 transition-transform duration-300 hover:scale-110 shadow-[0_0_15px_rgba(250,204,21,0.7)]">
                <Play className="h-6 w-6 text-gray-900" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Info section with clean layout */}
      <div className="p-4 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-yellow-400 text-xs font-medium">{demo.players.join(', ')}</span>
          <span className="text-gray-400 text-xs">{demo.year}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {demo.positions.slice(0, 1).map((position, i) => (
            <span key={i} className="text-xs bg-gray-700 px-2 py-0.5 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
              {position}
            </span>
          ))}
          {demo.tags.slice(0, 1).map((tag, i) => (
            <span key={i} className="text-xs bg-gray-700 px-2 py-0.5 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
              {tag}
            </span>
          ))}
          <span className="flex items-center text-xs bg-yellow-400/10 px-2 py-0.5 rounded text-yellow-400">
            <Heart className="h-3 w-3 mr-1" />
            {demo.likes}
          </span>
        </div>
      </div>
    </div>
  );
  
  // Enhanced Featured Demo Hero Component with better spacing
  const FeaturedHero = ({ demo }) => {
    if (!demo) return null;
    
    return (
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Background video with improved gradient overlay */}
        <div className="absolute inset-0 overflow-hidden" ref={featuredVideoRef}>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
          <YouTubeEmbed 
            videoId={demo.videoId} 
            title={demo.title} 
            autoplay={autoplayVideo} 
            controls={false} 
            className="scale-110 opacity-60" 
          />
        </div>
        
        {/* Content overlay with improved spacing */}
        <div className="relative z-20 container mx-auto h-full flex items-center px-8">
          <div className="max-w-2xl">
            <div className="flex items-center mb-4 space-x-3">
              <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-sm font-bold rounded">
                {demo.map}
              </span>
              <span className="px-3 py-1 bg-gray-800/80 border border-yellow-400 text-yellow-400 text-sm rounded">
                {demo.team || "Featured Demo"}
              </span>
              <span className="px-3 py-1 bg-gray-800/80 text-white text-sm rounded backdrop-blur-sm">
                {demo.event || demo.year}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
              {demo.title}
            </h1>
            
            <p className="text-gray-300 text-lg max-w-xl mb-6 line-clamp-2">
              Watch this high-level POV demo featuring {demo.players.join(', ')} playing on {demo.map}. 
              Learn professional techniques and strategies used by top players.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  setSelectedDemo(demo);
                  setActiveVideoId(demo.videoId);
                }}
                className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-md hover:bg-yellow-300 transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.5)] flex items-center"
              >
                <Play className="h-5 w-5 mr-2" fill="currentColor" />
                Watch Full POV
              </button>
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="px-6 py-3 bg-gray-800/40 backdrop-blur-sm text-white rounded-md hover:bg-gray-700 transition-all duration-300 border border-gray-700 flex items-center"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filter POVs
              </button>
            </div>
            
            {/* Social stats */}
            <div className="flex items-center mt-8 space-x-6">
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-yellow-400" />
                <span className="text-white">{demo.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-yellow-400" />
                <span className="text-white">{demo.likes} likes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Demo carousel with improved spacing and professional design
  const DemoCarousel = ({ title, demos, description }) => {
    if (!demos || demos.length === 0) return null;
    
    return (
      <div className="mb-16 relative">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-gray-100 text-2xl font-bold">
              <span className="border-l-4 border-yellow-400 pl-3 py-1">{title}</span>
            </h2>
            {description && <p className="text-gray-400 text-sm mt-2 ml-4">{description}</p>}
          </div>
          
          {demos.length > 3 && (
            <div className="flex gap-2">
              <button 
                onClick={() => handleScroll('left')}
                className="p-2 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-all" />
              </button>
              <button 
                onClick={() => handleScroll('right')}
                className="p-2 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 group"
              >
                <ArrowRight className="h-5 w-5 group-hover:scale-110 transition-all" />
              </button>
            </div>
          )}
        </div>
        
        {/* Horizontal scrolling container with proper spacing */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 custom-scrollbar gap-6"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {demos.map(demo => (
            <DemoCard key={demo.id} demo={demo} />
          ))}
        </div>
      </div>
    );
  };
  
  // Professional Video Player Modal
  const VideoPlayerModal = () => {
    if (!selectedDemo) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl w-full max-w-5xl border border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.15)] overflow-hidden">
          <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">{selectedDemo.title}</h2>
            <button 
              onClick={() => {
                setSelectedDemo(null);
                setActiveVideoId('');
              }}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-0">
            <YouTubeEmbed videoId={activeVideoId} title={selectedDemo.title} autoplay={true} />
          </div>
          
          <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-850">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded">{selectedDemo.map}</span>
              {selectedDemo.team && (
                <span className="bg-gray-700 text-sm px-3 py-1 rounded">{selectedDemo.team}</span>
              )}
              {selectedDemo.event && (
                <span className="bg-gray-700 text-sm px-3 py-1 rounded">{selectedDemo.event}</span>
              )}
              <span className="bg-gray-700 text-sm px-3 py-1 rounded">{selectedDemo.year}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${selectedDemo.isPro ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 'bg-gray-700 text-white'}`}>
                {selectedDemo.isPro ? 'PRO POV' : 'COMMUNITY POV'}
              </span>
            </div>
            
            <p className="text-gray-300 mb-6">
              Watch this detailed POV demo featuring {selectedDemo.players.join(', ')} playing on {selectedDemo.map}. 
              This showcase highlights professional techniques and positioning that can improve your gameplay.
            </p>
            
            <div className="mt-6">
              <h3 className="text-gray-300 text-sm mb-2">Positions:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDemo.positions.map((position, i) => (
                  <span key={i} className="text-xs bg-gray-700 px-3 py-1 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
                    {position}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-gray-300 text-sm mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDemo.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-gray-700 px-3 py-1 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-yellow-400" />
                  <span className="text-gray-300">{selectedDemo.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-yellow-400" />
                  <span className="text-gray-300">{selectedDemo.likes}</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setIsTaggingModalOpen(true)}
                  className="px-4 py-2 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-600 transition flex items-center"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Tag Demo
                </button>
                <button 
                  onClick={() => handleLikeDemo(selectedDemo.id)}
                  className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm rounded-md hover:bg-yellow-300 transition flex items-center font-bold"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Like
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tagging Modal with professional design
  const TaggingModal = () => {
    if (!selectedDemo) return null;
    
    const [newTag, setNewTag] = useState('');
    const [demoTags, setDemoTags] = useState([...selectedDemo.tags]);
    const [demoPositions, setDemoPositions] = useState([...selectedDemo.positions]);
    
    const addTag = () => {
      if (newTag && !demoTags.includes(newTag)) {
        setDemoTags([...demoTags, newTag]);
        setNewTag('');
      }
    };
    
    const removeTag = (tagToRemove) => {
      setDemoTags(demoTags.filter(tag => tag !== tagToRemove));
    };
    
    const addPosition = (position) => {
      if (!demoPositions.includes(position)) {
        setDemoPositions([...demoPositions, position]);
      }
    };
    
    const removePosition = (positionToRemove) => {
      setDemoPositions(demoPositions.filter(position => position !== positionToRemove));
    };
    
    const handleSave = () => {
      handleUpdateTags(selectedDemo.id, demoTags);
      handleUpdatePositions(selectedDemo.id, demoPositions);
    };
    
    return (
      <div className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Tag This Demo</h2>
              <button 
                onClick={() => setIsTaggingModalOpen(false)}
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Demo Preview */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-700">
              <img src={selectedDemo.thumbnail} alt="" className="w-20 h-20 rounded-lg object-cover" />
              <div>
                <h3 className="font-bold text-white">{selectedDemo.title}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400 text-sm mr-2">{selectedDemo.map}</span>
                  <span className="text-gray-400 text-xs">{selectedDemo.players.join(', ')}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Positions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Positions
                </label>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-800 rounded-xl border border-gray-700 min-h-12">
                  {demoPositions.map((position, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-yellow-400 text-gray-900 text-sm rounded-full px-3 py-1 font-medium"
                    >
                      {position}
                      <X className="ml-2 h-3 w-3 cursor-pointer" onClick={() => removePosition(position)} />
                    </div>
                  ))}
                  
                  <div className="relative inline-block">
                    <select
                      className="bg-gray-700 text-sm rounded-full px-3 py-1 cursor-pointer hover:bg-gray-600 text-white border-none outline-none"
                      onChange={(e) => {
                        if (e.target.value) {
                          addPosition(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">+ Add Position</option>
                      {filterOptions.positions[selectedDemo.map]?.map((pos, idx) => (
                        <option key={idx} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {demoTags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-700 text-white text-sm rounded-full px-3 py-1 flex items-center group"
                      >
                        {tag}
                        <X 
                          className="ml-2 h-3 w-3 cursor-pointer opacity-70 group-hover:opacity-100" 
                          onClick={() => removeTag(tag)}
                        />
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Add new tag..."
                      className="flex-1 p-3 bg-gray-700 rounded-l-lg text-white text-sm border-0 focus:ring-1 focus:ring-yellow-400 outline-none"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <button 
                      onClick={addTag}
                      className="bg-yellow-400 text-gray-900 p-3 rounded-r-lg hover:bg-yellow-300 transition font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end mt-6">
                <button 
                  onClick={handleSave}
                  className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                >
                  Save Tags
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Professional Filter Modal
  const FilterModal = () => {
    return (
      <div className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Filter POV Demos</h2>
              <button 
                onClick={() => setIsFilterModalOpen(false)}
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Filter Type Tabs */}
              <div className="flex border-b border-gray-700 mb-4">
                <button
                  className={`px-6 py-3 text-sm font-bold ${demoType === 'pro' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setDemoType('pro')}
                >
                  PRO POVs
                </button>
                <button
                  className={`px-6 py-3 text-sm font-bold ${demoType === 'community' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setDemoType('community')}
                >
                  COMMUNITY POVs
                </button>
              </div>
              
              {/* Filter Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Map Selection */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Map className="h-4 w-4 mr-2 text-yellow-400" />
                    Map
                  </label>
                  <select 
                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                    value={filtersApplied.map}
                    onChange={(e) => {
                      setFiltersApplied(prev => ({
                        ...prev,
                        map: e.target.value
                      }));
                    }}
                  >
                    <option value="">All Maps</option>
                    {filterOptions.maps.map(map => (
                      <option key={map} value={map}>{map}</option>
                    ))}
                  </select>
                </div>
                
                {/* Position */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Map className="h-4 w-4 mr-2 text-yellow-400" />
                    Position
                  </label>
                  <select 
                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                    value={filtersApplied.position}
                    onChange={(e) => {
                      setFiltersApplied(prev => ({
                        ...prev,
                        position: e.target.value
                      }));
                    }}
                  >
                    <option value="">All Positions</option>
                    {filtersApplied.map 
                      ? filterOptions.positions[filtersApplied.map]?.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))
                      : Object.values(filterOptions.positions).flat().filter((pos, i, arr) => arr.indexOf(pos) === i).map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))
                    }
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Player Selection */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Users className="h-4 w-4 mr-2 text-yellow-400" />
                    Player
                  </label>
                  <select 
                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                    value={filtersApplied.player}
                    onChange={(e) => {
                      setFiltersApplied(prev => ({
                        ...prev,
                        player: e.target.value
                      }));
                    }}
                  >
                    <option value="">All Players</option>
                    {filterOptions.players.map(player => (
                      <option key={player} value={player}>{player}</option>
                    ))}
                  </select>
                </div>
                
                {demoType === 'pro' && (
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                      <Users className="h-4 w-4 mr-2 text-yellow-400" />
                      Team
                    </label>
                    <select 
                      className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                      value={filtersApplied.team}
                      onChange={(e) => {
                        setFiltersApplied(prev => ({
                          ...prev,
                          team: e.target.value
                        }));
                      }}
                    >
                      <option value="">All Teams</option>
                      {filterOptions.teams.map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Year Selection */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                    Year
                  </label>
                  <select 
                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                    value={filtersApplied.year}
                    onChange={(e) => {
                      setFiltersApplied(prev => ({
                        ...prev,
                        year: e.target.value
                      }));
                    }}
                  >
                    <option value="">All Years</option>
                    {filterOptions.years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                {demoType === 'pro' && (
                  <>
                    {/* Event Selection */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
                        Event
                      </label>
                      <select 
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                        value={filtersApplied.event}
                        onChange={(e) => {
                          setFiltersApplied(prev => ({
                            ...prev,
                            event: e.target.value
                          }));
                        }}
                      >
                        <option value="">All Events</option>
                        {filterOptions.events.map(event => (
                          <option key={event} value={event}>{event}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Result Selection */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        <Check className="h-4 w-4 mr-2 text-yellow-400" />
                        Result
                      </label>
                      <select 
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                        value={filtersApplied.result}
                        onChange={(e) => {
                          setFiltersApplied(prev => ({
                            ...prev,
                            result: e.target.value
                          }));
                        }}
                      >
                        <option value="">All Results</option>
                        {filterOptions.results.map(result => (
                          <option key={result} value={result}>{result}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-700">
                <button 
                  onClick={() => {
                    setFiltersApplied({
                      map: '',
                      position: '',
                      player: '',
                      team: '',
                      year: '',
                      event: '',
                      result: '',
                      search: ''
                    });
                  }}
                  className="text-gray-400 hover:text-yellow-400 text-sm font-bold transition-colors"
                >
                  Reset Filters
                </button>
                
                <button 
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Selected Filters Component with professional spacing
  const SelectedFilters = () => {
    const hasFilters = Object.values(filtersApplied).some(val => val !== '');
    
    if (!hasFilters) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
        {Object.entries(filtersApplied).map(([key, value]) => {
          if (!value || key === 'search') return null;
          
          return (
            <div key={key} className="flex items-center bg-gray-700 text-xs rounded-full px-3 py-2 group hover:bg-gray-600 transition-colors">
              <span className="capitalize mr-1 text-gray-400">{key}:</span>
              <span className="font-bold text-yellow-400">{value}</span>
              <button 
                onClick={() => {
                  setFiltersApplied(prev => ({
                    ...prev,
                    [key]: ''
                  }));
                }}
                className="ml-2 text-gray-500 group-hover:text-yellow-400 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
        
        <button 
          onClick={() => {
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
          }}
          className="text-xs text-gray-400 hover:text-yellow-400 ml-2 font-bold transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    );
  };

  // Professionally designed tab navigation
  const ContentTabs = () => {
    return (
      <div className="mb-8 border-b border-gray-700">
        <div className="flex space-x-1">
          <button
            className={`px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'all' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('all')}
          >
            All POVs
          </button>
          <button
            className={`px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'trending' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('trending')}
          >
            Trending
          </button>
          <button
            className={`px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'latest' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('latest')}
          >
            Latest
          </button>
          <button
            className={`px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'awp' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('awp')}
          >
            AWP Plays
          </button>
          <button
            className={`px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'rifle' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('rifle')}
          >
            Rifle Plays
          </button>
        </div>
      </div>
    );
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
      {/* Custom CSS for scrollbars and effects */}
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
      
      {/* Modern Navbar with cleaner design */}
      <nav className="backdrop-blur-lg bg-gray-900/80 py-4 px-6 sticky top-0 z-50 border-b border-gray-700 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-black">
              <span className="text-yellow-400">POV</span>
              <span className="text-white">lib</span>
              <span className="text-gray-400 text-xl">.gg</span>
            </h1>
            
            {/* Desktop Nav Links */}
            <div className="hidden md:flex space-x-8 ml-10">
              <a href="#" className="text-sm text-white font-bold relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white font-medium relative group">
                Maps
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white font-medium relative group">
                Players
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
          
          {/* Right Side Nav */}
          <div className="flex items-center space-x-6">
            {/* Demo Type Switch */}
            <div className="hidden md:flex items-center p-1 bg-gray-800 rounded-full">
              <button
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 ${demoType === 'pro' ? 'bg-yellow-400 text-gray-900 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setDemoType('pro')}
              >
                PRO POVs
              </button>
              <button
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 ${demoType === 'community' ? 'bg-yellow-400 text-gray-900 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setDemoType('community')}
              >
                COMMUNITY
              </button>
            </div>
            
            {/* Filter Button */}
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors duration-200"
            >
              <Filter className="h-5 w-5" />
            </button>
            
            {/* Search with enhanced animation */}
            <div className="relative">
              {searchActive ? (
                <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden pr-2 border border-gray-700 shadow-inner">
                  <input
                    type="text"
                    placeholder="Search POVs..."
                    className="bg-transparent text-sm py-2 px-3 outline-none w-56"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <X 
                    className="h-4 w-4 text-gray-400 cursor-pointer hover:text-yellow-400 transition-colors" 
                    onClick={() => {
                      setSearchActive(false);
                      setSearchQuery('');
                      setFiltersApplied(prev => ({...prev, search: ''}));
                    }}
                  />
                </div>
              ) : (
                <Search 
                  className="h-5 w-5 text-gray-400 cursor-pointer hover:text-yellow-400 transition-colors" 
                  onClick={() => setSearchActive(true)}
                />
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-400 hover:text-yellow-400 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800/95 backdrop-blur-lg border-b border-gray-700 shadow-lg">
            <div className="p-4 space-y-4">
              <a href="#" className="block py-2 text-white font-bold">Home</a>
              <a href="#" className="block py-2 text-gray-400 hover:text-white">Maps</a>
              <a href="#" className="block py-2 text-gray-400 hover:text-white">Players</a>
              
              {/* Mobile Demo Type Switch */}
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
                <p className="text-sm text-gray-500">POV Type:</p>
                <div className="flex items-center p-1 bg-gray-700 rounded-full self-start">
                  <button
                    className={`text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 ${demoType === 'pro' ? 'bg-yellow-400 text-gray-900' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => {
                      setDemoType('pro');
                      setIsMenuOpen(false);
                    }}
                  >
                    PRO POVs
                  </button>
                  <button
                    className={`text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 ${demoType === 'community' ? 'bg-yellow-400 text-gray-900' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => {
                      setDemoType('community');
                      setIsMenuOpen(false);
                    }}
                  >
                    COMMUNITY
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Featured Hero Banner for selected demo */}
      {filteredDemos.length > 0 && !selectedDemo && (
        <FeaturedHero demo={filteredDemos[0]} />
      )}
      
      {/* Main Content with background pattern */}
      <main className="container mx-auto px-6 py-12 bg-pattern">
        {/* Display selected filters */}
        <SelectedFilters />
        
        {/* Content category tabs */}
        <ContentTabs />
        
        {/* Wenn Daten geladen werden, Skeleton anzeigen */}
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
        
        {/* Inhalt basierend auf ausgewähltem Tab */}
        {!isLoading && activeTab === 'all' && (
          <>
            <DemoCarousel 
              title="Recently Added"
              demos={filteredDemos} 
              description="Latest POV demos based on your filter criteria"
            />
            
            {!filtersApplied.map && (
              <>
                <DemoCarousel 
                  title="Mirage POVs" 
                  demos={getFilteredDemosByMap("Mirage")} 
                />
                
                <DemoCarousel 
                  title="Inferno POVs" 
                  demos={getFilteredDemosByMap("Inferno")} 
                />
              </>
            )}
            
            {!filtersApplied.position && (
              <DemoCarousel 
                title="AWP Plays" 
                demos={getFilteredDemosByPosition("AWPer")} 
              />
            )}
          </>
        )}
        
        {!isLoading && activeTab === 'trending' && (
          <DemoCarousel 
            title="Trending POVs"
            demos={trendingDemos} 
            description="Most viewed demos right now"
          />
        )}
        
        {!isLoading && activeTab === 'latest' && (
          <DemoCarousel 
            title="Latest Uploads"
            demos={latestDemos} 
            description="Fresh POV content from this year"
          />
        )}
        
        {!isLoading && activeTab === 'awp' && (
          <DemoCarousel 
            title="AWP Highlights"
            demos={getFilteredDemosByPosition("AWPer")} 
            description="Best AWP plays from top players"
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
          />
        )}
        
        {/* Maps grid with proper spacing */}
        {!isLoading && (
          <div className="mt-16 mb-12">
            <h2 className="text-2xl font-bold text-white mb-8">
              <span className="border-l-4 border-yellow-400 pl-3 py-1">Browse Maps</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filterOptions.maps.slice(0, 8).map(map => (
                <div 
                  key={map}
                  className="relative overflow-hidden h-36 rounded-xl cursor-pointer group"
                  onClick={() => {
                    setFiltersApplied(prev => ({
                      ...prev,
                      map: map
                    }));
                  }}
                >
                  <img 
                    src="https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true" 
                    alt={map} 
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-yellow-400 z-0"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="text-white font-bold text-lg mb-2">{map}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-yellow-400 font-medium">
                        {getFilteredDemosByMap(map).length} POVs
                      </span>
                      <span className="text-xs text-gray-300 group-hover:text-white transition-colors">View &rarr;</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Footer with cleaner design */}
      <footer className="bg-gray-800 py-10 border-t border-gray-700">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-black mb-2">
                <span className="text-yellow-400">POV</span>
                <span className="text-white">lib</span>
                <span className="text-gray-400 text-lg">.gg</span>
              </h2>
              <p className="text-gray-400 text-sm">The ultimate CS2 Pro-POV library</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-6">
              <div>
                <h3 className="text-white font-bold mb-3">Navigation</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Home</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Maps</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Players</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Events</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-bold mb-3">Categories</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Pro POVs</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Community Demos</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Trending Content</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">New Uploads</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-bold mb-3">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Privacy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-xs mb-4 md:mb-0">© 2025 POVlib.gg - All rights reserved</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
                  <img src="https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true" className="w-4 h-4 rounded-full" />
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
                  <img src="https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true" className="w-4 h-4 rounded-full" />
                </div>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
                  <img src="https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true" className="w-4 h-4 rounded-full" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Modals */}
      {isFilterModalOpen && <FilterModal />}
      {selectedDemo && <VideoPlayerModal />}
      {isTaggingModalOpen && selectedDemo && <TaggingModal />}
    </div>
  );
};

export default POVlib;