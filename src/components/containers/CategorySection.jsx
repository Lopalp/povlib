// ────────────────
// CategorySection
// ────────────────
// Rendert eine Kategorie (z. B. "Recently Added") und zeigt standardmäßig eine Zeile.
// Der feste Abstand (gap) wird in die Berechnung der Kartenbreite einbezogen,
// sodass sich die Karten niemals berühren und stets bündig am linken und rechten Rand abschließen.
// Mit "View More" wird eine weitere Zeile freigeschaltet.
// ────────────────
// CategorySection
// ────────────────
// Rendert eine Kategorie (z. B. "Recently Added") und zeigt standardmäßig eine Zeile.
// Mit verbesserten Abständen zwischen den Karten für ein besseres visuelles Layout.
// Mit "View More" wird eine weitere Zeile freigeschaltet.
import { useRef, useState, useEffect } from "react";
import DemoCard from "../POVlib/DemoCard";

export const CategorySection = ({ title, demos, onSelectDemo, minCardWidth = 280, maxColumns = 4, gap = 32 }) => {
  const containerRef = useRef(null);
  const [itemsPerRow, setItemsPerRow] = useState(maxColumns);
  const [visibleRows, setVisibleRows] = useState(1);
  const [cardWidth, setCardWidth] = useState(minCardWidth);

  useEffect(() => {
    const updateItemsPerRow = () => {
      if (containerRef.current) {
        // Sicherstellen, dass der Container box-sizing: border-box hat und kein Padding/Margin
        const containerWidth = containerRef.current.offsetWidth;
        // Berechne, wie viele Cards (inkl. fester Lücke) in die Container-Breite passen
        const calculated = Math.floor((containerWidth + gap) / (minCardWidth + gap)) || 1;
        const finalItems = Math.min(calculated, maxColumns);
        setItemsPerRow(finalItems);
        // Berechne die exakte Breite so, dass:
        // (finalItems * cardWidth) + ((finalItems - 1) * gap) = containerWidth
        const newCardWidth = (containerWidth - (finalItems - 1) * gap) / finalItems;
        setCardWidth(Math.floor(newCardWidth));
      }
    };

    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);
    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, [minCardWidth, maxColumns, gap]);

  const visibleCount = itemsPerRow * visibleRows;
  const visibleDemos = demos.slice(0, visibleCount);

  // Aufteilen in Zeilen
  const rows = [];
  for (let i = 0; i < visibleDemos.length; i += itemsPerRow) {
    rows.push(visibleDemos.slice(i, i + itemsPerRow));
  }

  const canViewMore = demos.length > visibleCount;

  return (
    <section className="mt-8 mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        <span className="border-l-4 border-yellow-400 pl-3 py-1">{title}</span>
      </h2>
      <div
        ref={containerRef}
        className="overflow-hidden"
        style={{ boxSizing: 'border-box', padding: 0, margin: 0 }}
      >
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex mb-6"
            style={{ gap: `${gap}px` }}
          >
            {row.map(demo => (
              <div key={demo.id} style={{ width: cardWidth }} className="flex-shrink-0">
                <DemoCard demo={demo} onSelect={onSelectDemo} />
              </div>
            ))}
            {/* Fülle leere Slots für gleichmäßiges Layout */}
            {row.length < itemsPerRow && Array(itemsPerRow - row.length).fill().map((_, i) => (
              <div key={`empty-${i}`} style={{ width: cardWidth }} className="flex-shrink-0"></div>
            ))}
          </div>
        ))}
      </div>
      {canViewMore && (
        <div className="mt-2 text-center">
          <button
            onClick={() => setVisibleRows(visibleRows + 1)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-yellow-400 text-sm rounded-lg border border-gray-700 transition-colors"
          >
            View More
          </button>
        </div>
      )}
    </section>
  );
};