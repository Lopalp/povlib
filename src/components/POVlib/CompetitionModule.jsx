'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PlayCircle, Info, X } from 'lucide-react';
import { getFilteredDemos } from '@/lib/supabase';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const getRandomImage = () => {
  const images = ['/img/v2.png', '/img/v3.png', '/img/v4.png'];
  return images[Math.floor(Math.random() * images.length)];
};

const getRandomVotes = () => Math.floor(Math.random() * 50 + 5);

export default function CompetitionModule({ title = 'Clip of the Week', clipCount = 4 }) {
  const [clips, setClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [results, setResults] = useState(null);

  // Demos laden
  useEffect(() => {
    (async () => {
      const demos = await getFilteredDemos({}, 'all');
      const chosen = demos.sort(() => 0.5 - Math.random()).slice(0, clipCount);
      const withVotes = chosen.map((clip) => ({
        ...clip,
        votes: getRandomVotes(),
      }));
      setClips(withVotes);
    })();
  }, [clipCount]);

  // Countdown (hier 10 Sekunden)
  const endTime = useMemo(() => new Date(Date.now() + 10000), []);
  useEffect(() => {
    const tick = () => {
      const diff = endTime.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Closed');
        return;
      }
      const s = Math.floor(diff / 1000);
      setTimeLeft(`${s}S`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [endTime]);

  // Wenn Zeit vorbei, Ergebnisse berechnen
  useEffect(() => {
    if (timeLeft !== 'Closed' || clips.length === 0) return;

    const totalVotes = clips.reduce((sum, clip) => sum + clip.votes, 0);
    const computed = clips
      .map((clip) => ({
        ...clip,
        percent: Math.round((clip.votes / totalVotes) * 100),
      }))
      .sort((a, b) => b.votes - a.votes);

    setResults(computed);
  }, [timeLeft, clips]);

  const handleSelect = (id) => {
    if (timeLeft === 'Closed') return;
    setSelectedClip((prev) => (prev === id ? null : id));
  };

  const hasEnded = timeLeft === 'Closed' && results;

  return (
    <>
      {/* ====================================================
          1) Voting-Zustand (bis Zeit abgelaufen)
      ==================================================== */}
      {!hasEnded ? (
        <section className="bg-gray-900 rounded-2xl p-8 space-y-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
              <button
                onClick={() => setIsInfoOpen(true)}
                className="p-1 rounded-full hover:bg-gray-800"
              >
                <Info className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-yellow-400 border border-yellow-400">
              {timeLeft}
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {clips.map((clip) => {
              const isSelected = selectedClip === clip.id;
              return (
                <div key={clip.id} className="flex flex-col items-center gap-2">
                  {/* Videokarte */}
                  <div
                    className={`relative w-full bg-gray-800 rounded-2xl overflow-hidden border-2 transition-colors ${
                      isSelected ? 'border-yellow-400' : 'border-transparent'
                    } hover:border-yellow-400 ${
                      selectedClip && !isSelected ? 'filter grayscale contrast-75' : ''
                    }`}
                  >
                    {/* Aspect-Ratio-Box: 4:3 */}
                    <div className="relative w-full pb-[133%] bg-black">
                      <video
                        src={clip.videoUrl || clip.video_id}
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
                      <h3 className="text-white font-bold truncate">{clip.title}</h3>
                      <p className="text-gray-300 text-sm">
                        by {clip.submitter || 'Unknown'}
                      </p>
                    </div>
                  </div>

                  {/* Select-Button */}
                  <button
                    onClick={() => handleSelect(clip.id)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-600 text-white text-sm font-semibold transition-colors ${
                      isSelected ? 'border-yellow-400 text-yellow-400' : 'hover:border-yellow-400'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        /* ====================================================
           2) Auswertungs-Zustand (nach Ablauf)
           – Grid: gleiche Struktur wie vorher (sm:2, lg:4)
           – Gewinner in Spalte 1
           – Chart-Wrapper (4:3) in Spalten 2–4
        ==================================================== */
        <section className="bg-gray-900 rounded-2xl p-8 space-y-6 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">Results</h2>
          <p className="text-yellow-400 text-center font-semibold">
            GZ to the winner! 🎉
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* ---------- Gewinner-Karte ---------- */}
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-xl font-semibold text-yellow-400">Winner</h3>
              <div className="relative w-full bg-gray-800 rounded-2xl overflow-hidden border-4 border-yellow-400">
                {/* Aspect-Ratio: 4:3, identisch zur Voting-Ansicht */}
                <div className="relative w-full pb-[133%] bg-black">
                  <video
                    src={results[0].videoUrl}
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
                  <h4 className="text-white font-bold truncate">{results[0].title}</h4>
                  <p className="text-gray-300 text-sm">
                    by {results[0].submitter || 'Unknown'}
                  </p>
                </div>
              </div>
              <p className="text-yellow-400 font-semibold text-lg">
                {results[0].percent}% – {results[0].votes} votes
              </p>
            </div>

            {/* ---------- Chart-Bereich (Spalten 2–4) ---------- */}
            <div className="col-span-3">
              {/* Wrapper sorgt dafür, dass Chart exakt 4:3 behält (Höhe = 133% von Breite) */}
              <div className="relative w-full pb-[133%] bg-gray-800 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={results.slice(1).map((item) => ({
                        name:
                          item.title.length > 10
                            ? item.title.slice(0, 10) + '…'
                            : item.title,
                        percent: item.percent,
                      }))}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#ddd', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#ddd', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                        unit="%"
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#2d2d2d', border: 'none' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ fill: 'rgba(250,204,21,0.1)' }}
                      />
                      <Bar dataKey="percent" fill="#FACC15" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================
          3) Info-Modal
      ==================================================== */}
      {isInfoOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setIsInfoOpen(false)}
        >
          <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">About "{title}"</h2>
              <button
                onClick={() => setIsInfoOpen(false)}
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
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
