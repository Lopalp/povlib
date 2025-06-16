"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useNavbar } from "../../context/NavbarContext";

export default function Sidebar({ items }) {
  const { isMenuOpen, setIsMenuOpen } = useNavbar();

  const menuItems =
    items || [
      { label: "Home", href: "/" },
      { label: "Demos", href: "/demos" },
      { label: "Players", href: "/players" },
      { label: "Maps", href: "/maps" },
      { label: "Utility Book", href: "/utility-book" },
    ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-16 left-0 bottom-0 w-64 flex-col bg-gray-900 border-r border-gray-700 p-6 space-y-4">
        <nav className="flex flex-col space-y-4">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href} className="text-gray-200 hover:text-yellow-400">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64 bg-gray-900/90 backdrop-blur p-6 space-y-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-100 hover:text-yellow-400"
            >
              <X className="h-6 w-6" />
            </button>
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-200 hover:text-yellow-400"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
