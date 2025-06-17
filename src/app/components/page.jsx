"use client";

import { useState, useRef } from "react";
import mockData from "../../components/mockComponentData.json";
import React from "react";
import {
  MoreHorizontal,
  TagIcon,
  Bookmark,
  Flag,
  Download,
  FileText,
  ExternalLink,
} from "lucide-react";
 
// Brand
import Logo from "../../components/brand/Logo";
import BrandHeading from "../../components/brand/BrandHeading";
import LogoHeading from "../../components/brand/LogoHeading";

// headings
import HeroHeading from "../../components/headings/HeroHeading";
import ModalHeading from "../../components/headings/ModalHeading";
import SectionHeading from "../../components/headings/SectionHeading";
import SettingsHeading from "../../components/headings/SettingsHeading";

//tags
import { Tag } from "../../components/tags";

// Typography
import {
  BodyText,
  Label,
  Caption,
  SectionLabel,
} from "../../components/typography";

// Buttons
import BackButton from "../../components/buttons/BackButton";
import DiscordSignInButton from "../../components/auth/DiscordSignInButton";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  IconButton,
  NavigationButton,
  ToggleButton,
} from "../../components/buttons";
import ContentTabs from "../../components/buttons/ContentTabs";

// Cards/Sections
import CategorySection from "../../components/features/CategorySection";
import CategorySectionFeatured from "../../components/sections/CategorySectionFeatured";
import ImprovedDemoCarousel from "../../components/features/DemoCarousel";
import DemoCard from "../../components/cards/DemoCard";
import PlayerCard from "../../components/cards/PlayerCard";
import CompetitionCard from "../../components/cards/CompetitionCard";

// Feature Components
import FeaturedHero from "../../components/features/FeaturedHero";
import CompetitionModule from "../../components/features/CompetitionModule";
import PlanComparisonModule from "../../components/features/PlanComparisonModule";
import CategoryCarousel from "../../components/features/CategoryCarousel";
import VideoPlayerPage from "../../components/features/VideoPlayerPage";
import UtilityBook from "../../components/features/UtilityBook";
import MapGrid from "../../components/features/MapGrid";
import MatchTimeline from "../../components/features/MatchTimeline";

//menus

// Misc Components
import MapQuickFilters from "../../components/misc/MapQuickFilters";
import FilterTags from "../../components/misc/FilterTags";
import SelectedFilters from "../../components/misc/SelectedFilters";
import { Switch } from "../../components/misc/Switch";
import SingleQuestion from "../../components/misc/SingleQuestion";
import UserQuestionModule from "../../components/misc/UserQuestionModule";

// Modals
import UnderConstructionModal from "../../components/modals/UnderConstructionModal";
import SurveyModal from "../../components/modals/SurveyModal";
import FilterModal from "../../components/modals/FilterModal";
import ComparePlansModal from "../../components/modals/ComparePlansModal";
import CreateDemoModal from "../../components/modals/CreateDemoModal";
import TaggingModal from "../../components/modals/TaggingModal";

// Loading/Spinners
import { LoadingFullscreen } from "../../components/loading/LoadingFullscreen";
import { LoadingInline } from "../../components/loading/LoadingInline";
import YouTubeEmbed from "../../components/media/YouTubeEmbed";

// Error
import ErrorWindow from "../../components/error/ErrorWindow";
import ErrorDisplay from "../../components/error/ErrorDisplay";

// Helper to resolve demo IDs to objects
const getDemoById = (id) => mockData.demos.find((d) => d.id === id);

// Add mock demo data for ActionsMenu
const mockDemo = {
  id: "demo-123",
  title: "Incredible AWP Ace",
  video_url: "https://example.com/video.mp4",
  dem_url: "https://example.com/demo.dem",
  matchroom_url: "https://example.com/matchroom",
  likes: 1234,
  tags: ["AWP", "Ace", "Clutch"],
  players: ["Player1", "Player2"],
  team: "Team Alpha",
  event: "ESL Pro League Season 18",
};

import ActionsMenu from "../../components/menus/ActionsMenu";

