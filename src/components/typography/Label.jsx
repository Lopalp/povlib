import React from "react";

const Label = ({ children, className = "", size = "sm" }) => {
  const sizeClasses = {
    base: "text-base",
    sm: "text-sm",
    xs: "text-xs",
  };

  return (
    <label
      className={`block font-medium text-gray-300 ${sizeClasses[size]} ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
