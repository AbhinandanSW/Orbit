import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type User, type Brand } from "../api/client";

type Ctx = {
  user: User | null;
  brands: Brand[];
  activeBrand: Brand | null;
  setActiveBrand: (b: Brand) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  verify: (email: string, code: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeBrand, setActiveBrandState] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  const setActiveBrand = (b: Brand) => {
    setActiveBrandState(b);
    localStorage.setItem("orbit_active_brand", String(b.id));
  };

  const refresh = async () => {
    if (!localStorage.getItem("orbit_token")) { setLoading(false); return; }
    try {
      const { data } = await api.get("/me");
      setUser(data.user);
      setBrands(data.brands);
      const savedId = Number(localStorage.getItem("orbit_active_brand") || 0);
      const saved = data.brands.find((b: Brand) => b.id === savedId) || data.brands[0];
      setActiveBrandState(saved || null);
    } catch {
      localStorage.removeItem("orbit_token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("orbit_token", data.access_token);
    await refresh();
  };

  const signup = async (email: string, password: string, name: string) => {
    await api.post("/auth/signup", { email, password, name });
  };

  const verify = async (email: string, code: string) => {
    const { data } = await api.post("/auth/verify", { email, code });
    localStorage.setItem("orbit_token", data.access_token);
    await refresh();
  };

  const logout = () => {
    localStorage.removeItem("orbit_token");
    localStorage.removeItem("orbit_active_brand");
    setUser(null); setBrands([]); setActiveBrandState(null);
    location.href = "/login";
  };

  return (
    <AuthCtx.Provider value={{ user, brands, activeBrand, setActiveBrand, loading, login, signup, verify, logout, refresh }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
