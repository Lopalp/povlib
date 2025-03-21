import React from 'react';
import { Play, Filter, Eye, Heart } from 'lucide-react';
import YouTubeEmbed from './YouTubeEmbed';

const FeaturedHero = ({ demo, autoplayVideo, setSelectedDemo, setActiveVideoId, setIsFilterModalOpen }) => {
  if (!demo) return null;

  return (
    <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
      {/* Background video mit Overlay */}
      <div className="absolute inset-0 overflow-hidden">
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
      
      {/* Content Overlay */}
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
              <Filter className="h-5 w-5 mr-2" />
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

export default FeaturedHero;
