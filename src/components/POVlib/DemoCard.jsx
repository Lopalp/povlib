import React from 'react';
import Link from 'next/link';
import { Play, Shield, Tag as TagIcon } from 'lucide-react';

const DemoCard = ({ demo, featured = false, onSelect, className = "" }) => {
  const handlePlayerClick = (e, player) => {
    e.stopPropagation();
  };

  const ctRounds = demo.id % 7 + 6;
  const tRounds = demo.id % 5 + 8;
  const totalRounds = ctRounds + tRounds;
  const ctPercentage = (ctRounds / totalRounds) * 100;

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-lg group cursor-pointer ${featured ? 'w-full' : ''} ${className} p-2`}
      onClick={() => onSelect(demo)}
    >
      {/* Thumbnail Section */}
      <div className="relative aspect-video overflow-hidden w-full rounded-md">
        <img 
          src={demo.thumbnail} 
          alt={demo.title} 
          className="w-full h-full object-cover" 
          loading="lazy"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button className="bg-yellow-400 rounded-full p-3 hover:scale-105 transition-transform text-gray-900 border-2 border-yellow-300">
            <Play className="h-5 w-5" fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-2 flex-grow flex flex-col">
        <h3 className="text-white font-bold text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors mb-1">
          {demo.title}
        </h3>

        {/* Map, Type, Year */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <span className="px-2 py-0.5 bg-yellow-400 text-gray-900 text-xs font-bold rounded">
            {demo.map}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${demo.isPro ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 'bg-gray-700 text-white'}`}>
            {demo.isPro ? 'PRO' : 'COMMUNITY'}
          </span>
          <div>{demo.year}</div>
        </div>

        {/* Team and Players */}
        <div className="mb-2">
          {demo.team && (
            <div className="text-xs text-gray-300 flex items-center mr-2">
              <Shield className="h-3 w-3 mr-1 text-yellow-400" />
              <span>{demo.team}</span>
            </div>
          )}
          <div className="text-yellow-400 text-xs font-medium line-clamp-1">
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

        {/* Tags and Positions */}
        <div className="flex flex-wrap gap-1 mb-3">
          {demo.positions.slice(0, 2).map((position, i) => (
            <span key={i} className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded">
              {position}
            </span>
          ))}
          {demo.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded flex items-center">
              <TagIcon className="h-2 w-2 mr-1" />
              {tag}
            </span>
          ))}
          {(demo.positions.length + demo.tags.length) > 2 && (
            <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded">
              +{(demo.positions.length + demo.tags.length - 4)}
            </span>
          )}
        </div>

        {/* CT/T Rounds Bar */}
        <div className="mt-1">
          <div className="h-0.5 w-full rounded-full overflow-hidden flex bg-gray-700/30">
            <div className="bg-blue-500/40 h-full" style={{ width: `${ctPercentage}%` }}></div>
            <div className="bg-yellow-500/40 h-full" style={{ width: `${100 - ctPercentage}%` }}></div>
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
