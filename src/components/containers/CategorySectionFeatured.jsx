// src/components/containers/CategorySectionFeatured.jsx

import React, { useRef, useState, useEffect } from "react";
import DemoCard from "../POVlib/DemoCard";

export const CategorySectionFeatured = ({
  title,
  demos,
  onSelectDemo,
  gap = 24,
}) => {
  const displayedDemos = demos.slice(0, 3);
  const count = displayedDemos.length;

  return (
    <section className="mt-8 mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        <span className="border-l-4 border-yellow-400 pl-3 py-1">{title}</span>
      </h2>

      <div ref={useRef()} className="overflow-hidden" style={{ boxSizing: "border-box", padding: 0, margin: 0 }}>
        {count === 1 && (
          <div className="w-full">
            <DemoCard demo={displayedDemos[0]} onSelect={onSelectDemo} />
          </div>
        )}
        {count === 2 && (
          <div
            className="grid"
            style={{
              gap: `${gap}px`,
              gridTemplateColumns: `repeat(2, minmax(0, 1fr))`,
            }}
          >
            {displayedDemos.map((demo) => (
              <div key={demo.id} className="w-full">
                <DemoCard demo={demo} onSelect={onSelectDemo} />
              </div>
            ))}
          </div>
        )}
        {count === 3 && (
          <div
            className="grid"
            style={{
              gap: `${gap}px`,
              gridTemplateColumns: `repeat(2, minmax(0, 1fr))`,
              gridTemplateRows: `auto auto`,
            }}
          >
            <div key={displayedDemos[0].id} className="col-span-2 w-full">
              <DemoCard demo={displayedDemos[0]} onSelect={onSelectDemo} />
            </div>
            <div key={displayedDemos[1].id} className="w-full">
              <DemoCard demo={displayedDemos[1]} onSelect={onSelectDemo} />
            </div>
            <div key={displayedDemos[2].id} className="w-full">
              <DemoCard demo={displayedDemos[2]} onSelect={onSelectDemo} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Default-Export hinzufügen
export default CategorySectionFeatured;
