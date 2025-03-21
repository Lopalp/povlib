import React from 'react';
import Link from 'next/link';
import { Eye, Play } from 'lucide-react';

const PlayerCard = ({ player, demoCount, viewCount }) => {
  const playerUrlName = player.name.replace(/\s+/g, '-').toLowerCase();
  
  return (
    <Link 
      href={`/players/${playerUrlName}`}
      className="block group"
    >
      <div className="relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg border border-gray-700 hover:border-yellow-400/30">
        <div className="p-6 flex flex-col items-center">
          {/* Player Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-400/30 mb-4 group-hover:border-yellow-400 transition-colors">
            {player.avatar ? (
              <img 
                src={player.avatar} 
                alt={player.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-yellow-400 text-4xl font-bold">
                {player.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {/* Player Name */}
          <h3 className="text-white font-bold text-xl mb-1 text-center group-hover:text-yellow-400 transition-colors">
            {player.name}
          </h3>
          
          {/* Player Team */}
          {player.team && (
            <div className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300 mb-4">
              {player.team}
            </div>
          )}
          
          {/* Stats */}
          <div className="flex justify-between w-full mt-2">
            <div className="flex items-center text-gray-400 text-sm">
              <Play className="h-4 w-4 mr-1 text-yellow-400" />
              <span>{demoCount || 0} demos</span>
            </div>
            
            <div className="flex items-center text-gray-400 text-sm">
              <Eye className="h-4 w-4 mr-1 text-yellow-400" />
              <span>{(viewCount || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Hover overlay with view button */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center pb-6 transition-opacity">
          <div className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">
            View Player Profile
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlayerCard;