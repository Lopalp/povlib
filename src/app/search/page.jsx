"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Filter } from "lucide-react";

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
      quality: "4K",
      map: ["Dust2", "Mirage", "Inferno", "Cache", "Overpass"][Math.floor(Math.random() * 5)],
      team: `Team${i + 1}`,
      year: "2024",
      players: [`Player${i + 1}`, `Player${i + 2}`],
    })),
    players: Array.from({ length: 15 }).map((_, i) => ({ 
      type: "player",
      name: `ProGamer${i + 1}`, 
      avatar: THUMBNAIL_IMAGE,
      followers: `${Math.floor(Math.random() * 50) + 10}K subscribers`,
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

    // Smart logic for "all"
    const { videos, players, teams, utilities } = contentTemplates;
    let itemsGenerated = 0;

    while (itemsGenerated < count) {
      const randomType = Math.random();
      
      if (randomType < 0.3 && players.length > 0) {
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

  useEffect(() => {
    setDisplayedItems(generateSmartContent(15));
  }, [activePill, generateSmartContent]);

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
      {/* Space for modal navbar */}
      <div className="h-16"></div>
      
      {/* Search Results Header */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-xl font-normal mb-1">
          <span className="text-gray-400">Search results for</span>{" "}
          <span className="text-white font-medium">"{searchQuery}"</span>
        </h1>
        <p className="text-gray-500 text-sm">About 1,240 results</p>
      </div>

      {/* Fixed Filter Bar */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {PILL_OPTIONS.map(pill => (
                <button
                  key={pill.id}
                  onClick={() => setActivePill(pill.id)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                    activePill === pill.id
                      ? "bg-white text-gray-900"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
            
            <div className="relative ml-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-200"
              >
                <Filter size={14} />
                <span className="text-sm font-medium hidden sm:inline">Filters</span>
              </button>
              
              {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 z-30">
                  <h3 className="text-white font-medium mb-3">Filters</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-300 text-sm">Upload date</label>
                      <select className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white">
                        <option>Any time</option>
                        <option>Last hour</option>
                        <option>Today</option>
                        <option>This week</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">Duration</label>
                      <select className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white">
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="space-y-4">
          {displayedItems.map((item, index) => (
            <div key={item.id}>
              {item.type === "video" && <VideoCard video={item} />}
              {item.type === "player" && <PlayerCard player={item} />}
              {item.type === "team" && <TeamCard team={item} />}
              {item.type === "utility" && <UtilityCard utility={item} />}
              {item.type === "separator" && (
                <div className="border-t border-gray-800 my-6"></div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video }) {
  return (
    <div className="flex gap-4 hover:bg-gray-800/30 rounded-lg transition-all duration-200 cursor-pointer p-2">
      {/* Large Thumbnail like YouTube */}
      <div className="relative w-96 flex-shrink-0">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full aspect-video object-cover rounded-lg" 
        />
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-1.5 py-0.5 rounded font-medium">
          {video.duration}
        </div>
        {/* Quality Badge */}
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">
          {video.quality}
        </div>
        {/* Watched Progress */}
        {video.watched && (
          <div className="absolute bottom-0 left-0 w-3/4 h-1 bg-red-600 rounded-b-lg"></div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 py-1">
        <h3 className="text-white font-medium text-base leading-5 line-clamp-2 mb-2">
          {video.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-1">
          <img 
            src={video.channelAvatar} 
            alt={video.channel} 
            className="w-6 h-6 rounded-full" 
          />
          <span className="text-gray-400 text-sm">{video.channel}</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <span className="text-gray-500 text-sm">Verified</span>
        </div>
        
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <span>{video.views}</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <span>{video.uploadDate}</span>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 leading-5">
          In this video, I'll show you how a 3k ELO player - a "pro" - thinks during the game. Want to get coached? Get a free trial session...
        </p>
        
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">New</span>
          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{video.quality}</span>
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player }) {
  return (
    <div className="flex items-center gap-4 hover:bg-gray-800/30 rounded-lg transition-all duration-200 cursor-pointer p-3">
      <div className="relative">
        <img 
          src={player.avatar} 
          alt={player.name} 
          className="w-20 h-20 rounded-full object-cover" 
        />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-white font-medium text-lg">{player.name}</h3>
        <p className="text-gray-400 text-sm">{player.followers}</p>
        <p className="text-gray-500 text-sm">{player.game}</p>
      </div>
      <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
        Subscribe
      </button>
    </div>
  );
}

function TeamCard({ team }) {
  return (
    <div className="flex items-center gap-4 hover:bg-gray-800/30 rounded-lg transition-all duration-200 cursor-pointer p-3">
      <div className="relative">
        <img 
          src={team.logo} 
          alt={team.name} 
          className="w-20 h-20 rounded-lg object-cover" 
        />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-white font-medium text-lg">{team.name}</h3>
        <p className="text-gray-400 text-sm">{team.members}</p>
        <p className="text-gray-500 text-sm">{team.region} • {team.rank}</p>
      </div>
      <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
        Follow
      </button>
    </div>
  );
}

function UtilityCard({ utility }) {
  return (
    <div className="hover:bg-gray-800/30 rounded-lg transition-all duration-200 cursor-pointer p-3">
      <div className="flex gap-4 mb-3">
        <img 
          src={utility.thumbnail} 
          alt={utility.title} 
          className="w-28 h-16 rounded-lg object-cover flex-shrink-0" 
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-base mb-1">{utility.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-2">{utility.description}</p>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-yellow-400">★ {utility.rating}</span>
            <span className="text-gray-500">{utility.downloads}</span>
            <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{utility.category}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-gray-300 text-sm font-medium">Related training clips</h4>
        <div className="flex gap-2 overflow-x-auto">
          {utility.clips.map(clip => (
            <div key={clip.id} className="flex-shrink-0 w-24">
              <div className="relative">
                <img 
                  src={clip.thumbnail} 
                  alt={clip.title} 
                  className="w-full h-14 rounded object-cover" 
                />
                <div className="absolute bottom-1 right-1 bg-black/90 text-white text-[10px] px-1 py-0.5 rounded">
                  {clip.duration}
                </div>
              </div>
              <p className="text-gray-500 text-[10px] mt-1 truncate">{clip.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}