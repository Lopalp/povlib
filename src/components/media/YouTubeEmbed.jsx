import React from "react";

const YouTubeEmbed = ({
  videoId,
  title,
  autoplay = false,
  className = "",
  controls = true,
  showInfo = false,
}) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute top-0 left-0 w-full h-full">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${
              autoplay ? 1 : 0
            }&rel=0&controls=${controls ? 1 : 0}&showinfo=${
              showInfo ? 1 : 0
            }&mute=${autoplay ? 1 : 0}&modestbranding=1`}
            title={title || "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default YouTubeEmbed;
