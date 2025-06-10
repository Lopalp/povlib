import React from "react";

const PrimaryButton = ({
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
        bg-yellow-400 
        text-gray-900 
        rounded-lg 
        hover:bg-yellow-500 
        transition-colors
        disabled:bg-gray-600 
        disabled:text-gray-400 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
