import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ThumbsUp,
  Share2,
  MoreHorizontal,
  LucideTag,
  Bookmark,
  Flag,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  X,
  Upload,
  Link2,
  Keyboard,
  ListVideo,
} from "lucide-react";
import YouTubeEmbed from "../media/YouTubeEmbed";
import ModalHeading from "../headings/ModalHeading";
import SettingsHeading from "../headings/SettingsHeading";
import Tag from "../typography/Tag";
import { IconButton } from "../buttons";
import ActionsMenu from "../menus/ActionsMenu";

const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds === 0) return "0:00";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const VideoPlayerPage = ({
  selectedDemo,
  relatedDemos = [],
  onClose,
  onLike,
  onOpenTagModal,
  onSelectRelatedDemo,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showKeyOverlay, setShowKeyOverlay] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);

  // States für die Videosteuerung
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [arePlayersReady, setArePlayersReady] = useState({ a: false, b: false });

  // Zwei Player-Refs: A für den sichtbaren, B für den Klon
  const playerARef = useRef(null);
  const playerBRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Gemeinsamer State-Change-Handler
  const handlePlayerStateChange = (event, playerKey) => {
    // Nur der Hauptplayer (A) steuert den isPlaying-Status
    if (playerKey === 'A') {
      const playerState = event.data;
      const isCurrentlyPlaying = playerState === 1;
      setIsPlaying(isCurrentlyPlaying);

      if (isCurrentlyPlaying) {
        progressIntervalRef.current = setInterval(() => {
          if (playerARef.current) {
            const time = playerARef.current.getCurrentTime();
            setCurrentTime(time);
            // Klon synchronisieren, falls er aus dem Tritt kommt
            playerBRef.current?.seekTo(time, true);
          }
        }, 500);
      } else {
        clearInterval(progressIntervalRef.current);
      }
    }
  };
  
  const handlePlayerAReady = (event) => {
    playerARef.current = event.target;
    playerARef.current.mute(); // Hauptplayer ist für Ton zuständig, wird unten entstummt
    setDuration(event.target.getDuration());
    setArePlayersReady(prev => ({ ...prev, a: true }));
  };

  const handlePlayerBReady = (event) => {
    playerBRef.current = event.target;
    playerBRef.current.mute(); // Klon-Player ist IMMER stumm
    setArePlayersReady(prev => ({ ...prev, b: true }));
  };
  
  // Wenn beide Player bereit sind, entstumme den Hauptplayer
  useEffect(() => {
    if (arePlayersReady.a && arePlayersReady.b) {
      playerARef.current.unMute();
      if(playerARef.current.getVideoData().autoplay) {
        togglePlayPause();
      }
    }
  }, [arePlayersReady]);


  useEffect(() => {
    return () => clearInterval(progressIntervalRef.current);
  }, []);

  const togglePlayPause = () => {
    if (!playerARef.current || !playerBRef.current) return;

    if (isPlaying) {
      // Beim Pausieren: Verstecke Player A, zeige Klon B am exakt gleichen Frame
      const time = playerARef.current.getCurrentTime();
      playerBRef.current.seekTo(time, true);
      playerARef.current.pauseVideo(); // Wir pausieren ihn trotzdem, um Ressourcen zu sparen
    } else {
      // Beim Abspielen: Verstecke Klon B, zeige und starte Player A
      const time = playerBRef.current?.getCurrentTime() || currentTime;
      playerARef.current.seekTo(time, true);
      playerARef.current.playVideo();
    }
  };

  const handleSeek = (e) => {
    if (!playerARef.current) return;
    const newTime = (e.target.value / 100) * duration;
    setCurrentTime(newTime);
    playerARef.current.seekTo(newTime, true);
    playerBRef.current?.seekTo(newTime, true);
  };
  
  // (Restliche Logik bleibt unverändert)
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [helpExpanded, setHelpExpanded] = useState(false);
  const [matchroomUrl, setMatchroomUrl] = useState("");
  const [activeKeys, setActiveKeys] = useState({ w: false, a: false, s: false, d: false });
  useEffect(() => {
    if (!showKeyOverlay) return;
    const interval = setInterval(() => {
      const keys = ["w", "a", "s", "d"];
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setActiveKeys({ w: false, a: false, s: false, d: false, [randomKey]: true });
      setTimeout(() => setActiveKeys({ w: false, a: false, s: false, d: false }), 300);
    }, 500);
    return () => clearInterval(interval);
  }, [showKeyOverlay]);

  if (!selectedDemo) return null;
  const description = `...`; // Beschreibungstext

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 pt-24">
      <main className="pb-0">
        <div
          className="relative w-full bg-black"
          onMouseEnter={() => setIsToolbarVisible(true)}
          onMouseLeave={() => setIsToolbarVisible(false)}
        >
          <div className="aspect-video">
            {/* === Wrapper für die zwei Player === */}
            <div className="absolute top-0 left-0 w-full h-full">
              
              {/* Player A (Sichtbar beim Abspielen) */}
              <div className={`w-full h-full transition-opacity duration-200 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                <YouTubeEmbed
                  videoId={selectedDemo.video_id}
                  onReady={handlePlayerAReady}
                  onStateChange={(e) => handlePlayerStateChange(e, 'A')}
                  autoplay
                />
              </div>

              {/* Player B (Sichtbar beim Pausieren, liegt unter Player A) */}
              <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-200 ${!isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                <YouTubeEmbed
                  videoId={selectedDemo.video_id}
                  onReady={handlePlayerBReady}
                />
              </div>

            </div>
            {/* Unsichtbares Overlay zum Steuern via Klick */}
            <div
              className="absolute top-0 left-0 w-full h-full z-10 cursor-pointer"
              onClick={togglePlayPause}
            ></div>
          </div>

          {/* Eigene Steuerung (liegt über allem dank z-20) */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 z-20 transition-opacity duration-300 ${isToolbarVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* ... JSX für die Custom Controls ... */}
          </div>
          {/* ... andere Overlays (Toolbar, WASD, etc.) mit z-30 ... */}
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl">
            {/* ... Rest der Seite ... */}
        </div>
      </main>
      <footer className="mt-24 bg-gray-900 border-t border-gray-800">
         {/* ... Footer ... */}
      </footer>
    </div>
  );
};

export default VideoPlayerPage;