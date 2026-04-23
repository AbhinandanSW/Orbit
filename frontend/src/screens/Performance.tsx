import { useEffect, useState } from "react";
import { TopBar, Spark } from "../lib/shared";
import { Icon, Platform, PlatformBg } from "../lib/icons";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

type Series = { metric: string; series: { date: string; value: number }[] };
type Heatmap = { grid: number[][] };
const PLATFORMS = ["instagram", "facebook", "linkedin", "youtube", "threads"] as const;
const DOW = ["M", "T", "W", "T", "F", "S", "S"];

export default function Performance() {
  const { activeBrand } = useAuth();
  const [platform, setPlatform] = useState<string>("");
  const [metric, setMetric] = useState("reach");
  const [series, setSeries] = useState<Series | null>(null);
  const [heat, setHeat] = useState<Heatmap | null>(null);

  useEffect(() => {
    const base = new URLSearchParams({ metric, range: "30d" });
    if (platform) base.set("platform", platform);
    if (activeBrand) base.set("brand_id", String(activeBrand.id));
    api.get<Series>(`/metrics/timeseries?${base}`).then(r => setSeries(r.data));
    const hp = new URLSearchParams();
    if (activeBrand) hp.set("brand_id", String(activeBrand.id));
    api.get<Heatmap>(`/metrics/heatmap?${hp}`).then(r => setHeat(r.data));
  }, [metric, platform, activeBrand?.id]);

  const values = series?.series.map(s => s.value) ?? [];
  const total = values.reduce((a, b) => a + b, 0);
  const peak = Math.max(...values, 1);
  const heatMax = Math.max(...(heat?.grid.flat() ?? [1]), 1);

  return (
    <>
      <TopBar title="Performance" sub={activeBrand?.name}>
        <div className="chip"><Icon.Filter size={12}/> 30 days</div>
      </TopBar>

      <div style={{ padding: "20px 28px 48px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          <div onClick={() => setPlatform("")} style={tabStyle(platform === "")}>All</div>
          {PLATFORMS.map(p => {
            const P = (Platform as any)[p];
            return (
              <div key={p} onClick={() => setPlatform(p)} style={{ ...tabStyle(platform === p), display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: PlatformBg[p], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><P size={8} /></div>
                {p[0].toUpperCase() + p.slice(1)}
              </div>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
          {(["reach", "engagement", "saves", "clicks"] as const).map(m => (
            <div key={m} onClick={() => setMetric(m)} className="card" style={{ padding: 18, cursor: "pointer", borderColor: metric === m ? "var(--coral)" : "var(--line)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.4 }}>{m}</div>
              <div className="display numeral" style={{ fontSize: 48, lineHeight: 0.95, marginTop: 6 }}>{m === metric ? total.toLocaleString() : "—"}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{metric[0].toUpperCase() + metric.slice(1)} · last 30 days</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Peak {peak.toLocaleString()}</div>
            </div>
            <div style={{ flex: 1 }}/>
            <div className="chip lime"><Icon.ArrowUpRight size={11}/> Trending</div>
          </div>
          <Spark data={values.length ? values : [1,2,3,4]} stroke="#FF5A1F" width={1000} height={180} />
        </div>

        <div className="card" style={{ padding: 24, marginTop: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Engagement heatmap</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Average engagement rate by day × hour</div>
          <div style={{ display: "grid", gridTemplateColumns: "40px repeat(24, 1fr)", gap: 3 }}>
            <div/>
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} style={{ fontSize: 9, color: "var(--muted)", textAlign: "center" }}>{h % 6 === 0 ? h : ""}</div>
            ))}
            {DOW.map((d, di) => (
              <>
                <div key={`l${di}`} style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center" }}>{d}</div>
                {Array.from({ length: 24 }, (_, h) => {
                  const v = heat?.grid[di]?.[h] ?? 0;
                  const intensity = v / heatMax;
                  return <div key={`${di}-${h}`} title={`${v}%`} style={{
                    aspectRatio: "1",
                    background: `rgba(255, 90, 31, ${0.08 + intensity * 0.8})`,
                    borderRadius: 3,
                  }} />;
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const tabStyle = (on: boolean): React.CSSProperties => ({
  padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13,
  background: on ? "rgba(255,90,31,0.12)" : "var(--ink-2)",
  border: "1px solid " + (on ? "rgba(255,90,31,0.35)" : "var(--line)"),
  color: on ? "var(--coral-2)" : "var(--fg-dim)",
});
