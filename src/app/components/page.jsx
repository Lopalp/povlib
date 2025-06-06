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
        <h1 className="text-4xl font-bold mb-8 component-lib-mono">POVlib UI Playground</h1>
        {/* Color Palette */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">Color Palette</h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div>
            {[
              { name: 'Brand Yellow', hex: '#FBBF24', tailwind: 'yellow-400' },
              { name: 'Gray 900', hex: '#181a20', tailwind: 'gray-900' },
              { name: 'Gray 800', hex: '#23272f', tailwind: 'gray-800' },
              { name: 'Gray 700', hex: '#374151', tailwind: 'gray-700' },
              { name: 'Gray 400', hex: '#9CA3AF', tailwind: 'gray-400' },
              { name: 'White', hex: '#FFFFFF', tailwind: 'white' },
              { name: 'Black', hex: '#000000', tailwind: 'black' },
              { name: 'Discord Blue', hex: '#7289da', tailwind: null },
              { name: 'BG Light', hex: '#ffffff', tailwind: null },
              { name: 'BG Dark', hex: '#0a0a0a', tailwind: null },
              { name: 'Text Light', hex: '#ededed', tailwind: null },
              { name: 'Text Dark', hex: '#171717', tailwind: null },
            ].map((color) => (
              <div
                key={color.hex}
                className="bg-gray-800 rounded-md border border-gray-700 p-1 align-top inline-block mr-2 mb-2"
                style={{ width: 110, verticalAlign: 'top' }}
              >
                <div
                  className="w-10 h-10 rounded border border-gray-700 mb-1 mx-auto"
                  style={{ background: color.hex }}
                />
                <span className="component-lib-mono text-xs text-gray-200 text-center leading-tight truncate w-full block" title={color.name}>{color.name}</span>
                <span className="component-lib-mono text-[10px] text-gray-400 truncate w-full block text-center" title={color.hex}>{color.hex}</span>
                <button
                  className="mt-1 p-3 bg-gray-700 hover:bg-yellow-400 hover:text-black text-gray-200 rounded border border-gray-600 transition flex items-center justify-center mx-auto"
                  style={{ width: 40, height: 40 }}
                  onClick={() => {
                    navigator.clipboard.writeText(color.hex);
                  }}
                  aria-label={`Copy ${color.hex}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Mark */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">Brand Mark</h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <LogoHeading {...mockData.logoHeading} />
        </section>

        {/* Heading Styles Preview */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">Headings</h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="space-y-8">
          {/* 3. Hero Page Headings */}
          <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">Hero Page Headings</h1>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">MapsIndex, PlayersIndex, PlayerPage, etc.</div>
            </div>

            {/* 4. Modal/Panel Headings */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Modal/Panel Headings</h2>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">Modals, PlanComparisonModule, etc.</div>
            </div>

            {/* 2. Section Title with Yellow Border */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                <span className="border-l-4 border-yellow-400 pl-3 py-1">Section Title with Yellow Border</span>
              </h2>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">CategorySection, etc.</div>
            </div>
            
            {/* 5. Settings/Tab Headings */}
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Settings/Tab Headings</h2>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">User page settings tab, etc.</div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">Typography</h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="space-y-8">
            {/* 1. Paragraph (Default Body) */}
            <div>
              <p className="text-gray-300 text-base leading-relaxed mb-3">
                This is a default paragraph style for body text and descriptions.
              </p>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">Used for most body text, descriptions, and general content. Gray, base size, relaxed line height.</div>
            </div>
            {/* 2. Paragraph (Large) */}
            <div>
              <p className="text-gray-300 text-lg leading-relaxed mb-3">
                This is a large paragraph for important descriptions or hero sections.
              </p>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">Used for hero/featured descriptions, larger body text. Gray, large size, relaxed line height.</div>
            </div>
            {/* 3. Label (Form/Field) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                This is a label for form fields or UI controls.
              </label>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">Used for form labels, field names, and UI controls. Small, medium weight, gray.</div>
            </div>
            {/* 4. Caption/Helper Text */}
            <div>
              <p className="text-xs text-gray-400 mt-1">
                This is a caption or helper text for inputs and UI elements.
              </p>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">Used for helper text, captions, or secondary info. Extra small, light gray.</div>
            </div>
            {/* 5. Section Label/Overline */}
            <div>
              <span className="uppercase text-sm font-semibold text-gray-400 tracking-wider block mb-2">
                This is a section label or overline.
              </span>
              <div className="component-lib-mono text-xs text-gray-400 mb-3">Used for section labels, overlines, or small headers. Uppercase, small, semibold, gray, wide letter spacing.</div>
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
            <div className="component-lib-mono text-xs text-gray-400 mb-3">Used for tags, badges, and status indicators. Small, white text, pill-shaped, gray background.</div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">Buttons</h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="flex gap-4 flex-wrap">
            <BackButton {...mockData.backButton} />
            <ImageButton {...mockData.imageButton} onClick={noop} />
            <DiscordSignInButton />
            <GoogleSignInButton />
          </div>
        </section>

        {/* Cards & Sections */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">Cards & Sections</h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="flex gap-4 flex-wrap">
            <CategorySection
              title={mockData.categorySection.title}
              demos={mockData.categorySection.demos.map(getDemoById).filter(Boolean)}
              onSelectDemo={noop}
            />
            <CategorySectionFeatured
              title={mockData.categorySectionFeatured.title}
              demos={mockData.categorySectionFeatured.demos.map(getDemoById).filter(Boolean)}
              onSelectDemo={noop}
            />
            <CategoryCarousel
              title={mockData.categoryCarousel.title}
              demos={mockData.categoryCarousel.demos.map(getDemoById).filter(Boolean)}
              onSelectDemo={noop}
            />
            <DemoCard demo={mockData.demo} onSelect={noop} />
            <PlayerCard {...mockData.playerCard} />
          </div>
        </section>

        {/* Modals */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">Modals</h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowUnderConstruction(true)}
            >
              Open Under Construction Modal
            </button>
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowSurvey(true)}
            >
              Open Survey Modal
            </button>
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowFilter(true)}
            >
              Open Filter Modal
            </button>
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowComparePlans(true)}
            >
              Open Compare Plans Modal
            </button>
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowCreateDemo(true)}
            >
              Open Create Demo Modal
            </button>
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowTagging(true)}
            >
              Open Tagging Modal
            </button>
            <button
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition component-lib-mono"
              onClick={() => setShowError(true)}
            >
              Show Error Modal
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
            <ErrorWindow {...mockData.errorWindow} onClose={() => setShowError(false)} />
          )}
        </section>

        {/* Loading/Spinners */}
        <section className="mb-20">
          <h2 className="text-2xl font-medium mb-4 component-lib-mono">Loading/Spinners</h2>
          <hr className="border-t border-yellow-400/40 mb-8" />
          <div className="flex items-center gap-8">
            <div className="flex items-center justify-center bg-gray-800 rounded-lg" style={{ width: 320, height: 180 }}>
              <LoadingFullscreen spinnerOnly />
            </div>
            <div className="flex items-center justify-center bg-gray-800 rounded-lg" style={{ width: 320, height: 180 }}>
              <LoadingInline spinnerOnly />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 