import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTrip } from '../../redux/slices/tripSlice';
import { BudgetBreakdown } from './BudgetBreakdown';
import { Select, Card, Button } from '../LoadingComponents';
import { PieChart, MapPin, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BudgetPage = () => {
  const dispatch = useDispatch();
  const { trips, selectedTrip } = useSelector((state) => state.trips);

  const activeTrip = selectedTrip || trips[0];

  const handleTripChange = (e) => {
    dispatch(setSelectedTrip(e.target.value));
  };

  if (trips.length === 0) {
    return (
      <Card className="text-center py-16 space-y-4">
        <PieChart className="w-12 h-12 text-brand-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Trips Available</h2>
        <p className="text-xs text-slate-400">Create a trip to start tracking expenses and budget breakdowns.</p>
        <Link to="/trips/new">
          <Button variant="primary">Create Trip</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Trip Selector Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <PieChart className="w-6 h-6 text-brand-400" />
            <span>Budget & Expense Analytics</span>
          </h1>
          <p className="text-xs text-slate-400">Track spending, category allocations, and budget alerts</p>
        </div>

        {/* Trip Selector Dropdown */}
        <div className="w-full sm:w-72">
          <Select
            label="Select Trip to Analyze"
            value={activeTrip?.id || ''}
            onChange={handleTripChange}
            options={trips.map((t) => ({
              value: t.id,
              label: `${t.destination} (${t.title.length > 20 ? t.title.substring(0, 20) + '...' : t.title})`,
            }))}
          />
        </div>
      </div>

      {activeTrip && <BudgetBreakdown trip={activeTrip} />}
    </div>
  );
};
export default BudgetPage;
