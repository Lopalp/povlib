import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "lucide-react"; // Play-Icon wird nicht mehr benötigt
import YouTubeEmbed from "./YouTubeEmbed";

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
    >
      {/** ─── Thumbnail (statisch) ─── */}
      <div className="rounded-lg">
        <img
          src={thumbnailSrc}
          alt={`${demo.title} Thumbnail`}
          className="w-full aspect-video object-cover rounded-lg"
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

      {/** ─── Hover-Modal mit Video und Klick-Overlay ─── */}
      {isHovered && (
        <div
          className="
            absolute top-0 left-0 
            w-full 
            transform -translate-y-4 
            z-40 
            bg-gray-800 border border-gray-700 rounded-2xl shadow-xl 
            overflow-hidden
          "
        >
          {/** ===== Header: YouTube-Video mit unsichtbarem Klick-Overlay ===== */}
          <div className="relative w-full aspect-video">
            <YouTubeEmbed 
              videoId={demo.videoId} 
              autoplay={true} 
              title={demo.title}
              controls={false}
              showInfo={false}
            />
            {/* NEU: Unsichtbares Overlay, das Klicks abfängt und zur Player-Seite weiterleitet */}
            <div 
              className="absolute inset-0 cursor-pointer" 
              onClick={() => onSelect(demo)}
            ></div>
          </div>

          {/** ===== Body: Titel, Meta & Spieler/KDA ===== */}
          <div className="p-4 flex flex-col space-y-3">
            {/* Titel (ohne separaten Play-Button) */}
            <h3 className="text-white font-bold text-lg leading-tight truncate">
              {demo.title}
            </h3>
            
            <div className="flex flex-col gap-1 text-xs text-gray-300">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-1 bg-gray-700 rounded-full">{demo.map}</span>
                {demo.team && (
                  <span className="px-2 py-1 bg-gray-700 rounded-full">{demo.team}</span>
                )}
                <span className="px-2 py-1 bg-gray-700 rounded-full">{demo.year}</span>
              </div>
            </div>

            <div className="border-t border-gray-700"></div>

            <section className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                {demo.players.slice(0, 1).map((player, idx) => (
                  <Link
                    key={idx}
                    href={`/players/${player.replace(/\s+/g, "-").toLowerCase()}`}
                    className="text-sm font-medium text-gray-200 hover:text-yellow-400 transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
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

          {/** ===== Footer: CT/T-Rounds-Bar ===== */}
          <div className="px-4 pb-4">
             <footer>
              <div className="h-2 w-full rounded-full bg-gray-700 overflow-hidden flex">
                <div
                  className="bg-blue-500/60 h-full"
                  style={{ width: `${ctPercentage}%` }}
                />
                <div
                  className="bg-yellow-500/60 h-full"
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