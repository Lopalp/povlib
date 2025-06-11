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
        font-poppins
        px-6 
        py-3 
        text-sm 
        font-bold 
        border-2 
        border-gray-700 
        text-white 
        rounded-lg 
        hover:border-yellow-400 
        hover:text-yellow-400 
        transition-colors
        disabled:border-gray-800 
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
