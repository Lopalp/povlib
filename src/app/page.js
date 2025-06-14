"use client";
import Script from "next/script.js";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Link from "next/link";
import { Search, Filter, X, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getFilteredDemos,
  getTrendingDemos,
  getLatestDemos,
  getDemosByMap,
  getDemosByPosition,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions,
} from "../lib/db/demos";
import { getFilterOptions } from "../lib/db/filters";
import { getPlayerInfo } from "../lib/db/players";
import { useRouter } from "next/navigation";
import FeaturedHero from "../components/features/FeaturedHero";
import { Tag } from "../components/tags";
import { UserContext } from "../../context/UserContext.js";
import { createSupabaseBrowserClient } from "../lib/supabaseClient.js";
import { useNavbar } from "../context/NavbarContext";

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

const THUMBNAIL_IMAGE = "https://images.unsplash.com/photo-1749731630653-d9b3f00573ed?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// Comprehensive tag list for sections
const ALL_TAGS = [
  // Gameplay Tags
  "Ace", "Clutch", "1v5", "1v4", "1v3", "1v2", "Spray Control", "Flick Shots", "Quick Scope",
  "No Scope", "Wallbang", "Headshot", "Multi Kill", "Team Wipe", "Comeback", "Highlight",
  
  // Map Specific
  "Mirage", "Dust2", "Inferno", "Cache", "Overpass", "Vertigo", "Nuke", "Train", "Cobblestone",
  "Ancient", "Anubis", "A Site", "B Site", "Mid Control", "Connector", "Apps", "Palace",
  
  // Position Based
  "CT Side", "T Side", "Retake", "Site Execute", "Rush", "Eco Round", "Force Buy", "Anti-Eco",
  "Save Round", "Pistol Round", "Bomb Plant", "Defuse", "Rotate", "Stack", "Split",
  
  // Utility
  "Smoke Lineup", "Flash Bang", "HE Grenade", "Molotov", "Incendiary", "Pop Flash", "One Way",
  "Crossfire", "Trade Kill", "Bait", "Support", "Entry Frag", "Lurk Play",
  
  // Professional
  "Pro Match", "Major", "Tournament", "BLAST", "ESL", "IEM", "FACEIT", "HLTV Top 20",
  "MVP Performance", "Legendary Play", "Historic Moment", "Championship", "Finals",
  
  // Skill Level
  "Global Elite", "Supreme", "Legendary Eagle", "Distinguished Master", "FACEIT Level 10",
  "Professional", "Semi-Pro", "Rising Star", "Upcoming Talent", "Veteran",
  
  // Teams
  "NAVI", "Astralis", "FaZe", "G2", "Vitality", "NIP", "Fnatic", "Cloud9", "Liquid",
  "ENCE", "Heroic", "Complexity", "MIBR", "Dignitas", "Mouz", "BIG", "Spirit",
  
  // Special
  "Insane Shots", "Lucky Plays", "Funny Moments", "Fails", "Best of 2024", "Trending Now",
  "Must Watch", "Community Favorites", "Editor's Pick", "Viral Clips", "Reaction Worthy"
];

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const mapDemo = (demo) => ({
  id: demo.id,
  title: demo.title,
  thumbnail: demo.thumbnail,
  videoId: demo.video_id,
  map: demo.map,
  positions: demo.positions || [],
  tags: demo.tags || [],
  players: demo.players || [],
  team: demo.team,
  year: demo.year,
  event: demo.event,
  result: demo.result,
  views: demo.views || 0,
  likes: demo.likes || 0,
  isPro: demo.is_pro,
});

