import React from 'react';
import Link from 'next/link';
import { Play, User } from 'lucide-react';

const DemoCard = ({ demo, featured = false, onSelect, className = "" }) => {
  const handlePlayerClick = (e, player) => {
    e.stopPropagation();
  };

  // Example CT vs. T rounds calculation
  const ctRounds = demo.id % 7 + 6;
  const tRounds = demo.id % 5 + 8;
  const totalRounds = ctRounds + tRounds;
  const ctPercentage = (ctRounds / totalRounds) * 100;
  const mockKDA = demo.kda || "—"; // use placeholder “—” if no KDA provided

  return (
    <article
      className={`
        relative flex flex-col bg-gray-800 border border-gray-700 rounded-2xl shadow-md hover:shadow-xl 
        overflow-hidden transition-all duration-200 cursor-pointer
        ${featured ? 'w-full' : 'w-80 md:w-72'} ${className}
        min-h-[24rem]        /* Reserve full height even if some fields are missing */
      `}
      onClick={() => onSelect(demo)}
    >
      {/* ======= Thumbnail Section ======= */}
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
            className="flex items-center justify-center rounded-full p-3 bg-black/60 border-2 border-yellow-400 text-yellow-400 
            hover:bg-black/80 hover:scale-105 transition-all duration-200"
          >
            <Play className="h-5 w-5" fill="currentColor" />
          </button>
        </div>
      </div>

      {/* ======= Content Section ======= */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        {/* ----- Header: Title + Metadata ----- */}
        <header className="space-y-2">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 
            group-hover:text-yellow-400 transition-colors duration-200">
            {demo.title}
          </h3>

          <div className="flex flex-col space-y-1">
            {/* Always show a placeholder slot for “Map” (it’s required) */}
            <span className="text-xs uppercase text-gray-300 bg-gray-700 px-2 py-1 rounded-full">
              Map: {demo.map || "—"}
            </span>

            {/* Team & Year: even if missing, placeholders keep the same height */}
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <span className="bg-gray-700 px-2 py-1 rounded-full">
                Team: {demo.team || "—"}
              </span>
              <span className="bg-gray-700 px-2 py-1 rounded-full">
                Year: {demo.year || "—"}
              </span>
            </div>
          </div>
        </header>

        <div className="border-t border-gray-700" />

        {/* ----- Player + KDA Section ----- */}
        <section className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-400" />
            {demo.players && demo.players.length > 0 ? (
              <Link
                href={`/players/${demo.players[0].replace(/\s+/g, '-').toLowerCase()}`}
                className="text-sm font-medium text-gray-200 hover:text-yellow-400 transition-colors duration-200"
                onClick={(e) => handlePlayerClick(e, demo.players[0])}
              >
                {demo.players[0]}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-500">No player</span>
            )}
          </div>
          <div className="text-xs font-semibold text-gray-400 tracking-wide bg-gray-700 px-2 py-1 rounded-md">
            K/D/A: {mockKDA}
          </div>
        </section>

        <div className="border-t border-gray-700" />

        {/* ----- Tags & Positions Section ----- */}
        <section className="flex flex-wrap gap-2 min-h-[2.5rem]">
          {(() => {
            // Collect up to 4 items from positions + tags
            const items = [
              ...demo.positions.slice(0, 2),
              ...demo.tags.slice(0, 2),
            ];
            if (items.length === 0) {
              return (
                <span className="text-xs text-gray-500 italic">No tags or positions</span>
              );
            }
            return items.map((item, i) => (
              <span
                key={i}
                className="text-xs font-medium bg-gray-700 text-gray-200 px-2 py-1 rounded-full
                  hover:bg-gray-600 transition-colors duration-150"
              >
                {item}
              </span>
            ));
          })()}
          {demo.positions.length + demo.tags.length > 4 && (
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded-full">
              +{demo.positions.length + demo.tags.length - 4} more
            </span>
          )}
        </section>

        <div className="border-t border-gray-700" />

        {/* ----- CT vs. T Rounds Bar (Footer) ----- */}
        <footer className="mt-2">
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
