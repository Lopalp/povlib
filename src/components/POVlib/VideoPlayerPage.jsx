import React, { useState } from 'react';
import Link from 'next/link';
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
  Play
} from 'lucide-react';
import YouTubeEmbed from './YouTubeEmbed';
import Navbar from './Navbar';
import Footer from './Footer';

const demoMatchData = {
  rounds: [
    { roundNumber: 1, events: [ { type: 'utility', time: 10, player: 'PlayerA' }, { type: 'kill', time: 45, player: 'PlayerB' }, { type: 'death', time: 46, player: 'PlayerA' } ] },
    { roundNumber: 2, events: [ { type: 'utility', time: 5, player: 'PlayerC' }, { type: 'kill', time: 30, player: 'PlayerA' }, { type: 'death', time: 30, player: 'PlayerB' } ] },
    // …
  ],
};

const VideoPlayerPage = ({
  selectedDemo,
  relatedDemos = [],
  onClose,
  onLike,
  onOpenTagModal,
  onSelectRelatedDemo,
  demoType = 'pro',
  setDemoType = () => {},
  searchActive = false,
  setSearchActive = () => {},
  isMenuOpen = false,
  setIsMenuOpen = () => {}
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [matchroomSubmitted, setMatchroomSubmitted] = useState(false);

  if (!selectedDemo) return null;

  const generateDescription = () => {
    let desc = `Erlebe CS2-Gameplay mit ${selectedDemo.players.join(', ')} auf ${selectedDemo.map}. `;
    if (selectedDemo.team) desc += `${selectedDemo.team}-Spieler demonstrieren professionelle `;
    else desc += 'Profis zeigen ';
    if (selectedDemo.positions?.length) desc += `Positionen ${selectedDemo.positions.join(' & ')}. `;
    else desc += 'Positionierung & Game Sense. ';
    if (selectedDemo.tags?.length) desc += `Techniken: ${selectedDemo.tags.join(', ')}.`;
    else desc += 'Lerne Strategien direkt von den Profi-Spielern.';
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

      <main className="pt-16 pb-10">
        <div className="container mx-auto px-4">
          {/* Back-Link */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={onClose}
              className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Zurück
            </button>
          </div>

          {/* Video */}
          <div className="w-full rounded-md overflow-hidden bg-black shadow">
            <YouTubeEmbed
              videoId={selectedDemo.video_id}
              title={selectedDemo.title}
              autoplay
              controls
              showInfo={false}
              style={{ width: '100%', height: 'auto', minHeight: '400px' }}
            />
          </div>

          {/* Titel / Stats */}
          <div className="mt-6">
            <h1 className="text-2xl font-semibold text-white">{selectedDemo.title}</h1>
            <div className="flex flex-wrap items-center text-gray-400 text-sm mt-1">
              <div className="flex items-center mr-6">
                <Eye className="h-4 w-4 mr-1" /> {selectedDemo.views?.toLocaleString()} Aufrufe
              </div>
              <div className="mr-6">{selectedDemo.year}</div>
              {selectedDemo.event && (
                <div className="text-yellow-400">{selectedDemo.event}</div>
              )}
            </div>
          </div>

          {/* Action-Leiste: Like, Share, Ellipsis */}
          <div className="flex items-center gap-6 mt-4">
            <button
              onClick={() => onLike(selectedDemo.id)}
              className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors text-sm"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {selectedDemo.likes}
            </button>
            <button className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors text-sm">
              <Share2 className="h-4 w-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors text-sm"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-gray-800 border border-gray-700 rounded-md text-sm shadow z-10">
                  <button
                    onClick={() => { onOpenTagModal(); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4 text-yellow-400" /> Tag
                  </button>
                  <button
                    onClick={() => { /* save */ setMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Bookmark className="h-4 w-4 text-yellow-400" /> Speichern
                  </button>
                  <button
                    onClick={() => { /* report */ setMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Flag className="h-4 w-4 text-red-500" /> Report
                  </button>
                  <button
                    onClick={() => { window.open(selectedDemo.video_url); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="h-4 w-4 text-yellow-400" /> Video herunterladen
                  </button>
                  <button
                    onClick={() => { window.open(selectedDemo.dem_url); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4 text-yellow-400" /> Demo herunterladen
                  </button>
                  <button
                    onClick={() => { window.open(selectedDemo.matchroom_url, '_blank'); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4 text-yellow-400" /> Matchroom
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* schmale Trennlinie */}
          <hr className="border-gray-700 mt-6 mb-6" />

          {/* Matchroom-Hinweis (extrem unaufdringlich) */}
          {!matchroomSubmitted ? (
            <div className="flex items-center justify-between bg-yellow-400 text-gray-900 px-3 py-2 rounded text-xs">
              <span>Fehlt noch das Matchroom? Gib deinen Link unten an.</span>
              <button
                onClick={() => setMatchroomSubmitted(true)}
                className="font-medium hover:underline"
              >
                Absenden
              </button>
            </div>
          ) : (
            <div className="text-gray-400 text-xs italic mb-4">
              Danke! Dein Matchroom-Link wurde eingereicht.
            </div>
          )}

          {/* Beschreibung (kein Hintergrund außer einer winzigen Einrückung) */}
          <div className="text-gray-300 text-base leading-relaxed">
            {description}
            {description.length > 240 && !showFullDescription && (
              <button
                onClick={() => setShowFullDescription(true)}
                className="ml-1 text-yellow-400 hover:text-yellow-300 text-sm"
              >
                Weiterlesen <ChevronDown className="inline h-3 w-3 ml-0.5" />
              </button>
            )}
          </div>

          {/* Trennlinie zu Timeline */}
          <hr className="border-gray-700 mt-6 mb-6" />

          {/* Match Timeline (nur Text + Balken, kein extra Container) */}
          <div className="space-y-4">
            {demoMatchData.rounds.map((round) => (
              <div key={round.roundNumber}>
                <div className="text-gray-400 text-sm mb-1">Runde {round.roundNumber}</div>
                <div className="relative h-2 bg-gray-700 rounded-full">
                  {round.events.map((event, idx) => {
                    const percent = Math.min((event.time / 60) * 100, 100);
                    return (
                      <div
                        key={idx}
                        className="absolute -top-1 w-2 h-2 bg-yellow-400 rounded-full border border-gray-900"
                        style={{ left: `${percent}%` }}
                        title={`${event.type} – ${event.player} (${event.time}s)`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* schmale Trennlinie */}
          <hr className="border-gray-700 mt-6 mb-6" />

          {/* Related POVs (nur Titel + Liste, ohne Box) */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Related POVs</h2>
            <div className="space-y-4">
              {relatedDemos.length ? (
                relatedDemos.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => onSelectRelatedDemo(d.id)}
                    className="flex gap-4 items-center cursor-pointer hover:bg-gray-800 transition-colors p-1 rounded"
                  >
                    <div className="w-24 h-16 relative overflow-hidden rounded">
                      <img
                        src={d.thumbnail}
                        alt={d.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="h-4 w-4 text-gray-200" fill="currentColor" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm truncate">{d.title}</h3>
                      <div className="text-gray-400 text-xs mt-0.5">{d.players.join(', ')}</div>
                    </div>
                    <div className="text-gray-500 text-xs">
                      {d.views.toLocaleString()}↑
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-4 text-sm">
                  Keine verwandten Videos
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VideoPlayerPage;
