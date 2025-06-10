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
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-poppins
        ${sizeClasses[size]}
        rounded-full
        flex
        items-center
        justify-center
        text-gray-400
        hover:text-yellow-400
        cursor-pointer
        transition-colors
        disabled:text-gray-600
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default IconButton;
