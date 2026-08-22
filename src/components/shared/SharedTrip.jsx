import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { Card, Badge, Button } from '../LoadingComponents';
import { ItineraryView } from '../itinerary/ItineraryView';
import { Compass, MapPin, Calendar, DollarSign, Share2, Copy, Check } from 'lucide-react';

export const SharedTrip = () => {
  const { id } = useParams();
  const trips = useSelector((state) => state.trips.trips);
  const trip = trips.find((t) => t.id === id) || trips[0];

  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!trip) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-white">Trip Not Found</h2>
        <Link to="/"><Button variant="primary">Go Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Public Share Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-brand-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Share2 className="w-5 h-5 text-brand-400" />
          <span className="text-xs font-semibold text-slate-200">Public Shared Itinerary Link</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy} className="space-x-1.5 text-xs">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
        </Button>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="h-72 relative">
          <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <Badge variant="brand">Shared Trip</Badge>
            <h1 className="text-3xl font-black text-white">{trip.title}</h1>
            <p className="text-xs text-brand-300 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-400" />
              {trip.destination} | {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Itinerary Schedule */}
      <ItineraryView trip={trip} />
    </div>
  );
};
export default SharedTrip;
