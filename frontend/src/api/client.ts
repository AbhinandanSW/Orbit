import axios from "axios";

export const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("orbit_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !location.pathname.startsWith("/login") && !location.pathname.startsWith("/verify")) {
      localStorage.removeItem("orbit_token");
      location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export type User = { id: number; email: string; name: string; role: string; verified: boolean };
export type Brand = { id: number; name: string; color: string; initials: string };
export type Post = {
  id: number; brand_id: number; caption: string;
  platforms: string[]; media_urls: string[];
  scheduled_at: string | null; published_at: string | null;
  status: string; engagement: number; reach: number;
};
export type Connection = { id: number; brand_id: number; platform: string; handle: string; connected_at: string };
