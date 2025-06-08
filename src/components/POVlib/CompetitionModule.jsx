// components/POVlib/CompetitionModule.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PlayCircle, Info, X } from "lucide-react";
import { getFilteredDemos } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts/lib/index.js";
import { IconButton } from "../buttons";

const getRandomImage = () => {
  return `https://picsum.photos/seed/${Math.random()}/400/300`;
};

const getRandomVotes = () => Math.floor(Math.random() * 50 + 5);

export default function CompetitionModule({
  title = "Competition",
  timeLeft = "2 days left",
  hasEnded = false,
  submissions = [],
}) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  return (
    <>
      {/* =========================
          1) Voting-Zustand
      ========================= */}
      {!hasEnded ? (
        <section className="bg-gray-900 rounded-2xl p-8 space-y-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {title}
              </h2>
              <IconButton
                onClick={() => setIsInfoOpen(true)}
                className="hover:bg-gray-800"
              >
                <Info className="w-5 h-5 text-gray-400 hover:text-white" />
              </IconButton>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-yellow-400 border border-yellow-400">
              {timeLeft}
            </span>
          </div>

          {/* Einreichungen-Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((item, idx) => {
              const isWinner = idx === 0;
              return (
                <div key={idx} className="flex flex-col items-center space-y-2">
                  <div
                    className={`relative w-full rounded-lg overflow-hidden border-2 ${
                      isWinner
                        ? "border-yellow-400"
                        : "border-transparent filter grayscale contrast-75"
                    }`}
                  >
                    {/* Aspect-Ratio-Box 4:3 */}
                    <div className="relative w-full pb-[133%] bg-black">
                      <video
                        src={item.videoUrl}
                        poster={getRandomImage()}
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-black/40 backdrop-blur-md">
                      <h4 className="text-white font-bold truncate">
                        {item.title}
                      </h4>
                      <p className="text-gray-300 text-sm">
                        by {item.submitter || "Unknown"}
                      </p>
                      <p className="text-yellow-400 text-sm font-semibold mt-1">
                        {item.percent}% – {item.votes} votes
                      </p>
                    </div>
                  </div>

                  {/* Platz-Beschriftung */}
                  {isWinner ? (
                    <span className="text-yellow-400 font-semibold">
                      Winner
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Rank {idx + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="bg-gray-900 rounded-2xl p-8 space-y-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {title}
              </h2>
              <IconButton
                onClick={() => setIsInfoOpen(true)}
                className="hover:bg-gray-800"
              >
                <Info className="w-5 h-5 text-gray-400 hover:text-white" />
              </IconButton>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-yellow-400 border border-yellow-400">
              Ended
            </span>
          </div>

          {/* Ergebnisse-Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((item, idx) => {
              const isWinner = idx === 0;
              return (
                <div key={idx} className="flex flex-col items-center space-y-2">
                  <div
                    className={`relative w-full rounded-lg overflow-hidden border-2 ${
                      isWinner
                        ? "border-yellow-400"
                        : "border-transparent filter grayscale contrast-75"
                    }`}
                  >
                    {/* Aspect-Ratio-Box 4:3 */}
                    <div className="relative w-full pb-[133%] bg-black">
                      <video
                        src={item.videoUrl}
                        poster={getRandomImage()}
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-black/40 backdrop-blur-md">
                      <h4 className="text-white font-bold truncate">
                        {item.title}
                      </h4>
                      <p className="text-gray-300 text-sm">
                        by {item.submitter || "Unknown"}
                      </p>
                      <p className="text-yellow-400 text-sm font-semibold mt-1">
                        {item.percent}% – {item.votes} votes
                      </p>
                    </div>
                  </div>

                  {/* Platz-Beschriftung */}
                  {isWinner ? (
                    <span className="text-yellow-400 font-semibold">
                      Winner
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Rank {idx + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================
          3) Info-Modal
      ========================= */}
      {isInfoOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setIsInfoOpen(false)}
        >
          <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">About "{title}"</h2>
              <IconButton
                onClick={() => setIsInfoOpen(false)}
                className="text-gray-400 hover:text-yellow-400"
              >
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
      )}
    </>
  );
}
