// components/POVlib/DemoCardVertical.jsx
'use client';

import React from 'react';

const DemoCardVertical = ({ demo, onSelect }) => {
  return (
    <div
      className="relative w-full max-w-xs mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:scale-105 transition-transform"
      onClick={() => onSelect(demo)}
    >
      {/* Video Preview */}
      <div className="relative w-full pb-[133%] bg-black">
        <video
          src={demo.videoUrl}
          poster={"/img/v1.png"}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-white/10 backdrop-blur-md">
        <h3 className="text-white text-lg font-bold line-clamp-2">
          {demo.title}
        </h3>
        <p className="text-gray-200 text-sm mt-1">
          {demo.map} · {demo.year}
        </p>
        <div className="mt-2 flex items-center text-sm text-gray-200">
          <span className="mr-2">{demo.players[0]}</span>
          <span className="ml-auto px-2 py-0.5 bg-yellow-400 text-gray-900 rounded-full text-xs">
            {demo.likes} ❤
          </span>
        </div>
      </div>
    </div>
  );
};

export default DemoCardVertical;
