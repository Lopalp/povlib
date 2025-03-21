import React from 'react';
import { Play, Eye, Heart } from 'lucide-react';

const DemoCard = ({ demo, featured = false, onSelect, className = "" }) => (
  <div 
    className={`relative flex-shrink-0 ${featured ? 'w-full' : 'w-72'} overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group ${className}`}
    onClick={() => onSelect(demo)}
  >
    <div className="relative pt-6 px-6">
      <div className="flex justify-between items-center mb-2">
        <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded">
          {demo.map}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${demo.isPro ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 'bg-gray-700 text-white'}`}>
          {demo.isPro ? 'PRO' : 'COMMUNITY'}
        </span>
      </div>
      
      <h3 className="text-white font-bold text-base mb-3 line-clamp-1">{demo.title}</h3>
      
      <div className="relative rounded-lg overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 z-10"></div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-yellow-400 to-yellow-300 z-0"></div>
        
        <img 
          src={demo.thumbnail} 
          alt={demo.title} 
          className={`w-full ${featured ? 'h-48 object-cover' : 'h-40 object-cover'} group-hover:scale-110 transition-all duration-700 rounded-lg`}
        />
        
        <div className="absolute bottom-3 right-3 flex items-center space-x-3 text-xs text-white z-20">
          <div className="flex items-center bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
            <Eye className="h-3 w-3 mr-1 text-yellow-400" />
            <span>{demo.views.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <button className="bg-yellow-400 rounded-full p-4 transition-transform duration-300 hover:scale-110 shadow-[0_0_15px_rgba(250,204,21,0.7)]">
              <Play className="h-6 w-6 text-gray-900" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
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

export default DemoCard;
