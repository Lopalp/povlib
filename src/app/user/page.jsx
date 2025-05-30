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

const UtilCard = ({ util }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow">
    <div className="p-4">
      <h4 className="text-lg font-semibold text-white">{util.name}</h4>
      <p className="text-gray-400 text-sm">Map: {util.map}</p>
      <p className="text-gray-400 text-sm">Side: {util.side}</p>
      <p className="text-gray-400 text-sm">Type: {util.type}</p>
      <p className="text-gray-400 text-sm">Group: {util.group}</p>
      <p className="text-gray-400 text-sm">Player: {util.player}</p>
      <p className="text-gray-400 text-sm">Location: {util.location}</p>
      {util.clip && (
        <a
          href={util.clip}
          target="_blank"
          rel="noreferrer"
          className="text-yellow-400 text-sm hover:underline"
        >
          View Clip
        </a>
      )}
    </div>
  </div>
);

const UserPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // all demos for random tag filtering
  const [allDemos, setAllDemos] = useState([]);
  const [historyDemos, setHistoryDemos] = useState([]);
  const [favoriteDemos, setFavoriteDemos] = useState([]);

  // Create demo form state
  const [matchLink, setMatchLink] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Utility Book state
  const [utils, setUtils] = useState([]);
  const [utilFilters, setUtilFilters] = useState({
    map: '',
    side: '',
    type: '',
    group: ''
  });
  const [isUtilModalOpen, setIsUtilModalOpen] = useState(false);
  const [newUtil, setNewUtil] = useState({
    name: '',
    map: '',
    side: '',
    type: '',
    group: '',
    player: '',
    location: '',
    clip: ''
  });

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

  // once user exists, load demos and pick two random tags
  useEffect(() => {
    if (!loading && user) {
      (async () => {
        const demos = await getFilteredDemos({}, 'all');
        const mapped = demos.map(mapDemo);
        setAllDemos(mapped);

        // collect unique tags
        const tags = [...new Set(mapped.flatMap(d => d.tags))];
        if (tags.length) {
          // pick history tag
          const h = tags[Math.floor(Math.random() * tags.length)];
          // pick different favorite tag
          let f;
          do {
            f = tags[Math.floor(Math.random() * tags.length)];
          } while (f === h && tags.length > 1);
          setHistoryDemos(mapped.filter(d => d.tags.includes(h)));
          setFavoriteDemos(mapped.filter(d => d.tags.includes(f)));
        } else {
          setHistoryDemos(mapped);
          setFavoriteDemos(mapped);
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

  // util filtering
  const filteredUtils = useMemo(() => {
    return utils.filter(u =>
      (!utilFilters.map || u.map === utilFilters.map) &&
      (!utilFilters.side || u.side === utilFilters.side) &&
      (!utilFilters.type || u.type === utilFilters.type) &&
      (!utilFilters.group || u.group === utilFilters.group)
    );
  }, [utils, utilFilters]);

  const utilMaps = useMemo(() => [...new Set(utils.map(u => u.map))], [utils]);
  const utilGroups = useMemo(() => [...new Set(utils.map(u => u.group))], [utils]);
  const utilTypes = ['Smoke','Flash','Molotov','HE','Exec'];
  const utilSides = ['CT','T'];

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
          <CategorySection
            title="History"
            demos={historyDemos}
            onSelectDemo={handleSelectDemo}
          />

          {/* FAVORITES */}
          <CategorySection
            title="Favorites"
            demos={favoriteDemos}
            onSelectDemo={handleSelectDemo}
          />

          {/* UTILITY BOOK */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Utility Book</h2>
              <button
                onClick={() => setIsUtilModalOpen(true)}
                className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg"
              >
                Add Util
              </button>
            </div>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <select
                value={utilFilters.map}
                onChange={e => setUtilFilters(f => ({ ...f, map: e.target.value }))}
                className="bg-gray-800 text-gray-200 p-2 rounded"
              >
                <option value="">All Maps</option>
                {utilMaps.map(m => <option key={m}>{m}</option>)}
              </select>
              <select
                value={utilFilters.side}
                onChange={e => setUtilFilters(f => ({ ...f, side: e.target.value }))}
                className="bg-gray-800 text-gray-200 p-2 rounded"
              >
                <option value="">All Sides</option>
                {utilSides.map(s => <option key={s}>{s}</option>)}
              </select>
              <select
                value={utilFilters.type}
                onChange={e => setUtilFilters(f => ({ ...f, type: e.target.value }))}
                className="bg-gray-800 text-gray-200 p-2 rounded"
              >
                <option value="">All Types</option>
                {utilTypes.map(t => <option key={t}>{t}</option>)}
              </select>
              <select
                value={utilFilters.group}
                onChange={e => setUtilFilters(f => ({ ...f, group: e.target.value }))}
                className="bg-gray-800 text-gray-200 p-2 rounded"
              >
                <option value="">All Groups</option>
                {utilGroups.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            {/* Utils Grid */}
            {filteredUtils.length === 0 ? (
              <p className="text-gray-400">No utils saved.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUtils.map(u => (
                  <UtilCard key={u.id} util={u} />
                ))}
              </div>
            )}
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

      {isUtilModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && setIsUtilModalOpen(false)}
        >
          <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add Utility</h2>
            <form onSubmit={e => {
              e.preventDefault();
              setUtils(us => [...us, { ...newUtil, id: Date.now() }]);
              setNewUtil({ name:'',map:'',side:'',type:'',group:'',player:'',location:'',clip:''});
              setIsUtilModalOpen(false);
            }} className="space-y-4">
              {[
                { label:'Name', key:'name' },
                { label:'Map', key:'map' },
                { label:'Side', key:'side' },
                { label:'Type', key:'type' },
                { label:'Group', key:'group' },
                { label:'Player', key:'player' },
                { label:'Location', key:'location' },
                { label:'Video Clip URL', key:'clip' },
              ].map(field => (
                <input
                  key={field.key}
                  type="text"
                  placeholder={field.label}
                  value={newUtil[field.key]}
                  onChange={e => setNewUtil(n => ({ ...n, [field.key]: e.target.value }))}
                  className="w-full p-2 bg-gray-700 text-gray-200 rounded"
                />
              ))}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsUtilModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default UserPage;
