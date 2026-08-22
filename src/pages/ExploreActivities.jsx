import React, { useEffect, useState } from "react";
import { Search, Plus, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchApi, absoluteUrl, getApiError } from "../services/api";

export default function ExploreActivities() {
  const navigate = useNavigate();
  const [q,setQ]=useState("");
  const [list,setList]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ const timer=setTimeout(()=>{setLoading(true);searchApi.activities({search:q}).then(r=>setList(r.data||[])).catch(e=>alert(getApiError(e))).finally(()=>setLoading(false));},250);return()=>clearTimeout(timer);},[q]);
  return <div><div className="hero-head"><div><span className="eyebrow">MAKE IT MEMORABLE</span><h1>Find activities</h1><p>Discover experiences for every stop on your journey.</p></div></div>
    <div className="explore-search"><Search size={20}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search activities, cities or interests..."/></div>
    {loading?<div className="empty-state"><p>Loading activities...</p></div>:<div className="activity-grid">{list.map(a=><article className="activity-card-large" key={a.id}><img src={absoluteUrl(a.imageUrl) || "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=80"} alt={a.name}/><div className="activity-large-body"><div className="activity-type">{a.type || "ACTIVITY"}</div><h3>{a.name}</h3><p>{a.city?.name || ""} · {a.durationMinutes || 0} min</p><div className="activity-footer"><span><Star size={15} fill="currentColor"/> Backend</span><strong>₹{Number(a.estimatedCost||0).toLocaleString("en-IN")}</strong><button className="icon-btn" onClick={()=>navigate("/trips/create")}><Plus size={17}/></button></div></div></article>)}</div>}
  </div>;
}
