// components/POVlib/CompetitionModule.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PlayCircle } from 'lucide-react';
import { getFilteredDemos } from '@/lib/supabase';

export default function CompetitionModule({
  title = 'Clip of the Week',
  durationDays = 7,
  clipCount = 4
}) {
  const [clips, setClips] = useState([]);
  const [odds, setOdds] = useState({});
  const [selectedBet, setSelectedBet] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  // Load clips + random odds
  useEffect(() => {
    (async () => {
      const demos = await getFilteredDemos({}, 'all');
      const chosen = demos.sort(() => 0.5 - Math.random()).slice(0, clipCount);
      setClips(chosen);
      const o = {};
      chosen.forEach(d => { o[d.id] = 1 + Math.random() * 2; });
      setOdds(o);
    })();
  }, [clipCount]);

  // Countdown timer
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

  // Profit when winning
  const profit = id => {
    const amt = parseFloat(betAmount) || 0;
    return Math.floor(amt * (odds[id] - 1));
  };

  // Handle selection/bet
  const handleSelect = id => {
    if (timeLeft === 'Closed') return;
    setSelectedBet(prev => (prev === id ? null : id));
  };

  return (
    <section className="bg-gray-800 rounded-2xl p-8 space-y-6 shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <span className="px-3 py-1 bg-yellow-500 text-gray-900 font-medium rounded-full text-sm">
          {timeLeft}
        </span>
      </div>

      {/* Bet Input */}
      <div className="flex items-center gap-2">
        <label className="text-gray-300 font-medium">Bet coins:</label>
        <input
          type="number"
          min="0"
          value={betAmount}
          onChange={e => setBetAmount(e.target.value)}
          placeholder="0"
          className="w-24 px-3 py-1 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
        />
      </div>

      {/* Clips Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {clips.map(clip => {
          const isSelected = selectedBet === clip.id;
          return (
            <div
              key={clip.id}
              className={`
                relative bg-gray-700 rounded-2xl overflow-hidden border-2
                ${isSelected ? 'border-green-400' : 'border-transparent'}
                hover:border-yellow-400 transition-colors
              `}
            >
              {/* Video Preview with conditional grayscale */}
              <div className={`${selectedBet && !isSelected ? 'filter grayscale contrast-75' : ''} relative w-full pb-[133%] bg-black`}>
                <video
                  src={clip.videoUrl || clip.video_id}
                  poster={clip.thumbnail}
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Glassmorphic overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-black/40 backdrop-blur-md">
                <h3 className="text-white font-bold truncate">{clip.title}</h3>
                <p className="text-gray-300 text-sm">by {clip.submitter || 'Unknown'}</p>
              </div>

              {/* Button & profit */}
              <div className="absolute bottom-4 inset-x-4 flex justify-between items-center">
                {/* Profit badge */}
                {betAmount && isSelected && (
                  <span className="text-sm bg-green-500 text-white px-2 py-1 rounded-full">
                    +{profit(clip.id)}
                  </span>
                )}
                {/* Select/Bet button */}
                <button
                  onClick={() => handleSelect(clip.id)}
                  className={`
                    filter-none pointer-events-auto px-4 py-1 font-medium rounded-lg text-sm transition-colors
                    ${isSelected
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'}
                  `}
                >
                  {betAmount
                    ? (isSelected ? 'Bet placed' : 'Bet')
                    : (isSelected ? 'Selected'   : 'Select')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-4 md:space-y-0">
        <button className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
          Submit Your Clip
        </button>
        <p className="text-gray-400 text-sm text-center md:text-right">
          Bet coins on your favorite clip and win coins equal to your profit!
        </p>
      </div>

      {/* Summary */}
      {selectedBet && betAmount && (
        <p className="text-center text-green-400 font-medium mt-4">
          You bet <strong>{betAmount}</strong> coins on <strong>
            {clips.find(c => c.id === selectedBet)?.title}
          </strong> and can win <strong>+{profit(selectedBet)}</strong>!
        </p>
      )}
    </section>
  );
}
