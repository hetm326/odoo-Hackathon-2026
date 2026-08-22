import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useTrip } from '../../hooks/customHooks';
import { StatCard, Button, Card, Badge, SkeletonLoader } from '../LoadingComponents';
import { TripCard } from '../trips/TripCard';
import { POPULAR_DESTINATIONS } from '../../utils/constants';
import { formatCurrency, calculateUserStats } from '../../utils/helpers';
import { Compass, MapPin, Calendar, DollarSign, Plus, ArrowRight, Sparkles, Globe, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const { trips, loading } = useTrip();

  // Calculate dynamic stats for currently authenticated user
  const stats = calculateUserStats(trips);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-brand-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="brand" className="space-x-1">
                <Sparkles className="w-3 h-3 text-brand-400" />
                <span>Travel Dashboard</span>
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready for your next adventure, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Traveler'}</span>? ✈️
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              You have <span className="text-brand-400 font-semibold">{stats.upcomingTrips} active & upcoming trips</span> planned. Track itineraries, budgets, and explore cities effortlessly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/trips/new">
              <Button variant="primary" size="md" className="space-x-2">
                <Plus className="w-4 h-4" />
                <span>Plan New Trip</span>
              </Button>
            </Link>
            <Link to="/cities">
              <Button variant="secondary" size="md" className="space-x-2">
                <Globe className="w-4 h-4 text-brand-400" />
                <span>Explore Cities</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Trips Created"
          value={stats.totalTrips}
          icon={MapPin}
          trend={`${stats.upcomingTrips} Active Now`}
        />
        <StatCard
          title="Total Budget Spent"
          value={formatCurrency(stats.totalSpent)}
          icon={DollarSign}
          trend={`Allocated: ${formatCurrency(stats.totalBudget)}`}
        />
        <StatCard
          title="Countries Visited"
          value={stats.countriesVisited}
          icon={Globe}
          trend={stats.countriesVisited > 0 ? `${stats.countriesVisited} Unique Countries` : '0 Countries Visited'}
        />
        <StatCard
          title="Completed Adventures"
          value={stats.completedAdventures}
          icon={Calendar}
          trend={stats.completedAdventures > 0 ? `${stats.completedAdventures} Completed` : '0 Completed'}
        />
      </div>

      {/* Active Trips Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-400" />
              <span>Your Upcoming & Active Trips</span>
            </h2>
            <p className="text-xs text-slate-400">Manage itineraries, expenses, and stop details</p>
          </div>
          <Link to="/trips" className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1">
            <span>View All Trips</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader className="h-64 rounded-2xl" count={3} />
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.slice(0, 3).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 text-brand-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Your journey starts here.</h3>
              <p className="text-xs text-slate-400">Create your first trip to start exploring destinations and managing budgets.</p>
            </div>
            <Link to="/trips/new">
              <Button variant="primary" size="sm">
                Create Your First Trip
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Destination Inspiration */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-ocean-400" />
              <span>Popular Travel Destinations</span>
            </h2>
            <p className="text-xs text-slate-400">Handpicked top spots for your next journey</p>
          </div>
          <Link to="/cities" className="text-xs font-bold text-ocean-400 hover:text-ocean-300 flex items-center gap-1">
            <span>Explore All Cities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {POPULAR_DESTINATIONS.slice(0, 3).map((city) => (
            <Card key={city.id} className="group p-0 overflow-hidden relative">
              <div className="h-44 overflow-hidden relative">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <Badge variant="purple" className="absolute top-3 right-3">
                  ★ {city.rating}
                </Badge>
                <div className="absolute bottom-3 left-4">
                  <h4 className="text-lg font-bold text-white">{city.name}</h4>
                  <p className="text-xs text-slate-300">{city.country}</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-400 line-clamp-2">{city.description}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                  <span className="text-brand-400 font-semibold">Avg ${city.avgCostPerDay}/day</span>
                  <Link to={`/cities?q=${city.name}`}>
                    <Button variant="ghost" size="sm" className="text-xs py-1 px-2 text-brand-400">
                      View Details &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
