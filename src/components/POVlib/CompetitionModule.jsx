// components/POVlib/CompetitionModule.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';

// Dummy clips with random tags
const dummyClips = [
  { id: 'c1', title: 'Epic AWP Flick', thumbnail: '/images/clip1.png', tags: ['AWP', 'One-Tap'] },
  { id: 'c2', title: 'Insane Ninja Defuse', thumbnail: '/images/clip2.png', tags: ['Defuse', 'Ninja'] },
  { id: 'c3', title: '4K Spraydown', thumbnail: '/images/clip3.png', tags: ['Rifle', 'Spray'] },
  { id: 'c4', title: 'Flashbang Pop', thumbnail: '/images/clip4.png', tags: ['Flash', 'Pop'] },
];

export default function CompetitionModule({
  title = 'Clip of the Week',
  durationDays = 7,
}) {
  const [voteCounts, setVoteCounts] = useState(() => {
    // initialize with random counts
    const counts = {};
    dummyClips.forEach(c => {
      counts[c.id] = Math.floor(Math.random() * 50);
    });
    return counts;
  });
  const [userVote, setUserVote] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  
  // compute end timestamp
  const endTime = useMemo(() => {
    const now = new Date();
    now.setDate(now.getDate() + durationDays);
    return now;
  }, [durationDays]);
  
  // countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const diff = endTime - new Date();
      if (diff <= 0) {
        setTimeLeft('Voting closed');
        return;
      }
      const days = Math.floor(diff / (1000*60*60*24));
      const hours = Math.floor((diff / (1000*60*60)) % 24);
      const mins = Math.floor((diff / (1000*60)) % 60);
      setTimeLeft(`${days}d ${hours}h ${mins}m left`);
    };
    updateTimer();
    const iv = setInterval(updateTimer, 60*1000);
    return () => clearInterval(iv);
  }, [endTime]);
  
  const handleVote = clipId => {
    if (userVote || timeLeft === 'Voting closed') return;
    setUserVote(clipId);
    setVoteCounts(counts => ({
      ...counts,
      [clipId]: counts[clipId] + 1,
    }));
  };
  
  return (
    <section className="bg-gray-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="text-sm text-gray-400">{timeLeft}</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dummyClips.map(clip => (
          <div key={clip.id} className="bg-gray-700 rounded-lg overflow-hidden flex flex-col">
            <img
              src={clip.thumbnail}
              alt={clip.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{clip.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {clip.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-yellow-400 text-gray-900 px-2 py-1 rounded-full"
                    >#{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => handleVote(clip.id)}
                  disabled={!!userVote}
                  className={`
                    px-3 py-1 rounded-lg text-sm font-bold 
                    ${userVote === clip.id
                      ? 'bg-green-500 text-white cursor-default'
                      : userVote
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                    }
                  `}
                >
                  {userVote === clip.id ? 'Voted' : 'Vote'}
                </button>
                <span className="text-sm text-gray-300">{voteCounts[clip.id]} votes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {userVote && (
        <p className="text-center text-green-400">
          Thanks for voting! Come back when voting closes to see the winner.
        </p>
      )}
    </section>
  );
}
