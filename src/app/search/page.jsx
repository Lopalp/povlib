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
    <div className="flex gap-4 hover:bg-gray-800/30 rounded-lg transition-all duration-200 cursor-pointer p-2">
      {/* Large Thumbnail like YouTube */}
      <div className="relative w-96 flex-shrink-0">
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

        <p className="text-gray-400 text-sm line-clamp-2 leading-5 mb-2">
          Player: <span className="text-gray-300 font-medium">{video.player}</span> showcases professional gameplay techniques and strategies. Perfect for learning advanced mechanics and game sense.
        </p>
        
        <div className="flex items-center gap-2">
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
    <div className="hover:bg-gray-800/30 rounded-lg transition-all duration-200 cursor-pointer p-3">
      {/* Team Header */}
      <div className="flex items-center gap-4 mb-4">
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

      {/* Team Players */}
      <div className="space-y-2">
        <h4 className="text-gray-300 text-sm font-medium">Active Roster</h4>
        <div className="grid grid-cols-5 gap-3">
          {team.players.map((player, index) => (
            <div key={index} className="text-center">
              <img 
                src={player.avatar} 
                alt={player.name} 
                className="w-12 h-12 rounded-full object-cover mx-auto mb-1" 
              />
              <p className="text-white text-xs font-medium truncate">{player.name}</p>
              <p className="text-gray-400 text-[10px]">{player.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const maxSlides = Math.max(event.teams.length, event.videos.length);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  return (
    <div className="bg-gray-800/20 rounded-xl p-4 hover:bg-gray-800/30 transition-all duration-200 cursor-pointer">
      {/* Event Header */}
      <div className="flex gap-4 mb-4">
        <img 
          src={event.thumbnail} 
          alt={event.title} 
          className="w-32 h-20 rounded-lg object-cover flex-shrink-0" 
        />
        <div className="flex-1">
          <h3 className="text-white font-bold text-xl mb-2">{event.title}</h3>
          <p className="text-gray-400 text-sm mb-2">{event.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-300">{event.startDate} - {event.endDate}</span>
            <span className="text-green-400 font-bold">{event.prizePool}</span>
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">LIVE</span>
          </div>
        </div>
      </div>

      {/* Slider Navigation */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-gray-300 font-medium">Teams & Highlights</h4>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevSlide}
            className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-gray-400 text-sm">{activeSlide + 1} / {maxSlides}</span>
          <button 
            onClick={nextSlide}
            className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slider Content */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {Array.from({ length: maxSlides }).map((_, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Team */}
                {event.teams[index] && (
                  <div className="bg-gray-800/40 rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <img 
                        src={event.teams[index].logo} 
                        alt={event.teams[index].name} 
                        className="w-12 h-12 rounded object-cover" 
                      />
                      <div>
                        <h5 className="text-white font-medium">{event.teams[index].name}</h5>
                        <p className="text-gray-400 text-sm">{event.teams[index].rank}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Video */}
                {event.videos[index] && (
                  <div className="bg-gray-800/40 rounded-lg p-3">
                    <div className="flex gap-3">
                      <div className="relative w-20 h-12 flex-shrink-0">
                        <img 
                          src={event.videos[index].thumbnail} 
                          alt={event.videos[index].title} 
                          className="w-full h-full rounded object-cover" 
                        />
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">
                          {event.videos[index].duration}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-white font-medium text-sm line-clamp-2">{event.videos[index].title}</h5>
                        <p className="text-gray-400 text-xs">{event.videos[index].views}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-1 mt-3">
        {Array.from({ length: maxSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeSlide ? 'bg-white' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function UtilityCard({ utility }) {
  return (
    <div className="hover:bg-gray-800/30 rounded-lg transition-all duration-200 cursor-pointer p-3">
      <div className="flex gap-4 mb-3">
        {/* Radar Map SVG */}
        <div className="w-32 h-20 rounded-lg bg-gray-800 flex-shrink-0 p-2">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Map Background */}
            <rect width="100" height="100" fill="#1f2937" stroke="#374151" strokeWidth="1" rx="4"/>
            
            {/* Map Sections */}
            <rect x="10" y="10" width="35" height="25" fill="#374151" stroke="#4b5563" strokeWidth="0.5" rx="2"/>
            <rect x="55" y="10" width="35" height="25" fill="#374151" stroke="#4b5563" strokeWidth="0.5" rx="2"/>
            <rect x="10" y="45" width="80" height="15" fill="#374151" stroke="#4b5563" strokeWidth="0.5" rx="2"/>
            <rect x="10" y="70" width="35" height="25" fill="#374151" stroke="#4b5563" strokeWidth="0.5" rx="2"/>
            <rect x="55" y="70" width="35" height="25" fill="#374151" stroke="#4b5563" strokeWidth="0.5" rx="2"/>
            
            {/* Landing Spot (Red Circle) */}
            <circle 
              cx={utility.landingSpot.x} 
              cy={utility.landingSpot.y} 
              r="3" 
              fill="#ef4444" 
              stroke="#ffffff" 
              strokeWidth="0.5"
            />
            
            {/* Throw Spots (Blue Circles) */}
            {utility.throwSpots.map((spot, index) => (
              <circle 
                key={index}
                cx={spot.x} 
                cy={spot.y} 
                r="2" 
                fill="#3b82f6" 
                stroke="#ffffff" 
                strokeWidth="0.5"
              />
            ))}
            
            {/* Lines connecting throw spots to landing spot */}
            {utility.throwSpots.map((spot, index) => (
              <line 
                key={index}
                x1={spot.x} 
                y1={spot.y} 
                x2={utility.landingSpot.x} 
                y2={utility.landingSpot.y} 
                stroke="#6b7280" 
                strokeWidth="0.3" 
                strokeDasharray="1,1"
              />
            ))}
            
            {/* Map Labels */}
            <text x="27" y="25" fill="#9ca3af" fontSize="4" textAnchor="middle">A</text>
            <text x="72" y="25" fill="#9ca3af" fontSize="4" textAnchor="middle">B</text>
            <text x="50" y="55" fill="#9ca3af" fontSize="4" textAnchor="middle">MID</text>
          </svg>
        </div>
        
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
        <div className="flex items-center justify-between">
          <h4 className="text-gray-300 text-sm font-medium">Throw positions</h4>
          <span className="text-gray-500 text-xs">{utility.videoCount} videos</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-400">Landing spot</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400">Throw spots ({utility.throwSpots.length})</span>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded p-2">
          <p className="text-gray-400 text-xs">
            Map: <span className="text-white">{utility.map}</span> • 
            Best for: <span className="text-white">Site control & executes</span>
          </p>
        </div>
      </div>
    </div>
  );
}