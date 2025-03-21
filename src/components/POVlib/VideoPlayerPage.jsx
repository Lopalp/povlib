import React from 'react';
import { ArrowLeft, Eye, Heart, Tag, Share2, Flag, Bookmark, ThumbsUp } from 'lucide-react';
import YouTubeEmbed from './YouTubeEmbed';
import DemoCard from './DemoCard';

const VideoPlayerPage = ({ 
  selectedDemo, 
  relatedDemos = [], 
  onClose, 
  onLike, 
  onOpenTagModal,
  onSelectRelatedDemo
}) => {
  if (!selectedDemo) return null;
  
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 pt-4 pb-12">
        <button 
          onClick={onClose}
          className="flex items-center text-gray-400 hover:text-yellow-400 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Browse
        </button>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Video Player Section (Left) */}
          <div className="lg:w-8/12">
            {/* Video Player */}
            <div className="rounded-lg overflow-hidden bg-black">
              <YouTubeEmbed 
                videoId={selectedDemo.videoId} 
                title={selectedDemo.title} 
                autoplay={true} 
                controls={true}
                showInfo={false}
              />
            </div>
            
            {/* Video Info */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-white mb-2">{selectedDemo.title}</h1>
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center text-gray-400">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{selectedDemo.views.toLocaleString()} views</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{selectedDemo.year}</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-2 py-4 border-t border-b border-gray-800">
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => onLike(selectedDemo.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span>{selectedDemo.likes}</span>
                  </button>
                  
                  <button 
                    onClick={onOpenTagModal}
                    className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <Tag className="h-5 w-5" />
                    <span>Tag</span>
                  </button>
                  
                  <button className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                  
                  <button className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors">
                    <Bookmark className="h-5 w-5" />
                    <span>Save</span>
                  </button>
                </div>
                
                <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Flag className="h-5 w-5" />
                  <span>Report</span>
                </button>
              </div>
              
              {/* Video Details */}
              <div className="flex flex-col md:flex-row gap-6 mt-6">
                {/* Left Column - Details */}
                <div className="md:w-2/3">
                  <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded">{selectedDemo.map}</span>
                      {selectedDemo.team && (
                        <span className="bg-gray-700 text-sm px-3 py-1 rounded">{selectedDemo.team}</span>
                      )}
                      {selectedDemo.event && (
                        <span className="bg-gray-700 text-sm px-3 py-1 rounded">{selectedDemo.event}</span>
                      )}
                      <span className="bg-gray-700 text-sm px-3 py-1 rounded">{selectedDemo.year}</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${selectedDemo.isPro ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 'bg-gray-700 text-white'}`}>
                        {selectedDemo.isPro ? 'PRO POV' : 'COMMUNITY POV'}
                      </span>
                    </div>
                    
                    <p className="text-gray-300">
                      Watch this detailed POV demo featuring {selectedDemo.players.join(', ')} playing on {selectedDemo.map}. 
                      This showcase highlights professional techniques and positioning that can improve your gameplay.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-gray-300 text-sm font-medium mb-2">Positions:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDemo.positions.map((position, i) => (
                        <span key={i} className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
                          {position}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-300 text-sm font-medium mb-2">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDemo.tags.map((tag, i) => (
                        <span key={i} className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Players */}
                <div className="md:w-1/3">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">Featured Players</h3>
                    <div className="space-y-3">
                      {selectedDemo.players.map((player, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-yellow-400 font-bold">
                            {player.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{player}</p>
                            {selectedDemo.team && (
                              <p className="text-gray-400 text-xs">{selectedDemo.team}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Videos Section (Right) */}
          <div className="lg:w-4/12 mt-6 lg:mt-0">
            <h2 className="text-white font-bold mb-4">Related POVs</h2>
            <div className="space-y-4">
              {relatedDemos.map(demo => (
                <div 
                  key={demo.id} 
                  className="flex gap-3 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-colors"
                  onClick={() => onSelectRelatedDemo(demo)}
                >
                  <div className="w-40 h-24 rounded-lg overflow-hidden relative group">
                    <img 
                      src={demo.thumbnail} 
                      alt={demo.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="rounded-full bg-yellow-400/80 p-2">
                        <ArrowLeft className="h-4 w-4 text-gray-900" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm line-clamp-2">{demo.title}</h3>
                    <div className="text-gray-400 text-xs mt-1">
                      {demo.players.join(', ')}
                    </div>
                    <div className="flex items-center text-gray-500 text-xs mt-2">
                      <span>{demo.views.toLocaleString()} views</span>
                      <span className="mx-1">•</span>
                      <span>{demo.map}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {relatedDemos.length === 0 && (
                <div className="text-gray-400 text-center py-8">
                  No related videos available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;