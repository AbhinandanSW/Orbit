import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../lib/shared";
import { Icon, Platform, PlatformBg } from "../lib/icons";
import { api, type Post } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const { activeBrand } = useAuth();
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [posts, setPosts] = useState<Post[]>([]);
  const nav = useNavigate();

  const monthParam = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;

  useEffect(() => {
    const p = new URLSearchParams({ month: monthParam });
    if (activeBrand) p.set("brand_id", String(activeBrand.id));
    api.get<Post[]>(`/posts?${p}`).then(r => setPosts(r.data));
  }, [monthParam, activeBrand?.id]);

  const { weeks, postsByDay } = useMemo(() => {
    const firstDow = cursor.getDay();
    const days: (Date | null)[] = Array.from({ length: firstDow }, () => null);
    const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= last; d++) days.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    while (days.length % 7) days.push(null);
    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

    const byDay: Record<string, Post[]> = {};
    posts.forEach(p => {
      if (!p.scheduled_at) return;
      const key = new Date(p.scheduled_at).toDateString();
      (byDay[key] ||= []).push(p);
    });
    return { weeks, postsByDay: byDay };
  }, [cursor, posts]);

  const shift = (n: number) => { const d = new Date(cursor); d.setMonth(d.getMonth() + n); setCursor(d); };
  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const todayKey = new Date().toDateString();

  return (
    <>
      <TopBar title="Calendar" sub={monthLabel}>
        <button className="btn" onClick={() => shift(-1)}><Icon.Chevron size={14} style={{ transform: "rotate(180deg)" }}/></button>
        <button className="btn" onClick={() => setCursor(() => { const d = new Date(); d.setDate(1); return d; })}>Today</button>
        <button className="btn" onClick={() => shift(1)}><Icon.Chevron size={14}/></button>
        <button className="btn primary" onClick={() => nav("/compose")}><Icon.Pen size={14}/> Compose</button>
      </TopBar>

      <div style={{ padding: "20px 28px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, background: "var(--line)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
          {DOW.map(d => (
            <div key={d} style={{ background: "var(--ink)", padding: "10px 14px", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.2 }}>{d}</div>
          ))}
          {weeks.flat().map((d, i) => {
            const key = d?.toDateString();
            const items = key ? postsByDay[key] ?? [] : [];
            const isToday = key === todayKey;
            return (
              <div key={i} style={{
                background: d ? "var(--ink-2)" : "rgba(255,255,255,0.01)",
                minHeight: 120, padding: 10, position: "relative",
                outline: isToday ? "1px solid var(--coral)" : undefined,
              }}>
                {d && (
                  <>
                    <div className="numeral" style={{ fontSize: 13, fontWeight: isToday ? 600 : 400, color: isToday ? "var(--coral)" : "var(--fg-dim)" }}>{d.getDate()}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                      {items.slice(0, 3).map(p => {
                        const t = new Date(p.scheduled_at!);
                        const mainPlat = p.platforms[0];
                        return (
                          <div key={p.id} onClick={() => nav("/library")} style={{
                            fontSize: 11, padding: "4px 6px", borderRadius: 6, cursor: "pointer",
                            background: "rgba(255,255,255,0.04)",
                            borderLeft: `2px solid ${mainPlat ? PlatformBg[mainPlat] : "var(--coral)"}`,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            display: "flex", alignItems: "center", gap: 4,
                          }}>
                            {mainPlat && (Platform as any)[mainPlat] && (() => { const P = (Platform as any)[mainPlat]; return <P size={9} />; })()}
                            <span className="numeral" style={{ color: "var(--muted)" }}>{t.getHours() % 12 || 12}{t.getHours() >= 12 ? "p" : "a"}</span>
                            <span style={{ color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.caption.slice(0, 24) || "(untitled)"}</span>
                          </div>
                        );
                      })}
                      {items.length > 3 && <div style={{ fontSize: 10, color: "var(--muted)" }}>+{items.length - 3} more</div>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
