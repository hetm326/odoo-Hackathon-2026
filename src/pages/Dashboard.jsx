import React, { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, MapPin, Plus, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TripCard from "../components/TripCard";
import StatCard from "../components/StatCard";
import { dashboardApi, absoluteUrl, getApiError } from "../services/api";

const money = n => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { dashboardApi.get().then(r => setDashboard(r.data)).catch(e => alert(getApiError(e, "Unable to load dashboard."))).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="empty-state"><p>Loading dashboard...</p></div>;
  const trips = dashboard?.recentTrips || [];
  const cities = dashboard?.recommendedCities || [];
  const count = Number(dashboard?.budgetHighlights?.tripCount || trips.length);
  const destinations = trips.reduce((n,t)=>n+(t.stops?.length || 0),0);

  return <div>
    <div className="hero-head"><div><span className="eyebrow">YOUR TRAVEL DASHBOARD</span><h1>{dashboard?.welcomeMessage || "Welcome back"} <span>👋</span></h1><p>Ready to plan your next unforgettable adventure?</p></div><button className="btn btn-primary" onClick={()=>navigate("/trips/create")}><Plus size={18}/> Plan new trip</button></div>
    <div className="stats-grid"><StatCard icon={<MapPin/>} label="My trips" value={count} hint="Created journeys"/><StatCard icon={<CalendarDays/>} label="Destinations" value={destinations} hint="Across recent trips"/><StatCard icon={<Wallet/>} label="Budget" value={money(0)} hint="Set budgets per trip"/><StatCard icon={<CheckCircle2/>} label="Account" value="Active" hint="JWT authenticated"/></div>
    <section className="section-head"><div><h2>Recent journeys</h2><p>Your latest travel plans.</p></div><button className="text-btn" onClick={()=>navigate("/trips")}>View all <ArrowRight size={16}/></button></section>
    {trips.length ? <div className="trip-grid">{trips.slice(0,2).map(t=><TripCard key={t.id} trip={t}/>)}</div> : <div className="empty-state card"><h3>No trips yet</h3><p>Create your first trip to see it here.</p><button className="btn btn-primary" onClick={()=>navigate("/trips/create")}>Create trip</button></div>}
    <section className="section-head mt"><div><h2>Get inspired</h2><p>Popular places from your backend database.</p></div><button className="text-btn" onClick={()=>navigate("/explore/cities")}>Explore all <ArrowRight size={16}/></button></section>
    <div className="destination-grid">{cities.slice(0,4).map(c=><button className="destination-card" key={c.id} onClick={()=>navigate("/explore/cities")}><img src={absoluteUrl(c.imageUrl) || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"} alt={c.name}/><div className="destination-overlay"/><div className="destination-info"><span>{c.country}</span><strong>{c.name}</strong></div></button>)}</div>
  </div>;
}
