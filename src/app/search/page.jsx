"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterModal from "/src/components/modals/FilterModal.jsx";
import { Filter, ChevronLeft, ChevronRight, MapPin, Trophy, Users } from "lucide-react";
import { getFilteredDemos } from "@/lib/db/demos";
import { getAllPlayers } from "@/lib/db/players";
import Link from "next/link";

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
  { id: "maps", label: "Maps" },
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
      team: player.team || ["Team Liquid", "Natus Vincere", "FaZe Clan", "G2 Esports", "Vitality"][Math.floor(Math.random() * 5)],
      hltv_ranking: Math.floor(Math.random() * 50) + 1,
      faceit_elo: Math.floor(Math.random() * 1000) + 2000,
      fpl_rank: Math.random() > 0.7 ? `FPL #${Math.floor(Math.random() * 100) + 1}` : null,
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
    maps: [
      { 
        type: "map", 
        name: "Dust2", 
        thumbnail: "/img/maps/dust2.png",
        description: "The most iconic Counter-Strike map featuring two bomb sites connected by long corridors",
        demos: Math.floor(Math.random() * 500) + 200,
        popularity: 95,
        layout: "Classic",
        proMatches: Math.floor(Math.random() * 100) + 50
      },
      { 
        type: "map", 
        name: "Mirage", 
        thumbnail: "/img/maps/mirage.png",
        description: "A balanced three-lane map perfect for tactical gameplay and team coordination",
        demos: Math.floor(Math.random() * 400) + 150,
        popularity: 88,
        layout: "Balanced",
        proMatches: Math.floor(Math.random() * 90) + 40
      },
      { 
        type: "map", 
        name: "Inferno", 
        thumbnail: "/img/maps/inferno.png",
        description: "Close-quarters combat map with narrow chokepoints and vertical gameplay",
        demos: Math.floor(Math.random() * 350) + 120,
        popularity: 82,
        layout: "Close Range",
        proMatches: Math.floor(Math.random() * 80) + 35
      },
      { 
        type: "map", 
        name: "Ancient", 
        thumbnail: "/img/maps/ancient.png",
        description: "Ancient temple-themed map with unique vertical elements and strategic positioning",
        demos: Math.floor(Math.random() * 300) + 100,
        popularity: 75,
        layout: "Vertical",
        proMatches: Math.floor(Math.random() * 70) + 30
      },
      { 
        type: "map", 
        name: "Anubis", 
        thumbnail: "/img/maps/anubis.png",
        description: "Egyptian-themed map with tight angles and connector-based rotations",
        demos: Math.floor(Math.random() * 250) + 80,
        popularity: 68,
        layout: "Connector",
        proMatches: Math.floor(Math.random() * 60) + 25
      },
      { 
        type: "map", 
        name: "Nuke", 
        thumbnail: "/img/maps/nuke.png",
        description: "Multi-level nuclear facility with complex vertical gameplay mechanics",
        demos: Math.floor(Math.random() * 200) + 60,
        popularity: 62,
        layout: "Vertical",
        proMatches: Math.floor(Math.random() * 50) + 20
      }
    ],
    utilities: Array.from({ length: 8 }).map((_, i) => ({
      type: "utility",
      title: `${["Smoke", "Flash", "HE", "Molly"][Math.floor(Math.random() * 4)]} Lineup for ${["A Site", "B Site", "Mid"][Math.floor(Math.random() * 3)]}`,
      description: "Professional utility lineup for competitive play and site control",
      thumbnail: THUMBNAIL_IMAGE,
      map: ["Mirage", "Dust2", "Inferno"][Math.floor(Math.random() * 3)],
      usageRate: Math.floor(Math.random() * 30) + 60,
      positions: Math.floor(Math.random() * 4) + 3,
      videos: Array.from({ length: Math.floor(Math.random() * 6) + 4 }).map((__, j) => ({
        id: j,
        title: `Position ${j + 1}: ${["Window", "Connector", "Stairs", "Default", "Deep", "Alternative", "Boost", "Solo"][j] || `Setup ${j + 1}`}`,
        thumbnail: THUMBNAIL_IMAGE,
        duration: `${Math.floor(Math.random() * 3) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        views: `${Math.floor(Math.random() * 50) + 5}K`
      }))
    })),
    events: Array.from({ length: 5 }).map((_, i) => ({
      type: "event",
      title: `${["PGL Major Copenhagen", "IEM Katowice", "ESL Pro League", "BLAST Premier Spring", "FACEIT Major"][i]}`,
      description: "Premier Counter-Strike tournament featuring the world's best teams",
      thumbnail: `/events/event${i + 1}.jpg`,
      startDate: "March 15, 2025",
      endDate: "March 24, 2025",
      prizePool: `$${Math.floor(Math.random() * 500 + 500)}K`,
      status: Math.random() > 0.5 ? "Live" : "Upcoming",
      location: ["Copenhagen, Denmark", "Katowice, Poland", "Malta", "London, UK", "Rio de Janeiro, Brazil"][i],
      format: "Swiss System + Playoffs",
      teams: Array.from({ length: 24 }).map((__, j) => ({
        id: j,
        name: ["Natus Vincere", "FaZe Clan", "Team Liquid", "G2 Esports", "Vitality", "Astralis", "MOUZ", "Heroic"][j % 8] || `Team ${j}`,
        logo: THUMBNAIL_IMAGE,
        rank: `#${j + 1}`,
        region: ["EU", "NA", "APAC", "SA"][Math.floor(Math.random() * 4)]
      })),
      matches: Array.from({ length: 12 }).map((__, j) => ({
        id: j,
        title: `${["Opening Match", "Quarter Final", "Semi Final", "Grand Final"][Math.floor(j / 3)]}`,
        thumbnail: THUMBNAIL_IMAGE,
        duration: `${Math.floor(Math.random() * 60) + 45}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        views: `${Math.floor(Math.random() * 500) + 100}K views`,
        team1: ["Natus Vincere", "FaZe Clan", "Team Liquid", "G2 Esports"][Math.floor(Math.random() * 4)],
        team2: ["Vitality", "Astralis", "MOUZ", "Heroic"][Math.floor(Math.random() * 4)],
        score: `${Math.floor(Math.random() * 16) + 13}-${Math.floor(Math.random() * 15) + 1}`,
        map: ["Dust2", "Mirage", "Inferno", "Cache"][Math.floor(Math.random() * 4)]
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
        case "maps": content = [...contentTemplates.maps]; break;
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
    const { videos, players, teams, maps, utilities, events } = contentTemplates;
    let itemsGenerated = 0;

    while (itemsGenerated < count) {
      const randomType = Math.random();
      
      if (randomType < 0.12 && events.length > 0) {
        result.push({ type: "separator", id: `sep-${Date.now()}-${itemsGenerated}` });
        itemsGenerated++;
        
        if (itemsGenerated < count) {
          result.push({
            ...events[Math.floor(Math.random() * events.length)],
            id: `event-${Date.now()}-${itemsGenerated}`,
          });
          itemsGenerated++;
        }
      } else if (randomType < 0.25 && maps.length > 0) {
        result.push({ type: "separator", id: `sep-${Date.now()}-${itemsGenerated}` });
        itemsGenerated++;
        
        const map = maps[Math.floor(Math.random() * maps.length)];
        if (itemsGenerated < count) {
          result.push({ ...map, id: `map-${Date.now()}-${itemsGenerated}` });
          itemsGenerated++;
        }
      } else if (randomType < 0.40 && players.length > 0) {
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
      } else if (randomType < 0.60 && teams.length > 0) {
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
    console.log("Applied Filters:", filtersApplied);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="h-16"></div>
      
      <div className="container mx-auto px-4 md:px-6 py-6 sm:py-8">
        <h1 className="text-lg sm:text-xl text-white font-medium mb-1">
          Search results for <span className="font-normal">"{searchQuery}"</span>
        </h1>
        <p className="text-gray-500 text-sm">About 1,240 results</p>
      </div>

      <div className="sticky top-0 bg-gray-950/95 backdrop-blur-md border-b border-gray-800 z-20">
        <div className="container mx-auto px-4 md:px-6 py-3 sm:py-4">
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

      <div className="container mx-auto px-4 md:px-6 py-6 sm:py-8">
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
              {item.type === "map" && <MapCard map={item} />}
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

function PlayerCard({ player }) {
  const playerUrlName = player.name.replace(/\s+/g, "-").toLowerCase();
  
  return (
    <Link href={`/players/${playerUrlName}`} className="group cursor-pointer block">
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 p-4 bg-gray-900/30 rounded-xl hover:bg-gray-900/50 transition-all duration-200">
        <img
          src={player.avatar}
          alt={player.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
        />

        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-white text-base sm:text-lg font-medium mb-2 group-hover:text-gray-200 transition-colors">
            {player.name}
          </h3>
          
          <div className="text-sm text-gray-400 mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-gray-300">{player.team}</span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="text-blue-400">HLTV #{player.hltv_ranking}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs">
            <div className="flex items-center gap-1 text-gray-400">
              <Trophy size={12} />
              <span>ELO {player.faceit_elo}</span>
            </div>
            {player.fpl_rank && (
              <div className="flex items-center gap-1 text-brand-yellow">
                <Users size={12} />
                <span>{player.fpl_rank}</span>
              </div>
            )}
          </div>
        </div>

        <button className="bg-white text-gray-950 px-4 sm:px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto">
          View Profile
        </button>
      </div>
    </Link>
  );
}

function MapCard({ map }) {
  return (
    <div className="group cursor-pointer">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-64 md:w-80 flex-shrink-0">
          <img 
            src={map.thumbnail} 
            alt={map.name} 
            className="w-full aspect-video object-cover rounded-xl" 
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 py-1">
          <h3 className="text-white text-base sm:text-lg font-medium leading-5 sm:leading-6 mb-2 sm:mb-3 group-hover:text-gray-200 transition-colors line-clamp-2">
            {map.name}
          </h3>
          
          <p className="text-gray-400 text-xs sm:text-sm leading-4 sm:leading-5 mb-3 sm:mb-4 line-clamp-2">
            {map.description}
          </p>

          <div className="flex items-center gap-4 mb-3 text-xs sm:text-sm text-gray-500">
            <span>{map.demos} demos</span>
            <span className="text-gray-600">•</span>
            <span>{map.proMatches} pro matches</span>
            <span className="text-gray-600">•</span>
            <span className="text-blue-400">{map.layout}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{map.name}</span>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Map Guide</span>
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
  const [showVideos, setShowVideos] = useState(false);
  
  return (
    <div className="group cursor-pointer bg-gray-900/30 rounded-xl p-4 sm:p-6 hover:bg-gray-900/50 transition-all duration-200 border border-gray-800/50">
      <div className="space-y-4 sm:space-y-6">
        {/* Main Content */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Thumbnail */}
          <div className="relative w-full sm:w-64 md:w-80 flex-shrink-0">
            <img 
              src={utility.thumbnail} 
              alt={utility.title} 
              className="w-full aspect-video object-cover rounded-xl" 
            />
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
              {utility.positions} pos
            </div>
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-blue-600/90 text-white text-xs px-2 py-1 rounded font-medium">
              {utility.usageRate}%
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 py-1">
            <h3 className="text-white text-base sm:text-lg font-medium leading-5 sm:leading-6 mb-2 sm:mb-3 group-hover:text-gray-200 transition-colors line-clamp-2">
              {utility.title}
            </h3>
            
            <p className="text-gray-400 text-xs sm:text-sm leading-4 sm:leading-5 mb-3 sm:mb-4 line-clamp-2">
              {utility.description}
            </p>

            <div className="flex items-center gap-4 mb-3 text-xs sm:text-sm text-gray-500">
              <span>{utility.positions} positions</span>
              <span className="text-gray-600">•</span>
              <span className="text-blue-400">{utility.usageRate}% usage</span>
              <span className="text-gray-600">•</span>
              <span>{utility.videos.length} videos</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{utility.map}</span>
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Utility Guide</span>
            </div>
          </div>
        </div>

        {/* Videos Toggle */}
        <div className="space-y-3">
          <button 
            onClick={() => setShowVideos(!showVideos)}
            className="flex items-center justify-between w-full text-left p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <h4 className="text-white text-sm font-medium">Training Videos ({utility.videos.length})</h4>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showVideos ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showVideos && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in slide-in-from-top-2 duration-200">
              {utility.videos.map((video, index) => (
                <div key={index} className="group bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-700/50 transition-all duration-200 cursor-pointer">
                  <div className="relative">
                    <img src={video.thumbnail} alt="" className="w-full h-20 sm:h-24 object-cover" />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h5 className="text-white text-sm font-medium line-clamp-1 mb-2">{video.title}</h5>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{video.views} views</span>
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">#{index + 1}</span>
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

function EventCard({ event }) {
  return (
    <div className="group cursor-pointer">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-64 md:w-80 flex-shrink-0">
          <img 
            src={event.thumbnail} 
            alt={event.title} 
            className="w-full aspect-video object-cover rounded-xl" 
          />
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
            {event.prizePool}
          </div>
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
            {event.status}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 py-1">
          <h3 className="text-white text-base sm:text-lg font-medium leading-5 sm:leading-6 mb-2 sm:mb-3 group-hover:text-gray-200 transition-colors line-clamp-2">
            {event.title}
          </h3>
          
          <p className="text-gray-400 text-xs sm:text-sm leading-4 sm:leading-5 mb-3 sm:mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="flex items-center gap-4 mb-3 text-xs sm:text-sm text-gray-500">
            <span>{event.location}</span>
            <span className="text-gray-600">•</span>
            <span>{event.startDate}</span>
            <span className="text-gray-600">•</span>
            <span className="text-blue-400">{event.teams.length} teams</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{event.format}</span>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Tournament</span>
          </div>
        </div>
      </div>
    </div>
  );
}