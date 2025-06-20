// src/app/your-matches/page.jsx
"use client";

import React from 'react';
import SectionHeading from '../../components/headings/SectionHeading';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import BodyText from '../../components/typography/BodyText';

const demoMatches = [
  {
    id: 1,
    map: 'Mirage',
    date: '2023-10-26',
    platform: 'Faceit',
    kills: 25,
    deaths: 18,
    kd: '1.39',
    hltvRating: '1.25',
  },
  {
    id: 2,
    map: 'Inferno',
    date: '2023-10-25',
    platform: 'Premiere',
    kills: 19,
    deaths: 21,
    kd: '0.90',
    hltvRating: '0.98',
  },
  {
    id: 3,
    map: 'Dust 2',
    date: '2023-10-24',
    platform: 'Pro',
    kills: 32,
    deaths: 15,
    kd: '2.13',
    hltvRating: '1.55',
  },
  {
    id: 4,
    map: 'Nuke',
    date: '2023-10-23',
    platform: 'Faceit',
    kills: 14,
    deaths: 22,
    kd: '0.64',
    hltvRating: '0.78',
  },
];

const YourMatchesPage = () => {
  const remainingTokens = 10; // Placeholder for remaining tokens

  const getKDColor = (kd) => {
    const kdValue = parseFloat(kd);
    if (kdValue >= 1.5) return 'text-emerald-400';
    if (kdValue >= 1.0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRatingColor = (rating) => {
    const ratingValue = parseFloat(rating);
    if (ratingValue >= 1.2) return 'text-emerald-400';
    if (ratingValue >= 1.0) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-gray-300">
      {/* Header Section mit mehr Platz oben */}
      <div className="pt-16 pb-8 px-8">
        <div className="container mx-auto">
          <div className="mb-12">
            <SectionHeading title="Your Matches" />
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-4"></div>
          </div>

          {/* Control Panel */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-6 py-3 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                  Connect Steam
                </span>
              </button>
              <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 px-6 py-3 rounded-xl font-semibold text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                  Connect Faceit
                </span>
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl px-6 py-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-bold text-yellow-400">
                  Remaining Tokens: {remainingTokens}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Table */}
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600">
                    <th scope="col" className="px-6 py-5 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">
                      Map
                    </th>
                    <th scope="col" className="px-6 py-5 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">
                      Datum
                    </th>
                    <th scope="col" className="px-6 py-5 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">
                      Plattform
                    </th>
                    <th scope="col" className="px-6 py-5 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">
                      Kills
                    </th>
                    <th scope="col" className="px-6 py-5 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">
                      Deaths
                    </th>
                    <th scope="col" className="px-6 py-5 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">
                      K/D
                    </th>
                    <th scope="col" className="px-6 py-5 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">
                      HLTV Rating
                    </th>
                    <th scope="col" className="relative px-6 py-5">
                      <span className="sr-only">Generate Video</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {demoMatches.map((match, index) => (
                    <tr 
                      key={match.id} 
                      className="hover:bg-gray-700/30 transition-all duration-300 group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 group-hover:bg-blue-400 transition-colors"></div>
                          <span className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                            {match.map}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {match.date}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          match.platform === 'Pro' 
                            ? 'bg-purple-900/50 text-purple-300 border border-purple-600/30' 
                            : match.platform === 'Faceit'
                            ? 'bg-orange-900/50 text-orange-300 border border-orange-600/30'
                            : 'bg-blue-900/50 text-blue-300 border border-blue-600/30'
                        }`}>
                          {match.platform}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-emerald-400">
                        {match.kills}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-red-400">
                        {match.deaths}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-bold">
                        <span className={getKDColor(match.kd)}>
                          {match.kd}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-bold">
                        <span className={getRatingColor(match.hltvRating)}>
                          {match.hltvRating}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <button 
                          onClick={() => alert(`Generate video for match ${match.id}`)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-4 py-2 rounded-lg font-semibold text-white text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 group-hover:scale-110"
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                            </svg>
                            Generate Video
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats Footer */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 backdrop-blur-sm border border-blue-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Total Matches</p>
                  <p className="text-2xl font-bold text-white">{demoMatches.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 backdrop-blur-sm border border-emerald-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-300 text-sm font-medium">Avg K/D</p>
                  <p className="text-2xl font-bold text-white">
                    {(demoMatches.reduce((acc, match) => acc + parseFloat(match.kd), 0) / demoMatches.length).toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 backdrop-blur-sm border border-purple-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Avg Rating</p>
                  <p className="text-2xl font-bold text-white">
                    {(demoMatches.reduce((acc, match) => acc + parseFloat(match.hltvRating), 0) / demoMatches.length).toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourMatchesPage;