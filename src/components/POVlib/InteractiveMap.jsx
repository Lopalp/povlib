// InteractiveMap.jsx
// This component displays an interactive map with clickable areas.
// Props:
//   areas: An array of objects, each defining a clickable area. Each object should have:
//     - name: A unique identifier for the area.
//     - top: The top position of the area as a percentage.
//     - left: The left position of the area as a percentage.
//     - width: The width of the area as a percentage.
//     - height: The height of the area as a percentage.
//   handleAreaClick: A function to be called when an area is clicked.  It will receive the area name as an argument.

import React from 'react';

function InteractiveMap({
  areas = [
    { name: 'Area 1', top: '10%', left: '10%', width: '20%', height: '20%' },
    { name: 'Area 2', top: '40%', left: '50%', width: '15%', height: '25%' },
  ],
  handleAreaClick,
}) {
  return (
    <div
      className="interactive-map"
      style={{
        position: 'relative',
        width: '100%',
        height: '0',
        paddingBottom: '56.25%',
        display: 'block',
      }}
    >
      {areas &&
        areas.map((area) => (
          <div
            key={area.name}
            style={{
              position: 'absolute',
              top: area.top,
              left: area.left,
              width: area.width,
              height: area.height,
              cursor: 'pointer',
            }}
            onClick={() => handleAreaClick && handleAreaClick(area.name)}
          />
        ))}
    </div>
  );
}

export default InteractiveMap;