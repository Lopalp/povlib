import React from "react";
import Logo from "./Logo";
import BrandHeading from "./BrandHeading";

const LogoHeading = ({ size }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center", // Vertically center the content
        gap: size * 5,
      }}
    >
      <Logo size={size} />
      <BrandHeading size={size} />
    </div>
  );
};

export default LogoHeading;
