import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar, Spark, Placeholder } from "../lib/shared";
import { Icon, Platform, PlatformBg } from "../lib/icons";
import { api, type Post } from "../api/client";
import { useAuth } from "../auth/AuthContext";

type Summary = {
  reach: number;
  engagement_rate: number;
  posts_scheduled: number;
  per_platform: Record<string, { reach: number; engagement: number }>;
  spark: number[];
};

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);

export default function Dashboard() {
  const { user, activeBrand } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [upcoming, setUpcoming] = useState<Post[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    const params = activeBrand ? `?brand_id=${activeBrand.id}` : "";
    api.get<Summary>(`/metrics/summary${params}`).then(r => setSummary(r.data));
    api.get<Post[]>(`/posts?status=scheduled${activeBrand ? `&brand_id=${activeBrand.id}` : ""}`).then(r => setUpcoming(r.data.slice(0, 8)));
  }, [activeBrand?.id]);

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const grouped: Record<string, Post[]> = {};
  upcoming.forEach(p => {
    if (!p.scheduled_at) return;
    const d = new Date(p.scheduled_at);
    const key = d.toDateString();
    (grouped[key] ||= []).push(p);
  });
  const groupKeys = Object.keys(grouped).slice(0, 3);

  return (
    <>
      <TopBar title={`Good morning, ${firstName}`} sub={today + (activeBrand ? ` · ${activeBrand.name}` : "")}>
        <div className="chip"><Icon.Search size={12}/> Search · ⌘K</div>
        <button className="btn"><Icon.Filter size={14}/> This week</button>
        <button className="btn primary" onClick={() => nav("/compose")}><Icon.Pen size={14}/> Compose</button>
      </TopBar>

      <div style={{ padding: "24px 28px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
          <div className="card" style={{ padding: 24, background: "linear-gradient(135deg, #FFFFFF 0%, #F3F1EA 100%)", position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.4 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--lime)", display: "inline-block" }}/> Live · last 7 days
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: 12 }}>
              <div className="display numeral" style={{ fontSize: 112, lineHeight: 0.85, color: "var(--fg)" }}>{summary ? fmt(summary.reach) : "—"}</div>
              <div style={{ paddingBottom: 18 }}>
                <div style={{ fontSize: 13, color: "var(--fg-dim)" }}>total reach</div>
                <div className="chip lime" style={{ marginTop: 4 }}><Icon.ArrowUpRight size={11}/> {summary?.engagement_rate ?? 0}% eng</div>
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <Spark data={summary?.spark.length ? summary.spark : [1,2,3,4,5,6]} stroke="#FF5A1F" width={440} height={60} />
            </div>
            <div style={{ display: "flex", gap: 22, marginTop: 12, flexWrap: "wrap" }}>
              {summary && (["instagram","linkedin","youtube","threads","facebook"] as const).map(p => {
                const P = (Platform as any)[p];
                const v = summary.per_platform[p]?.reach ?? 0;
                return (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: PlatformBg[p], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><P size={12}/></div>
                    <div>
                      <div className="numeral" style={{ fontSize: 14, fontWeight: 500 }}>{fmt(v)}</div>
                      <div style={{ fontSize: 10.5, color: "var(--muted)" }}>reach</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.4 }}>Posts scheduled</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
              <div className="display numeral" style={{ fontSize: 74, color: "var(--fg)", lineHeight: 0.9 }}>{summary?.posts_scheduled ?? 0}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>queued</div>
            </div>
            <div style={{ height: 6, background: "var(--ink-3)", borderRadius: 3, marginTop: 14, overflow: "hidden" }}>
              <div style={{ width: `${Math.min((summary?.posts_scheduled ?? 0) * 3, 100)}%`, height: "100%", background: "var(--coral)" }} />
            </div>
            <div className="hr" style={{ margin: "16px 0" }}/>
            <div style={{ fontSize: 12.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ color: "var(--muted)" }}>Avg engagement</span><span className="numeral" style={{ fontWeight: 500 }}>{summary?.engagement_rate ?? 0}%</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ color: "var(--muted)" }}>Best day</span><span style={{ fontWeight: 500 }}>Thursday</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>Peak hour</span><span className="numeral" style={{ fontWeight: 500 }}>6–8pm</span></div>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.4 }}>Followers · net new</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
              <div className="display numeral" style={{ fontSize: 74, color: "var(--fg)", lineHeight: 0.9 }}>+2,148</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--lime)", marginTop: 4, display: "flex", gap: 6, alignItems: "center" }}>
              <Icon.ArrowUpRight size={12}/> +12.4% vs last week
            </div>
            <div style={{ marginTop: 12 }}>
              <Spark data={[4,6,5,9,8,14,12,18,16,22]} stroke="#6B5CFF" width={260} height={50} />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14 }}>
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "18px 20px", display: "flex", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Upcoming · next scheduled</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{upcoming.length} scheduled posts</div>
              </div>
              <div style={{ flex: 1 }}/>
              <div className="chip">All brands</div>
              <Icon.Arrow size={16} style={{ marginLeft: 12, opacity: 0.5, cursor: "pointer" }}/>
            </div>
            <div className="hr"/>

            {groupKeys.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>No scheduled posts. <span onClick={() => nav("/compose")} style={{ color: "var(--coral)", cursor: "pointer" }}>Compose one →</span></div>}
            {groupKeys.map((key) => {
              const d = new Date(key);
              const isToday = new Date().toDateString() === key;
              return (
                <div key={key}>
                  <div style={{ padding: "12px 20px 6px", display: "flex", gap: 10, alignItems: "baseline" }}>
                    <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 1.4, color: isToday ? "var(--coral)" : "var(--muted)" }}>{isToday ? "TODAY" : d.toLocaleDateString(undefined, { weekday: "short" }).toUpperCase()}</div>
                    <div style={{ fontSize: 11, color: "var(--muted-2)" }}>{d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
                  </div>
                  {grouped[key].map((p, i) => {
                    const t = new Date(p.scheduled_at!);
                    return (
                      <div key={p.id} style={{ display: "flex", gap: 14, padding: "10px 20px", alignItems: "center", borderTop: i === 0 ? "none" : "1px solid var(--line)" }}>
                        <div style={{ width: 54, textAlign: "right" }}>
                          <div className="numeral" style={{ fontSize: 14, fontWeight: 500 }}>{t.getHours() % 12 || 12}:{String(t.getMinutes()).padStart(2, "0")}</div>
                          <div style={{ fontSize: 10, color: "var(--muted)" }}>{t.getHours() >= 12 ? "PM" : "AM"}</div>
                        </div>
                        <Placeholder seed={p.id} style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.caption || "(No caption)"}</div>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          {p.platforms.map(pl => {
                            const P = (Platform as any)[pl];
                            return P ? <div key={pl} style={{ width: 22, height: 22, borderRadius: 5, background: PlatformBg[pl], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><P size={11}/></div> : null;
                          })}
                        </div>
                        <Icon.Dots size={16} style={{ opacity: 0.4, cursor: "pointer" }}/>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="card" style={{ padding: 20, background: "linear-gradient(135deg, rgba(107,92,255,0.1), rgba(212,255,58,0.04))", borderColor: "rgba(107,92,255,0.25)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon.Sparkle size={16} style={{ color: "var(--lime)" }}/>
                <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: "var(--lime)" }}>AI · Content spark</div>
              </div>
              <div className="display" style={{ fontSize: 26, lineHeight: 1.1, marginTop: 10 }}>
                Your Tuesday reels <span style={{ color: "var(--lime)" }}>outperform Sunday posts by 3.4×</span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--fg-dim)", marginTop: 12, lineHeight: 1.55 }}>Move the "behind the lens" series to Tuesday 6pm. I can reschedule the next 4 posts in one click.</div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button className="btn lime" style={{ padding: "8px 12px", fontSize: 12 }}>Apply suggestion</button>
                <button className="btn ghost" style={{ padding: "8px 12px", fontSize: 12 }}>Dismiss</button>
              </div>
            </div>

            <div className="card" style={{ padding: 20, background: "linear-gradient(120deg, #FFFFFF 0%, #FFF3EE 100%)", borderColor: "rgba(255,90,31,0.25)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.4 }}>Quick compose</div>
              <div className="display" style={{ fontSize: 34, lineHeight: 1.05, marginTop: 8 }}>
                What's the <span style={{ color: "var(--coral)" }}>story</span> today?
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                {["Product teaser","Event recap","Customer story","Behind the scenes","Announcement"].map(t => (
                  <div key={t} className="chip" style={{ cursor: "pointer" }}>{t}</div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center" }}>
                <button className="btn"><Icon.Image size={14}/> Media</button>
                <button className="btn"><Icon.Sparkle size={14}/> AI caption</button>
                <div style={{ flex: 1 }}/>
                <button className="btn primary" onClick={() => nav("/compose")}><Icon.Pen size={14}/> Open composer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
