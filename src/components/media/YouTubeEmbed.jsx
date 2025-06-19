import React from "react";
import YouTube from "react-youtube"; // Import der neuen Bibliothek

const YouTubeEmbed = ({
  videoId,
  title,
  autoplay = false,
  className = "",
  controls = true,
  showInfo = false,
  onReady, // Die neue Prop, die die Player-Instanz zurückgibt
}) => {
  const opts = {
    // Höhe und Breite werden durch die umgebenden divs gesteuert
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: autoplay ? 1 : 0,
      controls: controls ? 1 : 0,
      showinfo: showInfo ? 1 : 0,
      rel: 0, // Verwandte Videos nicht anzeigen
      modestbranding: 1, // YouTube-Logo verkleinern
      mute: autoplay ? 1 : 0, // Autoplay erfordert oft Stummschaltung
    },
  };

  return (
    // Wir behalten Ihre Wrapper-Divs bei, um das originale Skalierungs-Styling zu erhalten
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.35] sm:scale-100 w-full h-full">
        <YouTube
          videoId={videoId}
          opts={opts}
          className="w-full h-full"
          onReady={onReady} // Hier wird die Funktion aus der Eltern-Komponente übergeben
          title={title || "YouTube video player"}
        />
      </div>
    </div>
  );
};

export default YouTubeEmbed;