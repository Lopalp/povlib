import React from "react";
import DemoCard from "/home/user/povlib/src/components/POVlib/DemoCard.jsx";

/**
 * Zeigt bis zu 3 Demos in einer gleichmäßigen Zeile an.
 * Je nachdem, ob 1, 2 oder 3 Demos vorhanden sind, nimmt jede Karte
 * 100 %, 50 % oder 33 % der Breite ein und ist „kleiner“ gehalten.
 */
export const CategorySectionFeatured = ({ title, demos, onSelectDemo, gap = 24 }) => {
  const displayedDemos = demos.slice(0, 3);
  const count = displayedDemos.length;

  // Tailwind-Klassen dafür, wie breit jede Karte ist:
  // - 1 Demo: mx-auto 50 % Breite
  // - 2 Demos: je 1/2 Breite
  // - 3 Demos: je 1/3 Breite
  let widthClass;
  if (count === 1) {
    widthClass = "w-1/2 mx-auto";
  } else if (count === 2) {
    widthClass = "w-1/2";
  } else {
    widthClass = "w-1/3";
  }

  return (
    <section className="mt-8 mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        <span className="border-l-4 border-yellow-400 pl-3 py-1">{title}</span>
      </h2>

      <div className="flex flex-wrap" style={{ gap: `${gap}px` }}>
        {displayedDemos.map((demo) => (
          <div key={demo.id} className={`${widthClass} flex-shrink-0`}>
            <DemoCard demo={demo} onSelect={onSelectDemo} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySectionFeatured;
