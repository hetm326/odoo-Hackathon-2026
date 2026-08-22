import React, { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

import Layout from "./components/Layout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MyTrips from "./pages/MyTrips";
import CreateTrip from "./pages/CreateTrip";
import Itinerary from "./pages/Itinerary";
import Budget from "./pages/Budget";
import CalendarPage from "./pages/CalendarPage";
import ExploreCities from "./pages/ExploreCities";
import ExploreActivities from "./pages/ExploreActivities";
import SharedTrip from "./pages/SharedTrip";
import Profile from "./pages/Profile";

function Protected() {
  const [ready, setReady] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("gt_token");
    const loggedIn =
      localStorage.getItem("gt_logged_in") === "true";

    setLogged(Boolean(token) || loggedIn);
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shared/:id" element={<SharedTrip />} />

        {/* PROTECTED ROUTES */}
        <Route element={<Protected />}>
          <Route path="/" element={<Layout />}>
            {/* Default */}
            <Route
              index
              element={<Navigate to="/dashboard" replace />}
            />

            {/* Dashboard */}
            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            {/* Trips */}
            <Route
              path="trips"
              element={<MyTrips />}
            />

            <Route
              path="trips/create"
              element={<CreateTrip />}
            />

            <Route
              path="trips/:id"
              element={<Itinerary />}
            />

            <Route
              path="trips/:id/itinerary"
              element={<Itinerary />}
            />

            {/* Budget */}
            <Route
              path="trips/:id/budget"
              element={<Budget />}
            />

            {/* Calendar */}
            <Route
              path="trips/:id/calendar"
              element={<CalendarPage />}
            />

            {/* Explore */}
            <Route
              path="explore/cities"
              element={<ExploreCities />}
            />

            <Route
              path="explore/activities"
              element={<ExploreActivities />}
            />

            {/* Profile */}
            <Route
              path="profile"
              element={<Profile />}
            />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </AppProvider>
  );
}