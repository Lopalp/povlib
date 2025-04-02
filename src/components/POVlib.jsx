'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, X, Menu } from 'lucide-react';

import {
  getAllDemos,
  getFilteredDemos,
  getTrendingDemos,
  getLatestDemos,
  getDemosByMap,
  getDemosByPosition,
  getFilterOptions,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions
} from '@/lib/supabase';

import DemoCard from './POVlib/DemoCard';
import VideoPlayerPage from './POVlib/VideoPlayerPage';
import TaggingModal from './POVlib/TaggingModal';
import FilterModal from './POVlib/FilterModal';
import Navbar from './POVlib/Navbar';
import Footer from './POVlib/Footer';
import FeaturedHero from './POVlib/FeaturedHero';
import SelectedFilters from './POVlib/SelectedFilters';

/**
 * mapDemo: Transformiert die verschachtelten Daten aus Supabase in ein flaches Format,
 * das im Frontend genutzt wird.
 */
const mapDemo = (demo) => {
  return {
    id: demo.id,
    name: demo.name, // oder "title" falls anders benannt
    thumbnail: demo.thumbnail,
    videoId: demo.video_id,
    isPro: demo.is_pro,
    createdAt: demo.created_at,
    updatedAt: demo.updated_at,
    views: demo.views || 0,
    likes: demo.likes || 0,
    // Tags extrahieren
    tags: demo.demo_tags ? demo.demo_tags.map(dt => dt.tags) : [],
    // Positions extrahieren
    positions: demo.demo_positions ? demo.demo_positions.map(dp => dp.positions) : []
  };
};

/**
 * CategorySection rendert einen Abschnitt mit Demos in einem responsiven Layout.
 */
const CategorySection = ({ title, demos, onSelectDemo, minCardWidth = 280, maxColumns = 4, gap = 24 }) => {
  const containerRef = useRef(null);
  const [itemsPerRow, setItemsPerRow] = useState(maxColumns);
  const [visibleRows, setVisibleRows] = useState(1);
  const [cardWidth, setCardWidth] = useState(minCardWidth);

  useEffect(() => {
    const updateItemsPerRow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const calculated = Math.floor((containerWidth + gap) / (minCardWidth + gap)) || 1;
        const finalItems = Math.min(calculated, maxColumns);
        setItemsPerRow(finalItems);
        const newCardWidth = (containerWidth - (finalItems - 1) * gap) / finalItems;
        setCardWidth(Math.floor(newCardWidth));
      }
    };

    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);
    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, [minCardWidth, maxColumns, gap]);

  const visibleCount = itemsPerRow * visibleRows;
  const visibleDemos = demos.slice(0, visibleCount);
  const rows = [];
  for (let i = 0; i < visibleDemos.length; i += itemsPerRow) {
    rows.push(visibleDemos.slice(i, i + itemsPerRow));
  }
  const canViewMore = demos.length > visibleCount;

  return (
    <section className="mt-8 mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        <span className="border-l-4 border-yellow-400 pl-3 py-1">{title}</span>
      </h2>
      <div ref={containerRef} className="overflow-hidden" style={{ boxSizing: 'border-box', padding: 0, margin: 0 }}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex mb-6" style={{ gap: `${gap}px` }}>
            {row.map(demo => (
              <div key={demo.id} style={{ width: cardWidth }} className="flex-shrink-0">
                <DemoCard demo={demo} onSelect={onSelectDemo} />
              </div>
            ))}
            {row.length < itemsPerRow &&
              Array(itemsPerRow - row.length).fill().map((_, i) => (
                <div key={`empty-${i}`} style={{ width: cardWidth }} className="flex-shrink-0"></div>
              ))
            }
          </div>
        ))}
      </div>
      {canViewMore && (
        <div className="mt-2 text-center">
          <button
            onClick={() => setVisibleRows(visibleRows + 1)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-yellow-400 text-sm rounded-lg border border-gray-700 transition-colors"
          >
            View More
          </button>
        </div>
      )}
    </section>
  );
};

