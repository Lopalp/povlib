import React from 'react';

const Footer = () => (
  <footer className="bg-gray-800 py-10 border-t border-gray-700">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div className="mb-8 md:mb-0">
          <h2 className="text-2xl font-black mb-2">
            <span className="text-yellow-400">POV</span>
            <span className="text-white">lib</span>
            <span className="text-gray-400 text-lg">.gg</span>
          </h2>
          <p className="text-gray-400 text-sm">The ultimate CS2 Pro-POV library</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-6">
          <div>
            <h3 className="text-white font-bold mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Maps</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Players</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Events</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-3">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Pro POVs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Community Demos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Trending Content</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">New Uploads</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-xs mb-4 md:mb-0">© 2025 POVlib.gg - All rights reserved</p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
              <img src="https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true" className="w-4 h-4 rounded-full" alt="social" />
            </div>
          </a>
          <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
              <img src="https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true" className="w-4 h-4 rounded-full" alt="social" />
            </div>
          </a>
          <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
              <img src="https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true" className="w-4 h-4 rounded-full" alt="social" />
            </div>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
