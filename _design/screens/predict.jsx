// Predictive analytics — forecast before publish + scenarios
function PredictScreen() {
  // Simple sparkline helper
  const Spark = ({ pts, c='var(--coral)', forecast }) => {
    const max = Math.max(...pts.map(p => p.v));
    const W = 560, H = 140;
    const histPts = pts.filter(p=>!p.f);
    const all = pts;
    const toXY = (p, i) => `${(i/(all.length-1))*W},${H - (p.v/max)*H*0.9 - 8}`;
    const histPath = histPts.map((p,i)=>toXY(p,i)).join(' L ');
    const fullPath = all.map((p,i)=>toXY(p,i)).join(' L ');
    const forecastStart = histPts.length - 1;
    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="sparkF" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={c} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={`M${fullPath} L${W},${H} L0,${H} Z`} fill="url(#sparkF)"/>
        <path d={`M${histPath}`} fill="none" stroke={c} strokeWidth="2"/>
        <path d={`M${all.slice(forecastStart).map((p,i)=>toXY(p,forecastStart+i)).join(' L ')}`} fill="none" stroke={c} strokeWidth="2" strokeDasharray="4 4" opacity="0.7"/>
        {all.map((p,i) => p.f ? null : <circle key={i} cx={toXY(p,i).split(',')[0]} cy={toXY(p,i).split(',')[1]} r="2.5" fill={c}/>)}
      </svg>
    );
  };

  // Build sample data: 10 points history, 4 forecast
  const pts = [
    {v:4.2},{v:5.1},{v:4.8},{v:5.9},{v:7.2},{v:6.8},{v:8.4},{v:9.1},{v:10.2},{v:11.8},
    {v:13.2,f:true},{v:14.8,f:true},{v:16.1,f:true},{v:17.6,f:true},
  ];

  return (
    <div className="orbit" style={{ width: 1440, height: 900, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="performance" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title="Forecast" sub="Predictive model · 87% accuracy over last 90 days">
          <div className="chip"><Icon.Clock size={11}/> Horizon 14 days</div>
          <button className="btn">Change model</button>
          <button className="btn primary"><Icon.Sparkle size={13}/> Simulate a post</button>
        </TopBar>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 48px' }}>
          <h1 className="display" style={{ fontSize: 56, margin: '0 0 6px', lineHeight: 1.02 }}>
            Where your numbers will <span style={{ color: 'var(--lime)' }}>land</span>.
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>Solid line — what happened. Dashed — what Orbit predicts if you keep current cadence.</p>

          {/* KPI grid with sparklines */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 }}>
            {[
              {l:'Followers · 14d', now:'8,412', fore:'+2,790', c:'var(--coral)', conf:91},
              {l:'Engagement rate · 14d', now:'6.8%', fore:'7.9%', c:'var(--lime)', conf:84},
              {l:'Reach · 14d', now:'284k', fore:'412k', c:'var(--violet)', conf:79},
            ].map((k,i) => (
              <div key={i} className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1.3, textTransform: 'uppercase' }}>{k.l}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
                  <div className="display numeral" style={{ fontSize: 34 }}>{k.now}</div>
                  <div className="numeral" style={{ color: k.c, fontSize: 14, fontWeight: 500 }}>{k.fore}</div>
                </div>
                <div style={{ marginTop: 10 }}><Spark pts={pts} c={k.c}/></div>
                <div style={{ display:'flex', alignItems:'center', gap: 8, marginTop: 8 }}>
                  <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--ink-3)', overflow: 'hidden' }}>
                    <div style={{ width: `${k.conf}%`, height: '100%', background: k.c }}/>
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--muted)' }} className="numeral">{k.conf}% conf.</div>
                </div>
              </div>
            ))}
          </div>

          {/* Simulator */}
          <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                <Icon.Sparkle size={14} style={{ color: 'var(--lime)' }}/>
                <div style={{ fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: 'var(--lime)' }}>Post simulator</div>
              </div>
              <h3 className="display" style={{ fontSize: 28, margin: '10px 0 18px', lineHeight: 1.1 }}>
                Predict performance <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>before</span> you publish.
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>DRAFT</div>
                  <div className="card" style={{ padding: 14, background: 'var(--ink-2)' }}>
                    <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--fg)' }}>"Cover reveal tomorrow. Yes, we're nervous. No, you can't see it yet. Friday 10:30am."</div>
                    <div style={{ display:'flex', gap: 4, marginTop: 10 }}>
                      {['IG','Threads','LinkedIn'].map(p => <div key={p} className="chip" style={{ fontSize: 10, padding: '2px 7px' }}>{p}</div>)}
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>SCHEDULE</div>
                  <div className="card" style={{ padding: 14, background: 'var(--ink-2)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: 12 }}>
                      <div style={{ color: 'var(--muted)' }}>Day</div><div>Friday</div>
                      <div style={{ color: 'var(--muted)' }}>Time</div><div className="numeral">10:30 AM</div>
                      <div style={{ color: 'var(--muted)' }}>Format</div><div>Carousel · 4 slides</div>
                      <div style={{ color: 'var(--muted)' }}>Hashtags</div><div>8 selected</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Predicted outcome */}
              <div style={{ marginTop: 16, padding: '18px 18px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(212,255,58,0.08), rgba(255,90,31,0.06))', border: '1px solid rgba(212,255,58,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>Predicted reach</div>
                    <div className="display numeral" style={{ fontSize: 34, color: 'var(--lime)' }}>42–58k</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>Engagement</div>
                    <div className="display numeral" style={{ fontSize: 34 }}>7.2%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>Follower gain</div>
                    <div className="display numeral" style={{ fontSize: 34, color: 'var(--coral)' }}>+320</div>
                  </div>
                  <div style={{ flex: 1 }}/>
                  <div className="chip lime">Top 15% of your posts</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, lineHeight: 1.55 }}>
                  <b style={{ color: 'var(--fg)' }}>Why:</b> tension + specific date hook mirrors your top performer from Oct 24 (52k reach). 10:30am on Friday is your #2 window. Carousel format beats static by 2.8×.
                </div>
              </div>

              {/* Optimizers */}
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 8 }}>Try</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    {t:'Shift to Tue 6pm', d:'+18% reach · your peak window'},
                    {t:'Add a closing question', d:'+22% saves typically'},
                    {t:'Drop to 3 hashtags', d:'Your audience converts higher w/ fewer'},
                  ].map((o,i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: 'var(--ink-2)', borderRadius: 8, alignItems: 'center', fontSize: 12.5 }}>
                      <Icon.Sparkle size={12} style={{ color: 'var(--lime)' }}/>
                      <div style={{ flex: 1 }}><b>{o.t}</b> <span style={{ color: 'var(--muted)' }}>— {o.d}</span></div>
                      <button className="btn ghost" style={{ padding: '3px 8px', fontSize: 11 }}>Apply</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scenario compare */}
            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1.3, textTransform: 'uppercase' }}>Scenario planner</div>
              <div style={{ fontSize: 14, marginTop: 4, color: 'var(--fg-dim)' }}>Compare 3 cadence strategies</div>

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  {l:'Current', sub:'5 posts/wk, mixed', g:'+2,790', e:'6.8%', sel:false, c:'var(--muted)'},
                  {l:'Reels-heavy', sub:'3 reels + 2 threads', g:'+4,150', e:'7.9%', sel:true, c:'var(--lime)', badge:'AI pick'},
                  {l:'Daily drip', sub:'1 post every day', g:'+3,240', e:'5.2%', sel:false, c:'var(--coral)'},
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: 14, borderRadius: 10,
                    background: s.sel ? 'rgba(212,255,58,0.06)' : 'var(--ink-2)',
                    border: '1px solid ' + (s.sel ? 'rgba(212,255,58,0.4)' : 'var(--line)'),
                  }}>
                    <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{s.l}</div>
                      {s.badge && <span className="chip lime" style={{ fontSize: 9, padding: '1px 6px' }}>{s.badge}</span>}
                      <div style={{ flex: 1 }}/>
                      <div className="numeral" style={{ fontSize: 14, color: s.c, fontWeight: 500 }}>{s.g}</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{s.sub} · eng {s.e}</div>
                    <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: 'var(--ink-3)', overflow:'hidden' }}>
                      <div style={{ width: s.l==='Reels-heavy'?'94%':s.l==='Daily drip'?'72%':'62%', height:'100%', background: s.c }}/>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn primary" style={{ marginTop: 14, width: '100%' }}>Apply Reels-heavy plan</button>
            </div>
          </div>

          {/* Risk signals */}
          <div className="card" style={{ marginTop: 16, padding: 22 }}>
            <div style={{ display:'flex', alignItems:'center' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1.3, textTransform: 'uppercase' }}>Risk signals</div>
                <div style={{ fontSize: 15, fontWeight: 500, marginTop: 2 }}>3 things that could slow you down</div>
              </div>
              <div style={{ flex: 1 }}/>
              <div className="chip" style={{ color: 'var(--coral)', borderColor: 'rgba(255,90,31,0.3)' }}>heads up</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16 }}>
              {[
                {t:'Threads posting cadence slipping', sub:'Down to 3/wk from 5/wk. Will cost ~8% of forecast.', sev:'med'},
                {t:'Hashtag #craftculture saturation', sub:'Engagement dropping across your cohort — rotate next week.', sev:'low'},
                {t:'Audience overlap w/ @arc_and_oak', sev:'low', sub:'Their output up 40% — competing for same feed window.'},
              ].map((r,i) => (
                <div key={i} style={{ padding: 14, background: 'var(--ink-2)', borderRadius: 10, border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: r.sev==='med'?'var(--coral)':'var(--sky)' }}/>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.t}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>{r.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { PredictScreen });
