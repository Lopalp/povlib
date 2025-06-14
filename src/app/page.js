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
import { Search, Filter, X, Menu, ChevronLeft, ChevronRight, Play, Eye, Heart, Star, TrendingUp, Clock, Users, Award, Zap, Fire } from "lucide-react";
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
  // Hot/Trending Tags
  "🔥 Trending Now", "⭐ Editor's Pick", "💎 Must Watch", "🚀 Viral Clips", "👑 Pro Highlights",
  
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
  "Insane Shots", "Lucky Plays", "Funny Moments", "Fails", "Best of 2024", "Community Favorites"
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
  const [showWelcome, setShowWelcome] = useState(false);

  // Shuffled results for variety
  const shuffledDemoResults = useMemo(() => shuffleArray([...filteredDemos, ...trendingDemos, ...latestDemos]), [filteredDemos, trendingDemos, latestDemos]);
  const shuffledPlayerResults = useMemo(() => shuffleArray(playerResults), [playerResults]);

  // Dynamic Tags for tag bar with trending indicators
  const dynamicTags = useMemo(() => {
    const tagsSet = new Set();
    shuffledDemoResults.forEach((demo) => {
      demo.tags.forEach((tag) => tagsSet.add(tag));
    });
    
    // Add trending tags first
    const trendingTags = ["🔥 Trending Now", "⭐ Editor's Pick", "💎 Must Watch", "🚀 Latest"];
    trendingTags.forEach(tag => tagsSet.add(tag));
    
    // Add some popular static tags
    ["Pro Matches", "Highlights", "Clutches", "Aces", "Maps", "Players"].forEach(tag => tagsSet.add(tag));
    
    const allTags = Array.from(tagsSet);
    // Ensure trending tags are first, then shuffle the rest
    const trending = allTags.filter(tag => tag.includes('🔥') || tag.includes('⭐') || tag.includes('💎') || tag.includes('🚀'));
    const others = shuffleArray(allTags.filter(tag => !trending.includes(tag)));
    
    return [...trending, ...others].slice(0, 12);
  }, [shuffledDemoResults]);

  const handleTagClick = (tag) => {
    setActiveTag(activeTag === tag ? null : tag);
  };

  // Show welcome message for new users
  useEffect(() => {
    if (!user && !loading) {
      setShowWelcome(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [user, loading]);

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
          getTrendingDemos(30, demoType),
          getLatestDemos(30, demoType),
        ]);

        // Mock player data with better variety
        const mockPlayers = Array.from({ length: 25 }).map((_, i) => ({
          id: i + 1,
          name: ["s1mple", "ZywOo", "sh1ro", "electroNic", "Ax1Le", "ropz", "NiKo", "device", "dupreeh", "gla1ve", 
                 "k0nfig", "blameF", "Magisk", "sjuush", "stavn", "TeSeS", "huNter-", "nexa", "AmaNEk", "JaCkz",
                 "Perfecto", "b1t", "Boombl4", "flamie", "seized"][i] || `Player${i + 1}`,
          avatar: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
          team: ["NAVI", "Vitality", "Gambit", "FaZe", "G2", "Astralis", "Fnatic", "NIP", "Cloud9", "Liquid"][Math.floor(Math.random() * 10)],
          stats: {
            totalViews: Math.floor(Math.random() * 100000) + 20000,
            totalDemos: Math.floor(Math.random() * 150) + 30,
            rating: (Math.random() * 0.5 + 1.0).toFixed(2), // 1.0 - 1.5 rating
          },
          game: "Counter-Strike 2",
          followers: `${Math.floor(Math.random() * 100) + 10}K followers`,
          isVerified: Math.random() > 0.4,
          isLive: Math.random() > 0.8,
        }));

        if (!demos || demos.length === 0) {
          console.warn("No demos found in database, using fallback data");
          const fallbackDemos = Array.from({ length: 50 }).map((_, i) => ({
            id: 1000 + i,
            title: generateDemoTitle(),
            thumbnail: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
            video_id: "dQw4w9WgXcQ",
            map: ["Mirage", "Dust2", "Inferno", "Cache", "Overpass", "Vertigo", "Nuke"][Math.floor(Math.random() * 7)],
            positions: [["A Site", "B Site", "Mid", "Connector", "Apps"][Math.floor(Math.random() * 5)]],
            tags: shuffleArray(ALL_TAGS.filter(tag => !tag.includes('🔥') && !tag.includes('⭐'))).slice(0, Math.floor(Math.random() * 4) + 2),
            players: [mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name],
            team: ["NAVI", "Vitality", "FaZe", "G2", "Astralis", "Fnatic", "Cloud9"][Math.floor(Math.random() * 7)],
            year: "2024",
            event: ["BLAST Premier", "IEM Katowice", "ESL Pro League", "FACEIT Major", "PGL Major"][Math.floor(Math.random() * 5)],
            result: ["Win", "Loss"][Math.floor(Math.random() * 2)],
            views: Math.floor(Math.random() * 100000) + 5000,
            likes: Math.floor(Math.random() * 5000) + 200,
            is_pro: Math.random() > 0.2,
            duration: `${Math.floor(Math.random() * 15) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            uploadDate: getRandomDate(),
            isHot: Math.random() > 0.7,
            isNew: Math.random() > 0.6,
          }));
          
          setFilteredDemos(fallbackDemos.map(mapDemo));
          setTrendingDemos(fallbackDemos.slice(0, 20).map(mapDemo));
          setLatestDemos(fallbackDemos.slice(20, 40).map(mapDemo));
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

  // Helper functions
  const generateDemoTitle = () => {
    const actions = ["Epic Ace", "Insane Clutch", "Perfect Spray", "Lucky Shot", "Team Wipe", "1v5 Clutch", "Flick Shot", "No Scope", "Wallbang"];
    const maps = ["Mirage", "Dust2", "Inferno", "Cache", "Overpass", "Vertigo"];
    const contexts = ["in Pro Match", "Major Final", "Tournament", "Ranked", "FACEIT"];
    
    return `${actions[Math.floor(Math.random() * actions.length)]} on ${maps[Math.floor(Math.random() * maps.length)]} ${contexts[Math.floor(Math.random() * contexts.length)]}`;
  };

  const getRandomDate = () => {
    const dates = ["2 hours ago", "1 day ago", "3 days ago", "1 week ago", "2 weeks ago", "1 month ago"];
    return dates[Math.floor(Math.random() * dates.length)];
  };

  // Content templates for different types
  const contentTemplates = useMemo(() => ({
    videos: shuffledDemoResults.map((demo) => ({
      type: "video",
      demoId: demo.id,
      title: demo.title,
      thumbnail: demo.thumbnail || VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
      duration: demo.duration || `${Math.floor(Math.random() * 10) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      views: demo.views ?? Math.floor(Math.random() * 50000) + 1000,
      uploadDate: demo.uploadDate || getRandomDate(),
      channel: demo.players?.[0] || "Unknown",
      channelAvatar: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
      watched: false,
      player: demo.players?.[0] || "Unknown",
      isPro: demo.isPro,
      map: demo.map,
      tags: demo.tags || [],
      likes: demo.likes || Math.floor(Math.random() * 1000),
      isHot: demo.isHot || false,
      isNew: demo.isNew || false,
      rating: (Math.random() * 0.5 + 4.5).toFixed(1), // 4.5-5.0 rating
    })),
    players: shuffledPlayerResults.map((player) => ({
      type: "player",
      name: player.name,
      avatar: player.avatar,
      followers: player.followers,
      game: player.game,
      isVerified: player.isVerified,
      isLive: player.isLive,
      ...player,
    })),
    teams: Array.from({ length: 20 }).map((_, i) => ({
      type: "team",
      name: ["NAVI", "Vitality", "FaZe", "G2", "Astralis", "Fnatic", "NIP", "Cloud9", "Liquid", "ENCE", 
             "Heroic", "Complexity", "MIBR", "Dignitas", "Mouz", "BIG", "Spirit", "OG", "FURIA", "Outsiders"][i] || `Team ${i + 1}`,
      logo: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
      rank: `#${i + 1} Global`,
      region: ["EU", "NA", "APAC", "SA", "CIS"][Math.floor(Math.random() * 5)],
      winRate: Math.floor(Math.random() * 30) + 70, // 70-100% win rate
      players: Array.from({ length: 5 }).map((__, j) => ({
        name: shuffledPlayerResults[Math.floor(Math.random() * shuffledPlayerResults.length)]?.name || `Player${j + 1}`,
        avatar: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
        role: ["IGL", "AWP", "Entry", "Support", "Lurker"][j]
      }))
    })),
    utilities: Array.from({ length: 15 }).map((_, i) => ({
      type: "utility",
      title: `${["Smoke", "Flash", "HE", "Molly", "Incendiary"][Math.floor(Math.random() * 5)]} Lineup for ${["A Site", "B Site", "Mid", "Connector"][Math.floor(Math.random() * 4)]}`,
      description: "Professional utility lineup for competitive play and site control",
      thumbnail: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
      map: ["Mirage", "Dust2", "Inferno", "Cache"][Math.floor(Math.random() * 4)],
      difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
      successRate: Math.floor(Math.random() * 20) + 80,
      views: Math.floor(Math.random() * 10000) + 1000,
      videos: Array.from({ length: Math.floor(Math.random() * 4) + 3 }).map((__, j) => ({
        id: j,
        title: `Position ${j + 1}: ${["Window", "Connector", "Stairs", "Default", "Deep"][j] || "Alternative"}`,
        thumbnail: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
        duration: `${Math.floor(Math.random() * 3) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        views: `${Math.floor(Math.random() * 50) + 5}K`
      }))
    })),
    events: Array.from({ length: 12 }).map((_, i) => ({
      type: "event",
      title: `${["Major Championship", "IEM Katowice", "ESL Pro League", "BLAST Premier", "PGL Major", "FACEIT Major", "DreamHack", "StarLadder", "EPICENTER", "ECS", "ELEAGUE", "WESG"][i]} 2024`,
      description: "The biggest Counter-Strike tournament of the year with top teams competing",
      thumbnail: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
      startDate: "Dec 15, 2024",
      prizePool: `$${Math.floor(Math.random() * 500 + 500)}K`,
      status: ["Live", "Upcoming", "Concluded"][Math.floor(Math.random() * 3)],
      viewerCount: Math.floor(Math.random() * 100000) + 50000,
      teams: Array.from({ length: 16 }).map((__, j) => ({
        id: j,
        name: `Team ${String.fromCharCode(65 + j)}`,
        logo: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
        rank: `#${j + 1}`,
        region: ["EU", "NA", "APAC", "SA", "CIS"][Math.floor(Math.random() * 5)]
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
      // Add section header with enhanced styling
      result.push({
        type: "section_header",
        id: `section-${Date.now()}-${itemsGenerated}`,
        title: availableTags[tagIndex],
        isHot: availableTags[tagIndex].includes('🔥'),
        isNew: availableTags[tagIndex].includes('🚀'),
        isPremium: availableTags[tagIndex].includes('💎'),
      });
      itemsGenerated++;
      tagIndex++;

      // Determine section type
      const sectionType = Math.random();
      
      if (sectionType < 0.7) {
        // Video sections (most common) - always add videos in groups of 3
        const videosToAdd = Math.min(6, Math.floor((count - itemsGenerated) / 3) * 3);
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
        const player = players[Math.floor(Math.random() * players.length)];
        if (player && itemsGenerated < count) {
          result.push({
            ...player,
            id: `player-${Date.now()}-${itemsGenerated}`,
          });
          itemsGenerated++;
        }
      } else if (sectionType < 0.9) {
        const team = teams[Math.floor(Math.random() * teams.length)];
        if (team && itemsGenerated < count) {
          result.push({
            ...team,
            id: `team-${Date.now()}-${itemsGenerated}`,
          });
          itemsGenerated++;
        }
      } else if (sectionType < 0.95) {
        const utility = utilities[Math.floor(Math.random() * utilities.length)];
        if (utility && itemsGenerated < count) {
          result.push({
            ...utility,
            id: `utility-${Date.now()}-${itemsGenerated}`,
          });
          itemsGenerated++;
        }
      } else {
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
      setDisplayedItems(generateSmartContent(25));
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
          setDisplayedItems(prev => [...prev, ...generateSmartContent(15)]);
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
          <h2 className="text-2xl font-bold text-white mb-2">Loading the best CS2 content...</h2>
          <p className="text-gray-400">Preparing epic highlights just for you</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Welcome Banner for new users */}
        {showWelcome && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 px-6 py-3 rounded-full shadow-xl animate-in slide-in-from-top-5 duration-500">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Welcome to the ultimate CS2 experience! 🎮</span>
              <button onClick={() => setShowWelcome(false)}>
                <X className="w-4 h-4 hover:text-gray-700 transition-colors" />
              </button>
            </div>
          </div>
        )}

        {/* Featured Hero */}
        {filteredDemos.length > 0 && (
          <div className="relative">
            <FeaturedHero
              demo={filteredDemos[0]}
              autoplayVideo={true}
              setSelectedDemo={onSelectDemo}
              setActiveVideoId={setActiveVideoId}
              setIsFilterModalOpen={() => {}}
              user={user}
              session={session}
            />
            
            {/* Hero Overlay with Quick Actions */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white text-xl font-bold mb-2">Start Your Journey</h3>
                    <p className="text-gray-300 text-sm">Discover pro plays, learn new tactics, and improve your game</p>
                  </div>
                  <div className="flex gap-3">
                    <Link 
                      href="/demos" 
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105"
                    >
                      Explore All
                    </Link>
                    <Link 
                      href="/players" 
                      className="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105"
                    >
                      Pro Players
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Tag Bar */}
        <div className="bg-gray-950/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <Fire className="w-5 h-5" />
                <span className="font-semibold text-sm hidden sm:block">Hot Topics</span>
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
                {dynamicTags.map((tag) => (
                  <Tag
                    key={tag}
                    variant={activeTag === tag ? "primary" : "secondary"}
                    size="sm"
                    className={`cursor-pointer transition-all duration-200 whitespace-nowrap flex-shrink-0 relative ${
                      activeTag === tag 
                        ? "bg-yellow-400 text-gray-900 border-yellow-400" 
                        : "hover:border-yellow-400 hover:text-yellow-400"
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                    {(tag.includes('🔥') || tag.includes('🚀')) && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </Tag>
                ))}
              </div>
              <Link
                href="/demos"
                className="text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors whitespace-nowrap flex-shrink-0 px-3 py-2 border border-yellow-400/20 rounded-full hover:border-yellow-400/40"
              >
                View All →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="space-y-10">
            {displayedItems.map((item) => (
              <div key={item.id}>
                {item.type === "section_header" && (
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                        {item.title}
                        {item.isHot && <Fire className="w-6 h-6 text-red-500 animate-pulse" />}
                        {item.isNew && <Star className="w-6 h-6 text-blue-400" />}
                        {item.isPremium && <Award className="w-6 h-6 text-yellow-400" />}
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
                    </div>
                  </div>
                )}
                
                {item.type === "video_group" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {item.videos.map((video) => (
                      <VideoCard key={video.id} video={video} onSelectDemo={onSelectDemo} />
                    ))}
                  </div>
                )}
                
                {item.type === "player" && (
                  <div className="mb-8">
                    <PlayerCard player={item} />
                  </div>
                )}
                
                {item.type === "team" && (
                  <div className="mb-8">
                    <TeamCard team={item} />
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
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Loading more epic content...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// Enhanced Component implementations
function VideoCard({ video, onSelectDemo }) {
  const [isHovered, setIsHovered] = useState(false);
  const handleClick = () => onSelectDemo(video);

  return (
    <div 
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-4">
        {/* Enhanced Thumbnail */}
        <div className="relative w-full overflow-hidden rounded-xl">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
            </div>
          </div>
          
          {/* Duration */}
          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">
            {video.duration}
          </div>
          
          {/* Hot/New Badges */}
          {video.isHot && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
              <Fire className="w-3 h-3" />
              HOT
            </div>
          )}
          
          {video.isNew && (
            <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
              <Star className="w-3 h-3" />
              NEW
            </div>
          )}
          
          {/* Progress Bar */}
          {video.watched && (
            <div className="absolute bottom-0 left-0 w-2/3 h-1 bg-yellow-400 rounded-r-full" />
          )}
        </div>
        
        {/* Enhanced Content */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="relative">
              <img src={video.channelAvatar} alt={video.channel} className="w-10 h-10 rounded-full flex-shrink-0" />
              {video.isLive && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 border-2 border-gray-950 rounded-full animate-pulse" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm font-semibold leading-5 mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                {video.title}
              </h3>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-gray-400 text-xs font-medium">{video.channel}</p>
                  {video.isPro && (
                    <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-gray-900 text-[8px] font-bold">✓</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{video.views.toLocaleString()} views</span>
                  </div>
                  <span>•</span>
                  <span>{video.uploadDate}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {video.isPro && (
                      <span className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-1 rounded-full">Pro</span>
                    )}
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">{video.map}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3 h-3" fill="currentColor" />
                    <span className="text-xs font-medium">{video.rating}</span>
                  </div>
                </div>
              </div>
            </div>
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
      <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-gray-900/50 to-gray-800/30 rounded-2xl border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/10">
        <div className="relative">
          <img
            src={player.avatar}
            alt={player.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-600 group-hover:border-yellow-400 transition-colors"
          />
          {player.isLive && (
            <div className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          )}
          {player.isVerified && (
            <div className="absolute top-0 right-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-gray-900 text-xs font-bold">✓</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white text-xl font-bold group-hover:text-yellow-400 transition-colors">
              {player.name}
            </h3>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">{player.team}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="text-yellow-400 text-lg font-bold">{player.followers}</div>
              <div className="text-gray-400 text-xs">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 text-lg font-bold">{player.stats.rating}</div>
              <div className="text-gray-400 text-xs">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-lg font-bold">{player.stats.totalDemos}</div>
              <div className="text-gray-400 text-xs">Demos</div>
            </div>
          </div>
          <p className="text-gray-500 text-sm">{player.game}</p>
        </div>
        <div className="flex flex-col gap-2">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105">
            Subscribe
          </button>
          <div className="text-center text-gray-400 text-xs">
            {player.stats.totalViews.toLocaleString()} total views
          </div>
        </div>
      </div>
    </Link>
  );
}

function TeamCard({ team }) {
  const [showRoster, setShowRoster] = useState(false);
  
  return (
    <div className="group cursor-pointer bg-gradient-to-r from-gray-900/50 to-gray-800/30 rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/10">
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <img 
            src={team.logo} 
            alt={team.name} 
            className="w-24 h-24 rounded-xl object-cover border-2 border-gray-600 group-hover:border-yellow-400 transition-colors" 
          />
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h3 className="text-white text-2xl font-bold group-hover:text-yellow-400 transition-colors">
                {team.name}
              </h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-bold">{team.winRate}%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-yellow-400 font-bold">{team.rank}</div>
                <div className="text-gray-400 text-xs">Global Rank</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-blue-400 font-bold">{team.region}</div>
                <div className="text-gray-400 text-xs">Region</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-green-400 font-bold">{team.winRate}%</div>
                <div className="text-gray-400 text-xs">Win Rate</div>
              </div>
            </div>
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105">
            Follow Team
          </button>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => setShowRoster(!showRoster)}
            className="flex items-center justify-between w-full text-left p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-yellow-400" />
              <h4 className="text-white text-sm font-bold">Active Roster ({team.players.length})</h4>
            </div>
            <ChevronRight 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showRoster ? 'rotate-90' : ''}`} 
            />
          </button>
          
          {showRoster && (
            <div className="grid grid-cols-1 gap-3 animate-in slide-in-from-top-2 duration-300">
              {team.players.map((player, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">{player.name}</p>
                    <p className="text-gray-400 text-xs">{player.role}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 text-xs font-bold bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full">
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
    <div className="group cursor-pointer bg-gradient-to-r from-gray-900/50 to-gray-800/30 rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/10">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-80">
            <div className="aspect-video bg-gray-900 rounded-xl p-6 border border-gray-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-yellow-500/5" />
              <div className="relative w-full h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-bold text-lg">{utility.map}</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-bold">{utility.successRate}% Success</span>
                  </div>
                </div>
                
                <div className="flex-1 bg-gray-800 rounded-lg p-4 relative overflow-hidden border border-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-red-500/10"></div>
                  <div className="relative w-full h-full">
                    <div className="absolute top-2 left-2 w-8 h-6 border border-gray-600 rounded text-[8px] text-gray-400 flex items-center justify-center">A</div>
                    <div className="absolute top-2 right-2 w-8 h-6 border border-gray-600 rounded text-[8px] text-gray-400 flex items-center justify-center">B</div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-6 border border-gray-600 rounded text-[8px] text-gray-400 flex items-center justify-center">MID</div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 bg-yellow-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-white text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors">
              {utility.title}
            </h3>
            <p className="text-gray-400 text-sm mb-6">{utility.description}</p>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-white font-bold text-lg">{utility.difficulty}</div>
                <div className="text-gray-400 text-xs">Difficulty</div>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-green-400 font-bold text-lg">{utility.successRate}%</div>
                <div className="text-gray-400 text-xs">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-blue-400 font-bold text-lg">{utility.videos.length}</div>
                <div className="text-gray-400 text-xs">Positions</div>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-yellow-400 font-bold text-lg">{utility.views.toLocaleString()}</div>
                <div className="text-gray-400 text-xs">Views</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Landing Spot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Throw Positions</span>
              </div>
            </div>
            
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 px-6 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105">
              View Full Tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <div className="group cursor-pointer bg-gradient-to-r from-gray-900/50 to-gray-800/30 rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/10">
      <div className="space-y-6">
        <div className="flex gap-6">
          <img 
            src={event.thumbnail} 
            alt={event.title} 
            className="w-40 h-24 rounded-xl object-cover flex-shrink-0 border-2 border-gray-600 group-hover:border-yellow-400 transition-colors" 
          />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-white text-2xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{event.description}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  event.status === 'Live' ? 'bg-red-600 text-white' :
                  event.status === 'Upcoming' ? 'bg-blue-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {event.status}
                </span>
                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
                  {event.prizePool}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-white font-bold">{event.startDate}</div>
                <div className="text-gray-400 text-xs">Date</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-blue-400 font-bold">{event.teams.length}</div>
                <div className="text-gray-400 text-xs">Teams</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-green-400 font-bold">{event.matches.length}</div>
                <div className="text-gray-400 text-xs">Matches</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-yellow-400 font-bold">{event.viewerCount.toLocaleString()}</div>
                <div className="text-gray-400 text-xs">Viewers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}