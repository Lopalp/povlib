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
      player: `Player${i + 1}`,
      isPro: Math.random() > 0.7,
      map: ["Dust2", "Mirage", "Inferno", "Cache", "Overpass"][Math.floor(Math.random() * 5)],
    })),
    players: Array.from({ length: 15 }).map((_, i) => ({ 
      type: "player",
      name: `ProGamer${i + 1}`, 
      avatar: THUMBNAIL_IMAGE,
      followers: `${Math.floor(Math.random() * 50) + 10}K subscribers`,
      game: "Counter-Strike 2",
    })),
    teams: Array.from({ length: 10 }).map((_, i) => ({ 
      type: "team",
      name: `Team Alpha${i + 1}`, 
      logo: THUMBNAIL_IMAGE,
      rank: `#${i + 1} Global`,
      region: ["EU", "NA", "APAC", "SA"][Math.floor(Math.random() * 4)],
      players: Array.from({ length: 5 }).map((__, j) => ({
        name: `Player${i * 5 + j + 1}`,
        avatar: THUMBNAIL_IMAGE,
        role: ["IGL", "AWP", "Entry", "Support", "Lurker"][j]
      }))
    })),
    utilities: Array.from({ length: 8 }).map((_, i) => ({
      type: "utility",
      title: `${["Smoke", "Flash", "HE", "Molly"][Math.floor(Math.random() * 4)]} - ${["A Site", "B Site", "Mid"][Math.floor(Math.random() * 3)]}`,
      description: "Professional utility lineup for competitive play",
      thumbnail: THUMBNAIL_IMAGE,
      rating: (4.0 + Math.random()).toFixed(1),
      map: ["Mirage", "Dust2", "Inferno"][Math.floor(Math.random() * 3)],
      videoCount: Math.floor(Math.random() * 5) + 3,
      landingSpot: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
      throwSpots: Array.from({ length: Math.floor(Math.random() * 3) + 2 }).map(() => ({
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
      prizePool: `$${Math.floor(Math.random() * 500 + 500)}K`,
      teams: Array.from({ length: 8 }).map((__, j) => ({
        name: `Team ${j + 1}`,
        logo: THUMBNAIL_IMAGE,
      })),
      videos: Array.from({ length: 6 }).map((__, j) => ({
        title: `Match ${j + 1} Highlights`,
        thumbnail: THUMBNAIL_IMAGE,
        duration: `${Math.floor(Math.random() * 10) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        views: `${Math.floor(Math.random() * 999) + 100}K views`
      }))
    })),
  }), [searchQuery]);

  // Smart content generation
  const generateSmartContent = useCallback((count = 10) => {
    let result = [];
    
    if (activePill !== "all") {
      let content = [];
      switch (activePill) {
        case "videos": content = [...contentTemplates.videos]; break;
        case "players": content = [...contentTemplates.players]; break;
        case "teams": content = [...contentTemplates.teams]; break;
        case "utilities": content = [...contentTemplates.utilities]; break;
        case "events": content = [...contentTemplates.events]; break;
        case "unwatched": content = contentTemplates.videos.filter(v => !v.watched); break;
        case "recent": content = contentTemplates.videos.slice(0, 6); break;
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
        result.push({ type: "separator", id: `sep-${Date.now()}-${itemsGenerated}` });
        itemsGenerated++;
        
        if (itemsGenerated < count) {
          result.push({
            ...events[Math.floor(Math.random() * events.length)],
            id: `event-${Date.now()}-${itemsGenerated}`,
          });
          itemsGenerated++;
        }
      } else if (randomType < 0.35 && players.length > 0) {
        result.push({ type: "separator", id: `sep-${Date.now()}-${itemsGenerated}` });
        itemsGenerated++;
        
        const player = players[Math.floor(Math.random() * players.length)];
        if (itemsGenerated < count) {
          result.push({ ...player, id: `player-${Date.now()}-${itemsGenerated}` });
          itemsGenerated++;
        }
        
        videos.slice(0, 2).forEach((video) => {
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
        result.push({ type: "separator", id: `sep-${Date.now()}-${itemsGenerated}` });
        itemsGenerated++;
        
        const team = teams[Math.floor(Math.random() * teams.length)];
        if (itemsGenerated < count) {
          result.push({ ...team, id: `team-${Date.now()}-${itemsGenerated}` });
          itemsGenerated++;
        }
        
        videos.slice(0, 2).forEach((video) => {
          if (itemsGenerated < count) {
            result.push({
              ...video,
              id: `video-${Date.now()}-${itemsGenerated}`,
              title: `${team.name} - ${video.title}`,
            });
            itemsGenerated++;
          }
        });
      } else {
        const allItems = [...videos, ...utilities];
        const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
        result.push({ ...randomItem, id: `${randomItem.type}-${Date.now()}-${itemsGenerated}` });
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
          setDisplayedItems(prev => [...prev, ...generateSmartContent(8)]);
          setIsLoading(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [generateSmartContent, isLoading]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Space for modal navbar */}
      <div className="h-16"></div>
      
      {/* Search Header */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-xl text-white font-medium mb-1">
          Search results for <span className="font-normal">"{searchQuery}"</span>
        </h1>
        <p className="text-gray-500 text-sm">About 1,240 results</p>
      </div>

      {/* Fixed Filter Bar */}
      <div className="sticky top-0 bg-gray-950/95 backdrop-blur-md border-b border-gray-800 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {PILL_OPTIONS.map(pill => (
                <button
                  key={pill.id}
                  onClick={() => setActivePill(pill.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activePill === pill.id
                      ? "bg-white text-gray-950"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-200"
              >
                <Filter size={16} />
                <span className="text-sm font-medium">Filters</span>
              </button>
              
              {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6 z-30">
                  <h3 className="text-white font-medium mb-4">Advanced Filters</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Upload date</label>
                      <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-gray-500 focus:outline-none">
                        <option>Any time</option>
                        <option>Last hour</option>
                        <option>Today</option>
                        <option>This week</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Duration</label>
                      <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-gray-500 focus:outline-none">
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
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {displayedItems.map((item) => (
            <div key={item.id}>
              {item.type === "video" && <VideoCard video={item} />}
              {item.type === "player" && <PlayerCard player={item} />}
              {item.type === "team" && <TeamCard team={item} />}
              {item.type === "utility" && <UtilityCard utility={item} />}
              {item.type === "event" && <EventCard event={item} />}
              {item.type === "separator" && <div className="border-t border-gray-800 my-12" />}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video }) {
  return (
    <div className="group cursor-pointer">
      <div className="flex gap-6">
        {/* Thumbnail */}
        <div className="relative w-80 flex-shrink-0">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full aspect-video object-cover rounded-xl" 
          />
          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
            {video.duration}
          </div>
          {video.watched && (
            <div className="absolute bottom-0 left-0 w-2/3 h-1 bg-white rounded-b-xl" />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 py-1">
          <h3 className="text-white text-lg font-medium leading-6 mb-3 group-hover:text-gray-200 transition-colors">
            {video.title}
          </h3>
          
          <div className="flex items-center gap-3 mb-2">
            <img src={video.channelAvatar} alt={video.channel} className="w-6 h-6 rounded-full" />
            <span className="text-gray-400 text-sm">{video.channel}</span>
            {video.isPro && (
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Pro</span>
            )}
          </div>
          
          <div className="text-gray-500 text-sm mb-3">
            {video.views} • {video.uploadDate}
          </div>

          <p className="text-gray-400 text-sm leading-5 mb-4">
            Player: <span className="text-gray-300">{video.player}</span> showcases professional gameplay techniques and strategies for competitive play.
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{video.map}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player }) {
  return (
    <div className="group cursor-pointer">
      <div className="flex items-center gap-6">
        <img 
          src={player.avatar} 
          alt={player.name} 
          className="w-20 h-20 rounded-full object-cover" 
        />
        <div className="flex-1">
          <h3 className="text-white text-lg font-medium mb-1 group-hover:text-gray-200 transition-colors">
            {player.name}
          </h3>
          <p className="text-gray-400 text-sm mb-1">{player.followers}</p>
          <p className="text-gray-500 text-sm">{player.game}</p>
        </div>
        <button className="bg-white text-gray-950 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  );
}

function TeamCard({ team }) {
  return (
    <div className="group cursor-pointer">
      <div className="space-y-6">
        {/* Team Header */}
        <div className="flex items-center gap-6">
          <img 
            src={team.logo} 
            alt={team.name} 
            className="w-20 h-20 rounded-xl object-cover" 
          />
          <div className="flex-1">
            <h3 className="text-white text-lg font-medium mb-2 group-hover:text-gray-200 transition-colors">
              {team.name}
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">{team.region}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-300">{team.rank}</span>
            </div>
          </div>
          <button className="bg-white text-gray-950 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
            Follow
          </button>
        </div>

        {/* Players */}
        <div className="space-y-3">
          <h4 className="text-white text-sm font-medium">Active Roster</h4>
          <div className="space-y-2">
            {team.players.map((player, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg">
                <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{player.name}</p>
                  <p className="text-gray-400 text-xs">{player.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UtilityCard({ utility }) {
  return (
    <div className="group cursor-pointer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex gap-6">
          {/* Radar */}
          <div className="w-48 h-32 bg-gray-900 rounded-xl p-4 flex-shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <rect width="120" height="120" fill="none" stroke="#374151" strokeWidth="1" rx="4"/>
              
              {/* Map wireframe */}
              <line x1="20" y1="20" x2="55" y2="20" stroke="#6b7280" strokeWidth="0.8"/>
              <line x1="55" y1="20" x2="55" y2="45" stroke="#6b7280" strokeWidth="0.8"/>
              <line x1="55" y1="45" x2="20" y2="45" stroke="#6b7280" strokeWidth="0.8"/>
              <line x1="20" y1="45" x2="20" y2="20" stroke="#6b7280" strokeWidth="0.8"/>
              
              <line x1="65" y1="20" x2="100" y2="20" stroke="#6b7280" strokeWidth="0.8"/>
              <line x1="100" y1="20" x2="100" y2="45" stroke="#6b7280" strokeWidth="0.8"/>
              <line x1="100" y1="45" x2="65" y2="45" stroke="#6b7280" strokeWidth="0.8"/>
              <line x1="65" y1="45" x2="65" y2="20" stroke="#6b7280" strokeWidth="0.8"/>
              
              <line x1="20" y1="55" x2="100" y2="55" stroke="#6b7280" strokeWidth="0.8"/>
              <line x1="20" y1="70" x2="100" y2="70" stroke="#6b7280" strokeWidth="0.8"/>
              
              {/* Landing spot */}
              <circle 
                cx={utility.landingSpot.x + 10} 
                cy={utility.landingSpot.y + 10} 
                r="4" 
                fill="#ef4444" 
                stroke="#ffffff" 
                strokeWidth="1"
              />
              
              {/* Throw spots */}
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
              
              {/* Trajectories */}
              {utility.throwSpots.map((spot, index) => (
                <line 
                  key={index}
                  x1={spot.x + 10} 
                  y1={spot.y + 10} 
                  x2={utility.landingSpot.x + 10} 
                  y2={utility.landingSpot.y + 10} 
                  stroke="#9ca3af" 
                  strokeWidth="1" 
                  strokeDasharray="2,2"
                />
              ))}
              
              <text x="37" y="35" fill="#9ca3af" fontSize="6" textAnchor="middle">A</text>
              <text x="82" y="35" fill="#9ca3af" fontSize="6" textAnchor="middle">B</text>
              <text x="60" y="65" fill="#9ca3af" fontSize="6" textAnchor="middle">MID</text>
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className="text-white text-lg font-medium mb-2 group-hover:text-gray-200 transition-colors">
              {utility.title}
            </h3>
            <p className="text-gray-400 text-sm mb-3">{utility.description}</p>
            <div className="flex items-center gap-4 text-sm mb-4">
              <span className="text-gray-300">★ {utility.rating}</span>
              <span className="text-gray-500">{utility.map}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Landing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Throws ({utility.throwSpots.length})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Videos */}
        <div className="space-y-3">
          <h4 className="text-white text-sm font-medium">Training Videos ({utility.videoCount})</h4>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: Math.min(3, utility.videoCount) }).map((_, index) => (
              <div key={index} className="bg-gray-900/50 rounded-lg p-3">
                <div className="flex gap-3">
                  <div className="relative w-16 h-10 flex-shrink-0">
                    <img src={utility.thumbnail} alt="" className="w-full h-full rounded object-cover" />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded">
                      2:{String(Math.floor(Math.random() * 60)).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium line-clamp-2">Position {index + 1}</p>
                    <p className="text-gray-400 text-[10px] mt-1">{Math.floor(Math.random() * 50) + 10}K views</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <div className="group cursor-pointer">
      <div className="space-y-6">
        {/* Event Header */}
        <div className="flex gap-6">
          <img 
            src={event.thumbnail} 
            alt={event.title} 
            className="w-32 h-20 rounded-xl object-cover flex-shrink-0" 
          />
          <div className="flex-1">
            <h3 className="text-white text-xl font-medium mb-2 group-hover:text-gray-200 transition-colors">
              {event.title}
            </h3>
            <p className="text-gray-400 text-sm mb-3">{event.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-300">{event.startDate}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-300">{event.prizePool}</span>
            </div>
          </div>
        </div>

        {/* Teams */}
        <div className="space-y-3">
          <h4 className="text-white text-sm font-medium">Teams ({event.teams.length})</h4>
          <div className="grid grid-cols-8 gap-3">
            {event.teams.slice(0, 8).map((team, index) => (
              <div key={index} className="text-center">
                <img src={team.logo} alt={team.name} className="w-12 h-12 rounded-lg object-cover mx-auto mb-1" />
                <p className="text-white text-xs truncate">{team.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-3">
          <h4 className="text-white text-sm font-medium">Latest Highlights</h4>
          <div className="grid grid-cols-3 gap-4">
            {event.videos.slice(0, 3).map((video, index) => (
              <div key={index} className="bg-gray-900/50 rounded-lg overflow-hidden">
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-20 object-cover" />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-white text-sm font-medium line-clamp-2 mb-1">{video.title}</p>
                  <p className="text-gray-400 text-xs">{video.views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}