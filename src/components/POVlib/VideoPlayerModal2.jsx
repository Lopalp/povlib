import React from 'react';
import { X, Eye, Heart, Tag } from 'lucide-react';
import YouTubeEmbed from './YouTubeEmbed';

const VideoPlayerModal = ({ selectedDemo, activeVideoId, onClose, onLike, onOpenTagModal }) => {
  if (!selectedDemo) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl w-full max-w-5xl border border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.15)] overflow-hidden">
        <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{selectedDemo.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-0">
          <YouTubeEmbed videoId={activeVideoId} title={selectedDemo.title} autoplay={true} />
        </div>
        
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-850">
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
          
          <p className="text-gray-300 mb-6">
            Watch this detailed POV demo featuring {selectedDemo.players.join(', ')} playing on {selectedDemo.map}. 
            This showcase highlights professional techniques and positioning that can improve your gameplay.
          </p>
          
          <div className="mt-6">
            <h3 className="text-gray-300 text-sm mb-2">Positions:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedDemo.positions.map((position, i) => (
                <span key={i} className="text-xs bg-gray-700 px-3 py-1 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
                  {position}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-gray-300 text-sm mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedDemo.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-gray-700 px-3 py-1 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-8">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-yellow-400" />
                <span className="text-gray-300">{selectedDemo.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-yellow-400" />
                <span className="text-gray-300">{selectedDemo.likes}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={onOpenTagModal}
                className="px-4 py-2 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-600 transition flex items-center"
              >
                <Tag className="h-4 w-4 mr-2" />
                Tag Demo
              </button>
              <button 
                onClick={() => onLike(selectedDemo.id)}
                className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm rounded-md hover:bg-yellow-300 transition flex items-center font-bold"
              >
                <Heart className="h-4 w-4 mr-2" />
                Like
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
