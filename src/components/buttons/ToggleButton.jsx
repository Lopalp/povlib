import React from "react";

const ToggleButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  active = false,
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
        transition-colors
        disabled:text-gray-600 
        disabled:cursor-not-allowed
        ${
          active
            ? "text-yellow-400 border-b-2 border-yellow-400"
            : "text-gray-400 hover:text-white"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default ToggleButton;
