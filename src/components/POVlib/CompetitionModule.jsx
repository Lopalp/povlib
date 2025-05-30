// components/POVlib/CompetitionModule.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getFilteredDemos } from '@/lib/supabase';
import DemoCardVertical from './DemoCardVertical';

export default function CompetitionModule({
  title = 'Clip of the Week',
  durationDays = 7,
  clipCount = 4
}) {
  const [clips, setClips] = useState([]);
  const [votes, setVotes] = useState({});
  const [userVote, setUserVote] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  // load random demos from the DB
  useEffect(() => {
    (async () => {
      const demos = await getFilteredDemos({}, 'all');
      // pick `clipCount` random demos
      const shuffled = demos.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, clipCount);
      setClips(selected);
      // init random vote counts
      const initial = Object.fromEntries(
        selected.map(d => [d.id, Math.floor(Math.random() * 50)])
      );
      setVotes(initial);
    })();
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="text-sm text-gray-400">{timeLeft}</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {clips.map(demo => {
          const voted = userVote === demo.id;
          const percent = totalVotes
            ? Math.round((votes[demo.id] / totalVotes) * 100)
            : 0;

          return (
            <div key={demo.id} className="relative">
              {/* Vertical card shows video */}
              <DemoCardVertical demo={{
                ...demo,
                videoUrl: demo.videoUrl || demo.video_id // assume either field
              }} onSelect={() => handleVote(demo.id)} />

              {/* Vote-fill overlay */}
              {userVote && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-green-500 opacity-50 transition-all duration-500"
                  style={{ height: `${percent}%` }}
                />
              )}

              {/* Vote button / percentage */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                {!userVote ? (
                  <button
                    onClick={() => handleVote(demo.id)}
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
          You voted for <strong>{clips.find(c => c.id === userVote)?.title}</strong>!
        </p>
      )}
    </section>
  );
}
