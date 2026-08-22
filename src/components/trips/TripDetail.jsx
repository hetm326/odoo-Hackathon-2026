import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTrip, deleteTripById } from '../../redux/slices/tripSlice';
import { formatDate, formatCurrency, calculateSpentPercentage, getStatusBadgeColor, getTripStatus } from '../../utils/helpers';
import { Card, Badge, Button, LoadingSpinner } from '../LoadingComponents';
import { ItineraryBuilder } from '../itinerary/ItineraryBuilder';
import { BudgetBreakdown } from '../budget/BudgetBreakdown';
import { ActivitySearch } from '../search/ActivitySearch';
import { MapPin, Calendar, DollarSign, Share2, Trash2, ArrowLeft, Layers, PieChart, Sparkles, Search } from 'lucide-react';

export const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { trips, selectedTrip, loading } = useSelector((state) => state.trips);
  const [activeTab, setActiveTab] = useState('itinerary'); // 'overview' | 'itinerary' | 'budget' | 'activities'

  useEffect(() => {
    if (id) {
      dispatch(setSelectedTrip(id));
    }
  }, [id, dispatch, trips]);

  const trip = selectedTrip || trips.find(t => t.id === id);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-white">Trip Not Found</h2>
        <Link to="/trips">
          <Button variant="primary">Return to My Trips</Button>
        </Link>
      </div>
    );
  }

  const effectiveStatus = getTripStatus(trip.startDate, trip.endDate, trip.status);
  const spentPercent = calculateSpentPercentage(trip.spentBudget, trip.totalBudget);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${trip.title}"?`)) {
      dispatch(deleteTripById(trip.id));
      navigate('/trips');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Back & Actions Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/trips')}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Trips</span>
        </button>

        <div className="flex items-center space-x-3">
          <Link to={`/trips/share/${trip.id}`}>
            <Button variant="secondary" size="sm" className="space-x-1.5 text-xs">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Trip</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-rose-400 hover:bg-rose-500/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="h-64 sm:h-80 relative">
          <img
            src={trip.coverImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Floating Pill */}
          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getStatusBadgeColor(effectiveStatus)}`}>
            {effectiveStatus}
          </span>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow">{trip.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 text-brand-300 font-semibold">
                <MapPin className="w-4 h-4 text-brand-400" />
                {trip.destination}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-400" />
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                {formatCurrency(trip.spentBudget)} / {formatCurrency(trip.totalBudget)} Budget
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Workspace Tabs */}
      <div className="border-b border-slate-800 flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'itinerary', label: 'Itinerary Planner', icon: Layers },
          { id: 'budget', label: 'Budget & Expenses', icon: PieChart },
          { id: 'activities', label: 'Activity Finder', icon: Search },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Views */}
      <div className="pt-2">
        {activeTab === 'itinerary' && <ItineraryBuilder trip={trip} />}
        {activeTab === 'budget' && <BudgetBreakdown trip={trip} />}
        {activeTab === 'activities' && <ActivitySearch trip={trip} />}
      </div>
    </div>
  );
};
export default TripDetail;
