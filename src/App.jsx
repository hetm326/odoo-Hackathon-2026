import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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

function Protected({ children }) {
  const [ready, setReady] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    setLogged(Boolean(localStorage.getItem("gt_token")));
    setReady(true);
  }, []);

  if (!ready) return null;
  return logged ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/shared/:token" element={<SharedTrip />} />

      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trips" element={<MyTrips />} />
        <Route path="/trips/create" element={<CreateTrip />} />
        <Route path="/trips/:id" element={<Itinerary />} />
        <Route path="/trips/:id/itinerary" element={<Itinerary />} />
        <Route path="/trips/:id/budget" element={<Budget />} />
        <Route path="/trips/:id/calendar" element={<CalendarPage />} />
        <Route path="/explore/cities" element={<ExploreCities />} />
        <Route path="/explore/activities" element={<ExploreActivities />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
