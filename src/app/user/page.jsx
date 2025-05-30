// src/app/user/page.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/POVlib/Navbar';
import Footer from '../../components/POVlib/Footer';
import ComparePlansModal from '../../components/POVlib/ComparePlansModal';
import CreateDemoModal from '../../components/POVlib/CreateDemoModal';
// Named import für CategorySection:
import { CategorySection } from '../../components/containers/CategorySection';
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

  // Create-demo form state
  const [matchLink, setMatchLink] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Modal state
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCreateDemoOpen, setIsCreateDemoOpen] = useState(false);

  // Utility Book dummy data
  const dummyUtils = useMemo(() => ([
    { id: 'u1', thumbnail: '/images/util1.png', map: 'Mirage', side: 'CT', player: 'Player1', landing: 'A Site', type: 'Smoke', group: null },
    { id: 'u2', thumbnail: '/images/util2.png', map: 'Inferno', side: 'T', player: 'Player2', landing: 'Banana', type: 'Molotov', group: null },
    { id: 'u3', thumbnail: '/images/util3.png', map: 'Mirage', side: 'CT', player: 'Player3', landing: 'Connector', type: 'Flash', group: null },
    { id: 'u4', thumbnail: '/images/util4.png', map: 'Inferno', side: 'T', player: 'Player4', landing: 'B Site', type: 'Execute', group: 'B Execute' },
  ]), []);
  const [utils, setUtils] = useState(dummyUtils);
  const [utilGroup, setUtilGroup] = useState('All');
  const [utilSide, setUtilSide] = useState('All');
  const [utilSearch, setUtilSearch] = useState('');

  // Simuliere User-Fetch
  useEffect(() => {
    setTimeout(() => {
      setUser({ name: 'Jane Doe', joinDate: '2024-01-15', credits: 5, isPro: false });
      setLoading(false);
    }, 500);
  }, []);

  // Lade Demos und setze History & Favorites per zufälligem Tag
  useEffect(() => {
    if (!loading && user) {
      (async () => {
        const demos = await getFilteredDemos({}, 'all');
        const mapped = demos.map(mapDemo);
        setAllDemos(mapped);

        const tags = [...new Set(mapped.flatMap(d => d.tags))];
        if (tags.length) {
          const tag1 = tags[Math.floor(Math.random() * tags.length)];
          setHistoryDemos(mapped.filter(d => d.tags.includes(tag1)));
          const tag2 = tags[Math.floor(Math.random() * tags.length)];
          setFavDemos(mapped.filter(d => d.tags.includes(tag2)));
        } else {
          setHistoryDemos(mapped);
          setFavDemos(mapped);
        }
      })();
    }
  }, [loading, user]);

  const handleSelectDemo = demo => router.push(`/demos/${demo.id}`);
  const handleUpgradeToPro = () => alert('Start Pro upgrade flow');
  const handleMatchLinkSubmit = e => {
    e.preventDefault();
    if (!matchLink) return;
    setMatchLink('');
    setIsCreateDemoOpen(false);
  };
  const handleFileChange = e => {
    setUploadError('');
    const f = e.target.files[0];
    if (f?.name.endsWith('.dem')) setSelectedFile(f);
    else {
      setUploadError('Please upload a valid .dem file.');
      setSelectedFile(null);
    }
  };
  const handleUploadSubmit = e => {
    e.preventDefault();
    if (!selectedFile) return;
    setSelectedFile(null);
    setIsCreateDemoOpen(false);
  };
  const handleLinkAccount = () => alert('Start Faceit linking flow');

  const displayedUtils = utils
    .filter(u => utilGroup === 'All' || u.type === utilGroup)
    .filter(u => utilSide === 'All' || u.side === utilSide)
    .filter(u => utilSearch === '' || u.player.toLowerCase().includes(utilSearch.toLowerCase()) || u.landing.toLowerCase().includes(utilSearch.toLowerCase()));

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
      <Footer />
    </>;
  }

  return <>
    <Navbar />
    <main className="pt-24 pb-12 bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 md:px-8 space-y-12">

        {/* Profile Header */}
        <section className="bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold text-yellow-400">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-400">Member since {user.joinDate}</p>
          </div>
          <div className="space-y-1 text-center">
            <div className="text-sm uppercase text-gray-400">Credits</div>
            <div className="text-2xl font-bold text-yellow-400">{user.credits}</div>
          </div>
        </section>

        {/* History */}
        <CategorySection title="History" demos={historyDemos} onSelectDemo={handleSelectDemo} />

        {/* Favorites */}
        <CategorySection title="Favorites" demos={favDemos} onSelectDemo={handleSelectDemo} />

        {/* Utility Book */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Utility Book</h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by player or landing"
              value={utilSearch}
              onChange={e => setUtilSearch(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-800 rounded-lg focus:outline-none"
            />
            <select
              value={utilSide}
              onChange={e => setUtilSide(e.target.value)}
              className="px-4 py-2 bg-gray-800 rounded-lg focus:outline-none"
            >
              {['All','CT','T'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Group Tabs */}
          <div className="flex gap-2 mb-6">
            {['All','Smoke','Molotov','Flash','Execute'].map(g => (
              <button
                key={g}
                onClick={() => setUtilGroup(g)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  utilGroup === g ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Utils Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedUtils.map(util => (
              <div key={util.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <img src={util.thumbnail} alt={util.type} className="w-full h-32 object-cover" />
                <div className="p-4 space-y-1">
                  <h3 className="font-bold">{util.type}{util.group ? ` (${util.group})` : ''}</h3>
                  <p className="text-gray-400 text-sm">{util.map} · {util.side}</p>
                  <p className="text-gray-300 text-sm">Landing: {util.landing}</p>
                  <p className="text-gray-300 text-sm">By: {util.player}</p>
                  <button className="mt-2 px-3 py-1 bg-yellow-400 text-gray-900 rounded-lg text-sm">Share</button>
                </div>
              </div>
            ))}
          </div>
        </section>

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

    <Footer />
  </>
};

export default UserPage;
