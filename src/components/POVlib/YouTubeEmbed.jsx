import React from 'react';

const YouTubeEmbed = ({
  videoId,
  title,
  autoplay = false,
  className = "",
  controls = true,
  showInfo = false,
}) => {
  return (
    <div className={`relative w-full h-full sm:pb-[56.25%] sm:h-0 overflow-hidden ${className}`}>
      <iframe
        className="
          absolute 
            top-0 
            left-1/2 
            h-full 
            w-auto 
            -translate-x-1/2 
            sm:left-0 
            sm:w-full 
            sm:h-full 
            sm:translate-x-0
        "
        src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&controls=${controls ? 1 : 0}&showinfo=${showInfo ? 1 : 0}&mute=${autoplay ? 1 : 0}&modestbranding=1`}
        title={title || "YouTube video player"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeEmbed;
