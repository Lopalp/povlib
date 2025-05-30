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

  // load random demos
  useEffect(() => {
    (async () => {
      const demos = await getFilteredDemos({}, 'all');
      const shuffled = demos.sort(() => 0.5 - Math.random()).slice(0, clipCount);
      setClips(shuffled);
      setVotes(Object.fromEntries(shuffled.map(d => [d.id, Math.floor(Math.random()*50)])));
    })();
  }, [clipCount]);

  // countdown
  const endTime = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate()+durationDays);
    return d;
  }, [durationDays]);

  useEffect(() => {
    const tick = () => {
      const diff = endTime - Date.now();
      if (diff<=0) return setTimeLeft('Voting closed');
      const d = Math.floor(diff/86400000);
      const h = Math.floor((diff%86400000)/3600000);
      const m = Math.floor((diff%3600000)/60000);
      setTimeLeft(`${d}d ${h}h ${m}m left`);
    };
    tick();
    const iv = setInterval(tick,60000);
    return ()=>clearInterval(iv);
  },[endTime]);

  const totalVotes = useMemo(()=>Object.values(votes).reduce((a,b)=>a+b,0),[votes]);

  const handleVote = id => {
    if (userVote || timeLeft==='Voting closed') return;
    setUserVote(id);
    setVotes(v=>({...v,[id]:v[id]+1}));
  };

  return (
    <section className="bg-gray-800 rounded-2xl p-8 space-y-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <div className="text-lg font-semibold text-yellow-400">{timeLeft}</div>
      </div>

      {/* Clips Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {clips.map(clip => {
          const voted = userVote===clip.id;
          const pct = totalVotes ? Math.round((votes[clip.id]/totalVotes)*100) : 0;
          return (
            <div
              key={clip.id}
              className="relative group border-2 border-transparent rounded-2xl overflow-hidden hover:border-yellow-400 hover:shadow-xl transition-colors"
            >
              {/* Video */}
              <div className="relative w-full pb-[133%] bg-black">
                <video
                  src={clip.videoUrl || clip.video_id}
                  poster={clip.thumbnail}
                  muted loop playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Glass Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-black/40 backdrop-blur-md">
                <h3 className="text-white font-bold truncate">{clip.title}</h3>
                <p className="text-gray-300 text-sm mt-1">by {clip.submitter || 'Unknown'}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {clip.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fill Overlay */}
              {userVote && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-green-500 opacity-30 transition-all duration-500"
                  style={{ height: `${pct}%` }}
                />
              )}

              {/* Vote / Percentage */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                {!userVote ? (
                  <button
                    onClick={()=>handleVote(clip.id)}
                    className="px-4 py-1 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
                  >
                    Vote
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm">
                    {pct}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-4 md:space-y-0">
        <button
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Submit Your Clip for Next Voting
        </button>
        <p className="text-gray-400 text-sm text-center md:text-right">
          You can also <span className="font-semibold text-yellow-400">bet coins</span> on who will win and earn according to the odds!
        </p>
      </div>

      {userVote && (
        <p className="text-center text-green-400 font-medium mt-4">
          You voted for <strong>{clips.find(c=>c.id===userVote).title}</strong>!
        </p>
      )}
    </section>
  );
}
