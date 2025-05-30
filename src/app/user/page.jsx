"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/POVlib/Navbar';
import Footer from '../../components/POVlib/Footer';
import DemoCard from '../../components/POVlib/DemoCard';
// import { getUserProfile, getDemosByUser } from '@/lib/supabase'; // Uncomment when available

const UserPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with real auth/session logic
        // const profile = await getUserProfile();
        // const userDemos = await getDemosByUser(profile.id);
        // setUser(profile);
        // setDemos(userDemos);

        // Placeholder data
        const profile = { name: 'Max Mustermann', joinedAt: '2023-08-15', stats: { totalViews: 12345 } };
        const userDemos = [];
        setUser(profile);
        setDemos(userDemos);
      } catch (err) {
        console.error(err);
        setError('Failed to load user data.');
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin mb-4" />
            <p>Loading user data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => router.refresh()}
              className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : !user ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-gray-400">Du bist nicht eingeloggt.</p>
            <button
              onClick={() => router.push('/signin')}
              className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg"
            >
              Einloggen
            </button>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center text-yellow-400 text-6xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="md:flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                <p className="text-gray-400">
                  Beigetreten am {new Date(user.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/60 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{demos.length}</div>
                <p className="text-gray-400">Deine POVs</p>
              </div>
              {user.stats?.totalViews && (
                <div className="bg-gray-800/60 backdrop-blur-sm p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">
                    {user.stats.totalViews.toLocaleString()}
                  </div>
                  <p className="text-gray-400">Aufrufe gesamt</p>
                </div>
              )}
            </div>

            {/* User's Demos */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Deine POVs</h2>
              {demos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {demos.map((demo) => (
                    <DemoCard
                      key={demo.id}
                      demo={demo}
                      onSelect={() => router.push(`/demos/${demo.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">
                  Du hast noch keine POV-Demos hochgeladen.
                </p>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default UserPage;
