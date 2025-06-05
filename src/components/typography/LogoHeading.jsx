import React from "react";
import Image from "next/image";

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
      <Image
        src="/povlib_logo.svg"
        width={size * 20}
        height={size * 20}
        alt="POVlib Logo"
      />
      <h1
        className={`text-xl font-black`}
        style={{
          fontSize: `${size}rem`,
          lineHeight: `${size * 1.2}rem`,
          marginTop: 4,
        }}
      >
        <span className="text-yellow-400">POV</span>
        <span className="text-white" style={{ fontWeight: 500 }}>
          lib
        </span>
        <span
          className="text-gray-400"
          style={{ fontSize: size * 10, fontWeight: 500 }}
        >
          .gg
        </span>
      </h1>
    </div>
  );
};

export default LogoHeading;
