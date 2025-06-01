import React from 'react';
import Link from 'next/link';
import { Play, Tag as TagIcon, User } from 'lucide-react';

const DemoCard = ({ demo, featured = false, onSelect, className = "" }) => {
  const handlePlayerClick = (e, player) => {
    e.stopPropagation();
  };

  // Example CT vs. T rounds calculation
  const ctRounds = demo.id % 7 + 6;
  const tRounds = demo.id % 5 + 8;
  const totalRounds = ctRounds + tRounds;
  const ctPercentage = (ctRounds / totalRounds) * 100;
  const mockKDA = "23/5/2"; // Placeholder for K/D/A

  // Glassmorphism utility (same as in Navbar)
  const glassBg = "bg-black/40 backdrop-blur-lg border border-gray-700";

  return (
    <article
      className={`
        relative flex flex-col overflow-hidden rounded-2xl border border-gray-700 shadow-md transition-all duration-200
        hover:border-yellow-500 hover:shadow-xl cursor-pointer
        ${featured ? "w-full" : "w-80 md:w-72"} ${className}
      `}
      onClick={() => onSelect(demo)}
    >
      {/* ======= Scaled Background Thumbnail ======= */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={demo.thumbnail}
          alt=""
          className="w-full h-full object-cover scale-110"
          aria-hidden="true"
        />
        {/* Dark overlay to dim the background */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* ======= Content Wrapper ======= */}
      <div className="relative z-10 flex flex-col">
        {/* ======= Actual Thumbnail (on top) ======= */}
        <div className="relative w-full aspect-video overflow-hidden group">
          <img
            src={demo.thumbnail}
            alt={demo.title}
            className="w-full h-full object-cover transition-all duration-200 group-hover:brightness-90"
            loading="lazy"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="
                flex items-center justify-center
                rounded-full p-3
                bg-black/50 border-2 border-yellow-400 text-yellow-400
                hover:bg-black/70 hover:scale-105
                transition-all duration-200
              "
            >
              <Play className="h-5 w-5" fill="currentColor" />
            </button>
          </div>
        </div>

        {/* ======= Glass Panel for Data ======= */}
        <div className={`${glassBg} flex flex-col p-4 space-y-3 backdrop-blur-lg`}>
          {/* ----- Header (Title + Meta) ----- */}
          <header className="space-y-1">
            <h3
              className="
                text-white font-bold text-lg leading-tight line-clamp-2
                hover:text-yellow-400 transition-colors duration-200
              "
            >
              {demo.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-200">
              <span className="px-2 py-1 bg-gray-800 rounded-full">{demo.map}</span>
              {demo.team && (
                <span className="px-2 py-1 bg-gray-800 rounded-full">{demo.team}</span>
              )}
              <span className="px-2 py-1 bg-gray-800 rounded-full">{demo.year}</span>
            </div>
          </header>

          <div className="border-t border-gray-600" />

          {/* ----- Player + KDA ----- */}
          <section className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              {demo.players.slice(0, 1).map((player, idx) => (
                <Link
                  key={idx}
                  href={`/players/${player.replace(/\s+/g, "-").toLowerCase()}`}
                  className="
                    text-sm font-medium text-gray-200
                    hover:text-yellow-400 transition-colors duration-200
                  "
                  onClick={(e) => handlePlayerClick(e, player)}
                >
                  {player}
                </Link>
              ))}
            </div>
            <div className="text-xs font-semibold text-gray-300 tracking-wide bg-gray-800 px-2 py-1 rounded-md">
              {mockKDA}
            </div>
          </section>

          {/* ----- Tags + Positions ----- */}
          <section className="flex flex-wrap gap-2">
            {[...demo.positions.slice(0, 2), ...demo.tags.slice(0, 2)].map((item, i) => (
              <span
                key={i}
                className="
                  flex items-center gap-1 text-xs font-medium
                  bg-gray-800 text-gray-200 px-2 py-1 rounded-full
                  hover:bg-gray-700 transition-colors duration-150
                "
              >
                {demo.tags.includes(item) && (
                  <TagIcon className="h-4 w-4 text-gray-400" />
                )}
                {item}
              </span>
            ))}
            {(demo.positions.length + demo.tags.length) > 4 && (
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                +{demo.positions.length + demo.tags.length - 4} more
              </span>
            )}
          </section>

          <div className="border-t border-gray-600" />

          {/* ----- CT/T Rounds Bar ----- */}
          <footer className="mt-1">
            <div className="h-2 w-full rounded-full bg-gray-700 overflow-hidden flex">
              <div
                className="h-full transition-all duration-300 bg-blue-500/60"
                style={{ width: `${ctPercentage}%` }}
              />
              <div
                className="h-full transition-all duration-300 bg-yellow-500/60"
                style={{ width: `${100 - ctPercentage}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-gray-400 font-medium">
              <span>CT: {ctRounds}</span>
              <span>T: {tRounds}</span>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
};

export default DemoCard;
