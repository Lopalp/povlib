import React from "react";

const ImageButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  image,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-poppins
        px-4 
        py-2 
        text-sm 
        font-bold 
        text-gray-400 
        hover:text-white 
        transition-colors
        disabled:text-gray-600 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {image && <img src={image} alt="" className="w-6 h-6 mr-2" />}
      {children}
    </button>
  );
};

export default ImageButton;
