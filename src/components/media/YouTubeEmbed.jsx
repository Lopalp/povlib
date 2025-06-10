import React, { useState } from "react";

const YouTubeEmbed = ({
  videoId,
  title,
  autoplay = false,
  className = "",
  controls = true,
  showInfo = false,
  fillParent = false,
}) => {
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Don't render if videoId is invalid
  if (!videoId || typeof videoId !== "string") {
    console.warn("YouTubeEmbed: Invalid videoId provided:", videoId);
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

  // Construct YouTube URL with proper parameters
  // TEMP: Use known working video ID for testing
  const testVideoId =
    process.env.NODE_ENV === "development" ? "dQw4w9WgXcQ" : videoId;
  const embedUrl = `https://www.youtube.com/embed/${testVideoId}?autoplay=${
    autoplay ? 1 : 0
  }&rel=0&controls=${controls ? 1 : 0}&showinfo=${showInfo ? 1 : 0}&mute=${
    autoplay ? 1 : 0
  }&modestbranding=1&enablejsapi=1`;

  console.log("YouTubeEmbed rendering:", {
    originalVideoId: videoId,
    testVideoId,
    embedUrl,
  });

  const handleIframeLoad = () => {
    console.log("YouTube iframe loaded successfully for video:", videoId);
    setIframeLoaded(true);
    setIframeError(false);
  };

  const handleIframeError = () => {
    console.error("YouTube iframe failed to load for video:", videoId);
    setIframeError(true);
  };

  // Test the video ID by checking if it matches YouTube's expected format
  const isValidYouTubeId = /^[a-zA-Z0-9_-]{11}$/.test(videoId);
  if (!isValidYouTubeId) {
    console.warn("Invalid YouTube video ID format:", videoId);
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Debug overlay in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs p-1 rounded z-50">
          Video: {videoId} | Loaded: {iframeLoaded ? "Y" : "N"} | Error:{" "}
          {iframeError ? "Y" : "N"}
        </div>
      )}

      {/* Aspect Ratio Container */}
      <div
        className={`relative w-full ${fillParent ? "h-full" : ""}`}
        style={containerStyle}
      >
        {iframeError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center text-gray-400">
              <p>Failed to load video</p>
              <p className="text-sm">Video ID: {videoId}</p>
              <p className="text-xs">URL: {embedUrl}</p>
            </div>
          </div>
        ) : (
          <iframe
            className="absolute top-0 left-0 w-full h-full border-2 border-red-500 bg-blue-500"
            src={embedUrl}
            title={title || "YouTube video player"}
            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ minHeight: "200px" }}
          />
        )}
      </div>
    </div>
  );
};

export default YouTubeEmbed;
