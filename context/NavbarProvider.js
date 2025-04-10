"use client";
import { createContext, useState, useContext, useMemo } from "react";

const NavbarContext = createContext(null);

export default function NavbarProvider({ children }) {
  const [searchActive, setSearchActive] = useState(false);
  const [demoType, setDemoType] = useState("pro"); // Default value
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const value = useMemo(
    () => ({
      searchActive,
      setSearchActive,
      demoType,
      setDemoType,
      isMenuOpen,
      setIsMenuOpen,
    }),
    [searchActive, demoType, isMenuOpen]
  );

  return (
    <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === null) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
}
