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
    // … weitere Runden
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
  const [menuOpen, setMenuOpen] = useState(false); // für das Ellipsis-Dropdown
  const [matchroomSubmitted, setMatchroomSubmitted] = useState(false);

  if (!selectedDemo) return null;

  const generateDescription = () => {
    let desc = `Erlebe Top-CS2-Gameplay mit ${selectedDemo.players.join(
      ", "
    )} auf ${selectedDemo.map}. `;
    if (selectedDemo.team)
      desc += `Sieh zu, wie ${selectedDemo.team}-Spieler professionelle `;
    else desc += "Sieh dir professionelle ";
    if (selectedDemo.positions?.length)
      desc += `Positionierung für ${selectedDemo.positions.join(" und ")}. `;
    else desc += "Positionierung und Game Sense. ";
    if (selectedDemo.tags?.length)
      desc += `Dieses POV-Video hebt Techniken wie ${selectedDemo.tags.join(
        ", "
      )} hervor.`;
    else desc += "Lerne Strategien und Techniken direkt von den Profis.";
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

      <main className="pt-16 pb-12">
        <div className="container mx-auto px-4">
          {/* ───────────── Back-Link ───────────── */}
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <button
              onClick={onClose}
              className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" /> Zurück zur Übersicht
            </button>
            <Link
              href="/videoplaypagecopy"
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              Kopie der Seite öffnen
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* ───────────── Linke Spalte: Video + Infos ───────────── */}
            <div className="w-full lg:w-8/12 space-y-6">
              {/* KORREKTUR: Die Mindesthöhe wird jetzt hier mit einer Tailwind-Klasse gesetzt */}
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-black shadow-lg min-h-[420px]">
                <YouTubeEmbed
                  // KORREKTUR: `video_id` zu `videoId` geändert
                  videoId={selectedDemo.videoId}
                  title={selectedDemo.title}
                  autoplay
                  controls
                  showInfo={false}
                  // Die `style`-Prop wurde entfernt, da sie nicht verarbeitet wurde
                />
              </div>

              {/* ... Rest der Komponente bleibt unverändert ... */}
              {/* ─── Titel + Stats + Actions (ohne extra Box) ─── */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Titel & Statistik */}
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-white">
                    {selectedDemo.title}
                  </h1>
                  <div className="flex flex-wrap items-center space-x-6 text-gray-400 text-sm">
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 mr-1" />
                      <span>
                        {selectedDemo.views?.toLocaleString()} Aufrufe
                      </span>
                    </div>
                    <div>{selectedDemo.year}</div>
                    {selectedDemo.event && (
                      <div className="text-yellow-400">
                        {selectedDemo.event}
                      </div>
                    )}
                  </div>
                </div>

                {/* Direkt sichtbare Actions + Ellipsis */}
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
                  {/* Ellipsis-Button */}
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
                          <span>Tag hinzufügen</span>
                        </button>
                        <button
                          onClick={() => {
                            /* Save-Funktion hier aufrufen */
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2"
                        >
                          <Bookmark className="h-4 w-4 text-yellow-400" />
                          <span>Speichern</span>
                        </button>
                        <button
                          onClick={() => {
                            /* Report-Funktion hier aufrufen */
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2"
                        >
                          <Flag className="h-4 w-4 text-red-500" />
                          <span>Report</span>
                        </button>
                        <button
                          onClick={() => {
                            /* Download Video */
                            window.open(selectedDemo.video_url);
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2"
                        >
                          <Download className="h-4 w-4 text-yellow-400" />
                          <span>Video herunterladen</span>
                        </button>
                        <button
                          onClick={() => {
                            /* Download Demo */
                            window.open(selectedDemo.dem_url);
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2"
                        >
                          <FileText className="h-4 w-4 text-yellow-400" />
                          <span>Demo herunterladen</span>
                        </button>
                        <button
                          onClick={() => {
                            window.open(selectedDemo.matchroom_url, "_blank");
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2"
                        >
                          <ExternalLink className="h-4 w-4 text-yellow-400" />
                          <span>Matchroom öffnen</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ─── Matchroom Alert-Leiste (unaufdringlich) ─── */}
              {/* ... */}
            </div>

            {/* ───────────── Rechte Spalte: Related POVs ───────────── */}
            <div className="w-full lg:w-4/12 space-y-6">
              {/* ... */}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VideoPlayerPage;