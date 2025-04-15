import React from 'react';

function InteractiveMap({ mapImage, areas, handleAreaClick }) {
  return (
    <div className="interactive-map" style={{ position: 'relative', width: '100%', height: '0', paddingBottom: '56.25%', backgroundImage: `url(${mapImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {areas.map((area) => (
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
          onClick={() => handleAreaClick(area.name)}
        />
      ))}
    </div>
  );
}

export default InteractiveMap;