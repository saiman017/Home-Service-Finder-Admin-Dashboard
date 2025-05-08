// src/axios/axiosinstance.ts
import axios from "axios";

// pull from .env (CRA requires REACT_APP_ prefix)
const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL, // ← use BASE_URL, not BASR_URL
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const { store } = await import("../store/store");
  const { accessToken } = store.getState().auth;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, Promise.reject);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const { store } = await import("../store/store");
      const { logout } = await import("../store/slice/auth");
      store.dispatch(logout());
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
