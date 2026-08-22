import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, MapPin, Calendar, PieChart, Search, Sparkles, UserCheck } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: Compass },
    { name: 'My Travel Catalog', path: '/trips', icon: MapPin },
    { name: 'Itinerary Planner', path: '/itinerary', icon: Calendar },
    { name: 'City Finder', path: '/cities', icon: Search },
    { name: 'Expense & Budget', path: '/budget', icon: PieChart },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-slate-800/80 bg-slate-950/60 p-4 space-y-6">
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation Hub</h3>
      </div>
      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-500/20 to-ocean-500/10 text-brand-400 border border-brand-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-slate-800/80">
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-brand-950/40 border border-brand-500/20 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">Smart AI Assistant</h4>
            <p className="text-[11px] text-slate-400 mt-1">Get personalized itinerary recommendations instantly.</p>
          </div>
          <Link
            to="/cities"
            className="block text-xs font-semibold text-brand-400 hover:text-brand-300 underline"
          >
            Explore Suggestions &rarr;
          </Link>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
