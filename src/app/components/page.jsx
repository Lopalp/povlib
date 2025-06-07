"use client";

import { useState } from "react";
import mockData from "../../components/mockComponentData.json";

// Typography
import LogoHeading from "../../components/typography/LogoHeading";

// Buttons
import BackButton from "../../components/buttons/BackButton";
import ImageButton from "../../components/buttons/ImageButton";
import DiscordSignInButton from "../../components/auth/DiscordSignInButton";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";

// Cards/Sections
import CategorySection from "../../components/containers/CategorySection";
import CategorySectionFeatured from "../../components/containers/CategorySectionFeatured";
import CategoryCarousel from "../../components/containers/CategoryCarousel";
import DemoCard from "../../components/POVlib/DemoCard";
import PlayerCard from "../../components/POVlib/PlayerCard";

// Modals
import UnderConstructionModal from "../../components/POVlib/UnderConstructionModal";
import SurveyModal from "../../components/POVlib/SurveyModal";
import FilterModal from "../../components/POVlib/FilterModal";
import ComparePlansModal from "../../components/POVlib/ComparePlansModal";
import CreateDemoModal from "../../components/POVlib/CreateDemoModal";
import TaggingModal from "../../components/POVlib/TaggingModal";

// Loading/Spinners
import { LoadingFullscreen } from "../../components/loading/LoadingFullscreen";
import { LoadingInline } from "../../components/loading/LoadingInline";

// Error
import ErrorWindow from "../../components/error/ErrorWindow";

// Helper to resolve demo IDs to objects
const getDemoById = (id) => mockData.demos.find((d) => d.id === id);

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
        {/* Color Palette */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            Color Palette
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

        {/* Brand Mark */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            Brand Mark
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <LogoHeading {...mockData.logoHeading} />
        </section>

        {/* Heading Styles Preview */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            Headings
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="space-y-8">
            {/* 3. Hero Page Headings */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
                Hero Page Headings
              </h1>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                MapsIndex, PlayersIndex, PlayerPage, etc.
              </div>
            </div>

            {/* 4. Modal/Panel Headings */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Modal/Panel Headings
              </h2>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                Modals, PlanComparisonModule, etc.
              </div>
            </div>

            {/* 2. Section Title with Yellow Border */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                <span className="border-l-4 border-yellow-400 pl-3 py-1">
                  Section Title with Yellow Border
                </span>
              </h2>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                CategorySection, etc.
              </div>
            </div>

            {/* 5. Settings/Tab Headings */}
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Settings/Tab Headings
              </h2>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                User page settings tab, etc.
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            Typography
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="space-y-8">
            {/* 1. Paragraph (Default Body) */}
            <div>
              <p className="text-gray-300 text-base leading-relaxed mb-3">
                This is a default paragraph style for body text and
                descriptions.
              </p>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                Used for most body text, descriptions, and general content.
                Gray, base size, relaxed line height.
              </div>
            </div>
            {/* 2. Paragraph (Large) */}
            <div>
              <p className="text-gray-300 text-lg leading-relaxed mb-3">
                This is a large paragraph for important descriptions or hero
                sections.
              </p>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                Used for hero/featured descriptions, larger body text. Gray,
                large size, relaxed line height.
              </div>
            </div>
            {/* 3. Label (Form/Field) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                This is a label for form fields or UI controls.
              </label>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                Used for form labels, field names, and UI controls. Small,
                medium weight, gray.
              </div>
            </div>
            {/* 4. Caption/Helper Text */}
            <div>
              <p className="text-xs text-gray-400 mt-1">
                This is a caption or helper text for inputs and UI elements.
              </p>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                Used for helper text, captions, or secondary info. Extra small,
                light gray.
              </div>
            </div>
            {/* 5. Section Label/Overline */}
            <div>
              <span className="uppercase text-sm font-semibold text-gray-400 tracking-wider block mb-2">
                This is a section label or overline.
              </span>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">
                Used for section labels, overlines, or small headers. Uppercase,
                small, semibold, gray, wide letter spacing.
              </div>
            </div>
          </div>
        </section>

        {/* Tags */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">Tags</h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div>
            <span className="bg-gray-700 text-white text-sm rounded-full px-3 py-1 inline-block mb-2">
              This is a tag or badge.
            </span>
            <div className="component-lib-mono text-xs text-gray-400 mb-3">
              Used for tags, badges, and status indicators. Small, white text,
              pill-shaped, gray background.
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            Buttons
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="space-y-8">
            {/* Navigation Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Navigation Buttons
              </h3>
              <div className="flex gap-4 flex-wrap">
                <BackButton text="Back" />
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors">
                  <span>Previous</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors">
                  <span>Next</span>
                </button>
              </div>
            </div>

            {/* Authentication Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Authentication Buttons
              </h3>
              <div className="flex gap-4 flex-wrap">
                <DiscordSignInButton />
                <GoogleSignInButton />
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Action Buttons
              </h3>
              <div className="flex gap-4 flex-wrap">
                <button className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono">
                  Primary Action
                </button>
                <button className="px-4 py-2 bg-gray-700 text-white rounded font-semibold hover:bg-gray-600 transition component-lib-mono">
                  Secondary Action
                </button>
                <button className="px-4 py-2 border border-gray-600 text-white rounded hover:border-yellow-400 transition component-lib-mono">
                  Tertiary Action
                </button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Icon Buttons
              </h3>
              <div className="flex gap-4 flex-wrap">
                <ImageButton
                  size={40}
                  imageSrc="/demo.png"
                  altText="Demo"
                  onClick={noop}
                />
                <button className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
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
                </button>
                <button className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
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
                </button>
              </div>
            </div>

            {/* Toggle Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Toggle Buttons
              </h3>
              <div className="flex gap-4 flex-wrap">
                <button className="px-6 py-3 text-sm font-bold text-yellow-400 border-b-2 border-yellow-400">
                  Active Tab
                </button>
                <button className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white">
                  Inactive Tab
                </button>
              </div>
            </div>

            {/* Form Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Form Buttons
              </h3>
              <div className="flex gap-4 flex-wrap">
                <button className="px-4 py-2 bg-yellow-500 text-black rounded-md font-semibold hover:bg-yellow-600 transition">
                  Submit
                </button>
                <button className="px-4 py-2 bg-gray-700 text-gray-500 rounded-md font-semibold cursor-not-allowed">
                  Disabled
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            Sections
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="space-y-8">
            <CategorySection
              title="Grid Section"
              demos={mockData.categorySection.demos
                .map(getDemoById)
                .filter(Boolean)}
              onSelectDemo={noop}
            />

            <CategorySectionFeatured
              title="Featured Section"
              demos={mockData.categorySectionFeatured.demos
                .map(getDemoById)
                .filter(Boolean)}
              onSelectDemo={noop}
            />

            <CategoryCarousel
              title="Carousel Section"
              demos={mockData.categoryCarousel.demos
                .map(getDemoById)
                .filter(Boolean)}
              onSelectDemo={noop}
            />

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

        {/* Cards */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            Cards
          </h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DemoCard demo={mockData.demo} onSelect={noop} />
            <PlayerCard {...mockData.playerCard} />
            <div className="bg-gray-900 rounded-2xl p-8 space-y-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Competition
                  </h2>
                  <button className="p-1 rounded-full hover:bg-gray-800">
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
                      className="text-gray-400 hover:text-white"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </button>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-yellow-400 border border-yellow-400">
                  Time Left
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Modals */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            Modals
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

        {/* Loading/Spinners */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">
            Loading/Spinners
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
      </div>
    </main>
  );
}
