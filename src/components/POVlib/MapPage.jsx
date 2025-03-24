'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, ChevronLeft, ChevronRight, Filter, 
  User, Trophy, Info, Eye, Server, Tag
} from 'lucide-react';

import Navbar from './Navbar';
import Footer from './Footer';
import DemoCard from './DemoCard';
import VideoPlayerPage from './VideoPlayerPage';
import TaggingModal from './TaggingModal';
import FilterModal from './FilterModal';
import DemoCarousel from './DemoCarousel';

import {
  getDemosByMap,
  getFilterOptions,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions
} from '@/lib/supabase';

const MapPage = ({ mapName }) => {
  // Format map name for display (capitalize first letter)
  const formattedMapName = mapName.charAt(0).toUpperCase() + mapName.slice(1);
  
  // State
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [allDemos, setAllDemos] = useState([]);
  const [demosByPosition, setDemosByPosition] = useState({});
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [relatedDemos, setRelatedDemos] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchActive, setSearchActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [demoType, setDemoType] = useState('all');
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  
  // Filter states
  const [filtersApplied, setFiltersApplied] = useState({
    position: '',
    player: '',
    team: '',
    year: '',
    event: '',
    result: '',
  });
  const [filterOptions, setFilterOptions] = useState({
    positions: {},
    teams: [],
    years: [],
    events: [],
    results: [],
    players: []
  });
  
  // Map description placeholder data - in a real app, this would come from an API
  const mapDescriptions = {
    mirage: {
      description: "Mirage is a classic Counter-Strike map set in Morocco that features a balanced layout with two bombsites. The map has an open mid area that connects to both sites, offering multiple rotation options and strategic depth. A-site is more open with several entry points, while B-site is more confined, accessible primarily through apartments or a narrow passage from mid.",
      callouts: ["A Site", "B Site", "Mid", "Palace", "Apartments", "CT Spawn", "T Spawn", "Connector", "Jungle", "Window", "Underpass", "B Halls", "Market", "Catwalk", "Ticket Booth", "Firebox", "Ninja", "Dark", "Van", "Bench", "Chair", "Stairs", "Ramp", "Triple Box"],
      strategy: "Mirage requires careful mid control and effective rotations. T-side usually focuses on securing mid control to split defenses, while CT-side often relies on crossfires and smart utility usage. AWPers commonly hold mid from window or connector, or watch palace/A ramp from ticket booth."
    },
    inferno: {
      description: "Inferno is set in a Mediterranean town with narrow corridors and chokepoints. The map features two bombsites, with B site accessible via the infamous 'Banana' corridor, and A site approached through apartments or a mid split. The confined spaces make utility usage crucial for both attackers and defenders.",
      callouts: ["A Site", "B Site", "Banana", "Mid", "Apartments", "Pit", "Graveyard", "Library", "Arch", "CT Spawn", "T Spawn", "Second Mid", "Boiler", "Dark", "New Box", "Orange", "Construction", "Ruins", "Coffins", "Logs", "Car", "Sandbags"],
      strategy: "Control of Banana is crucial for both teams. T-side often uses flashbangs and molotovs to clear tight angles, while CT-side focuses on crossfires and fall-back positions. Utility management is especially important on Inferno due to its narrow pathways."
    },
    ancient: {
      description: "Ancient is a newer addition to CS2, featuring a temple theme with two bombsites. It has a compact layout with multiple pathways between areas. The mid area offers crucial control points, while both bombsites have unique defensive setups. The map features several elevation changes and tight corridors.",
      callouts: ["A Site", "B Site", "Mid", "Donut", "Temple", "Cave", "Main", "Ramp", "CT Spawn", "T Spawn", "Snake", "Alley", "Water", "Tunnel", "Street", "Jungle"],
      strategy: "Ancient rewards methodical play and good utility usage. T-side often focuses on gaining mid control before committing to a site, while CT-side relies on crossfires and well-timed rotations. The tight corridors make flashbangs especially effective."
    },
    nuke: {
      description: "Nuke is a unique two-level map set in a nuclear facility, with bombsite A on the upper floor and bombsite B directly below it on the lower floor. The unique vertical gameplay creates complex rotation dynamics and requires specific strategies. The outdoor area offers long sightlines for AWPers.",
      callouts: ["A Site", "B Site", "Outside", "Ramp", "Secret", "Lobby", "Heaven", "Hell", "Rafters", "Radio", "Silo", "Garage", "T Spawn", "CT Spawn", "Vents", "Catwalk", "Marshmallow", "Trophy", "Squeaky"],
      strategy: "Nuke heavily favors the CT-side due to quick rotation options between sites. T-side strategies often involve splitting between outside and ramp, or using vents for sneaky B-site executes. Sound cues are critical on Nuke due to its vertical layout."
    },
    overpass: {
      description: "Overpass is set in a canal overpass in Berlin, featuring two distinct areas - a park area for A site and an underground canal area for B site. The map has multiple elevation changes and unique rotation paths. The long sightlines at A and tight spaces at B create varied gameplay.",
      callouts: ["A Site", "B Site", "Long", "Monster", "Connector", "Bank", "Bathrooms", "Playground", "Short", "Heaven", "Water", "Sewers", "Bridge", "Park", "Fountain", "Construction", "Pillar", "Truck", "Toxic"],
      strategy: "Overpass is CT-sided at higher levels of play. T-side strategies often involve gaining control of connector or water for mid-round rotations. Fast B executes through monster and unique boosts are common tactics on this map."
    },
    anubis: {
      description: "Anubis is one of the newer maps in the competitive pool, featuring an Egyptian theme. It has two bombsites with multiple approaches to each. The layout includes a mixed of open areas and tight corridors, with a complex mid section that offers various tactical options.",
      callouts: ["A Site", "B Site", "Mid", "Palace", "Canal", "Connector", "Street", "Bridge", "Alley", "CT Spawn", "T Spawn", "Garden", "Heaven", "Tunnels", "Fountain"],
      strategy: "As a newer map, Anubis strategies are still evolving. The mid area offers crucial control for both teams. T-side often uses mid to split defenses, while CT-side must balance resources between multiple entry points to both sites."
    },
    vertigo: {
      description: "Vertigo is set on a skyscraper construction site, with both bombsites located on the same level but separated by a central area. The map features unique height advantages and fall hazards. The tight corridors and limited rotation options create intense firefights.",
      callouts: ["A Site", "B Site", "Mid", "CT Spawn", "T Spawn", "Ramp", "Ladder", "Scaffold", "Elevator", "Heaven", "Catwalk", "Electric", "Generator", "Window", "Sandbags"],
      strategy: "Vertigo favors quick executes and close-quarters combat. T-side often relies on fast A executes or mid control to enable B splits. CT rotations are critical as the map can be difficult to retake once a site is lost."
    },
    dust2: {
      description: "Dust2 is the most iconic Counter-Strike map, featuring a simple but balanced design. It has two bombsites, with A accessible via long doors and short, and B via the famous B tunnels. The mid area connects to both sites and offers crucial control options.",
      callouts: ["A Site", "B Site", "Long", "Short", "Mid", "Cat", "Tunnels", "Doors", "CT Spawn", "T Spawn", "Lower Tunnels", "Upper Tunnels", "Pit", "Car", "Goose", "Platform", "Suicide", "Xbox", "Blue"],
      strategy: "Dust2 is considered one of the most balanced maps. T-side often focuses on gaining long control or establishing mid presence for splits. The AWP is particularly powerful on this map due to the long sightlines at mid, long, and B doors."
    }
  };
  
  // Ref for the map section (for scrolling)
  const mapSectionRef = useRef(null);
  
  // Load map data and demos
  useEffect(() => {
    const loadMapData = async () => {
      try {
        setIsLoading(true);
        
        // Get map info from our placeholder data
        const mapInfo = mapDescriptions[mapName];
        if (!mapInfo) {
          setError('Map not found');
          setIsLoading(false);
          return;
        }
        
        setMap({
          name: formattedMapName,
          ...mapInfo
        });
        
        // Load filter options
        const options = await getFilterOptions();
        setFilterOptions({
          positions: options.positions || {},
          teams: options.teams || [],
          years: options.years || [],
          events: options.events || [],
          results: options.results || [],
          players: options.players || []
        });
        
        // Load demos for this map
        const demosData = await getDemosByMap(formattedMapName);
        
        // Map the data
        const mappedDemos = demosData.map(demo => ({
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
        
        setAllDemos(mappedDemos);
        
        // Group demos by position
        const demosByPos = {};
        if (options.positions && options.positions[formattedMapName]) {
          options.positions[formattedMapName].forEach(position => {
            const positionDemos = mappedDemos.filter(demo => 
              demo.positions.includes(position)
            );
            if (positionDemos.length > 0) {
              demosByPos[position] = positionDemos;
            }
          });
        }
        setDemosByPosition(demosByPos);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading map data:', err);
        setError('Failed to load map data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    loadMapData();
  }, [mapName, formattedMapName]);
  
  // Handler functions
  const handleSelectDemo = (demo) => {
    setSelectedDemo(demo);
    setIsVideoPlayerOpen(true);
    // Find related demos (other demos on this map with similar positions or players)
    const related = allDemos.filter(d => 
      d.id !== demo.id && (
        d.positions.some(p => demo.positions.includes(p)) ||
        d.players.some(p => demo.players.includes(p))
      )
    );
    setRelatedDemos(related.slice(0, 10));
    
    // Update view count
    updateDemoStats(demo.id, 'views', 1).catch(err => 
      console.error('Error updating views:', err)
    );
    
    window.scrollTo(0, 0);
  };
  
  const handleCloseVideoPlayer = () => {
    setSelectedDemo(null);
    setIsVideoPlayerOpen(false);
  };
  
  const handleUpdateTags = async (demoId, tags) => {
    try {
      const result = await updateDemoTags(demoId, tags);
      if (result.success) {
        const updatedDemo = {
          ...result.demo,
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
        
        // Update demos state
        setAllDemos(prev => 
          prev.map(demo => demo.id === demoId ? { ...demo, tags: updatedDemo.tags } : demo)
        );
        
        // Update demos by position
        const updatedDemosByPosition = { ...demosByPosition };
        Object.keys(updatedDemosByPosition).forEach(position => {
          updatedDemosByPosition[position] = updatedDemosByPosition[position].map(demo =>
            demo.id === demoId ? { ...demo, tags: updatedDemo.tags } : demo
          );
        });
        setDemosByPosition(updatedDemosByPosition);
        
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
        const updatedDemo = {
          ...result.demo,
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
        
        // Update demos state
        setAllDemos(prev => 
          prev.map(demo => demo.id === demoId ? { ...demo, positions: updatedDemo.positions } : demo)
        );
        
        // Update demos by position (this needs a complete rebuild since positions changed)
        const updatedDemosByPosition = {};
        const updatedAllDemos = allDemos.map(demo => 
          demo.id === demoId ? { ...demo, positions: updatedDemo.positions } : demo
        );
        
        if (filterOptions.positions && filterOptions.positions[formattedMapName]) {
          filterOptions.positions[formattedMapName].forEach(position => {
            const positionDemos = updatedAllDemos.filter(demo => 
              demo.positions.includes(position)
            );
            if (positionDemos.length > 0) {
              updatedDemosByPosition[position] = positionDemos;
            }
          });
        }
        setDemosByPosition(updatedDemosByPosition);
        
        // Update selected demo if it's the one that was updated
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, positions: updatedDemo.positions });
        }
      }
    } catch (err) {
      console.error('Error updating positions:', err);
    }
  };
  
  const handleLikeDemo = async (demoId) => {
    try {
      const result = await updateDemoStats(demoId, 'likes', 1);
      if (result.success) {
        const updatedDemo = {
          ...result.demo,
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
        
        // Update demos state
        setAllDemos(prev => 
          prev.map(demo => demo.id === demoId ? { ...demo, likes: updatedDemo.likes } : demo)
        );
        
        // Update demos by position
        const updatedDemosByPosition = { ...demosByPosition };
        Object.keys(updatedDemosByPosition).forEach(position => {
          updatedDemosByPosition[position] = updatedDemosByPosition[position].map(demo =>
            demo.id === demoId ? { ...demo, likes: updatedDemo.likes } : demo
          );
        });
        setDemosByPosition(updatedDemosByPosition);
        
        // Update selected demo if it's the one that was liked
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, likes: updatedDemo.likes });
        }
      }
    } catch (err) {
      console.error('Error liking demo:', err);
    }
  };
  
  const handleSwitchDemoType = (type) => setDemoType(type);
  
  const handleResetFilters = () => setFiltersApplied({
    position: '',
    player: '',
    team: '',
    year: '',
    event: '',
    result: '',
  });
  
  const handleApplyFilters = () => setIsFilterModalOpen(false);
  
  const handleSelectRelatedDemo = (demo) => {
    setSelectedDemo(demo);
    // Find related demos
    const related = allDemos.filter(d => 
      d.id !== demo.id && (
        d.positions.some(p => demo.positions.includes(p)) ||
        d.players.some(p => demo.players.includes(p))
      )
    );
    setRelatedDemos(related.slice(0, 10));
    
    updateDemoStats(demo.id, 'views', 1).catch(err => 
      console.error('Error updating views:', err)
    );
    
    window.scrollTo(0, 0);
  };
  
  const scrollToMapSection = () => {
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // If we're showing the video player
  if (isVideoPlayerOpen && selectedDemo) {
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
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading map data...</p>
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
      
      {/* Map Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        
        <div className="container mx-auto px-6 pt-32 pb-16 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">{formattedMapName}</h1>
            
            <p className="text-gray-300 text-lg mb-8">
              {map.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setActiveTab('overview');
                  scrollToMapSection();
                }}
                className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Map Overview
              </button>
              
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="px-6 py-3 bg-gray-800/40 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700 border border-gray-700 hover:border-yellow-400/30 transition-all flex items-center"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filter POVs
              </button>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-2">
              <div className="flex items-center bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Eye className="h-4 w-4 mr-2 text-yellow-400" />
                <div>
                  <div className="text-white font-bold">{allDemos.length}</div>
                  <div className="text-gray-400 text-xs">POV Demos</div>
                </div>
              </div>
              
              <div className="flex items-center bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
                <div>
                  <div className="text-white font-bold">{Object.keys(demosByPosition).length}</div>
                  <div className="text-gray-400 text-xs">Positions</div>
                </div>
              </div>
              
              <div className="flex items-center bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <User className="h-4 w-4 mr-2 text-yellow-400" />
                <div>
                  <div className="text-white font-bold">
                    {new Set(allDemos.flatMap(demo => demo.players)).size}
                  </div>
                  <div className="text-gray-400 text-xs">Pro Players</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-16 z-30">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto custom-scrollbar">
            <button
              className={`px-4 py-4 text-sm font-bold whitespace-nowrap ${
                activeTab === 'overview' 
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Map Overview
            </button>
            <button
              className={`px-4 py-4 text-sm font-bold whitespace-nowrap ${
                activeTab === 'callouts' 
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('callouts')}
            >
              Callouts
            </button>
            <button
              className={`px-4 py-4 text-sm font-bold whitespace-nowrap ${
                activeTab === 'positions' 
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('positions')}
            >
              Positions
            </button>
            <button
              className={`px-4 py-4 text-sm font-bold whitespace-nowrap ${
                activeTab === 'all-demos' 
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('all-demos')}
            >
              All POVs
            </button>
            <button
              className={`px-4 py-4 text-sm font-bold whitespace-nowrap ${
                activeTab === 'strategies' 
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('strategies')}
            >
              Strategies
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 bg-pattern" ref={mapSectionRef}>
        {/* Map Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-6">
                  <span className="border-l-4 border-yellow-400 pl-3 py-1">About {formattedMapName}</span>
                </h2>
                
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                  <p className="text-gray-300 mb-4">{map.description}</p>
                  
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-yellow-400" />
                    Map Strategy
                  </h3>
                  <p className="text-gray-300 mb-6