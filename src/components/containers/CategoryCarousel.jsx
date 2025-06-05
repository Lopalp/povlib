import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DemoCard from ".././POVlib/DemoCard"

/**
 * Ein horizontal scrollbares Carousel. 
 * - Wenn man auf die Pfeile klickt, scrollt es um eine Container-Breite.
 * - Das aktuell hervorgehobene Element (im Beispiel: immer das erste sichtbare)
 *   wird um 20 % größer skaliert (scale(1.2)) und bekommt eine sanfte Animation.
 */
export const CategoryCarousel = ({ title, demos, onSelectDemo, gap = 24 }) => {
  const containerRef = useRef(null);
  const [highlightIndex, setHighlightIndex] = useState(0);

  // Observer, um den aktuell im Zentrum sichtbaren Index zu erkennen (optional)
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Wir suchen den ersten Eintrag, der mindestens zu 50 % sichtbar ist
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setHighlightIndex(idx);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: [0.5],
      }
    );
    // Beobachte alle Kinder-Elemente
    Array.from(containerRef.current.children).forEach((child) => {
      observer.observe(child);
    });
    return () => observer.disconnect();
  }, [demos]);

  const scrollLeft = () => {
    if (!containerRef.current) return;
    // Scrollt eine „Viewport-Breite“ nach links
    containerRef.current.scrollBy({
      left: -containerRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({
      left: containerRef.current.offsetWidth,
      behavior: "smooth",
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

        {/* Scroll-Container mit „IntersectionObserver“-Logik */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto custom-scrollbar"
          style={{ scrollBehavior: "smooth", gap: `${gap}px` }}
        >
          {demos.map((demo, idx) => {
            // Wenn dieser Index = highlightIndex, skaliere 1.2, sonst 1.0
            const isHighlighted = idx === highlightIndex;
            return (
              <div
                key={demo.id}
                data-index={idx}
                className="flex-shrink-0"
                style={{
                  width: "280px",
                  transition: "transform 0.3s ease",
                  transform: isHighlighted ? "scale(1.2)" : "scale(1)",
                }}
              >
                <DemoCard demo={demo} onSelect={onSelectDemo} />
              </div>
            );
          })}
          {/* Etwas Puffer am Ende */}
          <div className="flex-shrink-0 w-4" />
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
