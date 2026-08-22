import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createNewTrip } from '../../redux/slices/tripSlice';
import { Input, Select, Button, AlertBanner, Card } from '../LoadingComponents';
import { POPULAR_DESTINATIONS } from '../../utils/constants';
import { Compass, Calendar, DollarSign, Image as ImageIcon, ArrowLeft, Check } from 'lucide-react';

export const CreateTrip = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    totalBudget: 2000,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSelectDestination = (dest) => {
    setFormData({
      ...formData,
      destination: `${dest.name}, ${dest.country}`,
      title: `${dest.name} Getaway & Exploration`,
      coverImage: dest.image,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.destination || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required trip details.');
      return;
    }

    try {
      const created = await dispatch(createNewTrip({
        ...formData,
        totalBudget: Number(formData.totalBudget) || 1000,
        spentBudget: 0,
        status: 'Upcoming',
      })).unwrap();

      navigate(`/trips/${created.id}`);
    } catch {
      setError('Failed to create trip. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">Create New Trip</h1>
          <p className="text-xs text-slate-400">Set destination, budget, dates, and build your schedule</p>
        </div>
      </div>

      {/* Wizard Progress Steps */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        {[
          { num: 1, label: 'Destination & Title' },
          { num: 2, label: 'Dates & Budget' },
          { num: 3, label: 'Cover & Notes' },
        ].map((s) => (
          <div key={s.num} className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s.num
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                  : step > s.num
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {step > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-white' : 'text-slate-500'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        {/* Step 1: Destination & Title */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Quick Select Popular Destinations
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {POPULAR_DESTINATIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleSelectDestination(d)}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                      formData.destination.includes(d.name)
                        ? 'border-brand-500 bg-brand-500/10 text-white'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <img src={d.image} alt={d.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{d.name}</h4>
                      <p className="text-[10px] text-slate-400">{d.country}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Trip Title *"
              type="text"
              name="title"
              placeholder="e.g. Summer Paris Escapade"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <Input
              label="Destination City / Country *"
              type="text"
              name="destination"
              placeholder="e.g. Tokyo, Japan"
              value={formData.destination}
              onChange={handleChange}
              required
            />

            <div className="flex justify-end pt-4">
              <Button type="button" variant="primary" onClick={() => setStep(2)}>
                Next: Dates & Budget &rarr;
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Dates & Budget */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <Input
                label="End Date *"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Total Budget Limit ($ USD) *"
              type="number"
              name="totalBudget"
              placeholder="2500"
              value={formData.totalBudget}
              onChange={handleChange}
              required
            />

            <div className="flex justify-between pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                &larr; Back
              </Button>
              <Button type="button" variant="primary" onClick={() => setStep(3)}>
                Next: Cover & Details &rarr;
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Cover & Notes */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <Input
              label="Cover Image URL"
              type="url"
              name="coverImage"
              placeholder="https://images.unsplash.com/..."
              value={formData.coverImage}
              onChange={handleChange}
            />

            {formData.coverImage && (
              <div className="h-40 rounded-xl overflow-hidden border border-slate-800">
                <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Trip Notes / Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="What are your main goals for this journey?"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                &larr; Back
              </Button>
              <Button type="submit" variant="primary" size="lg">
                🚀 Create & Launch Trip
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
export default CreateTrip;
