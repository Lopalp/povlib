"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Filter, Play, Users, Trophy, Zap } from "lucide-react";

const PILL_OPTIONS = [
  { id: "all", label: "All" },
  { id: "videos", label: "Videos" },
  { id: "players", label: "Players" },
  { id: "teams", label: "Teams" },
  { id: "utilities", label: "Utilities" },
  { id: "unwatched", label: "Unwatched" },
  { id: "recent", label: "Recent" },
];

const THUMBNAIL_IMAGE = "https://images.unsplash.com/photo-1749731630653-d9b3f00573ed?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function SearchResultsPage() {
  return (
    <SearchResultsContent />
  );
}

function SearchResultsContent() {
  const [activePill, setActivePill] = useState("all");
  const [searchQuery, setSearchQuery] = useState("CS2 highlight plays");
  const [showFilters, setShowFilters] = useState(false);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Base content templates
  const contentTemplates = useMemo(() => ({
    videos: Array.from({ length: 20 }).map((_, i) => ({
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
    players: Array.from({ length: 15 }).map((_, i) => ({ 
      type: "player",
      name: `ProGamer${i + 1}`, 
      avatar: THUMBNAIL_IMAGE,
      followers: `${Math.floor(Math.random() * 50) + 10}K followers`,
      game: "Counter-Strike 2",
      rank: `Global Elite`,
      winRate: `${Math.floor(Math.random() * 20) + 70}%`,
    })),
    teams: Array.from({ length: 10 }).map((_, i) => ({ 
      type: "team",
      name: `Team Alpha${i + 1}`, 
      logo: THUMBNAIL_IMAGE,
      members: `${Math.floor(Math.random() * 10) + 5} members`,
      rank: `#${i + 1} Global`,
      winRate: `${Math.floor(Math.random() * 30) + 65}%`,
      region: ["EU", "NA", "APAC", "SA"][Math.floor(Math.random() * 4)]
    })),
    utilities: Array.from({ length: 8 }).map((_, i) => ({
      type: "utility",
      title: `Training Tool ${i + 1}`,
      description: "Advanced aim training and strategy analysis",
      thumbnail: THUMBNAIL_IMAGE,
      rating: (4.0 + Math.random()).toFixed(1),
      downloads: `${Math.floor(Math.random() * 10) + 1}K downloads`,
      category: ["Aim Training", "Strategy", "Analysis", "Practice"][Math.floor(Math.random() * 4)],
      clips: Array.from({ length: 3 }).map((__, j) => ({ 
        id: j, 
        title: `Training Session ${j + 1}`, 
        thumbnail: THUMBNAIL_IMAGE,
        duration: `${Math.floor(Math.random() * 5) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
      })),
    })),
  }), [searchQuery]);

  // Smart content generation with logical grouping
  const generateSmartContent = useCallback((count = 10) => {
    let result = [];
    
    if (activePill !== "all") {
      // For specific filters, just return that content type
      let content = [];
      switch (activePill) {
        case "videos":
          content = [...contentTemplates.videos];
          break;
        case "players":
          content = [...contentTemplates.players];
          break;
        case "teams":
          content = [...contentTemplates.teams];
          break;
        case "utilities":
          content = [...contentTemplates.utilities];
          break;
        case "unwatched":
          content = contentTemplates.videos.filter(v => !v.watched);
          break;
        case "recent":
          content = contentTemplates.videos.slice(0, 6);
          break;
      }
      return content.slice(0, count).map((item, index) => ({
        ...item,
        id: `${item.type}-${Date.now()}-${index}`,
      }));
    }

    // Smart logic for "all" - create logical groups
    const { videos, players, teams, utilities } = contentTemplates;
    let itemsGenerated = 0;

    while (itemsGenerated < count) {
      const randomType = Math.random();
      
      if (randomType < 0.3 && players.length > 0) {
        // Player block: Player + 2 Videos + Line
        const player = players[Math.floor(Math.random() * players.length)];
        const relatedVideos = videos.slice(0, 2);
        
        result.push({
          ...player,
          id: `player-${Date.now()}-${itemsGenerated}`,
        });
        itemsGenerated++;
        
        relatedVideos.forEach((video, index) => {
          if (itemsGenerated < count) {
            result.push({
              ...video,
              id: `video-${Date.now()}-${itemsGenerated}`,
              title: `${player.name} - ${video.title}`,
              channel: player.name,
            });
            itemsGenerated++;
          }
        });
        
        if (itemsGenerated < count) {
          result.push({ type: "separator", id: `sep-${Date.now()}-${itemsGenerated}` });
          itemsGenerated++;
        }
        
      } else if (randomType < 0.5 && teams.length > 0) {
        // Team block: Team + Videos + Featured Players + Line
        const team = teams[Math.floor(Math.random() * teams.length)];
        const teamVideos = videos.slice(0, 2);
        const featuredPlayers = players.slice(0, 2);
        
        result.push({
          ...team,
          id: `team-${Date.now()}-${itemsGenerated}`,
        });
        itemsGenerated++;
        
        teamVideos.forEach((video, index) => {
          if (itemsGenerated < count) {
            result.push({
              ...video,
              id: `video-${Date.now()}-${itemsGenerated}`,
              title: `${team.name} - ${video.title}`,
              team: team.name,
            });
            itemsGenerated++;
          }
        });
        
        featuredPlayers.forEach((player, index) => {
          if (itemsGenerated < count) {
            result.push({
              ...player,
              id: `player-${Date.now()}-${itemsGenerated}`,
              name: `${team.name} ${player.name}`,
            });
            itemsGenerated++;
          }
        });
        
        if (itemsGenerated < count) {
          result.push({ type: "separator", id: `sep-${Date.now()}-${itemsGenerated}` });
          itemsGenerated++;
        }
        
      } else {
        // Random single items
        const allItems = [...videos, ...utilities];
        const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
        
        result.push({
          ...randomItem,
          id: `${randomItem.type}-${Date.now()}-${itemsGenerated}`,
        });
        itemsGenerated++;
      }
    }

    return result.slice(0, count);
  }, [activePill, contentTemplates]);

  // Initialize content
  useEffect(() => {
    setDisplayedItems(generateSmartContent(15));
  }, [activePill, generateSmartContent]);

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading) return;
      
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.offsetHeight;
      
      if (scrollPosition >= documentHeight - 1000) {
        setIsLoading(true);
        
        setTimeout(() => {
          setDisplayedItems(prev => [
            ...prev,
            ...generateSmartContent(8)
          ]);
          setIsLoading(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [generateSmartContent, isLoading]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Fixed Header with space for modal navbar */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 z-30 pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
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
          <div className="flex items-center justify-between">
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {PILL_OPTIONS.map(pill => (
                <button
                  key={pill.id}
                  onClick={() => setActivePill(pill.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                    activePill === pill.id
                      ? "bg-yellow-500/60 text-gray-900"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
            
            {/* Different Filter Design */}
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 border border-gray-600"
              >
                <Filter size={16} />
                <span className="text-sm font-medium hidden sm:inline">Advanced</span>
              </button>
              
              {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4">
                  <h3 className="text-white font-medium mb-3">Filters</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-300 text-sm">Upload date</label>
                      <select className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm">
                        <option>Any time</option>
                        <option>Last hour</option>
                        <option>Today</option>
                        <option>This week</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">Duration</label>
                      <select className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm">
                        <option>Any duration</option>
                        <option>Under 4 minutes</option>
                        <option>4-20 minutes</option>
                        <option>Over 20 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content with top padding for fixed header */}
      <div className="pt-48 max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="space-y-6">
          {displayedItems.map((item, index) => (
            <div key={item.id}>
              {item.type === "video" && <VideoCard video={item} />}
              {item.type === "player" && <PlayerCard player={item} />}
              {item.type === "team" && <TeamCard team={item} />}
              {item.type === "utility" && <UtilityCard utility={item} />}
              {item.type === "separator" && (
                <div className="border-t border-gray-700 my-8"></div>
              )}
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video }) {
  const mockKDA = `${Math.floor(Math.random() * 30) + 10}/${Math.floor(Math.random() * 10) + 1}/${Math.floor(Math.random() * 15) + 5}`;

  return (
    <div className="flex gap-6 p-6 rounded-xl hover:bg-gray-800/20 transition-all duration-200 cursor-pointer">
      {/* Larger Thumbnail */}
      <div className="relative w-60 sm:w-72 md:w-80 flex-shrink-0">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full aspect-video object-cover rounded-xl shadow-lg" 
        />
        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 bg-black/90 text-white text-sm px-2 py-1 rounded-lg font-medium">
          {video.duration}
        </div>
        {/* Watched Indicator */}
        {video.watched && (
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-yellow-500/70 rounded-b-xl"></div>
        )}
        {/* Quality Badge */}
        <div className="absolute top-3 left-3 bg-yellow-500/80 text-gray-900 text-xs px-2 py-1 rounded-lg font-bold">
          {video.quality}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 py-2">
        <h3 className="text-white font-semibold text-lg sm:text-xl leading-tight line-clamp-2 mb-3">
          {video.title}
        </h3>
        
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={video.channelAvatar} 
            alt={video.channel} 
            className="w-8 h-8 rounded-full ring-2 ring-gray-700" 
          />
          <span className="text-gray-300 text-base font-medium">{video.channel}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-400 text-base mb-4">
          <span>{video.views}</span>
          <span>•</span>
          <span>{video.uploadDate}</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">K/D/A:</span>
            <span className="text-yellow-400 font-bold text-base">{mockKDA}</span>
          </div>
          <span className="text-gray-600">•</span>
          <span className="text-gray-300 bg-gray-800 px-3 py-1 rounded-lg">{video.map}</span>
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player }) {
  return (
    <div className="flex items-center gap-6 p-6 rounded-xl hover:bg-gray-800/20 transition-all duration-200 cursor-pointer">
      <img 
        src={player.avatar} 
        alt={player.name} 
        className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-700 shadow-lg" 
      />
      <div className="flex-1">
        <h3 className="text-white font-bold text-2xl mb-2">{player.name}</h3>
        <p className="text-gray-300 text-lg mb-2">{player.followers}</p>
        <div className="flex items-center gap-6">
          <span className="text-gray-400 text-base">{player.game}</span>
          <span className="text-gray-600">•</span>
          <span className="text-yellow-400 font-bold text-lg bg-yellow-500/20 px-3 py-1 rounded-lg">{player.rank}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-300 text-base">Win Rate: <span className="text-green-400 font-bold">{player.winRate}</span></span>
        </div>
      </div>
    </div>
  );
}

function TeamCard({ team }) {
  return (
    <div className="flex items-center gap-6 p-6 rounded-xl hover:bg-gray-800/20 transition-all duration-200 cursor-pointer">
      <img 
        src={team.logo} 
        alt={team.name} 
        className="w-24 h-24 rounded-lg object-cover ring-4 ring-gray-700 shadow-lg" 
      />
      <div className="flex-1">
        <h3 className="text-white font-bold text-2xl mb-2">{team.name}</h3>
        <p className="text-gray-300 text-lg mb-2">{team.members}</p>
        <div className="flex items-center gap-6">
          <span className="text-yellow-400 font-bold text-lg bg-yellow-500/20 px-3 py-1 rounded-lg">{team.rank}</span>
          <span className="text-gray-600">•</span>
          <span className="text-blue-400 font-medium text-base bg-blue-500/20 px-3 py-1 rounded-lg">{team.region}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-300 text-base">Win Rate: <span className="text-green-400 font-bold">{team.winRate}</span></span>
        </div>
      </div>
    </div>
  );
}

function UtilityCard({ utility }) {
  return (
    <div className="p-6 rounded-xl hover:bg-gray-800/20 transition-all duration-200 cursor-pointer">
      <div className="flex gap-6 mb-4">
        <img 
          src={utility.thumbnail} 
          alt={utility.title} 
          className="w-32 h-20 rounded-lg object-cover flex-shrink-0 shadow-lg" 
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-xl mb-2">{utility.title}</h3>
          <p className="text-gray-300 text-base mb-3 line-clamp-2">{utility.description}</p>
          <div className="flex items-center gap-6 text-base">
            <span className="text-yellow-400 font-bold">★ {utility.rating}</span>
            <span className="text-gray-300">{utility.downloads}</span>
            <span className="text-gray-600">•</span>
            <span className="text-green-400 bg-green-500/20 px-3 py-1 rounded-lg font-medium">{utility.category}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-gray-200 text-base font-semibold">Related Clips</h4>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {utility.clips.map(clip => (
            <div key={clip.id} className="flex-shrink-0 w-32">
              <div className="relative">
                <img 
                  src={clip.thumbnail} 
                  alt={clip.title} 
                  className="w-full h-18 rounded-lg object-cover shadow-md" 
                />
                <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-1.5 py-0.5 rounded">
                  {clip.duration}
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-2 truncate">{clip.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}