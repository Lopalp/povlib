import React from "react";

const SettingsHeading = ({ children, className = "" }) => {
  return (
    <h2 className={`text-xl font-bold text-white ${className}`}>{children}</h2>
  );
};

export default SettingsHeading;
