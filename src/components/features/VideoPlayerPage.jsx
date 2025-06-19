import React, { useState, useEffect } from "react";
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
import YouTubeEmbed from "../media/YouTubeEmbed";
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
  const [activeKeys, setActiveKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  // Random key lighting effect
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

  const description = `Experience top-tier CS2 gameplay with ${selectedDemo.players.join(
    ", "
  )} on ${selectedDemo.map}. Watch how ${
    selectedDemo.team || "professional"
  } players demonstrate professional positioning for ${
    selectedDemo.positions?.join(" and ") || "various scenarios"
  }. This POV video highlights techniques like ${
    selectedDemo.tags?.join(", ") || "advanced strategies"
  }.`;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <main className="pb-0">
        {/* Video Player Section - Full Width with Hover Toolbar */}
        <div
          className="relative w-full bg-black"
          onMouseEnter={() => setIsToolbarVisible(true)}
          onMouseLeave={() => setIsToolbarVisible(false)}
        >
          <div className="aspect-video">
            <YouTubeEmbed
              videoId={selectedDemo.video_id}
              title={selectedDemo.title}
              autoplay
              controls
              showInfo={false}
            />
          </div>

          {/* Key Overlay - Borders only style */}
          {showKeyOverlay && (
            <div className="absolute top-8 left-8 pointer-events-none">
              <div className="grid grid-cols-3 gap-3 w-40">
                <div className="col-start-2">
                  <div
                    className={`w-12 h-12 rounded-lg border-2 ${
                      activeKeys.w
                        ? "border-yellow-400 text-yellow-400"
                        : "border-gray-500 text-gray-300"
                    } flex items-center justify-center font-bold text-lg transition-all duration-200`}
                  >
                    W
                  </div>
                </div>
                <div className="col-start-1 row-start-2">
                  <div
                    className={`w-12 h-12 rounded-lg border-2 ${
                      activeKeys.a
                        ? "border-yellow-400 text-yellow-400"
                        : "border-gray-500 text-gray-300"
                    } flex items-center justify-center font-bold text-lg transition-all duration-200`}
                  >
                    A
                  </div>
                </div>
                <div className="col-start-2 row-start-2">
                  <div
                    className={`w-12 h-12 rounded-lg border-2 ${
                      activeKeys.s
                        ? "border-yellow-400 text-yellow-400"
                        : "border-gray-500 text-gray-300"
                    } flex items-center justify-center font-bold text-lg transition-all duration-200`}
                  >
                    S
                  </div>
                </div>
                <div className="col-start-3 row-start-2">
                  <div
                    className={`w-12 h-12 rounded-lg border-2 ${
                      activeKeys.d
                        ? "border-yellow-400 text-yellow-400"
                        : "border-gray-500 text-gray-300"
                    } flex items-center justify-center font-bold text-lg transition-all duration-200`}
                  >
                    D
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Collapsible Match Timeline Overlay */}
          {showTimeline && (
            <div className="absolute bottom-20 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-auto">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-800 animate-in slide-in-from-bottom-5 duration-300">
                <h2 className="text-xl font-semibold text-white flex items-center mb-6">
                  <div className="w-1 h-6 bg-yellow-400 mr-3 rounded-full"></div>
                  Match Timeline
                </h2>
                <div className="relative overflow-x-auto custom-scrollbar">
                  {/* ... Timeline content ... */}
                </div>
                {selectedRound && (
                  <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    {/* ... Round details ... */}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Video Hover Toolbar */}
          <div
            className={`absolute bottom-4 right-4 flex items-center gap-3 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-lg p-2 transition-opacity duration-300 pointer-events-auto ${
              isToolbarVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <IconButton
              onClick={() => setShowKeyOverlay(!showKeyOverlay)}
              className={`${showKeyOverlay ? 'bg-yellow-400/20 text-yellow-400' : 'bg-transparent hover:bg-gray-700'}`}
              tooltip="Toggle WASD Overlay"
            >
              <Keyboard className="h-5 w-5" />
            </IconButton>
            <IconButton
              onClick={() => setShowTimeline(!showTimeline)}
              className={`${showTimeline ? 'bg-yellow-400/20 text-yellow-400' : 'bg-transparent hover:bg-gray-700'}`}
              tooltip="Toggle Match Timeline"
            >
              <ListVideo className="h-5 w-5" />
            </IconButton>
          </div>
        </div>

        {/* Adding more space for a potential navbar */}
        <div className="container mx-auto px-4 max-w-7xl pt-12">
          <div className="flex flex-col gap-8">
            <div className="w-full space-y-6">
              {/* Title */}
              <ModalHeading className="text-2xl lg:text-3xl">
                {selectedDemo.title}
              </ModalHeading>

              {/* Players and Actions Bar */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Players */}
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {selectedDemo.players.map((player, idx) => (
                    <Link
                      key={idx}
                      href={`/players/${player.replace(/\s+/g, "-").toLowerCase()}`}
                      className="flex-shrink-0 flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-900/50 transition-all group border border-transparent hover:border-gray-800"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-gray-900 font-bold text-base shadow-lg">
                        {player.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-semibold text-base">{player}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => onLike(selectedDemo.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ThumbsUp className="w-5 h-5"/>
                    <span>{selectedDemo.likes}</span>
                  </button>
                  <IconButton className="bg-gray-800 hover:bg-gray-700">
                    <Share2 className="h-5 w-5" />
                  </IconButton>
                  <div className="relative">
                    <IconButton
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="bg-gray-800 hover:bg-gray-700"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </IconButton>
                    <ActionsMenu
                      isOpen={menuOpen}
                      onClose={() => setMenuOpen(false)}
                      // ... menu items
                    />
                  </div>
                </div>
              </div>

              {/* Description Section with Metadata */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400 text-sm">
                     <div className="flex items-center">
                       <span>{selectedDemo.views?.toLocaleString()} views</span>
                     </div>
                     <div>{selectedDemo.year}</div>
                     {selectedDemo.event && (
                       <div className="text-yellow-400 font-medium">
                         {selectedDemo.event}
                       </div>
                     )}
                   </div>
                  <button
                    onClick={() => setHelpExpanded(!helpExpanded)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <span className="hidden sm:inline">Help us improve</span>
                    {helpExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {helpExpanded && (
                  <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    {/* ... help content ... */}
                  </div>
                )}
                
                {selectedDemo.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* ... tags mapping ... */}
                  </div>
                )}

                <p className={`${showFullDescription ? "" : "line-clamp-3"} text-gray-300 leading-relaxed`}>
                  {description}
                </p>
                {description.length > 200 && !showFullDescription && (
                  <button
                    onClick={() => setShowFullDescription(true)}
                    className="mt-3 text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                  >
                    Read more
                  </button>
                )}
              </div>
              
              {/* Related POVs */}
              <div className="mt-12">
                {/* ... related POVs section ... */}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 bg-gray-900 border-t border-gray-800">
        {/* ... footer */}
      </footer>
    </div>
  );
};

export default VideoPlayerPage;