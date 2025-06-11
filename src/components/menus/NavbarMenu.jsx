import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavbarMenuItem = ({ item, isActive, onClose, index }) => {
  const baseClasses =
    "block px-6 py-3 text-sm transition-colors duration-200 hover:text-yellow-400 relative overflow-hidden m-0";

  const getItemClasses = () => {
    if (isActive) {
      return `${baseClasses} text-yellow-400 bg-yellow-400/10 group`;
    }
    return `${baseClasses} ${
      item.primary ? "text-white" : "text-gray-200"
    } group`;
  };

  const getButtonClasses = () => {
    return `w-full text-left px-6 py-3 text-sm transition-colors duration-200 hover:text-yellow-400 relative overflow-hidden m-0 group ${
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
        style={{}}
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
        <div className="relative z-10 flex items-center space-x-2">
          {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
          <span>{item.label}</span>
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
      style={{}}
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
      <div className="relative z-10 flex items-center space-x-2">
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span>{item.label}</span>
      </div>
    </button>
  );
};

export default function NavbarMenu({
  isOpen,
  onClose,
  items,
  position = "bottom left",
  triggerRef,
  className = "",
}) {
  const menuRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      // Don't close if clicking on the trigger button
      if (
        triggerRef &&
        triggerRef.current &&
        triggerRef.current.contains(event.target)
      ) {
        return;
      }

      // Don't close if clicking inside the menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  // Position classes based on position prop
  const getPositionClasses = () => {
    switch (position) {
      case "top left":
      case "top-left":
        return "right-0 mb-2 bottom-full";
      case "top right":
      case "top-right":
        return "left-0 mb-2 bottom-full";
      case "bottom left":
      case "bottom-left":
        return "right-0 mt-2";
      case "bottom right":
      case "bottom-right":
        return "left-0 mt-2";
      default:
        return "left-0 mt-2";
    }
  };

  const isActiveItem = (href) => {
    if (href === "/maps" && pathname === "/maps") return true;
    if (href !== "/maps" && pathname === href) return true;
    return false;
  };

  return (
    <div
      ref={menuRef}
      className={`absolute ${getPositionClasses()} w-auto min-w-52 bg-black/50 backdrop-blur-lg border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden ${className}`}
    >
      {items.map((item, index) => {
        if (item.type === "divider") {
          return <div key={index} className="border-t border-gray-600 m-0" />;
        }

        const isActive = isActiveItem(item.href);

        return (
          <NavbarMenuItem
            key={index}
            item={item}
            isActive={isActive}
            onClose={onClose}
            index={index}
          />
        );
      })}
    </div>
  );
}
