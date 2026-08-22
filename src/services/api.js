import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Compass,
  LayoutDashboard,
  Map,
  PlusCircle,
  CalendarDays,
  Wallet,
  Globe2,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

import {
  profileApi,
  tripApi,
  getApiError,
} from "../services/api";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/trips", label: "My Trips", icon: Map },
  { to: "/trips/create", label: "Plan New Trip", icon: PlusCircle },
  { to: "/explore/cities", label: "Explore Cities", icon: Compass },
  { to: "/explore/activities", label: "Activities", icon: Sparkles },
  { type: "calendar", label: "Calendar", icon: CalendarDays },
  { type: "budget", label: "Budget", icon: Wallet },
];

export default function Layout() {
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gt_user")) || {};
    } catch {
      return {};
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    profileApi
      .get()
      .then((response) => setUser(response.data))
      .catch(() => {});
  }, []);

  // ============================
  // OPEN CALENDAR
  // ============================
  const openCalendar = async () => {
    try {
      setOpen(false);

      const response = await tripApi.getAll();

      // Handle normal array or Spring Page response
      const trips = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      if (trips.length === 0) {
        alert("Please create a trip first.");
        navigate("/trips/create");
        return;
      }

      navigate(`/trips/${trips[0].id}/calendar`);
    } catch (error) {
      alert(
        getApiError(
          error,
          "Unable to open calendar."
        )
      );
    }
  };

  // ============================
  // OPEN BUDGET
  // ============================
  const openBudget = async () => {
    try {
      setOpen(false);

      const response = await tripApi.getAll();

      // Handle normal array or Spring Page response
      const trips = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      if (trips.length === 0) {
        alert("Please create a trip first.");
        navigate("/trips/create");
        return;
      }

      navigate(`/trips/${trips[0].id}/budget`);
    } catch (error) {
      alert(
        getApiError(
          error,
          "Unable to open budget."
        )
      );
    }
  };

  // ============================
  // LOGOUT
  // ============================
  const logout = () => {
    localStorage.removeItem("gt_token");
    localStorage.removeItem("gt_user");
    localStorage.removeItem("gt_logged_in");

    navigate("/login", {
      replace: true,
    });
  };

  const initial = (user?.name || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="app-shell">
      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Globe2 size={22} />
          </div>

          <div>
            <strong>GlobeTrotter</strong>
            <span>Travel smarter</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-label">
          WORKSPACE
        </div>

        <nav>
          {nav.map(
            ({
              to,
              type,
              label,
              icon: Icon,
            }, i) => {
              // CALENDAR BUTTON
              if (type === "calendar") {
                return (
                  <button
                    key="calendar"
                    type="button"
                    className="nav-item"
                    onClick={openCalendar}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>
                );
              }

              // BUDGET BUTTON
              if (type === "budget") {
                return (
                  <button
                    key="budget"
                    type="button"
                    className="nav-item"
                    onClick={openBudget}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>
                );
              }

              // NORMAL LINKS
              return (
                <NavLink
                  key={`${label}-${to}`}
                  to={to}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                  onClick={() => setOpen(false)}
                >
                  <Icon size={18} />

                  <span>{label}</span>

                  {i === 2 && (
                    <span className="nav-plus">
                      +
                    </span>
                  )}
                </NavLink>
              );
            }
          )}
        </nav>

        <div className="sidebar-spacer" />

        {/* PROFILE */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          onClick={() => setOpen(false)}
        >
          <User size={18} />
          <span>Profile</span>
        </NavLink>

        {/* LOGOUT */}
        <button
          className="nav-item logout"
          onClick={logout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

        {/* PROMO */}
        <div className="sidebar-promo">
          <div className="promo-icon">
            <Sparkles size={17} />
          </div>

          <strong>Plan without limits</strong>

          <span>
            Build your next unforgettable journey.
          </span>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="main">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>

          <div className="top-search">
            <Compass size={17} />

            <input
              placeholder="Search trips, cities, activities..."
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  navigate("/explore/cities");
                }
              }}
            />
          </div>

          <div className="top-actions">
            <button
              className="icon-btn"
              type="button"
            >
              🔔
            </button>

            <button
              className="profile-mini"
              onClick={() => navigate("/profile")}
            >
              <div className="avatar">
                {initial}
              </div>

              <div className="profile-mini-text">
                <strong>
                  {user?.name || "Traveler"}
                </strong>

                <span>
                  {user?.role || "USER"}
                </span>
              </div>
            </button>
          </div>
        </header>

        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}