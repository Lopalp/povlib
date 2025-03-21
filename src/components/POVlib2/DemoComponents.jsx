'use client';

import React from 'react';
import { Play, Eye, Heart } from 'lucide-react';

// YouTube embed component mit erweiterten Optionen
export const YouTubeEmbed = ({ videoId, title, autoplay = false, className = "", controls = true }) => {
  if (!videoId) return null;
  
  return (
    <div className={`relative w-full pb-56.25 h-0 rounded-lg overflow-hidden ${className}`}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&controls=${controls ? 1 : 0}&showinfo=0&mute=${autoplay ? 1 : 0}`}
        title={title || "YouTube video player"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

// DemoCard component
export const DemoCard = ({ demo, featured = false, className = "", setSelectedDemo, setActiveVideoId }) => (
  <div 
    className={`relative flex-shrink-0 ${featured ? 'w-full' : 'w-72'} overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group ${className}`}
    onClick={() => {
      setSelectedDemo(demo);
      setActiveVideoId(demo.videoId);
    }}
  >
    <div className="relative pt-6 px-6">
      {/* Status indicators positioned at the top with proper spacing */}
      <div className="flex justify-between items-center mb-2">
        <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded">
          {demo.map}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${demo.isPro ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 'bg-gray-700 text-white'}`}>
          {demo.isPro ? 'PRO' : 'COMMUNITY'}
        </span>
      </div>
      
      {/* Title with proper spacing */}
      <h3 className="text-white font-bold text-base mb-3 line-clamp-1">{demo.title}</h3>
      
      {/* Thumbnail container with gradient overlay */}
      <div className="relative rounded-lg overflow-hidden">
        {/* Hover effect with subtle glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 z-10"></div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-yellow-400 to-yellow-300 z-0"></div>
        
        <img 
          src={demo.thumbnail} 
          alt={demo.title} 
          className={`w-full ${featured ? 'h-48 object-cover' : 'h-40 object-cover'} group-hover:scale-110 transition-all duration-700 rounded-lg`}
        />
        
        {/* Social stats with clean positioning */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-3 text-xs text-white z-20">
          <div className="flex items-center bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
            <Eye className="h-3 w-3 mr-1 text-yellow-400" />
            <span>{demo.views.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Play button with clean effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <button className="bg-yellow-400 rounded-full p-4 transition-transform duration-300 hover:scale-110 shadow-[0_0_15px_rgba(250,204,21,0.7)]">
              <Play className="h-6 w-6 text-gray-900" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    {/* Info section with clean layout */}
    <div className="p-4 relative overflow-hidden">
      <div className="flex justify-between items-center">
        <span className="text-yellow-400 text-xs font-medium">{demo.players.join(', ')}</span>
        <span className="text-gray-400 text-xs">{demo.year}</span>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {demo.positions.slice(0, 1).map((position, i) => (
          <span key={i} className="text-xs bg-gray-700 px-2 py-0.5 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
            {position}
          </span>
        ))}
        {demo.tags.slice(0, 1).map((tag, i) => (
          <span key={i} className="text-xs bg-gray-700 px-2 py-0.5 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
            {tag}
          </span>
        ))}
        <span className="flex items-center text-xs bg-yellow-400/10 px-2 py-0.5 rounded text-yellow-400">
          <Heart className="h-3 w-3 mr-1" />
          {demo.likes}
        </span>
      </div>
    </div>
  </div>
);

// Enhanced Featured Demo Hero Component
export const FeaturedHero = ({ demo, setSelectedDemo, setActiveVideoId, autoplayVideo, setIsFilterModalOpen, featuredVideoRef }) => {
  if (!demo) return null;
  
  return (
    <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
      {/* Background video with improved gradient overlay */}
      <div className="absolute inset-0 overflow-hidden" ref={featuredVideoRef}>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <YouTubeEmbed 
          videoId={demo.videoId} 
          title={demo.title} 
          autoplay={autoplayVideo} 
          controls={false} 
          className="scale-110 opacity-60" 
        />
      </div>
      
      {/* Content overlay with improved spacing */}
      <div className="relative z-20 container mx-auto h-full flex items-center px-8">
        <div className="max-w-2xl">
          <div className="flex items-center mb-4 space-x-3">
            <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-sm font-bold rounded">
              {demo.map}
            </span>
            <span className="px-3 py-1 bg-gray-800/80 border border-yellow-400 text-yellow-400 text-sm rounded">
              {demo.team || "Featured Demo"}
            </span>
            <span className="px-3 py-1 bg-gray-800/80 text-white text-sm rounded backdrop-blur-sm">
              {demo.event || demo.year}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
            {demo.title}
          </h1>
          
          <p className="text-gray-300 text-lg max-w-xl mb-6 line-clamp-2">
            Watch this high-level POV demo featuring {demo.players.join(', ')} playing on {demo.map}. 
            Learn professional techniques and strategies used by top players.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => {
                setSelectedDemo(demo);
                setActiveVideoId(demo.videoId);
              }}
              className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-md hover:bg-yellow-300 transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.5)] flex items-center"
            >
              <Play className="h-5 w-5 mr-2" fill="currentColor" />
              Watch Full POV
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="px-6 py-3 bg-gray-800/40 backdrop-blur-sm text-white rounded-md hover:bg-gray-700 transition-all duration-300 border border-gray-700 flex items-center"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7h18M6 12h12M10 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Filter POVs
            </button>
          </div>
          
          {/* Social stats */}
          <div className="flex items-center mt-8 space-x-6">
            <div className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-yellow-400" />
              <span className="text-white">{demo.views.toLocaleString()} views</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-yellow-400" />
              <span className="text-white">{demo.likes} likes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo carousel with improved spacing and professional design
export const DemoCarousel = ({ title, demos, description, handleScroll, scrollContainerRef, setSelectedDemo, setActiveVideoId }) => {
  if (!demos || demos.length === 0) return null;
  
  return (
    <div className="mb-16 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-gray-100 text-2xl font-bold">
            <span className="border-l-4 border-yellow-400 pl-3 py-1">{title}</span>
          </h2>
          {description && <p className="text-gray-400 text-sm mt-2 ml-4">{description}</p>}
        </div>
        
        {demos.length > 3 && (
          <div className="flex gap-2">
            <button 
              onClick={() => handleScroll('left')}
              className="p-2 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 group"
            >
              <svg className="h-5 w-5 group-hover:scale-110 transition-all" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M11 18L5 12 11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button 
              onClick={() => handleScroll('right')}
              className="p-2 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 group"
            >
              <svg className="h-5 w-5 group-hover:scale-110 transition-all" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Horizontal scrolling container with proper spacing */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-4 custom-scrollbar gap-6"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {demos.map(demo => (
          <DemoCard 
            key={demo.id} 
            demo={demo} 
            setSelectedDemo={setSelectedDemo}
            setActiveVideoId={setActiveVideoId}
          />
        ))}
      </div>
    </div>
  );
};