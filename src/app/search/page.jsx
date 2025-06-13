"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { Filter, Clock, Eye, Calendar, Play, Users, Trophy, Zap, User } from "lucide-react";

const PILL_OPTIONS = [
  { id: "all", label: "All", icon: null },
  { id: "videos", label: "Videos", icon: Play },
  { id: "players", label: "Players", icon: Users },
  { id: "teams", label: "Teams", icon: Trophy },
  { id: "utilities", label: "Utilities", icon: Zap },
  { id: "unwatched", label: "Unwatched", icon: null },
  { id: "recent", label: "Recent", icon: Calendar },
];

const THUMBNAIL_IMAGE = "https://images.unsplash.com/photo-1749731630653-d9b3f00573ed?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<SearchResultsSkeleton />}>
      <SearchResultsContent />
    </Suspense>
  );
}

function SearchResultsContent() {
  const [activePill, setActivePill] = useState("all");
  const [searchQuery, setSearchQuery] = useState("CS2 highlight plays");
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced dummy data
  const videos = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        type: "video",
        title: `${searchQuery} - Epic Gaming Moments ${i + 1}`,
        thumbnail: THUMBNAIL_IMAGE,
        duration: `${Math.floor(Math.random() * 10) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        views: `${Math.floor(Math.random() * 999) + 1}K views`,
        uploadDate: `${Math.floor(Math.random() * 7) + 1} days ago`,
        channel: `ProPlayer${i + 1}`,
        channelAvatar: THUMBNAIL_IMAGE,
        watched: i % 3 === 0,
        quality: "HD",
        map: ["Dust2", "Mirage", "Inferno", "Cache", "Overpass"][Math.floor(Math.random() * 5)],
        team: `Team${i + 1}`,
        year: "2024",
        players: [`Player${i + 1}`, `Player${i + 2}`],
      })),
    [searchQuery]
  );

  const players = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, i) => ({ 
        id: i, 
        type: "player",
        name: `ProGamer${i + 1}`, 
        avatar: THUMBNAIL_IMAGE,
        followers: `${Math.floor(Math.random() * 50) + 10}K followers`,
        game: "Counter-Strike 2"
      })),
    []
  );

  const teams = useMemo(
    () =>
      Array.from({ length: 3 }).map((_, i) => ({ 
        id: i, 
        type: "team",
        name: `Team Alpha${i + 1}`, 
        logo: THUMBNAIL_IMAGE,
        members: `${Math.floor(Math.random() * 10) + 5} members`,
        rank: `#${i + 1} Global`
      })),
    []
  );

  const utilities = useMemo(
    () =>
      Array.from({ length: 2 }).map((_, i) => ({
        id: i,
        type: "utility",
        title: `Training Tool ${i + 1}`,
        description: "Advanced aim training and strategy analysis",
        thumbnail: THUMBNAIL_IMAGE,
        rating: (4.0 + Math.random()).toFixed(1),
        downloads: `${Math.floor(Math.random() * 10) + 1}K downloads`,
        clips: Array.from({ length: 3 }).map((__, j) => ({ 
          id: j, 
          title: `Training Session ${j + 1}`, 
          thumbnail: THUMBNAIL_IMAGE,
          duration: `${Math.floor(Math.random() * 5) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
        })),
      })),
    []
  );

  // Dynamic content mixing like YouTube
  const mixedContent = useMemo(() => {
    let allContent = [];
    
    switch (activePill) {
      case "videos":
        allContent = [...videos];
        break;
      case "players":
        allContent = [...players];
        break;
      case "teams":
        allContent = [...teams];
        break;
      case "utilities":
        allContent = [...utilities];
        break;
      case "unwatched":
        allContent = videos.filter(v => !v.watched);
        break;
      case "recent":
        allContent = videos.slice(0, 4);
        break;
      default:
        // Mix all content types dynamically
        allContent = [...videos, ...players, ...teams, ...utilities];
        // Shuffle array for random distribution
        allContent = allContent.sort(() => Math.random() - 0.5);
        break;
    }

    return allContent;
  }, [activePill, videos, players, teams, utilities]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          {searchQuery && (
            <div className="mb-4">
              <h1 className="text-2xl font-normal">
                <span className="text-gray-400">Search results for</span>{" "}
                <span className="text-white font-medium">"{searchQuery}"</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">About 1,240 results</p>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-hide">
              {PILL_OPTIONS.map(pill => {
                const Icon = pill.icon;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setActivePill(pill.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                      activePill === pill.id
                        ? "bg-yellow-500/60 text-gray-900 shadow-lg"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                  >
                    {Icon && <Icon size={14} />}
                    {pill.label}
                  </button>
                );
              })}
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-full transition-all duration-200 ml-auto sm:ml-0"
            >
              <Filter size={14} />
              <span className="text-sm font-medium hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Single Column Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="space-y-4">
          {mixedContent.map((item, index) => {
            // Add separator between different content types
            const prevItem = mixedContent[index - 1];
            const showSeparator = prevItem && prevItem.type !== item.type && activePill === "all";
            
            return (
              <React.Fragment key={`${item.type}-${item.id}`}>
                {showSeparator && (
                  <div className="border-t border-gray-700 my-6"></div>
                )}
                
                {item.type === "video" && <VideoCard video={item} />}
                {item.type === "player" && <PlayerCard player={item} />}
                {item.type === "team" && <TeamCard team={item} />}
                {item.type === "utility" && <UtilityCard utility={item} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video }) {
  const [isHovered, setIsHovered] = useState(false);

  // Mock additional data inspired by DemoCard
  const mockKDA = `${Math.floor(Math.random() * 30) + 10}/${Math.floor(Math.random() * 10) + 1}/${Math.floor(Math.random() * 15) + 5}`;
  const ctRounds = (video.id % 7) + 6;
  const tRounds = (video.id % 5) + 8;
  const totalRounds = ctRounds + tRounds;
  const ctPercentage = (ctRounds / totalRounds) * 100;

  const handleCardClick = () => {
    console.log(`Navigate to video ${video.id}`);
  };

  return (
    <div 
      className="relative w-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Base Card - Single Row Layout */}
      <div className="flex gap-4 p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-200">
        {/* Thumbnail */}
        <div className="relative w-40 sm:w-48 md:w-56 flex-shrink-0">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full aspect-video object-cover rounded-lg" 
          />
          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </div>
          {/* Quality Badge */}
          <div className="absolute top-2 left-2 bg-yellow-500/60 text-gray-900 text-xs px-1.5 py-0.5 rounded font-medium">
            {video.quality}
          </div>
          {/* Watched Indicator */}
          {video.watched && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/60"></div>
          )}
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center rounded-lg">
            <Play className="text-white opacity-0 hover:opacity-100 transition-opacity duration-200" size={24} fill="white" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm sm:text-base leading-tight line-clamp-2 mb-2">
            {video.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={video.channelAvatar} 
              alt={video.channel} 
              className="w-6 h-6 rounded-full" 
            />
            <span className="text-gray-300 text-sm">{video.channel}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <span>{video.views}</span>
            <span>•</span>
            <span>{video.uploadDate}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">{video.map}</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">{video.team}</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">{video.year}</span>
          </div>
        </div>
      </div>

      {/* Hover Modal inspired by DemoCard */}
      {isHovered && (
        <div className="absolute top-0 left-0 w-full transform -translate-y-4 z-40 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden hidden lg:block">
          {/* Video Preview */}
          <div className="relative w-full aspect-video">
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Play className="text-white" size={48} fill="white" />
            </div>
            {/* Invisible click overlay */}
            <div 
              className="absolute inset-0 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            ></div>
          </div>

          {/* Enhanced Content */}
          <div className="p-4 flex flex-col space-y-3">
            <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
              {video.title}
            </h3>

            <div className="flex flex-col gap-1 text-xs text-gray-300">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-gray-700 px-2 py-1 rounded text-xs">{video.map}</span>
                {video.team && <span className="bg-gray-700 px-2 py-1 rounded text-xs">{video.team}</span>}
                <span className="bg-gray-700 px-2 py-1 rounded text-xs">{video.year}</span>
              </div>
            </div>

            <div className="border-t border-gray-700"></div>

            <section className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                {video.players.slice(0, 1).map((player, idx) => (
                  <span
                    key={idx}
                    className="text-sm font-medium text-gray-200 hover:text-yellow-400 transition-colors duration-200"
                  >
                    {player}
                  </span>
                ))}
              </div>
              <div className="text-xs font-semibold text-gray-400 tracking-wide bg-gray-700 px-2 py-1 rounded-md">
                {mockKDA}
              </div>
            </section>

            {/* CT/T Rounds Bar */}
            <div>
              <div className="h-2 w-full rounded-full bg-gray-700 overflow-hidden flex">
                <div
                  className="bg-blue-500/60 h-full"
                  style={{ width: `${ctPercentage}%` }}
                />
                <div
                  className="bg-yellow-500/60 h-full"
                  style={{ width: `${100 - ctPercentage}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-gray-500 font-medium">
                <span>CT: {ctRounds}</span>
                <span>T: {tRounds}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerCard({ player }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const mockStats = {
    rank: `Global Elite`,
    winRate: `${Math.floor(Math.random() * 20) + 70}%`,
    avgKD: (1.5 + Math.random() * 0.8).toFixed(2),
    recentMatches: Math.floor(Math.random() * 10) + 15
  };

  return (
    <div 
      className="relative w-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Card */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-200">
        <img 
          src={player.avatar} 
          alt={player.name} 
          className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-700 hover:ring-yellow-500/60 transition-all duration-200" 
        />
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">{player.name}</h3>
          <p className="text-gray-400 text-sm">{player.followers}</p>
          <p className="text-gray-500 text-sm">{player.game}</p>
        </div>
        <div className="text-right">
          <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
            Player
          </div>
        </div>
      </div>

      {/* Hover Modal */}
      {isHovered && (
        <div className="absolute top-0 left-0 w-full transform -translate-y-4 z-40 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden hidden lg:block">
          {/* Player Header */}
          <div className="p-4 text-center border-b border-gray-700">
            <img 
              src={player.avatar} 
              alt={player.name} 
              className="w-20 h-20 rounded-full mx-auto object-cover ring-3 ring-yellow-500/60" 
            />
            <h3 className="text-white font-bold text-lg mt-3">{player.name}</h3>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">
                {mockStats.rank}
              </span>
              <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                {player.game}
              </span>
            </div>
          </div>

          {/* Player Stats */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-white font-bold text-lg">{mockStats.avgKD}</div>
                <div className="text-gray-400 text-xs">Avg K/D</div>
              </div>
              <div>
                <div className="text-white font-bold text-lg">{mockStats.winRate}</div>
                <div className="text-gray-400 text-xs">Win Rate</div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Recent Matches</span>
                <span className="text-white font-medium">{mockStats.recentMatches}</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-gray-400">Followers</span>
                <span className="text-white font-medium">{player.followers}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TeamCard({ team }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const mockStats = {
    winRate: `${Math.floor(Math.random() * 30) + 65}%`,
    tournaments: Math.floor(Math.random() * 15) + 8,
    founded: `20${Math.floor(Math.random() * 10) + 15}`,
    region: ["EU", "NA", "APAC", "SA"][Math.floor(Math.random() * 4)]
  };

  return (
    <div 
      className="relative w-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Card */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-200">
        <img 
          src={team.logo} 
          alt={team.name} 
          className="w-16 h-16 rounded object-cover ring-2 ring-gray-700 hover:ring-yellow-500/60 transition-all duration-200" 
        />
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">{team.name}</h3>
          <p className="text-gray-400 text-sm">{team.members}</p>
          <p className="text-yellow-400 text-sm font-medium">{team.rank}</p>
        </div>
        <div className="text-right">
          <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
            Team
          </div>
        </div>
      </div>

      {/* Hover Modal */}
      {isHovered && (
        <div className="absolute top-0 left-0 w-full transform -translate-y-4 z-40 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden hidden lg:block">
          {/* Team Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <img 
                src={team.logo} 
                alt={team.name} 
                className="w-16 h-16 rounded object-cover ring-3 ring-yellow-500/60" 
              />
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">{team.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">
                    {team.rank}
                  </span>
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                    {mockStats.region}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Stats */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-white font-bold text-lg">{mockStats.winRate}</div>
                <div className="text-gray-400 text-xs">Win Rate</div>
              </div>
              <div>
                <div className="text-white font-bold text-lg">{mockStats.tournaments}</div>
                <div className="text-gray-400 text-xs">Tournaments</div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Founded</span>
                <span className="text-white font-medium">{mockStats.founded}</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-gray-400">Members</span>
                <span className="text-white font-medium">{team.members}</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-gray-400">Region</span>
                <span className="text-white font-medium">{mockStats.region}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UtilityCard({ utility }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const mockStats = {
    category: ["Aim Training", "Strategy", "Analysis", "Practice"][Math.floor(Math.random() * 4)],
    lastUpdate: `${Math.floor(Math.random() * 30) + 1} days ago`,
    compatibility: "CS2, CSGO",
    size: `${Math.floor(Math.random() * 500) + 100}MB`
  };

  return (
    <div 
      className="relative w-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Card */}
      <div className="p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-200">
        <div className="flex gap-4 mb-4">
          <img 
            src={utility.thumbnail} 
            alt={utility.title} 
            className="w-20 h-12 rounded object-cover flex-shrink-0" 
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg mb-1">{utility.title}</h3>
            <p className="text-gray-400 text-sm mb-2">{utility.description}</p>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-yellow-400">★ {utility.rating}</span>
              <span className="text-gray-400">{utility.downloads}</span>
              <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium ml-auto">
                Utility
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-gray-300 text-sm font-medium">Related Clips</h4>
          <div className="flex gap-2 overflow-x-auto">
            {utility.clips.map(clip => (
              <div key={clip.id} className="flex-shrink-0 w-24">
                <div className="relative">
                  <img 
                    src={clip.thumbnail} 
                    alt={clip.title} 
                    className="w-full h-14 rounded object-cover" 
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded">
                    {clip.duration}
                  </div>
                </div>
                <p className="text-gray-400 text-[10px] mt-1 truncate">{clip.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Modal */}
      {isHovered && (
        <div className="absolute top-0 left-0 w-full transform -translate-y-4 z-40 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden hidden lg:block">
          {/* Utility Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex gap-4">
              <img 
                src={utility.thumbnail} 
                alt={utility.title} 
                className="w-24 h-16 rounded object-cover ring-2 ring-yellow-500/60" 
              />
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">{utility.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{utility.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">
                    ★ {utility.rating}
                  </span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                    {mockStats.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-white font-bold text-lg">{utility.rating}</div>
                <div className="text-gray-400 text-xs">Rating</div>
              </div>
              <div>
                <div className="text-white font-bold text-lg">{utility.downloads}</div>
                <div className="text-gray-400 text-xs">Downloads</div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Category</span>
                <span className="text-white font-medium">{mockStats.category}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Compatibility</span>
                <span className="text-white font-medium">{mockStats.compatibility}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Size</span>
                <span className="text-white font-medium">{mockStats.size}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Last Update</span>
                <span className="text-white font-medium">{mockStats.lastUpdate}</span>
              </div>
            </div>

            {/* Enhanced Clips Section */}
            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-white font-medium text-sm mb-3">Training Clips</h4>
              <div className="space-y-2">
                {utility.clips.map(clip => (
                  <div key={clip.id} className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={clip.thumbnail} 
                        alt={clip.title} 
                        className="w-16 h-10 rounded object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center">
                        <Play className="text-white" size={12} fill="white" />
                      </div>
                      <div className="absolute bottom-0 right-0 bg-black/80 text-white text-[9px] px-1 rounded-tl">
                        {clip.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{clip.title}</p>
                      <p className="text-gray-400 text-[10px]">Training Module</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-800 rounded w-64"></div>
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-800 rounded-full w-20"></div>
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-800/30 rounded-lg">
                <div className="w-48 aspect-video bg-gray-700 rounded flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}