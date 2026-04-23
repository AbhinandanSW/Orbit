// Content DNA — the brand voice fingerprint Orbit learned
function DNAScreen() {
  return (
    <div className="orbit" style={{ width: 1440, height: 900, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="autopilot" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title="Content DNA" sub="What Orbit learned about Luma Studio">
          <div className="chip lime"><span className="dot"/> 284 posts analyzed</div>
          <button className="btn">Retrain</button>
          <button className="btn primary">Export voice</button>
        </TopBar>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24, alignItems:'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1.3, textTransform: 'uppercase' }}>Voice fingerprint</div>
              <h1 className="display" style={{ fontSize: 68, margin: '8px 0 0', lineHeight: 0.98 }}>
                Warm. Crafted. <span style={{ fontStyle: 'italic', color: 'var(--coral)' }}>A little dry.</span>
              </h1>
              <p style={{ fontSize: 15, color: 'var(--fg-dim)', margin: '14px 0 0', maxWidth: 560, lineHeight: 1.6 }}>
                Your audience responds to understatement, process stories, and specific sensory details. Long copy out-performs short by 1.6×. You rarely use emoji — and it's working.
              </p>

              {/* Voice axes */}
              <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 640 }}>
                {[
                  {l:'Formal', r:'Casual', pos:72},
                  {l:'Playful', r:'Serious', pos:38},
                  {l:'Sparse', r:'Descriptive', pos:78},
                  {l:'Corporate', r:'Personal', pos:88},
                  {l:'Hype', r:'Understated', pos:82},
                  {l:'Generic', r:'Niche', pos:75},
                ].map((a, i) => (
                  <div key={i}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                      <span>{a.l}</span>
                      <span>{a.r}</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--ink-3)', borderRadius: 2, position:'relative' }}>
                      <div style={{ position: 'absolute', left: `${a.pos}%`, top: -4, width: 12, height: 12, borderRadius: 6, background: 'var(--lime)', transform: 'translateX(-50%)', boxShadow: '0 0 0 3px rgba(212,255,58,0.2)' }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vocabulary cloud + style rules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="card" style={{ padding: 22 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1.3, textTransform: 'uppercase' }}>Signature phrases</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {[
                    {t:'slow-made', s: 26},{t:'in the studio', s:22},{t:'pour-over', s:20},{t:'small batch', s:18},
                    {t:'quiet', s:17},{t:'hand-set', s:14},{t:'the good stuff', s:13},{t:'we\'re back', s:12},
                    {t:'honestly', s:11},{t:'morning light', s:11},{t:'issue no.', s:10},{t:'matte', s:9},
                  ].map(w => (
                    <div key={w.t} style={{ padding: `${w.s/2}px ${w.s/1.5}px`, background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 999, fontSize: w.s>18?14:w.s>13?13:12, fontFamily: w.t==='honestly'||w.t==='the good stuff'?'Instrument Serif, serif':'inherit', fontStyle: w.t==='honestly'?'italic':'normal' }}>{w.t}</div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 22 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1.3, textTransform: 'uppercase' }}>Never use</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {['🚀','game-changer','synergy','disrupt','cutting-edge','unlock','at scale'].map(w => (
                    <div key={w} style={{ padding: '6px 10px', background: 'rgba(255,90,31,0.1)', border: '1px solid rgba(255,90,31,0.3)', borderRadius: 999, fontSize: 12, color: 'var(--coral-2)', textDecoration: 'line-through', textDecorationThickness: 1 }}>{w}</div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 22 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1.3, textTransform: 'uppercase' }}>Style rules (learned)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, fontSize: 12.5 }}>
                  {[
                    {t:'Lead with the sensory detail, not the announcement', c:94},
                    {t:'No more than 1 emoji per 3 posts', c:88},
                    {t:'End on a quiet question, not a CTA', c:82},
                    {t:'Lowercase titles, sentence case body', c:79},
                  ].map((r,i) => (
                    <div key={i} style={{ display:'flex', gap: 10, alignItems:'center' }}>
                      <Icon.Check size={12} style={{ color: 'var(--lime)' }}/>
                      <div style={{ flex: 1 }}>{r.t}</div>
                      <div className="numeral" style={{ color: 'var(--muted)', fontSize: 11 }}>{r.c}% conf</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Winners vs losers */}
          <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card" style={{ padding: 22 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Icon.Crown size={14} style={{ color: 'var(--lime)' }}/>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--lime)' }}>WHAT WORKS</div>
              </div>
              <div style={{ fontSize: 14, color: 'var(--fg-dim)', marginTop: 6, lineHeight: 1.6 }}>
                <div style={{ fontSize: 20, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', color: 'var(--fg)', lineHeight: 1.4, marginTop: 4 }}>
                  "Morning light on the press floor. New issue went to print at 4am. We're tired. The papers smell right."
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>— 52k reach · 8.4% eng · Oct 24</div>
              </div>
              <div style={{ marginTop: 14, display:'flex', gap: 6, flexWrap:'wrap' }}>
                {['sensory open','quiet ending','time anchor','first person plural'].map(t => <div key={t} className="chip lime" style={{ fontSize: 10 }}>{t}</div>)}
              </div>
            </div>

            <div className="card" style={{ padding: 22 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Icon.X size={14} style={{ color: 'var(--coral)' }}/>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--coral)' }}>WHAT FALLS FLAT</div>
              </div>
              <div style={{ fontSize: 14, color: 'var(--fg-dim)', marginTop: 6, lineHeight: 1.6 }}>
                <div style={{ fontSize: 20, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', color: 'var(--muted)', lineHeight: 1.4, marginTop: 4 }}>
                  "🚀 BIG NEWS 🚀 We're launching a game-changing new product! Link in bio!!"
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>— 3.2k reach · 1.1% eng · Mar 18</div>
              </div>
              <div style={{ marginTop: 14, display:'flex', gap: 6, flexWrap:'wrap' }}>
                {['emoji stacking','hype language','generic CTA','exclamation spam'].map(t => <div key={t} className="chip" style={{ fontSize: 10, color: 'var(--coral-2)', borderColor: 'rgba(255,90,31,0.3)' }}>{t}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { DNAScreen });
