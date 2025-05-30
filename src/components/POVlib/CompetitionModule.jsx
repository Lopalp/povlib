// components/POVlib/CompetitionModule.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PlayCircle } from 'lucide-react';

const dummyClips = [
  { id: 'c1', title: 'Epic AWP Flick', thumbnail: '/images/clip1.png', tags: ['AWP', 'One-Tap'] },
  { id: 'c2', title: 'Insane Ninja Defuse', thumbnail: '/images/clip2.png', tags: ['Ninja', 'Clutch'] },
  { id: 'c3', title: '4K Spraydown', thumbnail: '/images/clip3.png', tags: ['Spray', 'Rifle'] },
  { id: 'c4', title: 'Perfect Flash Pop', thumbnail: '/images/clip4.png', tags: ['Flash', 'Utility'] },
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
      const diff = endTime - new Date();
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

  const handleVote = id => {
    if (userVote || timeLeft === 'Voting closed') return;
    setUserVote(id);
    setVotes(v => ({ ...v, [id]: v[id] + 1 }));
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
          return (
            <div
              key={clip.id}
              className={`
                group bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl overflow-hidden 
                transform hover:scale-105 transition-transform duration-200 
                ${voted ? 'ring-4 ring-green-400' : 'ring-1 ring-transparent'}
              `}
            >
              <div className="relative w-full pb-[56.25%] overflow-hidden">
                <img
                  src={clip.thumbnail}
                  alt={clip.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="p-4 flex flex-col h-48 justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white truncate">{clip.title}</h3>
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
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => handleVote(clip.id)}
                    disabled={!!userVote}
                    className={`
                      px-3 py-1 rounded-lg text-sm font-semibold transition-colors
                      ${voted
                        ? 'bg-green-500 text-white cursor-default'
                        : userVote
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'}
                    `}
                  >
                    {voted ? 'Voted' : 'Vote'}
                  </button>
                  <span className="text-sm text-gray-300">{votes[clip.id]} votes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {userVote && (
        <p className="text-center text-green-400 font-medium">
          Thanks for voting! Check back when voting closes to see the winner.
        </p>
      )}
    </section>
  );
}
