import { useRef } from "react";
import DemoCard from "../POVlib/DemoCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

export const CategoryCarousel = ({ title, demos, onSelectDemo, gap = 24 }) => {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (!containerRef.current) return;
    // Scrollt um die Breite des Containers nach links
    containerRef.current.scrollBy({
      left: -containerRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!containerRef.current) return;
    // Scrollt um die Breite des Containers nach rechts
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
        {/* Linke Pfeiltaste */}
        <button
          onClick={scrollLeft}
          className="
            absolute left-0 top-1/2 -translate-y-1/2 z-20
            p-2 bg-gray-700 bg-opacity-50 rounded-full
            hover:bg-opacity-80 transition
          "
          aria-label="Scroll Left"
        >
          <ChevronLeftIcon className="h-6 w-6 text-white" />
        </button>

        {/* Rechte Pfeiltaste */}
        <button
          onClick={scrollRight}
          className="
            absolute right-0 top-1/2 -translate-y-1/2 z-20
            p-2 bg-gray-700 bg-opacity-50 rounded-full
            hover:bg-opacity-80 transition
          "
          aria-label="Scroll Right"
        >
          <ChevronRightIcon className="h-6 w-6 text-white" />
        </button>

        {/* Scroll-Container */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto scrollbar-hide space-x-6 px-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {demos.map((demo) => (
            <div key={demo.id} className="flex-shrink-0 w-[280px]">
              <DemoCard demo={demo} onSelect={onSelectDemo} />
            </div>
          ))}

          {/* Wenn Du möchtest, dass der Container am Ende etwas "Abstand" hat */}
          <div className="flex-shrink-0 w-4" />
        </div>
      </div>
    </section>
  );
};