export default function Home() {
  // -------------------------------------
  // Get navbar state from context
  // -------------------------------------
  const { demoType } = useNavbar();

  // -------------------------------------
  // User Authentication State
  // -------------------------------------
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  // -------------------------------------
  // Data States
  // -------------------------------------
  const [filteredDemos, setFilteredDemos] = useState([]);
  const [trendingDemos, setTrendingDemos] = useState([]);
  const [latestDemos, setLatestDemos] = useState([]);
  const [playerResults, setPlayerResults] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Shuffled results for variety
  const shuffledDemoResults = useMemo(() => shuffleArray([...filteredDemos, ...trendingDemos, ...latestDemos]), [filteredDemos, trendingDemos, latestDemos]);
  const shuffledPlayerResults = useMemo(() => shuffleArray(playerResults), [playerResults]);

  // User Authentication Effect
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user.user_metadata ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting initial session:", error);
        setLoading(false);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user.user_metadata);
        } else {
          setSession(null);
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log("Starting to load initial data...");
        setIsInitialLoading(true);

        const [demos, trending, latest] = await Promise.all([
          getFilteredDemos({}, demoType),
          getTrendingDemos(20, demoType),
          getLatestDemos(20, demoType),
        ]);

        // Mock player data if not available
        const mockPlayers = Array.from({ length: 20 }).map((_, i) => ({
          id: i + 1,
          name: ["s1mple", "ZywOo", "sh1ro", "electroNic", "Ax1Le", "ropz", "NiKo", "device", "dupreeh", "gla1ve", "k0nfig", "blameF", "Magisk", "sjuush", "stavn", "TeSeS", "huNter-", "nexa", "AmaNEk", "JaCkz"][i] || `Player${i + 1}`,
          avatar: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
          team: ["NAVI", "Vitality", "Gambit", "FaZe", "G2", "Astralis"][Math.floor(Math.random() * 6)],
          stats: {
            totalViews: Math.floor(Math.random() * 50000) + 10000,
            totalDemos: Math.floor(Math.random() * 100) + 20,
          },
          game: "Counter-Strike 2",
          followers: `${Math.floor(Math.random() * 50) + 10}K followers`,
        }));

        if (!demos || demos.length === 0) {
          console.warn("No demos found in database, using fallback data");
          const fallbackDemos = Array.from({ length: 30 }).map((_, i) => ({
            id: 1000 + i,
            title: `${["Epic Ace", "Insane Clutch", "Perfect Spray", "Lucky Shot", "Team Wipe"][Math.floor(Math.random() * 5)]} on ${["Mirage", "Dust2", "Inferno", "Cache"][Math.floor(Math.random() * 4)]}`,
            thumbnail: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
            video_id: "dQw4w9WgXcQ",
            map: ["Mirage", "Dust2", "Inferno", "Cache", "Overpass"][Math.floor(Math.random() * 5)],
            positions: [["A Site", "B Site", "Mid"][Math.floor(Math.random() * 3)]],
            tags: shuffleArray(ALL_TAGS).slice(0, Math.floor(Math.random() * 5) + 2),
            players: [mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name],
            team: ["NAVI", "Vitality", "FaZe", "G2", "Astralis"][Math.floor(Math.random() * 5)],
            year: "2024",
            event: ["BLAST Premier", "IEM Katowice", "ESL Pro League"][Math.floor(Math.random() * 3)],
            result: ["Win", "Loss"][Math.floor(Math.random() * 2)],
            views: Math.floor(Math.random() * 50000) + 1000,
            likes: Math.floor(Math.random() * 1000) + 100,
            is_pro: Math.random() > 0.3,
          }));
          
          setFilteredDemos(fallbackDemos.map(mapDemo));
          setTrendingDemos(fallbackDemos.slice(0, 15).map(mapDemo));
          setLatestDemos(fallbackDemos.slice(15, 30).map(mapDemo));
        } else {
          const mappedDemos = demos.map(mapDemo);
          setFilteredDemos(mappedDemos);
          setTrendingDemos(trending.map(mapDemo));
          setLatestDemos(latest.map(mapDemo));
        }

        setPlayerResults(mockPlayers);
        setIsInitialLoading(false);
        console.log("Initial data loading completed");
      } catch (error) {
        console.error("Error loading initial data:", error);
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, [demoType]);

  // Content templates for different types
  const contentTemplates = useMemo(() => ({
    videos: shuffledDemoResults.map((demo) => ({
      type: "video",
      demoId: demo.id,
      title: demo.title,
      thumbnail: demo.thumbnail || VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
      duration: `${Math.floor(Math.random() * 10) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      views: `${demo.views ?? Math.floor(Math.random() * 999) + 1} views`,
      uploadDate: demo.year || "2024",
      channel: demo.players?.[0] || "Unknown",
      channelAvatar: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
      watched: false,
      player: demo.players?.[0] || "Unknown",
      isPro: demo.isPro,
      map: demo.map,
      tags: demo.tags || [],
    })),
    players: shuffledPlayerResults.map((player) => ({
      type: "player",
      name: player.name,
      avatar: player.avatar,
      followers: player.followers,
      game: player.game,
      ...player,
    })),
    teams: Array.from({ length: 15 }).map((_, i) => ({
      type: "team",
      name: ["NAVI", "Vitality", "FaZe", "G2", "Astralis", "Fnatic", "NIP", "Cloud9", "Liquid", "ENCE", "Heroic", "Complexity", "MIBR", "Dignitas", "Mouz"][i] || `Team ${i + 1}`,
      logo: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
      rank: `#${i + 1} Global`,
      region: ["EU", "NA", "APAC", "SA"][Math.floor(Math.random() * 4)],
      players: Array.from({ length: 5 }).map((__, j) => ({
        name: shuffledPlayerResults[Math.floor(Math.random() * shuffledPlayerResults.length)]?.name || `Player${j + 1}`,
        avatar: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
        role: ["IGL", "AWP", "Entry", "Support", "Lurker"][j]
      }))
    })),
    utilities: Array.from({ length: 12 }).map((_, i) => ({
      type: "utility",
      title: `${["Smoke", "Flash", "HE", "Molly"][Math.floor(Math.random() * 4)]} Lineup for ${["A Site", "B Site", "Mid"][Math.floor(Math.random() * 3)]}`,
      description: "Professional utility lineup for competitive play and site control",
      thumbnail: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
      map: ["Mirage", "Dust2", "Inferno"][Math.floor(Math.random() * 3)],
      difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
      successRate: Math.floor(Math.random() * 20) + 80,
      videos: Array.from({ length: Math.floor(Math.random() * 4) + 3 }).map((__, j) => ({
        id: j,
        title: `Position ${j + 1}: ${["Window", "Connector", "Stairs", "Default", "Deep"][j] || "Alternative"}`,
        thumbnail: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
        duration: `${Math.floor(Math.random() * 3) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        views: `${Math.floor(Math.random() * 50) + 5}K`
      }))
    })),
    events: Array.from({ length: 8 }).map((_, i) => ({
      type: "event",
      title: `${["Major Championship", "IEM Katowice", "ESL Pro League", "BLAST Premier", "PGL Major", "FACEIT Major", "DreamHack", "StarLadder"][i]} 2024`,
      description: "The biggest Counter-Strike tournament of the year with top teams competing",
      thumbnail: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
      startDate: "Dec 15, 2024",
      prizePool: `$${Math.floor(Math.random() * 500 + 500)}K`,
      status: ["Live", "Upcoming", "Concluded"][Math.floor(Math.random() * 3)],
      teams: Array.from({ length: 16 }).map((__, j) => ({
        id: j,
        name: `Team ${String.fromCharCode(65 + j)}`,
        logo: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
        rank: `#${j + 1}`,
        region: ["EU", "NA", "APAC", "SA"][Math.floor(Math.random() * 4)]
      })),
      matches: Array.from({ length: 8 }).map((__, j) => ({
        id: j,
        title: `Match ${j + 1}: Quarter Finals`,
        thumbnail: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
        duration: `${Math.floor(Math.random() * 60) + 30}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        views: `${Math.floor(Math.random() * 500) + 100}K views`,
        team1: `Team ${String.fromCharCode(65 + j * 2)}`,
        team2: `Team ${String.fromCharCode(65 + j * 2 + 1)}`,
        score: `16-${Math.floor(Math.random() * 15) + 1}`
      }))
    })),
  }), [shuffledDemoResults, shuffledPlayerResults]);

  // Smart content generation with sections
  const generateSmartContent = useCallback((count = 15) => {
    let result = [];
    let itemsGenerated = 0;
    const { videos, players, teams, utilities, events } = contentTemplates;
    
    // Get random tags for sections
    const availableTags = shuffleArray(ALL_TAGS);
    let tagIndex = 0;

    while (itemsGenerated < count && tagIndex < availableTags.length) {
      // Add section header
      result.push({
        type: "section_header",
        id: `section-${Date.now()}-${itemsGenerated}`,
        title: availableTags[tagIndex],
      });
      itemsGenerated++;
      tagIndex++;

      // Add 3-6 items for this section
      const itemsInSection = Math.floor(Math.random() * 4) + 3; // 3-6 items
      const sectionType = Math.random();
      
      for (let i = 0; i < itemsInSection && itemsGenerated < count; i++) {
        if (sectionType < 0.6) {
          // Mostly videos
          const video = videos[Math.floor(Math.random() * videos.length)];
          if (video) {
            result.push({
              ...video,
              id: `video-${Date.now()}-${itemsGenerated}`,
            });
            itemsGenerated++;
          }
        } else if (sectionType < 0.75) {
          // Some players
          const player = players[Math.floor(Math.random() * players.length)];
          if (player && i === 0) { // Only add player as first item in section
            result.push({
              ...player,
              id: `player-${Date.now()}-${itemsGenerated}`,
            });
            itemsGenerated++;
          } else {
            // Fill with videos
            const video = videos[Math.floor(Math.random() * videos.length)];
            if (video) {
              result.push({
                ...video,
                id: `video-${Date.now()}-${itemsGenerated}`,
              });
              itemsGenerated++;
            }
          }
        } else if (sectionType < 0.85) {
          // Some teams
          const team = teams[Math.floor(Math.random() * teams.length)];
          if (team && i === 0) { // Only add team as first item in section
            result.push({
              ...team,
              id: `team-${Date.now()}-${itemsGenerated}`,
            });
            itemsGenerated++;
          } else {
            // Fill with videos
            const video = videos[Math.floor(Math.random() * videos.length)];
            if (video) {
              result.push({
                ...video,
                id: `video-${Date.now()}-${itemsGenerated}`,
              });
              itemsGenerated++;
            }
          }
        } else if (sectionType < 0.95) {
          // Some utilities
          const utility = utilities[Math.floor(Math.random() * utilities.length)];
          if (utility && i === 0) {
            result.push({
              ...utility,
              id: `utility-${Date.now()}-${itemsGenerated}`,
            });
            itemsGenerated++;
          } else {
            const video = videos[Math.floor(Math.random() * videos.length)];
            if (video) {
              result.push({
                ...video,
                id: `video-${Date.now()}-${itemsGenerated}`,
              });
              itemsGenerated++;
            }
          }
        } else {
          // Rare events
          const event = events[Math.floor(Math.random() * events.length)];
          if (event && i === 0) {
            result.push({
              ...event,
              id: `event-${Date.now()}-${itemsGenerated}`,
            });
            itemsGenerated++;
          } else {
            const video = videos[Math.floor(Math.random() * videos.length)];
            if (video) {
              result.push({
                ...video,
                id: `video-${Date.now()}-${itemsGenerated}`,
              });
              itemsGenerated++;
            }
          }
        }
      }
    }

    return result.slice(0, count);
  }, [contentTemplates]);

  // Initialize content
  useEffect(() => {
    if (!isInitialLoading && contentTemplates.videos.length > 0) {
      setDisplayedItems(generateSmartContent(20));
    }
  }, [isInitialLoading, generateSmartContent, contentTemplates.videos.length]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || isInitialLoading) return;
      
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.offsetHeight;
      
      if (scrollPosition >= documentHeight - 1000) {
        setIsLoading(true);
        setTimeout(() => {
          setDisplayedItems(prev => [...prev, ...generateSmartContent(12)]);
          setIsLoading(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [generateSmartContent, isLoading, isInitialLoading]);

  // Video selection
  const onSelectDemo = (demo) => {
    router.push(`/demos/${demo.demoId}`);
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Space for navbar */}
        <div className="h-16"></div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="space-y-8">
            {displayedItems.map((item) => (
              <div key={item.id}>
                {item.type === "section_header" && (
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{item.title}</h2>
                  </div>
                )}
                
                {item.type === "video" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    <VideoCard video={item} onSelectDemo={onSelectDemo} />
                  </div>
                )}
                
                {item.type === "player" && (
                  <div className="col-span-full mb-6">
                    <PlayerCard player={item} />
                  </div>
                )}
                
                {item.type === "team" && (
                  <div className="col-span-full mb-6">
                    <TeamCard team={item} />
                  </div>
                )}
                
                {item.type === "utility" && (
                  <div className="col-span-full mb-6">
                    <UtilityCard utility={item} />
                  </div>
                )}
                
                {item.type === "event" && (
                  <div className="col-span-full mb-6">
                    <EventCard event={item} />
                  </div>
                )}
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
    </main>
  );
}

// Component implementations from Search Results page
function VideoCard({ video, onSelectDemo }) {
  const handleClick = () => onSelectDemo(video);

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      <div className="space-y-3">
        {/* Thumbnail */}
        <div className="relative w-full">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full aspect-video object-cover rounded-xl" 
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
            {video.duration}
          </div>
          {video.watched && (
            <div className="absolute bottom-0 left-0 w-2/3 h-1 bg-blue-500 rounded-b-xl" />
          )}
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <div className="flex gap-3">
            <img src={video.channelAvatar} alt={video.channel} className="w-9 h-9 rounded-full flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm font-medium leading-5 mb-1 group-hover:text-gray-200 transition-colors line-clamp-2">
                {video.title}
              </h3>
              
              <div className="space-y-1">
                <p className="text-gray-400 text-xs">{video.channel}</p>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <span>{video.views}</span>
                  <span>•</span>
                  <span>{video.uploadDate}</span>
                </div>
              </div>
            </div>
          </div>
          
          {video.isPro && (
            <div className="flex gap-2">
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Pro</span>
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{video.map}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player }) {
  const playerUrlName = player.name.replace(/\s+/g, "-").toLowerCase();
  return (
    <Link href={`/players/${playerUrlName}`} className="group cursor-pointer block">
      <div className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl hover:bg-gray-900/50 transition-all duration-200">
        <img
          src={player.avatar}
          alt={player.name}
          className="w-16 h-16 rounded-full object-cover"
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
    </Link>
  );
}

function TeamCard({ team }) {
  const [showRoster, setShowRoster] = useState(false);
  
  return (
    <div className="group cursor-pointer bg-gray-900/30 rounded-xl p-6 hover:bg-gray-900/50 transition-all duration-200">
      <div className="space-y-6">
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
            <div className="grid grid-cols-1 gap-2 animate-in slide-in-from-top-2 duration-200">
              {team.players.map((player, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{player.name}</p>
                    <p className="text-gray-400 text-xs">{player.role}</p>
                  </div>
                  <div className="text-blue-400 text-xs font-medium bg-blue-500/20 px-2 py-1 rounded">
                    {player.role}
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
    <div className="group cursor-pointer bg-gray-900/30 rounded-xl p-6 hover:bg-gray-900/50 transition-all duration-200">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-80">
            <div className="aspect-video bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="w-full h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-medium text-sm">{utility.map}</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-400 text-xs font-medium">{utility.successRate}% Success</span>
                  </div>
                </div>
                
                <div className="flex-1 bg-gray-800 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-red-500/10"></div>
                  <div className="relative w-full h-full">
                    <div className="absolute top-2 left-2 w-8 h-6 border border-gray-600 rounded text-[8px] text-gray-400 flex items-center justify-center">A</div>
                    <div className="absolute top-2 right-2 w-8 h-6 border border-gray-600 rounded text-[8px] text-gray-400 flex items-center justify-center">B</div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-6 border border-gray-600 rounded text-[8px] text-gray-400 flex items-center justify-center">MID</div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-white text-xl font-medium mb-3 group-hover:text-gray-200 transition-colors">
              {utility.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4">{utility.description}</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-white font-medium">{utility.difficulty}</div>
                <div className="text-gray-400 text-xs">Difficulty</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-blue-400 font-medium">{utility.successRate}%</div>
                <div className="text-gray-400 text-xs">Success Rate</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-blue-400 font-medium">{utility.videos.length}</div>
                <div className="text-gray-400 text-xs">Positions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(event.matches.length / 3);
  
  return (
    <div className="group cursor-pointer bg-gray-900/30 rounded-xl p-6 hover:bg-gray-900/50 transition-all duration-200">
      <div className="space-y-6">
        <div className="flex gap-6">
          <img 
            src={event.thumbnail} 
            alt={event.title} 
            className="w-32 h-20 rounded-xl object-cover flex-shrink-0" 
          />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-white text-xl font-medium mb-2 group-hover:text-gray-200 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{event.description}</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">{event.status}</span>
                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">{event.prizePool}</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {event.startDate} • {event.teams.length} teams • {event.matches.length} matches
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}