// src/app/your-matches/page.jsx
"use client";

import React, { useState, useMemo } from 'react';
import { MoreVertical, Play, Calendar, Target, TrendingUp, Award, Download } from 'lucide-react';

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
    mapImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=800&fit=crop',
    thumbnail: '/img/1.png',
    duration: '32:45',
    views: 1247,
    tags: ['Ace', 'Clutch', 'Pro Match', 'Highlights']
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
    mapImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=800&fit=crop',
    thumbnail: '/img/2.png',
    duration: '28:33',
    views: 892,
    tags: ['Retake', 'Team Play', 'Strategy']
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
    mapImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop',
    thumbnail: '/img/3.png',
    duration: '41:12',
    views: 2156,
    tags: ['MVP', 'Tournament', 'Epic', 'Best of 2024']
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
    mapImage: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=800&fit=crop',
    thumbnail: '/img/4.png',
    duration: '24:18',
    views: 445,
    tags: ['Learning', 'Comeback Attempt', 'Analysis']
  },
  {
    id: 5,
    map: 'Ancient',
    date: '2023-10-22',
    platform: 'ESEA',
    kills: 28,
    deaths: 19,
    assists: 11,
    kd: '1.47',
    hltvRating: '1.32',
    mapImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=800&fit=crop',
    thumbnail: '/img/5.png',
    duration: '36:27',
    views: 1683,
    tags: ['Clutch Master', '1v3', 'Insane Shots']
  },
  {
    id: 6,
    map: 'Vertigo',
    date: '2023-10-21',
    platform: 'Faceit',
    kills: 21,
    deaths: 16,
    assists: 14,
    kd: '1.31',
    hltvRating: '1.18',
    mapImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=800&fit=crop',
    thumbnail: '/img/6.png',
    duration: '29:54',
    views: 967,
    tags: ['Support Play', 'Team Win', 'Solid Performance']
  }
];

const filterTags = ['All Matches', 'Pro Matches', 'Recent', 'Best Performance', 'Aces', 'Clutches', 'Highlights', 'Analysis', 'Tournament'];

