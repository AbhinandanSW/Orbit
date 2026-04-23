import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar, Placeholder } from "../lib/shared";
import { Icon, Platform, PlatformBg } from "../lib/icons";
import { api, type Post } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const TABS = [
  { id: "", label: "All" },
  { id: "draft", label: "Drafts" },
  { id: "scheduled", label: "Scheduled" },
  { id: "published", label: "Published" },
  { id: "review", label: "In review" },
  { id: "failed", label: "Failed" },
];

const statusColor: Record<string, string> = {
  draft: "var(--muted)", scheduled: "var(--lime)",
  published: "var(--fg-dim)", review: "var(--coral-2)", failed: "#FF7A7A",
};

export default function Library() {
  const { activeBrand } = useAuth();
  const [tab, setTab] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    if (tab) params.set("status", tab);
    if (activeBrand) params.set("brand_id", String(activeBrand.id));
    api.get<Post[]>(`/posts?${params}`).then(r => setPosts(r.data));
  }, [tab, activeBrand?.id]);

  const del = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await api.delete(`/posts/${id}`);
    setPosts(p => p.filter(x => x.id !== id));
  };

  return (
    <>
      <TopBar title="Library" sub={`${posts.length} posts`}>
        <div className="chip"><Icon.Search size={12}/> Search</div>
        <button className="btn primary" onClick={() => nav("/compose")}><Icon.Pen size={14}/> New post</button>
      </TopBar>

      <div style={{ padding: "20px 28px 8px", display: "flex", gap: 6 }}>
        {TABS.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} className={tab === t.id ? "" : "chip"} style={{
            padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13,
            background: tab === t.id ? "rgba(255,90,31,0.12)" : "var(--ink-2)",
            border: "1px solid " + (tab === t.id ? "rgba(255,90,31,0.35)" : "var(--line)"),
            color: tab === t.id ? "var(--coral-2)" : "var(--fg-dim)",
          }}>{t.label}</div>
        ))}
      </div>

      <div style={{ padding: "14px 28px 48px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {posts.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: 60, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
            No posts yet. <span onClick={() => nav("/compose")} style={{ color: "var(--coral)", cursor: "pointer" }}>Compose one →</span>
          </div>
        )}
        {posts.map(p => (
          <div key={p.id} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <Placeholder seed={p.id} style={{ height: 180 }} />
            <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: statusColor[p.status] ?? "var(--muted)" }}>● {p.status}</span>
                <div style={{ flex: 1 }}/>
                {p.platforms.map(pl => {
                  const P = (Platform as any)[pl];
                  return P ? <div key={pl} style={{ width: 18, height: 18, borderRadius: 4, background: PlatformBg[pl], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><P size={9}/></div> : null;
                })}
              </div>
              <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.caption || "(No caption)"}</div>
              <div style={{ flex: 1 }}/>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, fontSize: 11, color: "var(--muted)" }}>
                {p.scheduled_at && <span><Icon.Clock size={11} style={{ verticalAlign: "middle" }}/> {new Date(p.scheduled_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>}
                {p.status === "published" && <span>{p.reach.toLocaleString()} reach · {p.engagement}%</span>}
                <div style={{ flex: 1 }}/>
                <Icon.Trash size={14} onClick={() => del(p.id)} style={{ opacity: 0.4, cursor: "pointer" }}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
