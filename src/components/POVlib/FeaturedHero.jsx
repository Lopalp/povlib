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

  // Dynamische Beschreibung basierend auf Demo-Daten
  const generateDescription = () => {
    let description = `Experience top-tier CS2 gameplay featuring ${demo.players.join(', ')} on ${demo.map}. `;
    description += demo.team
      ? `Watch how ${demo.team} players demonstrate professional `
      : 'Watch professional ';
    description += demo.positions && demo.positions.length > 0
      ? `positioning for ${demo.positions.join(' and ')} roles. `
      : 'positioning and game sense. ';
    description += demo.tags && demo.tags.length > 0
      ? `This POV highlights ${demo.tags.join(', ')} techniques that can elevate your gameplay.`
      : 'Learn strategies and techniques directly from the pros.';
    return description;
  };

  const description = generateDescription();

  return (
    <div className="relative h-[70vh] min-h-[550px] w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
      {/* Video-Bereich: Auf Desktop wird das Video rechts angezeigt */}
      <div className="hidden md:block absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <YouTubeEmbed 
            videoId={demo.videoId} 
            title={demo.title} 
            autoplay={autoplayVideo} 
            controls={false}
            showInfo={false}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Gradient-Fade am linken Rand des Video-Bereichs */}
        <div 
          className="absolute top-0 bottom-0 left-0 w-full" 
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 40%)' }}
        ></div>
      </div>
      
      {/* Inhalt (Text) – links ausgerichtet */}
      <div className="relative z-20 container mx-auto h-full flex items-center px-8">
        <div className="w-full md:w-1/2">
          <div className={`max-w-2xl transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-yellow-400 text-gray-900 font-bold rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  <Star className="w-3 h-3" /> FEATURED
                </span>
              </div>
              
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
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 drop-shadow-sm">
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
            
            {/* Spieler-Tags und gefilterte Positions-Tags (ohne "AWPer" und "Rifle") */}
            <div className="mt-8 flex flex-wrap gap-2">
              {demo.players.map((player, index) => (
                <span key={`player-${index}`} className="text-sm bg-gray-800/60 text-yellow-400 px-3 py-1 rounded-full border border-yellow-400/20 backdrop-blur-sm">
                  {player}
                </span>
              ))}
              {demo.positions && demo.positions
                .filter(position => !['AWPer', 'Rifle'].includes(position))
                .slice(0, 2)
                .map((position, index) => (
                  <span key={`pos-${index}`} className="text-sm bg-gray-800/60 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                    {position}
                  </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Unterer Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
    </div>
  );
};

export default FeaturedHero;
