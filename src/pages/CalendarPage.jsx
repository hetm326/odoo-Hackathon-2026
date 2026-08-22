import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { tripApi, getApiError } from "../services/api";
export default function CalendarPage(){
 const {id}=useParams();const navigate=useNavigate();const [trip,setTrip]=useState(null);const [loading,setLoading]=useState(true);
 useEffect(()=>{tripApi.get(id).then(r=>setTrip(r.data)).catch(e=>alert(getApiError(e))).finally(()=>setLoading(false));},[id]);
 const days=useMemo(()=>{const rows=[];(trip?.stops||[]).forEach(s=>(s.activities||[]).forEach(a=>rows.push({city:s.city?.name,name:a.activity?.name,date:a.activityDate||s.startDate,time:a.startTime||"10:00"})));return rows.sort((a,b)=>String(a.date).localeCompare(String(b.date)));},[trip]);
 if(loading)return <div className="empty-state"><p>Loading calendar...</p></div>;
 return <div><div className="page-title"><button className="back-btn" onClick={()=>navigate(`/trips/${id}`)}><ArrowLeft size={18}/></button><div><span className="eyebrow">TRAVEL TIMELINE</span><h1>Trip calendar</h1><p>See your complete journey at a glance.</p></div></div><div className="timeline card">{days.length?days.map((d,i)=><div className="timeline-row" key={`${d.date}-${d.name}-${i}`}><div className="timeline-date"><strong>{String(d.date||"--").slice(8,10)}</strong><span>{String(d.date||"").slice(5,7)}</span></div><div className="timeline-line"><span/></div><div className="timeline-content"><span>{d.time}</span><strong>{d.name}</strong><p><MapPin size={14}/>{d.city}</p></div></div>):<div className="empty-state"><CalendarDays size={30}/><h3>No activities yet</h3><p>Add activities to your itinerary to see them here.</p></div>}</div></div>;
}
