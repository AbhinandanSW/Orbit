import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar, Placeholder } from "../lib/shared";
import { Icon, Platform, PlatformBg } from "../lib/icons";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const PLATFORMS = ["instagram", "linkedin", "threads", "youtube", "facebook"] as const;

export default function Composer() {
  const { activeBrand } = useAuth();
  const nav = useNavigate();
  const [caption, setCaption] = useState("Issue 04 is almost here. \"The long road\" — a look at the makers we followed for 12 months, across 4 continents, through every season. Cover reveal Friday. 🧡\n\n#slowdesign #issue04 #behindthelens");
  const [selected, setSelected] = useState<string[]>(["instagram", "linkedin", "threads"]);
  const [scheduleMode, setScheduleMode] = useState<"now" | "queue" | "pick">("queue");
  const [pickTime, setPickTime] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const defaultBrandLabel = activeBrand?.initials ?? "LS";
  const defaultBrandColor = activeBrand?.color ?? "#FF5A1F";
  const brandName = activeBrand?.name ?? "Luma Studio";

  const togglePlatform = (p: string) => setSelected(s => s.includes(p) ? s.filter(x => x !== p) : [...s, p]);

  const scheduledAt = useMemo(() => {
    if (scheduleMode === "now") return new Date().toISOString();
    if (scheduleMode === "pick") return new Date(pickTime).toISOString();
    const d = new Date(); d.setDate(d.getDate() + (4 - d.getDay() + 7) % 7 || 7); d.setHours(18, 0, 0, 0);
    return d.toISOString();
  }, [scheduleMode, pickTime]);

  const submit = async () => {
    if (!activeBrand) { setErr("No active brand"); return; }
    setSaving(true); setErr("");
    try {
      await api.post("/posts", {
        brand_id: activeBrand.id,
        caption,
        platforms: selected,
        media_urls: [],
        scheduled_at: scheduleMode === "now" ? null : scheduledAt,
        status: scheduleMode === "now" ? "published" : "scheduled",
      });
      nav("/library");
    } catch (e: any) {
      setErr(e.response?.data?.detail ?? "Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <>
      <TopBar title="New post" sub={`Draft · ${brandName}`}>
        <div className="chip"><Icon.Users size={11}/> Mae Tanaka viewing</div>
        <button className="btn" onClick={() => api.post("/posts", { brand_id: activeBrand?.id, caption, platforms: selected, media_urls: [], status: "draft" }).then(() => nav("/library"))}><Icon.Check size={14}/> Save draft</button>
        <button className="btn primary" onClick={submit} disabled={saving}><Icon.Send size={14}/> {saving ? "..." : "Schedule"}</button>
      </TopBar>

      {err && <div style={{ padding: "10px 28px", background: "rgba(255,80,80,0.12)", color: "#FF9A9A", fontSize: 13 }}>{err}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 340px", minHeight: "calc(100vh - 80px)" }}>
        <div style={{ padding: "28px 32px", borderRight: "1px solid var(--line)" }}>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.3, marginBottom: 10 }}>Publishing to</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PLATFORMS.map(p => {
              const P = (Platform as any)[p];
              const on = selected.includes(p);
              return (
                <div key={p} onClick={() => togglePlatform(p)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 12px", borderRadius: 10,
                  background: on ? "rgba(255,90,31,0.12)" : "var(--ink-2)",
                  border: "1px solid " + (on ? "rgba(255,90,31,0.35)" : "var(--line)"),
                  fontSize: 12.5, cursor: "pointer",
                }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: PlatformBg[p], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><P size={9}/></div>
                  {p[0].toUpperCase() + p.slice(1)}
                  {on && <Icon.Check size={12} style={{ color: "var(--coral)" }} />}
                </div>
              );
            })}
          </div>

          <div className="card" style={{ padding: 0, marginTop: 22 }}>
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", borderBottom: "1px solid var(--line)" }}>
              <div className="av" style={{ width: 22, height: 22, borderRadius: 5, background: defaultBrandColor, fontSize: 10 }}>{defaultBrandLabel}</div>
              <span style={{ fontSize: 12.5, marginLeft: 8 }}>{brandName} · master caption</span>
              <div style={{ flex: 1 }}/>
              <div className="chip" style={{ fontSize: 10 }}>{selected.length} / {PLATFORMS.length} platforms</div>
            </div>
            <textarea value={caption} onChange={e => setCaption(e.target.value)} style={{
              width: "100%", minHeight: 180, background: "transparent", border: "none", color: "var(--fg)",
              padding: "16px 18px", fontSize: 15, lineHeight: 1.55, fontFamily: "inherit", resize: "vertical", outline: "none",
            }}/>
            <div style={{ padding: "10px 14px", borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 6 }}>
              <button className="btn ghost" style={{ padding: "6px 10px", fontSize: 12 }}><Icon.Sparkle size={13}/> AI caption</button>
              <button className="btn ghost" style={{ padding: "6px 10px", fontSize: 12 }}><Icon.Hash size={13}/> Suggest tags</button>
              <div style={{ flex: 1 }}/>
              <div className="numeral" style={{ fontSize: 11, color: "var(--muted)" }}>{caption.length} / 2200</div>
            </div>
          </div>

          <div style={{ marginTop: 18, fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.3 }}>Media · carousel · 4 slides</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 10 }}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{ position: "relative" }}>
                <Placeholder seed={s} style={{ aspectRatio: "1", borderRadius: 8, border: s === 1 ? "2px solid var(--coral)" : "none" }} />
                {s === 1 && <div style={{ position: "absolute", top: 4, left: 4, fontSize: 10, background: "var(--coral)", color: "#fff", padding: "1px 6px", borderRadius: 4 }}>COVER</div>}
              </div>
            ))}
            <div style={{ aspectRatio: "1", borderRadius: 8, border: "1.5px dashed var(--line-2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--muted)", cursor: "pointer" }}>
              <Icon.Plus size={18}/>
              <div style={{ fontSize: 11 }}>Add</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn"><Icon.Upload size={14}/> Upload</button>
            <button className="btn"><Icon.Sparkle size={14}/> AI image</button>
            <button className="btn"><Icon.Folder size={14}/> From library</button>
          </div>
        </div>

        <div style={{ padding: "28px 24px", background: "#09090B", borderRight: "1px solid var(--line)" }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 18 }}>Live preview</div>
          <div style={{ background: "#fff", color: "#000", borderRadius: 10, overflow: "hidden", width: 320, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", padding: 12, gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: PlatformBg.instagram, padding: 2 }}>
                <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: defaultBrandColor, fontSize: 11, fontWeight: 700 }}>{defaultBrandLabel}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{brandName.toLowerCase().replace(/\s+/g, "")}</div>
              <div style={{ flex: 1 }}/><div style={{ fontSize: 16, color: "#666" }}>⋯</div>
            </div>
            <Placeholder seed={1} style={{ width: 320, height: 320, borderRadius: 0 }} />
            <div style={{ padding: 10, display: "flex", gap: 12, fontSize: 18 }}>
              <Icon.Heart size={22} /><Icon.Send size={21} /><Icon.Pen size={21} />
            </div>
            <div style={{ padding: "0 12px 12px", fontSize: 12.5, lineHeight: 1.45 }}>
              <b>{brandName.toLowerCase().replace(/\s+/g, "")}</b> {caption.slice(0, 160)}{caption.length > 160 && "…"}
            </div>
          </div>
        </div>

        <div style={{ padding: "28px 24px" }}>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.3 }}>Scheduling</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {([
              { k: "now", l: "Post now", i: Icon.Send, sub: "" },
              { k: "queue", l: "Add to queue", i: Icon.Clock, sub: "Next slot · Thu 6pm" },
              { k: "pick", l: "Pick a time", i: Icon.Calendar, sub: new Date(pickTime).toLocaleString() },
            ] as const).map(o => {
              const sel = scheduleMode === o.k;
              return (
                <div key={o.k} onClick={() => setScheduleMode(o.k)} style={{
                  padding: "12px 14px", background: sel ? "rgba(212,255,58,0.08)" : "var(--ink-2)",
                  border: "1px solid " + (sel ? "var(--lime)" : "var(--line)"),
                  borderRadius: 10, display: "flex", gap: 10, alignItems: "center", cursor: "pointer",
                }}>
                  <o.i size={16} style={{ color: sel ? "var(--lime)" : "var(--muted)" }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{o.l}</div>
                    {o.sub && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{o.sub}</div>}
                  </div>
                  {sel && <div style={{ width: 14, height: 14, borderRadius: 7, background: "var(--lime)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.Check size={9} style={{ color: "#0E0E10" }}/></div>}
                </div>
              );
            })}
            {scheduleMode === "pick" && (
              <input type="datetime-local" value={pickTime} onChange={e => setPickTime(e.target.value)} style={{
                padding: "10px 12px", background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--fg)", fontFamily: "inherit", fontSize: 13, outline: "none",
              }} />
            )}
          </div>

          <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: "rgba(212,255,58,0.06)", border: "1px solid rgba(212,255,58,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--lime)", letterSpacing: 1.2, textTransform: "uppercase" }}>
              <Icon.Sparkle size={12}/> AI pick
            </div>
            <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.5 }}>Thu 6pm lands in your audience's peak window — 3.4× your daily average engagement.</div>
          </div>
        </div>
      </div>
    </>
  );
}
