import { useRef, useState, useEffect } from "react";
import DemoCard from "../POVlib/DemoCard";

export const CategorySection = ({
  title,
  demos,
  onSelectDemo,
  minCardWidth = 280,
  gap = 24,
}) => {
  const [visibleRows, setVisibleRows] = useState(1);

  // Pro Klick kommen 4 neue Elemente (1 Reihe × 4 Spalten)
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
        style={{
          boxSizing: "border-box",
          padding: 0,
          margin: 0,
        }}
      >
        {/* === Grid-Layout === */}
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
          {/* 
            Hier: Container mit 'group', damit wir per group-hover
            die Linien animieren können. 
          */}
          <div className="flex items-center group">
            {/* Linke Linie */}
            <span
              className="
                flex-1            /* füllt den zur Verfügung stehenden Platz links */
                h-px              /* Höhe = 1px (gleich dick wie border: 1px) */
                bg-gray-600       /* gleiche Farbe wie button-border */
                scale-x-0         /* initial: auf 0 skaliert */
                group-hover:scale-x-100   /* beim Hover auf group: volle Breite */
                transition-transform duration-300  /* sanfte Animation (300ms) */
                origin-left       /* Skalierung beginnt links */
              "
            ></span>

            {/* Button selbst */}
            <button
              onClick={() => setVisibleRows(visibleRows + 1)}
              className="
                mx-4               /* Abstand zu den Linien: 1rem (Tailwind) links & rechts */
                px-4 py-2          /* horizontales/vertikales Padding */
                rounded-md         /* abgerundete Ecken */
                border border-gray-600  /* 1px Border, grau */
                text-white text-sm font-semibold
                transition-colors
                hover:border-yellow-400   /* beim Hover: Border wird gelb */
              "
            >
              View More
            </button>

            {/* Rechte Linie */}
            <span
              className="
                flex-1
                h-px
                bg-gray-600
                scale-x-0
                group-hover:scale-x-100
                transition-transform duration-300
                origin-right      /* Skalierung beginnt rechts */
              "
            ></span>
          </div>
        </div>
      )}
    </section>
  );
};
