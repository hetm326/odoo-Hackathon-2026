import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addStopToItinerary } from '../../redux/slices/tripSlice';
import { SAMPLE_ACTIVITIES } from '../../utils/constants';
import { formatCurrency, getCategoryMeta, generateId } from '../../utils/helpers';
import { Card, Button, Badge, Input } from '../LoadingComponents';
import { Search, Clock, Plus, Compass, Sparkles, CheckCircle } from 'lucide-react';

export const ActivitySearch = ({ trip }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [targetDay, setTargetDay] = useState(1);
  const [addedIds, setAddedIds] = useState([]);

  const filteredActivities = SAMPLE_ACTIVITIES.filter((act) => {
    const matchesQuery = act.title.toLowerCase().includes(query.toLowerCase()) || act.city.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCategory === 'All' || act.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const handleAddActivity = (act) => {
    if (!trip) return;

    const stop = {
      id: generateId(),
      time: act.time || '11:00 AM',
      title: act.title,
      category: act.category,
      cost: act.cost,
    };

    dispatch(addStopToItinerary({
      tripId: trip.id,
      dayNumber: Number(targetDay) || 1,
      stop: stop,
    }));

    setAddedIds((prev) => [...prev, act.id]);
  };

  return (
    <div className="space-y-6">
      {/* Top Search Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search tours, museum, food tasting..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto">
          {['All', 'sightseeing', 'food', 'activity'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize shrink-0 ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {trip && (
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-semibold text-slate-300">Target Day:</span>
            <select
              value={targetDay}
              onChange={(e) => setTargetDay(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-brand-400 font-bold focus:ring-2 focus:ring-brand-500"
            >
              {Array.from({ length: 7 }).map((_, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  Day {idx + 1}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Activity Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActivities.map((act) => {
          const meta = getCategoryMeta(act.category);
          const isAdded = addedIds.includes(act.id);
          return (
            <Card key={act.id} className="flex items-center justify-between p-4 space-x-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${meta.bg}`}>
                    {meta.label}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {act.duration}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">{act.title}</h4>
                <p className="text-xs font-semibold text-emerald-400">{formatCurrency(act.cost)}</p>
              </div>

              {trip && (
                <Button
                  variant={isAdded ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => handleAddActivity(act)}
                  disabled={isAdded}
                  className="shrink-0 space-x-1"
                >
                  {isAdded ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Trip</span>
                    </>
                  )}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default ActivitySearch;
