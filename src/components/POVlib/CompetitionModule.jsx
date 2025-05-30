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
  const [votes, setVotes] = useState({});
  const [userVote, setUserVote] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  // Laden der Clips
  useEffect(() => {
    (async () => {
      const demos = await getFilteredDemos({}, 'all');
      const shuffled = demos.sort(() => 0.5 - Math.random()).slice(0, clipCount);
      setClips(shuffled);
      setVotes(Object.fromEntries(shuffled.map(d => [d.id, Math.floor(Math.random()*50)])));
    })();
  }, [clipCount]);

  // Countdown
  const endTime = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + durationDays);
    return d;
  }, [durationDays]);
  useEffect(() => {
    const tick = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) return setTimeLeft('Voting closed');
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m left`);
    };
    tick();
    const iv = setInterval(tick, 60000);
    return () => clearInterval(iv);
  }, [endTime]);

  const totalVotes = useMemo(
    () => Object.values(votes).reduce((a,b) => a + b, 0),
    [votes]
  );

  const handleVote = id => {
    if (userVote || timeLeft === 'Voting closed') return;
    setUserVote(id);
    setVotes(v => ({ ...v, [id]: v[id] + 1 }));
  };

  return (
    <section className="bg-gray-800 rounded-2xl p-8 space-y-6 shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <span className="px-3 py-1 bg-yellow-500 text-gray-900 font-medium rounded-full text-sm">
          {timeLeft}
        </span>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {clips.map(clip => {
          const voted = userVote === clip.id;
          const pct = totalVotes
            ? Math.round((votes[clip.id] / totalVotes) * 100)
            : 0;
          // Limit auf 3 Tags
          const tags = clip.tags.slice(0, 3);
          const extra = clip.tags.length - tags.length;

          return (
            <div
              key={clip.id}
              className="relative bg-gray-700 rounded-2xl overflow-hidden border-2 border-transparent hover:border-yellow-400 transition-colors"
            >
              {/* Video */}
              <div className="relative w-full pb-[133%] bg-black">
                <video
                  src={clip.videoUrl || clip.video_id}
                  poster={clip.thumbnail}
                  muted loop playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Overlay mit Glassmorph */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-black/40 backdrop-blur-md space-y-2">
                <h3 className="text-white font-bold truncate">{clip.title}</h3>
                <p className="text-gray-300 text-sm">by {clip.submitter || 'Unknown'}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {tags.map(t => (
                    <span key={t} className="text-xs bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full">
                      #{t}
                    </span>
                  ))}
                  {extra > 0 && (
                    <span className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full">
                      +{extra}
                    </span>
                  )}
                </div>

                {/* Vote / Fortschrittsleiste */}
                <div className="mt-3">
                  {!userVote ? (
                    <button
                      onClick={() => handleVote(clip.id)}
                      className="w-full py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-300 transition-colors"
                    >
                      Vote
                    </button>
                  ) : (
                    <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-4 md:space-y-0">
        <button className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
          Submit Your Clip for Next Voting
        </button>
        <p className="text-gray-400 text-sm text-center md:text-right">
          You can also <span className="font-semibold text-yellow-400">bet coins</span> on who will win and earn according to the odds!
        </p>
      </div>

      {userVote && (
        <p className="text-center text-green-400 font-medium">
          You voted for <strong>{clips.find(c => c.id === userVote)?.title}</strong>!
        </p>
      )}
    </section>
  );
}
