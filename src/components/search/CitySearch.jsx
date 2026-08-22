import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/customHooks';
import { POPULAR_DESTINATIONS } from '../../utils/constants';
import { Card, Badge, Button, Input } from '../LoadingComponents';
import { Search, MapPin, Globe, Sparkles, Sun, DollarSign, ArrowRight } from 'lucide-react';

export const CitySearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm, 300);
  const [selectedTag, setSelectedTag] = useState('All');

  const filteredCities = POPULAR_DESTINATIONS.filter((city) => {
    const matchesQuery =
      city.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      city.description.toLowerCase().includes(debouncedQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || city.tag.includes(selectedTag);
    return matchesQuery && matchesTag;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Search Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-slate-800 p-8 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>City Discovery Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Find Your Next Destination</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Explore global travel hubs with weather guides, average daily budgets, and top attraction recommendations.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative pt-2">
          <Search className="w-5 h-5 absolute left-4 top-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search city, country (e.g. Paris, Japan, Bali)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xl"
          />
        </div>
      </div>

      {/* Filter Tags */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {['All', 'Cultural', 'Island', 'Tech', 'Urban', 'Beach'].map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedTag === tag
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* City Results Grid */}
      {filteredCities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <Card key={city.id} className="group p-0 overflow-hidden relative flex flex-col justify-between">
              <div className="h-52 relative overflow-hidden bg-slate-900">
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
                  <h3 className="text-xl font-bold text-white">{city.name}</h3>
                  <p className="text-xs text-slate-300">{city.country}</p>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 leading-relaxed">{city.description}</p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      {city.weather}
                    </span>
                    <span className="font-bold text-brand-400">Avg ${city.avgCostPerDay}/day</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="w-full space-x-2"
                  onClick={() => navigate(`/trips/new?destination=${encodeURIComponent(`${city.name}, ${city.country}`)}`)}
                >
                  <span>Plan Trip to {city.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 space-y-3">
          <Globe className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Cities Found</h3>
          <p className="text-xs text-slate-400">Try searching for another destination.</p>
        </Card>
      )}
    </div>
  );
};
export default CitySearch;
