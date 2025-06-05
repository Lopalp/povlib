import React, { useRef, useState, useEffect } from "react";
import DemoCard from "./POVlib/DemoCard";

export const CategorySection = ({
  title,
  demos,
  onSelectDemo,
  minCardWidth = 280,
  gap = 24,
}) => {
  const [visibleRows, setVisibleRows] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const baseLoad = 4;
  const visibleCount = visibleRows * baseLoad;
  const visibleDemos = demos.slice(0, visibleCount);
  const canViewMore = demos.length > visibleCount;

  return (
    <section className="mt-8 mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        <span className="border-l-4 border-yellow-400 pl-3 py-1">{title}</span>
      </h2>

      <div
        ref={useRef()}
        className="overflow-hidden"
        style={{ boxSizing: "border-box", padding: 0, margin: 0 }}
      >
        <div
          className="grid"
          style={{
            gap: `${gap}px`,
            gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
          }}
        >
          {visibleDemos.map((demo) => (
            <div key={demo.id} className="w-full">
              <DemoCard demo={demo} onSelect={onSelectDemo} />
            </div>
          ))}
        </div>
      </div>

      {canViewMore && (
        <div className="mt-4">
          <div className="flex items-center">
            <span
              className={`
                h-px bg-gray-600 flex-grow origin-left transform
                transition-all duration-500
                ${mounted ? "scale-x-100" : "scale-x-0"}
              `}
            />
            <button
              onClick={() => setVisibleRows(visibleRows + 1)}
              className={`
                mx-4 px-4 py-2 rounded-md border border-gray-600
                text-white text-sm font-semibold hover:border-yellow-400
                transition-colors
              `}
            >
              View More
            </button>
            <span
              className={`
                h-px bg-gray-600 flex-grow origin-right transform
                transition-all duration-500
                ${mounted ? "scale-x-100" : "scale-x-0"}
              `}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CategorySection;
