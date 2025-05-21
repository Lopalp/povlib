import React, { useState, useEffect } from 'react';
import { Play, Filter, ChevronDown, Star } from 'lucide-react';
import YouTubeEmbed from './YouTubeEmbed';

const FeaturedHero = ({ 
  demo, 
  autoplayVideo, 
  setSelectedDemo, 
  setActiveVideoId, 
  setIsFilterModalOpen 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, [demo]);

  if (!demo) return null;

  // Generate a dynamic description based on demo data
  const generateDescription = () => {
    let description = `Experience top-tier CS2 gameplay featuring ${demo.players.join(', ')} on ${demo.map}. `;
    
    if (demo.team) {
      description += `Watch how ${demo.team} players demonstrate professional `;
    } else {
      description += 'Watch professional ';
    }
    
    if (demo.positions && demo.positions.length > 0) {
      description += `positioning for ${demo.positions.join(' and ')} roles. `;
    } else {
      description += 'positioning and game sense. ';
    }
    
    if (demo.tags && demo.tags.length > 0) {
      description += `This POV highlights ${demo.tags.join(', ')} techniques that can elevate your gameplay.`;
    } else {
      description += 'Learn strategies and techniques directly from the pros.';
    }
    
    return description;
  };

  const description = generateDescription();

  return (
    <div className="relative h-[70vh] min-h-[550px] w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 group">
      {/* Background video with overlay */}
      <div className="absolute inset-0 overflow-hidden transition-all duration-700 ">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-yellow-400/5 mix-blend-overlay z-5"></div>
        <div className={`absolute inset-0 transition-all duration-1000 ${isVisible ? 'opacity-60' : 'opacity-0'}`}>
          <YouTubeEmbed 
            videoId={demo.videoId} 
            title={demo.title} 
            autoplay={autoplayVideo} 
            controls={false}
            showInfo={false}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-300/10 via-transparent to-transparent z-5"></div>
      
      {/* Content Overlay */}
      <div className="relative z-20 container mx-auto h-full flex items-center px-8">
        <div className={`max-w-2xl transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-6 space-y-2">
            
            <div className="flex flex-wrap items-center gap-3 mb-4 animate-fadeIn">
              <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-sm font-bold rounded">
                {demo.map}
              </span>
              {demo.team && (
                <span className="px-3 py-1 bg-gray-800/80 border border-yellow-400/50 text-yellow-400 text-sm rounded">
                  {demo.team}
                </span>
              )}
              {demo.event && (
                <span className="px-3 py-1 bg-gray-800/80 text-white text-sm rounded backdrop-blur-sm">
                  {demo.event}
                </span>
              )}
              <span className="px-3 py-1 bg-gray-800/80 text-white text-sm rounded backdrop-blur-sm">
                {demo.year}
              </span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 drop-shadow-sm">
            {demo.title}
          </h1>

          <div className="relative">
            <p className={`text-gray-300 text-lg max-w-xl mb-6 ${showFullDescription ? '' : 'line-clamp-2'} transition-all duration-300`}>
              {description}
            </p>
            {description.length > 120 && !showFullDescription && (
              <button 
                onClick={() => setShowFullDescription(true)}
                className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center gap-1 transition-colors"
              >
                Show more <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Player and position tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {demo.players.map((player, index) => (
              <span key={`player-${index}`} className="text-xs bg-gray-800/60 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-400/20 backdrop-blur-sm">
                {player}
              </span>
            ))}
            {demo.positions && demo.positions.slice(0, 2).map((position, index) => (
              <span key={`pos-${index}`} className="text-xs bg-gray-800/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                {position}
              </span>
            ))}
             {demo.team && (
                 <span className="text-xs bg-gray-800/60 border border-yellow-400/50 text-yellow-400 px-2 py-0.5 rounded backdrop-blur-sm">
                 {demo.team}
               </span>)}
          
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button 
              onClick={() => {
                setSelectedDemo(demo);
                setActiveVideoId(demo.videoId);
              }}
              className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-md hover:bg-yellow-300 transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.5)] flex items-center group"
            >
              <Play className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:scale-110" fill="currentColor" />
              Watch Full POV  
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="px-6 py-3 bg-gray-800/40 backdrop-blur-sm text-white rounded-md hover:bg-gray-700 border border-gray-700 hover:border-yellow-400/30 transition-all duration-300 flex items-center"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filter POVs
            </button>
          </div>
          
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
    </div>
  );
};

export default FeaturedHero;