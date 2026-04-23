// Automations — event-triggered workflows
function AutomationsScreen() {
  return (
    <div className="orbit" style={{ width: 1440, height: 900, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="automations" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title="Automations" sub="If this, then Orbit">
          <div className="chip lime"><span className="dot"/> 7 active · 142 runs this week</div>
          <button className="btn">Templates</button>
          <button className="btn primary"><Icon.Plus size={14}/> New automation</button>
        </TopBar>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 48px' }}>
          <h1 className="display" style={{ fontSize: 52, margin: '0 0 6px', lineHeight: 1.02 }}>
            Rules that <span style={{ color: 'var(--violet)' }}>run themselves</span>.
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>When Orbit sees a signal, it takes the action you approved once.</p>

          {/* Active automations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 28 }}>
            {[
              {
                name: 'Promote winning posts',
                trigger: 'Post hits 2× baseline engagement in 1h',
                action: 'Auto-cross-post to Threads + LinkedIn',
                runs: 24, on: true, c: 'var(--lime)',
                savings: '4.2h',
              },
              {
                name: 'Pause fatigued content',
                trigger: 'CTR drops 18% over 3 re-posts',
                action: 'Pause · notify me · suggest refresh',
                runs: 8, on: true, c: 'var(--coral)',
                savings: '2.1h',
              },
              {
                name: 'Reply to top mentions',
                trigger: 'Mention from verified or 10k+ follower account',
                action: 'Draft reply in your voice · send to approval',
                runs: 18, on: true, c: 'var(--violet)',
                savings: '6.8h',
              },
              {
                name: 'Trending hashtag injector',
                trigger: 'Hashtag in your cluster trending >300% wk/wk',
                action: 'Add to next 4 drafts matching topic',
                runs: 12, on: true, c: 'var(--sky)',
                savings: '1.4h',
              },
              {
                name: 'Friday recap',
                trigger: 'Every Friday 4pm',
                action: 'Post week summary to team Slack + draft IG story',
                runs: 4, on: true, c: 'var(--lime)',
                savings: '1.2h',
              },
              {
                name: 'Competitor mirror',
                trigger: '@arc_and_oak posts in our niche',
                action: 'Alert me + draft differentiated response',
                runs: 6, on: false, c: 'var(--muted)',
                savings: '0h',
              },
            ].map((a, i) => (
              <div key={i} className="card" style={{ padding: 20, opacity: a.on ? 1 : 0.65 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', display: 'flex', alignItems:'center', justifyContent:'center', color: a.c }}>
                    <Icon.Sparkle size={15}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 500 }}>{a.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }} className="numeral">{a.runs} runs · saved {a.savings} this week</div>
                  </div>
                  {/* Toggle */}
                  <div style={{ width: 34, height: 20, borderRadius: 10, background: a.on ? 'var(--lime)' : 'var(--line-2)', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ position: 'absolute', top: 2, left: a.on ? 16 : 2, width: 16, height: 16, borderRadius: 8, background: '#0E0E10', transition: 'left 0.15s' }}/>
                  </div>
                </div>

                <div style={{ marginTop: 16, padding: 12, background: 'var(--ink-2)', borderRadius: 8, border: '1px solid var(--line)' }}>
                  <div style={{ display:'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                    <div className="chip" style={{ fontSize: 9.5, background: 'rgba(255,90,31,0.1)', borderColor: 'rgba(255,90,31,0.3)', color: 'var(--coral-2)', padding: '2px 6px' }}>IF</div>
                    <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.45 }}>{a.trigger}</div>
                  </div>
                  <div style={{ display:'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div className="chip" style={{ fontSize: 9.5, background: 'rgba(212,255,58,0.1)', borderColor: 'rgba(212,255,58,0.3)', color: 'var(--lime)', padding: '2px 6px' }}>THEN</div>
                    <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.45 }}>{a.action}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Build-your-own */}
          <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18 }}>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon.Sparkle size={14} style={{ color: 'var(--lime)' }}/>
                <div style={{ fontSize: 11, color: 'var(--lime)', letterSpacing: 1.3, textTransform: 'uppercase' }}>Natural language builder</div>
              </div>
              <h3 className="display" style={{ fontSize: 28, margin: '12px 0 16px', lineHeight: 1.1 }}>Describe it. I'll build it.</h3>
              <div className="card" style={{ padding: 14, background: 'var(--ink-2)' }}>
                <div style={{ fontSize: 14, fontFamily: 'JetBrains Mono, monospace', color: 'var(--fg)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--muted)' }}>{'>'} </span>
                  <span>When a competitor posts about sustainability, draft 3 angles for our next post that are </span>
                  <span style={{ background: 'rgba(212,255,58,0.15)', padding: '0 2px', color: 'var(--lime)' }}>more specific and personal</span>
                  <span>, and alert me within an hour.</span>
                  <span style={{ display: 'inline-block', width: 8, height: 16, background: 'var(--lime)', marginLeft: 2, verticalAlign: 'middle', animation: 'blink 1s steps(2) infinite' }}/>
                </div>
                <style>{`@keyframes blink { 50% { opacity: 0 } }`}</style>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button className="btn primary"><Icon.Sparkle size={13}/> Build automation</button>
                <button className="btn ghost">See examples</button>
              </div>

              <div style={{ marginTop: 18, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: 'var(--muted)' }}>Orbit proposes</div>
              <div style={{ marginTop: 10, padding: 14, background: 'var(--ink-2)', borderRadius: 10, border: '1px dashed var(--line-2)' }}>
                <div style={{ fontSize: 13, lineHeight: 1.55 }}>
                  <b>Trigger:</b> @arc_and_oak, @kinfolk_co, @common_wares posts with keywords [sustainability, repair, reuse, craft]<br/>
                  <b>Action:</b> Generate 3 drafts using your voice + a concrete studio detail. Post to "To approve". Ping Slack #social.<br/>
                </div>
                <div style={{ display:'flex', gap: 6, marginTop: 10, flexWrap:'wrap' }}>
                  {['edit trigger','edit tone','add channel','test it'].map(c => <div key={c} className="chip" style={{ fontSize: 10 }}>{c}</div>)}
                </div>
              </div>
            </div>

            {/* Templates */}
            <div>
              <div style={{ fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Templates</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  {t:'Crisis mode', d:'Pause all posts + alert manager when mentions spike negative', c:'var(--coral)'},
                  {t:'Content recycle', d:'Repost top performers after 90 days, refreshed', c:'var(--lime)'},
                  {t:'Weekly client report', d:'Auto-generate PDF for each brand, send Monday', c:'var(--violet)'},
                  {t:'First-comment fixer', d:'Drop hashtags in first comment on IG automatically', c:'var(--sky)'},
                  {t:'Timezone drift', d:'Adjust queue to audience timezone shifts', c:'var(--coral)'},
                ].map((t, i) => (
                  <div key={i} className="card" style={{ padding: 14, display: 'flex', gap: 12, alignItems:'center', cursor: 'pointer' }}>
                    <div style={{ width: 4, height: 30, background: t.c, borderRadius: 2 }}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{t.t}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{t.d}</div>
                    </div>
                    <Icon.Plus size={14} style={{ opacity: 0.5 }}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { AutomationsScreen });