const YourMatchesPage = () => {
  const [selectedMatch, setSelectedMatch] = useState(demoMatches[0]);
  const [activeTag, setActiveTag] = useState('All Matches');
  const [remainingTokens] = useState(10);
  const [videoModal, setVideoModal] = useState({ isOpen: false, video: null });

  // Filter matches based on active tag
  const filteredMatches = useMemo(() => {
    if (activeTag === 'All Matches') return demoMatches;
    if (activeTag === 'Pro Matches') return demoMatches.filter(match => match.platform === 'Pro');
    if (activeTag === 'Recent') return demoMatches.slice(0, 3);
    if (activeTag === 'Best Performance') return demoMatches.filter(match => parseFloat(match.hltvRating) >= 1.2);
    return demoMatches.filter(match => match.tags.some(tag => tag.toLowerCase().includes(activeTag.toLowerCase())));
  }, [activeTag]);

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

  const handleVideoMenuClick = (match, event) => {
    event.stopPropagation();
    setVideoModal({ isOpen: true, video: match });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, video: null });
  };

  const handleGenerateVideo = (matchId) => {
    alert(`Generating video for match ${matchId}`);
  };

  return (
    <main>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Featured Hero for Selected Match */}
        <div 
          className="relative h-96 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${selectedMatch.mapImage})`
          }}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-2xl">
                <div className="text-gray-300 text-lg font-medium mb-2">YOUR LATEST MATCH</div>
                <div className="text-6xl font-bold text-brand-yellow mb-4">{selectedMatch.map.toUpperCase()}</div>
                <div className="text-2xl font-medium text-gray-300 mb-8">K / D / A</div>
                
                <div className="flex gap-4 mb-8">
                  <button className="bg-brand-yellow hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Watch Full POV
                  </button>
                  <button 
                    onClick={() => handleGenerateVideo(selectedMatch.id)}
                    className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Generate Video
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
                    <div className={`text-3xl font-bold ${getKDColor(selectedMatch.kd)}`}>{selectedMatch.kd}</div>
                    <div className="text-gray-400 text-sm">K/D</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getRatingColor(selectedMatch.hltvRating)}`}>{selectedMatch.hltvRating}</div>
                    <div className="text-gray-400 text-sm">RATING</div>
                  </div>
                </div>
              </div>

              {/* Tokens Counter & Connection Buttons */}
              <div className="absolute top-8 right-8 space-y-4">
                <div className="bg-black/50 border border-brand-yellow rounded-lg px-4 py-2 text-center">
                  <div className="text-brand-yellow font-semibold">Remaining Tokens: {remainingTokens}</div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                    Connect Steam
                  </button>
                  <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                    Connect Faceit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tag Bar */}
        <div className="bg-gray-950 border-b border-gray-800">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                    activeTag === tag
                      ? 'bg-brand-yellow text-gray-900 hover:bg-brand-yellow'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-6 py-6 sm:py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{demoMatches.length}</div>
                  <div className="text-gray-400 text-sm">Total Matches</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {(demoMatches.reduce((acc, match) => acc + parseFloat(match.kd), 0) / demoMatches.length).toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-sm">Avg K/D</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {(demoMatches.reduce((acc, match) => acc + parseFloat(match.hltvRating), 0) / demoMatches.length).toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-sm">Avg Rating</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {demoMatches.filter(match => match.platform === 'Pro').length}
                  </div>
                  <div className="text-gray-400 text-sm">Pro Matches</div>
                </div>
              </div>
            </div>
          </div>

          {/* Matches Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-5 lg:gap-y-10">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onSelect={setSelectedMatch}
                onMenuClick={handleVideoMenuClick}
                onGenerateVideo={handleGenerateVideo}
                isSelected={selectedMatch.id === match.id}
              />
            ))}
          </div>
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
};

// Match Card Component
function MatchCard({ match, onSelect, onMenuClick, onGenerateVideo, isSelected }) {
  const handleClick = () => onSelect(match);

  const getKDColor = (kd) => {
    const kdValue = parseFloat(kd);
    if (kdValue >= 1.5) return 'text-emerald-400';
    if (kdValue >= 1.0) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`group cursor-pointer transition-all duration-300 ${isSelected ? 'ring-2 ring-brand-yellow' : ''}`}>
      <div className="space-y-3">
        {/* Thumbnail */}
        <div className="relative w-full" onClick={handleClick}>
          <img 
            src={match.thumbnail} 
            alt={match.map} 
            className="w-full aspect-video object-cover rounded-xl" 
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
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 min-w-0" onClick={handleClick}>
              <h3 className="text-white text-sm font-medium leading-5 mb-2 group-hover:text-gray-200 transition-colors">
                {match.map} - {match.date}
              </h3>
              
              {/* Stats Row */}
              <div className="flex justify-between text-xs mb-2">
                <div className="text-center">
                  <div className="text-green-400 font-bold">{match.kills}</div>
                  <div className="text-gray-500">K</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-bold">{match.deaths}</div>
                  <div className="text-gray-500">D</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold">{match.assists}</div>
                  <div className="text-gray-500">A</div>
                </div>
                <div className="text-center">
                  <div className={`font-bold ${getKDColor(match.kd)}`}>{match.kd}</div>
                  <div className="text-gray-500">K/D</div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <span>{match.views} views</span>
                <span>•</span>
                <span>Rating: <span className={getKDColor(match.hltvRating)}>{match.hltvRating}</span></span>
              </div>
            </div>
            
            {/* Three Dots Menu */}
            <button 
              className="p-1 hover:bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              onClick={(e) => onMenuClick(match, e)}
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Generate Video Button */}
          <button 
            onClick={() => onGenerateVideo(match.id)}
            className="w-full bg-brand-yellow hover:bg-yellow-500 text-black py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            Generate Video
          </button>
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
    { icon: "❌", label: "Don't recommend" },
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

export default YourMatchesPage;