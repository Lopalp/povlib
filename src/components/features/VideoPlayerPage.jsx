import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
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

      setActiveKeys((prev) => {
        const newState = { w: false, a: false, s: false, d: false };
        newState[randomKey] = true;
        return newState;
      });

      setTimeout(() => {
        setActiveKeys({ w: false, a: false, s: false, d: false });
      }, 300);
    }, 500);

    return () => clearInterval(interval);
  }, [showKeyOverlay]);

  if (!selectedDemo) return null;

  const generateDescription = () => {
    let desc = `Experience top-tier CS2 gameplay with ${selectedDemo.players.join(
      ", "
    )} on ${selectedDemo.map}. `;
    if (selectedDemo.team)
      desc += `Watch how ${selectedDemo.team} players demonstrate professional `;
    else desc += "Check out professional ";
    if (selectedDemo.positions?.length)
      desc += `positioning for ${selectedDemo.positions.join(" and ")}. `;
    else desc += "positioning and game sense. ";
    if (selectedDemo.tags?.length)
      desc += `This POV video highlights techniques like ${selectedDemo.tags.join(
        ", "
      )}.`;
    else desc += "Learn strategies and techniques directly from the pros.";
    return desc;
  };
  const description = generateDescription();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <main className="pb-0">
        {/* Video Player Section - Full Width */}
        <div className="relative w-full bg-black">
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

          {/* Match Timeline Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white flex items-center mb-6">
                <div className="w-1 h-6 bg-yellow-400 mr-3 rounded-full"></div>
                Match Timeline
              </h2>

              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #374151;
                  border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #facc15;
                  border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #eab308;
                }
              `}</style>

              <div className="relative overflow-x-auto custom-scrollbar">
                <div className="absolute left-0 right-0 h-1 bg-gray-800 top-4 rounded-full min-w-full"></div>
                <div className="relative flex justify-between min-w-max gap-4 pb-4">
                  {Array.from({ length: 25 }, (_, i) => i + 1).map((round) => (
                    <div
                      key={round}
                      className="flex flex-col items-center flex-shrink-0"
                    >
                      <button
                        onClick={() =>
                          setSelectedRound(selectedRound === round ? null : round)
                        }
                        className={`w-8 h-8 ${
                          selectedRound === round
                            ? "bg-yellow-400 border-yellow-400 text-gray-900 scale-110"
                            : "bg-gray-800 border-gray-700 text-gray-300"
                        } rounded-full flex items-center justify-center text-xs font-medium border-2 hover:border-yellow-400 hover:bg-gray-700 transition-all cursor-pointer transform hover:scale-105`}
                      >
                        {round}
                      </button>
                      <span className="text-xs text-gray-500 mt-2 whitespace-nowrap">
                        Round {round}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Round Details */}
              {selectedRound && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      Round {selectedRound} Details
                    </h3>
                    <button
                      onClick={() => setSelectedRound(null)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {/* ... (rest of the round details JSX) */}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl pt-8">
          <div className="flex flex-col gap-8">
            {/* Main Content */}
            <div className="w-full space-y-6">
              {/* Title and Actions */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-3">
                  <ModalHeading className="text-2xl">
                    {selectedDemo.title}
                  </ModalHeading>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 text-sm">
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
                </div>
                <div className="flex items-center gap-3">
                  <IconButton
                    onClick={() => setShowKeyOverlay(!showKeyOverlay)}
                    className="bg-gray-800 hover:bg-gray-700"
                  >
                    <Keyboard className="h-5 w-5" />
                  </IconButton>
                  <button
                    onClick={() => onLike(selectedDemo.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.230l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                    </svg>
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
                      demo={"bottom-left"}
                      items={[
                        {
                          icon: (
                            <LucideTag className="h-4 w-4 text-yellow-400" />
                          ),
                          label: "Add Tag",
                          onClick: () => {
                            onOpenTagModal();
                            setMenuOpen(false);
                          },
                        },
                        {
                          icon: (
                            <Bookmark className="h-4 w-4 text-yellow-400" />
                          ),
                          label: "Save",
                          onClick: () => setMenuOpen(false),
                        },
                        // ... other menu items
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Players - cleaner ohne Hintergrund */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {selectedDemo.players.map((player, idx) => (
                  <Link
                    key={idx}
                    href={`/players/${player.replace(/\s+/g, "-").toLowerCase()}`}
                    className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-900/50 transition-all group border border-transparent hover:border-gray-800"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-gray-900 font-bold text-lg shadow-lg">
                      {player.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-semibold text-lg">
                        {player}
                      </span>
                      {selectedDemo.team && (
                        <span className="text-gray-400 text-sm font-medium">
                          {selectedDemo.team}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Description Section */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                {/* ... (rest of description, help section, etc.) */}
                <p
                  className={`${
                    showFullDescription ? "" : "line-clamp-3"
                  } text-gray-300 leading-relaxed`}
                >
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
                <SettingsHeading className="mb-6">Related POVs</SettingsHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* ... (related demos mapping) */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 bg-gray-900 border-t border-gray-800">
        {/* ... (footer JSX) */}
      </footer>
    </div>
  );
};

export default VideoPlayerPage;