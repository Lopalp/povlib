import React from "react";

const Tag = ({
  children,
  className = "",
  size = "sm",
  variant = "default",
}) => {
  const sizeClasses = {
    base: "text-base",
    sm: "text-sm",
    xs: "text-xs",
  };

  const variantClasses = {
    default: "bg-gray-700 text-white",
    yellow: "bg-yellow-400/10 border border-yellow-400/20 text-yellow-400",
    success: "bg-green-400/10 border border-green-400/20 text-green-400",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Tag;
