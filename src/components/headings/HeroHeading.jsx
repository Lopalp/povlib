import React from "react";

const HeroHeading = ({ children, className = "" }) => {
  return (
    <h1 className={`text-4xl md:text-5xl font-bold text-white ${className}`}>
      {children}
    </h1>
  );
};

export default HeroHeading;
