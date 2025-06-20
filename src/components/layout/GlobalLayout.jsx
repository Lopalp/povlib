"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";
import Sidebar from "../navigation/Sidebar";
import { NavbarProvider, useNavbar } from "../../context/NavbarContext";
import { Analytics } from "@vercel/analytics/next"


function GlobalLayoutContent({ children }) {
  const pathname = usePathname();
  const {
    searchActive,
    setSearchActive,
    isMenuOpen,
    setIsMenuOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
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
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
      )}

      <div className="flex">
        {shouldShowNavigation && <Sidebar />}
        <main
          className={`flex-1 ${
            shouldShowNavigation
              ? isSidebarCollapsed
                ? "md:ml-16"
                : "md:ml-64"
              : ""
          }`}
        >
          {children}
        </main>
      </div>

      {shouldShowNavigation && <Footer />}
    </>
  );
}

export default function GlobalLayout({ children }) {
  return (
    <NavbarProvider>
      <Analytics/>
      <GlobalLayoutContent>{children}</GlobalLayoutContent>
    </NavbarProvider>
  );
}
