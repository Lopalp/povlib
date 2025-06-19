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
  X,
  Upload,
  Link2,
  Keyboard,
  ListVideo,
} from "lucide-react";
import YouTubeEmbed from "../media/YouTubeEmbed"; // Ihre NEUE, einfachere Komponente
import ModalHeading from "../headings/ModalHeading";
import SettingsHeading from "../headings/SettingsHeading";
import Tag from "../typography/Tag";
import { IconButton } from "../buttons";
import ActionsMenu from "../menus/ActionsMenu";

const VideoPlayerPage = ({
  selectedDemo,
  relatedDemos = [],
  onClose,
  onLike,
  onOpenTagModal,
  onSelectRelatedDemo,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpExpanded, setHelpExpanded] = useState(false);
  const [matchroomUrl, setMatchroomUrl] = useState("");
  const [showKeyOverlay, setShowKeyOverlay] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);
  const [activeKeys, setActiveKeys] = useState({ w: false, a: false, s: false, d: false });
  
  const playerRef = useRef(null);

  const handlePlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const handleRoundClick = (round) => {
    setSelectedRound(selectedRound === round ? null : round);
    if (playerRef.current && typeof playerRef.current.getDuration === 'function') {
      const duration = playerRef.current.getDuration();
      if (duration > 0) {
        const randomTime = Math.random() * duration;
        playerRef.current.seekTo(randomTime, true);
      }
    }
  };

  useEffect(() => {
    if (!showKeyOverlay) return;
    const interval = setInterval(() => {
      const keys = ["w", "a", "s", "d"];
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setActiveKeys((prev) => ({ ...{ w: false, a: false, s: false, d: false }, [randomKey]: true }));
      setTimeout(() => {
        setActiveKeys({ w: false, a: false, s: false, d: false });
      }, 300);
    }, 500);
    return () => clearInterval(interval);
  }, [showKeyOverlay]);

  if (!selectedDemo) return null;

  const description = `Experience top-tier CS2 gameplay with ${selectedDemo.players.join(", ")} on ${selectedDemo.map}. Watch how ${selectedDemo.team || "professional"} players demonstrate professional positioning for ${selectedDemo.positions?.join(" and ") || "various scenarios"}. This POV video highlights techniques like ${selectedDemo.tags?.join(", ") || "advanced strategies"}.`;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 pt-24">
      <main className="pb-0">
        <div
          className="relative w-full bg-black"
          onMouseEnter={() => setIsToolbarVisible(true)}
          onMouseLeave={() => setIsToolbarVisible(false)}
        >
          {/* 1. Dieser Container ist 'relative' und setzt das Seitenverhältnis */}
          <div className="aspect-video">
            {/* 2. NEU: Dieser Wrapper ist 'absolute' und füllt den Container aus */}
            <div className="absolute top-0 left-0 w-full h-full">
              {/* 3. Ihre Komponente füllt nun diesen Wrapper aus */}
              <YouTubeEmbed
                videoId={selectedDemo.video_id}
                title={selectedDemo.title}
                onReady={handlePlayerReady}
                autoplay
                controls={false}
                showInfo={false}
              />
            </div>
          </div>

          {/* Overlays (sollten jetzt korrekt über dem Video liegen) */}
          {showKeyOverlay && (
            <div className="absolute top-8 left-8 pointer-events-none z-10">
               {/* ... WASD-Tasten ... */}
            </div>
          )}
          {showTimeline && (
            <div className="absolute bottom-20 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-auto z-10">
              {/* ... Timeline-Inhalt ... */}
            </div>
          )}
          <div className={`absolute bottom-4 right-4 flex items-center gap-3 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-lg p-2 transition-opacity duration-300 pointer-events-auto z-10`}>
            {/* ... Toolbar-Buttons ... */}
          </div>
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col gap-8 pt-12">
            <div className="w-full space-y-6">
              {/* ... Der gesamte Rest des Seiteninhalts ... */}
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
                  <button onClick={() => onLike(selectedDemo.id)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"><ThumbsUp className="w-5 h-5"/><span>{selectedDemo.likes}</span></button>
                  <IconButton className="bg-gray-800 hover:bg-gray-700"><Share2 className="h-5 w-5" /></IconButton>
                  <div className="relative"><IconButton onClick={() => setMenuOpen(!menuOpen)} className="bg-gray-800 hover:bg-gray-700"><MoreHorizontal className="h-5 w-5" /></IconButton><ActionsMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} demo={"bottom-left"} items={[{ icon: <LucideTag className="h-4 w-4 text-yellow-400" />, label: "Add Tag", onClick: () => { onOpenTagModal(); setMenuOpen(false); }}, { icon: <Bookmark className="h-4 w-4 text-yellow-400" />, label: "Save", onClick: () => setMenuOpen(false) }, { icon: <Flag className="h-4 w-4 text-red-500" />, label: "Report", onClick: () => setMenuOpen(false) }, { icon: <Download className="h-4 w-4 text-yellow-400" />, label: "Download Video", onClick: () => { window.open(selectedDemo.video_url); setMenuOpen(false); }}, { icon: <ExternalLink className="h-4 w-4 text-yellow-400" />, label: "Open Matchroom", onClick: () => { window.open(selectedDemo.matchroom_url, "_blank"); setMenuOpen(false); }}]}/></div>
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