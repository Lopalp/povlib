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
  MapPin,
  Star,
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

// Hilfsfunktion, um Demos nach einer Eigenschaft zu gruppieren
const groupDemosByProperty = (demos, property) => {
  return demos.reduce((acc, demo) => {
    const key = demo[property] || 'Unknown';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(demo);
    return acc;
  }, {});
};

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

  // Neue States für Utility Book
  const [utilityFilters, setUtilityFilters] = useState({ map: '' });
  const [utilities, setUtilities] = useState([]);
  const [filteredUtilities, setFilteredUtilities] = useState([]);

  const infiniteScrollRef = useRef(null);

  // Mock-Daten für Spielerdetails (wird mit DB-Daten gemerged)
  const mockPlayerDetails = {
    real_name: 'Александр Нагорный',
    romanized_name: 'Aleksandr Nahornyj',
    birth_date: '2001-12-31',
    nationality: 'Belarus',
    status: 'Active',
    role: 'Support',
    current_team: { name: 'Nemiga Gaming', link: null },
    image_url: 'https://liquipedia.net/commons/images/0/00/1eeR_at_ESL_Pro_League_S21.jpg',
    twitter: '1eeR24',
    twitch: '1eer24',
    instagram: '1eer24',
    youtube_channel: 'channel/UCGeIRw5f-QzBGQejlhMGoBQ',
    vk_page: '1eeer24',
    page_title: '1eeR',
    liquipedia_url: 'https://liquipedia.net/counterstrike/1eeR',
    favorite_map: 'Dust II',
    best_game: {
      title: 'Championship Finals vs. Team X',
      videoId: 'dQw4w9WgXcQ'
    },
    team_history: [
      { start_date: '2020-08-05', end_date: '2020-09-19', team_name: 'Trial' },
      { start_date: '2020-09-19', end_date: '2021-08-30', team_name: 'Zorka' },
      { start_date: '2021-08-30', end_date: '2022-01-16', team_name: 'Nemiga Gaming' },
      { start_date: '2022-04-24', end_date: '2022-08-05', team_name: 'PLATOON Alpha' },
      { start_date: '2022-08-05', end_date: 'Present', team_name: 'Nemiga Gaming' }
    ],
  };

  // Beispieldaten für Utility Book (Mock)
  const mockUtilities = [
    { id: 1, map: 'Dust II', title: 'CT Mid Smoke', description: 'Block CT vision at mid.', videoId: 'AbCdEf123' },
    { id: 2, map: 'Inferno', title: 'Banana Flash', description: 'Flashbang for Banana push.', videoId: 'GhIjKl456' },
    { id: 3, map: 'Mirage', title: 'Connector Molotov', description: 'Molotov Conn to prevent push.', videoId: 'MnOpQr789' },
    { id: 4, map: 'Dust II', title: 'A Short Molotov', description: 'Molotov Short to deny plant.', videoId: 'StUvWx012' },
  ];

  // Lade Spieler- und Demo-Daten
  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        setIsLoading(true);

        // Filter-Optionen laden
        const options = await getFilterOptions();
        setFilterOptions(options);

        // Spieler-Info laden
        const playerData = await getPlayerInfo(playerName);
        if (!playerData) {
          setError('Player not found');
          setIsLoading(false);
          return;
        }

        // Mergen der Mock-Daten mit den DB-Daten, DB-Daten haben Vorrang
        const mergedPlayer = {
          ...mockPlayerDetails,
          ...playerData,
          current_team: (playerData.current_team || mockPlayerDetails.current_team)
        };
        setPlayer(mergedPlayer);

        // Utilities initial laden (Mock)
        setUtilities(mockUtilities);
        setFilteredUtilities(mockUtilities);

        // Erste Seite Demos laden
        const demosData = await getDemosByPlayer(playerName, demoType, 1, 12, filtersApplied);
        if (!demosData || demosData.length === 0) {
          setAllDemos([]);
          setHasMore(false);
          setIsLoading(false);
          return;
        }
        const mappedDemos = demosData.map(mapDemoData);
        setAllDemos(mappedDemos);

        // Demos gruppieren
        setDemosByMap(groupDemosByProperty(mappedDemos, 'map'));
        setDemosByEvent(groupDemosByProperty(mappedDemos, 'event'));
        setDemosByYear(groupDemosByProperty(mappedDemos, 'year'));

        // Trending-Demos nach Views sortieren (Top 5)
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

  // Mappt Rohdaten in das interne Demo-Format
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

  // Lädt weitere Demos (Infinite Scroll)
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

      // Aktualisiere Gruppen
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

  // IntersectionObserver für Infinite Scroll
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

  // Demo auswählen – öffnet den VideoPlayer
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

  // Verwandte Demos finden
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

  // VideoPlayer schließen
  const handleCloseVideoPlayer = () => {
    setSelectedDemo(null);
    setActiveVideoId('');
    setIsFullScreenPlayer(false);
    setRelatedDemos([]);
  };

  // Demo liken
  const handleLikeDemo = async (demoId) => {
    try {
      const result = await updateDemoStats(demoId, 'likes', 1);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setAllDemos(prev =>
          prev.map(d => d.id === demoId ? { ...d, likes: updatedDemo.likes } : d)
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, likes: updatedDemo.likes });
        }
      }
    } catch (err) {
      console.error('Error liking demo:', err);
    }
  };

  // Tags updaten
  const handleUpdateTags = async (demoId, tags) => {
    try {
      const result = await updateDemoTags(demoId, tags);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setAllDemos(prev =>
          prev.map(d => d.id === demoId ? { ...d, tags: updatedDemo.tags } : d)
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, tags: updatedDemo.tags });
        }
        setIsTaggingModalOpen(false);
      }
    } catch (err) {
      console.error('Error updating tags:', err);
    }
  };

  // Positionen updaten
  const handleUpdatePositions = async (demoId, positions) => {
    try {
      const result = await updateDemoPositions(demoId, positions);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setAllDemos(prev =>
          prev.map(d => d.id === demoId ? { ...d, positions: updatedDemo.positions } : d)
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, positions: updatedDemo.positions });
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

  // Utility Book: Filter anwenden
  const handleUtilityFilterChange = (e) => {
    const { value } = e.target;
    setUtilityFilters({ map: value });
  };

  useEffect(() => {
    if (utilityFilters.map) {
      setFilteredUtilities(utilities.filter(u => u.map === utilityFilters.map));
    } else {
      setFilteredUtilities(utilities);
    }
  }, [utilityFilters, utilities]);

  // Lade-Zustand (fullscreen, bevor Content geladen)
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

  // Fehler-Zustand
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

  // Fullscreen-Player anzeigen
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

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200 relative">
      {/* Hintergrundflagge halbtransparent */}
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

      {/* Hero Section mit Spieler-Infos */}
      <div className="relative w-full overflow-hidden bg-gray-900/70 group h-[60vh] max-h-[80vh]">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={player.image_url}
            alt={playerName}
            className="w-full h-full object-cover filter brightness-50"
          />
        </div>
        <div className="relative z-10 container mx-auto h-full flex items-center justify-center px-6">
          <div className="text-center max-w-xl space-y-4">
            <div className="relative w-32 h-32 mx-auto overflow-hidden rounded-full border-4 border-yellow-400/50 shadow-lg">
              {player.image_url ? (
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

            <h1 className="text-4xl md:text-5xl font-bold text-white">{playerName}</h1>
            <p className="text-gray-300 text-lg">{player.real_name}</p>

            {player.current_team?.name && (
              <div className="inline-flex items-center bg-gray-800/60 px-3 py-1 rounded-full text-yellow-400 text-sm font-medium">
                <Shield className="w-4 h-4 mr-2" />
                {player.current_team.name}
              </div>
            )}

            <div className="flex space-x-4 mt-4 justify-center">
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
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-900 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Informationen unterhalb des Hero */}
      <div className="relative z-20 -mt-20 px-6">
        <div className="max-w-4xl mx-auto bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 flex flex-col lg:flex-row items-center lg:items-start gap-6">
          {/* Left: already shown in hero, skip duplicate */}

          {/* Right: restliche Details */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
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
              <div>
                <div className="text-gray-400 text-xs">Favorite Map</div>
                <div className="flex items-center text-white">
                  <MapPin className="w-5 h-5 mr-1 text-yellow-400" />
                  {player.favorite_map}
                </div>
              </div>
              <div className="col-span-full">
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-xs">Liquipedia</div>
                  <button
                    onClick={() => setTeamHistoryOpen(!teamHistoryOpen)}
                    className="flex items-center text-gray-400 text-xs space-x-1 hover:text-yellow-400"
                  >
                    <span>Team History</span>
                    {teamHistoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
                {teamHistoryOpen && (
                  <ul className="mt-2 space-y-2">
                    {player.team_history.map((entry, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-gray-800/60 rounded-md px-3 py-2">
                        <div>
                          <div className="text-gray-200">{entry.team_name}</div>
                          <div className="text-gray-500 text-xs">
                            {entry.start_date} &ndash; {entry.end_date}
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

        {/* Utility Book Section */}
        <div className="max-w-4xl mx-auto mt-10 bg-gray-900/80 backdrop-blur-lg rounded-xl p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="w-6 h-6 text-yellow-400 mr-2" />
            <h2 className="text-xl font-bold text-white">Utility Book</h2>
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Filter by Map</label>
              <select
                value={utilityFilters.map}
                onChange={handleUtilityFilterChange}
                className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none"
              >
                <option value="">All Maps</option>
                {Array.from(new Set(utilities.map(u => u.map))).map((mapName) => (
                  <option key={mapName} value={mapName}>{mapName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredUtilities.map((util) => (
              <div key={util.id} className="bg-gray-800/60 p-4 rounded-lg flex flex-col">
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="text-white font-semibold">{util.map}</span>
                </div>
                <div className="text-white font-bold">{util.title}</div>
                <p className="text-gray-400 text-sm mb-3">{util.description}</p>
                <button
                  onClick={() => {
                    setSelectedDemo({
                      videoId: util.videoId,
                      title: util.title,
                      players: [],
                      map: util.map,
                      team: '',
                      event: '',
                      year: '',
                      positions: [],
                      tags: [],
                      views: 0,
                      likes: 0,
                      id: util.id
                    });
                    setActiveVideoId(util.videoId);
                    setIsFullScreenPlayer(true);
                  }}
                  className="mt-auto self-start flex items-center gap-2 px-4 py-2 rounded-md border border-gray-600 text-white hover:border-yellow-400 transition"
                >
                  <Play className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">View Utility</span>
                </button>
              </div>
            ))}
            {filteredUtilities.length === 0 && (
              <div className="col-span-full text-gray-400 text-center">
                No utilities match this filter.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 bg-pattern relative z-10">
        {/* == Best Game of All Time == */}
        {player?.best_game && (
          <section className="mb-16">
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-yellow-400 mr-2" />
              <h2 className="text-2xl font-bold text-white">Best Game of All Time</h2>
            </div>
            <div className="bg-gray-800/60 p-6 rounded-lg flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${player.best_game.videoId}?rel=0&modestbranding=1`}
                    title={player.best_game.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="md:ml-6 flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{player.best_game.title}</h3>
                <p className="text-gray-400">Relive this iconic performance. Watch the full POV demo to see how {playerName} dominated the match.</p>
                <button
                  onClick={() => {
                    setSelectedDemo({
                      videoId: player.best_game.videoId,
                      title: player.best_game.title,
                      players: [],
                      map: '',
                      team: '',
                      event: '',
                      year: '',
                      positions: [],
                      tags: [],
                      views: 0,
                      likes: 0,
                      id: 'best-game'
                    });
                    setActiveVideoId(player.best_game.videoId);
                    setIsFullScreenPlayer(true);
                  }}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-md border-2 border-yellow-400 text-yellow-400 font-semibold hover:bg-yellow-400 hover:text-black transition"
                >
                  Watch Full Demo
                </button>
              </div>
            </div>
          </section>
        )}

        {/* == Most Popular POVs (Trending) == */}
        {trendingDemos.length > 0 && (
          <CategorySectionFeatured
            title="Most Popular POVs"
            demos={trendingDemos}
            onSelectDemo={handleSelectDemo}
            gap={24}
          />
        )}

        {/* == Demos by Map == */}
        {Object.entries(demosByMap).map(([map, demos]) => {
          const len = demos.length;
          if (len <= 3) {
            return (
              <div className="mb-16" key={`map-featured-${map}`}>
                <CategorySectionFeatured
                  title={`${map} Demos`}
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
                  title={`${map} Demos`}
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
                  title={`${map} Demos`}
                  demos={demos}
                  onSelectDemo={handleSelectDemo}
                  minCardWidth={280}
                  gap={24}
                />
              </div>
            );
          }
        })}

        {/* == Demos by Event == */}
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

        {/* == Demos by Year == */}
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

        {/* == All POVs == */}
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
