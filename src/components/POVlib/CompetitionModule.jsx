// components/POVlib/CompetitionModule.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PlayCircle } from 'lucide-react';

const dummyClips = [
  { id: 'c1', title: 'Epic AWP Flick', thumbnail: '/images/clip1.png', tags: ['AWP','One-Tap'], submitter: 'User123' },
  { id: 'c2', title: 'Insane Ninja Defuse', thumbnail: '/images/clip2.png', tags: ['Ninja','Clutch'], submitter: 'ProPlayer' },
  { id: 'c3', title: '4K Spraydown', thumbnail: '/images/clip3.png', tags: ['Spray','Rifle'], submitter: 'User456' },
  { id: 'c4', title: 'Perfect Flash Pop', thumbnail: '/images/clip4.png', tags: ['Flash','Utility'], submitter: 'ProPlayer2' },
];

export default function CompetitionModule({
  title = 'Clip of the Week',
  durationDays = 7,
}) {
  const [votes, setVotes] = useState(() =>
    Object.fromEntries(dummyClips.map(c => [c.id, Math.floor(Math.random() * 50)]))
  );
  const [userVote, setUserVote] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  const endTime = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + durationDays);
    return d;
  }, [durationDays]);

  useEffect(() => {
    const update = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        setTimeLeft('Voting closed');
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${days}d ${hours}h ${mins}m left`);
    };
    update();
    const iv = setInterval(update, 60000);
    return () => clearInterval(iv);
  }, [endTime]);

  const totalVotes = useMemo(() =>
    Object.values(votes).reduce((sum, v) => sum + v, 0), [votes]
  );

  const handleVote = id => {
    if (userVote || timeLeft === 'Voting closed') return;
    setUserVote(id);
    setVotes(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  return (
    <section className="bg-gray-800 rounded-2xl p-8 space-y-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="text-sm text-gray-400">{timeLeft}</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dummyClips.map(clip => {
          const voted = userVote === clip.id;
          const percent = totalVotes > 0
            ? Math.round((votes[clip.id] / totalVotes) * 100)
            : 0;

          return (
            <div key={clip.id} className="relative bg-gray-700 rounded-xl overflow-hidden">
              {/* fill overlay */}
              {userVote && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-green-500 opacity-50 transition-height duration-500"
                  style={{ height: `${percent}%` }}
                />
              )}

              {/* thumbnail */}
              <div className="relative w-full pb-[56.25%] overflow-hidden">
                <img
                  src={clip.thumbnail}
                  alt={clip.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* content */}
              <div className="p-4 flex flex-col h-48 justify-between relative">
                <div>
                  <h3 className="text-lg font-semibold text-white truncate">{clip.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">by {clip.submitter}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {clip.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-yellow-400 text-gray-900 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  {!userVote ? (
                    <button
                      onClick={() => handleVote(clip.id)}
                      className="px-3 py-1 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition"
                    >
                      Vote
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-lg bg-green-500 text-white text-sm">
                      {percent}% 
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {userVote && (
        <p className="text-center text-green-400 font-medium">
          You voted for <strong>{dummyClips.find(c => c.id === userVote).title}</strong>!
        </p>
      )}
    </section>
  );
}
