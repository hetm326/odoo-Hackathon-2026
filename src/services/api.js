import axios from "axios";

// Backend API Base URL
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("gt_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================
api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Logout only for unauthorized protected APIs
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/")
    ) {
      localStorage.removeItem("gt_token");
      localStorage.removeItem("gt_user");
      localStorage.removeItem("gt_logged_in");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ===============================
// AUTH API
// ===============================
export const authApi = {
  login: (data) => api.post("/auth/login", data),

  signup: (data) => api.post("/auth/signup", data),

  forgotPassword: (data) =>
    api.post("/auth/forgot-password", data),

  resetPassword: (data) =>
    api.post("/auth/reset-password", data),
};

// ===============================
// TRIP API
// ===============================
export const tripApi = {
  // Get all trips
  getAll: () => api.get("/trips"),

  // Get single trip
  get: (id) => api.get(`/trips/${id}`),

  // Create trip
  create: (data) => api.post("/trips", data),

  // Update trip
  update: (id, data) =>
    api.put(`/trips/${id}`, data),

  // Delete trip
  delete: (id) =>
    api.delete(`/trips/${id}`),

  // ===============================
  // TRIP STOPS
  // ===============================

  addStop: (tripId, data) =>
    api.post(`/trips/${tripId}/stops`, data),

  deleteStop: (tripId, stopId) =>
    api.delete(`/trips/${tripId}/stops/${stopId}`),

  // ===============================
  // TRIP ACTIVITIES
  // ===============================

  addActivity: (tripId, stopId, data) =>
    api.post(
      `/trips/${tripId}/stops/${stopId}/activities`,
      data
    ),

  deleteActivity: (tripId, activityId) =>
    api.delete(
      `/trips/${tripId}/activities/${activityId}`
    ),

  // ===============================
  // EXPENSES
  // ===============================

  addExpense: (tripId, data) =>
    api.post(`/trips/${tripId}/expenses`, data),

  // ===============================
  // BUDGET
  // ===============================

  getBudget: (tripId) =>
    api.get(`/trips/${tripId}/budget`),

  saveBudget: (tripId, data) =>
    api.put(`/trips/${tripId}/budget`, data),

  // ===============================
  // SHARE
  // ===============================

  share: (tripId) =>
    api.post(`/trips/${tripId}/share`),

  // ===============================
  // COVER IMAGE
  // ===============================

  uploadCover: (tripId, file) => {
    const formData = new FormData();

    formData.append("file", file);

    return api.post(
      `/trips/${tripId}/cover`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};

// ===============================
// DASHBOARD API
// ===============================
export const dashboardApi = {
  get: () => api.get("/dashboard"),
};

// ===============================
// PROFILE API
// ===============================
export const profileApi = {
  get: () => api.get("/users/profile"),

  update: (data) =>
    api.put("/users/profile", data),

  delete: () =>
    api.delete("/users/profile"),
};

// ===============================
// SEARCH API
// ===============================
export const searchApi = {
  // Search cities
  cities: (search = "") =>
    api.get("/cities", {
      params: {
        search,
      },
    }),

  // Search activities
  activities: ({
    cityId,
    search = "",
    type,
  } = {}) =>
    api.get("/activities", {
      params: {
        cityId,
        search,
        type,
      },
    }),
};

// ===============================
// PUBLIC / SHARE API
// ===============================
export const publicApi = {
  createShare: (tripId) =>
    api.post(`/public/trips/${tripId}/share`),

  getSharedTrip: (token) =>
    api.get(`/public/trips/${token}`),
};

// ===============================
// ERROR HELPER
// ===============================
export const getApiError = (
  error,
  fallback = "Something went wrong"
) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    (typeof error?.response?.data === "string"
      ? error.response.data
      : null) ||
    error?.message ||
    fallback
  );
};

// ===============================
// ABSOLUTE URL HELPER
// ===============================
export const absoluteUrl = (value) => {
  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  // Remove /api from API base
  const origin = API_BASE.replace(/\/api\/?$/, "");

  return `${origin}${
    value.startsWith("/")
      ? value
      : `/${value}`
  }`;
};

// ===============================
// DEFAULT EXPORT
// ===============================
export default api;