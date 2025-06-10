import React from "react";

const ModalHeading = ({ children, className = "" }) => {
  return (
    <h2 className={`text-2xl sm:text-3xl font-bold text-white ${className}`}>
      {children}
    </h2>
  );
};

export default ModalHeading;
