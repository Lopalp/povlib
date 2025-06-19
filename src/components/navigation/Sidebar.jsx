"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  Home,
  Film,
  Users,
  Map,
  BookOpen,
  Clock,
  Scissors,
  Crosshair,
  MonitorPlay,
  BrainCircuit,
  Activity,
  Trophy,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { useNavbar } from "../../context/NavbarContext";

export default function Sidebar({ items }) {
  const {
    isMenuOpen,
    setIsMenuOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = useNavbar();

  const menuItems = items || [
    { label: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { label: "Demos", href: "/demos", icon: <Film className="h-5 w-5" /> },
    { label: "Players", href: "/players", icon: <Users className="h-5 w-5" /> },
    { label: "Maps", href: "/maps", icon: <Map className="h-5 w-5" /> },
    {
      label: "Utility Book",
      href: "/utility-book",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ];

  const youItems = [
    { label: "History", href: "/history", icon: <Clock className="h-5 w-5" /> },
    {
      label: "Your Matches",
      href: "/matches",
      icon: <Crosshair className="h-5 w-5" />,
    },
    {
      label: "Your Demos",
      href: "/your-demos",
      icon: <Film className="h-5 w-5" />,
    },
    {
      label: "Watch Later",
      href: "/watch-later",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      label: "Your Clips",
      href: "/clips",
      icon: <Scissors className="h-5 w-5" />,
    },
  ];

  const analyticsItems = [
    {
      label: "2D Viewer",
      href: "/analytics/2d-viewer",
      icon: <MonitorPlay className="h-5 w-5" />,
    },
    {
      label: "Deep Demo Viewer",
      href: "/analytics/deep-demo-viewer",
      icon: <BrainCircuit className="h-5 w-5" />,
    },
    {
      label: "Your Development",
      href: "/analytics/development",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      label: "Compare to Pro",
      href: "/analytics/compare-pro",
      icon: <Trophy className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex fixed left-0 bottom-0 z-40 flex-col border-r border-gray-700 transition-all duration-300 overflow-y-auto sidebar-scrollbar ${
          isSidebarCollapsed ? "w-16 p-3" : "w-64 p-6"
        }`}
        style={{
          top: "4rem",
          position: "fixed",
          border: "none",
          backgroundColor: "#030712",
        }}
      >
        {/* Sidebar toggle button */}
        <button
          onClick={() => setIsSidebarCollapsed((c) => !c)}
          className="flex items-center justify-center mb-4 p-2 text-gray-100 hover:text-brand-yellow w-full"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
        {!isSidebarCollapsed && (
          <Link
            href="/checkout?plan=pro"
            className="border border-brand-yellow text-brand-yellow rounded-lg p-3 text-center text-sm font-medium mb-4 hover:bg-brand-yellow/10"
          >
            Upgrade to Pro for <span className="font-bold">$6.99/mo</span>
          </Link>
        )}
        <nav
          className={`flex flex-col space-y-4 ${
            isSidebarCollapsed ? "items-center" : "mt-4"
          }`}
        >
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center text-sm font-medium text-gray-200 hover:text-brand-yellow transition-colors ${
                isSidebarCollapsed ? "justify-center" : "space-x-3"
              }`}
            >
              {item.icon}
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
          {!isSidebarCollapsed && (
            <>
              <hr className="border-gray-700 my-4" />
              <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">
                You
              </h3>
              {youItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-3 text-sm text-gray-200 hover:text-brand-yellow"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <hr className="border-gray-700 my-4" />
              <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">
                Analytics
              </h3>
              {analyticsItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-3 text-sm text-gray-200 hover:text-brand-yellow"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>
        {!isSidebarCollapsed && (
          <>
            <hr className="border-gray-700 my-4" />
            <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">
              Resources
            </h3>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow"
            >
              About
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow"
            >
              Contact
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow"
            >
              FAQ
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow"
            >
              Support
            </Link>
            <hr className="border-gray-700 my-4" />
            <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">
              Legal
            </h3>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow"
            >
              Cookie Policy
            </Link>
          </>
        )}
      </aside>

      {/* Mobile overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64 bg-gray-900/90 backdrop-blur p-6 space-y-4 overflow-y-auto sidebar-scrollbar">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-100 hover:text-brand-yellow"
            >
              <X className="h-6 w-6" />
            </button>
            <Link
              href="/checkout?plan=pro"
              onClick={() => setIsMenuOpen(false)}
              className="border border-brand-yellow text-brand-yellow rounded-lg p-3 text-center text-sm font-medium hover:bg-brand-yellow/10"
            >
              Upgrade to Pro for <span className="font-bold">$6.99/mo</span>
            </Link>
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 text-sm font-medium text-gray-200 hover:text-brand-yellow"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <hr className="border-gray-700 my-4" />
              <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">
                You
              </h3>
              {youItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 text-sm font-medium text-gray-200 hover:text-brand-yellow"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <hr className="border-gray-700 my-4" />
              <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">
                Analytics
              </h3>
              {analyticsItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 text-sm font-medium text-gray-200 hover:text-brand-yellow"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <hr className="border-gray-700 my-4" />
              <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">
                Resources
              </h3>
              {["About", "Contact", "FAQ", "Support"].map((label) => (
                <Link
                  key={label}
                  href="#"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm text-gray-200 hover:text-brand-yellow"
                >
                  {label}
                </Link>
              ))}
              <hr className="border-gray-700 my-4" />
              <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">
                Legal
              </h3>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (label) => (
                  <Link
                    key={label}
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-gray-200 hover:text-brand-yellow"
                  >
                    {label}
                  </Link>
                )
              )}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}
      {/* SVG overlay container, absolutely positioned to the top-right */}

      <style jsx>{`
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}
