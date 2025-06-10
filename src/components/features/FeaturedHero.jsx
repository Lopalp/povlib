import React, { useState, useEffect } from "react";
import { Play, Filter } from "lucide-react";
import YouTubeEmbed from "../media/YouTubeEmbed";
import { Tag } from "../tags";

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
    <div className="relative overflow-hidden bg-black group w-full aspect-[16/9] max-h-[75vh] h-auto">
      {/* Hintergrund-Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Halbtransparenter Schwarz-Overlay (optional) */}
        <div className="absolute inset-0 bg-black/15 z-10" />

        {/* Das YouTubeEmbed füllt jetzt immer die volle Höhe aus */}
        <div className="absolute inset-0 w-full h-full">
          <YouTubeEmbed
            videoId={demo.videoId}
            title={demo.title}
            autoplay={autoplayVideo}
            controls={false}
            showInfo={false}
            fillParent={true}
          />
        </div>
      </div>

      {/* Inhalt: Titel, Tags, Buttons */}
      <div className="relative z-30 container mx-auto h-full flex items-end justify-start px-6 pb-8">
        <div
          className={`max-w-2xl transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Titel */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight line-clamp-2 md:line-clamp-none">
            {demo.title}
          </h1>

          {/* Tags – nur ab sm sichtbar */}
          <div className="hidden sm:flex flex-wrap gap-2 mb-4">
            {[
              demo.map,
              demo.team,
              demo.event,
              demo.year,
              ...demo.players,
              ...(demo.positions || []),
            ]
              .filter(Boolean)
              .map((tag, i) => (
                <Tag key={i} variant="secondary" size="xs">
                  {tag}
                </Tag>
              ))}
          </div>

          {/* Buttons – bleiben mit Text sichtbar */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedDemo(demo);
                setActiveVideoId(demo.videoId);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-md border-2 border-yellow-400 text-yellow-400 font-semibold hover:bg-yellow-400 hover:text-black transition"
            >
              <Play className="h-5 w-5" />
              <span className="text-sm">Watch Full POV</span>
            </button>

            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-600 text-white hover:border-yellow-400 transition"
            >
              <Filter className="h-5 w-5" />
              <span className="text-sm">Filter POVs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom-Fade-Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default FeaturedHero;
