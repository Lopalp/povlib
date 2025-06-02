import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Eye,
  Heart,
  Tag,
  Share2,
  Flag,
  Bookmark,
  X,
  ThumbsUp,
  ChevronDown,
  ChevronRight,
  Shield,
  Play,
  Download,
  FileText,
  ExternalLink
} from 'lucide-react';
import YouTubeEmbed from './YouTubeEmbed';
import Navbar from './Navbar';
import Footer from './Footer';

const demoMatchData = {
  rounds: [
    {
      roundNumber: 1,
      events: [
        { type: 'utility', time: 10, player: 'PlayerA' },
        { type: 'kill', time: 45, player: 'PlayerB' },
        { type: 'death', time: 46, player: 'PlayerA' },
      ],
    },
    {
      roundNumber: 2,
      events: [
        { type: 'utility', time: 5, player: 'PlayerC' },
        { type: 'kill', time: 30, player: 'PlayerA' },
        { type: 'death', time: 30, player: 'PlayerB' },
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
  demoType = 'pro',
  setDemoType = () => {},
  searchActive = false,
  setSearchActive = () => {},
  isMenuOpen = false,
  setIsMenuOpen = () => {}
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMatchroomSubmit, setShowMatchroomSubmit] = useState(true);
  const [matchroomSubmitStatus, setMatchroomSubmitStatus] = useState('initial'); // 'initial' | 'submitted'

  if (!selectedDemo) return null;

  // Generiere eine Kurzbeschreibung
  const generateDescription = () => {
    let desc = `Erlebe Top-CS2-Gameplay mit ${selectedDemo.players.join(', ')} auf ${selectedDemo.map}. `;
    if (selectedDemo.team) desc += `Sieh zu, wie ${selectedDemo.team}-Spieler professionelle `;
    else desc += 'Sieh dir professionelle ';
    if (selectedDemo.positions?.length) desc += `Positionierung für ${selectedDemo.positions.join(' und ')}. `;
    else desc += 'Positionierung und Game Sense. ';
    if (selectedDemo.tags?.length) desc += `Dieses POV-Video hebt Techniken wie ${selectedDemo.tags.join(', ')} hervor.`;
    else desc += 'Lerne Strategien und Techniken direkt von den Profis.';
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
          {/* Breadcrumb / Back-Link */}
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <button
              onClick={onClose}
              className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" /> Zurück zur Übersicht
            </button>
            <Link href="/videoplaypagecopy">
              <a className="text-gray-400 hover:text-yellow-400 transition-colors">
                Seite (Kopie) öffnen
              </a>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* ========== Linke Spalte: Video + Infos ========== */}
            <div className="w-full lg:w-8/12 space-y-8">
              {/* Video-Embed */}
              <div className="rounded-lg overflow-hidden bg-black shadow-lg">
                <YouTubeEmbed
                  videoId={selectedDemo.video_id}
                  title={selectedDemo.title}
                  autoplay
                  controls
                  showInfo={false}
                  style={{ width: '100%', height: 'auto', minHeight: '420px' }}
                />
              </div>

              {/* Titel + Stats + Actions */}
              <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                <h1 className="text-2xl font-bold text-white">{selectedDemo.title}</h1>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Stats */}
                  <div className="flex flex-wrap items-center space-x-6 text-gray-400">
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 mr-1" />
                      <span>{selectedDemo.views?.toLocaleString()} Aufrufe</span>
                    </div>
                    <div>{selectedDemo.year}</div>
                    {selectedDemo.event && (
                      <div className="text-yellow-400">{selectedDemo.event}</div>
                    )}
                  </div>
                  {/* Aktionen */}
                  <div className="flex flex-wrap items-center space-x-4 text-gray-400">
                    <button
                      onClick={() => onLike(selectedDemo.id)}
                      className="flex items-center hover:text-yellow-400 transition-colors"
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span className="ml-1">{selectedDemo.likes}</span>
                    </button>
                    <button
                      onClick={onOpenTagModal}
                      className="flex items-center hover:text-yellow-400 transition-colors"
                    >
                      <Tag className="h-5 w-5" />
                      <span className="ml-1">Tag</span>
                    </button>
                    <button className="flex items-center hover:text-yellow-400 transition-colors">
                      <Share2 className="h-5 w-5" />
                      <span className="ml-1">Teilen</span>
                    </button>
                    <button className="flex items-center hover:text-yellow-400 transition-colors">
                      <Bookmark className="h-5 w-5" />
                      <span className="ml-1">Speichern</span>
                    </button>
                    <button className="flex items-center hover:text-red-500 transition-colors">
                      <Flag className="h-5 w-5" />
                      <span className="ml-1">Report</span>
                    </button>
                    <a
                      href={selectedDemo.video_url}
                      download
                      className="flex items-center hover:text-yellow-400 transition-colors"
                    >
                      <Download className="h-5 w-5" />
                      <span className="ml-1 text-sm">Video</span>
                    </a>
                    <a
                      href={selectedDemo.dem_url}
                      download
                      className="flex items-center hover:text-yellow-400 transition-colors"
                    >
                      <FileText className="h-5 w-5" />
                      <span className="ml-1 text-sm">Demo</span>
                    </a>
                    <a
                      href={selectedDemo.matchroom_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-yellow-400 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span className="ml-1 text-sm">Matchroom</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Beschreibung */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="border-l-4 border-yellow-400 pl-2 mb-4 text-xl font-semibold text-white">
                  Beschreibung
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
                <p className={`${showFullDescription ? '' : 'line-clamp-4'} text-gray-300 text-lg leading-relaxed`}>
                  {description}
                </p>
                {description.length > 240 && !showFullDescription && (
                  <button
                    onClick={() => setShowFullDescription(true)}
                    className="mt-3 flex items-center text-yellow-400 hover:text-yellow-300 overflow-hidden text-sm transition-colors"
                  >
                    weiterlesen <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Match Timeline */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="border-l-4 border-yellow-400 pl-2 mb-6 text-xl font-semibold text-white">
                  Match Timeline
                </h2>
                <div className="space-y-6">
                  {demoMatchData.rounds.map((round) => (
                    <div key={round.roundNumber}>
                      <div className="mb-2 text-gray-300 text-sm">Runde {round.roundNumber}</div>
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

              {/* Matchroom Submit */}
              {showMatchroomSubmit && (
                <div className="bg-gray-800 rounded-lg p-6 relative">
                  {matchroomSubmitStatus === 'initial' ? (
                    <>
                      <button
                        onClick={() => setShowMatchroomSubmit(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <h2 className="text-xl font-semibold text-white mb-3">Matchroom einreichen</h2>
                      <p className="text-gray-300 text-base mb-4">
                        Hilf uns, die Datenbank zu vervollständigen! Wenn du das
                        Matchroom-Link findest, bekommst du 1 Credit, um aus deinem Demo-File
                        ein Video zu generieren.
                      </p>
                      <div className="flex flex-col md:flex-row gap-3">
                        <input
                          type="text"
                          placeholder="Matchroom-Link eingeben"
                          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2 md:mb-0"
                        />
                        <button
                          onClick={() => setMatchroomSubmitStatus('submitted')}
                          className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
                        >
                          Absenden
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-300 text-base">
                      Danke für deine Unterstützung! Sobald der Link verifiziert wurde, 
                      erhältst du eine Benachrichtigung und der Credit wird deinem Konto gutgeschrieben.
                    </p>
                  )}
                </div>
              )}

              {/* Featured Players */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="flex items-center text-sm font-medium text-white mb-4">
                  <Shield className="h-4 w-4 mr-2 text-yellow-400" /> Featured Players
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedDemo.players.map((player, idx) => (
                    <Link
                      key={idx}
                      href={`/players/${player.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      <a className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-yellow-400 font-bold text-sm">
                          {player.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium">{player}</p>
                          {selectedDemo.team && (
                            <p className="text-gray-400 text-sm">{selectedDemo.team}</p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ========== Rechte Spalte: Related POVs ========== */}
            <div className="w-full lg:w-4/12">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="border-l-4 border-yellow-400 pl-2 mb-6 text-xl font-semibold text-white">
                  Related POVs
                </h2>
                <div className="space-y-4">
                  {relatedDemos.length ? (
                    relatedDemos.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => onSelectRelatedDemo(d.id)}
                        className="flex gap-4 cursor-pointer p-3 rounded-lg hover:bg-gray-700 transition-colors items-center"
                      >
                        <div className="w-28 h-20 relative overflow-hidden rounded-lg group flex-shrink-0">
                          <img
                            src={d.thumbnail}
                            alt={d.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <div className="rounded-full bg-yellow-400/80 p-2">
                              <Play className="h-4 w-4 text-gray-900" fill="currentColor" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium text-sm line-clamp-2">
                            {d.title}
                          </h3>
                          <p className="text-gray-400 text-xs mt-1">{d.players.join(', ')}</p>
                          <div className="flex items-center text-gray-500 text-xs mt-2 flex-wrap">
                            <span>{d.views.toLocaleString()} Aufrufe</span>
                            <span className="mx-1">•</span>
                            <span>{d.map}</span>
                            <div className="ml-auto flex items-center text-yellow-400">
                              <Heart className="h-3 w-3 mr-1" />
                              <span>{d.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      Keine verwandten Videos verfügbar
                    </div>
                  )}
                </div>
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
