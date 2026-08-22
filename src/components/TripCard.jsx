import React from "react";
import { CalendarDays, MapPin, ArrowUpRight, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { absoluteUrl } from "../services/api";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const cover = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

function statusOf(trip) {
  const end = new Date(`${trip.endDate}T23:59:59`);
  return end < new Date() ? "completed" : "planning";
}

export default function TripCard({ trip, compact = false }) {
  const navigate = useNavigate();
  const status = statusOf(trip);
  const total = Number(trip.budget?.totalBudget || 0);
  const activities = (trip.stops || []).reduce((n, s) => n + (s.activities?.length || 0), 0);

  return (
    <article className={`trip-card ${compact ? "compact" : ""}`}>
      <div className="trip-image">
        <img src={absoluteUrl(trip.coverPhotoUrl) || cover} alt={trip.name} />
        <span className={`status ${status}`}>{status}</span>
        <button className="image-arrow" onClick={() => navigate(`/trips/${trip.id}`)}><ArrowUpRight size={18}/></button>
      </div>
      <div className="trip-card-body">
        <div className="trip-title-row">
          <div>
            <h3>{trip.name}</h3>
            <p>{trip.stops?.length || 0} destinations · {activities} activities</p>
          </div>
        </div>
        <div className="trip-meta">
          <span><CalendarDays size={15}/>{trip.startDate} — {trip.endDate}</span>
          <span><MapPin size={15}/>{trip.stops?.map(s => s.city?.name).filter(Boolean).join(" · ") || "No cities yet"}</span>
          <span><Wallet size={15}/>{money(total)}</span>
        </div>
        <button className="btn btn-secondary full" onClick={() => navigate(`/trips/${trip.id}`)}>View trip</button>
      </div>
    </article>
  );
}
