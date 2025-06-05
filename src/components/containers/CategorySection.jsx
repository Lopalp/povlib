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

  // Wie viele Items zeigen wir maximal an?
  // Pro "Reihe" passen dynamisch so viele Cards in's Grid, wie Platz ist.
  // Da wir nicht mehr per JS rechnen, ziehen wir einzig nach Reihen ab:
  // visibleCount = visibleRows * columns; doch columns bestimmen wir im CSS.
  // Deshalb beschränken wir einfach auf visibleRows * maxColumns (falls du ein Maximum möchtest)
  // oder lassen es unbeschränkt. Hier nehmen wir an, pro Zeile können
  // theoretisch sehr viele Spalten sein, aber wir wollen höchstens visibleRows Reihen anzeigen.
  //
  // Trick: Wir können das Teilen in Reihen vornehmen, wenn wir das CSS-Grid "auto-fill" einsetzen:
  // Dann kann man nicht exakt per JS sagen: „Zeige 2 Reihen à 4 Spalten“ –
  // stattdessen slicen wir nach visibleRows * maximaler Spaltenzahl, die du möchtest.
  // Für ein echtes „View More“, das zeilenweise öffnet, müssten wir aber doch in JS abschätzen,
  // wie viele Spalten aktuell sichtbar sind. Alternativ lässt man einfach immer z. B. 8 Cards
  // pro Klick laden (zwei Reihen a 4), ohne dynamisch zu messen. Das ist pragmatisch und wirkt responsiv.
  //
  // Unten verwenden wir also: pro "View More" kommen n weitere Cards, z. B. 8 (2 Reihen × 4).
  // Da wir aber nicht wissen, ob wirklich 4 Spalten nebeneinander passen,
  // kann man das auch per CSS „max-height: rows × (minCardHeight + gap)“ tricksen. 
  // Wir wählen hier die pragmatische Variante: pro „View More“ kommen 8 neue Elemente.
  
  // Anzahl an Elementen, die derzeit gerendert werden:
  const baseLoad = 8; // z. B. 8 pro Klick (2 Reihen á 4)
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
        {/* === Hier das Grid-Layout === */}
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
