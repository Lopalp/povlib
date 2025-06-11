import React from "react";

const Tag = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) => {
  const baseClasses = "text-white rounded-full inline-block";

  const variants = {
    default: "bg-gray-700",
    primary: "bg-yellow-400 text-black",
    secondary: "bg-white/10 border border-white/20",
    success: "bg-green-600",
    warning: "bg-orange-500",
    danger: "bg-red-600",
  };

  const sizes = {
    xs: "text-xs px-2 py-0.5",
    sm: "text-sm px-3 py-1",
    md: "text-base px-4 py-1.5",
    lg: "text-lg px-5 py-2",
  };

  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.sm;

  return (
    <span
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export default Tag;
