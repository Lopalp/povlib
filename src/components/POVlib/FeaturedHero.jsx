import React, { useState, useEffect } from 'react';
import { Play, Filter, ChevronDown } from 'lucide-react';
import YouTubeEmbed from './YouTubeEmbed';

const FeaturedHero = ({
  demo,
  autoplayVideo,
  setSelectedDemo,
  setActiveVideoId,
  setIsFilterModalOpen,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, [demo]);

  if (!demo) return null;

  const generateDescription = () => {
    let description = `Experience top-tier CS2 gameplay featuring ${demo.players.join(
      ', '
    )} on ${demo.map}. `;

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
      description += `This POV highlights ${demo.tags.join(
        ', '
      )} techniques that can elevate your gameplay.`;
    } else {
      description += 'Learn strategies and techniques directly from the pros.';
    }

    return description;
  };

  const description = generateDescription();

  return (
    <div className="relative h-[70vh] min-h-[550px] w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 group">
      {/* Background video mit reduzierter Verdunklung */}
      <div className="absolute inset-0 overflow-hidden transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10" />
        <div className="absolute inset-0 bg-yellow-400/5 mix-blend-overlay z-5" />
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            isVisible ? 'opacity-30' : 'opacity-0'
          }`}
        >
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

      {/* Mesh-Gradient-Overlay */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] z-5" />

      {/* Content */}
      <div className="relative z-20 container mx-auto h-full flex items-center px-8">
        <div
          className={`max-w-2xl transition-all duration-700 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Titel */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 drop-shadow-sm">
            {demo.title}
          </h1>

          {/* Beschreibung */}
          <div className="relative mb-6">
            <p
              className={`text-gray-300 text-base max-w-xl ${
                showFullDescription ? '' : 'line-clamp-2'
              } transition-all duration-300`}
            >
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

          {/* Alle Tags in der neuen Reihenfolge: Map, Team, Event, Year, Spieler, Positionen */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs bg-yellow-400 text-gray-900 px-2 py-0.5 rounded">
              {demo.map}
            </span>
            {demo.team && (
              <span className="text-xs bg-gray-800/80 border border-yellow-400/50 text-yellow-400 px-2 py-0.5 rounded">
                {demo.team}
              </span>
            )}
            {demo.event && (
              <span className="text-xs bg-gray-800/80 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                {demo.event}
              </span>
            )}
            <span className="text-xs bg-gray-800/80 text-white px-2 py-0.5 rounded backdrop-blur-sm">
              {demo.year}
            </span>
            {demo.players.map((player, i) => (
              <span
                key={`player-${i}`}
                className="text-xs bg-gray-800/60 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-400/20 backdrop-blur-sm"
              >
                {player}
              </span>
            ))}
            {demo.positions &&
              demo.positions.map((pos, i) => (
                <span
                  key={`pos-${i}`}
                  className="text-xs bg-gray-800/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm"
                >
                  {pos}
                </span>
              ))}
          </div>

          {/* Action-Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                setSelectedDemo(demo);
                setActiveVideoId(demo.videoId);
              }}
              className="text-sm px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-md hover:bg-yellow-300 transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.5)] flex items-center group"
            >
              <Play className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:scale-110" fill="currentColor" />
              Watch Full POV
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="text-sm px-6 py-3 bg-gray-800/40 backdrop-blur-sm text-white rounded-md hover:bg-gray-700 border border-gray-700 hover:border-yellow-400/30 transition-all duration-300 flex items-center"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filter POVs
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent z-10" />
    </div>
  );
};

export default FeaturedHero;
