import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown, User, MapPin, FileVideo, BellRing, LogIn } from 'lucide-react';

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

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would navigate to search results
    console.log('Search query:', searchQuery);
    setSearchActive(false);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg' : 'bg-gradient-to-b from-gray-900/80 to-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 bg-yellow-400 rounded-full animate-pulse opacity-50"></div>
              <span className="text-gray-900 font-black text-lg">P</span>
            </div>
            <h1 className="text-2xl font-black">
              <span className="text-yellow-400">POV</span>
              <span className="text-white">lib</span>
              <span className="text-gray-400 text-xl">.gg</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-white hover:text-yellow-400 transition-colors"
            >
              Home
            </Link>
            
            <div className="relative group">
              <button 
                onClick={() => setMapDropdownOpen(!mapDropdownOpen)}
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
                    <Link 
                      href="/maps/mirage" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                    >
                      Mirage
                    </Link>
                    <Link 
                      href="/maps/inferno" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                    >
                      Inferno
                    </Link>
                    <Link 
                      href="/maps/nuke" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                    >
                      Nuke
                    </Link>
                    <Link 
                      href="/maps/ancient" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                    >
                      Ancient
                    </Link>
                    <Link 
                      href="/maps/overpass" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                    >
                      Overpass
                    </Link>
                    <Link 
                      href="/maps/anubis" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                    >
                      Anubis
                    </Link>
                    <Link 
                      href="/maps/vertigo" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                    >
                      Vertigo
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link 
              href="/demos" 
              className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors"
            >
              Demos
            </Link>
            
            <Link 
              href="/players" 
              className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors"
            >
              Players
            </Link>
            
            <Link 
              href="/teams" 
              className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors"
            >
              Teams
            </Link>
            
            <Link 
              href="/events" 
              className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors"
            >
              Events
            </Link>
          </nav>

          {/* Right Side Navigation */}
          <div className="flex items-center space-x-4">
            {/* PRO/COMMUNITY Toggle */}
            <div className="hidden md:flex items-center p-1 bg-gray-800 rounded-full">
              <button
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 ${demoType === 'pro' ? 'bg-yellow-400 text-gray-900 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-gray-400 hover:text-white'}`}
                onClick={() => onSwitchDemoType('pro')}
              >
                PRO POVs
              </button>
              <button
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 ${demoType === 'community' ? 'bg-yellow-400 text-gray-900 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-gray-400 hover:text-white'}`}
                onClick={() => onSwitchDemoType('community')}
              >
                COMMUNITY
              </button>
            </div>

            {/* Search Button */}
            <button 
              onClick={() => setSearchActive(!searchActive)}
              className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications Bell - Hidden until implemented */}
            <button 
              className="hidden p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200 relative"
              aria-label="Notifications"
            >
              <BellRing className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full"></span>
            </button>

            {/* User Menu - Hidden for now, could be used for logged-in users */}
            <div className="hidden relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              </button>
              
              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="py-1">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                    >
                      Your Profile
                    </Link>
                    <Link 
                      href="/favorites" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Favorites
                    </Link>
                    <Link 
                      href="/settings" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-700 my-1"></div>
                    <Link 
                      href="/logout" 
                      className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                    >
                      Sign out
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Sign In Button - Hidden until auth is implemented */}
            <Link 
              href="/login" 
              className="hidden md:flex items-center px-4 py-2 bg-transparent hover:bg-yellow-400 text-white hover:text-gray-900 rounded-md border border-yellow-400/30 hover:border-yellow-400 transition-all"
            >
              <LogIn className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Sign In</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Search Bar */}
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
            {searchQuery.length > 0 && (
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
        <div className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-4">
              <Link 
                href="/" 
                className="block py-2 text-white font-medium hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="border-t border-gray-800 pt-2">
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-yellow-400 mr-2" />
                  <span className="text-white font-medium">Maps</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pl-6">
                  <Link 
                    href="/maps/mirage" 
                    className="text-gray-300 py-1 hover:text-yellow-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mirage
                  </Link>
                  <Link 
                    href="/maps/inferno" 
                    className="text-gray-300 py-1 hover:text-yellow-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inferno
                  </Link>
                  <Link 
                    href="/maps/nuke" 
                    className="text-gray-300 py-1 hover:text-yellow-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Nuke
                  </Link>
                  <Link 
                    href="/maps/ancient" 
                    className="text-gray-300 py-1 hover:text-yellow-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ancient
                  </Link>
                </div>
                <Link 
                  href="/maps" 
                  className="block text-sm text-yellow-400 mt-1 pl-6 hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View all maps →
                </Link>
              </div>
              
              <div className="border-t border-gray-800 pt-2">
                <Link 
                  href="/demos" 
                  className="flex items-center py-2 text-gray-300 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FileVideo className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="font-medium">Demos</span>
                </Link>
              </div>
              
              <div className="border-t border-gray-800 pt-2">
                <Link 
                  href="/players" 
                  className="flex items-center py-2 text-gray-300 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="font-medium">Players</span>
                </Link>
              </div>
              
              <div className="border-t border-gray-800 pt-2">
                <Link 
                  href="/teams" 
                  className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Teams
                </Link>
              </div>
              
              <div className="border-t border-gray-800 pt-2">
                <Link 
                  href="/events" 
                  className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </Link>
              </div>
              
              {/* Mobile PRO/COMMUNITY Toggle */}
              <div className="border-t border-gray-800 pt-4">
                <div className="bg-gray-800 p-1 rounded-full flex">
                  <button
                    className={`flex-1 text-xs font-bold py-2 rounded-full transition-all ${demoType === 'pro' ? 'bg-yellow-400 text-gray-900' : 'text-gray-400'}`}
                    onClick={() => {
                      onSwitchDemoType('pro');
                      setIsMenuOpen(false);
                    }}
                  >
                    PRO POVs
                  </button>
                  <button
                    className={`flex-1 text-xs font-bold py-2 rounded-full transition-all ${demoType === 'community' ? 'bg-yellow-400 text-gray-900' : 'text-gray-400'}`}
                    onClick={() => {
                      onSwitchDemoType('community');
                      setIsMenuOpen(false);
                    }}
                  >
                    COMMUNITY
                  </button>
                </div>
              </div>
              
              {/* Sign In Button */}
              <div className="border-t border-gray-800 pt-4">
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