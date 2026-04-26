import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar, Placeholder, Modal } from "../lib/shared";
import { Icon, Platform, PlatformBg } from "../lib/icons";
import { api, type Post } from "../api/client";
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
  const [aiOpen, setAiOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiTone, setAiTone] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState("");
  const [aiCaptions, setAiCaptions] = useState<string[]>([]);

  const [media, setMedia] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [aiImgOpen, setAiImgOpen] = useState(false);
  const [aiImgPrompt, setAiImgPrompt] = useState("");
  const [aiImgGenerating, setAiImgGenerating] = useState(false);
  const [aiImgPreview, setAiImgPreview] = useState<string | null>(null);

  const [libOpen, setLibOpen] = useState(false);
  const [libPosts, setLibPosts] = useState<Post[]>([]);
  const [libLoading, setLibLoading] = useState(false);

  const [notice, setNotice] = useState<{ title: string; body?: string } | null>(null);
  const [removeIdx, setRemoveIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!libOpen || !activeBrand) return;
    setLibLoading(true);
    api.get<Post[]>(`/posts?brand_id=${activeBrand.id}`).then(r => setLibPosts(r.data)).finally(() => setLibLoading(false));
  }, [libOpen, activeBrand?.id]);

  const onFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const list = Array.from(files).slice(0, 8);
    try {
      const uploaded = await Promise.all(list.map(async f => {
        if (!f.type.startsWith("image/") && !f.type.startsWith("video/")) {
          throw new Error(`${f.name} isn't an image or video`);
        }
        const form = new FormData();
        form.append("file", f);
        const { data } = await api.post<{ url: string }>("/media", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return data.url;
      }));
      setMedia(m => [...m, ...uploaded].slice(0, 10));
    } catch (e: any) {
      setNotice({
        title: "Couldn't upload file",
        body: e.response?.data?.detail ?? e.message ?? "Upload failed",
      });
    }
  };

  const generateAiImage = () => {
    if (!aiImgPrompt.trim()) return;
    setAiImgGenerating(true);
    const seed = encodeURIComponent(aiImgPrompt.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 40));
    const url = `https://picsum.photos/seed/${seed}-${Date.now()}/800/800`;
    const img = new Image();
    img.onload = () => { setAiImgPreview(url); setAiImgGenerating(false); };
    img.onerror = () => { setAiImgGenerating(false); setNotice({ title: "Generation failed", body: "Couldn't reach the image service. Try again." }); };
    img.src = url;
  };

  const useAiImage = () => {
    if (!aiImgPreview) return;
    setMedia(m => [...m, aiImgPreview].slice(0, 10));
    setAiImgOpen(false);
    setAiImgPrompt("");
    setAiImgPreview(null);
  };

  const defaultBrandLabel = activeBrand?.initials ?? "LS";
  const defaultBrandColor = activeBrand?.color ?? "#FF5A1F";
  const brandName = activeBrand?.name ?? "Luma Studio";

  const togglePlatform = (p: string) => setSelected(s => s.includes(p) ? s.filter(x => x !== p) : [...s, p]);

  const genCaptions = async () => {
    if (!activeBrand) { setAiErr("No active brand"); return; }
    if (!aiTopic.trim()) { setAiErr("Tell Orbit what the post is about"); return; }
    const platform = selected[0] || "instagram";
    setAiLoading(true); setAiErr(""); setAiCaptions([]);
    try {
      const { data } = await api.post<{ captions: string[] }>("/ai/caption", {
        brand_id: activeBrand.id, platform, topic: aiTopic.trim(), tone: aiTone.trim() || null,
      });
      setAiCaptions(data.captions);
    } catch (e: any) {
      setAiErr(e.response?.data?.detail ?? "Couldn't generate captions");
    } finally { setAiLoading(false); }
  };

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
        media_urls: media,
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
        <button className="btn" onClick={() => api.post("/posts", { brand_id: activeBrand?.id, caption, platforms: selected, media_urls: media, status: "draft" }).then(() => nav("/library"))}><Icon.Check size={14}/> Save draft</button>
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
              <button className="btn ghost" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => setAiOpen(true)}><Icon.Sparkle size={13}/> AI caption</button>
              <button className="btn ghost" style={{ padding: "6px 10px", fontSize: 12 }}><Icon.Hash size={13}/> Suggest tags</button>
              <div style={{ flex: 1 }}/>
              <div className="numeral" style={{ fontSize: 11, color: "var(--muted)" }}>{caption.length} / 2200</div>
            </div>
          </div>

          <div style={{ marginTop: 18, fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.3 }}>
            Media{media.length > 0 ? ` · carousel · ${media.length} slide${media.length > 1 ? "s" : ""}` : ""}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 10 }}>
            {media.map((url, i) => (
              <div key={`${i}-${url.slice(-12)}`} style={{ position: "relative" }}>
                <div style={{ aspectRatio: "1", borderRadius: 8, overflow: "hidden", border: i === 0 ? "2px solid var(--coral)" : "1px solid var(--line)", background: "var(--ink-2)" }}>
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                {i === 0 && <div style={{ position: "absolute", top: 4, left: 4, fontSize: 10, background: "var(--coral)", color: "#fff", padding: "1px 6px", borderRadius: 4 }}>COVER</div>}
                <div onClick={() => setRemoveIdx(i)} title="Remove" style={{ position: "absolute", top: 4, right: 4, width: 18, height: 18, borderRadius: 9, background: "rgba(0,0,0,0.6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Icon.X size={10} />
                </div>
              </div>
            ))}
            {media.length === 0 && [0,1,2,3].map(s => (
              <Placeholder key={s} seed={s} style={{ aspectRatio: "1", borderRadius: 8, opacity: 0.35 }} />
            ))}
            <div onClick={() => fileInputRef.current?.click()} style={{ aspectRatio: "1", borderRadius: 8, border: "1.5px dashed var(--line-2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--muted)", cursor: "pointer" }}>
              <Icon.Plus size={18}/>
              <div style={{ fontSize: 11 }}>Add</div>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={e => { onFiles(e.target.files); e.target.value = ""; }} />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn" onClick={() => fileInputRef.current?.click()}><Icon.Upload size={14}/> Upload</button>
            <button className="btn" onClick={() => setAiImgOpen(true)}><Icon.Sparkle size={14}/> AI image</button>
            <button className="btn" onClick={() => setLibOpen(true)}><Icon.Folder size={14}/> From library</button>
          </div>
        </div>

        <div style={{ padding: "28px 24px", background: "#F3F1EA", borderRight: "1px solid var(--line)" }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 18 }}>Live preview</div>
          <div style={{ background: "#fff", color: "#000", borderRadius: 10, overflow: "hidden", width: 320, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", padding: 12, gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: PlatformBg.instagram, padding: 2 }}>
                <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: defaultBrandColor, fontSize: 11, fontWeight: 700 }}>{defaultBrandLabel}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{brandName.toLowerCase().replace(/\s+/g, "")}</div>
              <div style={{ flex: 1 }}/><div style={{ fontSize: 16, color: "#666" }}>⋯</div>
            </div>
            {media[0] ? (
              <img src={media[0]} alt="" style={{ width: 320, height: 320, objectFit: "cover", display: "block" }} />
            ) : (
              <Placeholder seed={1} style={{ width: 320, height: 320, borderRadius: 0 }} />
            )}
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
                  {sel && <div style={{ width: 14, height: 14, borderRadius: 7, background: "var(--lime)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.Check size={9} style={{ color: "#14141A" }}/></div>}
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

      {aiOpen && (
        <div onClick={() => setAiOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} className="card" style={{ width: 560, padding: 26, maxHeight: "80vh", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <Icon.Sparkle size={18} style={{ color: "var(--coral)" }}/>
              <div style={{ fontSize: 17, fontWeight: 500, marginLeft: 8 }}>Draft with AI</div>
              <div style={{ flex: 1 }}/>
              <Icon.X size={16} onClick={() => setAiOpen(false)} style={{ cursor: "pointer", opacity: 0.6 }} />
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16, lineHeight: 1.5 }}>
              Orbit reads your recent captions for {brandName} to stay on voice. Writing for <b style={{ color: "var(--fg-dim)" }}>{selected[0] || "instagram"}</b>.
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.3, marginBottom: 6 }}>Topic</div>
            <input autoFocus value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="Friday cover reveal — issue 04, the long road" style={{
              width: "100%", padding: "10px 12px", background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--fg)", fontFamily: "inherit", fontSize: 13, outline: "none",
            }} />
            <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.3, marginBottom: 6, marginTop: 12 }}>Tone (optional)</div>
            <input value={aiTone} onChange={e => setAiTone(e.target.value)} placeholder="warm, quietly confident" style={{
              width: "100%", padding: "10px 12px", background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--fg)", fontFamily: "inherit", fontSize: 13, outline: "none",
            }} />
            {aiErr && <div style={{ fontSize: 12, color: "#FF8DB5", marginTop: 10 }}>{aiErr}</div>}
            <button className="btn primary" style={{ marginTop: 16, width: "100%", justifyContent: "center" }} onClick={genCaptions} disabled={aiLoading}>
              <Icon.Sparkle size={13}/> {aiLoading ? "Generating…" : "Generate 3 variants"}
            </button>
            {aiCaptions.length > 0 && (
              <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.3 }}>Pick one</div>
                {aiCaptions.map((c, i) => (
                  <div key={i} className="card" style={{ padding: 14, cursor: "pointer" }} onClick={() => { setCaption(c); setAiOpen(false); }}>
                    <div style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{c}</div>
                    <div style={{ marginTop: 8, fontSize: 11, color: "var(--coral-2)" }}>Use this caption →</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Modal open={aiImgOpen} onClose={() => { if (!aiImgGenerating) { setAiImgOpen(false); setAiImgPreview(null); setAiImgPrompt(""); } }}
        title="Generate AI image" icon={<Icon.Sparkle size={18} style={{ color: "var(--coral)" }} />} width={520}>
        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 14 }}>
          Describe what you want to see — Orbit will generate a square image you can drop into your post.
        </div>
        <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.3, marginBottom: 6 }}>Prompt</div>
        <textarea value={aiImgPrompt} onChange={e => setAiImgPrompt(e.target.value)} placeholder="warm overhead shot of a leather-bound magazine on linen, golden hour"
          style={{ width: "100%", minHeight: 70, padding: "10px 12px", background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--fg)", fontFamily: "inherit", fontSize: 13, outline: "none", resize: "vertical" }} />
        {aiImgPreview && (
          <div style={{ marginTop: 14 }}>
            <img src={aiImgPreview} alt="" style={{ width: "100%", borderRadius: 10, display: "block" }} />
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button className="btn" onClick={generateAiImage} disabled={aiImgGenerating || !aiImgPrompt.trim()}>
            <Icon.Sparkle size={13}/> {aiImgGenerating ? "Generating…" : aiImgPreview ? "Regenerate" : "Generate"}
          </button>
          <div style={{ flex: 1 }} />
          <button className="btn" onClick={() => { setAiImgOpen(false); setAiImgPreview(null); setAiImgPrompt(""); }} disabled={aiImgGenerating}>Cancel</button>
          <button className="btn primary" onClick={useAiImage} disabled={!aiImgPreview}>Add to post</button>
        </div>
      </Modal>

      <Modal open={libOpen} onClose={() => setLibOpen(false)}
        title="From library" icon={<Icon.Folder size={18} style={{ color: "var(--coral)" }} />} width={620}>
        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 14 }}>
          Pick media from a previous post for {brandName}.
        </div>
        {libLoading && <div style={{ fontSize: 13, color: "var(--muted)", padding: 24, textAlign: "center" }}>Loading…</div>}
        {!libLoading && libPosts.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--muted)", padding: 24, textAlign: "center" }}>No posts yet. Save one first to reuse its media.</div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, maxHeight: 380, overflow: "auto" }}>
          {libPosts.map(p => {
            const url = p.media_urls?.[0];
            const onPick = () => {
              if (url) setMedia(m => [...m, url].slice(0, 10));
              else setMedia(m => [...m, `https://picsum.photos/seed/post-${p.id}/800/800`].slice(0, 10));
              setLibOpen(false);
            };
            return (
              <div key={p.id} onClick={onPick} style={{ cursor: "pointer" }}>
                <div style={{ aspectRatio: "1", borderRadius: 8, overflow: "hidden", background: "var(--ink-2)", border: "1px solid var(--line)" }}>
                  {url ? <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Placeholder seed={p.id} style={{ width: "100%", height: "100%", borderRadius: 0 }} />}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.caption?.slice(0, 40) || "(No caption)"}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      <Modal open={removeIdx !== null} onClose={() => setRemoveIdx(null)} title="Remove this slide?" width={400}
        footer={<>
          <button className="btn" onClick={() => setRemoveIdx(null)}>Cancel</button>
          <button className="btn primary" style={{ background: "#FF5A5A", borderColor: "#FF5A5A" }}
            onClick={() => { setMedia(m => m.filter((_, i) => i !== removeIdx)); setRemoveIdx(null); }}>Remove</button>
        </>}>
        <div style={{ fontSize: 13.5, color: "var(--fg-dim)" }}>The slide will be removed from this post. You can add it again from your library or by re-uploading.</div>
      </Modal>

      <Modal open={!!notice} onClose={() => setNotice(null)} title={notice?.title} width={420}
        footer={<button className="btn primary" onClick={() => setNotice(null)}>OK</button>}>
        {notice?.body && <div style={{ fontSize: 13.5, color: "var(--fg-dim)", lineHeight: 1.55 }}>{notice.body}</div>}
      </Modal>
    </>
  );
}
