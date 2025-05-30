'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/POVlib/Navbar';
import Footer from '../../components/POVlib/Footer';
import DemoCard from '../../components/POVlib/DemoCard';

const UserPage = () => {
  // Simulated user state — replace with real auth/session logic
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Form state for creating a new demo
  const [matchLink, setMatchLink] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Simulate fetching user
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

  const handlePurchasePro = () => {
    // TODO: integrate payment flow
    alert('Pro purchase flow here');
  };

  const handleMatchLinkSubmit = (e) => {
    e.preventDefault();
    if (!matchLink) return;
    // TODO: submit matchLink, consume 1 credit
    console.log('Submitting match link:', matchLink);
    setMatchLink('');
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
    // TODO: upload file, consume 1 credit
    console.log('Uploading demo file:', selectedFile);
    setSelectedFile(null);
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
          <p>You need to <a href="/signin" className="text-yellow-400 underline">log in</a> to view your profile.</p>
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

          {/* DASHBOARD SECTIONS */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* History */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">History</h3>
              <p className="text-gray-400">View your past demos and runs.</p>
              {/* TODO: history list */}
            </div>

            {/* Favorites */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Favorites</h3>
              <p className="text-gray-400">Your bookmarked demos for quick access.</p>
              {/* TODO: favorites list */}
            </div>

            {/* Utility Book */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Utility Book</h3>
              <p className="text-gray-400">Reference smoke lineups and flash guides.</p>
              {/* TODO: utility content */}
            </div>

          </section>

          {/* CREATE NEW DEMO */}
          <section className="bg-gray-800 rounded-lg p-6 space-y-6">
            <h3 className="text-2xl font-semibold">Create New Demo</h3>
            <p className="text-gray-400">Each run consumes 1 credit.</p>

            <form onSubmit={handleMatchLinkSubmit} className="flex gap-2">
              <input
                type="text"
                value={matchLink}
                onChange={e => setMatchLink(e.target.value)}
                placeholder="Paste match link here"
                className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none"
              />
              <button
                type="submit"
                disabled={!matchLink}
                className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg disabled:opacity-50"
              >
                Run Link
              </button>
            </form>

            <div className="flex items-center gap-4">
              <button
                onClick={() => alert('Connect Faceit flow')}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
              >
                Link Faceit Account
              </button>
              <form onSubmit={handleUploadSubmit} className="flex items-center gap-2">
                <label className="px-4 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                  Upload .dem
                  <input type="file" accept=".dem" onChange={handleFileChange} className="hidden" />
                </label>
                <button
                  type="submit"
                  disabled={!selectedFile}
                  className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg disabled:opacity-50"
                >
                  Run Upload
                </button>
              </form>
            </div>
            {uploadError && <p className="text-red-500">{uploadError}</p>}
          </section>

          {/* COMPARE PLANS */}
          <section className="bg-gray-800 rounded-lg p-6 space-y-6">
            <h3 className="text-2xl font-semibold">Compare Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Standard Card */}
              <div className="border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold mb-4">Standard</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li>5 credits / month</li>
                    <li>Basic utility book</li>
                    <li>Standard processing</li>
                    <li>Community support</li>
                  </ul>
                </div>
                <button
                  disabled
                  className="mt-6 px-4 py-2 bg-gray-700 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                >
                  Current Plan
                </button>
              </div>

              {/* Pro Card */}
              <div className="bg-yellow-400 rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold mb-4 text-gray-900">Pro</h4>
                  <ul className="space-y-2 text-gray-900">
                    <li>Unlimited credits</li>
                    <li>Full utility book</li>
                    <li>Priority processing</li>
                    <li>Premium support</li>
                    <li>Early access demos</li>
                  </ul>
                </div>
                <button
                  onClick={handlePurchasePro}
                  className="mt-6 px-4 py-2 bg-gray-900 text-yellow-400 font-semibold rounded-lg hover:bg-gray-800 transition"
                >
                  Upgrade to Pro
                </button>
              </div>

            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default UserPage;
