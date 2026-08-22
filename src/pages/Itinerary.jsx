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

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Itinerary() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);

  const [cityOpen, setCityOpen] = useState(false);
  const [activityStop, setActivityStop] = useState(null);

  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(null);
  const [shareUrl, setShareUrl] = useState("");

  // =========================
  // NORMALIZE API RESPONSE
  // =========================
  const getArray = (data) => {
    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.content)) {
      return data.content;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    return [];
  };

  // =========================
  // LOAD TRIP DATA
  // =========================
  const load = async () => {
    try {
      setLoading(true);

      const [tripResponse, citiesResponse, activitiesResponse] =
        await Promise.all([
          tripApi.get(id),
          searchApi.cities(""),
          searchApi.activities({}),
        ]);

      setTrip(tripResponse.data);

      setCities(getArray(citiesResponse.data));

      setActivities(getArray(activitiesResponse.data));
    } catch (error) {
      console.error("Load error:", error);

      alert(
        getApiError(
          error,
          "Unable to load trip."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD BUDGET
  // =========================
  const loadBudget = async () => {
    try {
      const response = await tripApi.getBudget(id);
      setBudget(response.data);
    } catch (error) {
      console.log("Budget not available:", error);
      setBudget(null);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    if (id) {
      load();
      loadBudget();
    }
  }, [id]);

  // =========================
  // AVAILABLE CITIES
  // =========================
  const availableCities = useMemo(() => {
    if (!Array.isArray(cities)) return [];

    const existingCityIds = (trip?.stops || [])
      .map((stop) => stop?.city?.id)
      .filter(Boolean);

    return cities.filter(
      (city) => !existingCityIds.includes(city.id)
    );
  }, [cities, trip]);

  // =========================
  // ACTIVITY TOTAL
  // =========================
  const activityTotal = useMemo(() => {
    return (trip?.stops || []).reduce(
      (total, stop) => {
        const stopTotal = (stop.activities || []).reduce(
          (sum, item) => {
            return (
              sum +
              Number(
                item?.estimatedCost ??
                  item?.activity?.estimatedCost ??
                  0
              )
            );
          },
          0
        );

        return total + stopTotal;
      },
      0
    );
  }, [trip]);

  const totalBudget = Number(
    budget?.totalBudget ??
      budget?.budget ??
      budget?.amount ??
      0
  );

  // =========================
  // ADD DESTINATION
  // =========================
 const addStop = async (city) => {
  try {
    const order = (trip?.stops?.length || 0) + 1;

    const payload = {
      cityId: city.id,
      startDate: trip.startDate,
      endDate: trip.endDate,
      stopOrder: order,
    };

    console.log("ADD STOP URL:", `/trips/${id}/stops`);
    console.log("ADD STOP PAYLOAD:", payload);
    console.log("TRIP DATA:", trip);

    const response = await tripApi.addStop(id, payload);

    console.log("ADD STOP SUCCESS:", response.data);

    setCityOpen(false);
    await load();
  } catch (error) {
    console.error("ADD STOP ERROR:", error.response?.data || error);

    const backendData = error.response?.data;

    if (backendData?.errors) {
      alert(JSON.stringify(backendData.errors, null, 2));
    } else if (backendData?.message) {
      alert(backendData.message);
    } else {
      alert(getApiError(error, "Unable to add destination."));
    }
  }
};

  // =========================
  // REMOVE DESTINATION
  // =========================
  const removeStop = async (stopId) => {
    const confirmed = window.confirm(
      "Remove this destination?"
    );

    if (!confirmed) return;

    try {
      await tripApi.deleteStop(id, stopId);

      await load();
    } catch (error) {
      alert(
        getApiError(
          error,
          "Unable to remove destination."
        )
      );
    }
  };

  // =========================
  // ADD ACTIVITY
  // =========================
  const addActivity = async (stop, activity) => {
    try {
      if (!stop?.id || !activity?.id) {
        alert("Invalid activity selected.");
        return;
      }

      const activityOrder =
        (stop.activities?.length || 0) + 1;

      const data = {
        activityId: activity.id,
        activityDate:
          stop.startDate || trip.startDate,
        startTime: "10:00:00",
        estimatedCost:
          activity.estimatedCost || 0,
        activityOrder: activityOrder,
      };

      console.log("Adding activity:", data);

      await tripApi.addActivity(
        id,
        stop.id,
        data
      );

      setActivityStop(null);

      await load();
    } catch (error) {
      console.error(
        "Add activity error:",
        error?.response?.data || error
      );

      alert(
        getApiError(
          error,
          "Unable to add activity."
        )
      );
    }
  };

  // =========================
  // REMOVE ACTIVITY
  // =========================
  const removeActivity = async (activityId) => {
    const confirmed = window.confirm(
      "Remove this activity?"
    );

    if (!confirmed) return;

    try {
      await tripApi.deleteActivity(
        id,
        activityId
      );

      await load();
    } catch (error) {
      alert(
        getApiError(
          error,
          "Unable to remove activity."
        )
      );
    }
  };

  // =========================
  // SHARE TRIP
  // =========================
  const shareTrip = async () => {
    try {
      await tripApi.share(id);

      const response =
        await publicApi.createShare(id);

      const token =
        response.data?.token ||
        response.data?.shareToken;

      if (token) {
        setShareUrl(
          `${window.location.origin}/shared/${token}`
        );
      } else {
        alert("Trip shared successfully.");
      }

      await load();
    } catch (error) {
      alert(
        getApiError(
          error,
          "Unable to share trip."
        )
      );
    }
  };

  // =========================
  // FILTER ACTIVITIES BY CITY
  // =========================
  const cityActivities = useMemo(() => {
    if (!Array.isArray(activities)) return [];

    const cityId = activityStop?.city?.id;

    if (!cityId) return activities;

    return activities.filter(
      (activity) =>
        activity?.city?.id === cityId ||
        activity?.cityId === cityId
    );
  }, [activities, activityStop]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="empty-state">
        <p>Loading itinerary...</p>
      </div>
    );
  }

  // =========================
  // TRIP NOT FOUND
  // =========================
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

  // =========================
  // JSX
  // =========================
  return (
    <div>
      {/* HEADER */}
      <div className="trip-detail-head">
        <div>
          <button
            className="back-btn"
            onClick={() => navigate("/trips")}
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <span className="eyebrow">
              ITINERARY BUILDER
            </span>

            <h1>{trip.name}</h1>

            <p>
              <CalendarDays size={15} />
              {" "}
              {trip.startDate} — {trip.endDate}
            </p>
          </div>
        </div>

        <div className="head-actions">
          <button
            className="btn btn-secondary"
            onClick={shareTrip}
          >
            <Share2 size={17} />
            Share
          </button>

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

      {/* SHARE URL */}
      {shareUrl && (
        <div
          className="card"
          style={{ margin: "15px 0" }}
        >
          <strong>Share link: </strong>

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

      {/* SUMMARY */}
      <div className="trip-summary-grid">
        <div className="summary-main">
          <div className="summary-route">
            <span className="summary-label">
              YOUR ROUTE
            </span>

            <div className="route">
              {trip.stops?.length ? (
                trip.stops.map((stop, index) => (
                  <React.Fragment key={stop.id}>
                    <strong>
                      {stop.city?.name}
                    </strong>

                    {index <
                      trip.stops.length - 1 && (
                      <span>→</span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span>
                  Add your first destination
                </span>
              )}
            </div>
          </div>

          <div className="summary-numbers">
            <div>
              <span>Destinations</span>
              <strong>
                {trip.stops?.length || 0}
              </strong>
            </div>

            <div>
              <span>Activities</span>
              <strong>
                {(trip.stops || []).reduce(
                  (total, stop) =>
                    total +
                    (stop.activities?.length || 0),
                  0
                )}
              </strong>
            </div>

            <div>
              <span>Activity cost</span>
              <strong>
                {money(activityTotal)}
              </strong>
            </div>

            <div>
              <span>Budget</span>
              <strong>
                {money(totalBudget)}
              </strong>
            </div>
          </div>
        </div>

        {/* BUDGET CARD */}
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

          <strong>
            {money(totalBudget)}
          </strong>

          <div className="progress">
            <span
              style={{
                width: `${Math.min(
                  100,
                  (activityTotal /
                    Math.max(totalBudget, 1)) *
                    100
                )}%`,
              }}
            />
          </div>

          <small>
            {totalBudget
              ? `${Math.round(
                  (activityTotal / totalBudget) *
                    100
                )}% used by activities`
              : "Set a budget to track spending"}
          </small>
        </button>
      </div>

      {/* DAY BY DAY PLAN */}
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

          {/* EMPTY */}
          {!trip.stops?.length && (
            <div className="empty-state card">
              <MapPin size={28} />

              <h3>
                Your itinerary is empty
              </h3>

              <p>
                Start by adding a city.
              </p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  setCityOpen(true)
                }
              >
                Add first destination
              </button>
            </div>
          )}

          {/* STOPS */}
          {trip.stops?.map(
            (stop, index) => (
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

                    <h3>
                      {stop.city?.name}
                    </h3>

                    <p>
                      <CalendarDays size={14} />
                      {" "}
                      {stop.startDate} —{" "}
                      {stop.endDate}
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

                {/* ACTIVITIES */}
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
                            {stopActivity.activity
                              ?.type || "Activity"}
                            {" · "}
                            {stopActivity.activity
                              ?.durationMinutes || 0}{" "}
                            min
                          </span>
                        </div>

                        <strong className="activity-cost">
                          {money(
                            stopActivity.estimatedCost ??
                              stopActivity.activity
                                ?.estimatedCost
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
                    Add activity to{" "}
                    {stop.city?.name}
                  </button>
                </div>
              </div>
            )
          )}
        </section>
      </div>

      {/* ADD CITY MODAL */}
      <Modal
        open={cityOpen}
        title="Add a destination"
        onClose={() => setCityOpen(false)}
      >
        <p className="modal-sub">
          Choose a city from the backend.
        </p>

        <div className="modal-list">
          {availableCities.length > 0 ? (
            availableCities.map((city) => (
              <button
                className="select-card"
                key={city.id}
                onClick={() =>
                  addStop(city)
                }
              >
                <div>
                  <strong>
                    {city.name}
                  </strong>

                  <span>
                    {city.country}
                    {city.region
                      ? ` · ${city.region}`
                      : ""}
                  </span>
                </div>

                <Plus size={18} />
              </button>
            ))
          ) : (
            <div className="empty-state">
              <p>
                No more cities available.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* ADD ACTIVITY MODAL */}
      <Modal
        open={!!activityStop}
        title={`Activities in ${
          activityStop?.city?.name || ""
        }`}
        onClose={() =>
          setActivityStop(null)
        }
      >
        <div className="modal-list">
          {cityActivities.length > 0 ? (
            cityActivities.map(
              (activity) => (
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
                    <strong>
                      {activity.name}
                    </strong>

                    <span>
                      {activity.type ||
                        "Activity"}
                      {" · "}
                      {activity.durationMinutes ||
                        0} min
                      {" · "}
                      {money(
                        activity.estimatedCost
                      )}
                    </span>
                  </div>

                  <Plus size={18} />
                </button>
              )
            )
          ) : (
            <div className="empty-state">
              <p>
                No activities available for this city.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}