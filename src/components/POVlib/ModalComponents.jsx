'use client';

import React, { useState } from 'react';
import { X, Tag, Filter, Map, Users, Calendar, Trophy, Check, Eye, Heart } from 'lucide-react';
import { YouTubeEmbed } from './DemoComponents';

// Professional Video Player Modal
export const VideoPlayerModal = ({ 
  selectedDemo, 
  setSelectedDemo, 
  activeVideoId, 
  setActiveVideoId, 
  handleLikeDemo, 
  setIsTaggingModalOpen 
}) => {
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
export const TaggingModal = ({ 
  selectedDemo, 
  setIsTaggingModalOpen, 
  handleUpdateTags, 
  handleUpdatePositions, 
  filterOptions 
}) => {
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
export const FilterModal = ({ 
  setIsFilterModalOpen, 
  filterOptions, 
  filtersApplied, 
  setFiltersApplied, 
  demoType, 
  setDemoType 
}) => {
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