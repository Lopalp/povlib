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
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
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
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        <div className="space-y-4 sm:space-y-6">
          {displayedItems.map((item, index) => (
            <div key={item.id}>
              {item.type === "video" && <VideoCard video={item} />}
              {item.type === "player" && <PlayerCard player={item} />}
              {item.type === "team" && <TeamCard team={item} />}
              {item.type === "utility" && <UtilityCard utility={item} />}
              {item.type === "event" && <EventCard event={item} />}
              {item.type === "separator" && (
                <div className="border-t border-gray-800 my-6 sm:my-8"></div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-center py-6 sm:py-8">
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
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 hover:bg-gray-800/30 rounded-lg transition-all duration-200 cursor-pointer p-2 sm:p-2">
      {/* Large Thumbnail like YouTube */}
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
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" 
          />
          <span className="text-gray-400 text-xs sm:text-sm">{video.channel}</span>
          {video.isPro && (
            <>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <span className="text-blue-400 text-xs sm:text-sm font-medium">Pro</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm mb-2">
          <span>{video.views}</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <span>{video.uploadDate}</span>
        </div>

        <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 leading-4 sm:leading-5 mb-2">
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
    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 hover:bg-gray-800/30 rounded-lg transition-all duration-200 cursor-pointer p-3 sm:p-3">
      <div className="relative">
        <img 
          src={player.avatar} 
          alt={player.name} 
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" 
        />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-white font-medium text-base sm:text-lg">{player.name}</h3>
        <p className="text-gray-400 text-sm">{player.followers}</p>
        <p className="text-gray-500 text-sm">{player.game}</p>
      </div>
      <button className="w-full sm:w-auto bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
        Subscribe
      </button>
    </div>
  );
}

function TeamCard({ team }) {
  return (
    <div className="bg-gray-800/30 rounded-xl p-4 sm:p-6 hover:bg-gray-800/40 transition-all duration-200 cursor-pointer">
      {/* Team Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
        <div className="relative">
          <img 
            src={team.logo} 
            alt={team.name} 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover" 
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">{team.name}</h3>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base mb-3">
            <span className="text-gray-300">{team.members}</span>
            <span className="text-gray-500">•</span>
            <span className="text-yellow-400 font-bold bg-yellow-500/20 px-3 py-1 rounded-full">{team.rank}</span>
            <span className="text-gray-500">•</span>
            <span className="text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">{team.region}</span>
          </div>
          <div className="text-sm text-gray-400">
            Win Rate: <span className="text-green-400 font-bold">{team.winRate}</span>
          </div>
        </div>
        <button className="w-full sm:w-auto bg-white text-gray-900 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
          Follow Team
        </button>
      </div>

      {/* Active Roster - Horizontal List */}
      <div>
        <h4 className="text-white font-semibold text-base mb-4">Active Roster</h4>
        <div className="space-y-3">
          {team.players.map((player, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-800/40 rounded-lg hover:bg-gray-700/40 transition-colors">
              <img 
                src={player.avatar} 
                alt={player.name} 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <h5 className="text-white font-medium text-sm sm:text-base">{player.name}</h5>
                <p className="text-gray-400 text-xs sm:text-sm">{player.role}</p>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 text-xs font-medium bg-yellow-500/20 px-2 py-1 rounded">
                  {player.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <div className="bg-gray-800/30 rounded-xl p-4 sm:p-6 hover:bg-gray-800/40 transition-all duration-200 cursor-pointer">
      {/* Event Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
        <img 
          src={event.thumbnail} 
          alt={event.title} 
          className="w-full sm:w-40 h-24 sm:h-28 rounded-lg object-cover flex-shrink-0" 
        />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
            <div>
              <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">{event.title}</h3>
              <p className="text-gray-300 text-sm sm:text-base">{event.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold">LIVE</span>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs sm:text-sm font-bold">{event.prizePool}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-400">
            <span>{event.startDate} - {event.endDate}</span>
            <span>•</span>
            <span>{event.teams.length} teams</span>
            <span>•</span>
            <span>{event.videos.length} highlights</span>
          </div>
        </div>
      </div>

      {/* Teams Section */}
      <div className="mb-6">
        <h4 className="text-white font-semibold text-base mb-3">Participating Teams</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {event.teams.slice(0, 8).map((team, index) => (
            <div key={index} className="text-center">
              <img 
                src={team.logo} 
                alt={team.name} 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover mx-auto mb-2" 
              />
              <p className="text-white text-xs font-medium truncate">{team.name}</p>
              <p className="text-gray-400 text-[10px]">{team.rank}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Videos Section */}
      <div>
        <h4 className="text-white font-semibold text-base mb-3">Latest Highlights</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {event.videos.slice(0, 3).map((video, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-700/50 transition-colors">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-20 sm:h-24 object-cover" 
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  LIVE
                </div>
              </div>
              <div className="p-3">
                <h5 className="text-white font-medium text-sm line-clamp-2 mb-1">{video.title}</h5>
                <p className="text-gray-400 text-xs">{video.views}</p>
              </div>
            </div>
          ))}
        </div>
        
        {event.videos.length > 3 && (
          <button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            View all {event.videos.length} highlights
          </button>
        )}
      </div>
    </div>
  );
}

function UtilityCard({ utility }) {
  return (
    <div className="bg-gray-800/30 rounded-xl p-4 sm:p-6 hover:bg-gray-800/40 transition-all duration-200 cursor-pointer">
      {/* Header with larger presence */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
        {/* Large Radar Map SVG - only lines */}
        <div className="w-full sm:w-48 h-32 sm:h-36 rounded-lg bg-gray-900 flex-shrink-0 p-4 border border-gray-700">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Map Outline - only lines */}
            <rect width="120" height="120" fill="none" stroke="#6b7280" strokeWidth="1" rx="4"/>
            
            {/* Map Sections - wireframe style */}
            <line x1="20" y1="20" x2="55" y2="20" stroke="#9ca3af" strokeWidth="0.8"/>
            <line x1="55" y1="20" x2="55" y2="45" stroke="#9ca3af" strokeWidth="0.8"/>
            <line x1="55" y1="45" x2="20" y2="45" stroke="#9ca3af" strokeWidth="0.8"/>
            <line x1="20" y1="45" x2="20" y2="20" stroke="#9ca3af" strokeWidth="0.8"/>
            
            <line x1="65" y1="20" x2="100" y2="20" stroke="#9ca3af" strokeWidth="0.8"/>
            <line x1="100" y1="20" x2="100" y2="45" stroke="#9ca3af" strokeWidth="0.8"/>
            <line x1="100" y1="45" x2="65" y2="45" stroke="#9ca3af" strokeWidth="0.8"/>
            <line x1="65" y1="45" x2="65" y2="20" stroke="#9ca3af" strokeWidth="0.8"/>
            
            <line x1="20" y1="55" x2="100" y2="55" stroke="#9ca3af" strokeWidth="0.8"/>
            <line x1="20" y1="70" x2="100" y2="70" stroke="#9ca3af" strokeWidth="0.8"/>
            
            <line x1="20" y1="80" x2="55" y2="80" stroke="#9ca3af" strokeWidth="0.8"/>
            <line x1="55" y1="80" x2="55" y2="100" stroke="#9ca3af" strokeWidth="0.8"/>
            <line x1="55" y1="100" x2="20" y2="100" stroke="#9ca3af" strokeWidth="0.8"/>
            <line x1="20" y1="100" x2="20" y2="80" stroke="#9ca3af" strokeWidth="0.8"/>
            
            <line x1="65" y1="80" x2="100" y2="80" stroke="#9ca3af" strokeWidth="0.8"/>
            <line x1="100" y1="80" x2="100" y2="100" stroke="#9ca3af" strokeWidth="0.8"/>
            <line x1="100" y1="100" x2="65" y2="100" stroke="#9ca3af" strokeWidth="0.8"/>
            <line x1="65" y1="100" x2="65" y2="80" stroke="#9ca3af" strokeWidth="0.8"/>
            
            {/* Landing Spot (Large Red Circle) */}
            <circle 
              cx={utility.landingSpot.x + 10} 
              cy={utility.landingSpot.y + 10} 
              r="4" 
              fill="#ef4444" 
              stroke="#ffffff" 
              strokeWidth="1"
            />
            
            {/* Throw Spots (Blue Circles) */}
            {utility.throwSpots.map((spot, index) => (
              <circle 
                key={index}
                cx={spot.x + 10} 
                cy={spot.y + 10} 
                r="3" 
                fill="#3b82f6" 
                stroke="#ffffff" 
                strokeWidth="0.8"
              />
            ))}
            
            {/* Trajectory lines */}
            {utility.throwSpots.map((spot, index) => (
              <line 
                key={index}
                x1={spot.x + 10} 
                y1={spot.y + 10} 
                x2={utility.landingSpot.x + 10} 
                y2={utility.landingSpot.y + 10} 
                stroke="#fbbf24" 
                strokeWidth="1.5" 
                strokeDasharray="3,2"
                opacity="0.8"
              />
            ))}
            
            {/* Map Labels */}
            <text x="37" y="35" fill="#e5e7eb" fontSize="6" textAnchor="middle" fontWeight="bold">A SITE</text>
            <text x="82" y="35" fill="#e5e7eb" fontSize="6" textAnchor="middle" fontWeight="bold">B SITE</text>
            <text x="60" y="65" fill="#e5e7eb" fontSize="6" textAnchor="middle" fontWeight="bold">MID</text>
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg sm:text-xl mb-2">{utility.title}</h3>
          <p className="text-gray-300 text-sm sm:text-base mb-3">{utility.description}</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base mb-4">
            <span className="text-yellow-400 font-bold">★ {utility.rating}</span>
            <span className="text-gray-400">{utility.downloads}</span>
            <span className="bg-yellow-500/20 border border-yellow-400/30 text-yellow-400 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">{utility.category}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
              <span className="text-gray-300">Landing spot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
              <span className="text-gray-300">Throw positions ({utility.throwSpots.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-yellow-400 opacity-80"></div>
              <span className="text-gray-300">Trajectory</span>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold text-base">Related Videos ({utility.videoCount})</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: Math.min(3, utility.videoCount) }).map((_, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-700/50 transition-colors">
              <div className="flex gap-3">
                <div className="relative w-16 sm:w-20 h-10 sm:h-12 flex-shrink-0">
                  <img 
                    src={utility.thumbnail} 
                    alt={`Throw ${index + 1}`} 
                    className="w-full h-full rounded object-cover" 
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded">
                    {Math.floor(Math.random() * 3) + 2}:{String(Math.floor(Math.random() * 60)).padStart(2, '0')}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-white font-medium text-sm line-clamp-2">Position {index + 1}: {utility.title}</h5>
                  <p className="text-gray-400 text-xs mt-1">{Math.floor(Math.random() * 50) + 10}K views</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {utility.videoCount > 3 && (
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            View all {utility.videoCount} videos
          </button>
        )}
      </div>
    </div>
  );
}