import axios from "axios";

// Environment variable handling for Vite
const baseURL = import.meta.env.VITE_API_URL || "/api";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle global errors
axiosInstance.interceptors.response.use(
  (response) => {
    // In our backend, responses are wrapped in ApiResponse { success, message, data }
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response?.data || error.message);
  }
);
