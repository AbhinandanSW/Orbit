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
export type Connection = {
  id: number; brand_id: number; platform: string; handle: string; connected_at: string;
  external_account_id?: string | null;
  token_expires_at?: string | null;
  status?: string;
};

export type GoalMetric = "reach" | "engagement_rate" | "posts_published" | "saves" | "clicks";
export type GoalStatus = "achieved" | "on_track" | "at_risk" | "off_track";

export type Goal = {
  id: number; user_id: number; title: string; metric: GoalMetric;
  target_value: number; period_start: string; period_end: string;
  brand_id: number | null; platform: string | null; created_at: string;
};

export type GoalProgress = {
  goal_id: number; current: number; target: number; percent: number;
  forecast: number; status: GoalStatus;
  series: { date: string; actual: number }[];
  period_start: string; period_end: string; days_left: number;
  goal?: { id: number; title: string; metric: GoalMetric; target_value: number; brand_id: number | null; platform: string | null; period_start: string; period_end: string };
};

export type ChatMessage = { role: "user" | "assistant"; content: string };
