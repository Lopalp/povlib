"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";
import { NavbarProvider, useNavbar } from "../../context/NavbarContext";

function GlobalLayoutContent({ children }) {
  const pathname = usePathname();
  const {
    searchActive,
    setSearchActive,
    isMenuOpen,
    setIsMenuOpen,
    demoType,
    handleSwitchDemoType,
  } = useNavbar();

  // Pages that should not have navbar and footer
  const excludedPages = ["/signin"];
  const shouldShowNavigation = !excludedPages.includes(pathname);

  return (
    <>
      {shouldShowNavigation && (
        <Navbar
          demoType={demoType}
          onSwitchDemoType={handleSwitchDemoType}
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          setIsMenuOpen={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
        />
      )}

      <main>{children}</main>

      {shouldShowNavigation && <Footer />}
    </>
  );
}

export default function GlobalLayout({ children }) {
  return (
    <NavbarProvider>
      <GlobalLayoutContent>{children}</GlobalLayoutContent>
    </NavbarProvider>
  );
}
