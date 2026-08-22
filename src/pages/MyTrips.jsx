import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TripCard from "../components/TripCard";
import { tripApi, getApiError } from "../services/api";

const statusOf = (trip) => {
  if (!trip?.endDate) return "planning";

  const endDate = new Date(`${trip.endDate}T23:59:59`);

  return endDate < new Date() ? "completed" : "planning";
};

export default function MyTrips() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");

  const loadTrips = async () => {
    try {
      setLoading(true);

      const response = await tripApi.getAll();
      const data = response.data;

      console.log("Trips API response:", data);

      // Backend normal array return करे
      if (Array.isArray(data)) {
        setTrips(data);
      }

      // Spring Boot Page response
      else if (Array.isArray(data?.content)) {
        setTrips(data.content);
      }

      // Common wrapped response: { data: [...] }
      else if (Array.isArray(data?.data)) {
        setTrips(data.data);
      }

      // Common wrapped response: { trips: [...] }
      else if (Array.isArray(data?.trips)) {
        setTrips(data.trips);
      }

      // कोई valid array नहीं मिला
      else {
        console.warn("Unexpected trips response:", data);
        setTrips([]);
      }

    } catch (error) {
      console.error("Unable to load trips:", error);
      console.error("API error response:", error?.response?.data);

      setTrips([]);

      alert(
        getApiError(
          error,
          "Unable to load trips."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const filtered = useMemo(() => {
    // Extra safety: कभी trips array न हो तो empty array use होगा
    if (!Array.isArray(trips)) {
      return [];
    }

    return trips.filter((trip) => {
      const stops = Array.isArray(trip?.stops)
        ? trip.stops
        : [];

      const cityNames = stops
        .map((stop) => stop?.city?.name || "")
        .join(" ");

      const text = `
        ${trip?.name || ""}
        ${trip?.description || ""}
        ${cityNames}
      `.toLowerCase();

      const matchesTab =
        tab === "all" ||
        statusOf(trip) === tab;

      const matchesSearch = text.includes(
        q.toLowerCase()
      );

      return matchesTab && matchesSearch;
    });
  }, [trips, tab, q]);

  return (
    <div>
      {/* HEADER */}
      <div className="hero-head">
        <div>
          <span className="eyebrow">
            YOUR JOURNEYS
          </span>

          <h1>My trips</h1>

          <p>
            Every plan, memory, and adventure in one place.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/trips/create")}
        >
          <Plus size={18} />
          Plan new trip
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar">
        <div className="tabs">
          <button
            className={tab === "all" ? "selected" : ""}
            onClick={() => setTab("all")}
          >
            All
          </button>

          <button
            className={tab === "planning" ? "selected" : ""}
            onClick={() => setTab("planning")}
          >
            Planning
          </button>

          <button
            className={tab === "completed" ? "selected" : ""}
            onClick={() => setTab("completed")}
          >
            Completed
          </button>
        </div>

        <div className="search-small">
          <Search size={16} />

          <input
            placeholder="Search trips..."
            value={q}
            onChange={(event) =>
              setQ(event.target.value)
            }
          />
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="empty-state">
          <p>Loading your trips...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="trip-grid">
          {filtered.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No trips found</h3>

          <p>
            Start planning your first adventure.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/trips/create")}
          >
            <Plus size={17} />
            Plan new trip
          </button>
        </div>
      )}
    </div>
  );
}