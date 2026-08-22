import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TripCard from "../components/TripCard";
import { tripApi, getApiError } from "../services/api";

const statusOf = (trip) => new Date(`${trip.endDate}T23:59:59`) < new Date() ? "completed" : "planning";

export default function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");

  const loadTrips = async () => {
    try { setLoading(true); const { data } = await tripApi.getAll(); setTrips(data || []); }
    catch (error) { alert(getApiError(error, "Unable to load trips.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadTrips(); }, []);

  const filtered = useMemo(() => trips.filter((trip) => {
    const text = `${trip.name || ""} ${trip.description || ""} ${(trip.stops || []).map(s => s.city?.name).join(" ")}`.toLowerCase();
    return (tab === "all" || statusOf(trip) === tab) && text.includes(q.toLowerCase());
  }), [trips, tab, q]);

  return <div>
    <div className="hero-head"><div><span className="eyebrow">YOUR JOURNEYS</span><h1>My trips</h1><p>Every plan, memory, and adventure in one place.</p></div><button className="btn btn-primary" onClick={()=>navigate("/trips/create")}><Plus size={18}/> Plan new trip</button></div>
    <div className="toolbar"><div className="tabs"><button className={tab==="all"?"selected":""} onClick={()=>setTab("all")}>All</button><button className={tab==="planning"?"selected":""} onClick={()=>setTab("planning")}>Planning</button><button className={tab==="completed"?"selected":""} onClick={()=>setTab("completed")}>Completed</button></div><div className="search-small"><Search size={16}/><input placeholder="Search trips..." value={q} onChange={e=>setQ(e.target.value)}/></div></div>
    {loading ? <div className="empty-state"><p>Loading your trips...</p></div> : filtered.length ? <div className="trip-grid">{filtered.map(t=><TripCard key={t.id} trip={t}/>)}</div> : <div className="empty-state"><h3>No trips found</h3><p>Start planning your first adventure.</p><button className="btn btn-primary" onClick={()=>navigate("/trips/create")}><Plus size={17}/> Plan new trip</button></div>}
  </div>;
}
