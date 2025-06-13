"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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

  // Generate random mixed content for infinite scroll
  const generateRandomContent = useCallback((count = 10) => {
    let allContent = [];
    
    switch (activePill) {
      case "videos":
        allContent = [...contentTemplates.videos];
        break;
      case "players":
        allContent = [...contentTemplates.players];
        break;
      case "teams":
        allContent = [...contentTemplates.teams];
        break;
      case "utilities":
        allContent = [...contentTemplates.utilities];
        break;
      case "unwatched":
        allContent = contentTemplates.videos.filter(v => !v.watched);
        break;
      case "recent":
        allContent = contentTemplates.videos.slice(0, 6);
        break;
      default:
        // Mix all content types dynamically
        allContent = [
          ...contentTemplates.videos,
          ...contentTemplates.players,
          ...contentTemplates.teams,
          ...contentTemplates.utilities
        ];
        break;
    }

    // Shuffle and take random items
    const shuffled = allContent.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((item, index) => ({
      ...item,
      id: `${item.type}-${Date.now()}-${index}`,
    }));
  }, [activePill, contentTemplates]);

  // Initialize content
  useEffect(() => {
    setDisplayedItems(generateRandomContent(15));
  }, [activePill, generateRandomContent]);

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading) return;
      
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.offsetHeight;
      
      if (scrollPosition >= documentHeight - 1000) {
        setIsLoading(true);
        
        // Simulate loading delay
        setTimeout(() => {
          setDisplayedItems(prev => [
            ...prev,
            ...generateRandomContent(8)
          ]);
          setIsLoading(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [generateRandomContent, isLoading]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header with more spacing */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 z-10 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {searchQuery && (
            <div className="mb-6">
              <h1 className="text-2xl font-normal">
                <span className="text-gray-400">Search results for</span>{" "}
                <span className="text-white font-medium">"{searchQuery}"</span>
              </h1>
              <p className="text-gray-500 text-sm mt-2">About 1,240 results</p>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-hide">
              {PILL_OPTIONS.map(pill => {
                const Icon = pill.icon;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setActivePill(pill.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                      activePill === pill.id
                        ? "bg-yellow-500/60 text-gray-900"
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
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-all duration-200 ml-auto sm:ml-0"
            >
              <Filter size={14} />
              <span className="text-sm font-medium hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="space-y-4">
          {displayedItems.map((item, index) => (
            <div key={item.id}>
              {item.type === "video" && <VideoCard video={item} />}
              {item.type === "player" && <PlayerCard player={item} />}
              {item.type === "team" && <TeamCard team={item} />}
              {item.type === "utility" && <UtilityCard utility={item} />}
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
    <div className="flex gap-4 p-4 rounded-lg hover:bg-gray-800/20 transition-all duration-200 cursor-pointer">
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
        {/* Watched Indicator */}
        {video.watched && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/60"></div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium text-sm sm:text-base leading-tight line-clamp-2 mb-2">
          {video.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-1">
          <img 
            src={video.channelAvatar} 
            alt={video.channel} 
            className="w-6 h-6 rounded-full" 
          />
          <span className="text-gray-400 text-sm">{video.channel}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <span>{video.views}</span>
          <span>•</span>
          <span>{video.uploadDate}</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">K/D/A:</span>
          <span className="text-yellow-400 font-medium">{mockKDA}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400">{video.map}</span>
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-800/20 transition-all duration-200 cursor-pointer">
      <img 
        src={player.avatar} 
        alt={player.name} 
        className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-700" 
      />
      <div className="flex-1">
        <h3 className="text-white font-medium text-lg">{player.name}</h3>
        <p className="text-gray-400 text-sm">{player.followers}</p>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-gray-500 text-sm">{player.game}</span>
          <span className="text-gray-600">•</span>
          <span className="text-yellow-400 text-sm font-medium">{player.rank}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400 text-sm">Win Rate: {player.winRate}</span>
        </div>
      </div>
    </div>
  );
}

function TeamCard({ team }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-800/20 transition-all duration-200 cursor-pointer">
      <img 
        src={team.logo} 
        alt={team.name} 
        className="w-16 h-16 rounded object-cover ring-2 ring-gray-700" 
      />
      <div className="flex-1">
        <h3 className="text-white font-medium text-lg">{team.name}</h3>
        <p className="text-gray-400 text-sm">{team.members}</p>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-yellow-400 text-sm font-medium">{team.rank}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400 text-sm">{team.region}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400 text-sm">Win Rate: {team.winRate}</span>
        </div>
      </div>
    </div>
  );
}

function UtilityCard({ utility }) {
  return (
    <div className="p-4 rounded-lg hover:bg-gray-800/20 transition-all duration-200 cursor-pointer">
      <div className="flex gap-4 mb-3">
        <img 
          src={utility.thumbnail} 
          alt={utility.title} 
          className="w-20 h-12 rounded object-cover flex-shrink-0" 
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-lg mb-1">{utility.title}</h3>
          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{utility.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-yellow-400">★ {utility.rating}</span>
            <span className="text-gray-400">{utility.downloads}</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">{utility.category}</span>
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
  );
}