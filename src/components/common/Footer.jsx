import React from 'react';
import { Compass, Heart, Github, Twitter, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-6 h-6 text-brand-400" />
            <span className="text-lg font-black text-white tracking-tight">GlobeTrotter</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your all-in-one travel planner, budget analyzer, and itinerary builder designed for seamless adventures worldwide.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Product</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#dashboard" className="hover:text-brand-400">Trip Planner</a></li>
            <li><a href="#itinerary" className="hover:text-brand-400">Itinerary Builder</a></li>
            <li><a href="#budget" className="hover:text-brand-400">Budget Analytics</a></li>
            <li><a href="#cities" className="hover:text-brand-400">City Finder</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Resources</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#" className="hover:text-brand-400">Documentation</a></li>
            <li><a href="#" className="hover:text-brand-400">API Access</a></li>
            <li><a href="#" className="hover:text-brand-400">Travel Guides</a></li>
            <li><a href="#" className="hover:text-brand-400">Community</a></li>
          </ul>
        </div>

        {/* Newsletter / Social */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Stay Connected</h4>
          <p className="text-xs text-slate-400">Get curated destination guides & travel tips.</p>
          <div className="flex items-center space-x-3">
            <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} GlobeTrotter Inc. All rights reserved.</p>
        <p className="flex items-center space-x-1 mt-2 sm:mt-0">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for globetrotters around the world.</span>
        </p>
      </div>
    </footer>
  );
};
export default Footer;
