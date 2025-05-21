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
      className={`relative flex flex-col overflow-hidden rounded-2xl shadow-sm group cursor-pointer bg-[#111213] ${featured ? 'w-full' : ''} ${className} p-3 transition-all duration-200 hover:bg-[#1a1b1d]`}
      onClick={() => onSelect(demo)}
    >
      {/* Thumbnail Section */}
      <div className="relative aspect-video overflow-hidden w-full rounded-xl">
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
        <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors mb-2">
          {demo.title}
        </h3>

        {/* Map, Type, Year */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2">
          <span className="px-2 py-0.5 bg-yellow-400 text-gray-900 font-semibold rounded-md">
            {demo.map}
          </span>
          <span className={`px-2 py-0.5 rounded-md font-medium ${demo.isPro ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-400/30' : 'bg-gray-700 text-white'}`}>
            {demo.isPro ? 'PRO' : 'COMMUNITY'}
          </span>
          <span className="text-gray-500">{demo.year}</span>
        </div>

        {/* Team and Players */}
        <div className="mb-3 space-y-1">
          {demo.team && (
            <div className="text-xs text-gray-300 flex items-center">
              <Shield className="h-3 w-3 mr-1 text-yellow-400" />
              <span>{demo.team}</span>
            </div>
          )}
          <div className="text-xs text-yellow-400 font-medium line-clamp-1">
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
        <div className="flex flex-wrap gap-1 mb-4">
          {[...demo.positions.slice(0, 2), ...demo.tags.slice(0, 2)].map((item, i) => (
            <span key={i} className="text-[11px] bg-white/5 text-white px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
              {typeof item === 'string' && demo.tags.includes(item) && <TagIcon className="h-3 w-3" />}
              {item}
            </span>
          ))}
          {(demo.positions.length + demo.tags.length) > 4 && (
            <span className="text-[11px] text-gray-400 px-2 py-0.5 rounded-full border border-white/10">
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
