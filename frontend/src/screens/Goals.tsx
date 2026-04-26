import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar, ConfirmModal } from "../lib/shared";
import { Icon } from "../lib/icons";
import { api, type GoalProgress, type GoalMetric, type GoalStatus } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const METRIC_LABEL: Record<GoalMetric, string> = {
  reach: "Reach",
  engagement_rate: "Engagement rate",
  posts_published: "Posts published",
  saves: "Saves",
  clicks: "Clicks",
};

const METRIC_UNIT: Record<GoalMetric, string> = {
  reach: "",
  engagement_rate: "%",
  posts_published: "",
  saves: "",
  clicks: "",
};

const STATUS_COLOR: Record<GoalStatus, string> = {
  achieved: "#D4FF3A",
  on_track: "#D4FF3A",
  at_risk: "#FFB84D",
  off_track: "#FF4D8F",
};

const STATUS_LABEL: Record<GoalStatus, string> = {
  achieved: "Achieved",
  on_track: "On track",
  at_risk: "At risk",
  off_track: "Off track",
};

const fmt = (metric: GoalMetric, n: number): string => {
  if (metric === "engagement_rate") return `${n.toFixed(2)}%`;
  if (metric === "posts_published") return String(Math.round(n));
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(Math.round(n));
};

export default function Goals() {
  const { brands } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState<GoalProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const refresh = async () => {
    setLoading(true);
    const { data } = await api.get<GoalProgress[]>("/goals/progress");
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const brandName = (bid: number | null | undefined) =>
    bid ? (brands.find(b => b.id === bid)?.name ?? "Unknown") : "All brands";
  const brandColor = (bid: number | null | undefined) =>
    bid ? (brands.find(b => b.id === bid)?.color ?? "#6B5CFF") : "#6B5CFF";

  const summary = useMemo(() => {
    const counts = { on_track: 0, at_risk: 0, off_track: 0, achieved: 0 };
    items.forEach(i => counts[i.status]++);
    return counts;
  }, [items]);

  const selected = items.find(i => i.goal_id === selectedId) ?? null;

  return (
    <>
      <TopBar title="Goals" sub="Track outcomes, not outputs">
        <div className="chip lime"><span className="dot"/> {summary.on_track + summary.achieved} on track</div>
        {summary.off_track > 0 && <div className="chip" style={{ background: "rgba(255,77,143,0.14)", borderColor: "rgba(255,77,143,0.3)", color: "#FF8DB5" }}>{summary.off_track} off track</div>}
        <button className="btn primary" onClick={() => setShowCreate(true)}><Icon.Plus size={14}/> New goal</button>
      </TopBar>

      <div style={{ padding: "24px 28px 48px" }}>
        {loading ? (
          <div style={{ color: "var(--muted)", fontSize: 13 }}>Loading…</div>
        ) : items.length === 0 ? (
          <EmptyState onCreate={() => setShowCreate(true)} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
            {items.map(it => (
              <GoalCard key={it.goal_id} item={it} brandName={brandName(it.goal?.brand_id)} brandColor={brandColor(it.goal?.brand_id)} onOpen={() => setSelectedId(it.goal_id)} onAsk={(q) => nav(`/assistant?q=${encodeURIComponent(q)}`)} />
            ))}
          </div>
        )}
      </div>

      {showCreate && <CreateDialog onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); refresh(); }} />}
      {selected && <DetailDrawer progress={selected} brandName={brandName(selected.goal?.brand_id)} brandColor={brandColor(selected.goal?.brand_id)} onClose={() => setSelectedId(null)} onDeleted={() => { setSelectedId(null); refresh(); }} onAsk={(q) => nav(`/assistant?q=${encodeURIComponent(q)}`)} />}
    </>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="card" style={{ padding: 48, textAlign: "center", background: "linear-gradient(135deg, rgba(212,255,58,0.08), transparent)", borderColor: "rgba(212,255,58,0.2)" }}>
      <Icon.Crown size={28} style={{ color: "var(--lime)" }} />
      <div className="display" style={{ fontSize: 36, lineHeight: 1.05, marginTop: 12 }}>Set your first target.</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 10, maxWidth: 440, marginInline: "auto", lineHeight: 1.5 }}>
        Pick a metric, pick a date — Orbit forecasts whether you'll hit it using your last 30 days of pace.
      </div>
      <button className="btn primary" style={{ marginTop: 20 }} onClick={onCreate}><Icon.Plus size={14}/> New goal</button>
    </div>
  );
}

