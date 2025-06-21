// src/app/your-matches/page.jsx
"use client";

import React, { useState, useMemo } from 'react';
import { Play, MoreVertical, Calendar, TrendingUp, Target, Award, Download, ExternalLink } from 'lucide-react';

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

const YourMatchesPage = () => {
  const [remainingTokens] = useState(142);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const stats = {
    totalMatches: demoMatches.length,
    avgKD: (demoMatches.reduce((acc, match) => acc + match.kd, 0) / demoMatches.length).toFixed(2),
    avgRating: (demoMatches.reduce((acc, match) => acc + match.hltvRating, 0) / demoMatches.length).toFixed(2),
    winRate: Math.round((demoMatches.filter(m => m.result === 'win').length / demoMatches.length) * 100)
  };

  const filteredMatches = useMemo(() => {
    switch(activeFilter) {
      case 'wins': return demoMatches.filter(m => m.result === 'win');
      case 'losses': return demoMatches.filter(m => m.result === 'loss');
      case 'recent': return demoMatches.slice(0, 3);
      default: return demoMatches;
    }
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Your Matches</h1>
              <p className="text-gray-400">Analyze your performance and generate highlight videos</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                  Connect Steam
                </button>
                <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-medium transition-colors">
                  Connect Faceit
                </button>
              </div>
              
              <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <span className="text-yellow-400 font-medium">{remainingTokens} tokens remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Matches</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalMatches}</div>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-sm">Avg K/D</span>
            </div>
            <div className="text-2xl font-bold">{stats.avgKD}</div>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400 text-sm">Avg Rating</span>
            </div>
            <div className="text-2xl font-bold">{stats.avgRating}</div>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400 text-sm">Win Rate</span>
            </div>
            <div className="text-2xl font-bold">{stats.winRate}%</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'all', label: 'All Matches' },
            { id: 'wins', label: 'Wins' },
            { id: 'losses', label: 'Losses' },
            { id: 'recent', label: 'Recent' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Matches List */}
        <div className="space-y-3">
          {filteredMatches.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
};

function MatchRow({ match }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleGenerateVideo = (e) => {
    e.stopPropagation();
    alert(`Generating video for ${match.map} match`);
  };

  const getResultColor = (result) => {
    return result === 'win' ? 'text-green-400' : 'text-red-400';
  };

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

  return (
    <div className="bg-gray-900/30 border border-gray-800 rounded-lg overflow-hidden hover:bg-gray-900/50 transition-colors">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          <div className="relative w-24 h-14 flex-shrink-0">
            <img 
              src={match.thumbnail} 
              alt={match.map}
              className="w-full h-full object-cover rounded"
            />
            <div className="absolute inset-0 bg-black/20 rounded flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Play className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Match Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-white">{match.map}</h3>
              <span className={`text-sm font-medium ${getResultColor(match.result)}`}>
                {match.result.toUpperCase()}
              </span>
              <span className="text-gray-400 text-sm">{match.score}</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{match.platform}</span>
              <span>•</span>
              <span>{match.date}</span>
              <span>•</span>
              <span>{match.duration}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className={`font-semibold ${getKDColor(match.kd)}`}>{match.kd}</div>
              <div className="text-gray-500 text-xs">K/D</div>
            </div>
            
            <div className="text-center">
              <div className={`font-semibold ${getRatingColor(match.hltvRating)}`}>{match.hltvRating}</div>
              <div className="text-gray-500 text-xs">Rating</div>
            </div>
            
            <div className="text-center">
              <div className="font-semibold text-gray-300">{match.adr}</div>
              <div className="text-gray-500 text-xs">ADR</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateVideo}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-medium rounded-lg transition-colors"
            >
              Generate Video
            </button>
            
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-800 p-4 bg-gray-900/20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-400">{match.kills}</div>
              <div className="text-xs text-gray-500">Kills</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-red-400">{match.deaths}</div>
              <div className="text-xs text-gray-500">Deaths</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-400">{match.assists}</div>
              <div className="text-xs text-gray-500">Assists</div>
            </div>
            
            <div className="text-center">
              <div className={`text-lg font-semibold ${getKDColor(match.kd)}`}>{match.kd}</div>
              <div className="text-xs text-gray-500">K/D Ratio</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-300">{match.adr}</div>
              <div className="text-xs text-gray-500">ADR</div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors flex items-center gap-1">
              <Play className="w-3 h-3" />
              Watch Demo
            </button>
            
            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors flex items-center gap-1">
              <Download className="w-3 h-3" />
              Download
            </button>
            
            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default YourMatchesPage;