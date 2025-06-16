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
} from "lucide-react";
import { useNavbar } from "../../context/NavbarContext";

export default function Sidebar({ items }) {
  const {
    isMenuOpen,
    setIsMenuOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = useNavbar();

  const menuItems =
    items || [
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

  const footerSections = [
    {
      title: "Navigation",
      items: ["Home", "Maps", "Players", "Events"],
    },
    {
      title: "Resources",
      items: ["About", "Contact", "FAQ", "Support"],
    },
    {
      title: "Legal",
      items: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex fixed top-16 left-0 bottom-0 z-40 flex-col border-r border-gray-700 bg-black/50 backdrop-blur-lg transition-all duration-300 overflow-y-auto sidebar-scrollbar ${
          isSidebarCollapsed ? "w-16 p-3" : "w-64 p-6"
        }`}
      >
        {!isSidebarCollapsed && (
          <div className="border border-brand-yellow text-brand-yellow rounded p-3 text-center text-xs mb-4">
            Upgrade to Pro for <span className="font-bold">$6.99/mo</span>
          </div>
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
              <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">You</h3>
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
              <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">Analytics</h3>
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
          <div className="mt-auto space-y-6 pt-6 border-t border-gray-700 overflow-y-auto">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-bold mb-2 text-sm">
                  {section.title}
                </h3>
                <ul className="space-y-1 text-xs">
                  {section.items.map((it) => (
                    <li key={it}>
                      <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors">
                        {it}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex space-x-3 pt-4">
              {[1, 2, 3].map((n) => (
                <a key={n} href="#" className="text-gray-400 hover:text-brand-yellow transition-colors">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
                    <img
                      src="https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true"
                      className="w-4 h-4 rounded-full"
                      alt="social"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
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
            <div className="border border-brand-yellow text-brand-yellow rounded p-3 text-center text-xs">
              Upgrade to Pro for <span className="font-bold">$6.99/mo</span>
            </div>
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
              <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">You</h3>
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
              <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">Analytics</h3>
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
            </nav>
          </div>
          <div className="flex-1" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}
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
