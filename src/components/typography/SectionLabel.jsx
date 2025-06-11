import React from "react";

const SectionLabel = ({ children, className = "", size = "sm" }) => {
  const sizeClasses = {
    base: "text-base",
    sm: "text-sm",
    xs: "text-xs",
  };

  return (
    <span
      className={`uppercase font-semibold text-gray-400 tracking-wider block ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default SectionLabel;
