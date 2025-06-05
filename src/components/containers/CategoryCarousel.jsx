// src/components/containers/CategoryCarousel.jsx
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DemoCard from '../POVlib/DemoCard';

export const CategoryCarousel = ({ title, demos, onSelectDemo, gap = 24 }) => {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({
      left: -containerRef.current.offsetWidth,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({
      left: containerRef.current.offsetWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section className="mt-8 mb-6 relative">
      <h2 className="text-2xl font-bold text-white mb-4">
        <span className="border-l-4 border-yellow-400 pl-3 py-1">{title}</span>
      </h2>

      <div className="relative">
        {/* Linker Pfeil */}
        <button
          onClick={scrollLeft}
          className="
            absolute left-0 top-1/2 -translate-y-1/2 z-20
            p-2 bg-gray-700 bg-opacity-50 rounded-full
            hover:bg-opacity-80 transition
          "
          aria-label="Scroll Left"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>

        {/* Rechter Pfeil */}
        <button
          onClick={scrollRight}
          className="
            absolute right-0 top-1/2 -translate-y-1/2 z-20
            p-2 bg-gray-700 bg-opacity-50 rounded-full
            hover:bg-opacity-80 transition
          "
          aria-label="Scroll Right"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        {/* Scroll-Container */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto custom-scrollbar space-x-6 px-4"
          style={{ scrollBehavior: 'smooth', gap: `${gap}px` }}
        >
          {demos.map((demo) => (
            <div key={demo.id} className="flex-shrink-0 w-[280px]">
              <DemoCard demo={demo} onSelect={onSelectDemo} />
            </div>
          ))}

          {/* Optional: etwas Abstand am Ende */}
          <div className="flex-shrink-0 w-4" />
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
