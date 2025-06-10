"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = ({
  text = "Back",
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  const router = useRouter();

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
      <span className="mr-2">←</span>
      {text}
    </button>
  );
};

export default BackButton;
