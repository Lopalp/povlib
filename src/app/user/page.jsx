"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/POVlib/Navbar';
import Footer from '../../components/POVlib/Footer';

const UserPage = () => {
  // Beispielhaft: ersetze durch echte Auth-/Session-Logik
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuliere Fetching des Benutzers
    setTimeout(() => {
      // Kommentiere aus, um nicht eingeloggt zu simulieren
      setUser({
        name: 'Max Mustermann',
        email: 'max@example.com',
        avatarUrl: '/images/avatar-placeholder.png',
        joinedAt: '2023-08-15',
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl font-bold mb-8">Mein Profil</h1>

          {loading ? (
            <div className="flex justify-center py-20">
              {/* Einfache Tailwind-Ladespinner */}
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : user ? (
            <div className="bg-white rounded-2xl shadow p-8 max-w-2xl mx-auto space-y-6">
              <div className="flex items-center space-x-6">
                {/* Avatar als normales img-Element */}
                <img
                  src={user.avatarUrl}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-semibold">{user.name}</h2>
                  <p className="text-gray-500">Seit dem {new Date(user.joinedAt).toLocaleDateString('de-DE')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">E-Mail</h3>
                  <p className="text-gray-700">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Account-Status</h3>
                  <p className="text-green-600 font-medium">Aktiv</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Profil bearbeiten
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 space-y-4">
              <p className="text-gray-600">Du bist nicht eingeloggt.</p>
              <a
                href="/login"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Einloggen
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserPage;
