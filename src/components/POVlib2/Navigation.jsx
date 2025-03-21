'use client';

import React from 'react';
import { Search, Filter, Menu, X } from 'lucide-react';

// Navbar component
export const Navbar = ({ 
  searchActive, 
  setSearchActive, 
  searchQuery, 
  setSearchQuery, 
  demoType, 
  setDemoType, 
  isMenuOpen, 
  setIsMenuOpen, 
  setIsFilterModalOpen,
  filtersApplied,
  setFiltersApplied
}) => {
  return (
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setFiltersApplied(prev => ({...prev, search: e.target.value}));
                  }}
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
  );
};

// Selected filters display component
export const SelectedFilters = ({ filtersApplied, setFiltersApplied, searchQuery }) => {
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

// Content tabs component
export const ContentTabs = ({ activeTab, setActiveTab }) => {
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