import React from 'react';
import Link from 'next/link';
import { Search, Menu } from 'lucide-react';

const Navbar = ({ demoType, onSwitchDemoType, searchActive, setSearchActive, setIsMenuOpen, isMenuOpen }) => {
  return (
    <nav className="backdrop-blur-lg bg-gray-900/80 py-4 px-6 sticky top-0 z-50 border-b border-gray-700 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-3xl font-black">
              <span className="text-yellow-400">POV</span>
              <span className="text-white">lib</span>
              <span className="text-gray-400 text-xl">.gg</span>
            </h1>
          </Link>
          <div className="hidden md:flex space-x-8 ml-10">
            <Link href="/" className="text-sm text-white font-bold relative group">Home</Link>
            <Link href="/demos" className="text-sm text-gray-400 hover:text-white font-medium relative group">Demos</Link>
            <Link href="/players" className="text-sm text-gray-400 hover:text-white font-medium relative group">Players</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white font-medium relative group">Maps</Link>
          </div>
        </div>
        <div className="flex items-center space-x-6">
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
          <button 
            onClick={() => setSearchActive(true)}
            className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors duration-200"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-700 shadow-lg">
          <div className="container mx-auto p-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-white font-bold py-2">Home</Link>
              <Link href="/demos" className="text-gray-400 hover:text-white py-2">Demos</Link>
              <Link href="/players" className="text-gray-400 hover:text-white py-2">Players</Link>
              <Link href="#" className="text-gray-400 hover:text-white py-2">Maps</Link>
              <div className="border-t border-gray-700 pt-4 mt-2">
                <div className="flex items-center p-1 bg-gray-800 rounded-full">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;