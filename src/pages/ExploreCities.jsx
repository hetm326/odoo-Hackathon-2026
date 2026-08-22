import React, { useEffect, useState } from "react";
import { Search, Plus, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchApi, absoluteUrl, getApiError } from "../services/api";

export default function ExploreCities() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const timer=setTimeout(()=>{ setLoading(true); searchApi.cities(q).then(r=>setList(r.data||[])).catch(e=>alert(getApiError(e))).finally(()=>setLoading(false)); },250); return ()=>clearTimeout(timer); }, [q]);
  return <div><div className="hero-head"><div><span className="eyebrow">DISCOVER THE WORLD</span><h1>Explore cities</h1><p>Find your next destination and add it to a journey.</p></div></div>
    <div className="explore-search"><Search size={20}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by city or country..."/></div>
    {loading ? <div className="empty-state"><p>Searching...</p></div> : <div className="explore-grid">{list.map(c=><article className="explore-card" key={c.id}><img src={absoluteUrl(c.imageUrl) || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80"} alt={c.name}/><div className="explore-card-body"><div className="card-location"><MapPin size={14}/>{c.country}</div><h3>{c.name}</h3><p>{c.region || ""} · {c.costIndex ?? "-"} cost index · {c.popularity ?? "-"}% popular</p><button className="btn btn-secondary full" onClick={()=>navigate("/trips/create")}><Plus size={16}/> Create a trip</button></div></article>)}</div>}
  </div>;
}
