"use client";

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  BellRing,
  LogIn,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { UserContext } from "../../../context/UserContext";
import LogoHeading from "../brand/LogoHeading";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { IconButton } from "../buttons";
import NavbarMenu from "../menus/NavbarMenu";

export default function Navbar({
  searchActive = false,
  setSearchActive = () => {},
  setIsMenuOpen = () => {},
  isMenuOpen = false,
  isSidebarCollapsed = false,
  setIsSidebarCollapsed = () => {},
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, setUser, isLoggedIn } = useContext(UserContext);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();

  // Navbar background glass effect
  const glassBg = "bg-black/50 backdrop-blur-lg";

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0);
      setSearchActive(false);
      setUserMenuOpen(false);
      setIsMenuOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [setSearchActive, setIsMenuOpen]);

  const toggleSearch = () => {
    setSearchActive((prev) => !prev);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchActive(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      router.push("/");
    }
  };

  const isActive = (path) => pathname === path;

  return (
    <header className={`fixed top-0 w-full z-50 ${glassBg}`}>
      <div className="w-full px-4 md:px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSidebarCollapsed((c) => !c)}
              className="hidden md:flex p-2 text-gray-100 hover:text-brand-yellow"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <LogoHeading size={1.5} />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-grow items-center justify-center space-x-6">
            {/* Search Bar */}
            <div className="flex-grow max-w-xl">
              <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search demos, players, teams, utilities..."
                  className="px-4 py-2 rounded-full bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none w-full"
                />
                <button type="submit" className="ml-2">
                  <Search className="h-5 w-5 text-gray-100 hover:text-brand-yellow" />
                </button>
              </form>
            </div>

            {/* Notifications */}
            {isLoggedIn && (
              <Link href="/user">
                <button className="p-2 relative text-gray-300 hover:text-brand-yellow">
                  <BellRing className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full" />
                </button>
              </Link>
            )}

            {/* User avatar or Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="p-1 border border-yellow-400 rounded-full"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-gray-400">
                      {user.name[0]}
                    </span>
                  )}
                </button>
                {userMenuOpen && (
                  <NavbarMenu
                    isOpen
                    onClose={() => setUserMenuOpen(false)}
                    items={[
                      { label: "Profile", href: "/user" },
                      { label: "Sign Out", onClick: handleSignOut },
                    ]}
                    position="bottom right"
                    triggerRef={null}
                  />
                )}
              </div>
            ) : (
              <>
                <div className="w-8 h-8" /> {/* placeholder for alignment */}
                <Link
                  href="/signin"
                  className="px-4 py-2 border border-yellow-400 rounded-full text-white hover:bg-yellow-400 hover:text-gray-900"
                >
                  <LogIn className="h-4 w-4 mr-2 inline" /> Sign In
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Icons */}
          <div className="flex items-center md:hidden space-x-4">
            <IconButton onClick={toggleSearch}>
              <Search className="h-5 w-5 text-gray-100" />
            </IconButton>
            <button onClick={() => setIsMenuOpen((o) => !o)} className="p-2 text-gray-100">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {searchActive && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-md flex items-center bg-gray-800 rounded-full px-4"
          >
            <input
              type="text"
              value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search demos, players, teams, utilities..."
              className="flex-grow py-2 bg-transparent placeholder-gray-400 text-white focus:outline-none"
            />
            <button type="submit">
              <Search className="h-5 w-5 text-gray-100 hover:text-brand-yellow" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-lg overflow-y-auto">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <nav className="flex flex-col space-y-6">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search demos, players, teams, utilities..."
                  className="px-4 py-2 rounded-full bg-gray-700 text-gray-100 placeholder-gray-400 w-full focus:outline-none"
                />
                <button type="submit" className="ml-2">
                  <Search className="h-5 w-5 text-gray-100 hover:text-brand-yellow" />
                </button>
              </form>

              {user ? (
                <button
                  onClick={handleSignOut}
                  className="text-left text-gray-200 hover:text-brand-yellow"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 rounded-full bg-yellow-400 text-gray-900 text-center font-bold"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
