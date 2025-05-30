import React, { useState, useEffect } from 'react';
import Navbar from '../../components/POVlib/Navbar';
import Footer from '../../components/POVlib/Footer';

const UserPage = () => {
  // Example user state - replace with real auth/session logic
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user
    setTimeout(() => {
      // setUser({ name: 'Placeholder User' });
      // If not logged in, keep user as null
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12">
        {/* Adjust padding to account for fixed navbar/footer */}
        <div className="container mx-auto px-4 md:px-8 space-y-8">
          <h1 className="text-3xl font-bold mb-6">User Profile</h1>

          {/* Conditional rendering based on user state */}
          {loading ? (
            <p className="text-gray-400">Loading user information...</p>
          ) : user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">
                  Name: {user.name}
                </h2>
                <p className="text-gray-400">
                  Placeholder for your saved utility lineups.
                </p>
                {/* Add more user-specific content here */}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">
              Loading complete but no user logged in...
            </p>
          )}

          {/* Util Book Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Util Book</h2>
            <p className="text-gray-400">Placeholder for your saved utility lineups.</p>
          </div>

          {/* Saved Demos Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Saved Demos</h2>
            <p className="text-gray-400">Placeholder for demos you have saved.</p>
          </div>

          {/* My Demos Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">My Demos</h2>
            <p className="text-gray-400">Placeholder for demos you have uploaded.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UserPage;
