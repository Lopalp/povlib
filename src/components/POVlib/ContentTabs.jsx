import React from 'react';

const ContentTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-8 border-b border-gray-700">
      <div className="flex space-x-1">
        <button
          className={`px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'all' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('all')}
        >
          All POVs
        </button>
        <button
          className={`px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'trending' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('trending')}
        >
          Trending
        </button>
        <button
          className={`px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'latest' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('latest')}
        >
          Latest
        </button>
        <button
          className={`px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'awp' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('awp')}
        >
          AWP Plays
        </button>
        <button
          className={`px-4 py-3 text-sm font-bold transition-colors ${activeTab === 'rifle' ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gradient-to-t from-yellow-400/10 to-transparent' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('rifle')}
        >
          Rifle Plays
        </button>
      </div>
    </div>
  );
};

export default ContentTabs;
