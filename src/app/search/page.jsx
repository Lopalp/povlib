"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Filter } from "lucide-react";

const PILL_OPTIONS = [
  { id: "all", label: "All" },
  { id: "videos", label: "Videos" },
  { id: "players", label: "Players" },
  { id: "teams", label: "Teams" },
  { id: "utilities", label: "Utilities" },
  { id: "events", label: "Events" },
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
      player: `Player${i + 1}`,
      isPro: Math.random() > 0.7,
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
      members: `5 members`,
      rank: `#${i + 1} Global`,
      winRate: `${Math.floor(Math.random() * 30) + 65}%`,
      region: ["EU", "NA", "APAC", "SA"][Math.floor(Math.random() * 4)],
      players: Array.from({ length: 5 }).map((__, j) => ({
        name: `Player${i * 5 + j + 1}`,
        avatar: THUMBNAIL_IMAGE,
        role: ["IGL", "AWP", "Entry", "Support", "Lurker"][j]
      }))
    })),
    utilities: Array.from({ length: 8 }).map((_, i) => ({
      type: "utility",
      title: `Smoke ${["A Site", "B Site", "Mid", "Long", "Short"][Math.floor(Math.random() * 5)]} - ${["Mirage", "Dust2", "Inferno"][Math.floor(Math.random() * 3)]}`,
      description: "Perfect smoke lineup for site control and map control",
      thumbnail: THUMBNAIL_IMAGE,
      rating: (4.0 + Math.random()).toFixed(1),
      downloads: `${Math.floor(Math.random() * 10) + 1}K downloads`,
      category: ["Smoke", "Flash", "HE Grenade", "Molotov"][Math.floor(Math.random() * 4)],
      map: ["Mirage", "Dust2", "Inferno", "Cache", "Overpass"][Math.floor(Math.random() * 5)],
      videoCount: Math.floor(Math.random() * 5) + 3,
      landingSpot: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
      throwSpots: Array.from({ length: Math.floor(Math.random() * 4) + 2 }).map(() => ({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      }))
    })),
    events: Array.from({ length: 5 }).map((_, i) => ({
      type: "event",
      title: `${["Major Championship", "IEM", "ESL Pro League", "BLAST Premier", "PGL Major"][i]} 2024`,
      description: "The biggest Counter-Strike tournament of the year",
      thumbnail: THUMBNAIL_IMAGE,
      startDate: "Dec 15, 2024",
      endDate: "Dec 22, 2024",
      prizePool: `${Math.floor(Math.random() * 500 + 500)}K`,
      teams: Array.from({ length: 8 }).map((__, j) => ({
        name: `Team ${j + 1}`,
        logo: THUMBNAIL_IMAGE,
        rank: `#${j + 1}`
      })),
      videos: Array.from({ length: 6 }).map((__, j) => ({
        title: `Match ${j + 1} Highlights`,
        thumbnail: THUMBNAIL_IMAGE,
        duration: `${Math.floor(Math.random() * 10) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        views: `${Math.floor(Math.random() * 999) + 100}K views`
      }))
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
        case "events":
          content = [...contentTemplates.events];
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
    const { videos, players, teams, utilities, events } = contentTemplates;
    let itemsGenerated = 0;

    while (itemsGenerated < count) {
      const randomType = Math.random();
      
      if (randomType < 0.15 && events.length > 0) {
        // Event block: Event + Teams + Videos
        const event = events[Math.floor(Math.random() * events.length)];
        
        result.push({ type: "separator", id: `sep-${Date.now()}-${itemsGenerated}` });
        itemsGenerated++;
        
        if (itemsGenerated < count) {
          result.push({
            ...event,
            id: `event-${Date.now()}-${itemsGenerated}`,
          });
          itemsGenerated++;
        }
        
      } else if (randomType < 0.35 && players.length > 0) {
        // Player block: Line + Player + 2 Videos + Line
        result.push({ type: "separator", id: `sep-${Date.now()}-${itemsGenerated}` });
        itemsGenerated++;
        
        const player = players[Math.floor(Math.random() * players.length)];
        const relatedVideos = videos.slice(0, 2);
        
        if (itemsGenerated < count) {
          result.push({
            ...player,
            id: `player-${Date.now()}-${itemsGenerated}`,
          });
          itemsGenerated++;
        }
        
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
        
      } else if (randomType < 0.55 && teams.length > 0) {
        // Team block: Line + Team + Videos + Featured Players + Line
        result.push({ type: "separator", id: `sep-${Date.now()}-${itemsGenerated}` });
        itemsGenerated++;
        
        const team = teams[Math.floor(Math.random() * teams.length)];
        const teamVideos = videos.slice(0, 2);
        
        if (itemsGenerated < count) {
          result.push({
            ...team,
            id: `team-${Date.now()}-${itemsGenerated}`,
          });
          itemsGenerated++;
        }
        
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-lg sm:text-xl font-normal mb-1">
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
              {item.type === "event" && <EventCard event={item} />}
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
    <div className="flex flex-col sm:flex-row gap-4 hover:bg-gray-800/30 rounded-lg transition-all duration-200 cursor-pointer p-2">
      {/* Large Thumbnail - responsive sizing */}
      <div className="relative w-full sm:w-80 md:w-96 flex-shrink-0">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full aspect-video object-cover rounded-lg" 
        />
        {/* Duration Badge with semi-transparent background */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-medium">
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
        <h3 className="text-white font-medium text-sm sm:text-base leading-5 line-clamp-2 mb-2">
          {video.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-1">
          <img 
            src={video.channelAvatar} 
            alt={video.channel} 
            className="w-6 h-6 rounded-full" 
          />
          <span className="text-gray-400 text-sm">{video.channel}</span>
          {video.isPro && (
            <>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <span className="text-blue-400 text-sm font-medium">Pro</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <span>{video.views}</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <span>{video.uploadDate}</span>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 leading-5 mb-2 hidden sm:block">
          Player: <span className="text-gray-300 font-medium">{video.player}</span> showcases professional gameplay techniques and strategies. Perfect for learning advanced mechanics and game sense.
        </p>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">New</span>
          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{video.quality}</span>
          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{video.map}</span>
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-gray-800/30 rounded-lg transition-all duration-200 cursor-pointer p-3">
      <div className="relative">
        <img 
          src={player.avatar} 
          alt={player.name} 
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" 
        />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-gray-900">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="flex-1 w-full sm:w-auto">
        <h3 className="text-white font-medium text-lg">{player.name}</h3>
        <p className="text-gray-400 text-sm">{player.followers}</p>
        <p className="text-gray-500 text-sm">{player.game}</p>
      </div>
      <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto">
        Subscribe
      </button>
    </div>
  );
}

function TeamCard({ team }) {
  return (
    <div className="bg-gray-800/20 rounded-xl p-4 sm:p-6 hover:bg-gray-800/30 transition-all duration-200 cursor-pointer border border-gray-700/30">
      {/* Team Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative">
          <img 
            src={team.logo} 
            alt={team.name} 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover" 
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center border-2 border-gray-900">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg sm:text-xl mb-1">{team.name}</h3>
          <p className="text-gray-300 text-sm mb-2">{team.members} • {team.region}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium border border-yellow-400/30">{team.rank}</span>
            <span className="text-gray-400 text-sm">Win Rate: <span className="text-green-400 font-medium">{team.winRate}</span></span>
          </div>
        </div>
        <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto">
          Follow Team
        </button>
      </div>

      {/* Team Players - Responsive Layout */}
      <div className="space-y-3">
        <h4 className="text-white font-medium text-base">Active Roster</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {team.players.map((player, index) => (
            <div key={index} className="bg-gray-800/40 rounded-lg p-3 hover:bg-gray-700/40 transition-colors">
              <div className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2">
                <img 
                  src={player.avatar} 
                  alt={player.name} 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0" 
                />
                <div className="min-w-0 flex-1 sm:flex-none sm:text-center">
                  <p className="text-white text-sm font-medium truncate">{player.name}</p>
                  <p className="text-gray-400 text-xs">{player.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Team Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-700/50">
          <div className="text-center">
            <p className="text-white font-bold text-lg">{team.winRate}</p>
            <p className="text-gray-400 text-xs">Win Rate</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">{Math.floor(Math.random() * 20) + 15}</p>
            <p className="text-gray-400 text-xs">Tournaments</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">#{Math.floor(Math.random() * 10) + 1}</p>
            <p className="text-gray-400 text-xs">World Rank</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">${Math.floor(Math.random() * 500) + 100}K</p>
            <p className="text-gray-400 text-xs">Prize Money</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-xl p-4 sm:p-6 hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-200 cursor-pointer border border-gray-600/30">
      {/* Event Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <img 
          src={event.thumbnail} 
          alt={event.title} 
          className="w-full sm:w-40 h-24 sm:h-24 rounded-lg object-cover flex-shrink-0" 
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">● LIVE</span>
            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium border border-yellow-400/30">{event.prizePool}</span>
          </div>
          <h3 className="text-white font-bold text-lg sm:text-xl mb-2">{event.title}</h3>
          <p className="text-gray-300 text-sm mb-2">{event.description}</p>
          <p className="text-gray-400 text-sm">{event.startDate} - {event.endDate}</p>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="mb-6">
        <h4 className="text-white font-medium text-base mb-3">Participating Teams</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {event.teams.slice(0, 4).map((team, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-3 text-center hover:bg-gray-700/50 transition-colors">
              <img 
                src={team.logo} 
                alt={team.name} 
                className="w-10 h-10 rounded object-cover mx-auto mb-2" 
              />
              <h5 className="text-white text-xs font-medium truncate">{team.name}</h5>
              <p className="text-gray-400 text-xs">{team.rank}</p>
            </div>
          ))}
        </div>
        {event.teams.length > 4 && (
          <div className="text-center mt-3">
            <span className="text-gray-400 text-sm">+{event.teams.length - 4} more teams</span>
          </div>
        )}
      </div>

      {/* Videos Grid */}
      <div>
        <h4 className="text-white font-medium text-base mb-3">Latest Highlights</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {event.videos.slice(0, 3).map((video, index) => (
            <div key={index} className="bg-gray-800/40 rounded-lg overflow-hidden hover:bg-gray-700/40 transition-colors">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-20 object-cover" 
                />
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>
                <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  LIVE
                </div>
              </div>
              <div className="p-2">
                <h5 className="text-white text-sm font-medium line-clamp-2 mb-1">{video.title}</h5>
                <p className="text-gray-400 text-xs">{video.views}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UtilityCard({ utility }) {
  return (
    <div className="bg-gray-800/20 rounded-xl p-4 sm:p-6 hover:bg-gray-800/30 transition-all duration-200 cursor-pointer">
      {/* Utility Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Large Radar Map */}
        <div className="w-full sm:w-48 h-32 sm:h-32 rounded-lg bg-gray-900 border border-gray-700 p-3 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Map Border */}
            <rect width="100" height="100" fill="none" stroke="#4b5563" strokeWidth="0.8" rx="2"/>
            
            {/* Map Sections - Only Lines */}
            {/* A Site */}
            <rect x="10" y="10" width="35" height="25" fill="none" stroke="#6b7280" strokeWidth="0.6" rx="1"/>
            <text x="27" y="25" fill="#9ca3af" fontSize="5" textAnchor="middle" fontWeight="bold">A</text>
            
            {/* B Site */}
            <rect x="55" y="10" width="35" height="25" fill="none" stroke="#6b7280" strokeWidth="0.6" rx="1"/>
            <text x="72" y="25" fill="#9ca3af" fontSize="5" textAnchor="middle" fontWeight="bold">B</text>
            
            {/* Mid */}
            <rect x="10" y="45" width="80" height="15" fill="none" stroke="#6b7280" strokeWidth="0.6" rx="1"/>
            <text x="50" y="55" fill="#9ca3af" fontSize="5" textAnchor="middle" fontWeight="bold">MID</text>
            
            {/* Long */}
            <rect x="10" y="70" width="35" height="25" fill="none" stroke="#6b7280" strokeWidth="0.6" rx="1"/>
            <text x="27" y="85" fill="#9ca3af" fontSize="4" textAnchor="middle">LONG</text>
            
            {/* Short */}
            <rect x="55" y="70" width="35" height="25" fill="none" stroke="#6b7280" strokeWidth="0.6" rx="1"/>
            <text x="72" y="85" fill="#9ca3af" fontSize="4" textAnchor="middle">SHORT</text>
            
            {/* Connection Lines */}
            <line x1="45" y1="22" x2="55" y2="22" stroke="#6b7280" strokeWidth="0.4"/>
            <line x1="27" y1="35" x2="27" y2="45" stroke="#6b7280" strokeWidth="0.4"/>
            <line x1="72" y1="35" x2="72" y2="45" stroke="#6b7280" strokeWidth="0.4"/>
            <line x1="27" y1="60" x2="27" y2="70" stroke="#6b7280" strokeWidth="0.4"/>
            <line x1="72" y1="60" x2="72" y2="70" stroke="#6b7280" strokeWidth="0.4"/>
            
            {/* Landing Spot (Large Red Circle) */}
            <circle 
              cx={utility.landingSpot.x} 
              cy={utility.landingSpot.y} 
              r="4" 
              fill="#ef4444" 
              stroke="#ffffff" 
              strokeWidth="1"
            />
            
            {/* Throw Spots (Blue Circles) */}
            {utility.throwSpots.map((spot, index) => (
              <circle 
                key={index}
                cx={spot.x} 
                cy={spot.y} 
                r="2.5" 
                fill="#3b82f6" 
                stroke="#ffffff" 
                strokeWidth="0.8"
              />
            ))}
            
            {/* Trajectory Lines */}
            {utility.throwSpots.map((spot, index) => (
              <line 
                key={index}
                x1={spot.x} 
                y1={spot.y} 
                x2={utility.landingSpot.x} 
                y2={utility.landingSpot.y} 
                stroke="#fbbf24" 
                strokeWidth="0.8" 
                strokeDasharray="2,1"
              />
            ))}
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg sm:text-xl mb-2">{utility.title}</h3>
          <p className="text-gray-300 text-sm sm:text-base mb-3">{utility.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-yellow-400 font-medium">★ {utility.rating}</span>
            <span className="text-gray-400">{utility.downloads}</span>
            <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30">{utility.category}</span>
            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">{utility.map}</span>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
          <span className="text-gray-300">Landing spot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
          <span className="text-gray-300">Throw positions ({utility.throwSpots.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-yellow-400 border-dashed"></div>
          <span className="text-gray-300">Trajectory</span>
        </div>
      </div>

      {/* Related Videos */}
      <div className="space-y-3">
        <h4 className="text-white font-medium text-base">Tutorial Videos ({utility.videoCount})</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gray-800/40 rounded-lg p-3 hover:bg-gray-700/40 transition-colors">
              <div className="relative mb-2">
                <img 
                  src={THUMBNAIL_IMAGE} 
                  alt={`Tutorial ${index + 1}`} 
                  className="w-full h-20 rounded object-cover" 
                />
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {Math.floor(Math.random() * 3) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}
                </div>
                <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  HD
                </div>
              </div>
              <h5 className="text-white text-sm font-medium line-clamp-2 mb-1">
                {["Setup Tutorial", "Advanced Lineup", "Pro Tips"][index]} - {utility.map}
              </h5>
              <p className="text-gray-400 text-xs">
                {Math.floor(Math.random() * 50) + 10}K views • {Math.floor(Math.random() * 7) + 1} days ago
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}