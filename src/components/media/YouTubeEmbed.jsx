import React from "react";

const YouTubeEmbed = ({
  videoId,
  title,
  autoplay = false,
  className = "",
  controls = true,
  showInfo = false,
  fillParent = false,
}) => {
  // Don't render if videoId is invalid
  if (!videoId || typeof videoId !== "string") {
    return (
      <div
        className={`relative w-full overflow-hidden bg-gray-800 ${className}`}
      >
        <div className="flex items-center justify-center h-full min-h-[200px] text-gray-400">
          Video not available
        </div>
      </div>
    );
  }

  const containerStyle = fillParent ? {} : { paddingBottom: "56.25%" };

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Aspect Ratio Container */}
      <div
        className={`relative w-full ${fillParent ? "h-full" : ""}`}
        style={containerStyle}
      >
        <div className="absolute top-0 left-0 w-full h-full">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${
              autoplay ? 1 : 0
            }&rel=0&controls=${controls ? 1 : 0}&showinfo=${
              showInfo ? 1 : 0
            }&mute=${autoplay ? 1 : 0}&modestbranding=1`}
            title={title || "YouTube video player"}
            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default YouTubeEmbed;
