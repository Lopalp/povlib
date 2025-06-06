import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Tag as TagIcon, User } from "lucide-react";

// ─── Hilfsfunktion: Zufälliges Bild aus einer Liste auswählen ───
const getRandomImage = () => {
  const images = [
    "/img/1.png",
    "/img/2.png",
    "/img/3.png",
    "/img/4.png",
    "/img/5.png",
    "/img/6.png",
    "/img/7.png",
    "/img/8.png",
  ];
  return images[Math.floor(Math.random() * images.length)];
};

const DemoCard = ({ demo, onSelect, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState("/img/placeholder.png");

  useEffect(() => {
    setThumbnailSrc(getRandomImage());
  }, []);

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
      {/** ─── Thumbnail (gerundet) ─── */}
      <div className="overflow-hidden rounded-lg">
        <img
          src={thumbnailSrc}
          alt={`${demo.title} Thumbnail`}
          className="w-full aspect-video object-cover transition-transform duration-200 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/** ─── Unter dem Thumbnail: Titel │ Datum │ Event ─── */}
      <div className="mt-2 px-1">
        <h3 className="text-sm font-semibold text-white truncate" title={demo.title}>
          {demo.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span className="truncate">{demo.date}</span>
          <span className="truncate">{demo.event}</span>
        </div>
      </div>

      {/** ─── Hover-Modal ─── */}
      {isHovered && (
        <div
          className="
            absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 
            z-10 
            w-80 
            bg-gray-800 border border-gray-700 rounded-2xl shadow-xl 
            overflow-visible
          "
        >
          {/** ===== Header: Großes Thumbnail + Play-Button ===== */}
          <div className="relative w-full aspect-video overflow-hidden">
            <img
              src={thumbnailSrc}
              alt={`${demo.title} Preview`}
              className="w-full h-full object-cover brightness-75"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="flex items-center justify-center rounded-full p-3 bg-black/60 border-2 border-yellow-400 text-yellow-400 
                           hover:bg-black/80 hover:scale-110 transition-all duration-200"
              >
                <Play className="h-5 w-5" fill="currentColor" />
              </button>
            </div>
          </div>

          {/** ===== Body: Titel, Meta & Spieler/KDA ===== */}
          <div className="p-4 flex flex-col space-y-3">
            {/* Titel */}
            <h3 className="text-white font-bold text-lg leading-tight">
              {demo.title}
            </h3>

            {/* Meta-Infos in zwei Zeilen */}
            <div className="flex flex-col gap-1 text-xs text-gray-300">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-1 bg-gray-700 rounded-full">{demo.map}</span>
                {demo.team && (
                  <span className="px-2 py-1 bg-gray-700 rounded-full">{demo.team}</span>
                )}
                <span className="px-2 py-1 bg-gray-700 rounded-full">{demo.year}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-1 bg-gray-700 rounded-full">{demo.date}</span>
                <span className="px-2 py-1 bg-gray-700 rounded-full">{demo.event}</span>
              </div>
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
          </div>

          {/** ===== Footer: Tags/Positionen & CT/T-Rounds-Bar ===== */}
          <div className="px-4 pb-4 flex flex-col space-y-3">
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

            {/* CT/T-Rounds-Bar */}
            <footer>
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
