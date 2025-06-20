import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ThumbsUp, Share2, MoreHorizontal, LucideTag, Bookmark, Flag, Download, ExternalLink,
  ChevronDown, ChevronUp, Play, Pause, X, Upload, Link2, Keyboard, ListVideo,
  Maximize, Minimize, Volume2, Volume1, VolumeX, Users,
} from "lucide-react";
import YouTubeEmbed from "../media/YouTubeEmbed";
import ModalHeading from "../headings/ModalHeading";
import SettingsHeading from "../headings/SettingsHeading";
import Tag from "../typography/Tag";
import { IconButton } from "../buttons";
import ActionsMenu from "../menus/ActionsMenu";

// HILFSKOMPONENTEN (innerhalb der Hauptdatei für Übersicht)

// 1. Hilfsfunktion zur Formatierung von Sekunden in das Format MM:SS
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds === 0) return "0:00";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// 2. Hilfskomponente für die untere Steuerungsleiste (vermeidet Code-Dopplung)
const PlayerControls = ({ 
  togglePlayPause, isPlaying, currentTime, duration, handleSeek, 
  volume, isMuted, handleVolumeChange, toggleMute, 
  handleFullscreen, isFullscreen 
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-3 text-white">
      <IconButton onClick={togglePlayPause} className="hover:bg-white/20">
        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
      </IconButton>
      <span className="text-sm font-mono w-14 text-center">{formatTime(currentTime)}</span>
      <input
        type="range"
        min="0"
        max="100"
        value={duration > 0 ? (currentTime / duration) * 100 : 0}
        onChange={handleSeek}
        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-yellow-400"
      />
      <span className="text-sm font-mono w-14 text-center">{formatTime(duration)}</span>
      
      {/* Lautstärke-Regler */}
      <div 
        className="relative flex items-center"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        <IconButton onClick={toggleMute} className="hover:bg-white/20">
          <VolumeIcon className="h-6 w-6" />
        </IconButton>
        {showVolumeSlider && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-900/80 rounded-lg">
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              className="h-24 w-1.5 appearance-none cursor-pointer accent-yellow-400 [&::-webkit-slider-runnable-track]:bg-white/20 [&::-webkit-slider-runnable-track]:rounded-full"
              style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
            />
          </div>
        )}
      </div>

      <IconButton onClick={handleFullscreen} className="hover:bg-white/20">
        {isFullscreen ? <Minimize className="h-6 w-6"/> : <Maximize className="h-6 w-6"/>}
      </IconButton>
    </div>
  );
};


