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
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.35] sm:scale-100 w-full h-full">
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
  );
};

export default YouTubeEmbed;
