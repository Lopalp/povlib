import React from "react";

const SectionHeading = ({ children, className = "" }) => {
  return (
    <h2 className={`text-2xl font-bold text-white ${className}`}>
      <span className="border-l-4 border-yellow-400 pl-3 py-1">{children}</span>
    </h2>
  );
};

export default SectionHeading;
