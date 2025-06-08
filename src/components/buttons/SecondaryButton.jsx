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
        px-4 py-2 
        bg-gray-700 
        text-white 
        rounded 
        font-semibold 
        hover:bg-gray-600 
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

export default SecondaryButton;
