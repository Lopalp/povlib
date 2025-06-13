"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterModal from "/src/components/modals/FilterModal.jsx";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { getFilteredDemos, getAllPlayers } from "@/lib/supabase";
import PlayerCard from "../../components/cards/PlayerCard";

const THUMBNAIL_IMAGE =
  "https://images.unsplash.com/photo-1749731630653-d9b3f00573ed?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Placeholder

const VIDEO_THUMBNAIL_POOL = [
  "/img/1.png",
  "/img/2.png",
  "/img/3.png",
  "/img/4.png",
  "/img/5.png",
  "/img/6.png",
  "/img/7.png",
  "/img/8.png",
  "/img/v2.png",
  "/img/v3.png",
];

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


const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-400">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || "";

  const [activePill, setActivePill] = useState("all");
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [demoResults, setDemoResults] = useState([]);
  const [playerResults, setPlayerResults] = useState([]);
  const shuffledDemoResults = useMemo(() => shuffleArray(demoResults), [demoResults]);
  const shuffledPlayerResults = useMemo(() => shuffleArray(playerResults), [playerResults]);
  const [showFilters, setShowFilters] = useState(false);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [demoType, setDemoType] = useState("pro");
  const [filtersApplied, setFiltersApplied] = useState({
    demoType: "pro",
    map: "",
    position: "",
    player: "",
    team: "",
    year: "",
    event: "",
    platform: "",
    eloMin: 0,
    eloMax: 5000,
    roles: [],
    povlib: false,
    extraPlatforms: [],
  });

  // Dummy filter options for the modal
  const filterOptions = useMemo(() => ({ maps: ["Dust2", "Mirage", "Inferno", "Cache", "Overpass"], positions: { "Dust2": ["A Site", "B Site", "Mid"], "Mirage": ["A Site", "B Site", "Mid"] }, roles: ["IGL", "Support", "Entry", "Lurk", "AWP", "Rifle"] }), []);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const demos = await getFilteredDemos({ search: queryParam }, demoType);
        const players = await getAllPlayers(demoType, 1, 20);
        const queryLower = queryParam.toLowerCase();
        const filteredPlayers = players.filter(
          (p) =>
            p.name.toLowerCase().includes(queryLower) ||
            (p.team && p.team.toLowerCase().includes(queryLower))
        );
        setDemoResults(demos || []);
        setPlayerResults(filteredPlayers);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setDemoResults([]);
        setPlayerResults([]);
      }
    };

    if (queryParam) fetchResults();
  }, [queryParam, demoType]);

  // Base content templates
  const contentTemplates = useMemo(() => ({
    videos: shuffledDemoResults.map((demo) => ({
      type: "video",
      demoId: demo.id,
      title: demo.title,
      thumbnail:
        VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
      duration: `${Math.floor(Math.random() * 10) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      views: `${demo.views ?? Math.floor(Math.random() * 999) + 1} views`,
      uploadDate: demo.year || "",
      channel: demo.players?.[0] || "Unknown",
      channelAvatar:
        VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
      watched: false,
      player: demo.players?.[0] || "Unknown",
      isPro: demo.is_pro,
      map: demo.map,
    })),
    players: shuffledPlayerResults.map((player) => ({
      type: "player",
      name: player.name,
      avatar:
        player.avatar ||
        VIDEO_THUMBNAIL_POOL[
          Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)
        ],
      followers: `${player.stats?.totalViews ?? Math.floor(Math.random() * 5000) + 500} followers`,
      game: "Counter-Strike 2",
      ...player,
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
      title: `${["Smoke", "Flash", "HE", "Molly"][Math.floor(Math.random() * 4)]} Lineup for ${["A Site", "B Site", "Mid"][Math.floor(Math.random() * 3)]}`,
      description: "Professional utility lineup for competitive play and site control",
      thumbnail: THUMBNAIL_IMAGE,
      map: ["Mirage", "Dust2", "Inferno"][Math.floor(Math.random() * 3)],
      difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
      successRate: Math.floor(Math.random() * 20) + 80,
      videos: Array.from({ length: Math.floor(Math.random() * 4) + 3 }).map((__, j) => ({
        id: j,
        title: `Position ${j + 1}: ${["Window", "Connector", "Stairs", "Default", "Deep"][j] || "Alternative"}`,
        thumbnail: THUMBNAIL_IMAGE,
        duration: `${Math.floor(Math.random() * 3) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        views: `${Math.floor(Math.random() * 50) + 5}K`
      }))
    })),
    events: Array.from({ length: 5 }).map((_, i) => ({
      type: "event",
      title: `${["Major Championship", "IEM Katowice", "ESL Pro League", "BLAST Premier", "PGL Major"][i]} 2024`,
      description: "The biggest Counter-Strike tournament of the year with top teams competing",
      thumbnail: THUMBNAIL_IMAGE,
      startDate: "Dec 15, 2024",
      prizePool: `$${Math.floor(Math.random() * 500 + 500)}K`,
      status: "Live",
      teams: Array.from({ length: 16 }).map((__, j) => ({
        id: j,
        name: `Team ${String.fromCharCode(65 + j)}`,
        logo: THUMBNAIL_IMAGE,
        rank: `#${j + 1}`,
        region: ["EU", "NA", "APAC", "SA"][Math.floor(Math.random() * 4)]
      })),
      matches: Array.from({ length: 8 }).map((__, j) => ({
        id: j,
        title: `Match ${j + 1}: Quarter Finals`,
        thumbnail: THUMBNAIL_IMAGE,
        duration: `${Math.floor(Math.random() * 60) + 30}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        views: `${Math.floor(Math.random() * 500) + 100}K views`,
        team1: `Team ${String.fromCharCode(65 + j * 2)}`,
        team2: `Team ${String.fromCharCode(65 + j * 2 + 1)}`,
        score: `16-${Math.floor(Math.random() * 15) + 1}`
      }))
    })),
  }), [searchQuery, shuffledDemoResults, shuffledPlayerResults]);

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

  const handleFilterChange = (newFilters) => {
    setFiltersApplied(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFiltersApplied({ demoType: "pro", map: "", position: "", player: "", team: "", year: "", event: "", platform: "", eloMin: 0, eloMax: 5000, roles: [], povlib: false, extraPlatforms: [] });
  };

  const handleApplyFilters = () => {
    // In a real application, you would apply these filters to your search logic
    console.log("Applied Filters:", filtersApplied);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Space for modal navbar */}
      <div className="h-16"></div>
      
      {/* Search Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-lg sm:text-xl text-white font-medium mb-1">
          Search results for <span className="font-normal">"{searchQuery}"</span>
        </h1>
        <p className="text-gray-500 text-sm">About 1,240 results</p>
      </div>

      {/* Fixed Filter Bar */}
      <div className="sticky top-0 bg-gray-950/95 backdrop-blur-md border-b border-gray-800 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide w-full sm:w-auto pb-1">
              {PILL_OPTIONS.map(pill => (
                <button
                  key={pill.id}
                  onClick={() => setActivePill(pill.id)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    activePill === pill.id
                      ? "bg-white text-gray-950"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
            
            <div className="relative w-full sm:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-200 w-full sm:w-auto"
              >
                <Filter size={16} />
                <span className="text-xs sm:text-sm font-medium">Filters</span>
              </button>
              
            </div>
          </div>
        </div>
        {showFilters && (
          <FilterModal
            filterOptions={filterOptions}
            filtersApplied={filtersApplied}
            onClose={() => setShowFilters(false)}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onApplyFilters={handleApplyFilters}
          />
        )}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {displayedItems.map((item) => (
            <div key={item.id}>
              {item.type === "video" && <VideoCard video={item} />}
              {item.type === "player" && (
                <PlayerCard
                  player={item}
                  demoCount={item.stats?.totalDemos}
                  viewCount={item.stats?.totalViews}
                />
              )}
              {item.type === "team" && <TeamCard team={item} />}
              {item.type === "utility" && <UtilityCard utility={item} />}
              {item.type === "event" && <EventCard event={item} />}
              {item.type === "separator" && <div className="border-t border-gray-800 my-8 sm:my-12" />}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-center py-8 sm:py-12">
              <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video }) {
  const router = useRouter();
  const handleClick = () => router.push(`/demos/${video.demoId}`);

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-64 md:w-80 flex-shrink-0">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full aspect-video object-cover rounded-xl" 
          />
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
            {video.duration}
          </div>
          {video.watched && (
            <div className="absolute bottom-0 left-0 w-2/3 h-1 bg-blue-500 rounded-b-xl" />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 py-1">
          <h3 className="text-white text-base sm:text-lg font-medium leading-5 sm:leading-6 mb-2 sm:mb-3 group-hover:text-gray-200 transition-colors line-clamp-2">
            {video.title}
          </h3>
          
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <img src={video.channelAvatar} alt={video.channel} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
            <span className="text-gray-400 text-xs sm:text-sm">{video.channel}</span>
            {video.isPro && (
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Pro</span>
            )}
          </div>
          
          <div className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">
            {video.views} • {video.uploadDate}
          </div>

          <p className="text-gray-400 text-xs sm:text-sm leading-4 sm:leading-5 mb-3 sm:mb-4 line-clamp-2">
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


function TeamCard({ team }) {
  const [showRoster, setShowRoster] = useState(false);
  
  return (
    <div className="group cursor-pointer">
      <div className="space-y-4 sm:space-y-6">
        {/* Team Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
          <img 
            src={team.logo} 
            alt={team.name} 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover" 
          />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white text-base sm:text-lg font-medium mb-2 group-hover:text-gray-200 transition-colors">
              {team.name}
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm">
              <span className="text-gray-400">{team.region}</span>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <span className="text-gray-300">{team.rank}</span>
            </div>
          </div>
          <button className="bg-white text-gray-950 px-4 sm:px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto">
            Follow
          </button>
        </div>

        {/* Roster Toggle */}
        <div className="space-y-3">
          <button 
            onClick={() => setShowRoster(!showRoster)}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-white text-sm font-medium">Active Roster ({team.players.length})</h4>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showRoster ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showRoster && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 animate-in slide-in-from-top-2 duration-200">
              {team.players.map((player, index) => (
                <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <img src={player.avatar} alt={player.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{player.name}</p>
                    <p className="text-gray-400 text-xs">{player.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-400 text-xs font-medium bg-blue-500/20 px-2 py-1 rounded">
                      {player.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UtilityCard({ utility }) {
  return (
    <div className="group cursor-pointer bg-gray-900/30 rounded-xl p-4 sm:p-6 hover:bg-gray-900/50 transition-all duration-200">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="w-full lg:w-80">
            <div className="aspect-video bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
              <div className="w-full h-full flex flex-col">
                {/* Map Info */}
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-medium text-sm">{utility.map}</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-400 text-xs font-medium">{utility.successRate}% Success</span>
                  </div>
                </div>
                
                {/* Utility Visualization */}
                <div className="flex-1 bg-gray-800 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-red-500/10"></div>
                  
                  {/* Map Layout */}
                  <div className="relative w-full h-full">
                    {/* Site Boxes */}
                    <div className="absolute top-2 left-2 w-8 h-6 border border-gray-600 rounded text-[8px] text-gray-400 flex items-center justify-center">
                      A
                    </div>
                    <div className="absolute top-2 right-2 w-8 h-6 border border-gray-600 rounded text-[8px] text-gray-400 flex items-center justify-center">
                      B
                    </div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-6 border border-gray-600 rounded text-[8px] text-gray-400 flex items-center justify-center">
                      MID
                    </div>
                    
                    {/* Landing Spot */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-yellow-400 font-medium whitespace-nowrap">
                        Landing
                      </div>
                    </div>
                    
                    {/* Throw Positions */}
                    <div className="absolute bottom-4 left-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[8px] text-blue-400 whitespace-nowrap">
                        Pos 1
                      </div>
                    </div>
                    <div className="absolute top-4 right-8">
                      <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[8px] text-blue-400 whitespace-nowrap">
                        Pos 2
                      </div>
                    </div>
                    
                    {/* Trajectory Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                          <polygon points="0 0, 6 2, 0 4" fill="#fbbf24" />
                        </marker>
                      </defs>
                      <path
                        d="M 20 90 Q 60 40 50 50"
                        stroke="#fbbf24"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="3,2"
                        markerEnd="url(#arrowhead)"
                        opacity="0.8"
                      />
                      <path
                        d="M 85 25 Q 70 30 50 50"
                        stroke="#fbbf24"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="3,2"
                        markerEnd="url(#arrowhead)"
                        opacity="0.8"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-white text-lg sm:text-xl font-medium mb-2 sm:mb-3 group-hover:text-gray-200 transition-colors">
              {utility.title}
            </h3>
            <p className="text-gray-400 text-sm mb-3 sm:mb-4">{utility.description}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-white font-medium text-sm sm:text-base">{utility.difficulty}</div>
                <div className="text-gray-400 text-xs">Difficulty</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-blue-400 font-medium text-sm sm:text-base">{utility.successRate}%</div>
                <div className="text-gray-400 text-xs">Success Rate</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-blue-400 font-medium text-sm sm:text-base">{utility.videos.length}</div>
                <div className="text-gray-400 text-xs">Positions</div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Landing Spot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Throw Positions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-yellow-400 opacity-80"></div>
                <span>Trajectory</span>
              </div>
            </div>
          </div>
        </div>

        {/* Videos */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-white text-sm font-medium">Training Videos ({utility.videos.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {utility.videos.slice(0, 4).map((video, index) => (
              <div key={index} className="group bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-700/50 transition-all duration-200 cursor-pointer">
                <div className="relative">
                  <img src={video.thumbnail} alt="" className="w-full h-24 sm:h-28 object-cover" />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h5 className="text-white text-sm font-medium line-clamp-2 mb-2">{video.title}</h5>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{video.views} views</span>
                    <span className="bg-gray-700 px-2 py-1 rounded text-xs">Position {index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {utility.videos.length > 4 && (
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors">
              View all {utility.videos.length} training videos
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(event.matches.length / 3);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="group cursor-pointer bg-gray-900/30 rounded-xl p-4 sm:p-6 hover:bg-gray-900/50 transition-all duration-200">
      <div className="space-y-4 sm:space-y-6">
        {/* Event Header */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <img 
            src={event.thumbnail} 
            alt={event.title} 
            className="w-full sm:w-32 h-20 rounded-xl object-cover flex-shrink-0" 
          />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
              <div>
                <h3 className="text-white text-lg sm:text-xl font-medium mb-2 group-hover:text-gray-200 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-400 text-sm mb-2 sm:mb-3">{event.description}</p>
              </div>
              <div className="flex flex-row sm:flex-col gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">{event.status}</span>
                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">{event.prizePool}</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {event.startDate} • {event.teams.length} teams • {event.matches.length} matches
            </div>
          </div>
        </div>

        {/* Teams Preview */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-white text-sm font-medium">Participating Teams</h4>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
              {event.teams.slice(0, 8).map((team, index) => (
                <div key={index} className="group text-center cursor-pointer">
                  <div className="relative mb-2">
                    <img 
                      src={team.logo} 
                      alt={team.name} 
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover mx-auto border border-gray-700 group-hover:border-gray-600 transition-colors" 
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <p className="text-white text-xs font-medium truncate group-hover:text-gray-200 transition-colors">{team.name}</p>
                  <p className="text-gray-400 text-[10px] mt-1">{team.region}</p>
                </div>
              ))}
            </div>
            {event.teams.length > 8 && (
              <div className="mt-4 text-center">
                <button className="text-gray-400 hover:text-white text-sm transition-colors">
                  View all {event.teams.length} teams →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Matches Slider */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white text-sm font-medium">Latest Matches</h4>
            <div className="flex items-center gap-2">
              <button 
                onClick={prevSlide}
                disabled={totalSlides <= 1}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={16} className="text-white" />
              </button>
              <span className="text-gray-400 text-xs">{currentSlide + 1} / {totalSlides}</span>
              <button 
                onClick={nextSlide}
                disabled={totalSlides <= 1}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <ChevronRight size={16} className="text-white" />
              </button>
            </div>
          </div>
          
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {event.matches.slice(slideIndex * 3, (slideIndex + 1) * 3).map((match, index) => (
                      <div key={index} className="group bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-700/50 transition-all duration-200 cursor-pointer">
                        <div className="relative">
                          <img src={match.thumbnail} alt={match.title} className="w-full h-20 sm:h-24 object-cover" />
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                            {match.duration}
                          </div>
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
                            LIVE
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <h5 className="text-white text-sm font-medium line-clamp-2 mb-2">{match.title}</h5>
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-gray-400">
                              <span className="font-medium text-gray-300">{match.team1}</span>
                              <span className="mx-2">vs</span>
                              <span className="font-medium text-gray-300">{match.team2}</span>
                            </div>
                            <span className="text-yellow-400 font-bold text-sm">{match.score}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{match.views}</span>
                            <span className="bg-gray-700 px-2 py-1 rounded">Match {slideIndex * 3 + index + 1}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-1 mt-3">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

