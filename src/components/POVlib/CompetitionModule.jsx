// components/POVlib/CompetitionModule.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PlayCircle, Info, X } from 'lucide-react';
import { getFilteredDemos } from '@/lib/supabase';

export default function CompetitionModule({
  title = 'Clip of the Week',
  durationDays = 7,
  clipCount = 4
}) {
  const [clips, setClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // load clips
  useEffect(() => {
    (async () => {
      const demos = await getFilteredDemos({}, 'all');
      const chosen = demos.sort(() => 0.5 - Math.random()).slice(0, clipCount);
      setClips(chosen);
    })();
  }, [clipCount]);

  // countdown
  const endTime = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + durationDays);
    return d;
  }, [durationDays]);

  useEffect(() => {
    const tick = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) return setTimeLeft('Closed');
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m left`);
    };
    tick();
    const iv = setInterval(tick, 60000);
    return () => clearInterval(iv);
  }, [endTime]);

  const handleSelect = id => {
    if (timeLeft === 'Closed') return;
    setSelectedClip(prev => (prev === id ? null : id));
  };

  return (
    <>
      <section className="bg-gray-900 rounded-2xl p-8 space-y-6 shadow-lg">
        {/* Header with Info icon */}
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
          <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
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
                  {/* Video Preview */}
                  <div className="relative w-full pb-[133%] bg-black">
                    <video
                      src={clip.videoUrl || clip.video_id}
                      poster={"/img/1.png"}
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

                {/* Select Button under card */}
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

        {/* Summary */}
        {selectedClip && (
          <p className="text-center text-yellow-400 font-medium">
            You selected: <strong>{clips.find(c => c.id === selectedClip)?.title}</strong>
          </p>
        )}
      </section>

      {/* Info Modal with glow */}
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