// HAUPTKOMPONENTE
const VideoPlayerPage = ({
  selectedDemo,
  relatedDemos = [],
  onClose,
  onLike,
  onOpenTagModal,
  onSelectRelatedDemo,
}) => {
  // States
  const [menuOpen, setMenuOpen] = useState(false);
  const [showKeyOverlay, setShowKeyOverlay] = useState(false);
  const [showMatchTimeline, setShowMatchTimeline] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showMultiPov, setShowMultiPov] = useState(false);

  // Refs
  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const playerContainerRef = useRef(null);
  const clickTimerRef = useRef(null); // Ref für den Klick-Timer

  // Player-Events
  const handlePlayerReady = (event) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
    setVolume(event.target.getVolume() / 100);
    setIsMuted(event.target.isMuted());
    const videoData = event.target.getVideoData();
    if (videoData && videoData.autoplay) {
      event.target.playVideo();
    }
  };

  const handlePlayerStateChange = (event) => {
    const playerState = event.data;
    const isCurrentlyPlaying = playerState === 1;
    setIsPlaying(isCurrentlyPlaying);

    if (isCurrentlyPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current) setCurrentTime(playerRef.current.getCurrentTime());
      }, 500);
    } else {
      clearInterval(progressIntervalRef.current);
    }
  };

  // --- LOGIK FÜR KLICK vs. DOPPELKLICK ---
  const handleVideoAreaClick = () => {
    clearTimeout(clickTimerRef.current); // Vorherigen Timer löschen
    clickTimerRef.current = setTimeout(() => {
      togglePlayPause();
    }, 250); // Warte 250ms auf einen möglichen Doppelklick
  };

  const handleVideoAreaDoubleClick = () => {
    clearTimeout(clickTimerRef.current); // Den Einzelklick-Timer abbrechen
    handleFullscreen();
  };

  // --- LOGIK FÜR FULLSCREEN ---
  const handleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => console.error(`Error: ${err.message}`));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);
  
  // --- LOGIK FÜR LAUTSTÄRKE ---
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if(isMuted) setIsMuted(false);
    playerRef.current.setVolume(newVolume * 100);
  };
  
  const toggleMute = () => {
    if(isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  useEffect(() => { return () => clearInterval(progressIntervalRef.current); }, []);
  useEffect(() => { if (!isPlaying) setShowMatchTimeline(true); }, [isPlaying]);

  const areControlsVisible = !isPlaying || isHovering;

  if (!selectedDemo) return null;
  const description = `Experience top-tier CS2 gameplay with ${selectedDemo.players.join(", ")} on ${selectedDemo.map}.`;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col gap-8">
            
            <div
              ref={playerContainerRef}
              className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="aspect-video">
                <div className="absolute top-0 left-0 w-full h-full">
                  <YouTubeEmbed
                    videoId={selectedDemo.video_id}
                    title={selectedDemo.title}
                    onReady={handlePlayerReady}
                    onStateChange={handlePlayerStateChange}
                    autoplay
                  />
                </div>
                {/* Klick-Overlay mit neuer Logik */}
                <div 
                  className="absolute top-0 left-0 w-full h-full z-10 cursor-pointer" 
                  onClick={handleVideoAreaClick}
                  onDoubleClick={handleVideoAreaDoubleClick}
                ></div>
              </div>
              
              <div className="absolute top-0 right-0 z-30">
                <div className="w-48 bg-gray-950/70 backdrop-blur-sm rounded-bl-2xl">
                  <div className={`flex items-center justify-end p-2 gap-1 transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                    {/* NEU: Multi-POV Button */}
                    <IconButton onClick={() => setShowMultiPov(!showMultiPov)} className={`${showMultiPov ? 'bg-yellow-400/20 text-yellow-400' : 'bg-transparent hover:bg-gray-800'}`} tooltip="Toggle Multi-POV"><Users className="h-5 w-5" /></IconButton>
                    <IconButton onClick={() => setShowKeyOverlay(!showKeyOverlay)} className={`${showKeyOverlay ? 'bg-yellow-400/20 text-yellow-400' : 'bg-transparent hover:bg-gray-800'}`} tooltip="Toggle WASD Overlay"><Keyboard className="h-5 w-5" /></IconButton>
                    <IconButton onClick={() => setShowMatchTimeline(!showMatchTimeline)} className={`${showMatchTimeline ? 'bg-yellow-400/20 text-yellow-400' : 'bg-transparent hover:bg-gray-800'} disabled:opacity-50 disabled:cursor-not-allowed`} tooltip="Toggle Match Timeline" disabled={!isPlaying}><ListVideo className="h-5 w-5" /></IconButton>
                  </div>
                </div>
              </div>
              
              {/* NEU: Multi-POV Leiste */}
              {showMultiPov && (
                <div className={`absolute top-14 right-0 z-20 transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-gray-950/70 backdrop-blur-sm rounded-b-lg p-2 flex gap-2 overflow-x-auto custom-scrollbar">
                        {selectedDemo.players.map((player) => (
                            <div key={player} className="flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-md hover:bg-white/10 cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-gray-900 font-bold text-base shadow-lg">{player.charAt(0)}</div>
                                <span className="text-xs text-white truncate w-16 text-center">{player}</span>
                            </div>
                        ))}
                    </div>
                </div>
              )}

              <div 
                className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ pointerEvents: areControlsVisible ? 'auto' : 'none' }} 
              >
                {(!isPlaying || showMatchTimeline) ? (
                  <div className="bg-gradient-to-t from-black/90 via-black/80 to-transparent">
                    <div className="bg-gray-900/60 backdrop-blur-sm border-t border-gray-700/50 p-4 md:p-6">
                      <h2 className="text-xl font-semibold text-white flex items-center mb-6"><div className="w-1 h-6 bg-yellow-400 mr-3 rounded-full"></div>Match Timeline</h2>
                      <div className="relative overflow-x-auto custom-scrollbar">{/* Runden-Buttons... */}</div>
                      <div className="pt-6">
                        <PlayerControls {...{ togglePlayPause, isPlaying, currentTime, duration, handleSeek, volume, isMuted, handleVolumeChange, toggleMute, handleFullscreen, isFullscreen }}/>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                     <PlayerControls {...{ togglePlayPause, isPlaying, currentTime, duration, handleSeek, volume, isMuted, handleVolumeChange, toggleMute, handleFullscreen, isFullscreen }}/>
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-full space-y-6">
              {/* Restlicher Seiteninhalt */}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 bg-gray-900 border-t border-gray-800">
        {/* Footer */}
      </footer>
    </div>
  );
};

export default VideoPlayerPage;