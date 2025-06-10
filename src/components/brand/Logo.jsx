import React from "react";
import Image from "next/image";

const Logo = ({ size = 1 }) => {
  return (
    <Image
      src="/povlib_logo.svg"
      width={size * 20}
      height={size * 20}
      alt="POVlib Logo"
    />
  );
};

export default Logo;
