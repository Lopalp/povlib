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

export default function UserPage() {
  const router = useRouter();

  // user & loading
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // demo lists
  const [allDemos, setAllDemos]     = useState([]);
  const [historyDemos, setHistoryDemos] = useState([]);
  const [favDemos, setFavDemos]     = useState([]);

  // create-demo state
  const [matchLink, setMatchLink]     = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // modals
  const [isCompareOpen, setIsCompareOpen]   = useState(false);
  const [isCreateDemoOpen, setIsCreateDemoOpen] = useState(false);

  // UI state
  const tabs = ['Overview','History','Favorites','Utility'];
  const [activeTab, setActiveTab] = useState('Overview');

  // stats derived
  const totalDemos = allDemos.length;
  const totalViews = useMemo(() => allDemos.reduce((s,d)=>s+d.views,0), [allDemos]);

  // simulate fetching user
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

  // fetch demos and populate history/favorites
  useEffect(() => {
    if (!loading && user) {
      (async () => {
        const demos = await getFilteredDemos({}, 'all');
        const mapped = demos.map(mapDemo);
        setAllDemos(mapped);
        const tags = [...new Set(mapped.flatMap(d=>d.tags))];
        if (tags.length) {
          const t1 = tags[Math.floor(Math.random()*tags.length)];
          const t2 = tags[Math.floor(Math.random()*tags.length)];
          setHistoryDemos(mapped.filter(d=>d.tags.includes(t1)));
          setFavDemos(mapped.filter(d=>d.tags.includes(t2)));
        } else {
          setHistoryDemos(mapped);
          setFavDemos(mapped);
        }
      })();
    }
  }, [loading, user]);

  // handlers
  const goDemo = d => router.push(`/demos/${d.id}`);
  const handleUpgrade = () => setIsCompareOpen(true);
  const onMatchSubmit = e => { e.preventDefault(); if(!matchLink) return; setMatchLink(''); setIsCreateDemoOpen(false); };
  const onFileChange = e => {
    const f = e.target.files[0];
    if (f?.name.endsWith('.dem')) { setSelectedFile(f); setUploadError(''); }
    else { setUploadError('Please upload a valid .dem file.'); setSelectedFile(null); }
  };
  const onFileSubmit = e => { e.preventDefault(); if(!selectedFile) return; setSelectedFile(null); setIsCreateDemoOpen(false); };
  const linkFaceit = () => alert('Link Faceit flow');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-16 h-16 border-4 border-gray-700 border-t-yellow-400 rounded-full animate-spin" />
    </div>
  );
  if (!user) return <>
    <Navbar/>
    <div className="pt-24 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200">
      <p>You need <a href="/signin" className="text-yellow-400 underline">log in</a> to view your profile.</p>
    </div>
    <Footer/>
  </>;

  return <>
    <Navbar/>

    {/* pro-banner */}
    {user.plan !== 'Pro' && (
      <div className="bg-yellow-400 text-gray-900 text-center py-2">
        Upgrade to <strong>Pro</strong> for unlimited demos & premium features!{' '}
        <button onClick={handleUpgrade} className="underline font-semibold">Learn more</button>
      </div>
    )}

    <main className="pt-6 pb-12 bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 md:px-8 space-y-8">

        {/* Header */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-600 flex items-center justify-center text-4xl md:text-5xl font-bold text-yellow-400">
              {user.name.charAt(0)}
            </div>
          </div>
          <div className="flex-1 space-y-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
            <p className="text-gray-400">Member since {user.joinDate}</p>
            <p className="text-gray-400">Next billing: {user.nextBilling}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm uppercase text-gray-400">Demos</div>
              <div className="text-2xl font-bold text-yellow-400">{totalDemos}</div>
            </div>
            <div>
              <div className="text-sm uppercase text-gray-400">Views</div>
              <div className="text-2xl font-bold text-yellow-400">{totalViews.toLocaleString()}</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm uppercase text-gray-400">Plan</div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <span className="font-semibold">{user.plan}</span>
                {user.plan !== 'Pro' && (
                  <button onClick={handleUpgrade} className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-lg text-sm hover:bg-yellow-300">
                    Upgrade
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <nav className="flex space-x-4 border-b border-gray-700">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pb-2 font-medium ${
                activeTab === t ? 'border-b-2 border-yellow-400 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>

        {/* Content */}
        {activeTab === 'Overview' && (
          <section className="text-center py-12 space-y-4">
            <button
              onClick={() => setIsCreateDemoOpen(true)}
              className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition"
            >
              Create New Demo
            </button>
            <button
              onClick={linkFaceit}
              className="px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition"
            >
              Link Faceit Account
            </button>
          </section>
        )}

        {activeTab === 'History' && (
          <CategorySection title="History" demos={historyDemos} onSelectDemo={goDemo} />
        )}

        {activeTab === 'Favorites' && (
          <CategorySection title="Favorites" demos={favDemos} onSelectDemo={goDemo} />
        )}

        {activeTab === 'Utility' && (
          <UtilityBook />
        )}
        

      </div>
    </main>

    <ComparePlansModal
      isOpen={isCompareOpen}
      onClose={() => setIsCompareOpen(false)}
      onUpgradeToPro={handleUpgrade}
      currentPlan={user.plan === 'Pro' ? 'pro' : 'standard'}
    />

    <CreateDemoModal
      isOpen={isCreateDemoOpen}
      onClose={() => setIsCreateDemoOpen(false)}
      matchLink={matchLink}
      onMatchLinkChange={setMatchLink}
      onMatchLinkSubmit={onMatchSubmit}
      selectedFile={selectedFile}
      onFileChange={onFileChange}
      onFileSubmit={onFileSubmit}
      uploadError={uploadError}
      onLinkAccount={linkFaceit}
    />

    <Footer/>
  </>
}
