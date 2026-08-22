import React from 'react';
import { Card, Badge } from '../LoadingComponents';
import { formatDate, formatCurrency, getCategoryMeta } from '../../utils/helpers';
import { Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';

export const ItineraryView = ({ trip }) => {
  if (!trip || !trip.itineraryDays) return null;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-white">{trip.title} - Full Schedule</h2>
        <p className="text-xs text-slate-400">Complete day-by-day travel breakdown</p>
      </div>

      <div className="space-y-8">
        {trip.itineraryDays.map((dayData) => (
          <Card key={dayData.day} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-400" />
                <span>Day {dayData.day}: {dayData.title}</span>
              </h3>
              <Badge variant="brand">{dayData.stops?.length || 0} Activities</Badge>
            </div>

            <div className="space-y-3">
              {dayData.stops && dayData.stops.length > 0 ? (
                dayData.stops.map((stop, i) => {
                  const meta = getCategoryMeta(stop.category);
                  return (
                    <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-brand-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {stop.time}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${meta.bg}`}>
                            {meta.label}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white">{stop.title}</h4>
                      </div>
                      {stop.cost > 0 && (
                        <span className="text-xs font-bold text-emerald-400">{formatCurrency(stop.cost)}</span>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 italic">No stops scheduled for this day.</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default ItineraryView;
