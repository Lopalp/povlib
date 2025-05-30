// src/app/user/page.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/POVlib/Navbar';
import Footer from '../../components/POVlib/Footer';
import ComparePlansModal from '../../components/POVlib/ComparePlansModal';
import CreateDemoModal from '../../components/POVlib/CreateDemoModal';
import { CategorySection } from '../../components/containers/CategorySection';
import UtilityBook from '../../components/POVlib/UtilityBook';
import { getFilteredDemos } from '@/lib/supabase';

const mapDemo = demo => ({
  id: demo.id,
  title: demo.title,
  thumbnail: demo.thumbnail,
  videoId: demo.video_id,
  tags: demo.tags || [],
  views: demo.views || 0,
  likes: demo.likes || 0,
});

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allDemos, setAllDemos] = useState([]);
  const [historyDemos, setHistoryDemos] = useState([]);
  const [favDemos, setFavDemos] = useState([]);

  const [matchLink, setMatchLink] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCreateDemoOpen, setIsCreateDemoOpen] = useState(false);

  // Simulate loading user
  useEffect(() => {
    setTimeout(() => {
      setUser({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        joinDate: '2024-01-15',
        credits: 5,
        plan: 'Standard',
        nextBilling: '2025-06-01'
      });
      setLoading(false);
    }, 500);
  }, []);

  // Load demos and pick random tags
  useEffect(() => {
    if (!loading && user) {
      (async () => {
        const demos = await getFilteredDemos({}, 'all');
        const mapped = demos.map(mapDemo);
        setAllDemos(mapped);

        const tags = Array.from(new Set(mapped.flatMap(d => d.tags)));
        if (tags.length) {
          const t1 = tags[Math.floor(Math.random() * tags.length)];
          setHistoryDemos(mapped.filter(d => d.tags.includes(t1)));
          const t2 = tags[Math.floor(Math.random() * tags.length)];
          setFavDemos(mapped.filter(d => d.tags.includes(t2)));
        } else {
          setHistoryDemos(mapped);
          setFavDemos(mapped);
        }
      })();
    }
  }, [loading, user]);

  // Stats
  const totalDemos = allDemos.length;
  const totalViews = useMemo(() => allDemos.reduce((sum, d) => sum + d.views, 0), [allDemos]);
  const totalLikes = useMemo(() => allDemos.reduce((sum, d) => sum + d.likes, 0), [allDemos]);
  const avgLikes   = totalDemos ? (totalLikes / totalDemos).toFixed(1) : 0;
  const uniqueTags = useMemo(() => new Set(allDemos.flatMap(d => d.tags)).size, [allDemos]);

  const handleSelectDemo   = demo => router.push(`/demos/${demo.id}`);
  const handleUpgradeToPro = ()   => setIsCompareOpen(true);
  const handleMatchSubmit  = e      => { e.preventDefault(); if (!matchLink) return; setMatchLink(''); setIsCreateDemoOpen(false); };
  const handleFileChange   = e      => { const f = e.target.files[0]; if (f?.name.endsWith('.dem')) setSelectedFile(f); else setUploadError('Please upload a valid .dem file.'); };
  const handleUploadSubmit = e      => { e.preventDefault(); if (!selectedFile) return; setSelectedFile(null); setIsCreateDemoOpen(false); };
  const handleLinkAccount  = ()     => alert('Start Faceit linking flow');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-yellow-400 rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) {
    return <>
      <Navbar />
      <div className="pt-24 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200">
        <p>You need to <a href="/signin" className="text-yellow-400 underline">log in</a> to view your profile.</p>
      </div>
      <Footer/>
    </>;
  }

  return <>
    <Navbar />

    <main className="pt-24 pb-16 bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 md:px-8 space-y-16">

        {/* PROFILE & STATS */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          {/* Avatar + Info */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-28 h-28 rounded-full bg-gray-600 flex items-center justify-center text-5xl font-bold text-yellow-400">
              {user.name.charAt(0)}
            </div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
            <p className="text-gray-400">Since {user.joinDate}</p>
          </div>

          {/* Key Stats */}
          <div className="col-span-2 grid grid-cols-2 gap-6 text-center">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Demos</div>
              <div className="text-2xl font-bold text-yellow-400">{totalDemos}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Views</div>
              <div className="text-2xl font-bold text-yellow-400">{totalViews.toLocaleString()}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Likes</div>
              <div className="text-2xl font-bold text-yellow-400">{totalLikes}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Avg. Likes</div>
              <div className="text-2xl font-bold text-yellow-400">{avgLikes}</div>
            </div>
          </div>

          {/* Plan & Actions */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="text-gray-400 uppercase text-sm">Plan: <span className="font-bold text-white">{user.plan}</span></div>
            <div className="text-gray-400 text-sm">Next billing: <span className="font-bold text-white">{user.nextBilling}</span></div>
            {user.plan !== 'Pro' && (
              <button
                onClick={handleUpgradeToPro}
                className="mt-2 px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => setIsCreateDemoOpen(true)}
            className="w-full bg-yellow-400 text-gray-900 font-bold py-4 rounded-lg hover:bg-yellow-300 transition"
          >
            + Create New Demo
          </button>
          <button
            onClick={() => setIsCompareOpen(true)}
            className="w-full bg-gray-700 text-white font-bold py-4 rounded-lg hover:bg-gray-600 transition"
          >
            Compare Plans & Benefits
          </button>
        </section>

        {/* CONTENT SECTIONS */}
        <CategorySection title="History"   demos={historyDemos} onSelectDemo={handleSelectDemo} />
        <CategorySection title="Favorites" demos={favDemos}    onSelectDemo={handleSelectDemo} />
        <UtilityBook />
      </div>
    </main>

    {/* MODALS */}
    <ComparePlansModal
      isOpen={isCompareOpen}
      onClose={() => setIsCompareOpen(false)}
      onUpgradeToPro={handleUpgradeToPro}
      currentPlan={user.plan.toLowerCase()}
    />
    <CreateDemoModal
      isOpen={isCreateDemoOpen}
      onClose={() => setIsCreateDemoOpen(false)}
      matchLink={matchLink}
      onMatchLinkChange={setMatchLink}
      onMatchLinkSubmit={handleMatchSubmit}
      selectedFile={selectedFile}
      onFileChange={handleFileChange}
      onFileSubmit={handleUploadSubmit}
      uploadError={uploadError}
      onLinkAccount={handleLinkAccount}
    />

    <Footer />
  </>;
}
