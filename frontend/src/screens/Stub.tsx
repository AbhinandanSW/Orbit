import { TopBar } from "../lib/shared";
import { Icon } from "../lib/icons";

export function makeStub(title: string, sub: string, tagline: string, color: string) {
  return function StubScreen() {
    return (
      <>
        <TopBar title={title} sub={sub} />
        <div style={{ padding: "40px 28px 48px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div className="card" style={{ padding: 48, maxWidth: 560, textAlign: "center", background: `linear-gradient(135deg, ${color}22, transparent)`, borderColor: `${color}44` }}>
            <Icon.Sparkle size={28} style={{ color }} />
            <div className="display" style={{ fontSize: 40, lineHeight: 1.05, marginTop: 14 }}>
              {title} is on the way.
            </div>
            <div style={{ fontSize: 13.5, color: "var(--fg-dim)", marginTop: 14, lineHeight: 1.55 }}>
              {tagline}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 22, letterSpacing: 1.2, textTransform: "uppercase" }}>Preview · Not yet wired to backend</div>
          </div>
        </div>
      </>
    );
  };
}

export const Autopilot = makeStub("Autopilot", "AI agent · managing your queue", "Let Orbit draft, schedule, and iterate across your brands — you steer, it rows.", "#6B5CFF");
export const Automations = makeStub("Automations", "Rule-based workflows", "If-this-then-that across your feed — approve, escalate, re-queue, auto-reply.", "#5AC8FF");
export const Predict = makeStub("Predict", "Forecast engagement before publish", "See expected reach and engagement for each candidate post — pick the one most likely to land.", "#FF4D8F");
export const Dna = makeStub("Brand DNA", "Your style guide, encoded", "Tone, palette, reference posts — Orbit uses your DNA to stay on brand without you repeating yourself.", "#D4FF3A");
