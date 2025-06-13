import React, { useState } from "react";
import {
  ArrowLeft,
  Eye,
  ThumbsUp,
  Share2,
  MoreHorizontal,

  Bookmark,
  Flag,
  Download,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Shield,
  Play,
  Clock,
  Target,
  Zap,
  User,
  Users,
  Calendar,
  MapPin,
  Award,
  TrendingUp
} from "lucide-react";

const demoMatchData = {
  rounds: [
    {
      roundNumber: 1,
      events: [
        { type: "utility", time: 10, player: "PlayerA" },
        { type: "kill", time: 45, player: "PlayerB" },
        { type: "death", time: 46, player: "PlayerA" },
        { type: "kill", time: 55, player: "PlayerC" },
        { type: "utility", time: 60, player: "PlayerA" },
      ],
    },
    {
      roundNumber: 2,
      events: [
        { type: "utility", time: 5, player: "PlayerC" },
        { type: "kill", time: 30, player: "PlayerA" },
        { type: "death", time: 30, player: "PlayerB" },
        { type: "utility", time: 40, player: "PlayerA" },
        { type: "kill", time: 50, player: "PlayerC" },
      ],
    },
    {
      roundNumber: 3,
      events: [
        { type: "kill", time: 15, player: "PlayerB" },
        { type: "utility", time: 25, player: "PlayerA" },
        { type: "death", time: 35, player: "PlayerC" },
        { type: "kill", time: 45, player: "PlayerA" },
      ],
    },
    {
      roundNumber: 4,
      events: [
        { type: "utility", time: 8, player: "PlayerB" },
        { type: "kill", time: 20, player: "PlayerA" },
        { type: "death", time: 25, player: "PlayerB" },
        { type: "utility", time: 35, player: "PlayerC" },
        { type: "kill", time: 50, player: "PlayerC" },
      ],
    },
  ],
};

const selectedDemo = {
  id: 1,
  title: "s1mple insane 4K clutch on Dust2 - Major Finals",
  thumbnail: "https://images.unsplash.com/photo-1749731630653-d9b3f00573ed?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  views: 2847391,
  likes: 45632,
  year: "2024",
  event: "PGL Major Stockholm",
  map: "Dust2",
  team: "NAVI",
  players: ["s1mple", "electronic", "Perfecto"],
  tags: ["clutch", "highlight", "major", "rifle"],
  video_id: "dQw4w9WgXcQ",
  positions: ["Long", "Site"],
  uploadDate: "3 days ago",
  duration: "12:34"
};

const relatedDemos = [
  {
    id: 2,
    title: "ZywOo 1v4 clutch round Inferno - Pro League",
    thumbnail: "https://images.unsplash.com/photo-1749731630653-d9b3f00573ed?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    views: 1234567,
    likes: 23456,
    map: "Inferno",
    players: ["ZywOo", "apEX", "NBK"],
    duration: "8:45"
  },
  {
    id: 3,
    title: "NiKo perfect spray control on Mirage",
    thumbnail: "https://images.unsplash.com/photo-1749731630653-d9b3f00573ed?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    views: 987654,
    likes: 18765,
    map: "Mirage",
    players: ["NiKo", "huNter", "nexa"],
    duration: "6:12"
  },
  {
    id: 4,
    title: "sh1ro insane AWP shots - BLAST Premier",
    thumbnail: "https://images.unsplash.com/photo-1749731630653-d9b3f00573ed?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    views: 1567890,
    likes: 27345,
    map: "Cache",
    players: ["sh1ro", "Ax1Le", "interz"],
    duration: "15:23"
  }
];

