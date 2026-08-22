import React from 'react';
import { Clock, MapPin, CheckCircle } from 'lucide-react';
import { formatCurrency, getCategoryMeta } from '../../utils/helpers';

export const Timeline = ({ stops = [] }) => {
  if (stops.length === 0) {
    return <p className="text-xs text-slate-500 py-4 text-center">No activities on timeline.</p>;
  }

  return (
    <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
      {stops.map((stop, idx) => {
        const meta = getCategoryMeta(stop.category);
        return (
          <div key={stop.id || idx} className="relative">
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-brand-400" />
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-brand-400">{stop.time}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{stop.title}</h4>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${meta.bg}`}>
                {meta.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Timeline;
