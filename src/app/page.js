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
import { Search, Filter, X, Menu, ChevronLeft, ChevronRight, MoreVertical, Map, Grid3X3 } from "lucide-react";
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

// Map information with thumbnails and stats
const MAPS_INFO = {
  "Mirage": {
    name: "Mirage",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
    description: "Classic three-lane map with Middle control focus",
    positions: ["A Site", "B Site", "Middle", "Connector", "Palace", "Ramp"],
    difficulty: "Medium",
    competitivePool: true
  },
  "Dust2": {
    name: "Dust2",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
    description: "Iconic desert map with long-range duels",
    positions: ["A Site", "B Site", "Middle", "Long", "Short", "Tunnels"],
    difficulty: "Easy",
    competitivePool: true
  },
  "Inferno": {
    name: "Inferno",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop",
    description: "Close-quarters Italian village setting",
    positions: ["A Site", "B Site", "Apartments", "Balcony", "Arch", "Banana"],
    difficulty: "Hard",
    competitivePool: true
  },
  "Cache": {
    name: "Cache",
    thumbnail: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=225&fit=crop",
    description: "Industrial map with central focus",
    positions: ["A Site", "B Site", "Middle", "Quad", "Checkers", "Sun Room"],
    difficulty: "Medium",
    competitivePool: true
  },
  "Overpass": {
    name: "Overpass",
    thumbnail: "https://images.unsplash.com/photo-1586953983027-d7508e87d878?w=400&h=225&fit=crop",
    description: "Vertical map with park and restroom control",
    positions: ["A Site", "B Site", "Bathrooms", "Park", "Monster", "Heaven"],
    difficulty: "Hard",
    competitivePool: true
  },
  "Vertigo": {
    name: "Vertigo",
    thumbnail: "https://images.unsplash.com/photo-1576075796033-848c2a5b3e98?w=400&h=225&fit=crop",
    description: "Skyscraper map with height advantages",
    positions: ["A Site", "B Site", "Ramp", "Stairs", "Mid", "CT Spawn"],
    difficulty: "Hard",
    competitivePool: true
  },
  "Nuke": {
    name: "Nuke",
    thumbnail: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=225&fit=crop",
    description: "Nuclear facility with upper/lower levels",
    positions: ["A Site", "B Site", "Upper", "Lower", "Ramp", "Hut"],
    difficulty: "Very Hard",
    competitivePool: true
  },
  "Train": {
    name: "Train",
    thumbnail: "https://images.unsplash.com/photo-1583143112904-06c49f7b3b71?w=400&h=225&fit=crop",
    description: "Industrial train yard setting",
    positions: ["A Site", "B Site", "Inner", "Outer", "Connector", "Ivy"],
    difficulty: "Hard",
    competitivePool: false
  },
  "Ancient": {
    name: "Ancient",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop",
    description: "Aztec-themed archaeological site",
    positions: ["A Site", "B Site", "Middle", "Temple", "Pit", "Donut"],
    difficulty: "Medium",
    competitivePool: true
  },
  "Anubis": {
    name: "Anubis",
    thumbnail: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=225&fit=crop",
    description: "Egyptian temple complex",
    positions: ["A Site", "B Site", "Mid", "Palace", "Connector", "Temple"],
    difficulty: "Medium",
    competitivePool: true
  }
};

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
  const [displayedVideos, setDisplayedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState("");
  const [videoModal, setVideoModal] = useState({ isOpen: false, video: null });

  // -------------------------------------
  // Maps-specific states
  // -------------------------------------
  const [selectedMap, setSelectedMap] = useState(null);
  const [showMapsView, setShowMapsView] = useState(false);
  const [mapDemos, setMapDemos] = useState({});

  // Shuffled results for variety
  const shuffledDemoResults = useMemo(() => shuffleArray([...filteredDemos, ...trendingDemos, ...latestDemos]), [filteredDemos, trendingDemos, latestDemos]);

  // Dynamic Tags for tag bar
  const dynamicTags = useMemo(() => {
    const tagsSet = new Set();
    shuffledDemoResults.forEach((demo) => {
      demo.tags.forEach((tag) => tagsSet.add(tag));
    });
    
    // Add some static popular tags including Maps
    ["Maps", "Players", "Teams", "Pro Matches", "Highlights", "Clutches", "Aces"].forEach(tag => tagsSet.add(tag));
    
    const allTags = Array.from(tagsSet);
    // Shuffle and take first 8-10 tags
    const shuffled = shuffleArray(allTags);
    return shuffled.slice(0, 9);
  }, [shuffledDemoResults]);

  // Filter demos by selected map
  const filteredByMap = useMemo(() => {
    if (!selectedMap) return displayedVideos;
    return displayedVideos.filter(video => video.map === selectedMap);
  }, [displayedVideos, selectedMap]);

  // Map statistics
  const mapStats = useMemo(() => {
    const stats = {};
    shuffledDemoResults.forEach(demo => {
      if (demo.map) {
        if (!stats[demo.map]) {
          stats[demo.map] = { count: 0, views: 0, likes: 0 };
        }
        stats[demo.map].count++;
        stats[demo.map].views += demo.views;
        stats[demo.map].likes += demo.likes;
      }
    });
    return stats;
  }, [shuffledDemoResults]);

  const handleTagClick = (tag) => {
    if (tag === "Maps") {
      setShowMapsView(!showMapsView);
      setActiveTag(activeTag === tag ? null : tag);
    } else {
      setActiveTag(activeTag === tag ? null : tag);
      setShowMapsView(false);
    }
  };

  const handleMapSelect = (mapName) => {
    setSelectedMap(selectedMap === mapName ? null : mapName);
    setShowMapsView(false);
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

        if (!demos || demos.length === 0) {
          console.warn("No demos found in database, using fallback data");
          const fallbackDemos = Array.from({ length: 50 }).map((_, i) => ({
            id: 1000 + i,
            title: `${["Epic Ace", "Insane Clutch", "Perfect Spray", "Lucky Shot", "Team Wipe"][Math.floor(Math.random() * 5)]} on ${["Mirage", "Dust2", "Inferno", "Cache"][Math.floor(Math.random() * 4)]}`,
            thumbnail: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
            video_id: "dQw4w9WgXcQ",
            map: Object.keys(MAPS_INFO)[Math.floor(Math.random() * Object.keys(MAPS_INFO).length)],
            positions: [["A Site", "B Site", "Mid"][Math.floor(Math.random() * 3)]],
            tags: shuffleArray(ALL_TAGS).slice(0, Math.floor(Math.random() * 5) + 2),
            players: [["s1mple", "ZywOo", "sh1ro", "electroNic", "Ax1Le"][Math.floor(Math.random() * 5)]],
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

        setIsInitialLoading(false);
        console.log("Initial data loading completed");
      } catch (error) {
        console.error("Error loading initial data:", error);
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, [demoType]);

  // Generate video content
  const generateVideoContent = useCallback((count = 20) => {
    const allVideos = shuffledDemoResults.map((demo) => ({
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
      id: `video-${demo.id}-${Date.now()}`,
    }));

    return shuffleArray(allVideos).slice(0, count);
  }, [shuffledDemoResults]);

  // Initialize content
  useEffect(() => {
    if (!isInitialLoading && shuffledDemoResults.length > 0) {
      setDisplayedVideos(generateVideoContent(30));
    }
  }, [isInitialLoading, generateVideoContent, shuffledDemoResults.length]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || isInitialLoading) return;
      
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.offsetHeight;
      
      if (scrollPosition >= documentHeight - 1000) {
        setIsLoading(true);
        setTimeout(() => {
          setDisplayedVideos(prev => [...prev, ...generateVideoContent(20)]);
          setIsLoading(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [generateVideoContent, isLoading, isInitialLoading]);

  // Video selection
  const onSelectDemo = (demo) => {
    router.push(`/demos/${demo.demoId}`);
  };

  // Video modal handlers
  const handleVideoMenuClick = (video, event) => {
    event.stopPropagation();
    setVideoModal({ isOpen: true, video });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, video: null });
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
        
        {/* Tag Bar */}
        <div className="bg-gray-950 border-b border-gray-800">
          <div className="max-w-full mx-auto px-3 sm:px-5 py-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {dynamicTags.map((tag) => (
                <button
                  key={tag}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 flex items-center gap-2
                    ${activeTag === tag 
                      ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                      : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                    }
                  `}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag === "Maps" && <Map className="w-4 h-4" />}
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Selection Bar */}
        {selectedMap && (
          <div className="bg-gray-900 border-b border-gray-700">
            <div className="max-w-full mx-auto px-3 sm:px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Map className="w-4 h-4" />
                  <span className="text-sm font-medium">Filtered by:</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                  <span className="text-sm text-white">{selectedMap}</span>
                  <button 
                    onClick={() => setSelectedMap(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  {filteredByMap.length} demos found
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Maps Overview */}
        {showMapsView && (
          <div className="bg-gray-900 border-b border-gray-700">
            <div className="max-w-full mx-auto px-3 sm:px-5 py-6">
              <div className="mb-4 flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-white">Browse by Maps</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(MAPS_INFO).map(([mapName, mapInfo]) => (
                  <MapCard 
                    key={mapName}
                    mapInfo={mapInfo}
                    stats={mapStats[mapName]}
                    isSelected={selectedMap === mapName}
                    onClick={() => handleMapSelect(mapName)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="max-w-full mx-auto px-3 sm:px-5 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-5 lg:gap-y-10">
            {(selectedMap ? filteredByMap : displayedVideos).map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onSelectDemo={onSelectDemo}
                onMenuClick={handleVideoMenuClick}
                showMapBadge={!selectedMap}
              />
            ))}
          </div>
          
          {isLoading && (
            <div className="flex justify-center py-8 sm:py-12">
              <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Video Modal */}
        {videoModal.isOpen && (
          <VideoModal 
            video={videoModal.video} 
            onClose={closeVideoModal} 
          />
        )}
      </div>
    </main>
  );
}

// Map Card Component
function MapCard({ mapInfo, stats, isSelected, onClick }) {
  return (
    <div 
      className={`
        cursor-pointer rounded-lg overflow-hidden transition-all duration-200 border-2
        ${isSelected 
          ? 'border-yellow-400 bg-gray-800 shadow-lg shadow-yellow-400/20' 
          : 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-750'
        }
      `}
      onClick={onClick}
    >
      <div className="aspect-video w-full">
        <img 
          src={mapInfo.thumbnail}
          alt={mapInfo.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-white">{mapInfo.name}</h3>
          {mapInfo.competitivePool && (
            <div className="w-2 h-2 bg-green-400 rounded-full" title="Active Duty"></div>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-2">{mapInfo.description}</p>
        {stats && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{stats.count} demos</span>
            <span className={`
              px-2 py-1 rounded text-xs
              ${mapInfo.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                mapInfo.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                mapInfo.difficulty === 'Hard' ? 'bg-orange-900 text-orange-300' :
                'bg-red-900 text-red-300'}
            `}>
              {mapInfo.difficulty}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Video Card Component
function VideoCard({ video, onSelectDemo, onMenuClick, showMapBadge = true }) {
  const handleClick = () => onSelectDemo(video);

  return (
    <div className="group cursor-pointer">
      <div className="space-y-3">
        {/* Thumbnail */}
        <div className="relative w-full" onClick={handleClick}>
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full aspect-video object-cover rounded-xl" 
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
            {video.duration}
          </div>
          {showMapBadge && video.map && (
            <div className="absolute top-2 left-2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <Map className="w-3 h-3" />
              {video.map}
            </div>
          )}
          {video.watched && (
            <div className="absolute bottom-0 left-0 w-2/3 h-1 bg-blue-500 rounded-b-xl" />
          )}
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <div className="flex gap-3">
            <img 
              src={video.channelAvatar} 
              alt={video.channel} 
              className="w-9 h-9 rounded-full flex-shrink-0" 
              onClick={handleClick}
            />
            <div className="flex-1 min-w-0" onClick={handleClick}>
              <h3 className="text-white text-sm font-medium leading-5 mb-1 group-hover:text-gray-200 transition-colors line-clamp-2">
                {video.title}
              </h3>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <span>{video.views}</span>
                  <span>•</span>
                  <span>{video.uploadDate}</span>
                </div>
              </div>
            </div>
            
            {/* Three Dots Menu */}
            <button 
              className="p-1 hover:bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              onClick={(e) => onMenuClick(video, e)}
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Video Modal Component
function VideoModal({ video, onClose }) {
  const menuItems = [
    { icon: "📋", label: "Add to queue" },
    { icon: "🕒", label: "Save to Watch Later" },
    { icon: "📁", label: "Save to playlist" },
    { icon: "📤", label: "Share" },
    { icon: "🚫", label: "Not interested" },
    { icon: "❌", label: "Don't recommend channel" },
    { icon: "🚨", label: "Report" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg min-w-[200px] max-w-[300px] overflow-hidden">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors flex items-center gap-3 text-sm"
            onClick={onClose}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      
      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      />
    </div>
  );
}