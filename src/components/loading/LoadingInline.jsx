import React from "react";
import LogoHeading from "../brand/LogoHeading";

export const LoadingInline = ({ spinnerOnly = false }) => {
  if (spinnerOnly) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "4rem",
            height: "4rem",
            border: "4px solid #4B5563",
            borderTopColor: "#FBBF24",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto",
          }}
        ></div>
      </div>
    );
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #374151, #1F2937, #111827)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "4rem",
            height: "4rem",
            border: "4px solid #4B5563",
            borderTopColor: "#FBBF24",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem",
          }}
        ></div>
        <LogoHeading size={1.5} />
        <p
          style={{
            color: "#FFFFFF",
            fontSize: "1.125rem",
            fontWeight: "500",
            marginTop: "1rem",
          }}
        >
          Loading POVlib data...
        </p>
      </div>
    </div>
  );
};
