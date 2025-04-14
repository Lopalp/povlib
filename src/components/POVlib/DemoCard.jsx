import React from 'react';
import Link from 'next/link';
import { Play, Shield, Tag as TagIcon } from 'lucide-react';

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
      className={`relative flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group cursor-pointer ${featured ? 'w-full' : 'w-72 sm:w-80'} ${className}`}
      onClick={() => onSelect(demo)}
    >
      {/* Thumbnail Section with padding */}
      <div className="relative w-full aspect-video overflow-hidden">
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
        
        {/* Map badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded">
            {demo.map}
          </span>
        </div>
        
        {/* PRO/COMMUNITY badge */}
        <div className="absolute top-2 right-2 z-10">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${demo.isPro ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 'bg-gray-700 text-white'}`}>
            {demo.isPro ? 'PRO' : 'COMMUNITY'}
          </span>
        </div>
      </div>
      
      {/* Content Section - YouTube-like info below thumbnail with padding */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-white font-bold text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors mb-2">
          {demo.title}
        </h3>
        
        {/* Team and Players */}
        <div className="flex items-center mb-1">
          {demo.team && (
            <div className="text-xs text-gray-300 flex items-center mr-2">
              <Shield className="h-3 w-3 mr-1 text-yellow-400" />
              <span>{demo.team}</span>
            </div>
          )}
          <div className="text-gray-400 text-xs">{demo.year}</div>
        </div>
        
        <div className="text-yellow-400 text-xs font-medium mb-2 line-clamp-1">
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
        
        {/* Tags and Positions Row */}
        <div className="flex flex-wrap gap-1 mb-2">
          {demo.positions.slice(0, 1).map((position, i) => (
            <span key={i} className="text-xs bg-gray-700 px-2 py-0.5 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
              {position}
            </span>
          ))}
          
          {demo.tags.slice(0, 1).map((tag, i) => (
            <span key={i} className="text-xs bg-gray-700 px-2 py-0.5 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer flex items-center">
              <TagIcon className="h-2 w-2 mr-1" />
              {tag}
            </span>
          ))}
          
          {(demo.positions.length + demo.tags.length) > 2 && (
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
              +{(demo.positions.length + demo.tags.length - 2)}
            </span>
          )}
        </div>
        
        {/* Subtle CT/T Rounds Bar */}
        <div className="mt-1">
          <div className="h-0.5 w-full rounded-full overflow-hidden flex bg-gray-700/30">
            <div 
              className="bg-blue-500/40 h-full"
              style={{ width: `${ctPercentage}%` }}
            ></div>
            <div 
              className="bg-yellow-500/40 h-full"
              style={{ width: `${100 - ctPercentage}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-gray-500 mt-1 flex justify-between">
            <span>CT: {ctRounds}</span>
            <span>T: {tRounds}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoCard;