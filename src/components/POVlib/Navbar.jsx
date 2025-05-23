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
import clsx from 'clsx';

const mapNamesDesktop = [
  { label: 'Mirage', slug: 'mirage' },
  { label: 'Inferno', slug: 'inferno' },
  { label: 'Nuke', slug: 'nuke' },
  { label: 'Ancient', slug: 'ancient' },
  { label: 'Overpass', slug: 'overpass' },
  { label: 'Anubis', slug: 'anubis' },
  { label: 'Vertigo', slug: 'vertigo' }
];

const mostPlayedMapsMobile = [
  { label: 'Mirage', slug: 'mirage' },
  { label: 'Inferno', slug: 'inferno' },
  { label: 'Nuke', slug: 'nuke' },
  { label: 'Ancient', slug: 'ancient' }
];

export default function Navbar({
  demoType = 'pro',
  onSwitchDemoType,
  searchActive,
  setSearchActive,
  setIsMenuOpen,
  isMenuOpen
}) {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mapDropdownOpen, setMapDropdownOpen]   = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');
  const supabase                            = createSupabaseBrowserClient();
  const router                             = useRouter();
  const { user, setUser }                   = useContext(UserContext);

  // Shadow when at top; glass when scrolled
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = e => {
    e.preventDefault();
    // hier ggf. Navigation oder Suche ausführen
    setSearchActive(false);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      router.push('/');
    }
  };

  const headerClasses = clsx(
    'fixed top-0 w-full z-50 transition-all duration-300',
    !isScrolled
      ? 'shadow-xl bg-black/80'
      : 'backdrop-filter backdrop-blur-lg bg-black/30 border-b border-gray-700'
  );

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <LogoHeading size={4}/>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link">Home</Link>

            {/* Maps */}
            <div className="relative">
              <button
                onClick={() => setMapDropdownOpen(open => !open)}
                className="nav-link flex items-center"
              >
                Maps <ChevronDown className="ml-1 h-4 w-4"/>
              </button>
              {mapDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50"
                  onMouseLeave={() => setMapDropdownOpen(false)}
                >
                  <Link href="/maps" className="dropdown-item">All Maps</Link>
                  <div className="border-t border-gray-700 my-1"/>
                  {mapNamesDesktop.map(m => (
                    <Link
                      key={m.slug}
                      href={`/maps/${m.slug}`}
                      className="dropdown-item text-gray-300"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/demos" className="nav-link text-gray-300">Demos</Link>
            <Link href="/players" className="nav-link text-gray-300">Players</Link>

            {/* Community Placeholder */}
            <div className="relative group">
              <div className="nav-link cursor-default">Community</div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-40 bg-gray-800 rounded-lg border border-gray-700 py-2 text-center text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                To be continued
              </div>
            </div>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setSearchActive(active => !active)}
              className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5"/>
            </button>

            {/* Notifications (Placeholder) */}
            <button className="hidden p-2 relative text-gray-400 hover:text-yellow-400 md:block">
              <BellRing className="h-5 w-5"/>
              <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full"/>
            </button>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(open => !open)}
                  className="flex items-center p-1 border border-yellow-400 rounded-full text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                    {user.avatar_url && <img src={user.avatar_url} alt="avatar" className="object-cover w-full h-full"/>}
                  </div>
                </button>
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <Link href="/profile" className="dropdown-item">Your Profile</Link>
                    <Link href="/favorites" className="dropdown-item text-gray-300">Favorites</Link>
                    <Link href="/settings" className="dropdown-item text-gray-300">Settings</Link>
                    <div className="border-t border-gray-700 my-1"/>
                    <button
                      onClick={handleSignOut}
                      className="dropdown-item text-red-400"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/signin"
                className="hidden lg:flex items-center px-4 py-2 border border-yellow-400/30 rounded-full text-white hover:bg-yellow-400 hover:text-gray-900 transition"
              >
                <LogIn className="mr-2 h-4 w-4"/> Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(open => !open)}
              className="md:hidden p-2 text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchActive && (
          <div className="pb-4 px-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search POVs, maps, players, or teams..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full p-3 pl-10 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-yellow-400 transition"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"/>
              <button
                type="button"
                onClick={() => setSearchActive(false)}
                className="absolute right-3 top-3 text-gray-400 hover:text-yellow-400"
              >
                <X className="h-5 w-5"/>
              </button>
            </form>
            {searchQuery && (
              <div className="mt-2 bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
                <div className="p-4">
                  <p className="text-gray-400 text-sm">
                    Press Enter to search for “{searchQuery}”
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 md:hidden overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-6">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-white font-medium hover:text-yellow-400">
                Home
              </Link>

              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center mb-3">
                  <MapPin className="mr-2 h-5 w-5 text-yellow-400"/> <span className="text-lg font-medium text-white">Maps</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {mostPlayedMapsMobile.map(m => (
                    <Link
                      key={m.slug}
                      href={`/maps/${m.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="border border-gray-700 rounded-md py-2 text-center text-gray-300 hover:text-yellow-400"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/maps"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-3 block text-center text-sm text-yellow-400 hover:underline"
                >
                  Alle Maps →
                </Link>
              </div>

              <Link href="/demos" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-yellow-400">
                <FileVideo className="h-5 w-5 text-yellow-400"/> Demos
              </Link>
              <Link href="/players" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-yellow-400">
                <User className="h-5 w-5 text-yellow-400"/> Players
              </Link>

              <div className="pt-6 border-t border-gray-800">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full rounded-lg bg-yellow-400 py-3 text-center font-bold text-gray-900 hover:bg-yellow-300 transition"
                >
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