const POVlib = () => {
  // UI States
  const [searchActive, setSearchActive] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [isVideoPlayerPage, setIsVideoPlayerPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [demoType, setDemoType] = useState('pro');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [autoplayVideo, setAutoplayVideo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data States
  const [filteredDemos, setFilteredDemos] = useState([]);
  const [trendingDemos, setTrendingDemos] = useState([]);
  const [latestDemos, setLatestDemos] = useState([]);
  const [mapDemos, setMapDemos] = useState({});
  const [positionDemos, setPositionDemos] = useState({});
  const [filterOptions, setFilterOptions] = useState({ maps: [], positions: [], tags: [] });
  const [filtersApplied, setFiltersApplied] = useState({
    map: '',
    position: '',
    tag: '',
    search: ''
  });

  // Dynamische Tags (z. B. aus demo.demo_tags)
  const dynamicTags = useMemo(() => {
    const tagsSet = new Set();
    filteredDemos.forEach(demo => {
      demo.tags.forEach(tag => tagsSet.add(tag.name));
    });
    // Beispiel-Dummies:
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

  // Helper-Funktionen für Map/Positions-Filter, falls benötigt
  const getFilteredDemosByMap = useCallback(
    async (mapName) => {
      const map = filterOptions.maps.find(m => m.name === mapName);
      if (!map) return [];
      const demos = await getDemosByMap(map.id);
      return demos.map(mapDemo);
    },
    [filterOptions.maps]
  );

  const getFilteredDemosByPosition = useCallback(
    async (positionName) => {
      const pos = filterOptions.positions.find(p => p.name === positionName);
      if (!pos) return [];
      const demos = await getDemosByPosition(pos.id);
      return demos.map(mapDemo);
    },
    [filterOptions.positions]
  );

  // Initialdaten laden
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const options = await getFilterOptions();
        setFilterOptions(options);

        const [allDemos, trending, latest] = await Promise.all([
          getAllDemos(),
          getTrendingDemos(5),
          getLatestDemos(5)
        ]);
        setFilteredDemos(allDemos.map(mapDemo));
        setTrendingDemos(trending.map(mapDemo));
        setLatestDemos(latest.map(mapDemo));

        setIsLoading(false);
      } catch (err) {
        console.error('Initial loading error:', err);
        setError('Fehler beim Laden der Daten.');
        setIsLoading(false);
      }
    })();
  }, [demoType]);

  // Filter aktualisieren (Position, Tag, Search etc.)
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        // Falls keine spezifischen Filter angewandt werden, hole alle Demos
        if (!filtersApplied.map && !filtersApplied.position && !filtersApplied.tag && !searchQuery) {
          const demos = await getAllDemos();
          setFilteredDemos(demos.map(mapDemo));
        } else {
          const demos = await getFilteredDemos({
            positionId: filtersApplied.position,
            tagId: filtersApplied.tag,
            search: searchQuery
          });
          setFilteredDemos(demos.map(mapDemo));
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Filter error:', err);
        setError('Fehler beim Anwenden der Filter.');
        setIsLoading(false);
      }
    })();
  }, [filtersApplied, searchQuery]);

  // Map- und Positions-Demos laden (z. B. für extra Abschnitte)
  useEffect(() => {
    (async () => {
      try {
        if (!filtersApplied.map) {
          // Beispiel: Lade Demos für "Mirage" und "Inferno"
          const [mirage, inferno] = await Promise.all([
            getFilteredDemosByMap("Mirage"),
            getFilteredDemosByMap("Inferno")
          ]);
          setMapDemos({
            mirage: mirage,
            inferno: inferno
          });
        }
      } catch (err) {
        console.error('Map demos error:', err);
      }
    })();
  }, [filtersApplied.map, getFilteredDemosByMap]);

  useEffect(() => {
    (async () => {
      try {
        if (!filtersApplied.position) {
          const awperDemos = await getFilteredDemosByPosition("AWPer");
          setPositionDemos({
            AWPer: awperDemos
          });
        }
      } catch (err) {
        console.error('Position demos error:', err);
      }
    })();
  }, [filtersApplied.position, getFilteredDemosByPosition]);

  // Video-Statistiken updaten, wenn ein Demo ausgewählt wurde
  useEffect(() => {
    if (selectedDemo) {
      (async () => {
        try {
          await updateDemoStats(selectedDemo.id, 'views', 1);
        } catch (err) {
          console.error('Error updating views:', err);
        }
      })();
    }
  }, [selectedDemo]);

  // Demo-Aktualisierung (Likes, Tagging, Position)
  const handleDemoUpdate = async (demoId, updateFn, updater) => {
    try {
      const result = await updateFn(demoId, updater);
      if (result && result.success) {
        const updatedDemo = mapDemo(result.demo);
        setFilteredDemos(prev =>
          prev.map(demo => demo.id === demoId ? { ...demo, ...updatedDemo } : demo)
        );
        if (selectedDemo && selectedDemo.id === demoId) {
          setSelectedDemo({ ...selectedDemo, ...updatedDemo });
        }
      }
    } catch (err) {
      console.error(`Error updating demo ${demoId}:`, err);
    }
  };

  const handleLikeDemo = async (demoId) => {
    await handleDemoUpdate(demoId, updateDemoStats, { field: 'likes', increment: 1 });
  };

  const handleUpdateTags = async (demoId, newTagIds) => {
    try {
      const result = await updateDemoTags(demoId, newTagIds);
      if (result.success) {
        const updated = mapDemo(result.demo);
        setSelectedDemo(prev => prev && prev.id === demoId ? updated : prev);
        setFilteredDemos(prev =>
          prev.map(d => d.id === demoId ? updated : d)
        );
        setIsTaggingModalOpen(false);
      }
    } catch (err) {
      console.error('Error updating tags:', err);
    }
  };

  const handleUpdatePositions = async (demoId, newPosIds) => {
    try {
      const result = await updateDemoPositions(demoId, newPosIds);
      if (result.success) {
        const updated = mapDemo(result.demo);
        setSelectedDemo(prev => prev && prev.id === demoId ? updated : prev);
        setFilteredDemos(prev =>
          prev.map(d => d.id === demoId ? updated : d)
        );
      }
    } catch (err) {
      console.error('Error updating positions:', err);
    }
  };

  // Video-Player Navigation
  const onSelectDemo = (demo) => {
    setSelectedDemo(demo);
    setIsVideoPlayerPage(true);
    window.scrollTo(0, 0);
  };

  const onCloseVideoPlayer = () => {
    setSelectedDemo(null);
    setIsVideoPlayerPage(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
        <div className="text-white text-lg">Lade Demos...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (isVideoPlayerPage && selectedDemo) {
    return (
      <>
        <VideoPlayerPage
          selectedDemo={selectedDemo}
          onClose={onCloseVideoPlayer}
          onLike={handleLikeDemo}
          onOpenTagModal={() => setIsTaggingModalOpen(true)}
        />
        {isTaggingModalOpen && (
          <TaggingModal
            selectedDemo={selectedDemo}
            filterOptions={filterOptions}
            onClose={() => setIsTaggingModalOpen(false)}
            onUpdateTags={handleUpdateTags}
            onUpdatePositions={handleUpdatePositions}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200">
      <Navbar
        demoType={demoType}
        onSwitchDemoType={setDemoType}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      />
      {filteredDemos.length > 0 && !selectedDemo && (
        <FeaturedHero
          demo={filteredDemos[0]}
          autoplayVideo={autoplayVideo}
          setSelectedDemo={onSelectDemo}
        />
      )}
      <main className="container mx-auto px-6 py-6">
        <SelectedFilters
          filtersApplied={filtersApplied}
          setFiltersApplied={setFiltersApplied}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="flex items-center gap-2 mb-2">
          <Filter onClick={() => setIsFilterModalOpen(true)} className="text-yellow-400 cursor-pointer" />
          <div className="flex flex-wrap items-center gap-2">
            {dynamicTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-yellow-400/20 transition-colors"
              >
                {tag}
              </button>
            ))}
            <Link href="/demos" className="text-yellow-400 text-sm underline">Alle Demos</Link>
          </div>
        </div>
        <CategorySection title="Recently Added" demos={filteredDemos} onSelectDemo={onSelectDemo} />
        {!filtersApplied.map && (
          <>
            <CategorySection title="Mirage Demos" demos={mapDemos.mirage || []} onSelectDemo={onSelectDemo} />
            <CategorySection title="Inferno Demos" demos={mapDemos.inferno || []} onSelectDemo={onSelectDemo} />
          </>
        )}
        {!filtersApplied.position && (
          <CategorySection title="AWP Plays" demos={positionDemos.AWPer || []} onSelectDemo={onSelectDemo} />
        )}
      </main>
      {isFilterModalOpen && (
        <FilterModal
          filterOptions={filterOptions}
          filtersApplied={filtersApplied}
          onClose={() => setIsFilterModalOpen(false)}
          onFilterChange={(changed) => setFiltersApplied(prev => ({ ...prev, ...changed }))}
          onResetFilters={() => setFiltersApplied({ map: '', position: '', tag: '', search: '' })}
        />
      )}
      <Footer />
    </div>
  );
};

export default POVlib;
