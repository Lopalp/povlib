import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

const SidebarMenuItem = ({ item, isActive, onClose, index }) => {
  const baseClasses =
    "block px-6 py-4 text-sm transition-colors duration-200 hover:text-yellow-400 relative overflow-hidden m-0 border-b border-gray-700/30";

  const getItemClasses = () => {
    if (isActive) {
      return `${baseClasses} text-yellow-400 bg-yellow-400/10 group`;
    }
    return `${baseClasses} ${
      item.primary ? "text-white" : "text-gray-200"
    } group`;
  };

  const getButtonClasses = () => {
    return `w-full text-left px-6 py-4 text-sm transition-colors duration-200 hover:text-yellow-400 relative overflow-hidden m-0 group border-b border-gray-700/30 ${
      item.primary ? "text-white" : "text-gray-200"
    }`;
  };

  if (item.href) {
    return (
      <Link
        href={item.href}
        onClick={() => {
          item.onClick?.();
          onClose();
        }}
        className={getItemClasses()}
      >
        {item.backgroundImage && (
          <>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-lg" />
            <div
              className="absolute inset-0 transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundImage: `url(${item.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                maskImage:
                  "linear-gradient(to right, transparent 0%, transparent 20%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,1) 80%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, transparent 20%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,1) 80%)",
              }}
            />
          </>
        )}
        <div className="relative z-10 flex items-center space-x-3">
          {item.icon && <span className="flex-shrink-0 text-lg">{item.icon}</span>}
          <span className="font-medium">{item.label}</span>
        </div>
      </Link>
    );
  }

  return (
    <button
      onClick={() => {
        item.onClick?.();
        onClose();
      }}
      className={getButtonClasses()}
    >
      {item.backgroundImage && (
        <>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-lg" />
          <div
            className="absolute inset-0 transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundImage: `url(${item.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              maskImage:
                "linear-gradient(to right, transparent 0%, transparent 20%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,1) 80%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, transparent 20%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,1) 80%)",
            }}
          />
        </>
      )}
      <div className="relative z-10 flex items-center space-x-3">
        {item.icon && <span className="flex-shrink-0 text-lg">{item.icon}</span>}
        <span className="font-medium">{item.label}</span>
      </div>
    </button>
  );
};

export default function SidebarOverlay({
  isOpen,
  onClose,
  items,
  title = "Navigation",
  className = "",
}) {
  const sidebarRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    
    // Prevent body scroll when sidebar is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const isActiveItem = (href) => {
    if (href === "/maps" && pathname === "/maps") return true;
    if (href !== "/maps" && pathname === href) return true;
    return false;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-80 bg-black/70 backdrop-blur-xl border-r border-gray-700 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="overflow-y-auto h-full pb-20">
          <div className="py-2">
            {items.map((item, index) => {
              if (item.type === "divider") {
                return (
                  <div key={index} className="border-t border-gray-600 my-2 mx-6" />
                );
              }

              if (item.type === "section") {
                return (
                  <div key={index} className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </div>
                );
              }

              const isActive = isActiveItem(item.href);

              return (
                <SidebarMenuItem
                  key={index}
                  item={item}
                  isActive={isActive}
                  onClose={onClose}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// Hook für einfache Verwendung
export function useSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  };
}