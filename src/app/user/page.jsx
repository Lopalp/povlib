"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Edit3, MapPin, Clock, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import PostCard from './PostCard';
import FilterModal from './FilterModal';

import {
  getUserProfile,
  getPostsByUser,
  getFilterOptions
} from '@/lib/supabase';

const UserPage = ({ userName }) => {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [filters, setFilters] = useState({ category: '', date: '' });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const observer = useRef();

  // Load profile and initial posts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const options = await getFilterOptions();
        setFilterOptions(options);

        const userData = await getUserProfile(userName);
        if (!userData) throw new Error('User not found');
        setProfile(userData);

        const initial = await getPostsByUser(userName, filters, 1, 12);
        setPosts(initial);
        setHasMore(initial.length === 12);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userName, filters]);

  // Infinite scroll
  const loadMore = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const next = page + 1;
      const more = await getPostsByUser(userName, filters, next, 12);
      setPosts(prev => [...prev, ...more]);
      setHasMore(more.length === 12);
      setPage(next);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const lastRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) loadMore();
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // Handlers
  const handleBack = () => router.back();
  const handleEdit = () => {/* open edit modal */};
  const handleOpenFilter = () => setIsFilterOpen(true);
  const handleApplyFilters = () => setIsFilterOpen(false);
  const handleFilterChange = changes => setFilters(prev => ({ ...prev, ...changes }));

  // Loading state
  if (isLoading && !posts.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading user...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200">
      <Navbar />
      {/* Profile Header */}
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-8">
        <img
          src={profile.avatar || '/images/avatar-placeholder.png'}
          alt={userName}
          className="w-32 h-32 rounded-full border-4 border-yellow-400/50"
        />
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-4xl font-bold">{profile.name || userName}</h1>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start text-gray-400">
            <div className="flex items-center gap-1"><MapPin size={16} />{profile.location}</div>
            <div className="flex items-center gap-1"><Clock size={16} />Joined {new Date(profile.joinedAt).toLocaleDateString()}</div>
            <div className="flex items-center gap-1"><Users size={16} />{profile.followers} Followers</div>
          </div>
        </div>
        <button
          onClick={handleEdit}
          className="flex items-center px-4 py-2 border border-gray-600 rounded-lg hover:border-yellow-400 transition"
        >
          <Edit3 size={16} className="mr-2" /> Edit Profile
        </button>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Posts</h2>
          <button
            onClick={handleOpenFilter}
            className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700 transition"
          >Filter</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post, i) => {
            if (i === posts.length - 1) {
              return <div ref={lastRef} key={post.id}><PostCard post={post} /></div>;
            }
            return <PostCard key={post.id} post={post} />;
          })}
        </div>

        {isLoading && <div className="text-center py-6">Loading more...</div>}
        {!hasMore && posts.length > 0 && <div className="text-center py-6">End of posts.</div>}
        {posts.length === 0 && !isLoading && <div className="text-center py-12 text-gray-400">No posts found.</div>}
      </main>

      {isFilterOpen && (
        <FilterModal
          options={filterOptions}
          selected={filters}
          onClose={() => setIsFilterOpen(false)}
          onChange={handleFilterChange}
          onApply={handleApplyFilters}
        />
      )}

      <Footer />
    </div>
  );
};

export default UserPage;