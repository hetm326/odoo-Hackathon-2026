import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Plus,
  Share2,
  Trash2,
  Wallet,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import {
  tripApi,
  searchApi,
  publicApi,
  getApiError,
} from "../services/api";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function Itinerary() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);

  const [cityOpen, setCityOpen] = useState(false);
  const [activityStop, setActivityStop] = useState(null);

  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState("");
  const [budget, setBudget] = useState(null);

  // Load trip, cities and activities
  const load = async () => {
    try {
      setLoading(true);

      const [{ data: tripData }, { data: citiesData }, { data: activitiesData }] =
        await Promise.all([
          tripApi.get(id),
          searchApi.cities(""),
          searchApi.activities({}),
        ]);

      setTrip(tripData);
      setCities(citiesData || []);
      setActivities(activitiesData || []);
    } catch (error) {
      alert(getApiError(error, "Unable to load trip."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  // Load trip budget
  useEffect(() => {
    if (!id) return;

    tripApi
      .getBudget(id)
      .then((response) => {
        setBudget(response.data);
      })
      .catch(() => {
        setBudget(null);
      });
  }, [id]);

  // Cities not already added to trip
  const availableCities = useMemo(() => {
    return cities.filter(
      (city) =>
        !(trip?.stops || []).some(
          (stop) => stop.city?.id === city.id
        )
    );
  }, [cities, trip]);

  // Calculate total activity cost
  const activityTotal = useMemo(() => {
    return (trip?.stops || []).reduce(
      (total, stop) =>
        total +
        (stop.activities || []).reduce(
          (activityTotal, activity) =>
            activityTotal +
            Number(
              activity.estimatedCost ||
                activity.activity?.estimatedCost ||
                0
            ),
          0
        ),
      0
    );
  }, [trip]);

  const totalBudget = Number(budget?.totalBudget || 0);

  const budgetPercentage = totalBudget
    ? Math.min(100, (activityTotal / totalBudget) * 100)
    : 0;

  // Add destination
  const addStop = async (city) => {
    try {
      const order = (trip.stops?.length || 0) + 1;

      await tripApi.addStop(id, {
        cityId: city.id,
        startDate: trip.startDate,
        endDate: trip.endDate,
        stopOrder: order,
      });

      setCityOpen(false);
      await load();
    } catch (error) {
      alert(getApiError(error, "Unable to add destination."));
    }
  };

  // Remove destination
  const removeStop = async (stopId) => {
    if (!window.confirm("Remove this destination?")) return;

    try {
      await tripApi.deleteStop(id, stopId);
      await load();
    } catch (error) {
      alert(getApiError(error));
    }
  };

  // Add activity
  const addActivity = async (stop, activity) => {
    try {
      await tripApi.addActivity(id, stop.id, {
        activityId: activity.id,
        activityDate: stop.startDate,
        startTime: "10:00:00",
        estimatedCost: activity.estimatedCost,
        activityOrder: (stop.activities?.length || 0) + 1,
      });

      setActivityStop(null);
      await load();
    } catch (error) {
      alert(getApiError(error, "Unable to add activity."));
    }
  };

  // Remove activity
  const removeActivity = async (activityId) => {
    if (!window.confirm("Remove this activity?")) return;

    try {
      await tripApi.deleteActivity(id, activityId);
      await load();
    } catch (error) {
      alert(getApiError(error));
    }
  };

  // Share trip
  const share = async () => {
    try {
      await tripApi.share(id);

      const { data } = await publicApi.createShare(id);

      setShareUrl(
        `${window.location.origin}/shared/${data.token}`
      );

      await load();
    } catch (error) {
      alert(getApiError(error, "Unable to share trip."));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="empty-state">
        <p>Loading itinerary...</p>
      </div>
    );
  }

  // Trip not found
  if (!trip) {
    return (
      <div className="empty-state">
        <h2>Trip not found</h2>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/trips")}
        >
          Back to trips
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ================= HEADER ================= */}
      <div className="trip-detail-head">
        <div>
          <button
            className="back-btn"
            onClick={() => navigate("/trips")}
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <span className="eyebrow">ITINERARY BUILDER</span>

            <h1>{trip.name}</h1>

            <p>
              <CalendarDays size={15} />
              {trip.startDate} — {trip.endDate}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="head-actions">

          {/* Share */}
          <button
            className="btn btn-secondary"
            onClick={share}
          >
            <Share2 size={17} />
            Share
          </button>

          {/* Calendar - NEW */}
          <button
            className="btn btn-secondary"
            onClick={() =>
              navigate(`/trips/${id}/calendar`)
            }
          >
            <CalendarDays size={17} />
            Calendar
          </button>

          {/* Budget */}
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`/trips/${id}/budget`)
            }
          >
            <Wallet size={17} />
            Budget
          </button>
        </div>
      </div>

      {/* ================= SHARE LINK ================= */}
      {shareUrl && (
        <div
          className="card"
          style={{ margin: "15px 0" }}
        >
          <strong>Share link:</strong>{" "}

          <a
            href={shareUrl}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#2563eb" }}
          >
            {shareUrl}
          </a>
        </div>
      )}

      {/* ================= TRIP SUMMARY ================= */}
      <div className="trip-summary-grid">

        <div className="summary-main">

          {/* Route */}
          <div className="summary-route">
            <span className="summary-label">
              YOUR ROUTE
            </span>

            <div className="route">
              {trip.stops?.length ? (
                trip.stops.map((stop, index) => (
                  <React.Fragment key={stop.id}>
                    <strong>{stop.city?.name}</strong>

                    {index < trip.stops.length - 1 && (
                      <span>→</span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span>Add your first destination</span>
              )}
            </div>
          </div>

          {/* Numbers */}
          <div className="summary-numbers">

            <div>
              <span>Destinations</span>
              <strong>{trip.stops?.length || 0}</strong>
            </div>

            <div>
              <span>Activities</span>

              <strong>
                {trip.stops?.reduce(
                  (total, stop) =>
                    total +
                    (stop.activities?.length || 0),
                  0
                )}
              </strong>
            </div>

            <div>
              <span>Activity cost</span>
              <strong>{money(activityTotal)}</strong>
            </div>

            <div>
              <span>Budget</span>
              <strong>{money(totalBudget)}</strong>
            </div>

          </div>
        </div>

        {/* Budget Overview */}
        <button
          className="budget-mini"
          onClick={() =>
            navigate(`/trips/${id}/budget`)
          }
        >
          <div>
            <Wallet size={19} />
            <span>Budget overview</span>
          </div>

          <strong>{money(totalBudget)}</strong>

          <div className="progress">
            <span
              style={{
                width: `${budgetPercentage}%`,
              }}
            />
          </div>

          <small>
            {totalBudget
              ? `${Math.round(
                  (activityTotal / totalBudget) * 100
                )}% used by activities`
              : "Set a budget to track spending"}
          </small>
        </button>

      </div>

      {/* ================= ITINERARY ================= */}
      <div className="builder-layout">

        <section>

          <div className="section-head">
            <div>
              <h2>Day-by-day plan</h2>

              <p>
                Add destinations and activities
                from the backend database.
              </p>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => setCityOpen(true)}
            >
              <Plus size={17} />
              Add destination
            </button>
          </div>

          {/* Empty itinerary */}
          {!trip.stops?.length && (
            <div className="empty-state card">
              <MapPin size={28} />

              <h3>Your itinerary is empty</h3>

              <p>Start by adding a city.</p>

              <button
                className="btn btn-primary"
                onClick={() => setCityOpen(true)}
              >
                Add first destination
              </button>
            </div>
          )}

          {/* Stops */}
          {trip.stops?.map((stop, index) => (
            <div
              className="stop-card"
              key={stop.id}
            >

              <div className="stop-head">

                <div className="stop-number">
                  {index + 1}
                </div>

                <div>
                  <span className="eyebrow">
                    {stop.city?.country}
                  </span>

                  <h3>{stop.city?.name}</h3>

                  <p>
                    <CalendarDays size={14} />
                    {stop.startDate} — {stop.endDate}
                  </p>
                </div>

                <button
                  className="icon-btn danger"
                  onClick={() =>
                    removeStop(stop.id)
                  }
                >
                  <Trash2 size={17} />
                </button>

              </div>

              {/* Activities */}
              <div className="activity-list">

                {stop.activities?.map(
                  (stopActivity) => (
                    <div
                      className="activity-row"
                      key={stopActivity.id}
                    >

                      <div className="activity-time">
                        <Clock3 size={14} />

                        <span>
                          {stopActivity.startTime ||
                            "10:00"}
                        </span>
                      </div>

                      <div className="activity-dot" />

                      <div className="activity-info">
                        <strong>
                          {stopActivity.activity?.name}
                        </strong>

                        <span>
                          {stopActivity.activity?.type}
                          {" · "}
                          {stopActivity.activity
                            ?.durationMinutes || 0} min
                        </span>
                      </div>

                      <strong className="activity-cost">
                        {money(
                          stopActivity.estimatedCost
                        )}
                      </strong>

                      <button
                        className="icon-btn danger"
                        onClick={() =>
                          removeActivity(
                            stopActivity.id
                          )
                        }
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>
                  )
                )}

                <button
                  className="add-activity"
                  onClick={() =>
                    setActivityStop(stop)
                  }
                >
                  <Plus size={16} />
                  Add activity to {stop.city?.name}
                </button>

              </div>
            </div>
          ))}

        </section>
      </div>

      {/* ================= ADD CITY MODAL ================= */}
      <Modal
        open={cityOpen}
        title="Add a destination"
        onClose={() => setCityOpen(false)}
      >

        <p className="modal-sub">
          Choose a city from the Java backend.
        </p>

        <div className="modal-list">

          {availableCities.map((city) => (
            <button
              className="select-card"
              key={city.id}
              onClick={() => addStop(city)}
            >

              <div>
                <strong>{city.name}</strong>

                <span>
                  {city.country}
                  {" · "}
                  {city.region || ""}
                </span>
              </div>

              <Plus size={18} />

            </button>
          ))}

        </div>
      </Modal>

      {/* ================= ADD ACTIVITY MODAL ================= */}
      <Modal
        open={!!activityStop}
        title={`Activities in ${
          activityStop?.city?.name || ""
        }`}
        onClose={() => setActivityStop(null)}
      >

        <div className="modal-list">

          {activities
            .filter(
              (activity) =>
                !activityStop?.city?.id ||
                activity.city?.id ===
                  activityStop.city.id
            )
            .map((activity) => (
              <button
                className="select-card"
                key={activity.id}
                onClick={() =>
                  addActivity(
                    activityStop,
                    activity
                  )
                }
              >

                <div>
                  <strong>{activity.name}</strong>

                  <span>
                    {activity.type}
                    {" · "}
                    {activity.durationMinutes || 0} min
                    {" · "}
                    {money(activity.estimatedCost)}
                  </span>
                </div>

                <Plus size={18} />

              </button>
            ))}

        </div>

        {!activities.some(
          (activity) =>
            activity.city?.id ===
            activityStop?.city?.id
        ) && (
          <div className="empty-state">
            <p>
              No activities for this city.
            </p>
          </div>
        )}

      </Modal>
    </div>
  );
}