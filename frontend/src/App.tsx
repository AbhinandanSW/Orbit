import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Shell from "./screens/Shell";
import Login from "./screens/Login";
import Verify from "./screens/Verify";
import Dashboard from "./screens/Dashboard";
import Composer from "./screens/Composer";
import Library from "./screens/Library";
import Calendar from "./screens/Calendar";
import Performance from "./screens/Performance";
import Settings from "./screens/Settings";
import { Autopilot, Goals, Assistant, Automations, Predict, Dna } from "./screens/Stub";

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="orbit" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Shell>{children}</Shell>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/compose" element={<Protected><Composer /></Protected>} />
          <Route path="/library" element={<Protected><Library /></Protected>} />
          <Route path="/calendar" element={<Protected><Calendar /></Protected>} />
          <Route path="/performance" element={<Protected><Performance /></Protected>} />
          <Route path="/settings" element={<Protected><Settings /></Protected>} />
          <Route path="/autopilot" element={<Protected><Autopilot /></Protected>} />
          <Route path="/goals" element={<Protected><Goals /></Protected>} />
          <Route path="/assistant" element={<Protected><Assistant /></Protected>} />
          <Route path="/automations" element={<Protected><Automations /></Protected>} />
          <Route path="/predict" element={<Protected><Predict /></Protected>} />
          <Route path="/dna" element={<Protected><Dna /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
