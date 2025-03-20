'use client';

import React from 'react';
import { SelectedFilters, ContentTabs } from './Navigation';
import { DemoCarousel } from './DemoComponents';

// Main Content component
export const MainContent = ({ 
  activeTab, 
  isLoading, 
  filtersApplied, 
  setFiltersApplied, 
  filteredDemos, 
  trendingDemos, 
  latestDemos, 
  mapDemos, 
  getFilteredDemosByMap, 
  getFilteredDemosByPosition, 
  filterOptions, 
  searchQuery, 
  selectedDemo, 
  setSelectedDemo, 
  activeVideoId, 
  setActiveVideoId, 
  handleScroll, 
  scrollContainerRef,
  setActiveTab
}) => {
  return (
    <main className="container mx-auto px-6 py-12 bg-pattern">
      {/* Display selected filters */}
      <SelectedFilters 
        filtersApplied={filtersApplied} 
        setFiltersApplied={setFiltersApplied} 
        searchQuery={searchQuery}
      />
      
      {/* Content category tabs */}
      <ContentTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
      
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
            handleScroll={handleScroll}
            scrollContainerRef={scrollContainerRef}
            setSelectedDemo={setSelectedDemo}
            setActiveVideoId={setActiveVideoId}
          />
          
          {!filtersApplied.map && (
            <>
              <DemoCarousel 
                title="Mirage POVs" 
                demos={getFilteredDemosByMap("Mirage")} 
                handleScroll={handleScroll}
                scrollContainerRef={scrollContainerRef}
                setSelectedDemo={setSelectedDemo}
                setActiveVideoId={setActiveVideoId}
              />
              
              <DemoCarousel 
                title="Inferno POVs" 
                demos={getFilteredDemosByMap("Inferno")} 
                handleScroll={handleScroll}
                scrollContainerRef={scrollContainerRef}
                setSelectedDemo={setSelectedDemo}
                setActiveVideoId={setActiveVideoId}
              />
            </>
          )}
          
          {!filtersApplied.position && (
            <DemoCarousel 
              title="AWP Plays" 
              demos={getFilteredDemosByPosition("AWPer")} 
              handleScroll={handleScroll}
              scrollContainerRef={scrollContainerRef}
              setSelectedDemo={setSelectedDemo}
              setActiveVideoId={setActiveVideoId}
            />
          )}
        </>
      )}
      
      {!isLoading && activeTab === 'trending' && (
        <DemoCarousel 
          title="Trending POVs"
          demos={trendingDemos} 
          description="Most viewed demos right now"
          handleScroll={handleScroll}
          scrollContainerRef={scrollContainerRef}
          setSelectedDemo={setSelectedDemo}
          setActiveVideoId={setActiveVideoId}
        />
      )}
      
      {!isLoading && activeTab === 'latest' && (
        <DemoCarousel 
          title="Latest Uploads"
          demos={latestDemos} 
          description="Fresh POV content from this year"
          handleScroll={handleScroll}
          scrollContainerRef={scrollContainerRef}
          setSelectedDemo={setSelectedDemo}
          setActiveVideoId={setActiveVideoId}
        />
      )}
      
      {!isLoading && activeTab === 'awp' && (
        <DemoCarousel 
          title="AWP Highlights"
          demos={getFilteredDemosByPosition("AWPer")} 
          description="Best AWP plays from top players"
          handleScroll={handleScroll}
          scrollContainerRef={scrollContainerRef}
          setSelectedDemo={setSelectedDemo}
          setActiveVideoId={setActiveVideoId}
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
          handleScroll={handleScroll}
          scrollContainerRef={scrollContainerRef}
          setSelectedDemo={setSelectedDemo}
          setActiveVideoId={setActiveVideoId}
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
  );
};

// Footer component
export const Footer = () => {
  return (
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
  );
};