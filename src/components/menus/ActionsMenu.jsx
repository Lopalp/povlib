import React, { useEffect, useRef } from "react";
import {
  TagIcon,
  Bookmark,
  Flag,
  Download,
  FileText,
  ExternalLink,
} from "lucide-react";

export default function ActionsMenu({
  isOpen,
  onClose,
  onOpenTagModal,
  demo,
  position = "top right",
  items,
  triggerRef,
}) {
  const menuRef = useRef(null);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
        return "right-0 mt-2";
    }
  };

  // If items are provided, use them directly (for playground)
  const menuItems = items || [
    {
      icon: <TagIcon className="h-4 w-4 text-yellow-400" />,
      label: "Add Tag",
      onClick: () => {
        onOpenTagModal();
        onClose();
      },
    },
    {
      icon: <Bookmark className="h-4 w-4 text-yellow-400" />,
      label: "Save",
      onClick: onClose,
    },
    {
      icon: <Flag className="h-4 w-4 text-red-500" />,
      label: "Report",
      onClick: onClose,
    },
    {
      icon: <Download className="h-4 w-4 text-yellow-400" />,
      label: "Download Video",
      onClick: () => {
        window.open(demo.video_url);
        onClose();
      },
    },
    {
      icon: <FileText className="h-4 w-4 text-yellow-400" />,
      label: "Download Demo",
      onClick: () => {
        window.open(demo.dem_url);
        onClose();
      },
    },
    {
      icon: <ExternalLink className="h-4 w-4 text-yellow-400" />,
      label: "Open Matchroom",
      onClick: () => {
        window.open(demo.matchroom_url, "_blank");
        onClose();
      },
    },
  ];

  return (
    <div
      ref={menuRef}
      className={`absolute ${getPositionClasses()} w-auto min-w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10`}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-gray-200 flex items-center space-x-2 whitespace-nowrap"
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
