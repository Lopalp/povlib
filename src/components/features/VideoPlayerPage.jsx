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

// HILFSKOMPONENTEN

const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds === 0) return "0:00";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const PlayerControls = ({ 
  togglePlayPause = () => {},
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  handleSeek = () => {}, 
  volume = 1,
  isMuted = false,
  handleVolumeChange = () => {},
  toggleMute = () => {}, 
  handleFullscreen = () => {},
  isFullscreen = false
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

  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const playerContainerRef = useRef(null);
  const clickTimerRef = useRef(null);

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

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };

  const handleVideoAreaClick = () => {
    clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      togglePlayPause();
    }, 250);
  };

  const handleVideoAreaDoubleClick = () => {
    clearTimeout(clickTimerRef.current);
    handleFullscreen();
  };

  const handleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => console.error(`Error: ${err.message}`));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    playerRef.current.setVolume(newVolume * 100);
    if (newVolume > 0 && isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (!playerRef.current) return;
    if(isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };
  
  const handleSeek = (e) => {
    if (!playerRef.current) return;
    const newTime = (e.target.value / 100) * duration;
    setCurrentTime(newTime);
    playerRef.current.seekTo(newTime, true);
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => { return () => clearInterval(progressIntervalRef.current); }, []);
  useEffect(() => { if (!isPlaying) setShowMatchTimeline(true); }, [isPlaying]);

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [helpExpanded, setHelpExpanded] = useState(false);
  const [matchroomUrl, setMatchroomUrl] = useState("");
  const [activeKeys, setActiveKeys] = useState({ w: false, a: false, s: false, d: false });
  const [selectedRound, setSelectedRound] = useState(null);
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
                <div 
                  className="absolute top-0 left-0 w-full h-full z-10 cursor-pointer" 
                  onClick={handleVideoAreaClick}
                  onDoubleClick={handleVideoAreaDoubleClick}
                ></div>
              </div>
              
              {/* === KORREKTUR 1: Sichtbarkeitslogik auf den gesamten Notch-Container angewendet === */}
              <div className="absolute top-0 right-0 z-30">
                <div className={`w-48 bg-gray-950/70 backdrop-blur-sm rounded-bl-2xl transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="flex items-center justify-end p-2 gap-1">
                    <IconButton onClick={() => setShowMultiPov(!showMultiPov)} className={`${showMultiPov ? 'bg-yellow-400/20 text-yellow-400' : 'bg-transparent hover:bg-gray-800'}`} tooltip="Toggle Multi-POV"><Users className="h-5 w-5" /></IconButton>
                    <IconButton onClick={() => setShowKeyOverlay(!showKeyOverlay)} className={`${showKeyOverlay ? 'bg-yellow-400/20 text-yellow-400' : 'bg-transparent hover:bg-gray-800'}`} tooltip="Toggle WASD Overlay"><Keyboard className="h-5 w-5" /></IconButton>
                    <IconButton onClick={() => setShowMatchTimeline(!showMatchTimeline)} className={`${showMatchTimeline ? 'bg-yellow-400/20 text-yellow-400' : 'bg-transparent hover:bg-gray-800'} disabled:opacity-50 disabled:cursor-not-allowed`} tooltip="Toggle Match Timeline" disabled={!isPlaying}><ListVideo className="h-5 w-5" /></IconButton>
                  </div>
                </div>
              </div>
              
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

              {/* === KORREKTUR 2: WASD-Overlay wieder hinzugefügt === */}
              {showKeyOverlay && (
                <div className="absolute bottom-72 left-8 pointer-events-none z-30">
                  <div className="grid grid-cols-3 gap-3 w-40">
                    <div className="col-start-2"><div className={`w-12 h-12 rounded-lg border-2 ${activeKeys.w ? "border-yellow-400 text-yellow-400" : "border-gray-500 text-gray-300"} flex items-center justify-center font-bold text-lg transition-all duration-200`}>W</div></div>
                    <div className="col-start-1 row-start-2"><div className={`w-12 h-12 rounded-lg border-2 ${activeKeys.a ? "border-yellow-400 text-yellow-400" : "border-gray-500 text-gray-300"} flex items-center justify-center font-bold text-lg transition-all duration-200`}>A</div></div>
                    <div className="col-start-2 row-start-2"><div className={`w-12 h-12 rounded-lg border-2 ${activeKeys.s ? "border-yellow-400 text-yellow-400" : "border-gray-500 text-gray-300"} flex items-center justify-center font-bold text-lg transition-all duration-200`}>S</div></div>
                    <div className="col-start-3 row-start-2"><div className={`w-12 h-12 rounded-lg border-2 ${activeKeys.d ? "border-yellow-400 text-yellow-400" : "border-gray-500 text-gray-300"} flex items-center justify-center font-bold text-lg transition-all duration-200`}>D</div></div>
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
                      <div className="relative overflow-x-auto custom-scrollbar">
                        <div className="absolute left-0 right-0 h-1 bg-gray-800 top-4 rounded-full min-w-full"></div>
                        <div className="relative flex justify-between min-w-max gap-4 pb-4">
                          {Array.from({ length: 25 }, (_, i) => i + 1).map((round) => (
                            <div key={round} className="flex flex-col items-center flex-shrink-0">
                              <button onClick={() => setSelectedRound(selectedRound === round ? null : round)} className={`w-8 h-8 ${selectedRound === round ? 'bg-yellow-400 border-yellow-400 text-gray-900 scale-110' : 'bg-gray-800 border-gray-700 text-gray-300'} rounded-full flex items-center justify-center text-xs font-medium border-2 hover:border-yellow-400 hover:bg-gray-700 transition-all cursor-pointer transform hover:scale-105`}>{round}</button>
                              <span className="text-xs text-gray-500 mt-2 whitespace-nowrap">Round {round}</span>
                            </div>
                          ))}
                        </div>
                      </div>
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
              <ModalHeading className="text-2xl lg:text-3xl">{selectedDemo.title}</ModalHeading>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {selectedDemo.players.map((player, idx) => (
                    <Link key={idx} href={`/players/${player.replace(/\s+/g, "-").toLowerCase()}`} className="flex-shrink-0 flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-900/50 transition-all group border border-transparent hover:border-gray-800">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-gray-900 font-bold text-base shadow-lg">{player.charAt(0)}</div>
                      <div className="flex flex-col"><span className="text-white font-semibold text-base">{player}</span></div>
                    </Link>
                  ))}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button onClick={() => onLike(selectedDemo.id)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"><ThumbsUp className="h-5 w-5"/><span>{selectedDemo.likes}</span></button>
                  <IconButton className="bg-gray-800 hover:bg-gray-700"><Share2 className="h-5 w-5" /></IconButton>
                  
                  <div className="relative">
                    <IconButton onClick={() => setMenuOpen(!menuOpen)} className="bg-gray-800 hover:bg-gray-700"><MoreHorizontal className="h-5 w-5" /></IconButton>
                    <ActionsMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} demo={"bottom-left"} items={[{ icon: <LucideTag className="h-4 w-4 text-yellow-400" />, label: "Add Tag", onClick: () => { onOpenTagModal(); setMenuOpen(false); }}, { icon: <Bookmark className="h-4 w-4 text-yellow-400" />, label: "Save", onClick: () => setMenuOpen(false) }, { icon: <Flag className="h-4 w-4 text-red-500" />, label: "Report", onClick: () => setMenuOpen(false) }, { icon: <Download className="h-4 w-4 text-yellow-400" />, label: "Download Video", onClick: () => { window.open(selectedDemo.video_url); setMenuOpen(false); }}, { icon: <ExternalLink className="h-4 w-4 text-yellow-400" />, label: "Open Matchroom", onClick: () => { window.open(selectedDemo.matchroom_url, "_blank"); setMenuOpen(false); }}]}/>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400 text-sm"><div className="flex items-center"><span>{selectedDemo.views?.toLocaleString()} views</span></div><div>{selectedDemo.year}</div>{selectedDemo.event && (<div className="text-yellow-400 font-medium">{selectedDemo.event}</div>)}</div>
                  <button onClick={() => setHelpExpanded(!helpExpanded)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors"><span className="hidden sm:inline">Help us improve</span>{helpExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>
                </div>
                {helpExpanded && (<div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"><div className="space-y-4"><div><label className="flex items-center gap-2 text-sm text-gray-300 mb-2"><Link2 className="h-4 w-4" /> Add Matchroom URL</label><div className="flex gap-2"><input type="text" value={matchroomUrl} onChange={(e) => setMatchroomUrl(e.target.value)} placeholder="Paste matchroom URL..." className="flex-1 bg-gray-900 border border-gray-600 text-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"/><button className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg text-sm font-medium hover:bg-yellow-300 transition-colors">Submit</button></div></div><div><label className="flex items-center gap-2 text-sm text-gray-300 mb-2"><Upload className="h-4 w-4" /> Upload Demo File</label><div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors cursor-pointer"><input type="file" accept=".dem" className="hidden" id="demo-upload" /><label htmlFor="demo-upload" className="cursor-pointer"><Upload className="h-8 w-8 mx-auto mb-2 text-gray-500" /><p className="text-sm text-gray-400">Drop .dem file here or click to browse</p></label></div></div></div></div>)}
                {selectedDemo.tags?.length > 0 && (<div className="flex flex-wrap gap-2 mb-4">{selectedDemo.tags.map((tag) => (<Tag key={tag} variant="default" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all"><LucideTag className="h-3.5 w-3.5 mr-1.5 text-yellow-400" />{tag}</Tag>))}</div>)}
                <p className={`${showFullDescription ? "" : "line-clamp-3"} text-gray-300 leading-relaxed`}>{description}</p>
                {description.length > 200 && !showFullDescription && (<button onClick={() => setShowFullDescription(true)} className="mt-3 text-yellow-400 hover:text-yellow-300 text-sm font-medium">Read more</button>)}
              </div>
              
              <div className="mt-12">
                <SettingsHeading className="mb-6">Related POVs</SettingsHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {relatedDemos.length ? (relatedDemos.map((d) => (<div key={d.id} onClick={() => onSelectRelatedDemo(d.id)} className="group cursor-pointer bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"><div className="relative aspect-video overflow-hidden"><img src={d.thumbnail} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"><div className="rounded-full bg-yellow-400 p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300"><Play className="h-5 w-5 text-gray-900" fill="currentColor" /></div></div></div><div className="p-4"><h3 className="text-white font-medium text-sm line-clamp-2 mb-2">{d.title}</h3><p className="text-gray-500 text-xs mb-2">{d.players.join(", ")}</p><div className="flex items-center justify-between text-gray-600 text-xs"><span>{d.views.toLocaleString()} views</span><div className="flex items-center gap-2"><span>{d.map}</span><div className="flex items-center text-yellow-400"><ThumbsUp className="h-3 w-3 mr-1" /><span>{d.likes}</span></div></div></div></div></div>))) : (<div className="col-span-full text-gray-500 text-center py-12">No related videos available</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 py-8"><div className="flex flex-col md:flex-row items-center justify-between gap-4"><div className="text-gray-500 text-sm">© 2024 CS2 POV Hub. All rights reserved.</div><div className="flex items-center gap-6 text-sm"><Link href="/privacy" className="text-gray-500 hover:text-yellow-400 transition-colors">Privacy Policy</Link><Link href="/terms" className="text-gray-500 hover:text-yellow-400 transition-colors">Terms of Service</Link><Link href="/contact" className="text-gray-500 hover:text-yellow-400 transition-colors">Contact</Link></div></div></div>
      </footer>
    </div>
  );
};

export default VideoPlayerPage;