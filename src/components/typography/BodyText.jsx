import React from "react";

const BodyText = ({ children, className = "", size = "base" }) => {
  const sizeClasses = {
    base: "text-base",
    lg: "text-lg",
    sm: "text-sm",
    xs: "text-xs",
  };

  return (
    <p
      className={`text-gray-300 leading-relaxed ${sizeClasses[size]} ${className}`}
    >
      {children}
    </p>
  );
};

export default BodyText;
