// Autopilot control center — the new home. AI agent status + what it's doing now.
function AutopilotScreen() {
  return (
    <div className="orbit" style={{ width: 1440, height: 900, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="autopilot" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title="Autopilot" sub="Luma Studio · learning · engine v4.2">
          <div className="chip lime"><span className="dot"/> ON · Balanced mode</div>
          <button className="btn">Manual override</button>
          <button className="btn primary"><Icon.Sparkle size={14}/> Ask Orbit</button>
        </TopBar>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 48px' }}>
          {/* Hero — agent status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18, marginBottom: 18 }}>
            <div className="card" style={{ padding: 28, background: 'radial-gradient(800px 300px at 10% 0%, rgba(212,255,58,0.1), transparent), linear-gradient(135deg, #1A1A1E, #0E0E10)', borderColor: 'rgba(212,255,58,0.25)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ position: 'relative', width: 10, height: 10 }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 5, background: 'var(--lime)', animation: 'pulse 2s ease-in-out infinite' }}/>
                </div>
                <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--lime)' }}>Autopilot · live</div>
                <div style={{ flex: 1 }}/>
                <div className="chip">v4.2 · 98% confidence</div>
              </div>
              <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>

              <h1 className="display" style={{ fontSize: 56, margin: '16px 0 0', lineHeight: 1.02 }}>
                I'm <span style={{ color: 'var(--lime)' }}>drafting 3 posts</span> for tomorrow and watching your Tuesday reel — engagement is climbing 2.4× faster than usual.
              </h1>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 18 }}>Next decision in 12 min · Thu 6pm queue slot</div>

              {/* Action chips */}
              <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
                {['Pause autopilot','Edit style','Adjust goals','See reasoning'].map(a => (
                  <div key={a} className="chip" style={{ padding: '6px 12px', cursor: 'pointer' }}>{a}</div>
                ))}
              </div>
            </div>

            {/* Mode selector */}
            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1.3, textTransform: 'uppercase' }}>Autonomy level</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
                {[
                  {l:'Manual', sub:'I only suggest. You approve each step.', sel:false},
                  {l:'Co-pilot', sub:'I draft and schedule; you approve before publish.', sel:false},
                  {l:'Balanced', sub:'I publish low-risk, ask for cover posts.', sel:true},
                  {l:'Full autopilot', sub:'I decide and post. You audit weekly.', sel:false, experimental:true},
                ].map((m, i) => (
                  <div key={i} style={{
                    padding: '12px 14px', borderRadius: 10,
                    background: m.sel ? 'rgba(212,255,58,0.08)' : 'var(--ink-2)',
                    border: '1px solid ' + (m.sel ? 'var(--lime)' : 'var(--line)'),
                    display: 'flex', gap: 12, alignItems: 'center',
                  }}>
                    <div style={{ width: 14, height: 14, borderRadius: 7, border: '1.5px solid ' + (m.sel ? 'var(--lime)' : 'var(--line-2)'), background: m.sel ? 'var(--lime)' : 'transparent' }}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, display:'flex', gap: 8, alignItems:'center' }}>
                        {m.l}
                        {m.experimental && <span className="chip" style={{ fontSize: 9, padding: '0 6px' }}>experimental</span>}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{m.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity stream + goals sidecar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
            {/* What the agent did */}
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>Recent agent actions</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Every decision is logged and reversible</div>
                </div>
                <div style={{ flex: 1 }}/>
                <div className="chip"><Icon.Clock size={11}/> Last 24h</div>
              </div>
              <div className="hr"/>
              {[
                { time: '12m ago', title: 'Rescheduled "Trail notes pt.2" to Thu 6pm', why: 'Tuesdays converting 3.4× better for Verge.', action: 'scheduled', icon: Icon.Calendar, c: 'var(--coral)' },
                { time: '48m ago', title: 'Drafted 3 posts for Luma · awaiting approval', why: 'Content DNA match 94% — matches last 30 winners.', action: 'drafted', icon: Icon.Pen, c: 'var(--violet)' },
                { time: '2h ago', title: 'Repurposed IG reel → YouTube Short + LinkedIn clip', why: 'Reel hit 2.4× baseline engagement within 1h.', action: 'repurposed', icon: Icon.Sparkle, c: 'var(--lime)' },
                { time: '4h ago', title: 'Paused "Ritual drop · reminder 4" — audience fatigue signal', why: 'CTR falling 18% per re-post. Will resume Friday.', action: 'paused', icon: Icon.X, c: 'var(--rose)' },
                { time: '6h ago', title: 'Added #slowmaking to 4 upcoming posts', why: 'Trending in audience cluster (+420% this week).', action: 'tagged', icon: Icon.Hash, c: 'var(--sky)' },
                { time: 'Yesterday', title: 'Published "Pour-over bar" · reached 84k', why: 'Kinfolk queue slot. Beat forecast by +22%.', action: 'published', icon: Icon.Check, c: 'var(--lime)' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 22px', borderTop: i === 0 ? 'none' : '1px solid var(--line)', alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.c, flexShrink: 0 }}><a.icon size={14}/></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3, lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--lime)' }}>Why:</span> {a.why}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted-2)', whiteSpace: 'nowrap' }}>{a.time}</div>
                  <Icon.ArrowUpRight size={14} style={{ opacity: 0.4, cursor: 'pointer' }}/>
                </div>
              ))}
            </div>

            {/* Goal progress + predictions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                  <Icon.Crown size={14} style={{ color: 'var(--coral)' }}/>
                  <div style={{ fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: 'var(--muted)' }}>Primary goal · April</div>
                </div>
                <div className="display" style={{ fontSize: 30, marginTop: 8, lineHeight: 1.05 }}>
                  Reach <span className="numeral" style={{ color: 'var(--coral)' }}>+10k</span> followers by May 1
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap: 10, marginTop: 14 }}>
                  <div className="numeral" style={{ fontSize: 42, fontWeight: 500 }}>8,412</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>/ 10,000</div>
                  <div style={{ flex:1 }}/>
                  <div className="chip lime">on track</div>
                </div>
                <div style={{ marginTop: 10, height: 6, background: 'var(--ink-3)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '84%', height: '100%', background: 'linear-gradient(90deg, var(--coral), var(--lime))' }}/>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 8 }}>Forecast: <span style={{ color: 'var(--fg)' }}>+11.2k</span> by May 1 · +12% buffer</div>
              </div>

              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: 'var(--muted)' }}>Autopilot impact · 30 days</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 14 }}>
                  {[
                    {v:'+142', l:'posts published', c:'var(--fg)'},
                    {v:'28h', l:'time saved', c:'var(--lime)'},
                    {v:'+38%', l:'engagement lift', c:'var(--coral)'},
                  ].map((s,i) => (
                    <div key={i}>
                      <div className="display numeral" style={{ fontSize: 34, lineHeight: 1, color: s.c }}>{s.v}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next best actions */}
              <div className="card" style={{ padding: 20, flex: 1 }}>
                <div style={{ display:'flex', alignItems:'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Recommended next</div>
                  <div style={{ flex: 1 }}/>
                  <Icon.Sparkle size={14} style={{ color: 'var(--lime)' }}/>
                </div>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    {t:'Approve 3 drafts for tomorrow', sub:'Content DNA match 94%'},
                    {t:'Connect Threads for Verge', sub:'Missed growth channel · +1.2k/mo est.'},
                    {t:'Extend winning Reel → carousel', sub:'85% chance to repeat top-10 perf.'},
                  ].map((r,i) => (
                    <div key={i} style={{ display:'flex', gap: 10, padding: '10px 12px', background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 9, alignItems: 'center' }}>
                      <div style={{ fontSize: 12.5, flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{r.t}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{r.sub}</div>
                      </div>
                      <button className="btn primary" style={{ padding: '5px 10px', fontSize: 11 }}>Do it</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { AutopilotScreen });
