"use client";
import { useRef, useState, useEffect } from "react";
import DemoCard from "../POVlib/DemoCard";
import { useDemos } from "@/context/DemoProvider";

export const CategorySection = ({ title, minCardWidth = 280, maxColumns = 4, gap = 24 }) => {
  const containerRef = useRef(null);
  const [itemsPerRow, setItemsPerRow] = useState(maxColumns);
  const [visibleRows, setVisibleRows] = useState(1);
  const [cardWidth, setCardWidth] = useState(minCardWidth);
  const [canViewMore, setCanViewMore] = useState(false);

  const [rows, setRows] = useState([]);

  const { 
      demos,
      filteredDemos,
      setFilteredDemos,
      setIsFilterModalOpen,
      autoplayVideo,
      setActiveVideoId 
    } = useDemos();

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

      if (demos) {
        const visibleCount = itemsPerRow * visibleRows;
        const visibleDemos = demos.slice(0, visibleCount);

        // Aufteilen in Zeilen
        for (let i = 0; i < visibleDemos.length; i += itemsPerRow) {
          setRows(prevRows => [
            ...prevRows,
            visibleDemos.slice(i, i + itemsPerRow)
          ]);
        }

        setCanViewMore(demos.length > visibleCount);

      }
    };

    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);
    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, [minCardWidth, maxColumns, gap, demos]);

  const onSelectDemo = (demo) => {
    router.push(`/demos/${demo.id}`);
  };

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