// Conversational AI Assistant
function AssistantScreen() {
  const msgs = [
    {r:'u', t:'Plan my next 7 days of content for Luma Studio.'},
    {r:'a', t:'Here\'s a 7-day plan that\'s on track for your +10k follower goal. I\'ve pulled from your Issue 04 campaign and two trending clusters (#slowmaking, #behindthelens).', plan: true},
    {r:'u', t:'Make the Friday post funnier.'},
    {r:'a', t:'Rewrote with a drier, in-joke tone — closer to your Oct 2025 winners. Want me to apply it?', suggest: true},
  ];
  return (
    <div className="orbit" style={{ width: 1440, height: 900, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="assistant" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title="Ask Orbit" sub="Your AI social manager · learned from 284 of your posts">
          <div className="chip lime"><span className="dot"/> Online · GPT-fine-tuned on your brand</div>
          <button className="btn">New chat</button>
        </TopBar>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr 320px', overflow: 'hidden' }}>
          {/* History */}
          <div style={{ padding: 18, borderRight: '1px solid var(--line)', overflowY: 'auto', background: '#09090B' }}>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 10 }}>Today</div>
            {['Plan next 7 days · Luma','Improve Friday caption','Competitor teardown · Arc & Oak','Why is Threads slowing down?'].map((c,i) => (
              <div key={i} style={{ padding: '9px 11px', borderRadius: 8, background: i === 0 ? 'rgba(255,90,31,0.08)' : 'transparent', color: i === 0 ? 'var(--fg)' : 'var(--fg-dim)', fontSize: 12.5, marginBottom: 2, cursor: 'pointer', fontWeight: i===0?500:400 }}>{c}</div>
            ))}
            <div style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: 1.3, textTransform: 'uppercase', margin: '16px 0 10px' }}>Yesterday</div>
            {['Refresh Ritual drop hashtags','Cross-post Instagram to Threads','Kinfolk weekend plan'].map((c,i) => (
              <div key={i} style={{ padding: '9px 11px', borderRadius: 8, color: 'var(--fg-dim)', fontSize: 12.5, cursor: 'pointer' }}>{c}</div>
            ))}
          </div>

          {/* Chat */}
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px 44px' }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 24, flexDirection: m.r === 'u' ? 'row-reverse' : 'row' }}>
                  {m.r === 'a' ? (
                    <div style={{ width: 34, height: 34, borderRadius: 17, background: 'linear-gradient(135deg, var(--coral), var(--lime))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', color: '#0E0E10', fontSize: 16 }}>O</div>
                  ) : (
                    <div className="av" style={{ width: 34, height: 34, borderRadius: 17, background: 'var(--violet)', color: '#fff', fontSize: 12, flexShrink: 0 }}>NI</div>
                  )}
                  <div style={{ maxWidth: 560 }}>
                    <div style={{
                      padding: '14px 18px', borderRadius: 14,
                      background: m.r === 'u' ? 'var(--coral)' : 'var(--ink-2)',
                      color: m.r === 'u' ? '#fff' : 'var(--fg)',
                      border: m.r === 'u' ? 'none' : '1px solid var(--line)',
                      fontSize: 14, lineHeight: 1.55,
                    }}>{m.t}</div>

                    {m.plan && (
                      <div className="card" style={{ padding: 16, marginTop: 10 }}>
                        <div style={{ fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: 'var(--muted)' }}>7-day plan</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                          {[
                            {d:'Mon', p:'IG Reel · "Behind the lens" ep.1', t:'6pm'},
                            {d:'Tue', p:'Threads · craft-notes · 3 posts', t:'9am'},
                            {d:'Wed', p:'LinkedIn · slow design thesis', t:'10am'},
                            {d:'Thu', p:'IG Carousel · Issue 04 teaser', t:'6pm'},
                            {d:'Fri', p:'IG + FB · Cover reveal ★', t:'10:30am'},
                            {d:'Sat', p:'Threads · maker spotlight', t:'11am'},
                            {d:'Sun', p:'IG Story series · studio diary', t:'7pm'},
                          ].map((x, j) => (
                            <div key={j} style={{ display: 'flex', gap: 12, padding: '6px 0', fontSize: 13, borderTop: j === 0 ? 'none' : '1px solid var(--line)' }}>
                              <div className="numeral" style={{ color: 'var(--muted)', width: 36 }}>{x.d}</div>
                              <div style={{ flex: 1 }}>{x.p}</div>
                              <div className="numeral" style={{ color: 'var(--muted)', fontSize: 11 }}>{x.t}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                          <button className="btn primary" style={{ padding: '6px 12px', fontSize: 12 }}>Add to calendar</button>
                          <button className="btn" style={{ padding: '6px 12px', fontSize: 12 }}>Edit plan</button>
                          <button className="btn ghost" style={{ padding: '6px 12px', fontSize: 12 }}>Regenerate</button>
                        </div>
                      </div>
                    )}
                    {m.suggest && (
                      <div className="card" style={{ padding: 14, marginTop: 10, background: 'rgba(212,255,58,0.05)', borderColor: 'rgba(212,255,58,0.2)' }}>
                        <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>"Cover reveal tomorrow. Yes, we're nervous. No, you can't see it yet. Friday 10:30."</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                          <button className="btn lime" style={{ padding: '5px 10px', fontSize: 11 }}>Apply</button>
                          <button className="btn ghost" style={{ padding: '5px 10px', fontSize: 11 }}>Try again</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', color: 'var(--muted)', fontSize: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 17, background: 'linear-gradient(135deg, var(--coral), var(--lime))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', color: '#0E0E10', fontSize: 16 }}>O</div>
                <div style={{ display:'flex', gap: 4 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--muted)', animation: `bounce 1.2s ease-in-out ${i*0.15}s infinite` }}/>)}
                </div>
                <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)} }`}</style>
              </div>
            </div>

            {/* Composer */}
            <div style={{ padding: '16px 44px 24px' }}>
              <div className="card" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                <Icon.Sparkle size={16} style={{ color: 'var(--lime)' }}/>
                <input placeholder="Try: 'Improve my Friday caption' or 'What should I post tomorrow?'" style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--fg)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}/>
                <button className="btn ghost" style={{ padding: 6 }}><Icon.Image size={14}/></button>
                <button className="btn primary" style={{ padding: '8px 12px' }}><Icon.Send size={13}/></button>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                {['Analyze last week','Draft 3 Threads','Why did Tue reel pop?','Repurpose top post'].map(s => <div key={s} className="chip" style={{ cursor: 'pointer', fontSize: 11 }}>{s}</div>)}
              </div>
            </div>
          </div>

          {/* Context panel */}
          <div style={{ padding: 20, borderLeft: '1px solid var(--line)', background: '#09090B', overflowY: 'auto' }}>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 10 }}>Current context</div>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Brand</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Luma Studio</div>
            </div>
            <div className="card" style={{ padding: 14, marginTop: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Active goal</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>+10k followers by May 1</div>
              <div className="chip lime" style={{ marginTop: 8, fontSize: 10 }}>84% · on track</div>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: 1.3, textTransform: 'uppercase', margin: '18px 0 10px' }}>What I know</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--fg-dim)' }}>
              {[
                '284 past posts indexed',
                '38 top performers analyzed',
                'Your voice: warm, crafted, dry',
                'Peak window: Tue/Thu 6–8pm',
                '5 connected accounts',
              ].map(x => (<div key={x} style={{ display:'flex', gap: 8, alignItems:'center' }}><Icon.Check size={11} style={{ color: 'var(--lime)' }}/>{x}</div>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { AssistantScreen });