function GoalCard({ item, brandName, brandColor, onOpen, onAsk }: { item: GoalProgress; brandName: string; brandColor: string; onOpen: () => void; onAsk: (q: string) => void }) {
  const g = item.goal!;
  const pct = Math.min(item.percent, 100);
  const color = STATUS_COLOR[item.status];
  const R = 40, C = 2 * Math.PI * R;
  const offset = C * (1 - pct / 100);
  const offTrack = item.status === "off_track" || item.status === "at_risk";
  const askQ = `Why is my "${g.title}" goal ${item.status === "off_track" ? "off" : "at risk"}? What can I do to fix it?`;
  return (
    <div className="card" style={{ padding: 20, position: "relative", cursor: "pointer" }} onClick={onOpen}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="av" style={{ width: 24, height: 24, borderRadius: 6, background: brandColor, fontSize: 10 }}>{brandName.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase()}</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{brandName}</div>
        <div style={{ flex: 1 }} />
        <div className="chip" style={{ background: `${color}1f`, borderColor: `${color}55`, color }}>
          <span className="dot" style={{ background: color }}/> {STATUS_LABEL[item.status]}
        </div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 500, marginTop: 12, lineHeight: 1.3 }}>{g.title}</div>
      <div style={{ fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 1.2, marginTop: 6 }}>
        {METRIC_LABEL[g.metric]}{g.platform ? ` · ${g.platform}` : ""} · {item.days_left}d left
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 18 }}>
        <svg width="104" height="104" viewBox="0 0 104 104">
          <circle cx="52" cy="52" r={R} stroke="rgba(20,20,26,0.10)" strokeWidth="6" fill="none" />
          <circle cx="52" cy="52" r={R} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={offset}
            transform="rotate(-90 52 52)" />
          <text x="52" y="50" textAnchor="middle" fill="var(--fg)" fontSize="20" fontWeight="500" fontFamily="Instrument Serif, serif" fontStyle="italic">{pct.toFixed(0)}%</text>
          <text x="52" y="66" textAnchor="middle" fill="var(--muted)" fontSize="9" letterSpacing="1">OF GOAL</text>
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.2 }}>Current</div>
          <div className="display numeral" style={{ fontSize: 32, lineHeight: 1 }}>{fmt(g.metric, item.current)}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>of <b style={{ color: "var(--fg-dim)" }}>{fmt(g.metric, g.target_value)}</b>{METRIC_UNIT[g.metric] && ""}</div>
          <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 6 }}>Forecast: <span style={{ color }}>{fmt(g.metric, item.forecast)}</span></div>
        </div>
      </div>

      {offTrack && (
        <button
          className="btn"
          style={{ marginTop: 14, width: "100%", justifyContent: "center", fontSize: 12, padding: "8px 12px", background: "rgba(255,90,31,0.1)", borderColor: "rgba(255,90,31,0.3)", color: "var(--coral-2)" }}
          onClick={(e) => { e.stopPropagation(); onAsk(askQ); }}
        >
          <Icon.Sparkle size={12}/> Ask Orbit why
        </button>
      )}
    </div>
  );
}

function DetailDrawer({ progress, brandName, brandColor, onClose, onDeleted, onAsk }: { progress: GoalProgress; brandName: string; brandColor: string; onClose: () => void; onDeleted: () => void; onAsk: (q: string) => void }) {
  const g = progress.goal!;
  const color = STATUS_COLOR[progress.status];
  const series = progress.series;
  const targetLine = series.length ? g.target_value : 0;
  const max = Math.max(targetLine, ...series.map(s => s.actual), 1);
  const width = 720, height = 240, pad = 16;
  const step = (width - pad * 2) / Math.max(series.length - 1, 1);
  const yFor = (v: number) => height - pad - (v / max) * (height - pad * 2);
  const pts = series.map((s, i) => `${pad + i * step},${yFor(s.actual)}`);
  const line = series.length ? `M ${pts.join(" L ")}` : "";
  const fillPath = series.length ? `M ${pad},${height - pad} L ${pts.join(" L ")} L ${pad + (series.length - 1) * step},${height - pad} Z` : "";

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const del = async () => {
    setDeleting(true);
    try {
      await api.delete(`/goals/${g.id}`);
      setConfirmOpen(false);
      onDeleted();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 20, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 780, background: "var(--ink)", borderLeft: "1px solid var(--line)", padding: "28px 32px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="av" style={{ width: 28, height: 28, borderRadius: 7, background: brandColor, fontSize: 11 }}>{brandName.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase()}</div>
          <div style={{ marginLeft: 10 }}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{brandName}{g.platform ? ` · ${g.platform}` : ""}</div>
            <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.3 }}>{g.title}</div>
          </div>
          <div style={{ flex: 1 }}/>
          <Icon.X size={18} onClick={onClose} style={{ cursor: "pointer", opacity: 0.6 }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 22 }}>
          <Stat label="Current" value={fmt(g.metric, progress.current)} />
          <Stat label="Target" value={fmt(g.metric, g.target_value)} />
          <Stat label="Forecast" value={fmt(g.metric, progress.forecast)} color={color} />
          <Stat label="Days left" value={String(progress.days_left)} />
        </div>

        <div className="card" style={{ marginTop: 18, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Pace · actual vs target</div>
            <div style={{ flex: 1 }}/>
            <div className="chip" style={{ background: `${color}1f`, borderColor: `${color}55`, color }}>{STATUS_LABEL[progress.status]}</div>
          </div>
          <svg width={width} height={height} style={{ display: "block", maxWidth: "100%" }}>
            <line x1={pad} x2={width - pad} y1={yFor(targetLine)} y2={yFor(targetLine)} stroke="rgba(212,255,58,0.35)" strokeWidth="1" strokeDasharray="4 4" />
            <text x={width - pad} y={yFor(targetLine) - 6} textAnchor="end" fill="rgba(212,255,58,0.7)" fontSize="10">TARGET {fmt(g.metric, g.target_value)}</text>
            {fillPath && <path d={fillPath} fill={color} opacity={0.12} />}
            {line && <path d={line} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button className="btn" onClick={() => onAsk(`Analyze my "${g.title}" goal. What's driving the current pace and what should I do next?`)}>
            <Icon.Sparkle size={14}/> Ask Orbit to analyze
          </button>
          <div style={{ flex: 1 }}/>
          <button className="btn" onClick={() => setConfirmOpen(true)} style={{ color: "#FF8DB5" }}><Icon.Trash size={14}/> Delete goal</button>
        </div>

        <div className="hr" style={{ margin: "24px 0" }} />
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          Window: {new Date(g.period_start).toLocaleDateString()} → {new Date(g.period_end).toLocaleDateString()}
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={del}
        title="Delete this goal?"
        body={<>Delete <b>"{g.title}"</b>? Past progress data will be removed and this can't be undone.</>}
        confirmLabel="Delete goal"
        danger
        busy={deleting}
      />
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.3 }}>{label}</div>
      <div className="display numeral" style={{ fontSize: 28, lineHeight: 1, marginTop: 6, color: color ?? "var(--fg)" }}>{value}</div>
    </div>
  );
}

