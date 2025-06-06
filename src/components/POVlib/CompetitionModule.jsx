// components/POVlib/CompetitionModule.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PlayCircle, Info, X } from 'lucide-react';
import { getFilteredDemos } from '@/lib/supabase';
// Recharts für das Diagramm importieren
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const getRandomImage = () => {
  const images = [
    "/img/v2.png",
    "/img/v3.png",
    "/img/v4.png",
  ];
  return images[Math.floor(Math.random() * images.length)];
};

export default function CompetitionModule({
  title = 'Clip of the Week',
  clipCount = 4
}) {
  const [clips, setClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [results, setResults] = useState(null);

  // Clips laden (angenommen: jedes Clip-Objekt hat zusätzlich eine Zahl-Eigenschaft "votes")
  useEffect(() => {
    (async () => {
      const demos = await getFilteredDemos({}, 'all');
      // Beispiel: demos[i].votes ist vorhanden
      const chosen = demos.sort(() => 0.5 - Math.random()).slice(0, clipCount);
      setClips(chosen);
    })();
  }, [clipCount]);

  // Endzeitpunkt: genau 10 Sekunden ab Page-Load
  const endTime = useMemo(() => {
    return new Date(Date.now() + 10_000);
  }, []);

  // Countdown (jede Sekunde) mit D H M S
  useEffect(() => {
    const tick = () => {
      const diff = endTime.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Closed');
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d}D ${h}H ${m}M ${s}S`);
    };

    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [endTime]);

  // Sobald der Timer auf "Closed" wechselt, Ergebnisse berechnen
  useEffect(() => {
    if (timeLeft !== 'Closed' || clips.length === 0) return;

    // Stimmen summieren
    const totalVotes = clips.reduce((sum, clip) => sum + (clip.votes || 0), 0);
    if (totalVotes === 0) {
      // Falls keine Stimmen vorhanden: alle Prozentwerte 0
      const flatResults = clips.map(clip => ({
        id: clip.id,
        title: clip.title,
        votes: clip.votes || 0,
        percent: 0,
        videoUrl: clip.videoUrl,
        submitter: clip.submitter,
      }));
      setResults(flatResults);
      return;
    }

    // Ergebnisse mit Prozenten anreichern
    const computed = clips.map(clip => {
      const votes = clip.votes || 0;
      const percent = Math.round((votes / totalVotes) * 100);
      return {
        id: clip.id,
        title: clip.title,
        votes,
        percent,
        videoUrl: clip.videoUrl,
        submitter: clip.submitter,
      };
    });

    // Sortieren nach Stimmen (absteigend)
    const sorted = computed.sort((a, b) => b.votes - a.votes);
    setResults(sorted);
  }, [timeLeft, clips]);

  const handleSelect = id => {
    if (timeLeft === 'Closed') return;
    setSelectedClip(prev => (prev === id ? null : id));
  };

  // Falls die Zeit abgelaufen ist und Ergebnisse vorhanden sind
  const hasEnded = timeLeft === 'Closed' && results;

  return (
    <>
      {!hasEnded ? (
        <section className="bg-gray-900 rounded-2xl p-8 space-y-6 shadow-lg">
          {/* Header mit Info-Icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
              <button
                onClick={() => setIsInfoOpen(true)}
                className="p-1 rounded-full hover:bg-gray-800 transition-colors"
              >
                <Info className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
            {/* Timer mit gelbem Rahmen */}
            <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-yellow-400 border border-yellow-400">
              {timeLeft}
            </span>
          </div>

          {/* Clips Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {clips.map(clip => {
              const isSelected = selectedClip === clip.id;
              return (
                <div key={clip.id} className="flex flex-col items-center space-y-2">
                  {/* Card */}
                  <div
                    className={`
                      relative w-full bg-gray-800 rounded-2xl overflow-hidden border-2 transition-colors
                      ${isSelected ? 'border-yellow-400' : 'border-transparent'}
                      hover:border-yellow-400
                      ${selectedClip && !isSelected ? 'filter grayscale contrast-75' : ''}
                    `}
                  >
                    {/* Video-Vorschau */}
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
                    {/* Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-black/40 backdrop-blur-md">
                      <h3 className="text-white font-bold truncate">{clip.title}</h3>
                      <p className="text-gray-300 text-sm">by {clip.submitter || 'Unknown'}</p>
                    </div>
                  </div>

                  {/* Select-Button unter der Karte */}
                  <button
                    onClick={() => handleSelect(clip.id)}
                    className={`
                      w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-600 text-white text-sm font-semibold transition-colors
                      ${isSelected ? 'border-yellow-400 text-yellow-400' : 'hover:border-yellow-400'}
                    `}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-4 md:space-y-0">
            <button
              onClick={() => setIsInfoOpen(true)}
              className="text-yellow-400 text-sm underline hover:text-yellow-500 transition-colors"
            >
              Submit Your Clip
            </button>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Bet coins on your favorite clip and win coins equal to your profit!
            </p>
          </div>

          {/* Auswahl-Feedback */}
          {selectedClip && (
            <p className="text-center text-yellow-400 font-medium">
              You selected: <strong>{clips.find(c => c.id === selectedClip)?.title}</strong>
            </p>
          )}
        </section>
      ) : (
        // Ergebnisse anzeigen, sobald die Zeit abgelaufen ist
        <section className="bg-gray-900 rounded-2xl p-8 space-y-6 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
            Ergebnisse von "{title}"
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Linke Spalte: Gewinner */}
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-xl font-semibold text-yellow-400">Gewinner</h3>
              <div className="relative w-full max-w-sm bg-gray-800 rounded-2xl overflow-hidden border-4 border-yellow-400">
                {/* Winner-Video-Vorschau */}
                <div className="relative w-full pb-[56.25%] bg-black">
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
                {/* Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-black/40 backdrop-blur-md">
                  <h4 className="text-white font-bold truncate">{results[0].title}</h4>
                  <p className="text-gray-300 text-sm">by {results[0].submitter || 'Unknown'}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-yellow-400 font-semibold text-lg">
                  {results[0].title}
                </p>
                <p className="text-gray-300 text-sm">
                  Stimmen: {results[0].votes} ({results[0].percent}%)
                </p>
              </div>
            </div>

            {/* Rechte Spalte: Diagramm für die anderen */}
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-xl font-semibold text-white">Restliche Stimmen</h3>
              <div className="w-full h-64 bg-gray-800 p-4 rounded-2xl">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={results.slice(1).map(item => ({
                      name: item.title.length > 10
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
                    <Bar
                      dataKey="percent"
                      fill="#FACC15" /* gelb */
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Info-Modal mit gelbem Glow */}
      {isInfoOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && setIsInfoOpen(false)}
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
              Each round features top POV clips. Select your favorite clip below.
            </p>
            <p className="text-gray-300 mb-2">
              The clip with the most selections when time runs out wins the title.
            </p>
            <p className="text-gray-300">
              Use "Submit Your Clip" to enter your clips in upcoming rounds.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
