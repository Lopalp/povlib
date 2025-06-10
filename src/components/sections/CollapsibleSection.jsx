import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { IconButton } from "../buttons";

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700 transition-colors"
      >
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <IconButton>
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </IconButton>
      </button>
      {isOpen && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}
