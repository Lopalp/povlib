import React from "react";

const BrandHeading = ({ size = 1 }) => {
  return (
    <h1
      className={`text-xl font-black`}
      style={{
        fontSize: `${size}rem`,
        lineHeight: `${size * 1.2}rem`,
        marginTop: 4,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <span className="text-yellow-400">POV</span>
      <span className="text-white" style={{ fontWeight: 900 }}>
        lib
      </span>
      <span
        className="text-gray-400"
        style={{ fontSize: size * 10, fontWeight: 500 }}
      >
        .gg
      </span>
    </h1>
  );
};

export default BrandHeading;
