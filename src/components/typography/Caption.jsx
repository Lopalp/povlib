import React from "react";

const Caption = ({ children, className = "", size = "xs" }) => {
  const sizeClasses = {
    base: "text-base",
    sm: "text-sm",
    xs: "text-xs",
  };

  return (
    <p className={`text-gray-400 ${sizeClasses[size]} ${className}`}>
      {children}
    </p>
  );
};

export default Caption;
