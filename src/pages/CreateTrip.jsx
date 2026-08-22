import React, { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, ImagePlus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { tripApi, getApiError } from "../services/api";

export default function CreateTrip() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [form, setForm] = useState({ name:"", startDate:"", endDate:"", description:"" });
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const update = e => setForm(f => ({...f, [e.target.name]: e.target.value}));

  const submit = async (e) => {
    e.preventDefault();
    if (form.endDate < form.startDate) return alert("End date cannot be before start date.");
    setLoading(true);
    try {
      const { data: trip } = await tripApi.create(form);
      if (cover) await tripApi.uploadCover(trip.id, cover);
      navigate(`/trips/${trip.id}`);
    } catch (error) { alert(getApiError(error, "Unable to create trip.")); }
    finally { setLoading(false); }
  };

  return <div className="center-page">
    <div className="page-title"><button className="back-btn" onClick={()=>navigate(-1)}><ArrowLeft size={18}/></button><div><span className="eyebrow">NEW JOURNEY</span><h1>Create your trip</h1><p>Start with the basics. Add cities and activities next.</p></div></div>
    <div className="stepper"><div className="step active"><b>1</b><span>Trip details</span></div><div className="step"><b>2</b><span>Destinations</span></div><div className="step"><b>3</b><span>Activities</span></div><div className="step"><b>4</b><span>Review</span></div></div>
    <form className="form-card" onSubmit={submit}>
      <div className="form-card-head"><div className="round-icon"><Sparkles/></div><div><h2>Tell us about your trip</h2><p>Give your journey a name and choose your travel dates.</p></div></div>
      <div className="form-grid">
        <div className="field full-field"><label>Trip name</label><input className="text-input" name="name" placeholder="e.g. Europe Adventure" value={form.name} onChange={update} required/></div>
        <div className="field"><label>Start date</label><div className="input-icon"><CalendarDays size={17}/><input name="startDate" type="date" value={form.startDate} onChange={update} required/></div></div>
        <div className="field"><label>End date</label><div className="input-icon"><CalendarDays size={17}/><input name="endDate" type="date" value={form.endDate} onChange={update} required/></div></div>
        <div className="field full-field"><label>Description <span>Optional</span></label><textarea name="description" placeholder="What are you hoping to experience?" value={form.description} onChange={update}/></div>
        <div className="cover-upload full-field"><ImagePlus size={22}/><div><strong>{cover ? cover.name : "Add a cover photo"}</strong><span>Optional · JPG or PNG</span></div><button type="button" className="btn btn-secondary" onClick={()=>fileRef.current?.click()}>Choose image</button><input ref={fileRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setCover(e.target.files?.[0] || null)}/></div>
      </div>
      <div className="form-actions"><button type="button" className="btn btn-ghost" onClick={()=>navigate(-1)}>Cancel</button><button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Creating..." : "Create trip"} {!loading && <ArrowRight size={17}/>}</button></div>
    </form>
  </div>;
}
