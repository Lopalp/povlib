// src/app/user/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/POVlib/Navbar';
import Footer from '../../components/POVlib/Footer';
import ComparePlansModal from '../../components/POVlib/ComparePlansModal';
import CreateDemoModal from '../../components/POVlib/CreateDemoModal';
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
  const [randomTag, setRandomTag] = useState('');
  const [historyDemos, setHistoryDemos] = useState([]);

  // Create-demo form state
  const [matchLink, setMatchLink] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Modal state
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCreateDemoOpen, setIsCreateDemoOpen] = useState(false);

  // simulate fetching user
  useEffect(() => {
    setTimeout(() => {
      setUser({
        name: 'Jane Doe',
        joinDate: '2024-01-15',
        credits: 5,
        isPro: false
      });
      setLoading(false);
    }, 500);
  }, []);

  // once user is loaded, fetch all demos and pick a random tag
  useEffect(() => {
    if (!loading && user) {
      (async () => {
        try {
          const demos = await getFilteredDemos({}, 'all');
          const mapped = demos.map(mapDemo);
          setAllDemos(mapped);

          // collect all tags
          const tags = mapped.flatMap(d => d.tags);
          const uniqueTags = [...new Set(tags)];
          if (uniqueTags.length > 0) {
            const tag = uniqueTags[Math.floor(Math.random() * uniqueTags.length)];
            setRandomTag(tag);
            setHistoryDemos(mapped.filter(d => d.tags.includes(tag)));
          } else {
            // fallback: show all demos
            setRandomTag('');
            setHistoryDemos(mapped);
          }
        } catch (err) {
          console.error('Error loading demos for history:', err);
          setHistoryDemos([]);
        }
      })();
    }
  }, [loading, user]);

  const handleSelectDemo = demo => {
    router.push(`/demos/${demo.id}`);
  };

  const handleUpgradeToPro = () => {
    alert('Start Pro upgrade flow');
  };

  const handleMatchLinkSubmit = e => {
    e.preventDefault();
    if (!matchLink) return;
    // TODO: consume 1 credit & generate demo from link
    setMatchLink('');
    setIsCreateDemoOpen(false);
  };

  const handleFileChange = e => {
    setUploadError('');
    const file = e.target.files[0];
    if (file?.name.endsWith('.dem')) {
      setSelectedFile(file);
    } else {
      setUploadError('Please upload a valid .dem file.');
      setSelectedFile(null);
    }
  };

  const handleUploadSubmit = e => {
    e.preventDefault();
    if (!selectedFile) return;
    // TODO: consume 1 credit & upload .dem
    setSelectedFile(null);
    setIsCreateDemoOpen(false);
  };

  const handleLinkAccount = () => {
    alert('Start Faceit linking flow');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-yellow-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="pt-24 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200">
          <p>
            You need to{' '}
            <a href="/signin" className="text-yellow-400 underline">
              log in
            </a>{' '}
            to view your profile.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
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

          {/* History Section with random tag filter */}
          <CategorySection
            title={`History${randomTag ? ` — #${randomTag}` : ''}`}
            demos={historyDemos}
            onSelectDemo={handleSelectDemo}
          />

          {/* Dashboard Sections */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Favorites</h3>
              <p className="text-gray-400">Your bookmarked demos for quick access.</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Utility Book</h3>
              <p className="text-gray-400">Reference smoke lineups and flash guides.</p>
            </div>
            <div /> {/* placeholder */}
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
  );
};

export default UserPage;
