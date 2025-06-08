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
        px-4 py-2 
        bg-yellow-400 
        text-black 
        rounded 
        font-semibold 
        hover:bg-yellow-300 
        transition 
        component-lib-mono
        disabled:bg-gray-700 
        disabled:text-gray-500 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
