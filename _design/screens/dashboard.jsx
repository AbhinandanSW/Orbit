// Main dashboard — big number hero, upcoming queue, perf, AI suggestions, inbox, team
function DashboardScreen() {
  return (
    <div className="orbit" style={{ width: 1440, height: 900, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="dashboard" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title="Good morning, Noor" sub="Wednesday, 23 April · 4 brands active">
          <div className="chip"><Icon.Search size={12}/> Search · ⌘K</div>
          <button className="btn"><Icon.Filter size={14}/> This week</button>
          <button className="btn primary"><Icon.Pen size={14}/> Compose</button>
        </TopBar>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 48px' }}>
          {/* Hero row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 14, marginBottom: 18 }}>
            {/* Big hero card */}
            <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, #1A1A1E 0%, #26262C 100%)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.4 }}>
                <span className="dot" style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--lime)', display: 'inline-block' }}/> Live · last 7 days
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 12 }}>
                <div className="display numeral" style={{ fontSize: 112, lineHeight: 0.85, color: 'var(--fg)' }}>847k</div>
                <div style={{ paddingBottom: 18 }}>
                  <div style={{ fontSize: 13, color: 'var(--fg-dim)' }}>total reach</div>
                  <div className="chip lime" style={{ marginTop: 4 }}><Icon.ArrowUpRight size={11}/> +28.4%</div>
                </div>
              </div>
              <div style={{ marginTop: 18 }}>
                <Spark data={[20,34,28,46,52,49,68,72,65,84,91,88,104,118]} stroke="#FF5A1F" width={440} height={60} />
              </div>
              <div style={{ display: 'flex', gap: 22, marginTop: 12 }}>
                {[
                  {p:'instagram', v:'412k', t:'reach'},
                  {p:'linkedin', v:'184k', t:'reach'},
                  {p:'youtube', v:'141k', t:'views'},
                  {p:'threads', v:'78k', t:'reach'},
                  {p:'facebook', v:'32k', t:'reach'},
                ].map(x => {
                  const P = Platform[x.p];
                  return (
                    <div key={x.p} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: PlatformBg[x.p], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><P size={12}/></div>
                      <div>
                        <div className="numeral" style={{ fontSize: 14, fontWeight: 500 }}>{x.v}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{x.t}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Posts this week */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.4 }}>Posts this week</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
                <div className="display numeral" style={{ fontSize: 74, color: 'var(--fg)', lineHeight: 0.9 }}>34</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>/ 42 planned</div>
              </div>
              <div style={{ height: 6, background: 'var(--ink-3)', borderRadius: 3, marginTop: 14, overflow: 'hidden' }}>
                <div style={{ width: '81%', height: '100%', background: 'var(--coral)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 12, color: 'var(--fg-dim)' }}>
                <span>✔ 28 published</span>
                <span style={{ color: 'var(--coral-2)' }}>● 6 pending review</span>
                <span style={{ color: 'var(--muted)' }}>○ 8 drafts</span>
              </div>
              <div className="hr" style={{ margin: '16px 0' }}/>
              <div style={{ fontSize: 12.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ color: 'var(--muted)' }}>Avg engagement</span><span className="numeral" style={{ fontWeight: 500 }}>6.8%</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ color: 'var(--muted)' }}>Best day</span><span style={{ fontWeight: 500 }}>Thursday</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Peak hour</span><span className="numeral" style={{ fontWeight: 500 }}>6–8pm</span></div>
              </div>
            </div>

            {/* Followers */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.4 }}>Followers · net new</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
                <div className="display numeral" style={{ fontSize: 74, color: 'var(--fg)', lineHeight: 0.9 }}>+2,148</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--lime)', marginTop: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
                <Icon.ArrowUpRight size={12}/> +12.4% vs last week
              </div>
              <div style={{ marginTop: 12 }}>
                <Spark data={[4,6,5,9,8,14,12,18,16,22]} stroke="#6B5CFF" width={260} height={50} />
              </div>
              <div className="hr" style={{ margin: '14px 0' }}/>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>Fastest-growing channel</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: PlatformBg.threads, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Platform.threads size={12}/></div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Threads · +42%</div>
              </div>
            </div>
          </div>

          {/* Row 2 — upcoming + AI suggestions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
            {/* Upcoming queue */}
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>Upcoming · next 7 days</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>18 scheduled posts across 4 brands</div>
                </div>
                <div style={{ flex: 1 }}/>
                <div className="chip">All brands</div>
                <Icon.Arrow size={16} style={{ marginLeft: 12, opacity: 0.5, cursor: 'pointer' }}/>
              </div>
              <div className="hr"/>

              {[
                { day: 'TODAY', date: 'Apr 23', items: [
                  { time: '2:30 PM', brand: BRANDS[0], platforms: ['instagram','facebook'], caption: 'Behind the lens: issue 04 cover shoot with Maia — out Friday.', img: 1 },
                  { time: '6:00 PM', brand: BRANDS[2], platforms: ['instagram','threads'], caption: 'Last day to grab a kit from the Ritual drop. 12 left.', img: 3 },
                ]},
                { day: 'TOMORROW', date: 'Apr 24', items: [
                  { time: '9:00 AM', brand: BRANDS[1], platforms: ['linkedin'], caption: 'The chair took 14 months. Here\'s why we scrapped it three times.', img: 5, thread: true },
                  { time: '12:15 PM', brand: BRANDS[3], platforms: ['instagram','youtube'], caption: 'Trail notes from Colorado — a 3-part video dropping all week.', img: 7 },
                ]},
                { day: 'FRI', date: 'Apr 25', items: [
                  { time: '10:30 AM', brand: BRANDS[0], platforms: ['instagram','facebook','threads'], caption: 'Cover reveal — Issue 04 · "The long road." Available Monday.', img: 2, awaiting: true },
                ]},
              ].map((group, gi) => (
                <div key={gi}>
                  <div style={{ padding: '12px 20px 6px', display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 1.4, color: gi === 0 ? 'var(--coral)' : 'var(--muted)' }}>{group.day}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>{group.date}</div>
                  </div>
                  {group.items.map((it, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, padding: '10px 20px', alignItems: 'center', borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}>
                      <div style={{ width: 54, textAlign: 'right' }}>
                        <div className="numeral" style={{ fontSize: 14, fontWeight: 500 }}>{it.time.split(' ')[0]}</div>
                        <div style={{ fontSize: 10, color: 'var(--muted)' }}>{it.time.split(' ')[1]}</div>
                      </div>
                      <Placeholder seed={it.img} style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <div className="av" style={{ width: 14, height: 14, borderRadius: 4, background: it.brand.color, fontSize: 7 }}>{it.brand.initials}</div>
                          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{it.brand.name}</div>
                          {it.thread && <div className="chip" style={{ padding: '1px 6px', fontSize: 10 }}>Thread · 4</div>}
                          {it.awaiting && <div className="chip coral" style={{ padding: '1px 6px', fontSize: 10 }}>Awaiting approval</div>}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.caption}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {it.platforms.map(p => {
                          const P = Platform[p];
                          return <div key={p} style={{ width: 22, height: 22, borderRadius: 5, background: PlatformBg[p], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><P size={11}/></div>;
                        })}
                      </div>
                      <Icon.Dots size={16} style={{ opacity: 0.4, cursor: 'pointer' }}/>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* AI suggestions + mentions stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="card" style={{ padding: 20, background: 'linear-gradient(135deg, rgba(107,92,255,0.1), rgba(212,255,58,0.04))', borderColor: 'rgba(107,92,255,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon.Sparkle size={16} style={{ color: 'var(--lime)' }}/>
                  <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--lime)' }}>AI · Content spark</div>
                </div>
                <div className="display" style={{ fontSize: 26, lineHeight: 1.1, marginTop: 10 }}>
                  Your Tuesday reels <span style={{ color: 'var(--lime)' }}>outperform Sunday posts by 3.4×</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--fg-dim)', marginTop: 12, lineHeight: 1.55 }}>Move the "behind the lens" series to Tuesday 6pm. I can reschedule the next 4 posts in one click.</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button className="btn lime" style={{ padding: '8px 12px', fontSize: 12 }}>Apply suggestion</button>
                  <button className="btn ghost" style={{ padding: '8px 12px', fontSize: 12 }}>Dismiss</button>
                </div>
              </div>

              {/* Mentions */}
              <div className="card" style={{ padding: 0, flex: 1 }}>
                <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center' }}>
                  <Icon.Inbox size={15} style={{ marginRight: 8, opacity: 0.7 }}/>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Mentions & DMs</div>
                  <span className="chip coral" style={{ marginLeft: 8, padding: '1px 7px', fontSize: 10 }}>12 new</span>
                  <div style={{ flex: 1 }}/>
                  <Icon.Arrow size={15} style={{ opacity: 0.5 }}/>
                </div>
                <div className="hr"/>
                {[
                  { who: 'Jules Riviere', handle: '@julesriv', plat: 'instagram', text: '"When are you restocking the olive tote?? 😭"', time: '2m', brand: 'LS', bc:'#FF5A1F' },
                  { who: 'Kenji Mori', handle: '@kenjim', plat: 'threads', text: 'The way you shot the workshop reel — chef\'s kiss.', time: '18m', brand: 'AO', bc:'#6B5CFF' },
                  { who: 'Alex Ward', handle: '@awardthings', plat: 'linkedin', text: 'Shared your post with the team — great breakdown.', time: '1h', brand: 'AO', bc:'#6B5CFF' },
                ].map((m, i) => (
                  <div key={i} style={{ padding: '12px 18px', display: 'flex', gap: 12, borderTop: i===0 ? 'none' : '1px solid var(--line)' }}>
                    <div className="av" style={{ width: 30, height: 30, borderRadius: 15, background: `oklch(0.7 0.15 ${i*60})`, color: '#0E0E10' }}>{m.who[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, display: 'flex', gap: 6, alignItems: 'center' }}>
                        <b>{m.who}</b>
                        <span style={{ color: 'var(--muted)' }}>{m.handle}</span>
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: PlatformBg[m.plat], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{React.createElement(Platform[m.plat], {size: 7})}</div>
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--fg-dim)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.text}</div>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{m.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3 — team activity + best times */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
            {/* Team */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Team activity</div>
                <div style={{ flex: 1 }}/>
                <div className="chip"><Icon.Users size={11}/> 6 online</div>
              </div>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { who: 'Mae Tanaka', action: 'approved', target: 'Cover reveal · Issue 04', time: '3 min ago', color: '#FF5A1F' },
                  { who: 'Devon Hale', action: 'left 2 comments on', target: 'Arc & Oak · thread draft', time: '18 min ago', color: '#6B5CFF' },
                  { who: 'Ines Olsen', action: 'added 4 assets to', target: 'Kinfolk Coffee library', time: '47 min ago', color: '#D4FF3A' },
                  { who: 'You', action: 'scheduled', target: '3 posts for Verge Athletics', time: '1 hr ago', color: '#5AC8FF' },
                ].map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div className="av" style={{ width: 28, height: 28, borderRadius: 14, background: a.color, fontSize: 11 }}>{a.who.split(' ').map(s=>s[0]).join('').slice(0,2)}</div>
                    <div style={{ fontSize: 12.5, flex: 1 }}>
                      <b>{a.who}</b> <span style={{ color: 'var(--muted)' }}>{a.action}</span> <span style={{ fontWeight: 500 }}>{a.target}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick compose */}
            <div className="card" style={{ padding: 20, background: 'linear-gradient(120deg, #1A1A1E 0%, #0E0E10 100%)', borderColor: 'rgba(255,90,31,0.25)' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.4 }}>Quick compose</div>
              <div className="display" style={{ fontSize: 34, lineHeight: 1.05, marginTop: 8 }}>
                What's the <span style={{ color: 'var(--coral)' }}>story</span> today?
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                {['Product teaser','Event recap','Customer story','Behind the scenes','Announcement'].map(t => (
                  <div key={t} className="chip" style={{ cursor: 'pointer' }}>{t}</div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: 14, background: 'rgba(0,0,0,0.3)', borderRadius: 10, border: '1px solid var(--line)', fontSize: 13, color: 'var(--muted)' }}>
                Start typing, or paste a draft — Orbit will format it for every channel…
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
                <button className="btn"><Icon.Image size={14}/> Media</button>
                <button className="btn"><Icon.Sparkle size={14}/> AI caption</button>
                <div style={{ flex: 1 }}/>
                <button className="btn primary"><Icon.Pen size={14}/> Open composer</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardScreen });
