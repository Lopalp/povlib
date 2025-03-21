import React from 'react';
import { Search, Menu } from 'lucide-react';

const Navbar = ({ demoType, onSwitchDemoType, searchActive, setSearchActive, setIsMenuOpen, isMenuOpen }) => {
  return (
    <nav className="backdrop-blur-lg bg-gray-900/80 py-4 px-6 sticky top-0 z-50 border-b border-gray-700 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-3xl font-black">
            <span className="text-yellow-400">POV</span>
            <span className="text-white">lib</span>
            <span className="text-gray-400 text-xl">.gg</span>
          </h1>
          <div className="hidden md:flex space-x-8 ml-10">
            <a href="#" className="text-sm text-white font-bold relative group">Home</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white font-medium relative group">Maps</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white font-medium relative group">Players</a>
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
    </nav>
  );
};

export default Navbar;
