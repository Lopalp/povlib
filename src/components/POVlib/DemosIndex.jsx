'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, List, Grid3x3, Eye, Heart } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import DemoCard from './DemoCard';
import VideoPlayerModal from './VideoPlayerModal';
import TaggingModal from './TaggingModal';
import FilterModal from './FilterModal';
import SelectedFilters from './SelectedFilters';

import {
  getFilteredDemos,
  getFilterOptions,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions
} from '@/lib/supabase';

const DemosIndex = () => {
  // UI and Interaction States
  const [searchActive, setSearchActive] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Demo and Filter States
  const [demoType, setDemoType] = useState('all');
  const [demos, setDemos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  // Filter Options State
  const [filterOptions, setFilterOptions] = useState({
    maps: [],
    positions: {},
    teams: [],
    years: [],
    events: [],
    results: [],
    players: []
  });
  
  // Applied Filters State
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
  
  // Selected Demo and Modal States
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState('');
  
  // Infinite Scroll Ref
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
  }, [isLoading, hasMore]);
  
  // Initial Data Load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Load filter options
        const options = await getFilterOptions();
        setFilterOptions(options);
        
        // Load initial demos
        const initialDemos = await getFilteredDemos(
          { ...filtersApplied, search: searchQuery }, 
          demoType
        );
        
        // Map demo data
        const mappedDemos = initialDemos.map(mapDemoData);
        
        setDemos(mappedDemos);
        setHasMore(mappedDemos.length === 20);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load demos. Please try again later.');
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [demoType, filtersApplied, searchQuery]);
  
  // Demo Data Mapper
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
  
  // Load More Demos for Infinite Scroll
  const loadMoreDemos = async () => {
    if (!hasMore || isLoading) return;
    
    try {
      setIsLoading(true);
      const nextPage = page + 1;
      
      const moreDemos = await getFilteredDemos(
        { ...filtersApplied, search: searchQuery }, 
        demoType,
        nextPage
      );
      
      if (!moreDemos || moreDemos.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      
      const mappedDemos = moreDemos.map(mapDemoData);
      setDemos(prev => [...prev, ...mappedDemos]);
      setPage(nextPage);
      setHasMore(mappedDemos.length === 20);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading more demos:', err);
      setIsLoading(false);
    }
  };
  
  // Demo Selection Handlers
  const handleSelectDemo = (demo) => {
    setSelectedDemo(demo);
    setActiveVideoId(demo.videoId);
    
    // Update demo views
    updateDemoStats(demo.id, 'views', 1).catch(err => 
      console.error('Error updating views:', err)
    );
  };
  
  const handleCloseVideoPlayer = () => {
    setSelectedDemo(null);
    setActiveVideoId('');
  };
  
  const handleLikeDemo = async (demoId) => {
    try {
      const result = await updateDemoStats(demoId, 'likes', 1);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        
        setDemos(prev => 
          prev.map(demo => 
            demo.id === demoId 
              ? { ...demo, likes: updatedDemo.likes } 
              : demo
          )
        );
        
        // Update selected demo if it matches
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
        
        setDemos(prev => 
          prev.map(demo => 
            demo.id === demoId 
              ? { ...demo, tags: updatedDemo.tags } 
              : demo
          )
        );
        
        // Update selected demo if it matches
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
        
        setDemos(prev => 
          prev.map(demo => 
            demo.id === demoId 
              ? { ...demo, positions: updatedDemo.positions } 
              : demo
          )
        );
        
        // Update selected demo if it matches
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, positions: updatedDemo.positions });
        }
      }
    } catch (err) {
      console.error('Error updating positions:', err);
    }
  };
  
  // Search and Filter Handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Filter will be triggered by searchQuery useEffect
  };
  
  const handleResetFilters = () => {
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
  
  // Render Loading State
  if (isLoading && !demos.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading demos...</p>
        </div>
      </div>
    );
  }
  
  // Render Error State
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
      <Navbar 
        demoType={demoType}
        onSwitchDemoType={setDemoType}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      />
      
      {/* Hero Header */}
      <div className="relative py-16 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-yellow-400/5 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">CS2 POV Demos</h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Explore an extensive collection of professional and community CS2 point-of-view (POV) demos. Filter, discover, and learn from the best plays across all maps and events.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search demos by title, player, map, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pl-12 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-400"
              />
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              
              <button 
                type="button"
                onClick={() => setIsFilterModalOpen(true)}
                className="absolute right-3 top-3 p-1 bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 rounded-lg transition-colors"
              >
                <Filter className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Filter and View Controls */}
        <div className="flex justify-between items-center mb-8">
          <SelectedFilters 
            filtersApplied={filtersApplied} 
            setFiltersApplied={setFiltersApplied} 
            searchQuery={searchQuery} 
          />
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-800 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-yellow-400 text-gray-900' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-yellow-400 text-gray-900' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        {/* Demo Grid/List View */}
        {demos.length > 0 ? (
        <div className={`
            ${viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' 
            : 'space-y-4'
            }
        `}>
            {demos.map((demo, index) => {
            // For infinite scroll, attach ref to last element
            const isLastElement = index === demos.length - 1;
            
            // Render based on view mode
            return viewMode === 'grid' ? (
                <div 
                key={demo.id}
                ref={isLastElement ? lastDemoElementRef : null}
                >
                <DemoCard 
                    demo={demo} 
                    onSelect={handleSelectDemo} 
                />
                </div>
            ) : (
                <div 
                key={demo.id}
                ref={isLastElement ? lastDemoElementRef : null}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-400/30 transition-all"
                >
                <div className="flex">
                    <div className="w-64 h-40 overflow-hidden flex-shrink-0">
                    <img 
                        src={demo.thumbnail} 
                        alt={demo.title} 
                        className="w-full h-full object-cover"
                    />
                    </div>
                    <div className="flex-1 p-4">
                    <h3 className="text-white font-bold mb-2 line-clamp-2">{demo.title}</h3>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                        <span className="mr-2">{demo.map}</span>
                        <span>•</span>
                        <span className="ml-2">{demo.year}</span>
                        {demo.team && (
                        <>
                            <span className="mx-2">•</span>
                            <span>{demo.team}</span>
                        </>
                        )}
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                        Players: {demo.players.join(', ')}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {demo.views.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {demo.likes}
                        </div>
                    </div>
                    <div className="mt-2 flex space-x-2">
                        {demo.positions.slice(0, 2).map(position => (
                        <span 
                            key={position} 
                            className="px-2 py-1 bg-gray-700 text-xs rounded"
                        >
                            {position}
                        </span>
                        ))}
                    </div>
                    <button 
                        onClick={() => handleSelectDemo(demo)}
                        className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
                    >
                        Watch POV
                    </button>
                    </div>
                </div>
                </div>
            );
            })}
        </div>
        ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="text-yellow-400 text-6xl mb-4">¯\_(ツ)_/¯</div>
            <h3 className="text-white text-xl font-bold mb-2">No demos found</h3>
            <p className="text-gray-400">Try changing your search or filters</p>
            {(searchQuery || Object.values(filtersApplied).some(v => v)) && (
            <button 
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg"
            >
                Reset Filters
            </button>
            )}
        </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
        <div className="flex justify-center mt-8">
            <div className="w-10 h-10 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin"></div>
        </div>
        )}

        {/* End of list indicator */}
        {!hasMore && demos.length > 0 && (
        <div className="text-center my-12 py-6 border-t border-gray-800">
            <p className="text-gray-400">You've reached the end of available demos</p>
        </div>
        )}
        </main>

        {/* Video Player Modal */}
        {selectedDemo && (
        <VideoPlayerModal 
            selectedDemo={selectedDemo}
            activeVideoId={activeVideoId}
            onClose={handleCloseVideoPlayer}
            onLike={handleLikeDemo}
            onOpenTagModal={() => setIsTaggingModalOpen(true)}
        />
        )}

        {/* Tagging Modal */}
        {isTaggingModalOpen && selectedDemo && (
        <TaggingModal 
            selectedDemo={selectedDemo}
            filterOptions={filterOptions}
            onClose={() => setIsTaggingModalOpen(false)}
            onUpdateTags={handleUpdateTags}
            onUpdatePositions={handleUpdatePositions}
        />
        )}

        {/* Filter Modal */}
        {isFilterModalOpen && (
        <FilterModal 
            demoType={demoType}
            filterOptions={filterOptions}
            filtersApplied={filtersApplied}
            onClose={() => setIsFilterModalOpen(false)}
            onFilterChange={(changed) => setFiltersApplied(prev => ({ ...prev, ...changed }))}
            onResetFilters={handleResetFilters}
            onApplyFilters={() => setIsFilterModalOpen(false)}
        />
        )}

        <Footer />
        </div>
        );
        };

        export default DemosIndex;