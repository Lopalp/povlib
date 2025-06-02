// components/POVlib/UtilityBookPage.jsx
'use client';

import React, { useState, useMemo } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Tag as TagIcon, User } from 'lucide-react';

export default function UtilityBookPage() {
  // Dummy data for utils
  const dummyUtils = [
    {
      id: 'u1',
      thumbnail: '/images/util1.png',
      map: 'Mirage',
      side: 'CT',
      player: 's1mple',
      landing: 'A Site',
      type: 'Smoke',
      group: 'A Smoke'
    },
    {
      id: 'u2',
      thumbnail: '/images/util2.png',
      map: 'Inferno',
      side: 'T',
      player: 'dev1ce',
      landing: 'Banana',
      type: 'Molotov',
      group: null
    },
    {
      id: 'u3',
      thumbnail: '/images/util3.png',
      map: 'Mirage',
      side: 'CT',
      player: 'NiKo',
      landing: 'Connector',
      type: 'Flash',
      group: null
    },
    {
      id: 'u4',
      thumbnail: '/images/util4.png',
      map: 'Inferno',
      side: 'T',
      player: 'guardian',
      landing: 'B Site',
      type: 'Execute',
      group: 'B Execute'
    },
    {
      id: 'u5',
      thumbnail: '/images/util5.png',
      map: 'Dust2',
      side: 'CT',
      player: 'karrigan',
      landing: 'Mid',
      type: 'Smoke',
      group: 'Mid Smoke'
    },
    {
      id: 'u6',
      thumbnail: '/images/util6.png',
      map: 'Dust2',
      side: 'T',
      player: 'coldzera',
      landing: 'Long A',
      type: 'Flash',
      group: null
    },
    // …ggf. weitere Dummy-Utils
  ];

  // State for filters
  const [utils] = useState(dummyUtils);
  const [typeFilter, setTypeFilter] = useState('All');
  const [sideFilter, setSideFilter] = useState('All');
  const [mapFilter, setMapFilter] = useState('All');
  const [playerSearch, setPlayerSearch] = useState('');
  const [landingSearch, setLandingSearch] = useState('');

  // Derive unique filter options
  const types = useMemo(() => ['All', ...new Set(dummyUtils.map((u) => u.type))], []);
  const sides = ['All', 'CT', 'T'];
  const maps = useMemo(() => ['All', ...new Set(dummyUtils.map((u) => u.map))], []);
  const players = useMemo(() => ['All', ...new Set(dummyUtils.map((u) => u.player))], []);

  // Filtered utils based on selected filters / search
  const filteredUtils = useMemo(() => {
    return utils
      .filter((u) => typeFilter === 'All' || u.type === typeFilter)
      .filter((u) => sideFilter === 'All' || u.side === sideFilter)
      .filter((u) => mapFilter === 'All' || u.map === mapFilter)
      .filter((u) =>
        playerSearch === '' ||
        u.player.toLowerCase().includes(playerSearch.toLowerCase())
      )
      .filter((u) =>
        landingSearch === '' ||
        u.landing.toLowerCase().includes(landingSearch.toLowerCase())
      );
  }, [utils, typeFilter, sideFilter, mapFilter, playerSearch, landingSearch]);

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-12 bg-gray-900 text-gray-200 min-h-screen">
        <div className="container mx-auto px-4 md:px-8 space-y-6">
          {/* Page Title */}
          <section>
            <h1 className="text-3xl font-bold text-white mb-2">Utility Book</h1>
            <p className="text-gray-400">
              Durchsuche Clips von Pro-Spielern, die unterschiedliche Utilities auf verschiedenen Maps einsetzen.
              Filtere nach Typ, Seite, Map, Spieler oder Landing-Position.
            </p>
          </section>

          {/* Filter Controls */}
          <section className="space-y-4">
            {/* Search Inputs */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Nach Spieler suchen..."
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 rounded-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Nach Landing suchen..."
                value={landingSearch}
                onChange={(e) => setLandingSearch(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 rounded-lg focus:outline-none"
              />
            </div>

            {/* Dropdowns: Seite + Map */}
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={sideFilter}
                onChange={(e) => setSideFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 rounded-lg focus:outline-none"
              >
                {sides.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={mapFilter}
                onChange={(e) => setMapFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 rounded-lg focus:outline-none"
              >
                {maps.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Tabs */}
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    typeFilter === t
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* Utils Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredUtils.map((util) => (
              <article
                key={util.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative w-full aspect-video overflow-hidden">
                  <img
                    src={util.thumbnail}
                    alt={`${util.type} by ${util.player}`}
                    className="w-full h-full object-cover brightness-90 transition-all duration-200 hover:brightness-75"
                    loading="lazy"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <button className="flex items-center justify-center rounded-full p-3 bg-black/60 border-2 border-yellow-400 text-yellow-400 hover:bg-black/80 hover:scale-105 transition-all duration-200">
                      ▶
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {util.type}
                    {util.group ? ` (${util.group})` : ''}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
                    <span className="px-2 py-1 bg-gray-700 rounded-full">{util.map}</span>
                    <span className="px-2 py-1 bg-gray-700 rounded-full">{util.side}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Landing: {util.landing}</p>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-300 text-sm">{util.player}</span>
                  </div>
                  <button className="mt-2 px-3 py-1 bg-yellow-400 text-gray-900 rounded-lg text-sm">
                    Teilen
                  </button>
                </div>
              </article>
            ))}

            {filteredUtils.length === 0 && (
              <p className="text-gray-400 col-span-full">
                Keine Utilities gefunden, die zu deinen Filtern passen.
              </p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