const VideoPlayerPage = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [matchroomSubmitted, setMatchroomSubmitted] = useState(false);
  const [matchroomUrl, setMatchroomUrl] = useState("");
  const [showTimeline, setShowTimeline] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const generateDescription = () => {
    return `Experience top-tier CS2 gameplay with ${selectedDemo.players.join(", ")} on ${selectedDemo.map}. Watch how ${selectedDemo.team} players demonstrate professional positioning for ${selectedDemo.positions?.join(" and ")}. This POV video highlights techniques like ${selectedDemo.tags.join(", ")}. Learn strategies and techniques directly from the pros in this epic ${selectedDemo.event} moment.`;
  };

  const description = generateDescription();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 bg-gray-950/95 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Back to Browse</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <img 
                  src={selectedDemo.thumbnail} 
                  alt={selectedDemo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                  {selectedDemo.duration}
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                  {selectedDemo.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{selectedDemo.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedDemo.uploadDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span className="text-yellow-400 font-medium">{selectedDemo.event}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    liked 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{(selectedDemo.likes + (liked ? 1 : 0)).toLocaleString()}</span>
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                
                <button 
                  onClick={() => setSaved(!saved)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    saved 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{saved ? 'Saved' : 'Save'}</span>
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {menuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
                      <div className="py-2">
                        <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-gray-300 w-full text-left">
                          <Download className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">Download Video</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-gray-300 w-full text-left">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">Download Demo</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-gray-300 w-full text-left">
                          <ExternalLink className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">Open Matchroom</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-gray-300 w-full text-left">
                          <Flag className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">Report</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Community Contribution */}
            {!matchroomSubmitted && (
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-2">Help Complete Match Data</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Have the matchroom link? Help the community by adding it below.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={matchroomUrl}
                        onChange={(e) => setMatchroomUrl(e.target.value)}
                        placeholder="Paste matchroom URL..."
                        className="flex-1 bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          console.log("Submitted URL:", matchroomUrl);
                          setMatchroomSubmitted(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {matchroomSubmitted && (
              <div className="bg-blue-600/20 border border-blue-500/40 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Thank you!</p>
                    <p className="text-gray-300 text-sm">Your contribution is being reviewed and will be added soon.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedDemo.tags && selectedDemo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedDemo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm transition-colors cursor-pointer"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">About this match</h2>
              <p className={`text-gray-300 leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                {description}
              </p>
              {description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                >
                  {showFullDescription ? (
                    <>Show less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Show more <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>

            {/* Players */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Players</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedDemo.players.map((player, idx) => (
                  <div key={idx} className="bg-gray-900/50 rounded-xl p-4 hover:bg-gray-800/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {player.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{player}</h3>
                        <p className="text-gray-400 text-sm">{selectedDemo.team}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Match Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Match Timeline</h2>
                <button
                  onClick={() => setShowTimeline(!showTimeline)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                >
                  {showTimeline ? 'Hide' : 'Show'} Timeline
                  {showTimeline ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              {showTimeline && (
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <div className="space-y-4">
                    {demoMatchData.rounds.map((round) => (
                      <div key={round.roundNumber} className="border-l-2 border-gray-700 pl-4">
                        <h3 className="text-white font-medium mb-2">Round {round.roundNumber}</h3>
                        <div className="space-y-2">
                          {round.events.map((event, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm">
                              <span className="text-gray-400 w-8">{event.time}s</span>
                              <div className={`w-2 h-2 rounded-full ${
                                event.type === 'kill' ? 'bg-yellow-400' : 
                                event.type === 'death' ? 'bg-red-400' : 
                                'bg-blue-400'
                              }`} />
                              <span className="text-gray-300">{event.player}</span>
                              <span className="text-gray-500 capitalize">{event.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Match Stats */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Match Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Map</span>
                  </div>
                  <span className="text-white font-medium">{selectedDemo.map}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Team</span>
                  </div>
                  <span className="text-white font-medium">{selectedDemo.team}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Year</span>
                  </div>
                  <span className="text-white font-medium">{selectedDemo.year}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Event</span>
                  </div>
                  <span className="text-yellow-400 font-medium text-sm">{selectedDemo.event}</span>
                </div>
              </div>
            </div>

            {/* Related Videos */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Up Next</h3>
              <div className="space-y-3">
                {relatedDemos.map((demo) => (
                  <div key={demo.id} className="group cursor-pointer bg-gray-900/30 hover:bg-gray-800/50 rounded-xl p-3 transition-colors">
                    <div className="flex gap-3">
                      <div className="relative w-32 h-18 flex-shrink-0">
                        <img
                          src={demo.thumbnail}
                          alt={demo.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
                        </div>
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                          {demo.duration}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm line-clamp-2 mb-1 group-hover:text-gray-200">
                          {demo.title}
                        </h4>
                        <p className="text-gray-400 text-xs mb-2">
                          {demo.players.join(", ")}
                        </p>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <span>{demo.views.toLocaleString()} views</span>
                          <span>•</span>
                          <span>{demo.map}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;