import React from "react";
import { X } from "lucide-react";
import { IconButton } from "../buttons";

export default function CompetitionInfoModal({ title, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">About "{title}"</h2>
          <IconButton onClick={onClose}>
            <X className="h-6 w-6" />
          </IconButton>
        </div>
        <p className="text-gray-300 mb-2">
          Each round showcases top POV clips. Vote for your favorite!
        </p>
        <p className="text-gray-300 mb-2">
          The clip with the most votes at the end wins.
        </p>
        <p className="text-gray-300">
          Use the "Submit Your Clip" option to enter future competitions.
        </p>
      </div>
    </div>
  );
}
