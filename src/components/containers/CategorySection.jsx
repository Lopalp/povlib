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
  // State, um nach dem ersten Render zu triggern, dass die Linien animiert „hineinwachsen“.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Nach dem ersten Render sofort »mounted = true« setzen, sodass die Linien von scale-x-0 auf scale-x-100 gehen.
    setMounted(true);
  }, []);

  // Pro Klick laden wir 4 weitere Elemente (1 Reihe × 4 Spalten)
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
          {/* Flex-Container: Button zentriert, Linien links/rechts flex-grow */}
          <div className="flex items-center">
            {/* Linke Linie */}
            <span
              className={`
                h-px                    /* Höhe = 1px (wie border: 1px) */
                bg-gray-600             /* gleiche Farbe wie der Button-Rand */
                flex-grow               /* füllt automatisch den verbleibenden Platz */
                origin-left             /* Skalierungsherkunft (für Mount-Animation) */
                transform               /* aktiviert transform-Anpassung */
                transition-all duration-500
                ${mounted ? "scale-x-100" : "scale-x-0"}
              `}
            />
            {/* Mittelstück: Button */}
            <button
              onClick={() => setVisibleRows(visibleRows + 1)}
              className={`
                mx-4                    /* Abstand je 1rem (16px) zu beiden Linien */
                px-4 py-2               /* horizontales / vertikales Padding */
                rounded-md              /* abgerundete Ecken (md-Radius) */
                border border-gray-600  /* 1px grauer Rand */
                text-white text-sm font-semibold
                transition-colors
                hover:border-yellow-400 /* Hover: Rand wird gelb */
              `}
            >
              View More
            </button>
            {/* Rechte Linie */}
            <span
              className={`
                h-px
                bg-gray-600
                flex-grow
                origin-right            /* Skalierungsherkunft rechts */
                transform
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
