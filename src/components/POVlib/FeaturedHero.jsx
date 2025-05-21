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
    let desc = `Experience top-tier CS2 gameplay featuring ${demo.players.join(
      ', '
    )} on ${demo.map}. `;
    desc += demo.team
      ? `Watch how ${demo.team} players demonstrate professional `
      : 'Watch professional ';
    desc += demo.positions?.length
      ? `positioning for ${demo.positions.join(' and ')} roles. `
      : 'positioning and game sense. ';
    desc += demo.tags?.length
      ? `This POV highlights ${demo.tags.join(
          ', '
        )} techniques that can elevate your gameplay.`
      : 'Learn strategies and techniques directly from the pros.';
    return desc;
  };
  const description = generateDescription();

  return (
    <div className="relative w-full aspect-video max-h-[80vh] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 group">
      {/* Hintergrund-Video mit reduzierter Verdunklung */}
      <div className="absolute inset-0 overflow-hidden transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-gray-900/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10" />
        <div className="absolute inset-0 bg-yellow-400/5 mix-blend-overlay z-5" />
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            isVisible ? 'opacity-20' : 'opacity-0'
          }`}
        >
          <YouTubeEmbed
            videoId={demo.videoId}
            title={demo.title}
            autoplay={autoplayVideo}
            controls={false}
            showInfo={false}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Mesh-Gradient */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] z-5" />

      {/* Content am unteren linken Rand */}
      <div className="relative z-20 container mx-auto h-full flex items-end justify-start px-6 pb-12">
        <div
          className={`max-w-2xl transition-transform duration-700 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Titel */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4 line-clamp-1 sm:line-clamp-none">
            {demo.title}
          </h1>

          {/* Beschreibung (ab sm) */}
          <div className="relative mb-6 hidden sm:block">
            <p
              className={`text-base text-gray-300 max-w-xl transition-all duration-300 ${
                showFullDescription ? '' : 'line-clamp-2'
              }`}
            >
              {description}
            </p>
            {description.length > 120 && !showFullDescription && (
              <button
                onClick={() => setShowFullDescription(true)}
                className="flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300 mt-1"
              >
                Show more <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-yellow-400/70 text-gray-900 border border-yellow-400">
              {demo.map}
            </span>
            {demo.team && (
              <span className="text-xs px-3 py-1 rounded-full bg-gray-800/60 text-white border border-gray-700">
                {demo.team}
              </span>
            )}
            {demo.event && (
              <span className="text-xs px-3 py-1 rounded-full bg-gray-800/60 text-white border border-gray-700">
                {demo.event}
              </span>
            )}
            <span className="text-xs px-3 py-1 rounded-full bg-gray-800/60 text-white border border-gray-700">
              {demo.year}
            </span>
            {demo.players.map((p, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full bg-gray-800/60 text-white border border-gray-700"
              >
                {p}
              </span>
            ))}
            {demo.positions?.map((pos, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full bg-gray-800/60 text-white border border-gray-700"
              >
                {pos}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedDemo(demo);
                setActiveVideoId(demo.videoId);
              }}
              className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-md shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-transform transform hover:scale-105"
            >
              <Play className="h-5 w-5" fill="currentColor" />
              <span className="hidden sm:inline text-sm">Watch Full POV</span>
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-800/40 backdrop-blur-sm text-white rounded-md border border-gray-700 hover:border-yellow-400 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span className="text-sm">Filter POVs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom-Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent" />
    </div>
  );
};

export default FeaturedHero;