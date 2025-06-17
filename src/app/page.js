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
import { Search, Filter, X, Menu, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
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
  // Under Construction Modal (show on load)
  // -------------------------------------
  const [isUnderConstructionOpen, setIsUnderConstructionOpen] = useState(false);

  useEffect(() => {
    setIsUnderConstructionOpen(true);
  }, []);

  // -------------------------------------
  // Plan state for comparison module
  // -------------------------------------
  const [currentPlan, setCurrentPlan] = useState("free"); // default—could come from user profile/API
  const handleUpgrade = (nextPlanKey) => {
    if (!nextPlanKey) {
      // User is already on the highest tier or clicked "Manage Subscription"
      console.log("Manage subscription clicked");
      return;
    }
    // Example API call to upgrade plan, then update local state:
    fetch("/api/upgrade-plan", {
      method: "POST",
      body: JSON.stringify({ newPlan: nextPlanKey }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Upgrade failed");
        return res.json();
      })
      .then((data) => {
        setCurrentPlan(nextPlanKey);
      })
      .catch((err) => {
        console.error(err);
        alert("Upgrade failed. Please try again.");
      });
  };

  // -------------------------------------
  // UI States
  // -------------------------------------
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);

  const handleTagClick = (tag) => {
    setActiveTag(tag);
  };
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideoId, setActiveVideoId] = useState("");
  const [autoplayVideo, setAutoplayVideo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoPlayerPage, setIsVideoPlayerPage] = useState(false);

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

  // Shuffled results for variety
  const shuffledDemoResults = useMemo(() => shuffleArray([...filteredDemos, ...trendingDemos, ...latestDemos]), [filteredDemos, trendingDemos, latestDemos]);

  // Dynamic Tags for tag bar
  const dynamicTags = useMemo(() => {
    const tagsSet = new Set();
    shuffledDemoResults.forEach((demo) => {
      demo.tags.forEach((tag) => tagsSet.add(tag));
    });
    
    // Add some static popular tags
    ["Maps", "Players", "Teams", "Pro Matches", "Highlights", "Clutches", "Aces"].forEach(tag => tagsSet.add(tag));
    
    const allTags = Array.from(tagsSet);
    // Shuffle and take first 8-10 tags
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

        if (!demos || demos.length === 0) {
          console.warn("No demos found in database, using fallback data");
          const fallbackDemos = Array.from({ length: 50 }).map((_, i) => ({
            id: 1000 + i,
            title: `${["Epic Ace", "Insane Clutch", "Perfect Spray", "Lucky Shot", "Team Wipe"][Math.floor(Math.random() * 5)]} on ${["Mirage", "Dust2", "Inferno", "Cache"][Math.floor(Math.random() * 4)]}`,
            thumbnail: VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)],
            video_id: "dQw4w9WgXcQ",
            map: ["Mirage", "Dust2", "Inferno", "Cache", "Overpass"][Math.floor(Math.random() * 5)],
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
  const buildVideoObjects = useCallback(() => {
    return shuffledDemoResults.map((demo) => ({
      type: "video",
      demoId: demo.id,
      title: demo.title,
      thumbnail:
        VIDEO_THUMBNAIL_POOL[
          Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)
        ],
      duration: `${Math.floor(Math.random() * 10) + 5}:${String(
        Math.floor(Math.random() * 60)
      ).padStart(2, "0")}`,
      views: `${demo.views ?? Math.floor(Math.random() * 999) + 1} views`,
      uploadDate: demo.year || "2024",
      channel: demo.players?.[0] || "Unknown",
      channelAvatar:
        VIDEO_THUMBNAIL_POOL[
          Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)
        ],
      watched: false,
      player: demo.players?.[0] || "Unknown",
      isPro: demo.isPro,
      map: demo.map,
      tags: demo.tags || [],
      id: `video-${demo.id}-${Date.now()}`,
    }));
  }, [shuffledDemoResults]);

  const generateVideoContent = useCallback(
    (count = 20, structured = false) => {
      const videos = shuffleArray(buildVideoObjects());

      if (!structured) {
        return videos.slice(0, count);
      }

      const tagCount = {};
      shuffledDemoResults.forEach((demo) => {
        (demo.tags || []).forEach((t) => {
          tagCount[t] = (tagCount[t] || 0) + 1;
        });
      });
      const eligibleTags = Object.keys(tagCount).filter((t) => tagCount[t] >= 3);

      const pickTag = () => {
        if (eligibleTags.length === 0) return null;
        const idx = Math.floor(Math.random() * eligibleTags.length);
        const tag = eligibleTags[idx];
        eligibleTags.splice(idx, 1);
        return tag;
      };

      const result = [];

      result.push(...videos.splice(0, 6));

      const tag1 = pickTag();
      if (tag1) {
        result.push({ type: "category", tag: tag1, id: `cat-${tag1}-1` });
        const tagVideos1 = shuffleArray(
          buildVideoObjects().filter((v) => v.tags.includes(tag1))
        ).slice(0, 3);
        result.push(...tagVideos1);
      }

      result.push(...videos.splice(0, 9));

      const tag2 = pickTag();
      if (tag2) {
        result.push({ type: "category", tag: tag2, id: `cat-${tag2}-2` });
        const tagVideos2 = shuffleArray(
          buildVideoObjects().filter((v) => v.tags.includes(tag2))
        ).slice(0, 3);
        result.push(...tagVideos2);
      }

      if (result.length < count) {
        result.push(...videos.slice(0, count - result.length));
      }

      return result.slice(0, count);
    },
    [buildVideoObjects, shuffledDemoResults]
  );

  // Initialize content
  useEffect(() => {
    if (!isInitialLoading && shuffledDemoResults.length > 0) {
      setDisplayedVideos(generateVideoContent(30, true));
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
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {dynamicTags.map((tag) => (
                <button
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                    activeTag === tag
                      ? 'bg-brand-yellow text-gray-900 hover:bg-brand-yellow'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-5 lg:gap-y-10">
            {displayedVideos.map((item) => (
              item.type === "category" ? (
                <h2
                  key={item.id}
                  className="col-span-full text-lg font-semibold text-white mt-2"
                >
                  {item.tag}
                </h2>
              ) : (
                <VideoCard
                  key={item.id}
                  video={item}
                  onSelectDemo={onSelectDemo}
                  onMenuClick={handleVideoMenuClick}
                />
              )
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

// Simplified Video Card Component
function VideoCard({ video, onSelectDemo, onMenuClick }) {
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