import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  ThumbsUp,
  Share2,
  MoreHorizontal,
  Tag,
  Bookmark,
  Flag,
  Download,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Shield,
  Play,
} from "lucide-react";
import YouTubeEmbed from "./YouTubeEmbed";
import Navbar from "./Navbar";
import Footer from "./Footer";

const demoMatchData = {
  rounds: [
    {
      roundNumber: 1,
      events: [
        { type: "utility", time: 10, player: "PlayerA" },
        { type: "kill", time: 45, player: "PlayerB" },
        { type: "death", time: 46, player: "PlayerA" },
      ],
    },
    {
      roundNumber: 2,
      events: [
        { type: "utility", time: 5, player: "PlayerC" },
        { type: "kill", time: 30, player: "PlayerA" },
        { type: "death", time: 30, player: "PlayerB" },
      ],
    },
  ],
};

const VideoPlayerPage = ({
  selectedDemo,
  relatedDemos = [],
  onClose,
  onLike,
  onOpenTagModal,
  onSelectRelatedDemo,
  demoType = "pro",
  setDemoType = () => {},
  searchActive = false,
  setSearchActive = () => {},
  isMenuOpen = false,
  setIsMenuOpen = () => {},
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [matchroomSubmitted, setMatchroomSubmitted] = useState(false);
  // NEU: State für das Input-Feld
  const [matchroomUrl, setMatchroomUrl] = useState("");

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
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Navbar
        demoType={demoType}
        onSwitchDemoType={setDemoType}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      />

      {/* KORREKTUR: Padding-Top (pt) von 16 auf 24 erhöht für mehr Abstand */}
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <button
              onClick={onClose}
              className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" /> Back to Overview
            </button>
            <Link
              href="/videoplaypagecopy"
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              Open Page Copy
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-8/12 space-y-6">
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-black shadow-lg min-h-[420px]">
                <YouTubeEmbed
                  videoId={selectedDemo.video_id}
                  title={selectedDemo.title}
                  autoplay
                  controls
                  showInfo={false}
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-white">
                    {selectedDemo.title}
                  </h1>
                  <div className="flex flex-wrap items-center space-x-6 text-gray-400 text-sm">
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 mr-1" />
                      <span>
                        {selectedDemo.views?.toLocaleString()} views
                      </span>
                    </div>
                    <div>{selectedDemo.year}</div>
                    {selectedDemo.event && (
                      <div className="text-yellow-400">{selectedDemo.event}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onLike(selectedDemo.id)}
                    className="flex items-center hover:text-yellow-400 transition-colors text-gray-400"
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span className="ml-1">{selectedDemo.likes}</span>
                  </button>
                  <button className="flex items-center hover:text-yellow-400 transition-colors text-gray-400">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center hover:text-yellow-400 transition-colors text-gray-400"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            onOpenTagModal();
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2"
                        >
                          <Tag className="h-4 w-4 text-yellow-400" />
                          <span>Add Tag</span>
                        </button>
                        <button
                          onClick={() => setMenuOpen(false)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2"
                        >
                          <Bookmark className="h-4 w-4 text-yellow-400" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setMenuOpen(false)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2"
                        >
                          <Flag className="h-4 w-4 text-red-500" />
                          <span>Report</span>
                        </button>
                        <button
                          onClick={() => {
                            window.open(selectedDemo.video_url);
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2"
                        >
                          <Download className="h-4 w-4 text-yellow-400" />
                          <span>Download Video</span>
                        </button>
                        <button
                          onClick={() => {
                            window.open(selectedDemo.dem_url);
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2"
                        >
                          <FileText className="h-4 w-4 text-yellow-400" />
                          <span>Download Demo</span>
                        </button>
                        <button
                          onClick={() => {
                            window.open(selectedDemo.matchroom_url, "_blank");
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2"
                        >
                          <ExternalLink className="h-4 w-4 text-yellow-400" />
                          <span>Open Matchroom</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* KORREKTUR: Matchroom Alert mit Input-Feld */}
              {!matchroomSubmitted && (
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-yellow-400/20 border border-yellow-400/30 text-gray-100 p-4 rounded-md">
                   <div className="flex-shrink-0">
                      <Shield className="h-6 w-6 text-yellow-400" />
                   </div>
                   <div className="flex-grow text-sm">
                      Help us complete the matchroom! Add the link here.
                   </div>
                   <input
                     type="text"
                     value={matchroomUrl}
                     onChange={(e) => setMatchroomUrl(e.target.value)}
                     placeholder="Paste matchroom URL..."
                     className="w-full sm:w-auto flex-grow bg-gray-800 border border-gray-600 text-gray-200 text-sm rounded-md px-3 py-1.5 focus:ring-yellow-400 focus:border-yellow-400"
                   />
                  <button
                    onClick={() => {
                      // Hier könnte man die URL verarbeiten, z.B. an eine API senden
                      console.log("Submitted URL:", matchroomUrl);
                      setMatchroomSubmitted(true);
                    }}
                    className="flex-shrink-0 w-full sm:w-auto bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-yellow-300 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              )}
              {matchroomSubmitted && (
                <div className="bg-gray-700 text-gray-300 px-4 py-3 rounded-md text-sm flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span>Thank you! Your link is being reviewed and will be added shortly.</span>
                </div>
              )}

              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="border-l-4 border-yellow-400 pl-2 mb-4 text-xl font-semibold text-white">
                  Description
                </h2>
                {selectedDemo.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedDemo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-200 hover:bg-yellow-400/20 transition-colors"
                      >
                        <Tag className="h-4 w-4 mr-1 text-yellow-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p
                  className={`${
                    showFullDescription ? "" : "line-clamp-4"
                  } text-gray-300 text-lg leading-relaxed`}
                >
                  {description}
                </p>
                {description.length > 240 && !showFullDescription && (
                  <button
                    onClick={() => setShowFullDescription(true)}
                    className="mt-3 flex items-center text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                  >
                    Read more <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="overflow-x-auto py-4">
                <div className="flex space-x-4">
                  {selectedDemo.players.map((player, idx) => (
                    <Link
                      key={idx}
                      href={`/players/${player
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`}
                    >
                      <a className="min-w-[120px] flex-shrink-0 bg-gray-800 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-700 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-yellow-400 font-semibold text-lg">
                          {player.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-medium">
                            {player}
                          </span>
                          {selectedDemo.team && (
                            <span className="text-gray-400 text-sm">
                              {selectedDemo.team}
                            </span>
                          )}
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">
                  Match Timeline
                </h2>
                {demoMatchData.rounds.map((round) => (
                  <div key={round.roundNumber}>
                    <div className="mb-2 text-gray-300 text-sm">
                      Round {round.roundNumber}
                    </div>
                    <div className="relative h-3 bg-gray-700 rounded">
                      {round.events.map((event, idx) => {
                        const percent = Math.min((event.time / 60) * 100, 100);
                        return (
                          <div
                            key={idx}
                            className="absolute -top-1 w-2 h-2 bg-yellow-400 rounded-full border-2 border-gray-900"
                            style={{ left: `${percent}%` }}
                            title={`${event.type} – ${event.player} (${event.time}s)`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-4/12 space-y-6">
              <h2 className="text-xl font-semibold text-white">Related POVs</h2>
              <div className="space-y-4">
                {relatedDemos.length ? (
                  relatedDemos.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => onSelectRelatedDemo(d.id)}
                      className="flex gap-4 cursor-pointer items-center hover:bg-gray-800 transition-colors p-2 rounded-md"
                    >
                      <div className="w-28 h-20 relative overflow-hidden rounded-lg group flex-shrink-0">
                        <img
                          src={d.thumbnail}
                          alt={d.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="rounded-full bg-yellow-400/80 p-2">
                            <Play
                              className="h-4 w-4 text-gray-900"
                              fill="currentColor"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-sm line-clamp-2">
                          {d.title}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                          {d.players.join(", ")}
                        </p>
                        <div className="flex items-center text-gray-500 text-xs mt-2">
                          <span>{d.views.toLocaleString()} views</span>
                          <span className="mx-1">•</span>
                          <span>{d.map}</span>
                          <div className="ml-auto flex items-center text-yellow-400">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            <span>{d.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    No related videos available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VideoPlayerPage;