import React from "react";
import LogoHeading from "../brand/LogoHeading";
import { Caption } from "../typography";

const Footer = () => (
  <footer className="bg-gray-800 py-10 border-t border-gray-700">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div className="mb-8 md:mb-0">
          <LogoHeading size={1.5} />
          <Caption>The ultimate CS2 Pro-POV library</Caption>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-6">
          <div>
            <h3 className="text-white font-bold mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Maps
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Players
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Events
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
        <Caption size="xs" className="text-gray-500 mb-4 md:mb-0">
          © 2025 POVlib.gg - All rights reserved
        </Caption>
        <div className="flex space-x-4">
          <a
            href="#"
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
              <img
                src="https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true"
                className="w-4 h-4 rounded-full"
                alt="social"
              />
            </div>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
              <img
                src="https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true"
                className="w-4 h-4 rounded-full"
                alt="social"
              />
            </div>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
              <img
                src="https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true"
                className="w-4 h-4 rounded-full"
                alt="social"
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
