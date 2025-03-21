import React from 'react';
import Link from 'next/link';
import { Play, Eye, Shield, Tag as TagIcon } from 'lucide-react';

const DemoCard = ({ demo, featured = false, onSelect, className = "" }) => {
  // Handle clicking on player links without triggering card selection
  const handlePlayerClick = (e, player) => {
    e.stopPropagation();
  };
  
  // Mock data for CT/T rounds (in a real app, this would come from the demo data)
  const ctRounds = demo.id % 7 + 6; // Just for demonstration
  const tRounds = demo.id % 5 + 8; // Just for demonstration
  const totalRounds = ctRounds + tRounds;
  const ctPercentage = (ctRounds / totalRounds) * 100;
  
  return (
    <div 
      className={`relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group cursor-pointer ${featured ? 'w-full' : 'w-full sm:w-96 md:max-w-md'} ${className}`}
      onClick={() => onSelect(demo)}
    >
      <div className="flex flex-col sm:flex-row h-full">
        {/* Thumbnail Section - Left side on larger screens */}
        <div className="relative sm:w-2/5 md:w-5/12">
          <div className="relative overflow-hidden h-48 sm:h-full">
            {/* Thumbnail image */}
            <img 
              src={demo.thumbnail} 
              alt={demo.title} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <button className="bg-yellow-400 rounded-full p-4 transition-transform duration-300 hover:scale-110 shadow-[0_0_15px_rgba(250,204,21,0.7)]">
                <Play className="h-6 w-6 text-gray-900" fill="currentColor" />
              </button>
            </div>
            
            {/* Views counter */}
            <div className="absolute bottom-2 right-2 z-10">
              <div className="flex items-center bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white">
                <Eye className="h-3 w-3 mr-1 text-yellow-400" />
                <span>{demo.views.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Map badge */}
            <div className="absolute top-2 left-2 z-10">
              <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded">
                {demo.map}
              </span>
            </div>
          </div>
        </div>
        
        {/* Content Section - Right side on larger screens */}
        <div className="relative p-4 sm:w-3/5 md:w-7/12 flex flex-col justify-between">
          {/* Top section with badges */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${demo.isPro ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 'bg-gray-700 text-white'}`}>
                {demo.isPro ? 'PRO' : 'COMMUNITY'}
              </span>
              <span className="text-gray-400 text-xs">{demo.year}</span>
            </div>
            
            {/* Title */}
            <h3 className="text-white font-bold text-base mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
              {demo.title}
            </h3>
            
            {/* Team and players */}
            <div className="mb-2">
              {demo.team && (
                <div className="text-xs text-white flex items-center mb-1">
                  <Shield className="h-3 w-3 mr-1 text-yellow-400" />
                  <span>{demo.team}</span>
                </div>
              )}
              
              <div className="text-yellow-400 text-xs font-medium">
                {demo.players.map((player, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && ", "}
                    <Link 
                      href={`/players/${player.replace(/\s+/g, '-').toLowerCase()}`}
                      className="hover:underline hover:text-yellow-300"
                      onClick={(e) => handlePlayerClick(e, player)}
                    >
                      {player}
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Tags and positions */}
            <div className="flex flex-wrap gap-1 mb-3">
              {demo.positions.slice(0, 2).map((position, i) => (
                <span key={i} className="text-xs bg-gray-700 px-2 py-0.5 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
                  {position}
                </span>
              ))}
              {demo.positions.length > 2 && (
                <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                  +{demo.positions.length - 2}
                </span>
              )}
              
              {demo.tags.slice(0, 1).map((tag, i) => (
                <span key={i} className="text-xs bg-gray-700 px-2 py-0.5 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer flex items-center">
                  <TagIcon className="h-2 w-2 mr-1" />
                  {tag}
                </span>
              ))}
              {demo.tags.length > 1 && (
                <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                  +{demo.tags.length - 1}
                </span>
              )}
            </div>
          </div>
          
          {/* CT/T Rounds Bar */}
          <div className="mt-auto">
            <div className="text-xs text-gray-400 mb-1 flex justify-between">
              <span>CT: {ctRounds}</span>
              <span>T: {tRounds}</span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden flex">
              <div 
                className="bg-blue-500 h-full"
                style={{ width: `${ctPercentage}%` }}
              ></div>
              <div 
                className="bg-yellow-500 h-full"
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