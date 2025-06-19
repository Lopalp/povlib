import React from 'react';
import YouTube from 'react-youtube';

const YouTubeEmbed = ({
  videoId,
  title,
  autoplay = false,
  onReady,
  onStateChange, // Hinzugefügte Prop
}) => {
  const opts = {
    playerVars: {
      autoplay: autoplay ? 1 : 0,
      controls: 0,
      showinfo: 0,
      rel: 0,
      modestbranding: 1,
      mute: autoplay ? 1 : 0,
      disablekb: 1,
    },
  };

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onReady={onReady}
      onStateChange={onStateChange} // Hier übergeben
      title={title || "YouTube video player"}
      className="w-full h-full"
      iframeClassName="w-full h-full"
    />
  );
};

export default YouTubeEmbed;