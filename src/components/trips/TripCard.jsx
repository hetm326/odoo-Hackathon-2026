import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteTripById, setSelectedTrip } from '../../redux/slices/tripSlice';
import { formatCurrency, formatDate, calculateSpentPercentage, getStatusBadgeColor } from '../../utils/helpers';
import { Card, Badge, Button } from '../LoadingComponents';
import { Calendar, DollarSign, MapPin, Trash2, Eye, Share2, ArrowRight } from 'lucide-react';

export const TripCard = ({ trip }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!trip) return null;

  const spentPercent = calculateSpentPercentage(trip.spentBudget, trip.totalBudget);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${trip.title}"?`)) {
      dispatch(deleteTripById(trip.id));
    }
  };

  const handleCardClick = () => {
    dispatch(setSelectedTrip(trip.id));
    navigate(`/trips/${trip.id}`);
  };

  return (
    <Card className="group p-0 overflow-hidden border-slate-800 hover:border-brand-500/40 transition-all flex flex-col h-full">
      {/* Cover Image */}
      <div className="h-48 relative overflow-hidden bg-slate-900">
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'}
          alt={trip.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Status Pill */}
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getStatusBadgeColor(trip.status)}`}>
          {trip.status}
        </span>

        {/* Delete Quick Button */}
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/60 text-slate-400 hover:text-rose-400 hover:bg-slate-950 transition opacity-0 group-hover:opacity-100"
          title="Delete Trip"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-lg font-bold text-white leading-tight drop-shadow truncate">{trip.title}</h3>
          <p className="text-xs text-brand-300 flex items-center gap-1 mt-0.5 font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>{trip.destination}</span>
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center text-xs text-slate-300 gap-2">
            <Calendar className="w-4 h-4 text-brand-400 shrink-0" />
            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>

          {/* Budget Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Budget Spent</span>
              <span className={spentPercent > 90 ? 'text-rose-400' : 'text-brand-400'}>
                {formatCurrency(trip.spentBudget)} / {formatCurrency(trip.totalBudget)} ({spentPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  spentPercent > 90
                    ? 'bg-rose-500'
                    : spentPercent > 75
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-brand-500 to-ocean-500'
                }`}
                style={{ width: `${spentPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <Link to={`/trips/${trip.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full space-x-1.5 text-xs">
              <Eye className="w-3.5 h-3.5" />
              <span>View Itinerary</span>
            </Button>
          </Link>
          <Link to={`/trips/share/${trip.id}`}>
            <Button variant="ghost" size="sm" className="p-2 text-slate-400 hover:text-white">
              <Share2 className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
export default TripCard;
