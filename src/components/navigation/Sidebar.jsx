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
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Mail,
  Shield,
  FileText,
  Settings,
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
        className={`hidden md:flex fixed left-0 bottom-0 z-40 flex-col border-r border-gray-700 transition-all duration-300 overflow-y-auto sidebar-scrollbar p-3 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}
        style={{
          top: "4rem",
          position: "fixed",
          border: "none",
          backgroundColor: "#030712",
        }}
      >
        <nav
          className="flex flex-col space-y-6"
        >
          {/* Sidebar toggle button - now styled like other entries */}
          <button
            onClick={() => setIsSidebarCollapsed((c) => !c)}
            className={`flex items-center text-sm font-medium text-gray-400 hover:text-brand-yellow transition-colors ${
              isSidebarCollapsed ? "justify-center" : "space-x-3 pl-3"
            }`}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
            {!isSidebarCollapsed && (
              <span className={`transition-opacity duration-300 ${
                isSidebarCollapsed ? 'opacity-0' : 'opacity-100'
              }`} style={{
                transitionDelay: isSidebarCollapsed ? '0ms' : '300ms'
              }}>
                Collapse
              </span>
            )}
          </button>

          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center text-sm font-medium text-gray-200 hover:text-brand-yellow transition-colors ${
                isSidebarCollapsed ? "justify-center" : "space-x-3 pl-3"
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isSidebarCollapsed && (
                <span className={`transition-opacity duration-300 ${
                  isSidebarCollapsed ? 'opacity-0' : 'opacity-100'
                }`} style={{
                  transitionDelay: isSidebarCollapsed ? '0ms' : '300ms'
                }}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
          {isSidebarCollapsed ? (
            <>
              <hr className="border-gray-700 my-6" />
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-400 opacity-0">
                You
              </h3>
              {youItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-center text-sm text-gray-200 hover:text-brand-yellow transition-colors"
                  title={item.label}
                >
                  {item.icon}
                </Link>
              ))}
              <hr className="border-gray-700 my-6" />
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-400 opacity-0">
                Analytics
              </h3>
              {analyticsItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-center text-sm text-gray-200 hover:text-brand-yellow transition-colors"
                  title={item.label}
                >
                  {item.icon}
                </Link>
              ))}
            </>
          ) : (
            <>
              <hr className="border-gray-700 my-6" />
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-400">
                You
              </h3>
              {youItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-3 pl-3 text-sm text-gray-200 hover:text-brand-yellow transition-colors"
                >
                  {item.icon}
                  <span className={`transition-opacity duration-300 ${
                    isSidebarCollapsed ? 'opacity-0' : 'opacity-100'
                  }`} style={{
                    transitionDelay: isSidebarCollapsed ? '0ms' : '300ms'
                  }}>
                    {item.label}
                  </span>
                </Link>
              ))}
              <hr className="border-gray-700 my-6" />
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-400">
                Analytics
              </h3>
              {analyticsItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-3 pl-3 text-sm text-gray-200 hover:text-brand-yellow transition-colors"
                >
                  {item.icon}
                  <span className={`transition-opacity duration-300 ${
                    isSidebarCollapsed ? 'opacity-0' : 'opacity-100'
                  }`} style={{
                    transitionDelay: isSidebarCollapsed ? '0ms' : '300ms'
                  }}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </>
          )}
        </nav>
        {!isSidebarCollapsed && (
          <>
            <hr className="border-gray-700 my-6" />
            <h3 className="mb-4 text-sm font-bold uppercase text-gray-400">
              Resources
            </h3>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow transition-colors"
            >
              About
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow transition-colors"
            >
              Contact
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow transition-colors"
            >
              Support
            </Link>
            <hr className="border-gray-700 my-6" />
            <h3 className="mb-4 text-sm font-bold uppercase text-gray-400">
              Legal
            </h3>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-200 hover:text-brand-yellow transition-colors"
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
              <h3 className="mb-6 text-sm font-bold uppercase text-gray-400">
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
          width: 8px !important;
        }
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent !important;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background-color: #9ca3af !important;
          border-radius: 4px !important;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #d1d5db !important;
        }
        /* Firefox scrollbar */
        .sidebar-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #9ca3af transparent;
        }
      `}</style>
    </>
  );
}
