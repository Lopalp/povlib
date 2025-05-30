// components/POVlib/CompetitionModule.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PlayCircle } from 'lucide-react';
import DemoCardVertical from './DemoCardVertical';

const dummyClips = [
  { 
    id: 'c1', 
    title: 'Epic AWP Flick', 
    thumbnail: '/images/clip1.png', 
    videoUrl: '/videos/clip1.mp4',
    tags: ['AWP','One-Tap'], 
    submitter: 'User123' 
  },
  { 
    id: 'c2', 
    title: 'Insane Ninja Defuse', 
    thumbnail: '/images/clip2.png', 
    videoUrl: '/videos/clip2.mp4',
    tags: ['Ninja','Clutch'], 
    submitter: 'ProPlayer' 
  },
  { 
    id: 'c3', 
    title: '4K Spraydown', 
    thumbnail: '/images/clip3.png', 
    videoUrl: '/videos/clip3.mp4',
    tags: ['Spray','Rifle'], 
    submitter: 'User456' 
  },
  { 
    id: 'c4', 
    title: 'Perfect Flash Pop', 
    thumbnail: '/images/clip4.png', 
    videoUrl: '/videos/clip4.mp4',
    tags: ['Flash','Utility'], 
    submitter: 'ProPlayer2' 
  },
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
            <div key={clip.id} className="relative">
              {/* Vertical Demo Card */}
              <DemoCardVertical demo={clip} onSelect={() => handleVote(clip.id)} />

              {/* Fill overlay after vote */}
              {userVote && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-green-500 opacity-50 transition-all duration-500"
                  style={{ height: `${percent}%` }}
                />
              )}

              {/* Vote button or percent badge */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                {!userVote ? (
                  <button
                    onClick={() => handleVote(clip.id)}
                    className="px-4 py-1 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition"
                  >
                    Vote
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm">
                    {percent}% 
                  </span>
                )}
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
