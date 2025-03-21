import React from 'react';
import Link from 'next/link';
import { Play, Eye, Heart, Calendar, Shield, Tag as TagIcon, Award } from 'lucide-react';

const DemoCard = ({ demo, featured = false, onSelect, className = "" }) => {
  // Handle clicking on player links without triggering card selection
  const handlePlayerClick = (e, player) => {
    e.stopPropagation();
    // Additional logic can be added here if needed
  };

  // Calculate like ratio for visual indicator (likes per view)
  const likeRatio = demo.views > 0 ? (demo.likes / demo.views) * 100 : 0;
  const isPopular = likeRatio > 2; // Threshold for "popular" content
  
  return (
    <div 
      className={`relative flex-shrink-0 ${featured ? 'w-full' : 'w-72 sm:w-80'} overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group cursor-pointer ${className}`}
      onClick={() => onSelect(demo)}
    >
      {/* Top Badges Section */}
      <div className="relative pt-5 px-5">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-1.5 items-center">
            <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded">
              {demo.map}
            </span>
            {isPopular && (
              <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-full flex items-center">
                <Award className="h-3 w-3 mr-1" />
                Hot
              </span>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${demo.isPro ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 'bg-gray-700 text-white'}`}>
            {demo.isPro ? 'PRO' : 'COMMUNITY'}
          </span>
        </div>
        
        {/* Title with better truncation */}
        <div className="min-h-[2.5rem] mb-3">
          <h3 className="text-white font-bold text-base line-clamp-2 group-hover:text-yellow-400 transition-colors">
            {demo.title}
          </h3>
        </div>
        
        {/* Thumbnail with enhanced hover effects */}
        <div className="relative rounded-lg overflow-hidden">
          {/* Overlay effects on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 z-10"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-yellow-400 to-yellow-300 z-0"></div>
          
          {/* Team badge if available */}
          {demo.team && (
            <div className="absolute top-3 left-3 z-20">
              <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center">
                <Shield className="h-3 w-3 mr-1 text-yellow-400" />
                <span>{demo.team}</span>
              </div>
            </div>
          )}
          
          {/* Event badge if available */}
          {demo.event && (
            <div className="absolute top-3 right-3 z-20 max-w-[60%] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white truncate">
                {demo.event}
              </div>
            </div>
          )}
          
          {/* Thumbnail image */}
          <img 
            src={demo.thumbnail} 
            alt={demo.title} 
            className={`w-full ${featured ? 'h-52 object-cover' : 'h-44 object-cover'} group-hover:scale-110 transition-all duration-700 rounded-lg`}
            loading="lazy"
          />
          
          {/* Views counter */}
          <div className="absolute bottom-3 right-3 flex items-center space-x-3 text-xs text-white z-20">
            <div className="flex items-center bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
              <Eye className="h-3 w-3 mr-1 text-yellow-400" />
              <span>{demo.views.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <div className="transform translate-y-4 group-hover:translate-y-0 scale-0 group-hover:scale-100 transition-all duration-300">
              <button className="bg-yellow-400 rounded-full p-4 transition-transform duration-300 hover:scale-110 shadow-[0_0_15px_rgba(250,204,21,0.7)]">
                <Play className="h-6 w-6 text-gray-900" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom info section */}
      <div className="p-4 relative overflow-hidden">
        {/* Year and players */}
        <div className="flex justify-between items-center">
          <span className="text-yellow-400 text-xs font-medium flex-1 truncate">
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
          </span>
          <span className="text-gray-400 text-xs flex items-center ml-2 whitespace-nowrap">
            <Calendar className="h-3 w-3 mr-1" />
            {demo.year}
          </span>
        </div>
        
        {/* Tags section */}
        <div className="flex flex-wrap gap-1 mt-2 items-center">
          {/* Show up to 2 positions or tags */}
          {demo.positions.length > 0 && (
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer flex items-center">
              {demo.positions[0]}
              {demo.positions.length > 1 && <span className="ml-1">+{demo.positions.length - 1}</span>}
            </span>
          )}
          
          {demo.tags.length > 0 && (
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer flex items-center">
              <TagIcon className="h-2 w-2 mr-1" />
              {demo.tags[0]}
              {demo.tags.length > 1 && <span className="ml-1">+{demo.tags.length - 1}</span>}
            </span>
          )}
          
          {/* Likes indicator with better styling */}
          <span className={`flex items-center text-xs ${isPopular ? 'bg-red-400/10 text-red-400' : 'bg-yellow-400/10 text-yellow-400'} px-2 py-0.5 rounded ml-auto`}>
            <Heart className={`h-3 w-3 mr-1 ${isPopular ? 'fill-red-400' : ''}`} />
            {demo.likes}
          </span>
        </div>
        
        {/* Progress bar to indicate popularity (likes-to-views ratio) */}
        <div className="mt-3 h-0.5 w-full bg-gray-700/50 rounded-full overflow-hidden">
          <div 
            className={`h-full ${isPopular ? 'bg-red-400' : 'bg-yellow-400'} transition-all duration-300`}
            style={{ width: `${Math.min(likeRatio * 5, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DemoCard;