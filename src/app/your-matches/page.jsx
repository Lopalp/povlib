// src/app/your-matches/page.jsx
"use client";

import React, { useState } from 'react';

const demoMatches = [
  {
    id: 1,
    map: 'Mirage',
    date: '2023-10-26',
    platform: 'Faceit',
    kills: 25,
    deaths: 18,
    assists: 12,
    kd: '1.39',
    hltvRating: '1.25',
    mapImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=800&fit=crop'
  },
  {
    id: 2,
    map: 'Inferno',
    date: '2023-10-25',
    platform: 'Premiere',
    kills: 19,
    deaths: 21,
    assists: 8,
    kd: '0.90',
    hltvRating: '0.98',
    mapImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=800&fit=crop'
  },
  {
    id: 3,
    map: 'Dust 2',
    date: '2023-10-24',
    platform: 'Pro',
    kills: 32,
    deaths: 15,
    assists: 9,
    kd: '2.13',
    hltvRating: '1.55',
    mapImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop'
  },
  {
    id: 4,
    map: 'Nuke',
    date: '2023-10-23',
    platform: 'Faceit',
    kills: 14,
    deaths: 22,
    assists: 6,
    kd: '0.64',
    hltvRating: '0.78',
    mapImage: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=800&fit=crop'
  },
];

const tournaments = [
  'BLAST Rivals 2025 Season 1',
  'BetBoom LanDaLan 2', 
  'ESL Pro League',
  'IEM Cologne',
  'FACEIT Major',
  'Nuke',
  'karrigan',
  'paiN',
  'NiKo'
];

const YourMatchesPage = () => {
  const [selectedMatch, setSelectedMatch] = useState(demoMatches[0]);
  const [remainingTokens] = useState(10);

  const sidebarItems = [
    { icon: '🏠', label: 'Home', active: false },
    { icon: '🎮', label: 'Demos', active: false },
    { icon: '👥', label: 'Players', active: false },
    { icon: '🗺️', label: 'Maps', active: false },
    { icon: '📚', label: 'Utility Book', active: false },
    { icon: '🎯', label: 'Your Matches', active: true },
    { icon: '🎬', label: 'Your Demos', active: false },
    { icon: '📊', label: 'History', active: false },
    { icon: '⏰', label: 'Watch Later', active: false },
    { icon: '✂️', label: 'Your Clips', active: false },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
              <span className="text-black font-bold text-sm">D</span>
            </div>
            <span className="text-xl font-bold">
              <span className="text-yellow-500">DEMO</span>lib.gg
            </span>
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className="p-4 border-b border-gray-800">
          <div className="bg-yellow-600 hover:bg-yellow-500 transition-colors rounded-lg p-3 text-center cursor-pointer">
            <div className="text-sm font-semibold text-black">Upgrade to Pro for</div>
            <div className="text-lg font-bold text-black">$6.99/mo</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`px-6 py-3 mx-2 rounded-lg cursor-pointer transition-colors ${
                item.active 
                  ? 'bg-gray-800 text-yellow-500 border-r-2 border-yellow-500' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <div className="text-sm text-gray-400 cursor-pointer hover:text-white">About</div>
          <div className="text-sm text-gray-400 cursor-pointer hover:text-white">Contact</div>
          <div className="text-sm text-gray-400 cursor-pointer hover:text-white">FAQ</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search demos, players, teams, utilities..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  🔍
                </div>
              </div>
            </div>
            <button className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition-colors">
              Sign In
            </button>
          </div>
        </div>

        {/* Hero Section with Map Background */}
        <div 
          className="relative h-96 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${selectedMatch.mapImage})`
          }}
        >
          <div className="absolute inset-0 flex items-center px-8">
            <div className="max-w-2xl">
              <div className="text-gray-300 text-lg font-medium mb-2">YOUR LATEST MATCH</div>
              <div className="text-6xl font-bold text-yellow-500 mb-4">{selectedMatch.map.toUpperCase()}</div>
              <div className="text-2xl font-medium text-gray-300 mb-8">K / D / A</div>
              
              <div className="flex gap-4 mb-8">
                <button className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  ▶️ Watch Full POV
                </button>
                <button className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  🔽 Filter POVs
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{selectedMatch.kills}</div>
                  <div className="text-gray-400 text-sm">KILLS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">{selectedMatch.deaths}</div>
                  <div className="text-gray-400 text-sm">DEATHS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{selectedMatch.assists}</div>
                  <div className="text-gray-400 text-sm">ASSISTS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{selectedMatch.kd}</div>
                  <div className="text-gray-400 text-sm">K/D</div>
                </div>
              </div>
            </div>

            {/* Tokens Counter */}
            <div className="absolute top-8 right-8 bg-black bg-opacity-50 border border-yellow-500 rounded-lg px-4 py-2">
              <div className="text-yellow-500 font-semibold">Remaining Tokens: {remainingTokens}</div>
            </div>
          </div>
        </div>

        {/* Tournament/Platform Tags */}
        <div className="px-8 py-6 border-b border-gray-800">
          <div className="flex flex-wrap gap-3">
            {tournaments.map((tournament, index) => (
              <span
                key={index}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors border border-gray-700 hover:border-gray-600"
              >
                {tournament}
              </span>
            ))}
          </div>
        </div>

        {/* Connection Buttons */}
        <div className="px-8 py-6 border-b border-gray-800">
          <div className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              🎮 Connect Steam
            </button>
            <button className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              🎯 Connect Faceit
            </button>
          </div>
        </div>

        {/* Match List */}
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold mb-6">All Your Matches</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {demoMatches.map((match) => (
              <div
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all hover:bg-gray-700 border-2 ${
                  selectedMatch.id === match.id ? 'border-yellow-500' : 'border-transparent'
                }`}
              >
                <div 
                  className="h-40 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${match.mapImage})`
                  }}
                >
                  <div className="h-full flex items-end p-4">
                    <div>
                      <div className="text-2xl font-bold text-white">{match.map}</div>
                      <div className="text-gray-300 text-sm">{match.date}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      match.platform === 'Pro' 
                        ? 'bg-purple-900 text-purple-300' 
                        : match.platform === 'Faceit'
                        ? 'bg-orange-900 text-orange-300'
                        : 'bg-blue-900 text-blue-300'
                    }`}>
                      {match.platform}
                    </span>
                    <div className="text-yellow-400 font-semibold">{match.hltvRating}</div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="text-center">
                      <div className="text-green-400 font-bold">{match.kills}</div>
                      <div className="text-gray-400">K</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-400 font-bold">{match.deaths}</div>
                      <div className="text-gray-400">D</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{match.assists}</div>
                      <div className="text-gray-400">A</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold">{match.kd}</div>
                      <div className="text-gray-400">K/D</div>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-500 text-black py-2 rounded font-semibold transition-colors">
                    Generate Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourMatchesPage;