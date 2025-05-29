import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Eye, Heart, Tag, Share2, Flag, Bookmark, 
  ThumbsUp, ChevronDown, ChevronRight, MapPin, Shield, Play
} from 'lucide-react';
import YouTubeEmbed from './YouTubeEmbed';
import DemoCard from './DemoCard';
import Navbar from './Navbar';
import Footer from './Footer';

const VideoPlayerPage = ({ 
  selectedDemo, 
  relatedDemos = [], 
  onClose, 
  onLike, 
  onOpenTagModal,
  onSelectRelatedDemo,
  demoType = 'pro',
  setDemoType = () => {},
  searchActive = false,
  setSearchActive = () => {},
  isMenuOpen = false,
  setIsMenuOpen = () => {}
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [playerInfo, setPlayerInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  if (!selectedDemo) return null;

  // Generate a dynamic description based on demo data
  const generateDescription = () => {
    let description = `Experience top-tier CS2 gameplay featuring ${selectedDemo.players.join(', ')} on ${selectedDemo.map}. `;
    
    if (selectedDemo.team) {
      description += `Watch how ${selectedDemo.team} players demonstrate professional `;
    } else {
      description += 'Watch professional ';
    }
    
    if (selectedDemo.positions && selectedDemo.positions.length > 0) {
      description += `positioning for ${selectedDemo.positions.join(' and ')} roles. `;
    } else {
      description += 'positioning and game sense. ';
    }
    
    if (selectedDemo.tags && selectedDemo.tags.length > 0) {
      description += `This POV highlights ${selectedDemo.tags.join(', ')} techniques that can elevate your gameplay.`;
    } else {
      description += 'Learn strategies and techniques directly from the pros.';
    }
    
    return description;
  };

  const description = generateDescription();
  
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
      
      <div className="bg-gray-900">
      <div style={{height: "3rem"}}></div>
        <div className="container mx-auto px-4 pt-6 pb-12">
 <div className="flex items-center gap-4 mb-4">
 <button 
 onClick={onClose}
 className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
 style={{cursor: "pointer"}}
 >
 <ArrowLeft className="h-5 w-5 mr-2" />
 Back to Browse
 </button>
 <Link href="/videoplaypagecopy">
 <button 
 className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
 style={{cursor: "pointer"}}
 >
 Go to Copy Page
 </button>
 </Link>
 </div>
          
          
          <div style={{height: "1rem"}}></div>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video Player Section (Left) */}
            <div className="lg:w-8/12">
              {/* Video Player */}
              <div className="rounded-lg overflow-hidden bg-black shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                    <YouTubeEmbed 
                      videoId={selectedDemo.video_id} 
                      title={selectedDemo.title} 
                      autoplay={true} 
                      controls={true}
                      showInfo={false}
                    />
              </div>
              
              {/* Video Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 py-4 border-t border-b border-gray-800">
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => {
                        try {
                          onLike(selectedDemo.id);
                        } catch (error) {
                          console.log("Error liking demo:", error);
                          // Don't break the UI, just log the error
                        }
                      }}
                      className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span>{selectedDemo.likes}</span>
                    </button>
                    
                    <button 
                      onClick={onOpenTagModal}
                      className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <Tag className="h-5 w-5" />
                      <span>Tag</span>
                    </button>
                    
                    <button className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors">
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </button>
                    
                    <button className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors">
                      <Bookmark className="h-5 w-5" />
                      <span>Save</span>
                    </button>
                  </div>
                  
                  <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Flag className="h-5 w-5" />
                    <span>Report</span>
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <h1 className="text-2xl font-bold text-white mb-2">{selectedDemo.title}</h1>
                
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="flex items-center text-gray-400">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{selectedDemo.views?.toLocaleString()} views</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{selectedDemo.year}</span>
                  {selectedDemo.event && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-yellow-400">{selectedDemo.event}</span>
                    </>
                  )}
                </div>
                
                {/* Video Details */}
                <div className="flex flex-col md:flex-row gap-6 mt-6">
                  {/* Left Column - Details */}
                  <div className="md:w-2/3">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-4 mb-4 border border-gray-700">
                      <div className="relative">
                        <p className={`text-gray-300 ${showFullDescription ? '' : 'line-clamp-3'}`}>
                          {description}
                        </p>
                        {description.length > 240 && !showFullDescription && (
                          <button 
                            onClick={() => setShowFullDescription(true)}
                            className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center gap-1 transition-colors mt-2"
                          >
                            Show more <ChevronDown className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Additional Features and Featured Players Section */}
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      {/* Additional Features */}
                      <div className="md:w-1/2 bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-white font-medium mb-3 flex items-center text-sm">
                          <Tag className="h-4 w-4 mr-2 text-yellow-400" />
                          Additional Features
                        </h3>
                        <div className="space-y-2 text-xs">
                          {/* Download .dem button placeholder */}
                          <button className="bg-gray-700 text-white font-bold py-1 px-3 rounded hover:bg-gray-600 transition-colors w-full text-left flex items-center justify-between">
                            <span>Download .dem</span>
                            <ChevronRight className="ml-auto h-3 w-3 text-gray-500" />
                          </button>
                          {/* Matchroom button placeholder */}
                          <button className="bg-gray-700 text-white font-bold py-1 px-3 rounded hover:bg-gray-600 transition-colors w-full text-left flex items-center justify-between">
                            <span>Go to Matchroom</span>
                            <ChevronRight className="ml-auto h-3 w-3 text-gray-500" />
                          </button>
                        </div>
                        {/* Utilities list placeholder */}
                        <p className="text-gray-400 text-xs mt-3">Utilities Used: Placeholder</p>
                      </div>

                      {/* Featured Players - Placed next to Additional Features */}
                      <div className="md:w-1/2 bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-white font-medium mb-3 flex items-center text-sm">
                          <Shield className="h-4 w-4 mr-2 text-yellow-400" />
                          Featured Players
                        </h3>
                        <div className="space-y-3 text-xs">
                          {selectedDemo.players.map((player, idx) => (
                            <Link
                              href={`/players/${player.replace(/\s+/g, '-').toLowerCase()}`}
                              key={idx}
                              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
                            >
                              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-yellow-400 font-bold text-xs">
                                {player.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-medium">{player}</p>
                                {selectedDemo.team && (
                                  <p className="text-gray-400 text-xs">{selectedDemo.team}</p>
                                )}
                              </div>
                              <ChevronRight className="ml-auto h-3 w-3 text-gray-500" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Original Map, Team, Event, Year, POV Type badges - Keep these */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-4 mb-6 border border-gray-700">
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
                    </div>


                    {/* Removed Positions and Tags sections - they are now part of the description */}
                    {/*
                    <div className="mb-6">
                      <h3 className="text-gray-300 text-sm font-medium mb-2">Positions:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDemo.positions.map((position, i) => (
                          <span 
                            key={i} 
                            className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer flex items-center"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            {position}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-gray-300 text-sm font-medium mb-2">Tags:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDemo.tags.map((tag, i) => (
                          <span key={i} className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    */}

                    {/* Map, Team, Event, Year, POV Type badges - These are now kept */}

                          </Link>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <h4 className="text-white text-sm mb-2">More from this map</h4>
                        <Link
                          href={`/?map=${selectedDemo.map}`}
                          className="text-sm bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 px-3 py-2 rounded w-full flex items-center justify-between"
                        >
                          <span>Browse {selectedDemo.map} POVs</span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Related Videos Section (Right) */}
            <div className="lg:w-4/12 mt-6 lg:mt-0">
              <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-4 border border-gray-700">
                <h2 className="text-white font-bold mb-4 flex items-center">
                  <span className="w-1 h-4 bg-yellow-400 mr-2"></span>
                  Related POVs
                </h2>
                <div className="space-y-4">
                  {relatedDemos.map(demo => (
                    <div 
                      key={demo.id} 
                      className="flex gap-3 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-colors"
                      onClick={() => onSelectRelatedDemo(demo)}
                    >
                      <div className="w-40 h-24 rounded-lg overflow-hidden relative group flex-shrink-0">
                        <img 
                          src={demo.thumbnail} 
                          alt={demo.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="rounded-full bg-yellow-400/80 p-2">
                            <Play className="h-4 w-4 text-gray-900" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm line-clamp-2">{demo.title}</h3>
                        <div className="text-gray-400 text-xs mt-1">
                          {demo.players.join(', ')}
                        </div>
                        <div className="flex items-center text-gray-500 text-xs mt-2">
                          <span>{demo.views.toLocaleString()} views</span>
                          <span className="mx-1">•</span>
                          <span>{demo.map}</span>
                          <div className="ml-auto flex items-center text-yellow-400">
                            <Heart className="h-3 w-3 mr-1" />
                            <span>{demo.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {relatedDemos.length === 0 && (
                    <div className="text-gray-400 text-center py-8">
                      No related videos available
                    </div>
                  )}
                </div>
                
                {/* Browse more section */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <h3 className="text-white text-sm mb-3">Browse more POVs</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDemo.players.slice(0, 1).map(player => (
                      <Link 
                        key={player}
                        href={`/players/${player.replace(/\s+/g, '-').toLowerCase()}`}
                        className="bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 text-white text-sm py-2 px-3 rounded text-center transition-colors"
                      >
                        {player}'s POVs
                      </Link>
                    ))}
                    {selectedDemo.map && (
                      <Link 
                        href={`/?map=${selectedDemo.map}`}
                        className="bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 text-white text-sm py-2 px-3 rounded text-center transition-colors"
                      >
                        {selectedDemo.map} POVs
                      </Link>
                    )}
                    {selectedDemo.positions[0] && (
                      <Link 
                        href={`/?position=${selectedDemo.positions[0]}`}
                        className="bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 text-white text-sm py-2 px-3 rounded text-center transition-colors"
                      >
                        {selectedDemo.positions[0]} POVs
                      </Link>
                    )}
                    {selectedDemo.team && (
                      <Link 
                        href={`/?team=${selectedDemo.team}`}
                        className="bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 text-white text-sm py-2 px-3 rounded text-center transition-colors"
                      >
                        {selectedDemo.team} POVs
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VideoPlayerPage;