import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TopBar } from "../lib/shared";
import { Icon } from "../lib/icons";
import { api, type ChatMessage } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const SUGGESTIONS = [
  "What's my best-performing Instagram post from the last 30 days?",
  "Compare engagement rate across all my brands this month.",
  "Which goals are off track right now and why?",
  "When should I post on LinkedIn for peak engagement?",
  "How is Kinfolk Coffee's reach trending vs last month?",
];

type ToolCall = { name: string; input: unknown; result: unknown };

export default function Assistant() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [messages, setMessages] = useState<(ChatMessage & { tool_calls?: ToolCall[] })[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setErr("");
    const next: ChatMessage[] = [...messages.map(m => ({ role: m.role, content: m.content })), { role: "user", content: trimmed }];
    setMessages(m => [...m, { role: "user", content: trimmed }]);
    setInput("");
    setBusy(true);
    try {
      const { data } = await api.post<{ reply: string; tool_calls: ToolCall[] }>("/ai/chat", { messages: next });
      setMessages(m => [...m, { role: "assistant", content: data.reply, tool_calls: data.tool_calls }]);
    } catch (e: any) {
      setErr(e.response?.data?.detail ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  // auto-submit ?q= from URL (triggered from Goals page "Ask Orbit why")
  useEffect(() => {
    const q = params.get("q");
    if (q && messages.length === 0) {
      setInput(q);
      // submit on next tick so UI renders first
      const id = setTimeout(() => { send(q); params.delete("q"); setParams(params, { replace: true }); }, 60);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, busy]);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <>
      <TopBar title="Ask Orbit" sub="Your social-native assistant">
        <div className="chip violet"><Icon.Sparkle size={11}/> Claude · live data tools</div>
        {messages.length > 0 && <button className="btn" onClick={() => setMessages([])}><Icon.X size={13}/> New chat</button>}
      </TopBar>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", minHeight: "calc(100vh - 80px)" }}>
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: "24px 32px 12px" }}>
            {messages.length === 0 ? (
              <div style={{ maxWidth: 620, margin: "40px auto 0", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 1.4 }}>Orbit AI</div>
                <div className="display" style={{ fontSize: 52, lineHeight: 1.0, marginTop: 10 }}>Hey {firstName} — ask me anything about your social.</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 16, lineHeight: 1.55 }}>
                  I can query your metrics, compare brands, surface top posts, and explain what's driving your goals. I never make up numbers.
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
                {messages.map((m, i) => <MessageBubble key={i} message={m} />)}
                {busy && <ThinkingBubble />}
                {err && <div style={{ color: "#FF8DB5", fontSize: 13, padding: "8px 14px", background: "rgba(255,77,143,0.08)", borderRadius: 10, border: "1px solid rgba(255,77,143,0.25)" }}>{err}</div>}
              </div>
            )}
          </div>

          <div style={{ borderTop: "1px solid var(--line)", padding: "16px 32px", background: "var(--ink)" }}>
            <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
                }}
                placeholder="Ask about your metrics, posts, goals…"
                rows={1}
                style={{
                  flex: 1, resize: "none", padding: "12px 14px", background: "var(--ink-2)",
                  border: "1px solid var(--line)", borderRadius: 12, color: "var(--fg)",
                  fontFamily: "inherit", fontSize: 14, outline: "none", lineHeight: 1.4,
                  minHeight: 44, maxHeight: 160,
                }}
              />
              <button className="btn primary" onClick={() => send(input)} disabled={busy || !input.trim()} style={{ height: 44 }}>
                <Icon.Send size={14}/> Send
              </button>
            </div>
          </div>
        </div>

        <div style={{ borderLeft: "1px solid var(--line)", padding: "24px 20px", background: "#F3F1EA" }}>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.3, marginBottom: 12 }}>Try asking</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SUGGESTIONS.map(s => (
              <div key={s} onClick={() => send(s)} style={{
                padding: "10px 12px", background: "var(--ink-2)", border: "1px solid var(--line)",
                borderRadius: 10, fontSize: 12.5, lineHeight: 1.4, cursor: "pointer",
                color: "var(--fg-dim)",
              }}>
                {s}
              </div>
            ))}
          </div>
          <div className="hr" style={{ margin: "20px 0" }}/>
          <div style={{ fontSize: 11, color: "var(--muted-2)", lineHeight: 1.5 }}>
            Orbit AI uses live tools to read your metrics, posts, and goals. It only cites numbers it can verify.
          </div>
        </div>
      </div>
    </>
  );
}

function MessageBubble({ message }: { message: ChatMessage & { tool_calls?: ToolCall[] } }) {
  const isUser = message.role === "user";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 6 }}>
      <div style={{
        maxWidth: "82%",
        padding: "12px 16px",
        borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
        background: isUser ? "var(--coral)" : "var(--ink-2)",
        color: isUser ? "#fff" : "var(--fg)",
        border: isUser ? "none" : "1px solid var(--line)",
        fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-wrap",
      }}>
        {message.content}
      </div>
      {!isUser && message.tool_calls && message.tool_calls.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxWidth: "82%" }}>
          {message.tool_calls.map((t, i) => (
            <div key={i} className="chip violet" style={{ fontSize: 10 }}>
              <Icon.Sparkle size={9}/> {t.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", border: "1px solid var(--line)", background: "var(--ink-2)", borderRadius: "14px 14px 14px 4px", width: "fit-content" }}>
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2].map(i => <Dot key={i} delay={i * 0.15} />)}
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>Orbit is thinking…</div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span style={{
      width: 6, height: 6, borderRadius: 3, background: "var(--coral)",
      animation: `pulse 1.2s ${delay}s infinite ease-in-out`,
    }} />
  );
}
