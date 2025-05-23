"use client"
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { 
  Search, Menu, X, ChevronDown, User, MapPin, FileVideo, BellRing, LogIn 
} from 'lucide-react';
import { UserContext } from '../../../context/UserContext';
import LogoHeading from '@/components/typography/LogoHeading'
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation'

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

const Navbar = ({
  demoType = 'pro',
  onSwitchDemoType,
  searchActive,
  setSearchActive,
  setIsMenuOpen,
  isMenuOpen
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mapDropdownOpen, setMapDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const {user, setUser} = useContext(UserContext);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    setSearchActive(false);
  };

  const handleSignOut = async () => {
    console.log('Attempting to sign out...');
    const { error } = await supabase.auth.signOut();
  
    // 3. Handle potential errors
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      console.log('Sign out successful.');
      setUser(null);
      router.push('/');
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl bg-gradient-to-b from-black/50 to-transparent' : ''}`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <LogoHeading size={4}/>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-white hover:text-yellow-400 transition-colors">
              Home
            </Link>
            
 {/* Maps Dropdown */}
 <div className="relative">
              <button 
                onClick={() => setMapDropdownOpen(prev => !prev)}
                className="flex items-center text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors"
              >
                Maps <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              {mapDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50"
                  onMouseLeave={() => setMapDropdownOpen(false)}
                >
                  <div className="py-1 max-h-96 overflow-y-auto">
                    <Link 
                      href="/maps" 
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-400"
                    >
                      All Maps
                    </Link>
                    <div className="border-t border-gray-700 my-1"></div>
                    {mapNamesDesktop.map(({ label, slug }) => (
                      <Link 
                        key={slug}
                        href={`/maps/${slug}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link href="/demos" className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors">
              Demos
            </Link>
            
            <Link href="/players" className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors">
 Players
 </Link>

            {/* Community Link with Hover Modal */}
            <div className="relative">
              <div className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors cursor-pointer"
 >
                Community
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 text-center py-2 text-sm text-gray-300 opacity-0 pointer-events-none transition-opacity duration-200 hover:opacity-100 group-hover:opacity-100">
                To be continued
              </div>

              <div className="absolute inset-0 group">
                <Link 
                  href="#"
                  className="w-full h-full flex items-center justify-center"
                >
                </Link>
              </div>
            </div>

          </nav>

          {/* Rechte Navigation */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button 
              onClick={() => setSearchActive(prev => !prev)}
              className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications (Platzhalter) */}
 <button 
 className="hidden p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200 relative rounded-full"
                      aria-label="Notifications"
 >
 <BellRing className="h-5 w-5" />
 <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full"></span>
 </button>
                      
 {user ? 
 <div className="relative">
                      <button 
                        onClick={() => setUserDropdownOpen(prev => !prev)}
                        className="flex items-center p-1 text-gray-400 hover:text-yellow-400 transition-colors border border-yellow-400 rounded-full cursor-pointer w-full"
                        aria-label="User menu"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
 {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : null}
                        </div>
 </button>
                      {userDropdownOpen && (
                        <div 
                        className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50"
                        onMouseLeave={() => setUserDropdownOpen(false)}
                        >
                        <div className="py-1 text-left">
                          <Link href="/profile" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Your Profile</Link>
                          <Link href="/favorites" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Favorites</Link>
                          <Link href="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Settings</Link>
 <div className="border-t border-gray-700 my-1"></div>
                          <button onClick={handleSignOut} className="cursor-pointer text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full">Sign out</button>
                        </div>
                        </div>
                      )}
 </div>
                      : <>
                      <Link 
                      href="/signin" 
                      className="hidden lg:flex items-center px-4 py-2 bg-transparent hover:bg-yellow-400 text-white hover:text-gray-900 rounded-full border border-yellow-400/30 transition-all"
                      >
 <LogIn className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Sign In</span>
                      </Link></> }

                      {/* Mobile Menu Button */}
                      <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="md:hidden p-2 text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Erweiterte Suchleiste */}
        {searchActive && (
          <div className="pb-4 px-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search POVs, maps, players, or teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-400 transition-all"
                autoFocus
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setSearchActive(false)}
                className="absolute right-3 top-3 text-gray-400 hover:text-yellow-400"
              >
                <X className="h-5 w-5" />
              </button>
            </form>
            {searchQuery && (
              <div className="mt-2 bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                <div className="p-4">
                  <p className="text-gray-400 text-sm">Press Enter to search for "{searchQuery}"</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 z-50 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-6">
              <Link 
                href="/" 
                className="block text-white font-medium hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center mb-3">
                  <MapPin className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-white font-medium text-lg">Maps</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {mostPlayedMapsMobile.map(({ label, slug }) => (
                    <Link 
                      key={slug}
                      href={`/maps/${slug}`}
                      className="block py-2 text-gray-300 hover:text-yellow-400 text-center border border-gray-700 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
                <Link 
                  href="/maps" 
                  className="block text-sm text-yellow-400 mt-3 text-center hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Alle Maps →
                </Link>
              </div>
              
              <Link 
                href="/demos" 
                className="block text-gray-300 hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <FileVideo className="h-5 w-5 text-yellow-400" />
                  <span className="font-medium">Demos</span>
                </div>
              </Link>
              
              <Link 
                href="/players" 
                className="block text-gray-300 hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-yellow-400" />
                  <span className="font-medium">Players</span>
                </div>
              </Link>
              
              
              {/* Sign In Button */}
              <div className="border-t border-gray-800 pt-6">
                <Link 
                  href="/login"
                  className="block w-full py-3 bg-yellow-400 text-gray-900 rounded-lg text-center font-bold hover:bg-yellow-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
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
};

export default Navbar;
