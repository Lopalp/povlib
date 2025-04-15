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
//   mapImage: The URL of the map image.

import React from 'react';

function InteractiveMap({
  areas = [], handleAreaClick, mapImage
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
        backgroundImage: `url(${mapImage ? `/maps/${mapImage}.webp` : '/window.svg'})`,
        backgroundSize: 'cover',
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