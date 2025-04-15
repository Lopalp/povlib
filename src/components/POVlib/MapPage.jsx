'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import InteractiveMap from './InteractiveMap';
import Navbar from './Navbar';
import Footer from './Footer';
import FeaturedHero from './FeaturedHero';
import DemoCard from './DemoCard';
import VideoPlayerPage from './VideoPlayerPage';
import TaggingModal from './TaggingModal';
import FilterModal from './FilterModal';
import { getDemosByMap, getFilterOptions, updateDemoStats, updateDemoTags, updateDemoPositions } from '../../lib/supabase'; // Import helper functions
import { CategorySection } from '../containers/CategorySection';
import { LoadingFullscreen } from '../loading/LoadingFullscreen';
import { Filter } from 'lucide-react';

function MapPage({ mapName }) {
  const [isLoading, setIsLoading] = useState(true);
  const [allDemos, setAllDemos] = useState([]);
  const [demosByYear, setDemosByYear] = useState({});
  const [demosByEvent, setDemosByEvent] = useState({});
  const [trendingDemos, setTrendingDemos] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    maps: [],
    positions: {},
    teams: [],
    years: [],
    events: [],
    results: [],
    players: []
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const mapSectionRef = useRef(null);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [demoType, setDemoType] = useState('pro');
  const [filtersApplied, setFiltersApplied] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastDemoElementRef = useRef(null);
  const [videosToShow, setVideosToShow] = useState(12);
  const [displayedDemos, setDisplayedDemos] = useState([]);

  const loadMoreVideos = () => {
    setVideosToShow(prev => prev + 12);
  };

  const mapDemoData = (demo) => ({
    id: demo.id,
    title: demo.title,
    thumbnail: demo.thumbnail,
    videoId: demo.video_id,
    map: demo.map,
    positions: demo.positions || [],
    tags: demo.tags || [],
    players: demo.players || [],
    team: demo.team,
    year: demo.year,
    event: demo.event,
    result: demo.result,
    views: demo.views || 0,
    likes: demo.likes || 0,
    isPro: demo.is_pro,
  });

  const handleSwitchDemoType = (type) => {
    setDemoType(type);
  };

  const handleAreaClick = (area) => {
    console.log('Map area clicked:', area);
  };

  const handleSelectDemo = (demo) => {
    setSelectedDemo(demo);
    window.scrollTo(0, 0);
  };

  const handleCloseVideoPlayer = () => {
    setSelectedDemo(null);
  };

  const handleLikeDemo = async (demoId) => {
    try {
      const result = await updateDemoStats(demoId, 'likes', 1);
      if (result.success) {
        setAllDemos(prevDemos =>
          prevDemos.map(demo =>
            demo.id === demoId ? { ...demo, likes: (demo.likes || 0) + 1 } : demo
          )
        );
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleUpdateTags = async (demoId, tags) => {
    try {
      const result = await updateDemoTags(demoId, tags);
      if (result.success) {
        setAllDemos(prevDemos =>
          prevDemos.map(demo =>
            demo.id === demoId ? { ...demo, tags: result.demo.tags } : demo
          )
        );
        setSelectedDemo(prev => (prev?.id === demoId ? { ...prev, tags: result.demo.tags } : prev));
        setIsTaggingModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  const handleUpdatePositions = async (demoId, positions) => {
    try {
      const result = await updateDemoPositions(demoId, positions);
      if (result.success) {
        setAllDemos(prevDemos =>
          prevDemos.map(demo =>
            demo.id === demoId ? { ...demo, positions: result.demo.positions } : demo
          )
        );
        setSelectedDemo(prev => (prev?.id === demoId ? { ...prev, positions: result.demo.positions } : prev));
      }
    } catch (error) {
      console.error('Error updating positions:', error);
    }
  };

  const findRelatedDemos = useCallback((demo, allDemos) => {
    if (!demo || !allDemos || allDemos.length === 0) {
      return [];
    }

    const related = allDemos.filter(
      (d) =>
        d.id !== demo.id && (
          d.players?.some((p) => demo.players?.includes(p)) ||
          d.tags?.some((t) => demo.tags?.includes(t))
        )
    );

    const shuffled = [...related].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, 3);
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const demos = await getDemosByMap(mapName, demoType);
      const mappedDemos = demos.map(mapDemoData);

      setAllDemos(mappedDemos);
      setDisplayedDemos(mappedDemos.slice(0, videosToShow));

      const options = await getFilterOptions();
      setFilterOptions(options);

      const initialTrending = [...mappedDemos]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);
      setTrendingDemos(initialTrending);

      const demosByYearResult = mappedDemos.reduce((acc, demo) => {
        const year = demo.year || 'Unknown Year';
        acc[year] = acc[year] ? [...acc[year], demo] : [demo];
        return acc;
      }, {});
      setDemosByYear(demosByYearResult);

      const demosByEventResult = mappedDemos.reduce((acc, demo) => {
        const event = demo.event || 'Unknown Event';
        acc[event] = acc[event] ? [...acc[event], demo] : [demo];
        return acc;
      }, {});
      setDemosByEvent(demosByEventResult);

      if (mappedDemos.length < videosToShow) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching demos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [mapName, demoType]);

  useEffect(() => {
    setDisplayedDemos(allDemos.slice(0, videosToShow));
    if (videosToShow >= allDemos.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [allDemos, videosToShow]);

  const loadMoreDemos = () => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setVideosToShow(prev => prev + 12);
      setIsLoadingMore(false);
    }
  };

  const handleResetFilters = () => {
    setFiltersApplied({});
  };

  const handleApplyFilters = (newFilters) => {
    setFiltersApplied(newFilters);
  };

  const observer = useRef();
  const lastDemoCallback = useCallback(
    (node) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreDemos();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, hasMore]
  );

  const mirageAreas = mapName === 'mirage' ? [
    { name: "A-Site", top: "20%", left: "10%", width: "30%", height: "30%" },
    { name: "Mid", top: "40%", left: "40%", width: "20%", height: "20%" },
    { name: "B-Site", top: "20%", left: "60%", width: "30%", height: "30%" },
  ] : [];

  if (isLoading && allDemos.length === 0) {
    return <LoadingFullscreen />;
  }

  if (selectedDemo) {
    return (
      <VideoPlayerPage
        selectedDemo={selectedDemo}
        relatedDemos={findRelatedDemos(selectedDemo, allDemos)}
        onClose={handleCloseVideoPlayer}
        onLike={handleLikeDemo}
        onOpenTagModal={() => setIsTaggingModalOpen(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200">
      <Navbar demoType={demoType} onSwitchDemoType={handleSwitchDemoType} />
      <main className="container mx-auto px-4 py-8 max-w-7xl custom-scrollbar">
        <FeaturedHero title={mapName} subtitle={`Explore professional CS:GO demos on ${mapName}`} />

        <section ref={mapSectionRef} className="mt-8 mb-16">
          <InteractiveMap mapName={mapName} handleAreaClick={handleAreaClick} areas={mirageAreas} />
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Latest Demos on {mapName}</h2>
            <Filter onClick={() => setIsFilterModalOpen(true)} className="text-yellow-400 cursor-pointer" />
          </div>

          {Object.entries(demosByYear).map(([year, demos]) => (
            <CategorySection key={year} title={`Demos from ${year}`} demos={demos} onSelectDemo={handleSelectDemo} />
          ))}

          {Object.entries(demosByEvent).map(([event, demos]) => (
            <CategorySection key={event} title={`Demos from ${event}`} demos={demos} onSelectDemo={handleSelectDemo} />
          ))}

          {trendingDemos.length > 0 && (
            <CategorySection title="Trending Demos" demos={trendingDemos} onSelectDemo={handleSelectDemo} />
          )}

          <h2 className="text-2xl font-semibold mt-8 mb-4">All Demos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedDemos.map((demo, index) => {
              if (displayedDemos.length === index + 1) {
                return (
                  <div key={demo.id} ref={lastDemoElementRef}>
                    <DemoCard demo={demo} onSelect={handleSelectDemo} />
                  </div>
                );
              } else {
                return (
                  <DemoCard key={demo.id} demo={demo} onSelect={handleSelectDemo} />
                );
              }
            })}
          </div>
          {isLoadingMore && <p className="text-center mt-4">Loading more demos...</p>}
          {!hasMore && <p className="text-center mt-4">No more demos to load.</p>}
        </section>
      </main>
      <Footer />

      {isTaggingModalOpen && selectedDemo && (
        <TaggingModal
          selectedDemo={selectedDemo}
          onClose={() => setIsTaggingModalOpen(false)}
          onUpdateTags={handleUpdateTags}
          onUpdatePositions={handleUpdatePositions}
        />
      )}

      {isFilterModalOpen && (
        <FilterModal
          demoType={demoType}
          filterOptions={filterOptions}
          filtersApplied={filtersApplied}
          onClose={() => setIsFilterModalOpen(false)}
          onFilterChange={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onApplyFilters={() => setIsFilterModalOpen(false)}
        />
      )}
    </div>
  );
}

export default MapPage;
