import React, { useState, useEffect } from 'react';
import { Play, Filter } from 'lucide-react';
import YouTubeEmbed from './YouTubeEmbed';

const FeaturedHero = ({
  demo,
  autoplayVideo,
  setSelectedDemo,
  setActiveVideoId,
  setIsFilterModalOpen,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, [demo]);

  if (!demo) return null;

  return (
    <div className="relative w-full aspect-video max-h-[80vh] overflow-hidden bg-black group">
      {/* Hintergrund-Video mit Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <YouTubeEmbed
          videoId={demo.videoId}
          title={demo.title}
          autoplay={autoplayVideo}
          controls={false}
          showInfo={false}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Inhalt (unten links) */}
      <div className="relative z-20 container mx-auto h-full flex items-end justify-start px-6 pb-8">
        <div
          className={`max-w-2xl transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Titel */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight line-clamp-2 md:line-clamp-none">
            {demo.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[demo.map, demo.team, demo.event, demo.year, ...demo.players, ...(demo.positions || [])]
              .filter(Boolean)
              .map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full bg-white/10 text-white border border-white/20"
                >
                  {tag}
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
              className="flex items-center gap-2 px-5 py-2 rounded-md border-2 border-yellow-400 text-yellow-400 font-semibold hover:bg-yellow-400 hover:text-black transition"
            >
              <Play className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">Watch Full POV</span>
            </button>

            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-md border border-gray-600 text-white hover:border-yellow-400 transition"
            >
              <Filter className="h-5 w-5" />
              <span className="text-sm">Filter POVs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leichtes Bottom-Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-20" />
    </div>
  );
};

export default FeaturedHero;
