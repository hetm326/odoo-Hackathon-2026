import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addStopToItinerary, removeStopFromItinerary } from '../../redux/slices/tripSlice';
import { formatCurrency, getDaysCount, getCategoryMeta, generateId } from '../../utils/helpers';
import { Card, Button, ModalDialog, Input, Select, Badge } from '../LoadingComponents';
import { Plus, Clock, MapPin, Trash2, Calendar, Sparkles, CheckCircle } from 'lucide-react';

export const ItineraryBuilder = ({ trip }) => {
  const dispatch = useDispatch();

  const totalDays = getDaysCount(trip?.startDate, trip?.endDate) || 3;
  const [selectedDay, setSelectedDay] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteStop = (stopId) => {
    dispatch(removeStopFromItinerary({
      tripId: trip.id,
      dayNumber: selectedDay,
      stopId: stopId,
    }));
  };

  const [newStop, setNewStop] = useState({
    time: '10:00 AM',
    title: '',
    category: 'sightseeing',
    cost: 0,
  });

  const itineraryDays = trip?.itineraryDays || [];
  const currentDayData = itineraryDays.find(d => d.day === selectedDay) || {
    day: selectedDay,
    title: `Day ${selectedDay} Schedule`,
    stops: [],
  };

  const handleAddStop = (e) => {
    e.preventDefault();
    if (!newStop.title) return;

    const stop = {
      id: generateId(),
      time: newStop.time,
      title: newStop.title,
      category: newStop.category,
      cost: Number(newStop.cost) || 0,
    };

    dispatch(addStopToItinerary({
      tripId: trip.id,
      dayNumber: selectedDay,
      stop: stop,
    }));

    setNewStop({ time: '10:00 AM', title: '', category: 'sightseeing', cost: 0 });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Days Bar Header */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + 1;
            const isActive = selectedDay === dayNum;
            const dayStops = itineraryDays.find(d => d.day === dayNum)?.stops || [];
            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Day {dayNum}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {dayStops.length}
                </span>
              </button>
            );
          })}
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="space-x-1.5 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add Stop to Day {selectedDay}</span>
        </Button>
      </div>

      {/* Daily Stops Timeline List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <span>Day {selectedDay} Schedule ({currentDayData.stops.length} Stops)</span>
          </h3>
        </div>

        {currentDayData.stops.length > 0 ? (
          <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
            {currentDayData.stops.map((stop, idx) => {
              const meta = getCategoryMeta(stop.category);
              return (
                <div key={stop.id || idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-brand-400 group-hover:bg-brand-500 transition-colors" />

                  <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-brand-400 flex items-center gap-1 bg-brand-500/10 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" />
                          {stop.time}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${meta.bg}`}>
                          {meta.label}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">{stop.title}</h4>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-3">
                      {stop.cost > 0 && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          +{formatCurrency(stop.cost)}
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteStop(stop.id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition"
                        title="Remove Stop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12 space-y-3">
            <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">No stops scheduled for Day {selectedDay} yet.</p>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
              + Add First Activity
            </Button>
          </Card>
        )}
      </div>

      {/* Add Stop Modal */}
      <ModalDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add Stop to Day ${selectedDay}`}>
        <form onSubmit={handleAddStop} className="space-y-4">
          <Input
            label="Time Slot"
            type="text"
            placeholder="e.g. 10:30 AM"
            value={newStop.time}
            onChange={(e) => setNewStop({ ...newStop, time: e.target.value })}
            required
          />

          <Input
            label="Activity Title / Landmark"
            type="text"
            placeholder="e.g. Visit Eiffel Tower & Photo Session"
            value={newStop.title}
            onChange={(e) => setNewStop({ ...newStop, title: e.target.value })}
            required
          />

          <Select
            label="Category"
            value={newStop.category}
            onChange={(e) => setNewStop({ ...newStop, category: e.target.value })}
            options={[
              { value: 'sightseeing', label: 'Sightseeing & Landmark' },
              { value: 'food', label: 'Food & Dining' },
              { value: 'accommodation', label: 'Hotel & Stay' },
              { value: 'activity', label: 'Tour & Activity' },
              { value: 'transport', label: 'Transport & Flight' },
            ]}
          />

          <Input
            label="Estimated Cost ($ USD)"
            type="number"
            placeholder="45"
            value={newStop.cost}
            onChange={(e) => setNewStop({ ...newStop, cost: e.target.value })}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Stop
            </Button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
};
export default ItineraryBuilder;
