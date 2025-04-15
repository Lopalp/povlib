"use client";
import { createContext, useState, useContext, useMemo } from "react";
import { useNavbar } from "./NavbarProvider";

const DemoContext = createContext(null);

export default function DemoProvider({ children, initialDemos }) {

    const {
      searchActive,
      setSearchActive,
      demoType,
      setDemoType,
      isMenuOpen,
      setIsMenuOpen,
    } = useNavbar();

    const [filteredDemos, setFilteredDemos] = useState(initialDemos.filteredDemos || []);
    const [trendingDemos, setTrendingDemos] = useState(initialDemos.trendingDemos || []);
    const [latestDemos, setLatestDemos] = useState(initialDemos.latestDemos || []);
    const [searchQuery, setSearchQuery] = useState(null);
    const [mapDemos, setMapDemos] = useState({});
    const [positionDemos, setPositionDemos] = useState({});
    const [filterOptions, setFilterOptions] = useState({
      maps: [],
      positions: {},
      teams: [],
      years: [],
      events: [],
      results: [],
      players: []
    });
    const [filtersApplied, setFiltersApplied] = useState({
      map: '',
      position: '',
      player: '',
      team: '',
      year: '',
      event: '',
      result: '',
      search: searchQuery
    });

  // Dynamische Tags
  const dynamicTags = useMemo(() => {
    const tagsSet = new Set();
    filteredDemos.forEach(demo => {
      demo.tags.forEach(tag => tagsSet.add(tag));
    });
    tagsSet.add("Karten");
    tagsSet.add("Spieler");
    tagsSet.add("Teams");
    tagsSet.add("Karte + CT Position");
    return Array.from(tagsSet);
  }, [filteredDemos]);

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setFiltersApplied(prev => ({ ...prev, search: tag }));
  };

  const value = useMemo(
    () => ({
      filteredDemos,
      setFilteredDemos,
      trendingDemos,
      setTrendingDemos,
      latestDemos,
      setIsMenuOpen,
      searchQuery,
      setSearchQuery,
      filtersApplied,
      setFiltersApplied,
      dynamicTags,
      handleTagClick
    }),
    [searchActive, demoType, isMenuOpen]
  );

  return (
    <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
  );
}

export function useDemos() {
  const context = useContext(DemoContext);
  if (context === null) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
}
