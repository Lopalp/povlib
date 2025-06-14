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
import { Search, Filter, X, Menu, ChevronLeft, ChevronRight, Play, Star, TrendingUp, Users, Trophy, Zap, ArrowRight, Eye, Heart, Share2, Bookmark, Clock } from "lucide-react";
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

const WELCOME_STATS = [
  { icon: Users, label: "Active Players", value: "150K+", color: "text-blue-400" },
  { icon: Play, label: "Demo Videos", value: "25K+", color: "text-green-400" },
  { icon: Trophy, label: "Pro Matches", value: "5K+", color: "text-yellow-400" },
  { icon: TrendingUp, label: "Daily Views", value: "1M+", color: "text-purple-400" },
];

const FEATURE_HIGHLIGHTS = [
  {
    icon: Play,
    title: "Pro Player POVs",
    description: "Watch the world's best players from their perspective",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: TrendingUp,
    title: "Skill Analysis",
    description: "Learn from every move with detailed breakdowns",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Discover content curated by the CS2 community",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Zap,
    title: "Instant Learning",
    description: "Master techniques with frame-by-frame analysis",
    color: "from-orange-500 to-red-500"
  }
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
  const [activeTag, setActiveTag] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState("");
  const [showWelcomeSection, setShowWelcomeSection] = useState(true);

  // Shuffled results for variety
  const shuffledDemoResults = useMemo(() => shuffleArray([...filteredDemos, ...trendingDemos, ...latestDemos]), [filteredDemos, trendingDemos, latestDemos]);
  const shuffledPlayerResults = useMemo(() => shuffleArray(playerResults), [playerResults]);

  // Dynamic Tags for tag bar
  const dynamicTags = useMemo(() => {
    const tagsSet = new Set();
    shuffledDemoResults.forEach((demo) => {
      demo.tags.forEach((tag) => tagsSet.add(tag));
    });
    
    // Add some static popular tags
    ["🔥 Trending", "⭐ Featured", "🎯 Pro Plays", "💥 Highlights", "🏆 Tournaments", "📈 Popular", "⚡ New", "🎮 Community", "🔝 Top Rated"].forEach(tag => tagsSet.add(tag));
    
    const allTags = Array.from(tagsSet);
    // Shuffle and take first 9 tags
    const shuffled = shuffleArray(allTags);
    return shuffled.slice(0, 9);
  }, [shuffledDemoResults]);

  const handleTagClick = (tag) => {
    setActiveTag(activeTag === tag ? null : tag);
  };

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
      likes: demo.likes || Math.floor(Math.random() * 500) + 50,
      timestamp: "2 hours ago",
      quality: demo.isPro ? "4K" : "HD",
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

      // Determine section type
      const sectionType = Math.random();
      
      if (sectionType < 0.7) {
        // Video sections (most common) - always add videos in groups of 3
        const videosToAdd = Math.min(6, Math.floor((count - itemsGenerated) / 3) * 3); // Ensure multiple of 3
        const sectionVideos = [];
        
        for (let i = 0; i < videosToAdd && itemsGenerated < count; i++) {
          const video = videos[Math.floor(Math.random() * videos.length)];
          if (video) {
            sectionVideos.push({
              ...video,
              id: `video-${Date.now()}-${itemsGenerated}`,
            });
            itemsGenerated++;
          }
        }
        
        // Group videos in sets of 3
        for (let i = 0; i < sectionVideos.length; i += 3) {
          const videoGroup = sectionVideos.slice(i, i + 3);
          if (videoGroup.length > 0) {
            result.push({
              type: "video_group",
              id: `video-group-${Date.now()}-${i}`,
              videos: videoGroup
            });
          }
        }
        
      } else if (sectionType < 0.8) {
        // Player section
        const player = players[Math.floor(Math.random() * players.length)];
        if (player && itemsGenerated < count) {
          result.push({
            ...player,
            id: `player-${Date.now()}-${itemsGenerated}`,
          });
          itemsGenerated++;
        }
      } else if (sectionType < 0.9) {
        // Team section
        const team = teams[Math.floor(Math.random() * teams.length)];
        if (team && itemsGenerated < count) {
          result.push({
            ...team,
            id: `team-${Date.now()}-${itemsGenerated}`,
          });
          itemsGenerated++;
        }
      } else if (sectionType < 0.95) {
        // Utility section
        const utility = utilities[Math.floor(Math.random() * utilities.length)];
        if (utility && itemsGenerated < count) {
          result.push({
            ...utility,
            id: `utility-${Date.now()}-${itemsGenerated}`,
          });
          itemsGenerated++;
        }
      } else {
        // Event section
        const event = events[Math.floor(Math.random() * events.length)];
        if (event && itemsGenerated < count) {
          result.push({
            ...event,
            id: `event-${Date.now()}-${itemsGenerated}`,
          });
          itemsGenerated++;
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
    router.push(`/demos/${demo.demoId || demo.id}`);
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-white text-xl font-bold mb-2">Loading Epic Content</h2>
          <p className="text-gray-400">Preparing the best CS2 demos for you...</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Enhanced Welcome Hero Section */}
        {showWelcomeSection && !user && (
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:20px_20px]"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                    🔥 #1 CS2 Demo Platform
                  </div>
                </div>
                
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Master CS2 with
                  <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    Pro Player POVs
                  </span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Watch, learn, and dominate with exclusive first-person perspectives from the world's best CS2 players
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                  <button 
                    onClick={() => setShowWelcomeSection(false)}
                    className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                  >
                    <Play className="w-5 h-5" />
                    Start Watching Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <Link
                    href="/demos"
                    className="group text-white border-2 border-gray-600 hover:border-yellow-400 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-yellow-400/5 flex items-center gap-3"
                  >
                    <Search className="w-5 h-5" />
                    Browse All Demos
                  </Link>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  {WELCOME_STATS.map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700 mb-3 group-hover:border-gray-600 transition-colors ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}>
                        {stat.value}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {FEATURE_HIGHLIGHTS.map((feature, index) => (
                  <div key={index} className="group relative bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-white text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    
                    {/* Hover Effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Featured Hero */}
        {filteredDemos.length > 0 && (
          <FeaturedHero
            demo={filteredDemos[0]}
            autoplayVideo={true}
            setSelectedDemo={onSelectDemo}
            setActiveVideoId={setActiveVideoId}
            setIsFilterModalOpen={() => {}}
            user={user}
            session={session}
          />
        )}
        
        {/* Enhanced Tag Bar */}
        <div className="bg-gray-950/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {dynamicTags.map((tag) => (
                <Tag
                  key={tag}
                  variant={activeTag === tag ? "primary" : "secondary"}
                  size="sm"
                  className="cursor-pointer hover:border-yellow-400 hover:bg-yellow-400/5 transition-all duration-200 whitespace-nowrap flex-shrink-0 transform hover:scale-105"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Tag>
              ))}
              <Link
                href="/demos"
                className="text-yellow-400 text-sm underline hover:text-yellow-300 transition-colors whitespace-nowrap flex-shrink-0 px-3 py-2 hover:bg-yellow-400/5 rounded-lg"
              >
                View All Demos →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="space-y-8">
            {displayedItems.map((item) => (
              <div key={item.id}>
                {item.type === "section_header" && (
                  <div className="mb-6 group">
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {item.title}
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
                      <button className="text-gray-400 hover:text-yellow-400 transition-colors text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                )}
                
                {item.type === "video_group" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-8">
                    {item.videos.map((video) => (
                      <EnhancedVideoCard key={video.id} video={video} onSelectDemo={onSelectDemo} />
                    ))}
                  </div>
                )}
                
                {item.type === "player" && (
                  <div className="mb-8">
                    <EnhancedPlayerCard player={item} />
                  </div>
                )}
                
                {item.type === "team" && (
                  <div className="mb-8">
                    <EnhancedTeamCard team={item} />
                  </div>
                )}
                
                {item.type === "utility" && (
                  <div className="mb-8">
                    <UtilityCard utility={item} />
                  </div>
                )}
                
                {item.type === "event" && (
                  <div className="mb-8">
                    <EventCard event={item} />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-gray-600 border-t-yellow-400 rounded-full animate-spin" />
                  <span className="text-gray-400">Loading more amazing content...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// Enhanced Video Card Component
function EnhancedVideoCard({ video, onSelectDemo }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => onSelectDemo(video);

  return (
    <div 
      className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-300" 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-3">
        {/* Enhanced Thumbnail */}
        <div className="relative w-full overflow-hidden rounded-xl bg-gray-800">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          
          {/* Overlay with multiple elements */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
          </div>
          
          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium">
            {video.duration}
          </div>
          
          {/* Quality Badge */}
          {video.quality && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs px-2 py-1 rounded-md font-bold">
              {video.quality}
            </div>
          )}
          
          {/* Pro Badge */}
          {video.isPro && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-md font-bold">
              PRO
            </div>
          )}
          
          {/* Progress Bar for watched videos */}
          {video.watched && (
            <div className="absolute bottom-0 left-0 w-2/3 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-br-xl" />
          )}
        </div>
        
        {/* Enhanced Content */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <img 
              src={video.channelAvatar} 
              alt={video.channel} 
              className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-gray-700 group-hover:border-yellow-400 transition-colors" 
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm font-semibold leading-5 mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                {video.title}
              </h3>
              
              <div className="space-y-1">
                <p className="text-gray-400 text-xs hover:text-white transition-colors cursor-pointer">
                  {video.channel}
                </p>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{video.views}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{video.timestamp || video.uploadDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tags and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {video.map && (
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-md hover:bg-gray-700 transition-colors">
                  {video.map}
                </span>
              )}
              {video.isPro && (
                <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-md">
                  Professional
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-red-400 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-blue-400 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-yellow-400 transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Player Card Component
function EnhancedPlayerCard({ player }) {
  const playerUrlName = player.name.replace(/\s+/g, "-").toLowerCase();
  
  return (
    <Link href={`/players/${playerUrlName}`} className="group cursor-pointer block">
      <div className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-yellow-400/50 hover:bg-gray-800/50 transition-all duration-300 overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative flex items-center gap-6">
          <div className="relative">
            <img
              src={player.avatar}
              alt={player.name}
              className="w-20 h-20 rounded-2xl object-cover border-3 border-gray-600 group-hover:border-yellow-400 transition-all duration-300"
            />
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              LIVE
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-white text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">
              {player.name}
            </h3>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-gray-400 text-sm">{player.followers}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-300 text-sm">{player.game}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-yellow-400 font-bold text-lg">{player.stats?.totalDemos || '50+'}</div>
                <div className="text-gray-500 text-xs">Demos</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold text-lg">{Math.floor((player.stats?.totalViews || 25000) / 1000)}K</div>
                <div className="text-gray-500 text-xs">Views</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold text-lg">#{Math.floor(Math.random() * 20) + 1}</div>
                <div className="text-gray-500 text-xs">Rank</div>
              </div>
            </div>
          </div>
          
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform group-hover:scale-105">
            Follow
          </button>
        </div>
      </div>
    </Link>
  );
}

// Enhanced Team Card Component
function EnhancedTeamCard({ team }) {
  const [showRoster, setShowRoster] = useState(false);
  
  return (
    <div className="group cursor-pointer bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300">
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img 
              src={team.logo} 
              alt={team.name} 
              className="w-24 h-24 rounded-2xl object-cover border-3 border-gray-600 group-hover:border-yellow-400 transition-colors" 
            />
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              {team.region}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-white text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors">
              {team.name}
            </h3>
            <div className="flex items-center gap-6 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300">{team.rank}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">{team.players.length} Players</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="text-center bg-gray-800/50 rounded-lg px-4 py-2">
                <div className="text-green-400 font-bold">85%</div>
                <div className="text-gray-500 text-xs">Win Rate</div>
              </div>
              <div className="text-center bg-gray-800/50 rounded-lg px-4 py-2">
                <div className="text-yellow-400 font-bold">1.42</div>
                <div className="text-gray-500 text-xs">K/D Ratio</div>
              </div>
              <div className="text-center bg-gray-800/50 rounded-lg px-4 py-2">
                <div className="text-purple-400 font-bold">16</div>
                <div className="text-gray-500 text-xs">Tournaments</div>
              </div>
            </div>
          </div>
          
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform group-hover:scale-105">
            Follow Team
          </button>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => setShowRoster(!showRoster)}
            className="flex items-center justify-between w-full text-left group/button"
          >
            <h4 className="text-white text-lg font-semibold group-hover/button:text-yellow-400 transition-colors">
              Active Roster ({team.players.length})
            </h4>
            <ChevronRight 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showRoster ? 'rotate-90' : ''}`} 
            />
          </button>
          
          {showRoster && (
            <div className="grid grid-cols-1 gap-3 animate-in slide-in-from-top-2 duration-200">
              {team.players.map((player, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-700/30 transition-colors">
                  <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">{player.name}</p>
                    <p className="text-gray-400 text-xs">{player.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-400 text-xs font-medium bg-blue-500/20 px-3 py-1 rounded-full">
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

// Keep existing UtilityCard and EventCard components from previous version
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