"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";

const PILL_OPTIONS = [
  "all",
  "players",
  "teams",
  "utils",
  "unwatched",
  "watched",
  "recently uploaded",
];

// Component that uses useSearchParams and needs to be wrapped
function SearchResultsContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || "";

  const [activePill, setActivePill] = useState("all");
  const [searchQuery, setSearchQuery] = useState(queryParam);

  useEffect(() => {
    setSearchQuery(queryParam);
    setActivePill("all");
  }, [queryParam]);

  // Dummy data placeholders (replace with real fetch logic)
  const videos = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        title: `Video ${i + 1}`,
        thumbnail: `/thumbnails/video${i + 1}.jpg`,
        watched: i % 2 === 0,
      })),
    []
  );
  const players = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, i) => ({ id: i, name: `Player ${i + 1}`, avatar: `/avatars/player${i + 1}.jpg` })),
    []
  );
  const teams = useMemo(
    () =>
      Array.from({ length: 3 }).map((_, i) => ({ id: i, name: `Team ${i + 1}`, logo: `/logos/team${i + 1}.png` })),
    []
  );
  const utils = useMemo(
    () =>
      Array.from({ length: 2 }).map((_, i) => ({
        id: i,
        title: `Utility ${i + 1}`,
        radarData: [20, 35, 50, 40, 30],
        clips: Array.from({ length: 3 }).map((__, j) => ({ id: j, title: `Clip ${j + 1}`, demo: `/demos/clip${j + 1}.mp4` })),
      })),
    []
  );

  // Filtered lists based on search and pill
  const filteredVideos = useMemo(
    () => videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [videos, searchQuery]
  );
  const filteredPlayers = useMemo(
    () => players.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [players, searchQuery]
  );
  const filteredTeams = useMemo(
    () => teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [teams, searchQuery]
  );
  const filteredUtils = useMemo(
    () => utils.filter(u => u.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [utils, searchQuery]
  );

  // Helper to decide if section should show
  const showSection = type => {
    switch (type) {
      case "videos":
        if (!["all", "watched", "unwatched"].includes(activePill)) return false;
        if (activePill === "watched") return filteredVideos.some(v => v.watched);
        if (activePill === "unwatched") return filteredVideos.some(v => !v.watched);
        return filteredVideos.length > 0;
      case "players":
        return ["all", "players"].includes(activePill) && filteredPlayers.length > 0;
      case "teams":
        return ["all", "teams"].includes(activePill) && filteredTeams.length > 0;
      case "utils":
        return ["all", "utils"].includes(activePill) && filteredUtils.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Search Query Display */}
      {searchQuery && (
        <div className="mb-4">
          <h1 className="text-3xl font-semibold">Search results for "{searchQuery}"</h1>
        </div>
      )}

      {/* Pills + Filter Icon */}
      <div className="flex items-center mb-8">
        <div className="flex space-x-2 overflow-x-auto">
          {PILL_OPTIONS.map(pill => (
            <button
              key={pill}
              onClick={() => setActivePill(pill)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                activePill === pill
                  ? "bg-yellow-500 text-gray-900"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
        <button className="ml-auto p-2 bg-gray-700 rounded-full hover:bg-gray-600">
          <Filter size={20} />
        </button>
      </div>

      <div className="space-y-12">
        {/* Videos Section */}
        {showSection("videos") && (
          <Section title="Videos">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredVideos
                .filter(v =>
                  activePill === "watched"
                    ? v.watched
                    : activePill === "unwatched"
                    ? !v.watched
                    : true
                )
                .map(v => <VideoCard key={v.id} title={v.title} thumbnail={v.thumbnail} />)}
            </div>
          </Section>
        )}
        <hr className="border-gray-700" />

        {/* Players Section */}
        {showSection("players") && (
          <>
            <Section title="Players">
              <div className="flex space-x-6 overflow-x-auto py-2">
                {filteredPlayers.map(p => (
                  <ChannelCard key={p.id} name={p.name} avatar={p.avatar} />
                ))}
              </div>
            </Section>
            <hr className="border-gray-700" />
          </>
        )}

        {/* Teams Section */}
        {showSection("teams") && (
          <>
            <Section title="Teams">
              <div className="flex space-x-6 overflow-x-auto py-2">
                {filteredTeams.map(t => (
                  <ChannelCard key={t.id} name={t.name} avatar={t.logo} />
                ))}
              </div>
            </Section>
            <hr className="border-gray-700" />
          </>
        )}

        {/* Utils Section */}
        {showSection("utils") && (
          <Section title="Utilities">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUtils.map(u => (
                <UtilityCard key={u.id} title={u.title} radarData={u.radarData} clips={u.clips} />
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

// Wrapper component with Suspense boundary
export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}

// Reusable Section Wrapper
function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

// Video Card (Demo style)
function VideoCard({ title, thumbnail }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <img src={thumbnail} alt={title} className="w-full h-40 object-cover" />
      <div className="p-3">
        <h3 className="text-lg font-medium truncate">{title}</h3>
      </div>
    </div>
  );
}

// Channel Card (Players & Teams)
function ChannelCard({ name, avatar }) {
  return (
    <div className="flex-shrink-0 w-32 text-center">
      <img src={avatar} alt={name} className="w-24 h-24 rounded-full mx-auto object-cover" />
      <p className="mt-2 truncate">{name}</p>
    </div>
  );
}

// Utility Card
function UtilityCard({ title, radarData, clips }) {
  const points = radarData
    .map(
      (val, idx) =>
        `${50 + Math.sin((idx / radarData.length) * Math.PI * 2) * val},${
          50 - Math.cos((idx / radarData.length) * Math.PI * 2) * val
        }`
    )
    .join(" ");

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <svg width="100" height="100" className="mx-auto mb-4">
        <polygon points={points} fill="rgba(255,255,255,0.2)" stroke="#ffffff" strokeWidth="1" />
      </svg>
      <div className="space-y-2">
        {clips.map(c => (
          <div key={c.id} className="flex items-center space-x-3">
            <video src={c.demo} className="w-24 h-16 rounded-lg bg-black" controls />
            <p className="truncate">{c.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