export default function ComponentsPlayground() {
  // No-op function for callbacks
  const noop = () => {};

  // Modal open states
  const [showUnderConstruction, setShowUnderConstruction] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showComparePlans, setShowComparePlans] = useState(false);
  const [showCreateDemo, setShowCreateDemo] = useState(false);
  const [showTagging, setShowTagging] = useState(false);
  const [showError, setShowError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState("bottom-right");
  const [activeTab, setActiveTab] = useState("all");
  const menuTriggerRef = useRef(null);

  // Misc component states
  const [filtersApplied, setFiltersApplied] = useState({
    map: "Mirage",
    position: "Window",
    player: "s1mple",
    team: "",
    year: "",
    event: "",
    result: "",
    search: "",
  });
  const [switchChecked, setSwitchChecked] = useState(true);
  const [singleQuestionAnswer, setSingleQuestionAnswer] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="container mx-auto px-6 py-12 relative min-h-screen">
      {/* Full-page background, but content stays centered */}
      <style>{`
        .component-lib-mono {
          font-family: 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
        }
        .component-lib-bg {
          background: linear-gradient(135deg, #23272f 0%, #181a20 100%);
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
        }
      `}</style>
      <div className="component-lib-bg" />
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-8 component-lib-mono">
          POVlib UI Playground
        </h1>

        {/* Table of Contents */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            table of contents
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="#auth"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              auth
            </a>
            <a
              href="#brand"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              brand
            </a>
            <a
              href="#buttons"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              buttons
            </a>
            <a
              href="#cards"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              cards
            </a>
            <a
              href="#colors"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              colors
            </a>
            <a
              href="#error"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              error
            </a>
            <a
              href="#features"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              features
            </a>
            <a
              href="#headings"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              headings
            </a>
            <a
              href="#loading"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              loading
            </a>
            <a
              href="#media"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              media
            </a>
            <a
              href="#menus"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              menus
            </a>
            <a
              href="#misc"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              misc
            </a>
            <a
              href="#modals"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              modals
            </a>
            <a
              href="#sections"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              sections
            </a>
            <a
              href="#tags"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              tags
            </a>
            <a
              href="#typography"
              className="text-gray-300 hover:text-yellow-400 transition-colors component-lib-mono"
            >
              typography
            </a>
          </div>
        </section>

        {/* auth */}
        <section id="auth" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">auth</h2>
          <hr className="border-t border-yellow-400/40 mb-8" />

          {/* Sign In Buttons */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
              Sign In Buttons
            </h3>
            <div className="flex gap-4 flex-wrap">
              <DiscordSignInButton />
              <GoogleSignInButton />
            </div>
          </div>
        </section>

        {/* brand */}
        <section id="brand" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            brand
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <Logo size={2} />
          <BrandHeading size={2} />
          <LogoHeading {...mockData.logoHeading} />
        </section>

        {/* buttons */}
        <section id="buttons" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            buttons
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="space-y-8">
            {/* Navigation Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
                Navigation Buttons
              </h3>
              <div className="flex gap-4 flex-wrap">
                <BackButton text="Back" />
                <NavigationButton>
                  <span>Previous</span>
                </NavigationButton>
                <NavigationButton>
                  <span>Next</span>
                </NavigationButton>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
                Action Buttons
              </h3>
              <div className="flex gap-4 flex-wrap">
                <PrimaryButton>Primary Action</PrimaryButton>
                <SecondaryButton>Secondary Action</SecondaryButton>
                <TertiaryButton>Tertiary Action</TertiaryButton>
              </div>
            </div>

            {/* Icon Buttons */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
                Icon Buttons
              </h3>
              <div className="flex gap-4 flex-wrap">
                <IconButton>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </IconButton>
                <IconButton>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="18" r="3"></circle>
                    <circle cx="6" cy="6" r="3"></circle>
                    <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                    <path d="M6 9v12a2 2 0 0 0 2 2h7"></path>
                  </svg>
                </IconButton>
              </div>
            </div>

            {/* Toggle Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
                Toggle Buttons
              </h3>
              <div className="flex gap-4 flex-wrap">
                <ToggleButton active>Active Tab</ToggleButton>
                <ToggleButton>Inactive Tab</ToggleButton>
              </div>
            </div>

            {/* Content Tabs */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
                Content Tabs
              </h3>
              <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="component-lib-mono text-xs text-gray-400 mt-3">
                Interactive tabs for content filtering. Active tab:{" "}
                <span className="text-yellow-400">{activeTab}</span>
              </div>
            </div>

            {/* Form Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
                Form Buttons
              </h3>
              <div className="flex gap-4 flex-wrap">
                <PrimaryButton>Submit</PrimaryButton>
                <SecondaryButton disabled>Disabled</SecondaryButton>
              </div>
            </div>
          </div>
        </section>

        {/* cards */}
        <section id="cards" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            cards
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DemoCard demo={mockData.demo} onSelect={noop} />
            <PlayerCard {...mockData.playerCard} />
            <CompetitionCard />
          </div>
        </section>

        {/* colors */}
        <section id="colors" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            colors
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div>
            {[
              { name: "Brand Yellow", hex: "#FBBF24", tailwind: "yellow-400" },
              { name: "Gray 900", hex: "#181a20", tailwind: "gray-900" },
              { name: "Gray 800", hex: "#23272f", tailwind: "gray-800" },
              { name: "Gray 700", hex: "#374151", tailwind: "gray-700" },
              { name: "Gray 400", hex: "#9CA3AF", tailwind: "gray-400" },
              { name: "White", hex: "#FFFFFF", tailwind: "white" },
              { name: "Black", hex: "#000000", tailwind: "black" },
              { name: "Discord Blue", hex: "#7289da", tailwind: null },
              { name: "BG Light", hex: "#ffffff", tailwind: null },
              { name: "BG Dark", hex: "#0a0a0a", tailwind: null },
              { name: "Text Light", hex: "#ededed", tailwind: null },
              { name: "Text Dark", hex: "#171717", tailwind: null },
            ].map((color) => (
              <div
                key={color.hex}
                className="bg-gray-800 rounded-md border border-gray-700 p-1 align-top inline-block mr-2 mb-2"
                style={{ width: 110, verticalAlign: "top" }}
              >
                <div
                  className="w-10 h-10 rounded border border-gray-700 mb-1 mx-auto"
                  style={{ background: color.hex }}
                />
                <span
                  className="component-lib-mono text-xs text-gray-200 text-center leading-tight truncate w-full block"
                  title={color.name}
                >
                  {color.name}
                </span>
                <span
                  className="component-lib-mono text-[10px] text-gray-400 truncate w-full block text-center"
                  title={color.hex}
                >
                  {color.hex}
                </span>
                <button
                  className="mt-1 p-3 bg-gray-700 hover:bg-yellow-400 hover:text-black text-gray-200 rounded border border-gray-600 transition flex items-center justify-center mx-auto"
                  style={{ width: 40, height: 40 }}
                  onClick={() => {
                    navigator.clipboard.writeText(color.hex);
                  }}
                  aria-label={`Copy ${color.hex}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Error Components */}
        <section id="error" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            error
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4 component-lib-mono">
                ErrorDisplay
              </h3>
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 h-150">
                <ErrorDisplay
                  error="This is an example error message"
                  onBack={() => alert("Back button clicked")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* features */}
        <section id="features" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            features
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />

          <div className="space-y-12">
            {/* FeaturedHero */}
            <div>
              <h3 className="text-lg font-medium mb-4 component-lib-mono">
                FeaturedHero
              </h3>
              <div className="max-w-full">
                <FeaturedHero
                  demo={mockData.featuredHero}
                  autoplayVideo={false}
                  setSelectedDemo={noop}
                  setActiveVideoId={noop}
                  setIsFilterModalOpen={noop}
                />
              </div>
            </div>

            {/* CompetitionModule */}
            <div>
              <h3 className="text-lg font-medium mb-4 component-lib-mono">
                CompetitionModule
              </h3>
              <div className="max-w-full">
                <CompetitionModule
                  title={mockData.competitionModule.title}
                  clipCount={mockData.competitionModule.clipCount}
                />
              </div>
            </div>

            {/* PlanComparisonModule */}
            <div>
              <h3 className="text-lg font-medium mb-4 component-lib-mono">
                PlanComparisonModule
              </h3>
              <div className="max-w-full">
                <PlanComparisonModule
                  currentPlan={mockData.planComparisonModule.currentPlan}
                  onUpgrade={noop}
                />
              </div>
            </div>

            {/* CategoryCarousel */}
            <div>
              <h3 className="text-lg font-medium mb-4 component-lib-mono">
                CategoryCarousel
              </h3>
              <div className="max-w-full">
                <CategoryCarousel
                  title="Featured Clips"
                  demos={mockData.demos}
                  onSelectDemo={noop}
                />
              </div>
            </div>

            {/* UtilityBook */}
            <div>
              <h3 className="text-lg font-medium mb-4 component-lib-mono">
                UtilityBook
              </h3>
              <div className="max-w-full bg-gray-800 p-6 rounded-lg">
                <UtilityBook
                  selectedMap={mockData.utilityBook.selectedMap}
                  selectedPosition={mockData.utilityBook.selectedPosition}
                  onMapChange={noop}
                  onPositionChange={noop}
                />
              </div>
            </div>

            {/* MapGrid */}
            <div>
              <h3 className="text-lg font-medium mb-4 component-lib-mono">
                MapGrid
              </h3>
              <div className="max-w-full">
                <MapGrid
                  filterOptions={mockData.filterModal.filterOptions}
                  getFilteredDemosByMap={(mapName) =>
                    mockData.demos.filter((demo) => demo.map === mapName)
                  }
                  setFiltersApplied={noop}
                />
              </div>
            </div>

            {/* MatchTimeline */}
            <div>
              <h3 className="text-lg font-medium mb-4 component-lib-mono">
                MatchTimeline
              </h3>
              <div className="max-w-full">
                <MatchTimeline matchData={mockData.matchTimeline} />
              </div>
            </div>

            {/* VideoPlayerPage */}
            <div>
              <h3 className="text-lg font-medium mb-4 component-lib-mono">
                VideoPlayerPage
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Note: VideoPlayerPage is a full-page component. Use carefully in
                production.
              </p>
              <div className="border border-yellow-400/20 rounded-lg p-4 max-h-96 overflow-hidden">
                <div className="transform scale-50 origin-top-left w-[200%] h-[200%]">
                  <VideoPlayerPage
                    selectedDemo={mockData.videoPlayerPage}
                    onClose={noop}
                    onLike={noop}
                    onOpenTagModal={noop}
                    relatedDemos={mockData.demos}
                    filterOptions={mockData.filterModal.filterOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* headings */}
        <section id="headings" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            headings
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="space-y-8">
            {/* 3. Hero Page Headings */}
            <div>
              <HeroHeading>Hero Page Headings</HeroHeading>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                MapsIndex, PlayersIndex, PlayerPage, etc.
              </div>
            </div>

            {/* 4. Modal/Panel Headings */}
            <div>
              <ModalHeading>Modal/Panel Headings</ModalHeading>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                Modals, PlanComparisonModule, etc.
              </div>
            </div>

            {/* 2. Section Title with Yellow Border */}
            <div>
              <SectionHeading>Section Title with Yellow Border</SectionHeading>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                CategorySection, etc.
              </div>
            </div>

            {/* 5. Settings/Tab Headings */}
            <div>
              <SettingsHeading>Settings/Tab Headings</SettingsHeading>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                User page settings tab, etc.
              </div>
            </div>
          </div>
        </section>

        {/* loading/spinners */}
        <section id="loading" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            loading
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="flex items-center gap-8">
            <div
              className="flex items-center justify-center bg-gray-800 rounded-lg"
              style={{ width: 320, height: 180 }}
            >
              <LoadingFullscreen spinnerOnly />
            </div>
            <div
              className="flex items-center justify-center bg-gray-800 rounded-lg"
              style={{ width: 320, height: 180 }}
            >
              <LoadingInline spinnerOnly />
            </div>
          </div>
        </section>

        {/* Media Components */}
        <section id="media" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            media
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4 component-lib-mono">
                YouTubeEmbed
              </h3>
              <div className="max-w-100">
                <YouTubeEmbed videoId="dQw4w9WgXcQ" />
              </div>
            </div>
          </div>
        </section>

        {/* menus */}
        <section id="menus" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            menus
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />

          {/* Actions Menu */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
              Actions Menu
            </h3>
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">Position:</span>
                <select
                  value={menuPosition}
                  onChange={(e) => setMenuPosition(e.target.value)}
                  className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-700"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>
              <div className="relative inline-block">
                <IconButton
                  ref={menuTriggerRef}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </IconButton>
                <ActionsMenu
                  isOpen={menuOpen}
                  onClose={() => setMenuOpen(false)}
                  position={menuPosition}
                  triggerRef={menuTriggerRef}
                  items={[
                    {
                      icon: <TagIcon className="h-4 w-4 text-yellow-400" />,
                      label: "Add Tag",
                      onClick: () => {
                        console.log("Open tag modal");
                        setMenuOpen(false);
                      },
                    },
                    {
                      icon: <Bookmark className="h-4 w-4 text-yellow-400" />,
                      label: "Save",
                      onClick: () => setMenuOpen(false),
                    },
                    {
                      icon: <Flag className="h-4 w-4 text-red-500" />,
                      label: "Report",
                      onClick: () => setMenuOpen(false),
                    },
                    {
                      icon: <Download className="h-4 w-4 text-yellow-400" />,
                      label: "Download Video",
                      onClick: () => {
                        window.open(mockDemo.video_url);
                        setMenuOpen(false);
                      },
                    },
                    {
                      icon: <FileText className="h-4 w-4 text-yellow-400" />,
                      label: "Download Demo",
                      onClick: () => {
                        window.open(mockDemo.dem_url);
                        setMenuOpen(false);
                      },
                    },
                    {
                      icon: (
                        <ExternalLink className="h-4 w-4 text-yellow-400" />
                      ),
                      label: "Open Matchroom",
                      onClick: () => {
                        window.open(mockDemo.matchroom_url, "_blank");
                        setMenuOpen(false);
                      },
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* misc */}
        <section id="misc" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">misc</h2>
          <hr className="border-t border-yellow-400/40 mb-8" />

          <div className="space-y-12">
            {/* Switch */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
                Switch
              </h3>
              <div className="space-y-4">
                <Switch
                  checked={switchChecked}
                  onChange={(e) => setSwitchChecked(e.target.checked)}
                  label="Enable notifications"
                />
                <Switch
                  checked={false}
                  onChange={noop}
                  label="Disabled switch"
                />
                <Switch checked={true} onChange={noop} />
              </div>
            </div>

            {/* SingleQuestion */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
                SingleQuestion
              </h3>
              <div className="space-y-6 max-w-md">
                <SingleQuestion
                  questionText="What's your favorite CS2 map?"
                  type="text"
                  answer={singleQuestionAnswer}
                  onChange={setSingleQuestionAnswer}
                  onSubmit={() => {
                    console.log("Submitted:", singleQuestionAnswer);
                    setSingleQuestionAnswer("");
                  }}
                  disabled={!singleQuestionAnswer}
                />
                <SingleQuestion
                  questionText="How would you rate your experience?"
                  type="radio"
                  options={["Excellent", "Good", "Fair", "Poor"]}
                  answer=""
                  onChange={noop}
                  onSubmit={noop}
                  disabled={false}
                />
              </div>
            </div>

            {/* MapQuickFilters */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
                MapQuickFilters
              </h3>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <MapQuickFilters
                  filterOptions={mockData.filterModal.filterOptions}
                  demos={mockData.demos}
                  setFiltersApplied={setFiltersApplied}
                />
              </div>
            </div>

            {/* FilterTags */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
                FilterTags
              </h3>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <FilterTags
                  filtersApplied={filtersApplied}
                  setFiltersApplied={setFiltersApplied}
                  handleResetFilters={() =>
                    setFiltersApplied({
                      map: "",
                      position: "",
                      player: "",
                      team: "",
                      year: "",
                      event: "",
                      result: "",
                      search: "",
                    })
                  }
                />
              </div>
            </div>

            {/* SelectedFilters */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
                SelectedFilters
              </h3>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <SelectedFilters
                  filtersApplied={filtersApplied}
                  setFiltersApplied={setFiltersApplied}
                  searchQuery={searchQuery}
                />
              </div>
            </div>

            {/* UserQuestionModule */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
                UserQuestionModule
              </h3>
              <div className="space-y-6">
                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-4">
                    Single Question Mode
                  </h4>
                  <UserQuestionModule
                    mode="single"
                    useCase="feedback"
                    onSubmit={(data) =>
                      console.log("Feedback submitted:", data)
                    }
                  />
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-4">
                    Survey Mode
                  </h4>
                  <UserQuestionModule
                    mode="survey"
                    useCase="support"
                    onSubmit={(data) => console.log("Support submitted:", data)}
                  />
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-4">
                    Profile Mode
                  </h4>
                  <UserQuestionModule
                    mode="single"
                    useCase="profile"
                    onSubmit={(data) => console.log("Profile submitted:", data)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* modals */}
        <section id="modals" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            modals
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowUnderConstruction(true)}
            >
              Under Construction Modal
            </button>
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowSurvey(true)}
            >
              Survey Modal
            </button>
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowFilter(true)}
            >
              Filter Modal
            </button>
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowComparePlans(true)}
            >
              Compare Plans Modal
            </button>
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowCreateDemo(true)}
            >
              Create Demo Modal
            </button>
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowTagging(true)}
            >
              Tagging Modal
            </button>
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowError(true)}
            >
              Error Modal
            </button>
          </div>
          {showUnderConstruction && (
            <UnderConstructionModal
              isOpen={true}
              onClose={() => setShowUnderConstruction(false)}
            />
          )}
          {showSurvey && (
            <SurveyModal
              isOpen={true}
              onClose={() => setShowSurvey(false)}
              tabs={mockData.surveyModal.tabs}
              useCase={mockData.surveyModal.useCase}
              onSubmit={noop}
            />
          )}
          {showFilter && (
            <FilterModal
              demoType={mockData.filterModal.demoType}
              filterOptions={mockData.filterModal.filterOptions}
              filtersApplied={mockData.filterModal.filtersApplied}
              onClose={() => setShowFilter(false)}
              onFilterChange={noop}
              onResetFilters={noop}
              onApplyFilters={noop}
            />
          )}
          {showComparePlans && (
            <ComparePlansModal
              isOpen={true}
              onClose={() => setShowComparePlans(false)}
              currentPlan={mockData.comparePlansModal.currentPlan}
            />
          )}
          {showCreateDemo && (
            <CreateDemoModal
              isOpen={true}
              onClose={() => setShowCreateDemo(false)}
              matchLink={mockData.createDemoModal.matchLink}
              onMatchLinkChange={noop}
              onMatchLinkSubmit={noop}
              selectedFile={mockData.createDemoModal.selectedFile}
              onFileChange={noop}
              onFileSubmit={noop}
              uploadError={mockData.createDemoModal.uploadError}
              onLinkAccount={noop}
            />
          )}
          {showTagging && (
            <TaggingModal
              selectedDemo={getDemoById(mockData.taggingModal.selectedDemo)}
              filterOptions={mockData.taggingModal.filterOptions}
              onClose={() => setShowTagging(false)}
              onUpdateTags={noop}
              onUpdatePositions={noop}
            />
          )}
          {showError && (
            <ErrorWindow
              {...mockData.errorWindow}
              onClose={() => setShowError(false)}
            />
          )}
        </section>

        {/* sections */}
        <section id="sections" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            sections
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="space-y-8">
            <CategorySection
              title="Grid Section"
              demos={mockData.categorySection.demos
                .map(getDemoById)
                .filter(Boolean)}
              onSelectDemo={noop}
              minCardWidth={280}
              gap={24}
            />

            <CategorySectionFeatured
              title="Featured Section"
              demos={mockData.categorySectionFeatured.demos
                .map(getDemoById)
                .filter(Boolean)}
              onSelectDemo={noop}
              gap={24}
            />

            {/* Carousel Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4 component-lib-mono">
                Carousel Section
              </h3>
              <div className="max-h-[300px] overflow-hidden">
                <ImprovedDemoCarousel
                  title="Featured Demos"
                  demos={mockData.categoryCarousel.demos
                    .map(getDemoById)
                    .filter(Boolean)}
                  onSelectDemo={noop}
                  gap={24}
                />
              </div>
            </div>

            <div className="border-t border-gray-700">
              <button className="w-full flex justify-between items-center px-4 py-3 text-left bg-gray-800 hover:bg-gray-700 transition-colors">
                <span className="text-lg font-semibold text-gray-200">
                  Collapsible Section
                </span>
                <span className="text-gray-400">+</span>
              </button>
            </div>
          </div>
        </section>

        {/* tags */}
        <section id="tags" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">tags</h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="space-y-6">
            {/* Default Tag */}
            <div>
              <Tag>This is a default tag</Tag>
              <div className="component-lib-mono text-xs text-gray-400 mt-2">
                Default tag variant. Gray background, white text.
              </div>
            </div>

            {/* Primary Tag */}
            <div>
              <Tag variant="primary">Primary Tag</Tag>
              <div className="component-lib-mono text-xs text-gray-400 mt-2">
                Primary variant. Yellow background, black text.
              </div>
            </div>

            {/* Secondary Tag */}
            <div>
              <Tag variant="secondary">Secondary Tag</Tag>
              <div className="component-lib-mono text-xs text-gray-400 mt-2">
                Secondary variant. Transparent with white border.
              </div>
            </div>

            {/* Different Sizes */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag size="xs">Extra Small</Tag>
                <Tag size="sm">Small</Tag>
                <Tag size="md">Medium</Tag>
                <Tag size="lg">Large</Tag>
              </div>
              <div className="component-lib-mono text-xs text-gray-400">
                Different tag sizes: xs, sm, md, lg.
              </div>
            </div>

            {/* Status Tags */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag variant="success">Success</Tag>
                <Tag variant="warning">Warning</Tag>
                <Tag variant="danger">Danger</Tag>
              </div>
              <div className="component-lib-mono text-xs text-gray-400">
                Status tags for different states and notifications.
              </div>
            </div>
          </div>
        </section>

        {/* typography */}
        <section id="typography" className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            typography
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="space-y-8">
            {/* 1. Paragraph (Default Body) */}
            <div>
              <BodyText className="mb-3">
                This is a default paragraph style for body text and
                descriptions.
              </BodyText>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                Used for most body text, descriptions, and general content.
                Gray, base size, relaxed line height.
              </div>
            </div>
            {/* 2. Paragraph (Large) */}
            <div>
              <BodyText size="lg" className="mb-3">
                This is a large paragraph for important descriptions or hero
                sections.
              </BodyText>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                Used for hero/featured descriptions, larger body text. Gray,
                large size, relaxed line height.
              </div>
            </div>
            {/* 3. Label (Form/Field) */}
            <div>
              <Label className="mb-2">
                This is a label for form fields or UI controls.
              </Label>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                Used for form labels, field names, and UI controls. Small,
                medium weight, gray.
              </div>
            </div>
            {/* 4. Caption/Helper Text */}
            <div>
              <Caption className="mt-1">
                This is a caption or helper text for inputs and UI elements.
              </Caption>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                Used for helper text, captions, or secondary info. Extra small,
                light gray.
              </div>
            </div>
            {/* 5. Section Label/Overline */}
            <div>
              <SectionLabel className="mb-2">
                This is a section label or overline.
              </SectionLabel>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                Used for section labels, overlines, or small headers. Uppercase,
                small, semibold, gray, wide letter spacing.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
