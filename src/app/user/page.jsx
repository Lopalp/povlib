jsx
import React from 'react';
import Navbar from '../../components/POVlib/Navbar';
import Footer from '../../components/POVlib/Footer';

const UserPage = ({ user }) => {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12"> {/* Adjust padding to account for fixed navbar/footer */}
        <div className="container mx-auto px-4 md:px-8 space-y-8">
          <h1 className="text-3xl font-bold mb-6">User Profile</h1>
          {user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Name: {user.name || 'N/A'}</h2>
                <p className="text-gray-300">Email: {user.email || 'N/A'}</p>
              </div>
              
              {/* Util Book Section */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Util Book</h2>
                <p className="text-gray-400">Placeholder for your saved utility lineups.</p>
                {/* Add content here */}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Loading user information or user not logged in...</p>
          )}

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