import React from "react";
import { Tag } from "../tags";

const CompetitionCard = ({ title = "Competition", timeLeft = "Time Left" }) => {
  return (
    <div className="bg-gray-900 rounded-2xl p-8 space-y-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
          <button className="p-1 rounded-full hover:bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 hover:text-white"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </div>
        <Tag
          variant="primary"
          size="xs"
          className="text-yellow-400 bg-white/10 border border-yellow-400"
        >
          {timeLeft}
        </Tag>
      </div>
    </div>
  );
};

export default CompetitionCard;
