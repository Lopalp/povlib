"use client";

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  MapPin,
  FileVideo,
  BellRing,
  LogIn,
} from "lucide-react";
import { UserContext } from "../../../context/UserContext";
import LogoHeading from "../typography/LogoHeading";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { IconButton } from "../buttons";

const mapNamesDesktop = [
  { label: "Mirage", slug: "mirage" },
  { label: "Inferno", slug: "inferno" },
  { label: "Nuke", slug: "nuke" },
  { label: "Ancient", slug: "ancient" },
  { label: "Overpass", slug: "overpass" },
  { label: "Anubis", slug: "anubis" },
  { label: "Vertigo", slug: "vertigo" },
];

const mostPlayedMapsMobile = [
  { label: "Mirage", slug: "mirage" },
  { label: "Inferno", slug: "inferno" },
  { label: "Nuke", slug: "nuke" },
  { label: "Ancient", slug: "ancient" },
];

export default function Navbar({
  searchActive,
  setSearchActive,
  setIsMenuOpen,
  isMenuOpen,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mapMenuOpen, setMapMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, setUser } = useContext(UserContext);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  // Glas-Hintergrund für Desktop-Navbar
  const glassBg = "bg-black/50 backdrop-blur-lg border border-gray-700";

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0);
      // Bei Scroll alle Untermenüs schließen
      setMapMenuOpen(false);
      setUserMenuOpen(false);
      setSearchActive(false);
      setIsMenuOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [setSearchActive, setIsMenuOpen]);

  const toggleSearch = () => {
    setMapMenuOpen(false);
    setSearchActive((prev) => !prev);
  };

  const toggleMaps = () => {
    setSearchActive(false);
    setMapMenuOpen((prev) => !prev);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Such-Logik hier
    setSearchActive(false);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      router.push("/");
    }
  };

  // Jetzt mit font-light statt font-normal
  const linkClasses =
    "text-sm font-light transition-colors duration-200 hover:text-yellow-400";

  // Fullscreen-Overlay für das mobile Menü – höherer z-index als die Navbar
  const mobileOverlayBg =
    "fixed inset-0 z-60 bg-black/90 backdrop-blur-lg border-t border-gray-800 overflow-y-auto";

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${glassBg}`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <LogoHeading size={1.5} />
            </Link>
          </div>

          {/* Desktop-Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`${linkClasses} text-white`}>
              Home
            </Link>
            <div className="relative">
              <button
                onClick={toggleMaps}
                className={`${linkClasses} text-gray-300 flex items-center gap-1.5`}
              >
                Maps <ChevronDown className="h-4 w-4" />
              </button>
              {mapMenuOpen && (
                <ul
                  className={`absolute left-0 mt-2 w-52 rounded-lg py-2 shadow-lg ${glassBg} z-50`}
                >
                  <li>
                    <Link
                      href="/maps"
                      className="block px-4 py-2 text-sm text-white hover:text-yellow-400"
                    >
                      All Maps
                    </Link>
                  </li>
                  <li className="border-t border-gray-600 my-1" />
                  {mapNamesDesktop.map((m) => (
                    <li key={m.slug}>
                      <Link
                        href={`/maps/${m.slug}`}
                        className="block px-4 py-2 text-sm text-gray-200 hover:text-yellow-400"
                      >
                        {m.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Link href="/demos" className={`${linkClasses} text-gray-200`}>
              Demos
            </Link>
            <Link href="/players" className={`${linkClasses} text-gray-200`}>
              Players
            </Link>
            <Link href="/viewer" className={`${linkClasses} text-gray-200`}>
              Demo Viewer
            </Link>
            <div className="relative group">
              <span className={`${linkClasses} text-gray-200 cursor-default`}>
                Community
              </span>
              <div
                className={`absolute left-1/2 top-full mt-2 w-44 -translate-x-1/2 rounded-lg py-2 text-center text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity ${glassBg}`}
              >
                Coming Soon
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Such-Icon */}
            <IconButton
              onClick={toggleSearch}
              className="text-gray-300 hover:text-yellow-400"
            >
              <Search className="h-5 w-5" />
            </IconButton>
            {searchActive && (
              <form
                onSubmit={handleSearchSubmit}
                className={`flex items-center rounded-full overflow-hidden shadow-lg ${glassBg}`}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search POVs, maps, players or teams..."
                  className="flex-grow px-4 py-2 bg-transparent placeholder-gray-400 text-white focus:outline-none"
                />
                {searchQuery && (
                  <IconButton
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="px-3 text-gray-300 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </IconButton>
                )}
                <IconButton
                  type="submit"
                  className="px-3 text-gray-300 hover:text-white"
                >
                  <Search className="h-5 w-5" />
                </IconButton>
              </form>
            )}

            {/* Glocken-Symbol (Notifications) */}
            <Link href="/user">
              <button className="hidden md:block p-2 relative text-gray-300 hover:text-yellow-400 cursor-pointer">
                <BellRing className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full" />
              </button>
            </Link>

            {user ? (
              <div className="relative">
                <Link href="/user" className="block">
                  <div className="p-1 border border-yellow-400 rounded-full text-gray-300 hover:text-yellow-400 cursor-pointer">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name.slice(0, 1)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          {user.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <Link
                href="/signin"
                className="hidden lg:flex items-center px-4 py-2 border border-yellow-400/30 rounded-full text-white hover:bg-yellow-400 hover:text-gray-900 transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" /> Sign In
              </Link>
            )}

            {/* Burger-Icon für Mobile */}
            <button
              onClick={() => setIsMenuOpen((o) => !o)}
              className="md:hidden p-2 text-gray-300 hover:text-yellow-400"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Fullscreen-Overlay-Menü */}
      {isMenuOpen && (
        <div className={mobileOverlayBg}>
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-6">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-white text-lg font-light hover:text-yellow-400"
              >
                Home
              </Link>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center mb-3 text-lg font-light text-white">
                  <MapPin className="h-5 w-5 text-yellow-400 mr-2" /> Maps
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {mostPlayedMapsMobile.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/maps/${m.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 text-center text-gray-200 border border-gray-700 rounded-md hover:text-yellow-400 font-light"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/maps"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-3 block text-sm text-yellow-400 hover:underline font-light"
                >
                  All Maps →
                </Link>
              </div>

              <Link
                href="/demos"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-gray-200 hover:text-yellow-400 font-light"
              >
                <FileVideo className="h-5 w-5 text-yellow-400" /> Demos
              </Link>

              <Link
                href="/players"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-gray-200 hover:text-yellow-400 font-light"
              >
                <User className="h-5 w-5 text-yellow-400" /> Players
              </Link>

              <Link
                href="/viewer"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-gray-200 hover:text-yellow-400 font-light"
              >
                <FileVideo className="h-5 w-5 text-yellow-400" /> Demo Viewer
              </Link>

              <Link
                href="/signin"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full py-3 rounded-full bg-yellow-400 text-gray-900 text-center font-bold hover:bg-yellow-300 transition-colors"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
