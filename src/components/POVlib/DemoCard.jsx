import React from 'react';
import Link from 'next/link';
import { Play, Shield, Tag as TagIcon, User } from 'lucide-react';

const DemoCard = ({ demo, featured = false, onSelect, className = "" }) => {
  const handlePlayerClick = (e, player) => {
    e.stopPropagation();
  };

  const ctRounds = demo.id % 7 + 6;
  const tRounds = demo.id % 5 + 8;
  const totalRounds = ctRounds + tRounds;
  const ctPercentage = (ctRounds / totalRounds) * 100;
  const mockKDA = "23/5/2"; // Placeholder for K/D/A

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-lg group cursor-pointer bg-gray-900 border border-gray-800 hover:border-yellow-500 transition-colors duration-200 ${featured ? 'w-full' : ''} ${className} p-4`}
      onClick={() => onSelect(demo)}
    >
      {/* Thumbnail Section */}
      <div className="relative aspect-video overflow-hidden w-full rounded-lg">
        <img 
          src={demo.thumbnail} 
          alt={demo.title} 
          className="w-full h-full object-cover" 
          loading="lazy"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button className="rounded-full p-3 border-2 border-yellow-400 text-yellow-400 bg-black/50 hover:scale-105 transition-transform">
            <Play className="h-5 w-5" fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-3 flex-grow flex flex-col">
        <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-yellow-500 transition-colors mb-3">
          {demo.title}
        </h3>

        {/* Meta Row: Map, Team, Year */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-white mb-2">
          <span className="px-2 py-0.5 bg-white/10 rounded-full">{demo.map}</span>
          {demo.team && <span className="px-2 py-0.5 bg-white/10 rounded-full">{demo.team}</span>}
          <span className="px-2 py-0.5 bg-white/10 rounded-full">{demo.year}</span>
        </div>

        {/* Player + KDA */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm font-semibold text-gray-300">
            <User className="h-4 w-4 mr-1 text-gray-400" />
            {demo.players.slice(0, 1).map((player, idx) => (
              <Link
                key={idx}
                href={`/players/${player.replace(/\s+/g, '-').toLowerCase()}`}
                className="hover:text-yellow-500 transition-colors"
                onClick={(e) => handlePlayerClick(e, player)}
              >
                {player}
              </Link>
            ))}
          </div>
          <div className="text-xs text-gray-400 font-semibold tracking-wider bg-gray-800 px-2 py-1 rounded-md">
            {mockKDA}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {[...demo.positions.slice(0, 2), ...demo.tags.slice(0, 2)].map((item, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-gray-800 text-gray-300 rounded-full flex items-center gap-1">
              {demo.tags.includes(item) && <TagIcon className="h-3 w-3" />}
              {item}
            </span>
          ))}
          {(demo.positions.length + demo.tags.length) > 4 && (
            <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-800 rounded-full">
              +{(demo.positions.length + demo.tags.length - 4)} more
            </span>
          )}
        </div>

        {/* CT/T Rounds Bar */}
        <div className="mt-auto">
          <div className="h-1 w-full rounded-full overflow-hidden flex bg-gray-700/40">
            <div className="bg-blue-500/50 h-full" style={{ width: `${ctPercentage}%` }}></div>
            <div className="bg-yellow-500/50 h-full" style={{ width: `${100 - ctPercentage}%` }}></div>
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
