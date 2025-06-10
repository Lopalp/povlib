"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoPlayerPage from "../../../components/features/VideoPlayerPage";
import TaggingModal from "../../../components/modals/TaggingModal";
import { LoadingFullscreen } from "../../../components/loading/LoadingFullscreen";
import ErrorDisplay from "../../../components/error/ErrorDisplay";
import {
  getDemoById,
  getFilterOptions,
  updateDemoStats,
  updateDemoTags,
  updateDemoPositions,
  getFilteredDemos,
} from "../../../lib/supabase";

// Map demo data to the format expected by VideoPlayerPage
const mapDemoData = (demo) => ({
  id: demo.id,
  title: demo.title,
  thumbnail: demo.thumbnail,
  videoId: demo.video_id,
  video_id: demo.video_id,
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
  video_url: demo.video_url,
  dem_url: demo.dem_url,
  matchroom_url: demo.matchroom_url,
});

export default function DemoPage({ params }) {
  const { demo_id } = React.use(params);
  const router = useRouter();

  const [selectedDemo, setSelectedDemo] = useState(null);
  const [relatedDemos, setRelatedDemos] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [demoType, setDemoType] = useState("pro");

  useEffect(() => {
    const loadDemoData = async () => {
      try {
        setIsLoading(true);

        // Load demo data and filter options in parallel
        const [demoData, options] = await Promise.all([
          getDemoById(demo_id),
          getFilterOptions(),
        ]);

        if (!demoData) {
          setError("Demo not found");
          setIsLoading(false);
          return;
        }

        const mappedDemo = mapDemoData(demoData);
        setSelectedDemo(mappedDemo);
        setFilterOptions(options);

        // Load related demos based on map and players
        const allDemos = await getFilteredDemos({}, "all");
        const related = allDemos
          .filter(
            (d) =>
              d.id !== mappedDemo.id &&
              (d.map === mappedDemo.map ||
                d.players.some((p) => mappedDemo.players.includes(p)))
          )
          .map(mapDemoData)
          .slice(0, 10);

        setRelatedDemos(related);

        // Update view count
        updateDemoStats(demo_id, "views", 1).catch((err) =>
          console.error("Error updating views:", err)
        );

        setIsLoading(false);
      } catch (err) {
        console.error("Error loading demo data:", err);
        setError("Failed to load demo data. Please try again later.");
        setIsLoading(false);
      }
    };

    loadDemoData();
  }, [demo_id]);

  const handleLikeDemo = async (demoId) => {
    try {
      const result = await updateDemoStats(demoId, "likes", 1);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setSelectedDemo({ ...selectedDemo, likes: updatedDemo.likes });
      }
    } catch (err) {
      console.error("Error liking demo:", err);
    }
  };

  const handleUpdateTags = async (demoId, tags) => {
    try {
      const result = await updateDemoTags(demoId, tags);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setSelectedDemo({ ...selectedDemo, tags: updatedDemo.tags });
        setIsTaggingModalOpen(false);
      }
    } catch (err) {
      console.error("Error updating tags:", err);
    }
  };

  const handleUpdatePositions = async (demoId, positions) => {
    try {
      const result = await updateDemoPositions(demoId, positions);
      if (result.success) {
        const updatedDemo = mapDemoData(result.demo);
        setSelectedDemo({ ...selectedDemo, positions: updatedDemo.positions });
      }
    } catch (err) {
      console.error("Error updating positions:", err);
    }
  };

  const handleSelectRelatedDemo = (demoId) => {
    router.push(`/demos/${demoId}`);
  };

  if (isLoading) {
    return <LoadingFullscreen />;
  }

  if (error) {
    return <ErrorDisplay error={error} onBack={() => router.back()} />;
  }

  if (!selectedDemo) {
    return <LoadingFullscreen />;
  }

  return (
    <>
      <VideoPlayerPage
        selectedDemo={selectedDemo}
        relatedDemos={relatedDemos}
        onClose={() => router.back()}
        onLike={handleLikeDemo}
        onOpenTagModal={() => setIsTaggingModalOpen(true)}
        onSelectRelatedDemo={handleSelectRelatedDemo}
        demoType={demoType}
        setDemoType={setDemoType}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {isTaggingModalOpen && selectedDemo && (
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
