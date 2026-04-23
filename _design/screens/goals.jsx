// Goals — set growth targets, AI builds strategy
function GoalsScreen() {
  return (
    <div className="orbit" style={{ width: 1440, height: 900, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="goals" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title="Goals" sub="What should Orbit optimize for?">
          <button className="btn">Templates</button>
          <button className="btn primary"><Icon.Plus size={14}/> New goal</button>
        </TopBar>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 48px' }}>
          <h1 className="display" style={{ fontSize: 56, margin: '0 0 8px', lineHeight: 1 }}>
            Tell us <span style={{ color: 'var(--coral)' }}>what winning</span> looks like.
          </h1>
          <p style={{ fontSize: 15, color: 'var(--fg-dim)', maxWidth: 600 }}>Orbit will build a content strategy, posting cadence, and format mix to hit each target.</p>

          {/* Active goals */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 28 }}>
            {[
              {icon:Icon.Users, label:'Followers', q:'+10k by May 1', cur: 8412, tgt: 10000, pct: 84, status:'on-track', c:'var(--coral)', forecast:'+11.2k'},
              {icon:Icon.Heart, label:'Engagement rate', q:'Avg 8% across IG & Threads', cur: 6.8, tgt: 8, pct: 85, status:'on-track', c:'var(--lime)', forecast:'7.9%'},
              {icon:Icon.ArrowUpRight, label:'Traffic', q:'30k clicks to shop', cur: 18200, tgt: 30000, pct: 61, status:'at-risk', c:'var(--rose)', forecast:'24.8k'},
            ].map((g, i) => (
              <div key={i} className="card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)', display: 'flex', alignItems:'center', justifyContent: 'center', color: g.c }}><g.icon size={15}/></div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{g.label}</div>
                  <div style={{ flex: 1 }}/>
                  <div className="chip" style={{ color: g.status === 'on-track' ? 'var(--lime)' : 'var(--coral-2)', borderColor: g.status === 'on-track' ? 'rgba(212,255,58,0.3)' : 'rgba(255,90,31,0.3)' }}>{g.status === 'on-track' ? '● on track' : '◐ at risk'}</div>
                </div>
                <div className="display" style={{ fontSize: 28, marginTop: 14, lineHeight: 1.1 }}>{g.q}</div>
                <div style={{ marginTop: 18, height: 6, background: 'var(--ink-3)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${g.pct}%`, height: '100%', background: g.c }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginTop: 8, color: 'var(--muted)' }}>
                  <span className="numeral">{g.pct}% · forecast {g.forecast}</span>
                  <span>8 days left</span>
                </div>
              </div>
            ))}
          </div>

          {/* Strategy — AI-built */}
          <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon.Sparkle size={14} style={{ color: 'var(--lime)' }}/>
                <div style={{ fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: 'var(--lime)' }}>AI-generated strategy · Luma</div>
                <div style={{ flex: 1 }}/>
                <button className="btn ghost" style={{ padding: '6px 10px', fontSize: 12 }}>Regenerate</button>
              </div>
              <h3 className="display" style={{ fontSize: 36, margin: '12px 0 16px', lineHeight: 1.05 }}>Ship 3 reels a week, lean into "behind the lens"</h3>
              <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
                {[
                  {n:'01', t:'Shift IG mix to 65% Reels / 25% Carousel / 10% Static', why:'Reels are 3.4× your static baseline — momentum compounding weekly.'},
                  {n:'02', t:'Double Threads posting to 5×/week', why:'Fastest-growing channel (+42% this week) with low saturation.'},
                  {n:'03', t:'Launch "Behind the lens" weekly series on Tuesdays 6pm', why:'Tue 6pm is peak · series content drives 2.1× follower conversion.'},
                  {n:'04', t:'Collaborate with 2 maker accounts under #slowmaking', why:'Cluster overlap with your audience · +1.8k est. new reach.'},
                ].map((s, i) => (
                  <div key={i} style={{ display:'flex', gap: 14, padding: '10px 0' }}>
                    <div className="display numeral" style={{ fontSize: 28, color: 'var(--muted-2)', width: 40 }}>{s.n}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{s.t}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3, lineHeight: 1.5 }}>{s.why}</div>
                    </div>
                    <Icon.Check size={14} style={{ color: 'var(--lime)' }}/>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button className="btn primary">Apply strategy</button>
                <button className="btn">Edit</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="card" style={{ padding: 18 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.3 }}>Cadence plan</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px 16px', marginTop: 14, fontSize: 13 }}>
                  <div style={{ color: 'var(--muted)' }}>Reels / week</div><div className="numeral" style={{ fontWeight: 500 }}>3</div>
                  <div style={{ color: 'var(--muted)' }}>Carousels / week</div><div className="numeral" style={{ fontWeight: 500 }}>2</div>
                  <div style={{ color: 'var(--muted)' }}>Threads posts / week</div><div className="numeral" style={{ fontWeight: 500 }}>5</div>
                  <div style={{ color: 'var(--muted)' }}>LinkedIn threads / wk</div><div className="numeral" style={{ fontWeight: 500 }}>2</div>
                  <div style={{ color: 'var(--muted)' }}>YouTube / month</div><div className="numeral" style={{ fontWeight: 500 }}>1</div>
                </div>
              </div>

              <div className="card" style={{ padding: 18 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.3 }}>Audience to grow</div>
                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['design-curious 25–34','makers + studios','slow-living EU','independent retailers','zine readers'].map(t => (
                    <div key={t} className="chip" style={{ fontSize: 11 }}>{t}</div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 18, background: 'linear-gradient(135deg, rgba(107,92,255,0.08), rgba(255,90,31,0.05))' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.3 }}>Constraints</div>
                <div style={{ fontSize: 13, marginTop: 10, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
                  No sponsored content · No political topics · Voice: warm, crafted, not corporate · Avoid emoji clusters
                </div>
                <button className="btn ghost" style={{ padding: '5px 10px', fontSize: 11, marginTop: 10 }}>Edit guardrails</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { GoalsScreen });