function CreateDialog({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { brands } = useAuth();
  const [title, setTitle] = useState("");
  const [metric, setMetric] = useState<GoalMetric>("reach");
  const [target, setTarget] = useState("50000");
  const [brandId, setBrandId] = useState<number | "">("");
  const [platform, setPlatform] = useState("");
  const [days, setDays] = useState("30");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    if (!title.trim()) { setErr("Title required"); return; }
    const t = parseFloat(target);
    if (!t || t <= 0) { setErr("Target must be a positive number"); return; }
    const d = parseInt(days, 10);
    if (!d || d <= 0) { setErr("Duration must be positive"); return; }
    setSaving(true);
    try {
      const now = new Date();
      const end = new Date(now.getTime() + d * 86400 * 1000);
      await api.post("/goals", {
        title: title.trim(),
        metric,
        target_value: t,
        period_start: now.toISOString(),
        period_end: end.toISOString(),
        brand_id: brandId === "" ? null : brandId,
        platform: platform || null,
      });
      onCreated();
    } catch (e: any) {
      setErr(e.response?.data?.detail ?? "Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 520, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 500 }}>New goal</div>
          <div style={{ flex: 1 }}/>
          <Icon.X size={16} onClick={onClose} style={{ cursor: "pointer", opacity: 0.6 }} />
        </div>

        <Field label="Title">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Hit 500k reach on Instagram" style={inputStyle} />
        </Field>
        <Field label="Metric">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(Object.keys(METRIC_LABEL) as GoalMetric[]).map(m => (
              <div key={m} onClick={() => setMetric(m)} style={pillStyle(metric === m)}>
                {METRIC_LABEL[m]}
              </div>
            ))}
          </div>
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Target value">
            <input value={target} onChange={e => setTarget(e.target.value)} type="number" style={inputStyle} />
          </Field>
          <Field label="Duration (days)">
            <input value={days} onChange={e => setDays(e.target.value)} type="number" style={inputStyle} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Brand">
            <select value={brandId} onChange={e => setBrandId(e.target.value === "" ? "" : Number(e.target.value))} style={inputStyle}>
              <option value="">All brands</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </Field>
          <Field label="Platform">
            <select value={platform} onChange={e => setPlatform(e.target.value)} style={inputStyle}>
              <option value="">All platforms</option>
              {["instagram", "facebook", "linkedin", "youtube", "threads"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>

        {err && <div style={{ fontSize: 12, color: "#FF8DB5", marginTop: 8 }}>{err}</div>}

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <div style={{ flex: 1 }}/>
          <button className="btn primary" disabled={saving} onClick={submit}><Icon.Check size={14}/> {saving ? "..." : "Create goal"}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.3, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", background: "var(--ink-2)",
  border: "1px solid var(--line)", borderRadius: 10, color: "var(--fg)",
  fontFamily: "inherit", fontSize: 13, outline: "none",
};

const pillStyle = (on: boolean): React.CSSProperties => ({
  padding: "7px 12px", borderRadius: 10, cursor: "pointer", fontSize: 12.5,
  background: on ? "rgba(255,90,31,0.12)" : "var(--ink-2)",
  border: "1px solid " + (on ? "rgba(255,90,31,0.35)" : "var(--line)"),
  color: on ? "var(--coral-2)" : "var(--fg-dim)",
});
