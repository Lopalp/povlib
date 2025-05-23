"use client"
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import {
  Search, Menu, X, ChevronDown, User, MapPin, FileVideo, BellRing, LogIn
} from 'lucide-react';
import { UserContext } from '../../../context/UserContext';
import LogoHeading from '@/components/typography/LogoHeading';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const mapNamesDesktop = [
  { label: 'Mirage', slug: 'mirage' },
  { label: 'Inferno', slug: 'inferno' },
  { label: 'Nuke', slug: 'nuke' },
  { label: 'Ancient', slug: 'ancient' },
  { label: 'Overpass', slug: 'overpass' },
  { label: 'Anubis', slug: 'anubis' },
  { label: 'Vertigo', slug: 'vertigo' },
];

const mostPlayedMapsMobile = [
  { label: 'Mirage', slug: 'mirage' },
  { label: 'Inferno', slug: 'inferno' },
  { label: 'Nuke', slug: 'nuke' },
  { label: 'Ancient', slug: 'ancient' },
];

export default function Navbar({
  searchActive,
  setSearchActive,
  setIsMenuOpen,
  isMenuOpen,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mapMenuOpen, setMapMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, setUser } = useContext(UserContext);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    // perform actual search logic here
    setSearchActive(false);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      router.push('/');
    }
  };

  const baseLink =
    'text-sm font-medium transition-colors duration-200 hover:text-yellow-400';

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300
        ${!isScrolled
          ? 'bg-gradient-to-b from-black/70 to-transparent'
          : 'bg-gradient-to-b from-black/30 to-transparent backdrop-blur-lg'}
      `}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <LogoHeading size={4} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`${baseLink} text-white`}>Home</Link>
            <div className="relative">
              <button
                onClick={() => setMapMenuOpen(o => !o)}
                className={`${baseLink} text-gray-300 flex items-center`}
              >
                Maps <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {mapMenuOpen && (
                <ul
                  className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden"
                  onMouseLeave={() => setMapMenuOpen(false)}
                >
                  <li>
                    <Link
                      href="/maps"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                    >
                      All Maps
                    </Link>
                  </li>
                  <li className="border-t border-gray-700" />
                  {mapNamesDesktop.map(m => (
                    <li key={m.slug}>
                      <Link
                        href={`/maps/${m.slug}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        {m.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link href="/demos" className={`${baseLink} text-gray-300`}>Demos</Link>
            <Link href="/players" className={`${baseLink} text-gray-300`}>Players</Link>
            <div className="relative group">
              <span className={`${baseLink} text-gray-300 cursor-default`}>Community</span>
              <div className="absolute left-1/2 top-full mt-2 w-44 -translate-x-1/2 bg-gray-800 rounded-xl py-2 text-center text-gray-300 text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                To be continued
              </div>
            </div>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchActive(a => !a)}
              className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notification */}
            <button className="hidden md:block p-2 relative text-gray-400 hover:text-yellow-400 transition-colors">
              <BellRing className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full" />
            </button>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center p-1 border border-yellow-400 rounded-full text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                    {user.avatar_url && (
                      <img
                        src={user.avatar_url}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </button>
                {userMenuOpen && (
                  <ul
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <li>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Your Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/favorites"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Favorites
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Settings
                      </Link>
                    </li>
                    <li className="border-t border-gray-700" />
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Link
                href="/signin"
                className="hidden lg:flex items-center px-4 py-2 border border-yellow-400/30 rounded-full bg-transparent text-white hover:bg-yellow-400 hover:text-gray-900 transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" /> Sign In
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMenuOpen(o => !o)}
              className="md:hidden p-2 text-gray-400 hover:text-yellow-400 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Glassmorphic Search Bar */}
        {searchActive && (
          <div className="mt-2 px-4">
            <form
              onSubmit={handleSearch}
              className="relative mx-auto max-w-lg"
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-full flex items-center px-4 py-2 transition-shadow shadow-lg">
                <Search className="h-5 w-5 text-gray-200" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search POVs, maps, players or teams..."
                  className="flex-grow bg-transparent placeholder-gray-300 text-white ml-3 focus:outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-lg z-50 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-6">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-white font-medium hover:text-yellow-400">
                Home
              </Link>
              <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center mb-3 text-lg font-medium text-white">
                  <MapPin className="h-5 w-5 text-yellow-400 mr-2" /> Maps
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {mostPlayedMapsMobile.map(m => (
                    <Link
                      key={m.slug}
                      href={`/maps/${m.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 text-center text-gray-300 border border-gray-700 rounded-md hover:text-yellow-400"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
                <Link href="/maps" onClick={() => setIsMenuOpen(false)} className="mt-3 block text-center text-sm text-yellow-400 hover:underline">
                  Alle Maps →
                </Link>
              </div>
              <Link href="/demos" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-yellow-400">
                <FileVideo className="h-5 w-5 text-yellow-400" /> Demos
              </Link>
              <Link href="/players" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-yellow-400">
                <User className="h-5 w-5 text-yellow-400" /> Players
              </Link>
              <div className="border-t border-gray-800 pt-6">
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block w-full py-3 rounded-full bg-yellow-400 text-gray-900 font-bold text-center hover:bg-yellow-300">
                  Sign In
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
