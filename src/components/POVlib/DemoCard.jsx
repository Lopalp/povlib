import React from 'react';
import Link from 'next/link';
import { Play, Shield, Tag as TagIcon, Calendar, MapPin } from 'lucide-react';

const DemoCard = ({ demo, featured = false, onSelect, className = "" }) => {
  // Handle clicking on player links without triggering card selection
  const handlePlayerClick = (e) => {
    e.stopPropagation();
  };
  
  // Calculate ratio of CT vs T side rounds
  // Demo data might not include this yet, so we'll simulate it for now
  // In a real implementation, this would come from the demo data
  const ctRounds = demo.ctRounds || Math.floor(Math.random() * 16) + 5; // Placeholder
  const tRounds = demo.tRounds || Math.floor(Math.random() * 16) + 5; // Placeholder
  const totalRounds = ctRounds + tRounds;
  const ctPercentage = (ctRounds / totalRounds) * 100;
  
  return (
    <div 
      className={`relative flex flex-col sm:flex-row overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group cursor-pointer ${className}`}
      onClick={() => onSelect(demo)}
    >
      {/* Left side - Thumbnail */}
      <div className="relative sm:w-40 md:w-48 lg:w-56 flex-shrink-0">
        <div className="relative overflow-hidden h-full">
          {/* Thumbnail image */}
          <img 
            src={demo.thumbnail} 
            alt={demo.title} 
            className="w-full h-48 sm:h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Map badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {demo.map}
            </span>
          </div>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300">
            <div className="transform opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button className="bg-yellow-400 rounded-full p-3 hover:scale-110 transition-transform shadow-[0_0_15px_rgba(250,204,21,0.7)]">
                <Play className="h-5 w-5 text-gray-900" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Content */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        {/* Top section - Title and badges */}
        <div>
          {/* Title with PRO/COMMUNITY badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-white font-bold text-lg line-clamp-2 group-hover:text-yellow-400 transition-colors">
              {demo.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${demo.isPro ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 'bg-gray-700 text-white'}`}>
              {demo.isPro ? 'PRO' : 'COMMUNITY'}
            </span>
          </div>
          
          {/* Team & Event */}
          <div className="flex flex-wrap gap-2 mb-3">
            {demo.team && (
              <div className="bg-gray-700/60 px-2 py-1 rounded text-xs text-white flex items-center">
                <Shield className="h-3 w-3 mr-1 text-yellow-400" />
                <span>{demo.team}</span>
              </div>
            )}
            
            {demo.event && (
              <div className="bg-gray-700/60 px-2 py-1 rounded text-xs text-white truncate max-w-[180px]">
                {demo.event}
              </div>
            )}
            
            <div className="bg-gray-700/60 px-2 py-1 rounded text-xs text-white flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-yellow-400" />
              {demo.year}
            </div>
          </div>
          
          {/* Players */}
          <div className="mb-3">
            <div className="text-yellow-400 text-sm font-medium truncate">
              {demo.players.map((player, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && ", "}
                  <Link 
                    href={`/players/${player.replace(/\s+/g, '-').toLowerCase()}`}
                    className="hover:underline hover:text-yellow-300"
                    onClick={handlePlayerClick}
                  >
                    {player}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom section - Tags and CT/T ratio */}
        <div>
          {/* Tags and positions */}
          <div className="flex flex-wrap gap-1 mb-3">
            {demo.positions.map((position, i) => (
              <span key={`pos-${i}`} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
                {position}
              </span>
            ))}
            
            {demo.tags.map((tag, i) => (
              <span key={`tag-${i}`} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer flex items-center">
                <TagIcon className="h-2 w-2 mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          {/* CT/T rounds ratio bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-blue-400">CT: {ctRounds} rounds</span>
              <span className="text-yellow-400">T: {tRounds} rounds</span>
            </div>
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${ctPercentage}%` }}
              ></div>
              <div 
                className="h-full bg-yellow-400 transition-all duration-300"
                style={{ width: `${100 - ctPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoCard;