// components/POVlib/CompetitionModule.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';

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
  clipCount = 4
}) {
  const [clips, setClips] = useState([]);
  const [votes, setVotes] = useState({});
  const [userVote, setUserVote] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  // load random clips
  useEffect(() => {
    const selected = dummyClips.sort(() => 0.5 - Math.random()).slice(0, clipCount);
    setClips(selected);
    setVotes(Object.fromEntries(selected.map(c => [c.id, Math.floor(Math.random() * 50)])));
  }, [clipCount]);

  // compute end time and countdown
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

  const totalVotes = useMemo(
    () => Object.values(votes).reduce((sum, v) => sum + v, 0),
    [votes]
  );

  const handleVote = id => {
    if (userVote || timeLeft === 'Voting closed') return;
    setUserVote(id);
    setVotes(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  return (
    <section className="bg-gray-800 rounded-2xl p-8 space-y-6 shadow-lg">
      {/* Prominent timer */}
      <div className="text-center">
        <span className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-full text-sm">
          {timeLeft}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-white text-center">{title}</h2>

      {/* Clips Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {clips.map(clip => {
          const voted = userVote === clip.id;
          const percent = totalVotes
            ? Math.round((votes[clip.id] / totalVotes) * 100)
            : 0;

          return (
            <div
              key={clip.id}
              className="relative group bg-gray-700 rounded-2xl overflow-hidden"
            >
              {/* Vote-fill overlay */}
              {userVote && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-green-500 opacity-50 transition-all duration-500"
                  style={{ height: `${percent}%` }}
                />
              )}

              {/* Video Preview */}
              <div className="relative w-full pb-[133%] bg-black">
                <video
                  src={clip.videoUrl}
                  poster={clip.thumbnail}
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Glass Overlay Text */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 bg-white/10 backdrop-blur-md pointer-events-none">
                <h3 className="text-white text-lg font-bold line-clamp-2">
                  {clip.title}
                </h3>
                <p className="text-gray-200 text-sm mt-1">by {clip.submitter}</p>
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

              {/* Vote button / percentage badge */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!userVote ? (
                  <button
                    onClick={() => handleVote(clip.id)}
                    className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition"
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

      {/* Footer actions */}
      <div className="pt-6 text-center space-y-4">
        <button
          onClick={() => {/* TODO: open submit flow */}}
          className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition"
        >
          Send in Your Clip
        </button>
        <p className="text-sm text-gray-400">
          You can also <strong>bet your coins</strong> on who wins and earn coins according to odds!
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
