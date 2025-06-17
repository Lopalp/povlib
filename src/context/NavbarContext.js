"use client";

import React, { createContext, useContext, useState } from "react";

const NavbarContext = createContext();

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
};

export const NavbarProvider = ({ children }) => {
  const [searchActive, setSearchActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [demoType, setDemoType] = useState("pro");

  const handleSwitchDemoType = (newType) => {
    setDemoType(newType);
  };

  const value = {
    searchActive,
    setSearchActive,
    isMenuOpen,
    setIsMenuOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    demoType,
    setDemoType,
    handleSwitchDemoType,
  };

  return (
    <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>
  );
};
