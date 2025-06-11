import React from "react";
import DemoCard from "../cards/DemoCard";

const DemoGrid = ({ demos, lastDemoElementRef }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
    {demos.map((demo, index) => {
      const isLastElement = index === demos.length - 1;
      return (
        <DemoCard
          key={demo.id}
          ref={isLastElement ? lastDemoElementRef : null}
          demo={demo}
        />
      );
    })}
  </div>
);

export default DemoGrid;
