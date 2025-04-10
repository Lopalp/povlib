"use client";
import { createContext, useState, useContext, useMemo } from "react";

const DemoContext = createContext(null);

export default function DemoProvider({ children }) {

    const [filteredDemos, setFilteredDemos] = useState([]);
    const [trendingDemos, setTrendingDemos] = useState([]);
    const [latestDemos, setLatestDemos] = useState([]);
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

  const value = useMemo(
    () => ({
      filteredDemos,
      setFilteredDemos,
      trendingDemos,
      setTrendingDemos,
      latestDemos,
      setIsMenuOpen,
    }),
    [searchActive, demoType, isMenuOpen]
  );

  return (
    <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
  );
}

export function useDemos() {
  const context = useContext(NavbarContext);
  if (context === null) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
}
