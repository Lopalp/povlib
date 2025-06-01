import React from 'react';
import Link from 'next/link';
import { Play, User } from 'lucide-react';

const DemoCard = ({ demo, featured = false, onSelect, className = "" }) => {
  const handlePlayerClick = (e, player) => {
    e.stopPropagation();
  };

  // Rounds calculation (CT vs. T)
  const ctRounds = demo.id % 7 + 6;
  const tRounds = demo.id % 5 + 8;
  const totalRounds = ctRounds + tRounds;
  const ctPercentage = (ctRounds / totalRounds) * 100;
  const mockKDA = "23/5/2"; // Placeholder

  return (
    <article
      className={`
        flex flex-col justify-between bg-gray-800 border border-gray-700 rounded-2xl shadow-md 
        hover:shadow-xl overflow-hidden transition-shadow duration-200 cursor-pointer
        ${featured ? 'w-full' : 'w-80 md:w-72'} 
        h-[32rem] ${className}
      `}
      onClick={() => onSelect(demo)}
    >
      {/* ======= Thumbnail ======= */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={demo.thumbnail}
          alt={demo.title}
          className="w-full h-full object-cover brightness-90 transition-all duration-200 group-hover:brightness-75"
          loading="lazy"
        />
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="flex items-center justify-center rounded-full p-3 bg-black/60 border-2 border-yellow-400 
            text-yellow-400 hover:bg-black/80 hover:scale-105 transition-all duration-200"
          >
            <Play className="h-5 w-5" fill="currentColor" />
          </button>
        </div>
      </div>

      {/* ======= Content ======= */}
      <div className="flex flex-col flex-grow px-4 py-3 space-y-3">
        {/* ----- Title ----- */}
        <header className="min-h-[3rem]">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 
            group-hover:text-yellow-400 transition-colors duration-200">
            {demo.title}
          </h3>
        </header>

        {/* ----- Map, Team & Year ----- */}
        <section className="flex flex-wrap items-center gap-2 text-xs text-gray-300 min-h-[2rem]">
          <span className="px-2 py-1 bg-gray-700 rounded-full">Map: {demo.map || 'Unknown'}</span>
          <span className="px-2 py-1 bg-gray-700 rounded-full">
            Team: {demo.team || 'N/A'}
          </span>
          <span className="px-2 py-1 bg-gray-700 rounded-full">
            Year: {demo.year || 'N/A'}
          </span>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-700"></div>

        {/* ----- Player + K/D/A ----- */}
        <section className="flex items-center justify-between min-h-[2.5rem]">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-400" />
            {demo.players && demo.players.length > 0 ? (
              demo.players.slice(0, 1).map((player, idx) => (
                <Link
                  key={idx}
                  href={`/players/${player.replace(/\s+/g, '-').toLowerCase()}`}
                  className="text-sm font-medium text-gray-200 hover:text-yellow-400 transition-colors duration-200"
                  onClick={(e) => handlePlayerClick(e, player)}
                >
                  {player}
                </Link>
              ))
            ) : (
              <span className="text-sm text-gray-500">No player</span>
            )}
          </div>
          <div className="text-xs font-semibold text-gray-400 tracking-wide bg-gray-700 px-2 py-1 rounded-md">
            K/D/A: {mockKDA}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-700"></div>

        {/* ----- Tags & Positions ----- */}
        <section className="flex flex-wrap gap-2 min-h-[2.5rem]">
          {demo.positions && demo.positions.length > 0 ? (
            demo.positions.slice(0, 2).map((pos, i) => (
              <span
                key={`pos-${i}`}
                className="text-xs font-medium bg-gray-700 text-gray-200 px-2 py-1 rounded-full
                  hover:bg-gray-600 transition-colors duration-150"
              >
                {pos}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">No positions</span>
          )}

          {demo.tags && demo.tags.length > 0 ? (
            demo.tags.slice(0, 2).map((tag, i) => (
              <span
                key={`tag-${i}`}
                className="text-xs font-medium bg-gray-700 text-gray-200 px-2 py-1 rounded-full
                  hover:bg-gray-600 transition-colors duration-150"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">No tags</span>
          )}

          {demo.positions && demo.tags && (demo.positions.length + demo.tags.length) > 4 && (
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded-full">
              +{demo.positions.length + demo.tags.length - 4} more
            </span>
          )}
        </section>

        {/* Divider */}
        <div className="border-t border-gray-700"></div>

        {/* ----- CT vs. T Rounds Bar ----- */}
        <footer className="mt-auto">
          <div className="h-2 w-full rounded-full bg-gray-700 overflow-hidden flex">
            <div
              className="bg-blue-500/60 h-full transition-all duration-300"
              style={{ width: `${ctPercentage}%` }}
            />
            <div
              className="bg-yellow-500/60 h-full transition-all duration-300"
              style={{ width: `${100 - ctPercentage}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-gray-500 font-medium">
            <span>CT: {ctRounds}</span>
            <span>T: {tRounds}</span>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default DemoCard;
