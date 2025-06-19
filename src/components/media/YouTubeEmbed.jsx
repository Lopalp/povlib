import React from 'react';
import YouTube from 'react-youtube';

const YouTubeEmbed = ({
  videoId,
  title,
  autoplay = false,
  className = "", // className wird nun direkt an die Komponente weitergegeben
  controls = true,
  showInfo = false,
  onReady,
}) => {
  const opts = {
    // Höhe und Breite werden von CSS gesteuert, nicht mehr hier
    playerVars: {
      autoplay: autoplay ? 1 : 0,
      controls: controls ? 1 : 0,
      showinfo: showInfo ? 1 : 0,
      rel: 0,
      modestbranding: 1,
      mute: autoplay ? 1 : 0,
    },
  };

  // Diese Komponente rendert nun einen einfachen, sauberen YouTube-Player.
  // Das Styling (Positionierung & Größe) wird von der Eltern-Komponente über `className` gesteuert.
  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onReady={onReady}
      title={title || "YouTube video player"}
      className={className} // Wendet die übergebenen Klassen direkt an
    />
  );
};

export default YouTubeEmbed;