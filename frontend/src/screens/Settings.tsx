import { useEffect, useState } from "react";
import { TopBar } from "../lib/shared";
import { Icon, Platform, PlatformBg } from "../lib/icons";
import { api, type Connection } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const PLATFORMS = ["instagram", "facebook", "linkedin", "youtube", "threads"] as const;

export default function Settings() {
  const { user, brands, activeBrand, logout } = useAuth();
  const [conns, setConns] = useState<Connection[]>([]);
  const [handle, setHandle] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [oauthFlash, setOauthFlash] = useState<{ kind: "ok" | "error"; msg: string } | null>(null);

  const load = () => api.get<Connection[]>("/connections").then(r => setConns(r.data));
  useEffect(() => { load(); }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const li = params.get("linkedin");
    const meta = params.get("meta");
    const yt = params.get("youtube");
    if (li) {
      if (li === "ok") setOauthFlash({ kind: "ok", msg: "LinkedIn connected." });
      else setOauthFlash({ kind: "error", msg: `LinkedIn connect failed: ${params.get("reason") || li}` });
    } else if (meta) {
      if (meta === "ok") {
        const fb = params.get("fb") || "0";
        const ig = params.get("ig") || "0";
        const note = params.get("note") === "multiple_accounts" ? " (multiple accounts found — first selected)" : "";
        setOauthFlash({ kind: "ok", msg: `Meta connected: ${fb} Page(s), ${ig} Instagram account(s)${note}.` });
      } else {
        setOauthFlash({ kind: "error", msg: `Meta connect failed: ${params.get("reason") || meta}` });
      }
    } else if (yt) {
      if (yt === "ok") {
        const ch = params.get("channel") || "channel";
        setOauthFlash({ kind: "ok", msg: `YouTube connected: ${ch}.` });
      } else {
        setOauthFlash({ kind: "error", msg: `YouTube connect failed: ${params.get("reason") || yt}` });
      }
    } else {
      return;
    }
    window.history.replaceState({}, "", window.location.pathname);
    load();
  }, []);

  const connectLinkedIn = async () => {
    if (!activeBrand) return;
    setBusy("linkedin");
    try {
      const r = await api.get<{ authorize_url: string }>("/oauth/linkedin/start", { params: { brand_id: activeBrand.id } });
      window.location.href = r.data.authorize_url;
    } catch (e: any) {
      setOauthFlash({ kind: "error", msg: e?.response?.data?.detail || "Failed to start LinkedIn OAuth" });
      setBusy(null);
    }
  };

  const connectYouTube = async () => {
    if (!activeBrand) return;
    setBusy("youtube");
    try {
      const r = await api.get<{ authorize_url: string }>("/oauth/google/start", { params: { brand_id: activeBrand.id } });
      window.location.href = r.data.authorize_url;
    } catch (e: any) {
      setOauthFlash({ kind: "error", msg: e?.response?.data?.detail || "Failed to start YouTube OAuth" });
      setBusy(null);
    }
  };

  const connectMeta = async (platform: "facebook" | "instagram") => {
    if (!activeBrand) return;
    setBusy(platform);
    try {
      const r = await api.get<{ authorize_url: string }>("/oauth/meta/start", { params: { brand_id: activeBrand.id } });
      window.location.href = r.data.authorize_url;
    } catch (e: any) {
      setOauthFlash({ kind: "error", msg: e?.response?.data?.detail || "Failed to start Meta OAuth" });
      setBusy(null);
    }
  };

  const connect = async (platform: string) => {
    if (!activeBrand || !handle) return;
    setBusy(platform);
    try {
      await api.post("/connections", { brand_id: activeBrand.id, platform, handle });
      setHandle("");
      await load();
    } finally { setBusy(null); }
  };

  const disconnect = async (id: number) => {
    await api.delete(`/connections/${id}`);
    await load();
  };

  const connsForBrand = conns.filter(c => c.brand_id === activeBrand?.id);
  const byPlatform = (p: string) => connsForBrand.find(c => c.platform === p);

  return (
    <>
      <TopBar title="Settings" sub={user?.email} />

      <div style={{ padding: "24px 28px 48px", maxWidth: 960 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Profile</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginTop: 14 }}>
            <ReadOnly label="Name" value={user?.name} />
            <ReadOnly label="Email" value={user?.email} />
            <ReadOnly label="Role" value={user?.role} />
            <ReadOnly label="Brands" value={String(brands.length)} />
          </div>
        </div>

        <div className="card" style={{ padding: 24, marginTop: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Connected accounts — {activeBrand?.name}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>LinkedIn and Meta (Facebook + Instagram) use real OAuth. Instagram publishing requires a public image URL.</div>

          {oauthFlash && (
            <div style={{
              marginTop: 12, padding: "10px 12px", borderRadius: 8, fontSize: 12,
              background: oauthFlash.kind === "ok" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
              color: oauthFlash.kind === "ok" ? "#047857" : "#b91c1c",
              border: `1px solid ${oauthFlash.kind === "ok" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
            }}>{oauthFlash.msg}</div>
          )}

          <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="@handle or channel name" style={{
              flex: 1, padding: "10px 14px", background: "rgba(20,20,26,0.04)", border: "1px solid var(--line)",
              borderRadius: 10, color: "var(--fg)", fontFamily: "inherit", fontSize: 14, outline: "none",
            }} />
            <div style={{ fontSize: 12, color: "var(--muted)" }}>then pick a platform →</div>
          </div>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {PLATFORMS.map(p => {
              const P = (Platform as any)[p];
              const existing = byPlatform(p);
              return (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: PlatformBg[p], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><P size={14}/></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p[0].toUpperCase() + p.slice(1)}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{existing ? `Connected as ${existing.handle}` : "Not connected"}</div>
                  </div>
                  {existing ? (
                    <button className="btn" onClick={() => disconnect(existing.id)}><Icon.X size={13}/> Disconnect</button>
                  ) : p === "linkedin" ? (
                    <button className="btn primary" disabled={!activeBrand || busy === p} onClick={connectLinkedIn}>
                      {busy === p ? "..." : "Connect with LinkedIn"}
                    </button>
                  ) : p === "facebook" || p === "instagram" ? (
                    <button className="btn primary" disabled={!activeBrand || busy === p} onClick={() => connectMeta(p)}>
                      {busy === p ? "..." : `Connect with Meta`}
                    </button>
                  ) : p === "youtube" ? (
                    <button className="btn primary" disabled={!activeBrand || busy === p} onClick={connectYouTube}>
                      {busy === p ? "..." : "Connect with Google"}
                    </button>
                  ) : (
                    <button className="btn primary" disabled={!handle || busy === p} onClick={() => connect(p)}>
                      {busy === p ? "..." : "Connect"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ padding: 24, marginTop: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Session</div>
          <button className="btn" onClick={logout} style={{ marginTop: 14 }}><Icon.Arrow size={14}/> Sign out</button>
        </div>
      </div>
    </>
  );
}

function ReadOnly({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.2 }}>{label}</div>
      <div style={{ fontSize: 14, marginTop: 4 }}>{value ?? "—"}</div>
    </div>
  );
}
