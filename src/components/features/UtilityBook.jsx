// components/POVlib/UtilityBook.jsx
"use client";

import React, { useState, useMemo } from "react";
import { ToggleButton } from "../buttons";

const dummyUtils = [
  {
    id: "u1",
    thumbnail: "/images/util1.png",
    map: "Mirage",
    side: "CT",
    player: "Player1",
    landing: "A Site",
    type: "Smoke",
    group: null,
  },
  {
    id: "u2",
    thumbnail: "/images/util2.png",
    map: "Inferno",
    side: "T",
    player: "Player2",
    landing: "Banana",
    type: "Molotov",
    group: null,
  },
  {
    id: "u3",
    thumbnail: "/images/util3.png",
    map: "Mirage",
    side: "CT",
    player: "Player3",
    landing: "Connector",
    type: "Flash",
    group: null,
  },
  {
    id: "u4",
    thumbnail: "/images/util4.png",
    map: "Inferno",
    side: "T",
    player: "Player4",
    landing: "B Site",
    type: "Execute",
    group: "B Execute",
  },
  // …ggf. mehr Dummies
];

export default function UtilityBook() {
  const [utils] = useState(dummyUtils);
  const [groupFilter, setGroupFilter] = useState("All");
  const [sideFilter, setSideFilter] = useState("All");
  const [search, setSearch] = useState("");

  const groups = useMemo(
    () => ["All", ...new Set(dummyUtils.map((u) => u.type))],
    []
  );
  const sides = ["All", "CT", "T"];

  const filtered = useMemo(() => {
    return utils
      .filter((u) => groupFilter === "All" || u.type === groupFilter)
      .filter((u) => sideFilter === "All" || u.side === sideFilter)
      .filter(
        (u) =>
          search === "" ||
          u.player.toLowerCase().includes(search.toLowerCase()) ||
          u.landing.toLowerCase().includes(search.toLowerCase())
      );
  }, [utils, groupFilter, sideFilter, search]);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Utility Book</h2>

      {/* Such- und Seitenfilter */}
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search Player or Landing"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-800 rounded-lg focus:outline-none"
        />
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
      </div>

      {/* Gruppentabs */}
      <div className="flex flex-wrap gap-2">
        {groups.map((g) => (
          <ToggleButton
            key={g}
            active={groupFilter === g}
            onClick={() => setGroupFilter(g)}
          >
            {g}
          </ToggleButton>
        ))}
      </div>

      {/* Utils-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((util) => (
          <div
            key={util.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-sm"
          >
            <img
              src={util.thumbnail}
              alt={util.type}
              className="w-full h-32 object-cover"
            />
            <div className="p-4 space-y-1">
              <h3 className="font-bold">
                {util.type}
                {util.group ? ` (${util.group})` : ""}
              </h3>
              <p className="text-gray-400 text-sm">
                {util.map} · {util.side}
              </p>
              <p className="text-gray-300 text-sm">Landing: {util.landing}</p>
              <p className="text-gray-300 text-sm">By: {util.player}</p>
              <button className="mt-2 px-3 py-1 bg-yellow-400 text-gray-900 rounded-lg text-sm">
                Share
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-400 col-span-full">
            No utils match your filter.
          </p>
        )}
      </div>
    </section>
  );
}
