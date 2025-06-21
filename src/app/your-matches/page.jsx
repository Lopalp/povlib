"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Trash2, Search, Download, MoreVertical, Target, TrendingUp, Award, Calendar, Play, ExternalLink } from 'lucide-react';

// ============================================================================
// KOMPONENTE: Sidebar im YouTube-Stil für Matches
// ============================================================================
const MatchesSidebar = ({ remainingTokens, onClear }) => {
  return (
    <aside className="w-full lg:w-1/4 xl:w-1/5 p-4 lg:p-0 lg:pr-8">
      <div className="bg-gray-800/50 rounded-xl p-4 sticky top-24">
        <h2 className="text-lg font-bold mb-4">Deine Matches</h2>
        
        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder="Matches durchsuchen"
            className="w-full bg-gray-900 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>

        {/* Token Display */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
          <div className="text-yellow-400 font-semibold text-sm">
            {remainingTokens} Tokens verfügbar
          </div>
        </div>

        {/* Connection Buttons */}
        <div className="space-y-2 mb-4">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <ExternalLink size={16} />
            <span>Steam verbinden</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
            <ExternalLink size={16} />
            <span>Faceit verbinden</span>
          </button>
        </div>
        
        <div className="space-y-2">
          <button 
            onClick={onClear}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
            <span>Alle Matches löschen</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
            <Download size={20} />
            <span>Matches exportieren</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

// ============================================================================
// KOMPONENTE: Horizontale Match-Karte im YouTube-Listen-Stil
// ============================================================================
const MatchCard = ({ match, onSelectMatch, onGenerateVideo }) => {
  const handleClick = () => onSelectMatch(match);

  const getKDColor = (kd) => {
    if (kd >= 1.5) return 'text-green-400';
    if (kd >= 1.0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRatingColor = (rating) => {
    if (rating >= 1.2) return 'text-green-400';
    if (rating >= 1.0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getResultColor = (result) => {
    return result === 'win' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="group flex gap-4 cursor-pointer items-start" onClick={handleClick}>
      {/* Thumbnail */}
      <div className="w-48 flex-shrink-0 relative">
        <img
          src={match.thumbnail || '/img/v2.png'}
          alt={match.map}
          className="w-full aspect-video object-cover rounded-lg"
        />
        
        {/* Platform Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded ${
          match.platform === 'Pro' 
            ? 'bg-purple-900/80 text-purple-300' 
            : match.platform === 'Faceit'
            ? 'bg-orange-900/80 text-orange-300'
            : 'bg-blue-900/80 text-blue-300'
        }`}>
          {match.platform}
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
          {match.duration}
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
      </div>

      {/* Match Details */}
      <div className="flex-1 pt-1 relative">
        <h3 className="text-white text-base font-medium leading-snug mb-1">
          {match.map} - {match.score}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span className={getResultColor(match.result)}>{match.result.toUpperCase()}</span>
          <span>•</span>
          <span>{match.date}</span>
          <span>•</span>
          <span>{match.platform}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm mb-2">
          <span className="text-gray-400">
            K/D: <span className={getKDColor(match.kd)}>{match.kd}</span>
          </span>
          <span className="text-gray-400">
            Rating: <span className={getRatingColor(match.hltvRating)}>{match.hltvRating}</span>
          </span>
          <span className="text-gray-400">
            ADR: <span className="text-gray-300">{match.adr}</span>
          </span>
        </div>

        {/* KDA */}
        <p className="text-gray-400 text-sm">
          {match.kills}/{match.deaths}/{match.assists} - {match.duration}
        </p>

        {/* Generate Video Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onGenerateVideo(match.id);
          }}
          className="mt-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-medium rounded-lg transition-colors"
        >
          Video generieren
        </button>

        <button className="absolute top-0 right-0 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-700 transition-opacity">
          <MoreVertical size={20} className="text-gray-300" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// HAUPTKOMPONENTE: YourMatchesPage
// ============================================================================
const YourMatchesPage = () => {
  const [groupedMatches, setGroupedMatches] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [remainingTokens] = useState(142);
  const router = useRouter();

  // Demo-Daten
  const demoMatches = [
    {
      id: 1,
      map: 'Mirage',
      date: '2023-10-26',
      platform: 'Faceit',
      kills: 25,
      deaths: 18,
      assists: 12,
      kd: 1.39,
      adr: 82.4,
      hltvRating: 1.25,
      thumbnail: '/img/1.png',
      duration: '32:45',
      score: '16-14',
      result: 'win'
    },
    {
      id: 2,
      map: 'Inferno',
      date: '2023-10-25',
      platform: 'Premier',
      kills: 19,
      deaths: 21,
      assists: 8,
      kd: 0.90,
      adr: 71.2,
      hltvRating: 0.98,
      thumbnail: '/img/2.png',
      duration: '28:33',
      score: '13-16',
      result: 'loss'
    },
    {
      id: 3,
      map: 'Dust2',
      date: '2023-10-24',
      platform: 'Pro League',
      kills: 32,
      deaths: 15,
      assists: 9,
      kd: 2.13,
      adr: 95.8,
      hltvRating: 1.55,
      thumbnail: '/img/3.png',
      duration: '41:12',
      score: '16-8',
      result: 'win'
    },
    {
      id: 4,
      map: 'Nuke',
      date: '2023-10-23',
      platform: 'Faceit',
      kills: 14,
      deaths: 22,
      assists: 6,
      kd: 0.64,
      adr: 58.9,
      hltvRating: 0.78,
      thumbnail: '/img/4.png',
      duration: '24:18',
      score: '10-16',
      result: 'loss'
    },
    {
      id: 5,
      map: 'Ancient',
      date: '2023-10-22',
      platform: 'ESEA',
      kills: 28,
      deaths: 19,
      assists: 11,
      kd: 1.47,
      adr: 87.3,
      hltvRating: 1.32,
      thumbnail: '/img/5.png',
      duration: '36:27',
      score: '16-11',
      result: 'win'
    },
    {
      id: 6,
      map: 'Vertigo',
      date: '2023-10-21',
      platform: 'Faceit',
      kills: 21,
      deaths: 16,
      assists: 14,
      kd: 1.31,
      adr: 79.6,
      hltvRating: 1.18,
      thumbnail: '/img/6.png',
      duration: '29:54',
      score: '16-12',
      result: 'win'
    }
  ];

  useEffect(() => {
    const loadMatchData = async () => {
      setIsLoading(true);

      // Gruppierung nach Datum
      const today = new Date();
      const matchesWithDate = demoMatches.map((match, index) => {
        const matchDate = new Date(match.date);
        return { ...match, playedAt: matchDate };
      });

      const grouped = matchesWithDate.reduce((acc, match) => {
        const date = new Intl.DateTimeFormat('de-DE', { dateStyle: 'full' }).format(match.playedAt);
        const todayStr = new Intl.DateTimeFormat('de-DE', { dateStyle: 'full' }).format(new Date());
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = new Intl.DateTimeFormat('de-DE', { dateStyle: 'full' }).format(yesterday);
        
        let displayDate = date;
        if (date === todayStr) displayDate = 'Heute';
        if (date === yesterdayStr) displayDate = 'Gestern';

        if (!acc[displayDate]) {
          acc[displayDate] = [];
        }
        acc[displayDate].push(match);
        return acc;
      }, {});
      
      setGroupedMatches(grouped);
      setIsLoading(false);
    };

    loadMatchData();
  }, []);

  const onSelectMatch = (match) => {
    router.push(`/demos/${match.id}`);
  };

  const onGenerateVideo = (matchId) => {
    alert(`Video wird für Match ${matchId} generiert`);
  };

  const handleClearMatches = () => {
    setGroupedMatches({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Linke Sidebar */}
          <MatchesSidebar remainingTokens={remainingTokens} onClear={handleClearMatches} />

          {/* Rechter Hauptinhalt */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-6 hidden lg:block">Deine Matches</h1>

            {Object.keys(groupedMatches).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedMatches).map(([date, matches]) => (
                  <section key={date}>
                    <h2 className="text-xl font-bold text-white mb-4">{date}</h2>
                    <div className="space-y-5">
                      {matches.map(match => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onSelectMatch={onSelectMatch}
                          onGenerateVideo={onGenerateVideo}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              // Leerzustand
              <div className="text-center py-20 flex flex-col items-center">
                <Target size={64} className="text-gray-600 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-300">Noch keine Matches gefunden.</h2>
                <p className="text-gray-500 mt-2 max-w-md">Verbinde deine Steam- oder Faceit-Accounts, um deine Matches automatisch zu importieren.</p>
                <div className="mt-6 flex gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full transition-colors">
                    Steam verbinden
                  </button>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-5 rounded-full transition-colors">
                    Faceit verbinden
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default YourMatchesPage;