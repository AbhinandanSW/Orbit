import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../lib/icons";
import { useAuth } from "../auth/AuthContext";

export default function Verify() {
  const loc = useLocation();
  const nav = useNavigate();
  const { verify } = useAuth();
  const email = (loc.state as any)?.email ?? "";
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await verify(email, code);
      nav("/");
    } catch (e: any) {
      setErr(e.response?.data?.detail ?? "Invalid code");
    } finally { setBusy(false); }
  };

  return (
    <div className="orbit" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ maxWidth: 440, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--coral)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: 18 }}>O</div>
          <div style={{ fontWeight: 600, fontSize: 17 }}>Orbit</div>
        </div>
        <div style={{ fontSize: 11, color: "var(--muted-2)", letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 14 }}>Verify account</div>
        <h2 className="display" style={{ fontSize: 48, margin: 0, lineHeight: 1 }}>Check your inbox.</h2>
        <p style={{ fontSize: 14, color: "var(--fg-dim)", marginTop: 16, lineHeight: 1.6 }}>
          We sent a 6-digit code to <span style={{ color: "var(--fg)" }}>{email || "your email"}</span>. Dev code: <code className="mono" style={{ color: "var(--lime)" }}>000000</code>.
        </p>
        <form onSubmit={submit} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <input autoFocus value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" className="mono" style={{
            padding: "18px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--line)",
            borderRadius: 10, color: "var(--fg)", fontSize: 24, letterSpacing: 12, textAlign: "center", outline: "none",
          }} />
          {err && <div style={{ fontSize: 12.5, color: "#FF7A7A" }}>{err}</div>}
          <button type="submit" className="btn primary" disabled={busy || code.length !== 6} style={{ justifyContent: "center", padding: 14 }}>
            {busy ? "..." : "Verify & continue"} <Icon.Arrow size={16} />
          </button>
          <button type="button" onClick={() => nav("/login")} className="btn ghost" style={{ justifyContent: "center" }}>Back</button>
        </form>
      </div>
    </div>
  );
}
