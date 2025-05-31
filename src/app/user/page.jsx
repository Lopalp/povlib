// src/app/user/page.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';
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
  const [allDemos, setAllDemos] = useState([]);
  const [historyDemos, setHistoryDemos] = useState([]);
  const [favDemos, setFavDemos] = useState([]);
  const [trendingDemos, setTrendingDemos] = useState([]);
  const [latestDemos, setLatestDemos] = useState([]);
  const [ownDemos, setOwnDemos] = useState([]);

  // create-demo state
  const [matchLink, setMatchLink] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // modals
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCreateDemoOpen, setIsCreateDemoOpen] = useState(false);

  // tabs
  const tabs = ['Overview', 'Your Demos', 'History', 'Favorites', 'Utility', 'Settings'];
  const [activeTab, setActiveTab] = useState('Overview');

  // derived stats
  const totalDemos = allDemos.length;
  const totalViews = useMemo(() => allDemos.reduce((sum, d) => sum + d.views, 0), [allDemos]);
  const followerCount = 1234; // placeholder

  // simulate user fetch
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

  // fetch demos
  useEffect(() => {
    if (!loading && user) {
      (async () => {
        const demos = await getFilteredDemos({}, 'all');
        const mapped = demos.map(mapDemo);
        setAllDemos(mapped);
        setOwnDemos(mapped.filter(d => d.players.includes(user.name)));

        const tags = [...new Set(mapped.flatMap(d => d.tags))];
        if (tags.length) {
          setHistoryDemos(mapped.filter(d => d.tags.includes(tags[0])));
          setFavDemos(mapped.filter(d => d.tags.includes(tags[1] || tags[0])));
        } else {
          setHistoryDemos(mapped);
          setFavDemos(mapped);
        }

        setTrendingDemos([...mapped].sort((a,b)=>b.views-a.views).slice(0,6));
        setLatestDemos([...mapped].sort((a,b)=>b.year-b.year).slice(0,6));
      })();
    }
  }, [loading, user]);

  // handlers
  const goDemo = demo => router.push(`/demos/${demo.id}`);
  const handleUpgrade = () => setIsCompareOpen(true);
  const onMatchSubmit = e => { e.preventDefault(); if(!matchLink) return; setMatchLink(''); setIsCreateDemoOpen(false); };
  const onFileChange = e => {
    const f = e.target.files[0];
    if (f?.name.endsWith('.dem')) { setSelectedFile(f); setUploadError(''); }
    else { setUploadError('Please upload a valid .dem file.'); setSelectedFile(null); }
  };
  const onFileSubmit = e => { e.preventDefault(); if(!selectedFile) return; setSelectedFile(null); setIsCreateDemoOpen(false); };
  const linkFaceit = () => alert('Link Faceit account');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-16 h-16 border-4 border-gray-700 border-t-yellow-400 rounded-full animate-spin" />
    </div>
  );
  if (!user) return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200">
        <p>You need <a href="/signin" className="text-yellow-400 underline">log in</a> to view your profile.</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-12 bg-gray-900 text-gray-200">
        <div className="container mx-auto px-4 md:px-8 space-y-6">

          {/* Profile Banner */}
          <section className="bg-gray-800 rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-600 flex items-center justify-center text-4xl font-bold text-yellow-400">
                {user.name.charAt(0)}
              </div>
              <button
                onClick={() => setActiveTab('Settings')}
                className="absolute top-0 right-0 p-1 bg-gray-700 rounded-full hover:bg-gray-600"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-2 text-center md:text-left">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-400">{user.email}</p>
              <div className="flex justify-center md:justify-start space-x-4 text-sm text-gray-400">
                <span>Member since {user.joinDate}</span>
                <span>{followerCount.toLocaleString()} Followers</span>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => setIsCreateDemoOpen(true)}
                  className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition"
                >
                  Your Demo
                </button>
                <button
                  onClick={linkFaceit}
                  className="ml-3 px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                >
                  Link Faceit
                </button>
              </div>
            </div>

            {/* Stats & Plan */}
            <div className="flex flex-col items-center md:items-end space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-sm uppercase text-gray-400">Demos</div>
                  <div className="text-2xl font-bold text-yellow-400">{totalDemos}</div>
                </div>
                <div>
                  <div className="text-sm uppercase text-gray-400">Views</div>
                  <div className="text-2xl font-bold text-yellow-400">{totalViews.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="uppercase text-sm font-semibold">{user.plan}</span>
                {user.plan !== 'Pro' && (
                  <button
                    onClick={handleUpgrade}
                    className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-lg text-sm hover:bg-yellow-300"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Tab Navigation (Map style) */}
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar { display: none; }
            .custom-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
          `}</style>
          <div className="bg-gray-900 border-b border-gray-800 sticky top-16 z-30">
            <div className="container mx-auto px-4 md:px-8">
              <div className="flex overflow-x-auto custom-scrollbar">
                {tabs.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-4 py-4 text-sm font-bold whitespace-nowrap ${
                      activeTab === t
                        ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
 
          {/* Tab Content */}
          <div className="pt-6 space-y-8">
            {activeTab === 'Overview' && (
              <>
                <CategorySection title="Trending" demos={trendingDemos} onSelectDemo={goDemo} />
                <CategorySection title="Latest" demos={latestDemos} onSelectDemo={goDemo} />
              </>
            )}
            {activeTab === 'Your Demos' && (
              <CategorySection title="Your Demos" demos={ownDemos} onSelectDemo={goDemo} />
            )}
            {activeTab === 'History' && (
              <CategorySection title="History" demos={historyDemos} onSelectDemo={goDemo} />
            )}
            {activeTab === 'Favorites' && (
              <CategorySection title="Favorites" demos={favDemos} onSelectDemo={goDemo} />
            )}
            {activeTab === 'Utility' && <UtilityBook />}
            {activeTab === 'Settings' && (
              <section className="text-center text-gray-400">
                <h2 className="text-xl font-bold text-white mb-4">Settings</h2>
                <p>Here you will be able to adjust your profile and account settings.</p>
              </section>
            )}
          </div>
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

      <Footer />
    </>
  );
}
