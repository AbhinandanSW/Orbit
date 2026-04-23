import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, Platform, PlatformBg } from "../lib/icons";
import { Spark } from "../lib/shared";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("demo@orbit.app");
  const [password, setPassword] = useState("demo1234");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, signup } = useAuth();
  const nav = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      if (mode === "login") {
        await login(email, password);
        nav("/");
      } else {
        await signup(email, password, name || email.split("@")[0]);
        nav("/verify", { state: { email } });
      }
    } catch (e: any) {
      setErr(e.response?.data?.detail ?? "Something went wrong");
    } finally { setBusy(false); }
  };

  return (
    <div className="orbit" style={{ minHeight: "100vh", display: "flex", overflow: "hidden", position: "relative" }}>
      <div style={{ flex: "1 1 720px", padding: "56px 64px", background: "linear-gradient(135deg, #F3F1EA 0%, #FFFFFF 100%)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--coral)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: 18 }}>O</div>
          <div style={{ fontWeight: 600, letterSpacing: -0.3, fontSize: 17 }}>Orbit</div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div>
            <div className="chip coral" style={{ marginBottom: 22 }}>
              <span className="dot" style={{ background: "var(--coral)" }} />
              For social teams & agencies
            </div>
            <h1 className="display" style={{ fontSize: 96, margin: 0, color: "var(--fg)" }}>
              One workspace<br/>
              <span style={{ color: "var(--coral)" }}>every</span> channel<br/>
              <span className="upright" style={{ fontStyle: "normal", fontFamily: "Geist, Inter, sans-serif", fontWeight: 500, fontSize: 80, letterSpacing: "-0.05em" }}>one feed.</span>
            </h1>
            <p style={{ fontSize: 17, color: "var(--fg-dim)", maxWidth: 480, marginTop: 28, lineHeight: 1.5 }}>
              Plan, schedule, and measure across Instagram, LinkedIn, YouTube, Threads, and Facebook — for every brand you run.
            </p>
            <div style={{ display: "flex", gap: 24, marginTop: 44, color: "var(--muted)", fontSize: 12.5 }}>
              <div><span style={{ color: "var(--fg)", fontWeight: 600, fontSize: 22, display: "block" }} className="numeral">12k</span> agencies</div>
              <div><span style={{ color: "var(--fg)", fontWeight: 600, fontSize: 22, display: "block" }} className="numeral">4.8M</span> posts/mo</div>
              <div><span style={{ color: "var(--fg)", fontWeight: 600, fontSize: 22, display: "block" }} className="numeral">56</span> countries</div>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", top: 140, right: -40, transform: "rotate(8deg)" }}>
          <div style={{ background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: 14, padding: 14, width: 260, boxShadow: "0 20px 40px rgba(20,20,26,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--muted)" }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, background: PlatformBg.instagram, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Platform.instagram size={11} /></div>
              Instagram · scheduled
            </div>
            <div style={{ fontSize: 13, marginTop: 6 }}>"Summer drop #3 — teaser carousel. Going live Thursday 6pm."</div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 120, right: 60, transform: "rotate(-6deg)" }}>
          <div style={{ background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: 14, padding: 12, width: 220, boxShadow: "0 20px 40px rgba(20,20,26,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, color: "var(--lime)", textTransform: "uppercase", letterSpacing: 1 }}>
              <Icon.ArrowUpRight size={12} /> +48% eng. week
            </div>
            <Spark data={[3,5,4,8,7,12,14,11,16,18]} stroke="#D4FF3A" width={200} height={38} />
          </div>
        </div>

        <div style={{ fontSize: 11.5, color: "var(--muted-2)", display: "flex", gap: 22 }}>
          <span>© 2026 Orbit Labs</span><span>Privacy</span><span>Terms</span><span>Status · All systems go</span>
        </div>
      </div>

      <div style={{ flex: "1 1 520px", padding: "56px 80px", display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--ink)" }}>
        <div style={{ maxWidth: 420, width: "100%", margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: "var(--muted-2)", letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 14 }}>{mode === "login" ? "Sign in" : "Create account"}</div>
          <h2 className="display" style={{ fontSize: 56, margin: 0, color: "var(--fg)", lineHeight: 1 }}>
            {mode === "login" ? "Welcome back." : "Start your orbit."}
          </h2>
          <p style={{ fontSize: 14.5, color: "var(--fg-dim)", marginTop: 16, lineHeight: 1.6 }}>
            {mode === "login"
              ? "Pick up where you left off — your scheduled queue, analytics, and team comments are waiting."
              : "Five seeded brands, an empty calendar, and a blank composer — ready when you are."}
          </p>

          <form onSubmit={submit} style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "signup" && (
              <Field label="Name" value={name} onChange={setName} placeholder="Noor Idris" />
            )}
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.co" />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
            {err && <div style={{ fontSize: 12.5, color: "#FF7A7A" }}>{err}</div>}
            <button type="submit" className="btn primary" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: 14, marginTop: 6 }}>
              {busy ? "..." : mode === "login" ? "Sign in" : "Create account"}
              <Icon.Arrow size={16} />
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "22px 0", fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 1.4 }}>
            <div className="hr" style={{ flex: 1 }} /> or <div className="hr" style={{ flex: 1 }} />
          </div>

          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="btn" style={{ width: "100%", justifyContent: "center", padding: 14 }}>
            {mode === "login" ? "Create a new account" : "I already have an account"}
          </button>

          <div style={{ marginTop: 24, padding: "14px 16px", border: "1px solid var(--line)", borderRadius: 10, background: "rgba(212,255,58,0.04)", display: "flex", gap: 12, alignItems: "center" }}>
            <Icon.Sparkle size={18} style={{ color: "var(--lime)" }} />
            <div style={{ fontSize: 12.5, color: "var(--fg-dim)" }}>
              <span style={{ color: "var(--fg)", fontWeight: 500 }}>Demo:</span> demo@orbit.app / demo1234
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.1 }}>{label}</span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
        padding: "12px 14px", background: "rgba(20,20,26,0.04)", border: "1px solid var(--line)",
        borderRadius: 10, color: "var(--fg)", fontFamily: "inherit", fontSize: 14, outline: "none",
      }} />
    </label>
  );
}
