import React from "react";

const IconButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-full 
        text-gray-400 
        hover:text-white 
        hover:bg-gray-700 
        transition-colors
        disabled:text-gray-600 
        disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default IconButton;
