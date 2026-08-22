import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrip } from '../../hooks/customHooks';
import { TripCard } from './TripCard';
import { Button, Input, SkeletonLoader, Card } from '../LoadingComponents';
import { MapPin, Plus, Search, Filter, Compass } from 'lucide-react';

export const MyTrips = () => {
  const { trips, loading } = useTrip();
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = trips.filter((trip) => {
    const matchesStatus = filterStatus === 'All' || trip.status === filterStatus;
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">My Travel Catalog</h1>
          <p className="text-xs text-slate-400">View and manage all your past, present, and future itineraries</p>
        </div>

        <Link to="/trips/new">
          <Button variant="primary" size="md" className="space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create New Trip</span>
          </Button>
        </Link>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Upcoming', 'Ongoing', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterStatus === status
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by city or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Trip Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader className="h-72 rounded-2xl" count={6} />
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-brand-400 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Trips Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No trips matching "${searchQuery}". Try another keyword.`
                : `You don't have any ${filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} trips.`}
            </p>
          </div>
          <Link to="/trips/new">
            <Button variant="primary" size="sm">
              Create a New Trip
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};
export default MyTrips;
