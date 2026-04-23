// Performance / Analytics screen
function PerformanceScreen() {
  const heatmap = Array.from({length: 7}, (_, d) => Array.from({length: 12}, (_, h) => {
    // Fake data — higher Tue/Thu evening
    const base = (d === 2 || d === 4) && h >= 8 ? 0.8 : 0.3;
    return Math.min(1, base + Math.random() * 0.5);
  }));

  return (
    <div className="orbit" style={{ width: 1440, height: 900, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="performance" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title="Performance" sub="Luma Studio · Apr 1 – Apr 23 vs. previous 23 days">
          <div className="chip"><Icon.Calendar size={12}/> Last 23 days</div>
          <div className="chip">vs. Mar 9 – Mar 31</div>
          <button className="btn"><Icon.Upload size={14}/> Export</button>
        </TopBar>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 48px' }}>
          {/* Platform tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, padding: 4, background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 12, width: 'fit-content' }}>
            {[
              {id:'all', label:'All platforms', icon:null, count:'5'},
              {id:'instagram', label:'Instagram', icon:'instagram'},
              {id:'linkedin', label:'LinkedIn', icon:'linkedin'},
              {id:'youtube', label:'YouTube', icon:'youtube'},
              {id:'threads', label:'Threads', icon:'threads'},
              {id:'facebook', label:'Facebook', icon:'facebook'},
            ].map((t, i) => {
              const isActive = i === 0;
              const P = t.icon ? Platform[t.icon] : null;
              return (
                <div key={t.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 14px', borderRadius: 8,
                  background: isActive ? 'var(--ink-4)' : 'transparent',
                  fontSize: 13, cursor: 'pointer', color: isActive ? 'var(--fg)' : 'var(--fg-dim)',
                  fontWeight: isActive ? 500 : 400,
                }}>
                  {P && <div style={{ width: 16, height: 16, borderRadius: 4, background: PlatformBg[t.icon], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><P size={9}/></div>}
                  {t.label}
                  {t.count && <span className="chip" style={{ padding: '0 6px', fontSize: 10 }}>{t.count}</span>}
                </div>
              );
            })}
          </div>

          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
            {[
              {label:'Total reach', big:'1.42M', delta:'+31.2%', spark:[2,4,3,6,7,10,12,14,18,22,24,28,31], color:'var(--coral)', up:true},
              {label:'Impressions', big:'3.8M', delta:'+18.6%', spark:[6,8,9,11,10,14,16,17,19,22,24,27], color:'var(--violet)', up:true},
              {label:'Engagement rate', big:'6.84%', delta:'+0.9pp', spark:[5,5,6,6,6,7,7,7,6,7,7,7], color:'var(--lime)', up:true},
              {label:'Net new followers', big:'+8,412', delta:'−4.1%', spark:[14,12,11,10,9,8,9,8,7,8,7,7], color:'var(--rose)', up:false},
            ].map((k, i) => (
              <div key={i} className="card" style={{ padding: 20, position: 'relative' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.3 }}>{k.label}</div>
                <div className="display numeral" style={{ fontSize: 56, lineHeight: 1, marginTop: 10, color: 'var(--fg)' }}>{k.big}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <div style={{ fontSize: 12, color: k.up ? 'var(--lime)' : 'var(--rose)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {k.up ? <Icon.ArrowUpRight size={12}/> : <Icon.ArrowDown size={12}/>} {k.delta}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>vs prev.</div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <Spark data={k.spark} stroke={k.color} width={260} height={44} />
                </div>
              </div>
            ))}
          </div>

          {/* Main chart + right column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 14, marginBottom: 18 }}>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>Engagement rate over time</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Daily, per platform · 23 days</div>
                </div>
                <div style={{ flex: 1 }}/>
                <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                  {[
                    {c:'var(--coral)', l:'Instagram'},
                    {c:'var(--violet)', l:'LinkedIn'},
                    {c:'var(--lime)', l:'Threads'},
                    {c:'var(--sky)', l:'YouTube'},
                  ].map(s => (
                    <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--fg-dim)' }}>
                      <div style={{ width: 10, height: 2, background: s.c, borderRadius: 1 }}/> {s.l}
                    </div>
                  ))}
                </div>
              </div>
              {/* Chart */}
              <div style={{ marginTop: 20, position: 'relative', height: 280 }}>
                {/* Y grid */}
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{ position: 'absolute', left: 32, right: 0, top: i * 65, height: 1, background: 'var(--line)' }}/>
                ))}
                {/* Y labels */}
                {[8,6,4,2,0].map((v, i) => (
                  <div key={i} style={{ position: 'absolute', left: 0, top: i * 65 - 6, fontSize: 10, color: 'var(--muted)' }} className="numeral">{v}%</div>
                ))}
                <svg viewBox="0 0 700 280" style={{ position: 'absolute', left: 32, top: 0, width: 'calc(100% - 32px)', height: 280 }}>
                  {/* Instagram line */}
                  <path d="M 0 200 L 60 180 L 120 160 L 180 150 L 240 130 L 300 140 L 360 100 L 420 80 L 480 90 L 540 60 L 600 50 L 660 40" fill="none" stroke="#FF5A1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M 0 200 L 60 180 L 120 160 L 180 150 L 240 130 L 300 140 L 360 100 L 420 80 L 480 90 L 540 60 L 600 50 L 660 40 L 660 280 L 0 280 Z" fill="#FF5A1F" opacity="0.12"/>
                  {/* LinkedIn */}
                  <path d="M 0 220 L 60 210 L 120 205 L 180 180 L 240 190 L 300 170 L 360 180 L 420 150 L 480 140 L 540 130 L 600 120 L 660 110" fill="none" stroke="#6B5CFF" strokeWidth="2" strokeLinecap="round"/>
                  {/* Threads */}
                  <path d="M 0 250 L 60 240 L 120 230 L 180 215 L 240 200 L 300 190 L 360 170 L 420 160 L 480 150 L 540 140 L 600 120 L 660 90" fill="none" stroke="#D4FF3A" strokeWidth="2" strokeLinecap="round"/>
                  {/* YouTube */}
                  <path d="M 0 260 L 60 255 L 120 250 L 180 245 L 240 240 L 300 230 L 360 225 L 420 220 L 480 215 L 540 210 L 600 200 L 660 195" fill="none" stroke="#5AC8FF" strokeWidth="2" strokeLinecap="round" strokeDasharray="0"/>
                  {/* Highlight point */}
                  <circle cx="540" cy="60" r="4" fill="#FF5A1F"/>
                  <circle cx="540" cy="60" r="10" fill="#FF5A1F" opacity="0.2"/>
                </svg>
                {/* Tooltip */}
                <div style={{ position: 'absolute', left: '76%', top: 20, background: 'var(--ink)', border: '1px solid var(--line-2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, minWidth: 140 }}>
                  <div style={{ color: 'var(--muted)', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 1 }}>Apr 18</div>
                  <div className="numeral" style={{ fontSize: 18, fontWeight: 500, marginTop: 4 }}>7.42%</div>
                  <div style={{ fontSize: 11, color: 'var(--lime)' }}>Peak day</div>
                </div>
              </div>
              {/* X labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0 36px', fontSize: 10, color: 'var(--muted)' }}>
                {['Apr 1','5','10','15','18','23'].map(d => <span key={d} className="numeral">{d}</span>)}
              </div>
            </div>

            {/* Platform breakdown */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>Platform split · reach</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>1.42M total</div>
              {/* Stacked bar */}
              <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', marginTop: 18 }}>
                <div style={{ flex: 3.2, background: '#E1306C' }}/>
                <div style={{ flex: 2.1, background: '#0A66C2' }}/>
                <div style={{ flex: 1.6, background: '#FF0000' }}/>
                <div style={{ flex: 1.1, background: '#D4FF3A' }}/>
                <div style={{ flex: 0.8, background: '#1877F2' }}/>
              </div>
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  {p:'instagram', label:'Instagram', v:'512k', pct:'36%', delta:'+22%'},
                  {p:'linkedin', label:'LinkedIn', v:'338k', pct:'24%', delta:'+41%'},
                  {p:'youtube', label:'YouTube', v:'256k', pct:'18%', delta:'+8%'},
                  {p:'threads', label:'Threads', v:'176k', pct:'12%', delta:'+104%', hot: true},
                  {p:'facebook', label:'Facebook', v:'128k', pct:'9%', delta:'−6%', down: true},
                ].map(r => {
                  const P = Platform[r.p];
                  return (
                    <div key={r.p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: PlatformBg[r.p], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><P size={11}/></div>
                      <div style={{ fontSize: 13, flex: 1 }}>{r.label}</div>
                      <div className="numeral" style={{ fontSize: 13, fontWeight: 500 }}>{r.v}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', width: 36, textAlign: 'right' }} className="numeral">{r.pct}</div>
                      <div className="numeral" style={{ fontSize: 11, color: r.down ? 'var(--rose)' : 'var(--lime)', width: 48, textAlign: 'right' }}>{r.delta}{r.hot && ' 🔥'}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Heatmap + top posts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 14, marginBottom: 18 }}>
            {/* Best time heatmap */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>When your audience is on</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Engagements by day × hour</div>
                </div>
                <div style={{ flex: 1 }}/>
                <div className="chip">Audience time</div>
              </div>
              {/* heatmap */}
              <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '36px repeat(12, 1fr)', gap: 4 }}>
                <div/>
                {['6a','8','10','12p','2','4','6','8','10','12a','2','4'].map((h, i) => (
                  <div key={`hr-${i}`} style={{ fontSize: 9, color: 'var(--muted)', textAlign: 'center' }} className="numeral">{h}</div>
                ))}
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, di) => (
                  <React.Fragment key={day}>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)', display: 'flex', alignItems: 'center' }}>{day}</div>
                    {heatmap[di].map((v, hi) => {
                      const peak = (di === 1 || di === 3) && hi >= 7 && hi <= 9;
                      return (
                        <div key={hi} style={{
                          aspectRatio: '1',
                          background: peak ? `var(--coral)` : `rgba(255,90,31,${v * 0.6})`,
                          borderRadius: 4,
                          border: peak ? '1.5px solid var(--lime)' : 'none',
                        }} title={`${day} · ${v.toFixed(2)}`}/>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: 12, background: 'rgba(212,255,58,0.06)', border: '1px solid rgba(212,255,58,0.2)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                <Icon.Sparkle size={14} style={{ color: 'var(--lime)' }}/>
                <div style={{ fontSize: 12.5 }}>Best window: <b>Tue & Thu, 6–8pm</b> — <span style={{ color: 'var(--muted)' }}>3.4× your daily average</span></div>
                <button className="btn lime" style={{ padding: '5px 10px', fontSize: 11, marginLeft: 'auto' }}>Queue now</button>
              </div>
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5, color: 'var(--muted)' }}>
                Less
                <div style={{ display: 'flex', gap: 2 }}>
                  {[0.15, 0.3, 0.45, 0.6, 0.8].map(o => <div key={o} style={{ width: 14, height: 10, background: `rgba(255,90,31,${o})`, borderRadius: 2 }}/>)}
                </div>
                More
              </div>
            </div>

            {/* Top posts */}
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Top-performing posts</div>
                <div style={{ flex: 1 }}/>
                <div className="chip">By engagement</div>
                <Icon.ChevronDown size={14} style={{ marginLeft: 6, opacity: 0.5 }}/>
              </div>
              <div className="hr"/>
              {[
                { rank: 1, caption: '"Behind the lens · Issue 04 cover" reel', plat:'instagram', reach:'284k', eng:'14.2%', likes:'38.1k', seed: 1 },
                { rank: 2, caption: 'The chair took 14 months. Here\'s why we scrapped it three times.', plat:'linkedin', reach:'128k', eng:'11.8%', likes:'5.4k', seed: 5 },
                { rank: 3, caption: 'Pour-over bar opens this weekend.', plat:'threads', reach:'96k', eng:'9.4%', likes:'3.2k', seed: 3 },
                { rank: 4, caption: 'Trail notes · Part 1 — Colorado backcountry', plat:'youtube', reach:'84k', eng:'8.1%', likes:'2.1k', seed: 7 },
              ].map((p, i) => {
                const P = Platform[p.plat];
                return (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 20px', alignItems: 'center', borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}>
                    <div className="display numeral" style={{ fontSize: 32, color: 'var(--muted-2)', width: 32, lineHeight: 1 }}>{p.rank}</div>
                    <Placeholder seed={p.seed} style={{ width: 46, height: 46, borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.caption}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <div style={{ width: 14, height: 14, borderRadius: 3, background: PlatformBg[p.plat], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><P size={8}/></div>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>Reach {p.reach} · Likes {p.likes}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="numeral" style={{ fontSize: 16, fontWeight: 500, color: 'var(--lime)' }}>{p.eng}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>engagement</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audience + hashtags */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>Audience demographics</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Aggregated across connected accounts</div>
              {/* Age bars */}
              <div style={{ marginTop: 18 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>Age</div>
                {[
                  {l:'18–24', f: 28, m: 12},
                  {l:'25–34', f: 34, m: 22},
                  {l:'35–44', f: 18, m: 14},
                  {l:'45–54', f: 8, m: 6},
                  {l:'55+', f: 4, m: 2},
                ].map(row => (
                  <div key={row.l} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 42, fontSize: 11, color: 'var(--muted)' }} className="numeral">{row.l}</div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ width: `${row.m * 1.2}%`, height: 14, background: 'var(--violet)', borderRadius: '3px 0 0 3px' }}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ width: `${row.f * 1.2}%`, height: 14, background: 'var(--coral)', borderRadius: '0 3px 3px 0' }}/>
                    </div>
                    <div className="numeral" style={{ fontSize: 11, width: 48, color: 'var(--fg-dim)' }}>{row.f + row.m}%</div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 11 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--violet)' }}/> Male 56%</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--coral)' }}/> Female 44%</div>
                </div>
              </div>

              <div className="hr" style={{ margin: '18px 0' }}/>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>Top cities</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  {c:'New York, US', p: 18},
                  {c:'London, UK', p: 12},
                  {c:'Berlin, DE', p: 9},
                  {c:'São Paulo, BR', p: 7},
                  {c:'Mumbai, IN', p: 6},
                ].map(r => (
                  <div key={r.c} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 12.5, width: 140 }}>{r.c}</div>
                    <div style={{ flex: 1, height: 6, background: 'var(--ink-3)', borderRadius: 3 }}>
                      <div style={{ width: `${r.p * 5}%`, height: '100%', background: 'var(--coral)', borderRadius: 3 }}/>
                    </div>
                    <div className="numeral" style={{ fontSize: 11.5, color: 'var(--fg-dim)', width: 30, textAlign: 'right' }}>{r.p}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Hashtag performance</div>
                <div style={{ flex: 1 }}/>
                <div className="chip"><Icon.Hash size={11}/> 28 tracked</div>
              </div>
              <div style={{ marginTop: 16 }}>
                {[
                  {t:'#slowdesign', posts:14, reach:'184k', eng:'8.4%', bg: 'var(--coral)', size: 32},
                  {t:'#issue04', posts:8, reach:'112k', eng:'12.1%', bg: 'var(--lime)', size: 28, hot:true},
                  {t:'#behindthelens', posts:22, reach:'240k', eng:'6.2%', bg: 'var(--violet)', size: 22},
                  {t:'#workshopdiaries', posts:6, reach:'84k', eng:'9.8%', bg: 'var(--sky)', size: 20},
                  {t:'#openstudio', posts:10, reach:'96k', eng:'4.1%', bg: 'var(--rose)', size: 18},
                ].map(h => (
                  <div key={h.t} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                    <div className="display" style={{ fontSize: h.size, color: h.bg, lineHeight: 1, flex: 1, fontStyle: 'normal', fontWeight: 500 }}>{h.t}</div>
                    <div className="numeral" style={{ fontSize: 12, color: 'var(--muted)', width: 54 }}>{h.posts} posts</div>
                    <div className="numeral" style={{ fontSize: 13, fontWeight: 500, width: 64 }}>{h.reach}</div>
                    <div className="numeral" style={{ fontSize: 13, fontWeight: 500, color: 'var(--lime)', width: 52, textAlign: 'right' }}>{h.eng}</div>
                    {h.hot && <div className="chip lime" style={{ padding: '0 6px', fontSize: 9.5 }}>Trending</div>}
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

Object.assign(window, { PerformanceScreen });
