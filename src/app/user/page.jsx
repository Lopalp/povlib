'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/POVlib/Navbar';
import Footer from '../../components/POVlib/Footer';
import DemoCard from '../../components/POVlib/DemoCard';
import ComparePlansModal from '../../components/POVlib/ComparePlansModal';
import CreateDemoModal from '../../components/POVlib/CreateDemoModal';

const UserPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // History demos (dummy data for now)
  const [historyDemos, setHistoryDemos] = useState([]);

  // Create demo form state
  const [matchLink, setMatchLink] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Modal state
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCreateDemoOpen, setIsCreateDemoOpen] = useState(false);

  // generate some placeholder demos
  const dummyHistory = Array.from({ length: 8 }, (_, i) => ({
    id: `hist-${i}`,
    title: `Demo ${i + 1}`,
    thumbnail: '/images/demo-placeholder.png',  // make sure this file exists
    videoId: '',
    map: 'Mirage',
    positions: [],
    tags: ['Random', 'Tag'],
    players: [],
    team: '',
    year: '2024',
    event: '',
    result: '',
    views: Math.floor(Math.random() * 1000),
    likes: Math.floor(Math.random() * 100),
    isPro: false,
  }));

  useEffect(() => {
    // simulate auth fetch
    setTimeout(() => {
      setUser({
        name: 'Jane Doe',
        joinDate: '2024-01-15',
        credits: 5,
        isPro: false,
      });
      setLoading(false);
    }, 800);
  }, []);

  // once loaded, set dummy history
  useEffect(() => {
    if (!loading && user) {
      setHistoryDemos(dummyHistory);
    }
  }, [loading, user]);

  const handleSelectDemo = (demo) => {
    router.push(`/demos/${demo.id}`);
  };

  const handleUpgradeToPro = () => {
    alert('Start Pro upgrade flow');
  };

  const handleMatchLinkSubmit = (e) => {
    e.preventDefault();
    if (!matchLink) return;
    console.log('Submitting match link:', matchLink);
    setMatchLink('');
    setIsCreateDemoOpen(false);
  };

  const handleFileChange = (e) => {
    setUploadError('');
    const file = e.target.files[0];
    if (file && file.name.endsWith('.dem')) {
      setSelectedFile(file);
    } else {
      setUploadError('Please upload a valid .dem file.');
      setSelectedFile(null);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    console.log('Uploading demo file:', selectedFile);
    setSelectedFile(null);
    setIsCreateDemoOpen(false);
  };

  const handleLinkAccount = () => {
    alert('Start Faceit linking flow');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-yellow-400 rounded-full animate-spin"></div>
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

          {/* PROFILE HEADER */}
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

          {/* HISTORY */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">History</h2>
            {historyDemos.length === 0 ? (
              <p className="text-gray-400">No history yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {historyDemos.map((demo) => (
                  <DemoCard
                    key={demo.id}
                    demo={demo}
                    onSelect={() => handleSelectDemo(demo)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* DASHBOARD SECTIONS */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Favorites */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Favorites</h3>
              <p className="text-gray-400">Your bookmarked demos for quick access.</p>
            </div>
            {/* Utility Book */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Utility Book</h3>
              <p className="text-gray-400">Reference smoke lineups and flash guides.</p>
            </div>
            <div></div>{/* placeholder */}
          </section>

          {/* ACTION BUTTONS */}
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

      <Footer />
    </>
  );
};

export default UserPage;
