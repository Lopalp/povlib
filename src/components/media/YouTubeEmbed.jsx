import React from 'react';
import YouTube from 'react-youtube';

const YouTubeEmbed = ({
  videoId,
  title,
  autoplay = false,
  controls = true,
  showInfo = false,
  onReady,
}) => {
  const opts = {
    // Höhe und Breite werden von CSS im Elternelement gesteuert
    playerVars: {
      autoplay: autoplay ? 1 : 0,
      controls: controls ? 1 : 0,
      showinfo: showInfo ? 1 : 0,
      rel: 0,
      modestbranding: 1,
      mute: autoplay ? 1 : 0,
    },
  };

  // Die 'className' sorgt dafür, dass der von react-youtube erstellte
  // Container und der iframe darin 100% des Elternelements ausfüllen.
  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onReady={onReady}
      title={title || "YouTube video player"}
      className="w-full h-full"
      iframeClassName="w-full h-full"
    />
  );
};

export default YouTubeEmbed;