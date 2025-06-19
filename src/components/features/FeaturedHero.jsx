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
  const [showPlayButton, setShowPlayButton] = useState(!autoplayVideo);

  useEffect(() => {
    setIsVisible(true);
    setShowPlayButton(!autoplayVideo);
    return () => setIsVisible(false);
  }, [demo, autoplayVideo]);

  const handleVideoContainerClick = () => {
    setShowPlayButton(false);
  };

  if (!demo) {
    return null;
  }

  const statsString = demo.stats
    ? `${demo.stats.kills} / ${demo.stats.deaths} / ${demo.stats.assists}`
    : "K / D / A";

  if (!demo.videoId) {
    return (
      <div className="relative overflow-hidden bg-gray-800 group w-full aspect-[16/9] max-h-[75vh] h-auto">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <p>Video not available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-black group w-full aspect-[16/9] max-h-[75vh] h-auto">
      {/* Hintergrund-Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/15 z-10 pointer-events-none" />
        <div className="absolute inset-0 w-full h-full">
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "177.78vh",
              height: "56.25vw",
              minWidth: "100%",
              minHeight: "100%",
            }}
          >
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

        {showPlayButton && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20 cursor-pointer"
            onClick={handleVideoContainerClick}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="bg-yellow-400/90 hover:bg-yellow-400 transition-colors p-4 rounded-full">
                <Play className="h-8 w-8 text-black fill-black" />
              </div>
              <span className="text-white text-sm font-medium">
                Click to play video
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Inhalt: Neuer Info-Block und Buttons */}
      <div className="relative z-30 container mx-auto h-full flex items-end justify-start px-6 pb-8">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* === INFORMATIONSBLOCK (GRÖSSER SKALIERT) START === */}
          <div className="mb-6">
            <p className="text-white uppercase font-semibold text-3xl md:text-4xl">
              {demo.map || "MAP"}
            </p>
            <h1 className="text-6xl md:text-7xl font-bold text-yellow-400 uppercase leading-none my-1">
              {demo.players?.[0] || "PLAYER"}
            </h1>
            <p className="text-white font-medium text-2xl md:text-3xl tracking-wider">
              {statsString}
            </p>
          </div>
          {/* === INFORMATIONSBLOCK ENDE === */}

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