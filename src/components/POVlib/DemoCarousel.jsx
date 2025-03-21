import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import DemoCard from './DemoCard';

const DemoCarousel = ({ title, demos, description, onSelectDemo, handleScroll }) => {
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
              <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-all" />
            </button>
            <button 
              onClick={() => handleScroll('right')}
              className="p-2 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 group"
            >
              <ArrowRight className="h-5 w-5 group-hover:scale-110 transition-all" />
            </button>
          </div>
        )}
      </div>
      
      <div 
        className="flex overflow-x-auto pb-4 custom-scrollbar gap-6"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {demos.map(demo => (
          <DemoCard key={demo.id} demo={demo} onSelect={onSelectDemo} />
        ))}
      </div>
    </div>
  );
};

export default DemoCarousel;
