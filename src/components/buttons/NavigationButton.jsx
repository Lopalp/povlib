import React from "react";

const NavigationButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  icon: Icon,
  iconPosition = "left",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-poppins
        flex 
        items-center 
        gap-2 
        px-6 
        py-3 
        rounded-lg 
        font-medium 
        text-white 
        bg-gray-700 
        hover:bg-gray-600 
        transition-colors
        disabled:bg-gray-700 
        disabled:text-gray-500 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {Icon && iconPosition === "left" && <Icon className="h-5 w-5" />}
      <span>{children}</span>
      {Icon && iconPosition === "right" && <Icon className="h-5 w-5" />}
    </button>
  );
};

export default NavigationButton;
