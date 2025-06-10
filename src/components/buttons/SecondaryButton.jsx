import React from "react";

const SecondaryButton = ({
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
        bg-gray-700 
        text-white 
        rounded-lg 
        hover:bg-gray-600 
        transition-colors
        disabled:bg-gray-800 
        disabled:text-gray-500 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
