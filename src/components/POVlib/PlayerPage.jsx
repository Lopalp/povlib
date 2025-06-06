'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Shield,
  Twitter,
  Twitch,
  Instagram,
  Youtube,
  User,
  Star,
  Trophy,
  Video,
  BookOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import Navbar from './Navbar';
import Footer from './Footer';
import VideoPlayerPage from './VideoPlayerPage';
import TaggingModal from './TaggingModal';
import FilterModal from './FilterModal';

import CategorySection from '../../components/containers/CategorySection';
import CategorySectionFeatured from '../../components/containers/CategorySectionFeatured';
import CategoryCarousel from '../../components/containers/CategoryCarousel';

import {
  getPlayerInfo,
  getDemosByPlayer,
  getFilterOptions,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions
} from '@/lib/supabase';

// Helper to group demos by a given property
const groupDemosByProperty = (demos, property) =>
  demos.reduce((acc, demo) => {
    const key = demo[property] || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(demo);
    return acc;
  }, {});

const PlayerPage = ({ playerName }) => {
  const router = useRouter();
  const [player, setPlayer] = useState(null);
  const [allDemos, setAllDemos] = useState([]);
  const [demosByMap, setDemosByMap] = useState({});
  const [demosByEvent, setDemosByEvent] = useState({});
  const [demosByYear, setDemosByYear] = useState({});
  const [trendingDemos, setTrendingDemos] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState('');
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [demoType, setDemoType] = useState('all');
  const [filtersApplied, setFiltersApplied] = useState({
    map: '',
    position: '',
    team: '',
    year: '',
    event: '',
    result: '',
  });
  const [relatedDemos, setRelatedDemos] = useState([]);
  const [isFullScreenPlayer, setIsFullScreenPlayer] = useState(false);
  const [teamHistoryOpen, setTeamHistoryOpen] = useState(false);

  // New states for additional sections
  const [favoriteMap, setFavoriteMap] = useState('Dust II'); // mock data
  const [bestGame, setBestGame] = useState({
    title: 'Mirage 1v3 Clutch vs G2',
    videoId: 'dQw4w9WgXcQ',
    map: 'Mirage',
    date: '2024-11-12'
  }); // mock data
  const [recentClips, setRecentClips] = useState([
    { id: 1, title: 'Ace on Inferno', videoId: 'XxVg_s8xAms' },
    { id: 2, title: 'Ninja Defuse on Nuke', videoId: 'V-_O7nl0Ii0' },
    { id: 3, title: 'Clutch vs Astralis', videoId: 'M7lc1UVf-VE' }
  ]); // mock data

  // Util Book data and filter
  const [utilBookItems, setUtilBookItems] = useState([
    { id: 1, map: 'Dust II', description: 'Smoke mid doors', videoId: 'abcd1' },
    { id: 2, map: 'Mirage', description: 'Connector A setup', videoId: 'abcd2' },
    { id: 3, map: 'Inferno', description: 'Banana control', videoId: 'abcd3' },
    { id: 4, map: 'Nuke', description: 'Heaven smoke', videoId: 'abcd4' },
    { id: 5, map: 'Dust II', description: 'A long flash', videoId: 'abcd5' }
  ]); // mock data
  const [utilBookFilter, setUtilBookFilter] = useState('');

  const infiniteScrollRef = useRef(null);

  // Mock player details (merged with DB data; DB wins on overlap)
  const mockPlayerDetails = {
    real_name: 'Александр Нагорный',
    romanized_name: 'Aleksandr Nahornyj',
    birth_date: '2001-12-31',
    nationality: 'Belarus',
    status: 'Active',
    role: 'Support',
    current_team: {
      name: 'Nemiga Gaming',
      link: null
    },
    image_url: 'https://liquipedia.net/commons/images/0/00/1eeR_at_ESL_Pro_League_S21.jpg',
    twitter: '1eeR24',
    twitch: '1eer24',
    instagram: '1eer24',
    youtube_channel: 'channel/UCGeIRw5f-QzBGQejlhMGoBQ',
    vk_page: '1eeer24',
    page_title: '1eeR',
    liquipedia_url: 'https://liquipedia.net/counterstrike/1eeR',
    team_history: [
      { start_date: '2020-08-05', end_date: '2020-09-19', team_name: 'Trial' },
      { start_date: '2020-09-19', end_date: '2021-08-30', team_name: 'Zorka' },
      { start_date: '2021-08-30', end_date: '2022-01-16', team_name: 'Nemiga Gaming' },
      { start_date: '2022-04-24', end_date: '2022-08-05', team_name: 'PLATOON Alpha' },
      { start_date: '2022-08-05', end_date: 'Present', team_name: 'Nemiga Gaming' },
    ],
  };

  // Fetch player and demo data
  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        setIsLoading(true);

        // Load filter options
        const options = await getFilterOptions();
        setFilterOptions(options);

        // Fetch player info
        const playerData = await getPlayerInfo(playerName);
        if (!playerData) {
          setError('Player not found');
          setIsLoading(false);
          return;
        }

        // Merge mock and DB data; DB has priority
        const mergedPlayer = {
          ...mockPlayerDetails,
          ...playerData,
          current_team: playerData.current_team || mockPlayerDetails.current_team
        };
        setPlayer(mergedPlayer);

        // Fetch first page of demos
        const demosData = await getDemosByPlayer(playerName, demoType, 1, 12, filtersApplied);
        if (!demosData || demosData.length === 0) {
          setAllDemos([]);
          setHasMore(false);
          setIsLoading(false);
          return;
        }
        const mappedDemos = demosData.map(mapDemoData);
        setAllDemos(mappedDemos);

        // Group demos
        setDemosByMap(groupDemosByProperty(mappedDemos, 'map'));
        setDemosByEvent(groupDemosByProperty(mappedDemos, 'event'));
        setDemosByYear(groupDemosByProperty(mappedDemos, 'year'));

        // Top 5 by views
        const sorted = [...mappedDemos].sort((a, b) => b.views - a.views);
        setTrendingDemos(sorted.slice(0, 5));

        setHasMore(demosData.length === 12);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading player data:', err);
        setError('Failed to load player data. Please try again later.');
        setIsLoading(false);
      }
    };

    loadPlayerData();
  }, [playerName, demoType, filtersApplied]);

  // Map raw demo data into internal format
  const mapDemoData = (demo) => ({
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
    isPro: demo.is_pro
  });

  // Load more demos (infinite scroll)
  const loadMoreDemos = async () => {
    if (!hasMore || isLoading) return;
    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const demosData = await getDemosByPlayer(playerName, demoType, nextPage, 12, filtersApplied);
      if (!demosData || demosData.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      const mappedDemos = demosData.map(mapDemoData);
      setAllDemos(prev => [...prev, ...mappedDemos]);

      // Update groupings
      const updatedByMap = { ...demosByMap };
      const updatedByEvent = { ...demosByEvent };
      const updatedByYear = { ...demosByYear };
      mappedDemos.forEach(demo => {
        if (!updatedByMap[demo.map]) updatedByMap[demo.map] = [];
        updatedByMap[demo.map].push(demo);

        if (demo.event) {
          if (!updatedByEvent[demo.event]) updatedByEvent[demo.event] = [];
          updatedByEvent[demo.event].push(demo);
        }
        if (!updatedByYear[demo.year]) updatedByYear[demo.year] = [];
        updatedByYear[demo.year].push(demo);
      });
      setDemosByMap(updatedByMap);
      setDemosByEvent(updatedByEvent);
      setDemosByYear(updatedByYear);

      setPage(nextPage);
      setHasMore(demosData.length === 12);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading more demos:', err);
      setIsLoading(false);
    }
  };

  // IntersectionObserver for infinite scroll
  const observer = useRef();
  const lastDemoElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreDemos();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Select a demo → open player
  const handleSelectDemo = (demo) => {
    setSelectedDemo(demo);
    setActiveVideoId(demo.videoId);
    setIsFullScreenPlayer(true);
    findRelatedDemos(demo);
    updateDemoStats(demo.id, 'views', 1).catch(err =>
      console.error('Error updating views:', err)
    );
    window.scrollTo(0, 0);
  };

  // Find related demos by map / players / positions
  const findRelatedDemos = (demo) => {
    const related = allDemos.filter(d =>
      d.id !== demo.id &&
      (
        d.map === demo.map ||
        d.players.some(p => demo.players.includes(p)) ||
        d.positions.some(pos => demo.positions.includes(pos))
      )
    );
    setRelatedDemos(related.slice(0, 10));
  };

  // Close video player
  const handleCloseVideoPlayer = () => {
    setSelectedDemo(null);
    setActiveVideoId('');
    setIsFullScreenPlayer(false);
    setRelatedDemos([]);
  };

  // Like a demo
  const handleLikeDemo = async (demoId) => {
    try {
      const result = await updateDemoStats(demoId, 'likes', 1);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setAllDemos(prev =>
          prev.map(d => (d.id === demoId ? { ...d, likes: updatedDemo.likes } : d))
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo(prev => ({ ...prev, likes: updatedDemo.likes }));
        }
      }
    } catch (err) {
      console.error('Error liking demo:', err);
    }
  };

  // Update tags
  const handleUpdateTags = async (demoId, tags) => {
    try {
      const result = await updateDemoTags(demoId, tags);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setAllDemos(prev =>
          prev.map(d => (d.id === demoId ? { ...d, tags: updatedDemo.tags } : d))
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo(prev => ({ ...prev, tags: updatedDemo.tags }));
        }
        setIsTaggingModalOpen(false);
      }
    } catch (err) {
      console.error('Error updating tags:', err);
    }
  };

  // Update positions
  const handleUpdatePositions = async (demoId, positions) => {
    try {
      const result = await updateDemoPositions(demoId, positions);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setAllDemos(prev =>
          prev.map(d => (d.id === demoId ? { ...d, positions: updatedDemo.positions } : d))
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo(prev => ({ ...prev, positions: updatedDemo.positions }));
        }
      }
    } catch (err) {
      console.error('Error updating positions:', err);
    }
  };

  const handleSwitchDemoType = (type) => setDemoType(type);

  const handleResetFilters = () =>
    setFiltersApplied({ map: '', position: '', team: '', year: '', event: '', result: '' });
  const handleApplyFilters = () => setIsFilterModalOpen(false);

  const handleSelectRelatedDemo = (demo) => {
    setSelectedDemo(demo);
    setActiveVideoId(demo.videoId);
    findRelatedDemos(demo);
    updateDemoStats(demo.id, 'views', 1).catch(err =>
      console.error('Error updating views:', err)
    );
    window.scrollTo(0, 0);
  };

  // Loading state (before content)
  if (isLoading && !allDemos.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading player data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-white text-2xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Fullscreen player view
  if (isFullScreenPlayer && selectedDemo) {
    return (
      <>
        <VideoPlayerPage
          selectedDemo={selectedDemo}
          relatedDemos={relatedDemos}
          onClose={handleCloseVideoPlayer}
          onLike={handleLikeDemo}
          onOpenTagModal={() => setIsTaggingModalOpen(true)}
          onSelectRelatedDemo={handleSelectRelatedDemo}
          demoType={demoType}
          setDemoType={handleSwitchDemoType}
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        {isTaggingModalOpen && selectedDemo && (
          <TaggingModal
            selectedDemo={selectedDemo}
            filterOptions={filterOptions}
            onClose={() => setIsTaggingModalOpen(false)}
            onUpdateTags={handleUpdateTags}
            onUpdatePositions={handleUpdatePositions}
          />
        )}
      </>
    );
  }

  // Filtered UtilBook entries
  const filteredUtilBook = utilBookFilter
    ? utilBookItems.filter(item => item.map === utilBookFilter)
    : utilBookItems;

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200">
      {/* Semi-transparent background flag */}
      {player?.nationality && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none z-0"
          style={{
            backgroundImage: `url('https://countryflagsapi.com/png/${player.nationality.toLowerCase()}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      <Navbar
        demoType={demoType}
        onSwitchDemoType={handleSwitchDemoType}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      />

      {/* Clean Hero Banner */}
      <div className="h-36 md:h-48 lg:h-56 bg-gradient-to-r from-gray-800 to-black"></div>

      {/* Player Info Card (topmost) */}
      <div className="relative z-20 -mt-20 px-6">
        <div className="max-w-4xl mx-auto bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 flex flex-col lg:flex-row items-center lg:items-start gap-6">
          {/* Player image */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border-4 border-yellow-400/50 shadow-lg">
            {player?.image_url ? (
              <img
                src={player.image_url}
                alt={playerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-yellow-400 text-5xl font-bold">
                {playerName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Text info */}
          <div className="flex-1 text-center lg:text-left space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {playerName}
            </h1>
            <p className="text-gray-400 text-lg">{player.real_name}</p>

            {player.current_team?.name && (
              <div className="inline-flex items-center bg-gray-800/60 px-3 py-1 rounded-full text-yellow-400 text-sm font-medium">
                <Shield className="w-4 h-4 mr-2" />
                {player.current_team.name}
              </div>
            )}

            <div className="flex space-x-4 mt-3 justify-center lg:justify-start">
              {player.twitter && (
                <a
                  href={`https://twitter.com/${player.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              )}
              {player.twitch && (
                <a
                  href={`https://twitch.tv/${player.twitch}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-500"
                >
                  <Twitch className="w-6 h-6" />
                </a>
              )}
              {player.instagram && (
                <a
                  href={`https://instagram.com/${player.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {player.youtube_channel && (
                <a
                  href={`https://youtube.com/${player.youtube_channel}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500"
                >
                  <Youtube className="w-6 h-6" />
                </a>
              )}
              {player.vk_page && (
                <a
                  href={`https://vk.com/${player.vk_page}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500"
                >
                  <User className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Additional details and collapsible team history */}
        <div className="max-w-4xl mx-auto mt-6 bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            <div>
              <div className="text-gray-400 text-xs flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Favorite Map
              </div>
              <div className="text-white">{favoriteMap}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                Best Game Ever
              </div>
              <div className="text-white">{bestGame.title}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Birthday</div>
              <div className="text-white">{player.birth_date}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Nationality</div>
              <div className="text-white">{player.nationality}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Role</div>
              <div className="text-white">{player.role}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Status</div>
              <div className="text-white">{player.status}</div>
            </div>
            <div className="col-span-full">
              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-xs">Liquipedia</div>
                <button
                  onClick={() => setTeamHistoryOpen(!teamHistoryOpen)}
                  className="flex items-center text-gray-400 text-xs space-x-1 hover:text-yellow-400"
                >
                  <span>Team History</span>
                  {teamHistoryOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
              {teamHistoryOpen && (
                <ul className="mt-2 space-y-2">
                  {player.team_history.map((entry, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center bg-gray-800/60 rounded-md px-3 py-2"
                    >
                      <div>
                        <div className="text-gray-200">{entry.team_name}</div>
                        <div className="text-gray-500 text-xs">
                          {entry.start_date} – {entry.end_date}
                        </div>
                      </div>
                      <Shield className="w-5 h-5 text-yellow-400" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 bg-pattern relative z-10 space-y-16">
        {/* Utility Book Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            <span className="border-l-4 border-yellow-400 pl-3 py-1 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Utility Book
            </span>
          </h2>
          <div className="mb-4 flex items-center space-x-3">
            <label htmlFor="util-map-filter" className="text-gray-300 text-sm">
              Filter by Map:
            </label>
            <select
              id="util-map-filter"
              value={utilBookFilter}
              onChange={(e) => setUtilBookFilter(e.target.value)}
              className="bg-gray-800/60 backdrop-blur-sm text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-yellow-400"
            >
              <option value="">All Maps</option>
              {[...new Set(utilBookItems.map(item => item.map))].map((map) => (
                <option key={map} value={map}>
                  {map}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUtilBook.map((entry) => (
              <div
                key={entry.id}
                className="bg-gray-800/60 rounded-lg overflow-hidden"
              >
                <div className="p-3">
                  <h3 className="text-white font-medium">{entry.map}</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    {entry.description}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedDemo({
                        title: entry.description,
                        videoId: entry.videoId
                      });
                      setActiveVideoId(entry.videoId);
                      setIsFullScreenPlayer(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-700 text-white hover:border-yellow-400 transition"
                  >
                    <Video className="w-4 h-4" />
                    <span className="text-sm">Watch Utility</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Highlights / Clips */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            <span className="border-l-4 border-yellow-400 pl-3 py-1">
              Recent Highlights
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentClips.map((clip) => (
              <div
                key={clip.id}
                className="bg-gray-800/60 rounded-lg overflow-hidden"
              >
                <div className="relative w-full h-48 bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${clip.videoId}?rel=0&modestbranding=1`}
                    title={clip.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium">{clip.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending POVs */}
        {trendingDemos.length > 0 && (
          <CategorySectionFeatured
            title="Most Popular POVs"
            demos={trendingDemos}
            onSelectDemo={handleSelectDemo}
            gap={24}
          />
        )}

        {/* Demos by Map */}
        {Object.entries(demosByMap).map(([map, demos]) => {
          const len = demos.length;
          if (len <= 3) {
            return (
              <div className="mb-16" key={`map-featured-${map}`}>
                <CategorySectionFeatured
                  title={`${map} POVs`}
                  demos={demos}
                  onSelectDemo={handleSelectDemo}
                  gap={24}
                />
              </div>
            );
          } else if (len <= 5) {
            return (
              <div className="mb-16" key={`map-carousel-${map}`}>
                <CategoryCarousel
                  title={`${map} POVs`}
                  demos={demos}
                  onSelectDemo={handleSelectDemo}
                  gap={24}
                />
              </div>
            );
          } else {
            return (
              <div className="mb-16" key={`map-grid-${map}`}>
                <CategorySection
                  title={`${map} POVs`}
                  demos={demos}
                  onSelectDemo={handleSelectDemo}
                  minCardWidth={280}
                  gap={24}
                />
              </div>
            );
          }
        })}

        {/* Demos by Event */}
        {Object.entries(demosByEvent)
          .filter(([event]) => event)
          .map(([event, demos]) => {
            const len = demos.length;
            if (len <= 3) {
              return (
                <div className="mb-16" key={`event-featured-${event}`}>
                  <CategorySectionFeatured
                    title={event}
                    demos={demos}
                    onSelectDemo={handleSelectDemo}
                    gap={24}
                  />
                </div>
              );
            } else if (len <= 5) {
              return (
                <div className="mb-16" key={`event-carousel-${event}`}>
                  <CategoryCarousel
                    title={event}
                    demos={demos}
                    onSelectDemo={handleSelectDemo}
                    gap={24}
                  />
                </div>
              );
            } else {
              return (
                <div className="mb-16" key={`event-grid-${event}`}>
                  <CategorySection
                    title={event}
                    demos={demos}
                    onSelectDemo={handleSelectDemo}
                    minCardWidth={280}
                    gap={24}
                  />
                </div>
              );
            }
          })}

        {/* Demos by Year */}
        {Object.entries(demosByYear)
          .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
          .map(([year, demos]) => {
            const len = demos.length;
            if (len <= 3) {
              return (
                <div className="mb-16" key={`year-featured-${year}`}>
                  <CategorySectionFeatured
                    title={`${year} POVs`}
                    demos={demos}
                    onSelectDemo={handleSelectDemo}
                    gap={24}
                  />
                </div>
              );
            } else if (len <= 5) {
              return (
                <div className="mb-16" key={`year-carousel-${year}`}>
                  <CategoryCarousel
                    title={`${year} POVs`}
                    demos={demos}
                    onSelectDemo={handleSelectDemo}
                    gap={24}
                  />
                </div>
              );
            } else {
              return (
                <div className="mb-16" key={`year-grid-${year}`}>
                  <CategorySection
                    title={`${year} POVs`}
                    demos={demos}
                    onSelectDemo={handleSelectDemo}
                    minCardWidth={280}
                    gap={24}
                  />
                </div>
              );
            }
          })}

        {/* All POVs (grid with “View More”) */}
        <div className="mb-16">
          <CategorySection
            title="All POVs"
            demos={allDemos}
            onSelectDemo={handleSelectDemo}
            minCardWidth={280}
            gap={24}
          />
        </div>
      </main>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <FilterModal
          demoType={demoType}
          filterOptions={filterOptions}
          filtersApplied={filtersApplied}
          onClose={() => setIsFilterModalOpen(false)}
          onFilterChange={(changed) =>
            setFiltersApplied((prev) => ({ ...prev, ...changed }))
          }
          onResetFilters={handleResetFilters}
          onApplyFilters={handleApplyFilters}
        />
      )}

      <Footer />
    </div>
  );
};

export default PlayerPage;
