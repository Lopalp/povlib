// components/POVlib/UtilityBookPage.jsx
"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, MapPin, User, Tag as TagIcon } from "lucide-react";

import DemoCard from "../../components/cards/DemoCard";

export default function UtilityBookPage() {
  // Dummy data for utility clips
  const dummyUtils = [
    {
      id: "u1",
      thumbnail: "/images/util1.png",
      map: "Mirage",
      side: "CT",
      player: "s1mple",
      landing: "A Site",
      type: "Smoke",
      group: "A Smoke",
    },
    {
      id: "u2",
      thumbnail: "/images/util2.png",
      map: "Inferno",
      side: "T",
      player: "dev1ce",
      landing: "Banana",
      type: "Molotov",
      group: null,
    },
    {
      id: "u3",
      thumbnail: "/images/util3.png",
      map: "Mirage",
      side: "CT",
      player: "NiKo",
      landing: "Connector",
      type: "Flash",
      group: null,
    },
    {
      id: "u4",
      thumbnail: "/images/util4.png",
      map: "Inferno",
      side: "T",
      player: "guardian",
      landing: "B Site",
      type: "Execute",
      group: "B Execute",
    },
    {
      id: "u5",
      thumbnail: "/images/util5.png",
      map: "Dust2",
      side: "CT",
      player: "karrigan",
      landing: "Mid",
      type: "Smoke",
      group: "Mid Smoke",
    },
    {
      id: "u6",
      thumbnail: "/images/util6.png",
      map: "Dust2",
      side: "T",
      player: "coldzera",
      landing: "Long A",
      type: "Flash",
      group: null,
    },
    // …ggf. weitere Dummy-Utils
  ];

  // Dummy data for demos
  const dummyDemos = [
    {
      id: 101,
      title: "s1mple ACE on Mirage",
      thumbnail: "/images/demo1.png",
      video_id: "abc123",
      map: "Mirage",
      positions: ["A Site"],
      tags: ["ACE", "Clutch"],
      players: ["s1mple"],
      team: "NAVI",
      year: 2024,
      event: "Blast Premier",
      result: "16-14",
      views: 12500,
      likes: 340,
      isPro: true,
    },
    {
      id: 102,
      title: "NiKo 1v3 Clutch on Inferno",
      thumbnail: "/images/demo2.png",
      video_id: "def456",
      map: "Inferno",
      positions: ["B Site", "Mid"],
      tags: ["Clutch"],
      players: ["NiKo"],
      team: "G2",
      year: 2024,
      event: "PGL Major",
      result: "16-13",
      views: 9800,
      likes: 280,
      isPro: true,
    },
    {
      id: 103,
      title: "dev1ce Perfect 5k on Dust2",
      thumbnail: "/images/demo3.png",
      video_id: "ghi789",
      map: "Dust2",
      positions: ["Long A"],
      tags: ["5K"],
      players: ["dev1ce"],
      team: "FaZe",
      year: 2023,
      event: "IEM Cologne",
      result: "16-9",
      views: 14300,
      likes: 415,
      isPro: true,
    },
    {
      id: 104,
      title: "guardian 1v4 Hold on Nuke",
      thumbnail: "/images/demo4.png",
      video_id: "jkl012",
      map: "Nuke",
      positions: ["Ramp"],
      tags: ["Clutch"],
      players: ["guardian"],
      team: "Liquid",
      year: 2024,
      event: "ESL Pro League",
      result: "16-12",
      views: 11200,
      likes: 375,
      isPro: true,
    },
    // …ggf. weitere Dummy-Demos
  ];

  // State for filters and search (utilities)
  const [utils] = useState(dummyUtils);
  const [filtersApplied, setFiltersApplied] = useState({
    map: "",
    side: "",
    type: "",
    player: "",
    landing: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Derive unique filter options
  const filterOptions = useMemo(
    () => ({
      maps: [...new Set(dummyUtils.map((u) => u.map))],
      sides: ["CT", "T"],
      types: [...new Set(dummyUtils.map((u) => u.type))],
      players: [...new Set(dummyUtils.map((u) => u.player))],
      landings: [...new Set(dummyUtils.map((u) => u.landing))],
    }),
    []
  );

  // Filtered utils based on filtersApplied and searchQuery
  const filteredUtils = useMemo(() => {
    return utils
      .filter(
        (u) =>
          (!filtersApplied.map ||
            filtersApplied.map === "All" ||
            u.map === filtersApplied.map) &&
          (!filtersApplied.side ||
            filtersApplied.side === "All" ||
            u.side === filtersApplied.side) &&
          (!filtersApplied.type ||
            filtersApplied.type === "All" ||
            u.type === filtersApplied.type) &&
          (!filtersApplied.player ||
            filtersApplied.player === "All" ||
            u.player === filtersApplied.player) &&
          (!filtersApplied.landing ||
            filtersApplied.landing === "All" ||
            u.landing === filtersApplied.landing)
      )
      .filter(
        (u) =>
          searchQuery === "" ||
          u.player.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.landing.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [utils, filtersApplied, searchQuery]);

  // Handlers to reset filters
  const removeFilter = (key) => {
    setFiltersApplied((prev) => ({ ...prev, [key]: "" }));
  };
  const resetAllFilters = () => {
    setFiltersApplied({ map: "", side: "", type: "", player: "", landing: "" });
    setSearchQuery("");
  };

  return (
    <>
      {/* Spacer for Navbar */}
      <div className="h-24 bg-gray-900"></div>

      {/* Hero Header */}
      <div className="relative py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-yellow-400/5 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Utility Book
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Durchsuche Clips von Pro-Spielern, die verschiedene Utilities auf
            CS2-Maps einsetzen. Filtere nach Map, Seite, Typ, Spieler oder
            Landing-Position, um genau zu finden, was du suchst.
          </p>
          <div className="max-w-xl mx-auto relative">
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input
                type="text"
                placeholder="Search Player or Landing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pl-12 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-400"
              />
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowFilterPanel((prev) => !prev)}
                className="absolute right-3 top-3 p-2 bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 rounded-lg transition-colors"
              >
                <Filter className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Filter Tags */}
        <FilterTags
          filtersApplied={filtersApplied}
          removeFilter={removeFilter}
          resetAllFilters={resetAllFilters}
        />

        {/* Filter Panel (collapsible) */}
        {showFilterPanel && (
          <FilterPanel
            filterOptions={filterOptions}
            filtersApplied={filtersApplied}
            setFiltersApplied={setFiltersApplied}
          />
        )}

        {/* Quick Map Filters */}
        <MapQuickFilters
          maps={filterOptions.maps}
          setFiltersApplied={setFiltersApplied}
        />

        {/* Utility Grid */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Utility Clips</h2>
          <UtilityGrid utils={filteredUtils} />
        </section>

        {/* Demo Cards Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Featured Demos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dummyDemos.map((demo) => (
              <DemoCard key={demo.id} demo={demo} onSelect={() => {}} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

/**
 * Subkomponente: Anzeige aktiver Filter als Tags
 */
function FilterTags({ filtersApplied, removeFilter, resetAllFilters }) {
  const activeEntries = Object.entries(filtersApplied).filter(
    ([, value]) => value && value !== "All"
  );
  if (activeEntries.length === 0) return null;

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3 p-4 bg-gray-800 rounded-xl border border-gray-700">
      {activeEntries.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center bg-gray-700 text-xs rounded-full px-3 py-2 group hover:bg-gray-600 transition-colors"
        >
          <span className="capitalize mr-1 text-gray-400">{key}:</span>
          <span className="font-bold text-yellow-400">{value}</span>
          <button
            onClick={() => removeFilter(key)}
            className="ml-2 text-gray-500 group-hover:text-yellow-400 transition-colors"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        onClick={resetAllFilters}
        className="text-xs text-gray-400 hover:text-yellow-400 ml-2 font-bold transition-colors"
      >
        Reset All Filters
      </button>
    </div>
  );
}

/**
 * Subkomponente: Filter-Panel mit Dropdowns für Map, Side, Type, Player, Landing
 */
function FilterPanel({ filterOptions, filtersApplied, setFiltersApplied }) {
  const { maps, sides, types, players, landings } = filterOptions;

  const handleChange = (key, value) => {
    setFiltersApplied((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mb-8 p-6 bg-gray-800 rounded-xl border border-gray-700 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Map Dropdown */}
        <select
          value={filtersApplied.map || "All"}
          onChange={(e) => handleChange("map", e.target.value)}
          className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
        >
          <option value="All">All Maps</option>
          {maps.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Side Dropdown */}
        <select
          value={filtersApplied.side || "All"}
          onChange={(e) => handleChange("side", e.target.value)}
          className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
        >
          <option value="All">All Sides</option>
          {sides.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Type Dropdown */}
        <select
          value={filtersApplied.type || "All"}
          onChange={(e) => handleChange("type", e.target.value)}
          className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
        >
          <option value="All">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Player Dropdown */}
        <select
          value={filtersApplied.player || "All"}
          onChange={(e) => handleChange("player", e.target.value)}
          className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
        >
          <option value="All">All Players</option>
          {players.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Landing Dropdown */}
        <select
          value={filtersApplied.landing || "All"}
          onChange={(e) => handleChange("landing", e.target.value)}
          className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
        >
          <option value="All">All Landings</option>
          {landings.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/**
 * Subkomponente: Schnellfilter für Maps
 */
function MapQuickFilters({ maps, setFiltersApplied }) {
  if (!maps || maps.length === 0) return null;

  return (
    <div className="mt-8 mb-12">
      <h2 className="text-white text-2xl font-bold mb-6">
        <span className="border-l-4 border-yellow-400 pl-3 py-1">
          Browse by Map
        </span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {maps.map((map) => (
          <button
            key={map}
            onClick={() => setFiltersApplied((prev) => ({ ...prev, map }))}
            className="flex items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 border border-gray-700 hover:border-yellow-400/30 transition-all"
          >
            <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
            <span className="text-white font-medium">{map}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Subkomponente: Grid zur Anzeige der Utility-Clips
 */
function UtilityGrid({ utils }) {
  if (utils.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-xl border border-gray-700">
        <div className="text-yellow-400 text-6xl mb-4">
          <Filter />
        </div>
        <h3 className="text-white text-xl font-bold mb-2">
          No utilities found
        </h3>
        <p className="text-gray-400">Passe deine Filter an oder suche neu.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {utils.map((util) => (
        <article
          key={util.id}
          className="bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <div className="relative w-full aspect-video overflow-hidden group">
            <img
              src={util.thumbnail}
              alt={`${util.type} by ${util.player}`}
              className="w-full h-full object-cover brightness-90 transition-all duration-200 group-hover:brightness-75"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="flex items-center justify-center rounded-full p-3 bg-black/60 border-2 border-yellow-400 text-yellow-400 hover:bg-black/80 hover:scale-105 transition-all duration-200">
                ▶
              </button>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
              {util.type}
              {util.group ? ` (${util.group})` : ""}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
              <span className="px-2 py-1 bg-gray-700 rounded-full">
                {util.map}
              </span>
              <span className="px-2 py-1 bg-gray-700 rounded-full">
                {util.side}
              </span>
            </div>
            <p className="text-gray-400 text-sm">Landing: {util.landing}</p>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-gray-300 text-sm">{util.player}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                ...[].concat(
                  util.type ? [util.type] : [],
                  util.group ? [util.group] : []
                ),
              ].map((item, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 text-xs font-medium bg-gray-700 text-gray-200 px-2 py-1 rounded-full hover:bg-gray-600 transition-colors"
                >
                  {util.group && util.group === item && (
                    <TagIcon className="h-4 w-4 text-gray-400" />
                  )}
                  {item}
                </span>
              ))}
            </div>
            <button className="mt-3 px-3 py-1 bg-yellow-400 text-gray-900 rounded-lg text-sm">
              Share
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
