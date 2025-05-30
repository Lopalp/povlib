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
  map: demo.map,
  positions: demo.positions || [],
  tags: demo.tags || [],
  players: demo.players || [],
  team: demo.team,
  year: demo.year,
  event: demo.event,
  result: demo.result,
  views: demo.views || 0,
  likes: demo.likes || 0,
  isPro: demo.is_pro
});

const UserPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allDemos, setAllDemos] = useState([]);
  const [historyDemos, setHistoryDemos] = useState([]);
  const [favDemos, setFavDemos] = useState([]);

  const [matchLink, setMatchLink]     = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [isCompareOpen, setIsCompareOpen]     = useState(false);
  const [isCreateDemoOpen, setIsCreateDemoOpen] = useState(false);

  useEffect(() => {
    // simulate user fetch
    setTimeout(() => {
      setUser({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        joinDate: '2024-01-15',
        lastLogin: '2025-05-28',
        credits: 5,
        isPro: false
      });
      setLoading(false);
    }, 500);
  }, []);

  // fetch demos once user loaded
  useEffect(() => {
    if (!loading && user) {
      (async () => {
        const demos = await getFilteredDemos({}, 'all');
        const mapped = demos.map(mapDemo);
        setAllDemos(mapped);

        // pick random tags for history/fav
        const tags = [...new Set(mapped.flatMap(d => d.tags))];
        if (tags.length) {
          setHistoryDemos(mapped.filter(d => d.tags.includes(tags[0])));
          setFavDemos(mapped.filter(d => d.tags.includes(tags[1] || tags[0])));
        } else {
          setHistoryDemos(mapped);
          setFavDemos(mapped);
        }
      })();
    }
  }, [loading, user]);

  const handleSelectDemo = demo => router.push(`/demos/${demo.id}`);
  const handleUpgradeToPro = () => alert('Start Pro upgrade flow');
  const handleMatchLinkSubmit = e => { e.preventDefault(); if (!matchLink) return; setMatchLink(''); setIsCreateDemoOpen(false); };
  const handleFileChange = e => { const f = e.target.files[0]; if (f?.name.endsWith('.dem')) setSelectedFile(f); else setUploadError('Please upload a valid .dem file.'); };
  const handleUploadSubmit = e => { e.preventDefault(); if (!selectedFile) return; setSelectedFile(null); setIsCreateDemoOpen(false); };
  const handleLinkAccount = () => alert('Start Faceit linking flow');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-16 h-16 border-4 border-gray-700 border-t-yellow-400 rounded-full animate-spin" />
    </div>
  );
  if (!user) return <>
    <Navbar/>
    <div className="pt-24 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200">
      <p>You need to <a href="/signin" className="text-yellow-400 underline">log in</a> to view your profile.</p>
    </div>
    <Footer/>
  </>;

  return <>
    <Navbar/>

    {/* Profile & Stats Header */}
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 py-12">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-5xl font-bold text-yellow-400">
            {user.name.charAt(0)}
          </div>
          {user.isPro && (
            <span className="absolute -bottom-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
              PRO
            </span>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <p className="text-gray-400">{user.email}</p>
          <div className="flex flex-wrap gap-4 text-gray-400">
            <div>Joined: {user.joinDate}</div>
            <div>Last login: {user.lastLogin}</div>
            <div>Total demos: {allDemos.length}</div>
            <div>Favorites: {favDemos.length}</div>
          </div>
        </div>

        {/* Stats & CTA */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-400">Credits</div>
            <div className="text-3xl font-bold text-yellow-400">{user.credits}</div>
          </div>
          {!user.isPro && (
            <button
              onClick={handleUpgradeToPro}
              className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    </header>

    <main className="bg-gray-900 text-gray-200 py-12">
      <div className="container mx-auto px-4 md:px-8 space-y-12">
        {/* History */}
        <CategorySection title="History"   demos={historyDemos} onSelectDemo={handleSelectDemo} />
        {/* Favorites */}
        <CategorySection title="Favorites" demos={favDemos}    onSelectDemo={handleSelectDemo} />

        {/* Utility Book */}
        <UtilityBook/>

        {/* Action Buttons */}
        <section className="text-center space-x-4">
          <button
            onClick={() => setIsCreateDemoOpen(true)}
            className="mt-6 px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition"
          >
            Create New Demo
          </button>
          <button
            onClick={() => setIsCompareOpen(true)}
            className="mt-6 px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition"
          >
            Compare Plans
          </button>
        </section>
      </div>
    </main>

    {/* Modals */}
    <ComparePlansModal
      isOpen={isCompareOpen}
      onClose={() => setIsCompareOpen(false)}
      onUpgradeToPro={handleUpgradeToPro}
      currentPlan={user.isPro ? 'pro' : 'standard'}
    />
    <CreateDemoModal
      isOpen={isCreateDemoOpen}
      onClose={() => setIsCreateDemoOpen(false)}
      matchLink={matchLink}
      onMatchLinkChange={setMatchLink}
      onMatchLinkSubmit={handleMatchLinkSubmit}
      selectedFile={selectedFile}
      onFileChange={handleFileChange}
      onFileSubmit={handleUploadSubmit}
      uploadError={uploadError}
      onLinkAccount={handleLinkAccount}
    />

    <Footer/>
  </>
};

export default UserPage;
