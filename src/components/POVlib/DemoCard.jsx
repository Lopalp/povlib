import React, { useState } from "react";
import Link from "next/link";
import { Play, Tag as TagIcon, User } from "lucide-react";

const DemoCard = ({ demo, onSelect, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Beispielhafte Runden-Berechnung (CT vs. T)
  const ctRounds = demo.id % 7 + 6;
  const tRounds = demo.id % 5 + 8;
  const totalRounds = ctRounds + tRounds;
  const ctPercentage = (ctRounds / totalRounds) * 100;
  const mockKDA = "23/5/2"; // Platzhalter für K/D/A

  return (
    <div
      className={`relative w-full cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(demo)}
    >
      {/** ─── Thumbnail mit leichten Rundungen ─── */}
      <div className="overflow-hidden rounded-lg">
        <img
          src={demo.thumbnail}
          alt={demo.title}
          className="w-full aspect-video object-cover transition-transform duration-200 
                     group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/** ─── Hover-Modal ─── */}
      {isHovered && (
        <div
          className="
            absolute top-0 left-0 z-10 
            w-72 md:w-80 
            bg-gray-800 border border-gray-700 rounded-2xl shadow-xl 
            transform -translate-y-4 
            overflow-hidden
          "
        >
          {/* Thumbnail oben */}
          <div className="relative w-full aspect-video overflow-hidden">
            <img
              src={demo.thumbnail}
              alt={demo.title}
              className="w-full h-full object-cover brightness-75"
              loading="lazy"
            />
            {/* Play-Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="flex items-center justify-center rounded-full p-3 bg-black/60 border-2 border-yellow-400 text-yellow-400 
                           hover:bg-black/80 hover:scale-110 transition-all duration-200"
              >
                <Play className="h-5 w-5" fill="currentColor" />
              </button>
            </div>
          </div>

          {/* Inhalt des Modals */}
          <div className="p-4 flex flex-col space-y-3">
            {/* Titel */}
            <h3 className="text-white font-bold text-lg leading-tight">
              {demo.title}
            </h3>

            {/* Meta (Map, Team, Year) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
              <span className="px-2 py-1 bg-gray-700 rounded-full">{demo.map}</span>
              {demo.team && (
                <span className="px-2 py-1 bg-gray-700 rounded-full">{demo.team}</span>
              )}
              <span className="px-2 py-1 bg-gray-700 rounded-full">{demo.year}</span>
            </div>

            <div className="border-t border-gray-700"></div>

            {/* Spieler & KDA */}
            <section className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                {demo.players.slice(0, 1).map((player, idx) => (
                  <Link
                    key={idx}
                    href={`/players/${player.replace(/\s+/g, "-").toLowerCase()}`}
                    className="text-sm font-medium text-gray-200 hover:text-yellow-400 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      /* Link-Klick event darf nicht das onSelect triggern */
                    }}
                  >
                    {player}
                  </Link>
                ))}
              </div>
              <div className="text-xs font-semibold text-gray-400 tracking-wide bg-gray-700 px-2 py-1 rounded-md">
                {mockKDA}
              </div>
            </section>

            <div className="border-t border-gray-700"></div>

            {/* Tags & Positionen */}
            <section className="flex flex-wrap gap-2">
              {[...demo.positions.slice(0, 2), ...demo.tags.slice(0, 2)].map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 text-xs font-medium bg-gray-700 text-gray-200 px-2 py-1 rounded-full
                             hover:bg-gray-600 transition-colors duration-150"
                >
                  {demo.tags.includes(item) && <TagIcon className="h-4 w-4 text-gray-400" />}
                  {item}
                </span>
              ))}
              {(demo.positions.length + demo.tags.length) > 4 && (
                <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded-full">
                  +{demo.positions.length + demo.tags.length - 4} more
                </span>
              )}
            </section>

            <div className="border-t border-gray-700"></div>

            {/* CT/T Rounds Bar */}
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
        </div>
      )}
    </div>
  );
};

export default DemoCard;
