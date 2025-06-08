import React from "react";

const TertiaryButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 
        border 
        border-gray-600 
        text-white 
        rounded 
        font-semibold 
        hover:border-yellow-400 
        transition 
        component-lib-mono
        disabled:border-gray-700 
        disabled:text-gray-500 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default TertiaryButton;
