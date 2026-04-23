// Content composer — multi-platform with previews
function ComposerScreen() {
  const caption = "Issue 04 is almost here. \"The long road\" — a look at the makers we followed for 12 months, across 4 continents, through every season. Cover reveal Friday. 🧡\n\n#slowdesign #issue04 #behindthelens";

  return (
    <div className="orbit" style={{ width: 1440, height: 900, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="composer" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title="New post" sub="Draft · Luma Studio · auto-saved 12s ago">
          <div className="chip"><Icon.Users size={11}/> Mae Tanaka viewing</div>
          <button className="btn"><Icon.Check size={14}/> Save draft</button>
          <button className="btn primary"><Icon.Send size={14}/> Schedule</button>
        </TopBar>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.1fr 1fr 340px', overflow: 'hidden' }}>
          {/* Editor */}
          <div style={{ padding: '28px 32px', overflowY: 'auto', borderRight: '1px solid var(--line)' }}>
            {/* Platform selector */}
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.3, marginBottom: 10 }}>Publishing to</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['instagram','linkedin','threads','youtube','facebook'].map((p, i) => {
                const P = Platform[p];
                const on = i < 3;
                return (
                  <div key={p} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 12px', borderRadius: 10,
                    background: on ? 'rgba(255,90,31,0.12)' : 'var(--ink-2)',
                    border: '1px solid ' + (on ? 'rgba(255,90,31,0.35)' : 'var(--line)'),
                    fontSize: 12.5, cursor: 'pointer',
                  }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: PlatformBg[p], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><P size={9}/></div>
                    {p[0].toUpperCase() + p.slice(1)}
                    {on && <Icon.Check size={12} style={{ color: 'var(--coral)' }} />}
                  </div>
                );
              })}
            </div>

            {/* Caption editor */}
            <div className="card" style={{ padding: 0, marginTop: 22 }}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
                <div className="av" style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--coral)', fontSize: 10 }}>LS</div>
                <span style={{ fontSize: 12.5, marginLeft: 8 }}>Luma Studio · master caption</span>
                <div style={{ flex: 1 }}/>
                <div className="chip" style={{ fontSize: 10 }}>3 / 3 platforms</div>
              </div>
              <textarea defaultValue={caption} style={{
                width: '100%', minHeight: 180, background: 'transparent', border: 'none', color: 'var(--fg)',
                padding: '16px 18px', fontSize: 15, lineHeight: 1.55, fontFamily: 'inherit', resize: 'none', outline: 'none',
              }}/>
              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <button className="btn ghost" style={{ padding: '6px 10px', fontSize: 12 }}><Icon.Sparkle size={13}/> AI caption</button>
                <button className="btn ghost" style={{ padding: '6px 10px', fontSize: 12 }}><Icon.Hash size={13}/> Suggest tags</button>
                <button className="btn ghost" style={{ padding: '6px 10px', fontSize: 12 }}>😀 Emoji</button>
                <div style={{ flex: 1 }}/>
                <div className="numeral" style={{ fontSize: 11, color: 'var(--muted)' }}>186 / 2200</div>
              </div>
            </div>

            {/* Media tray */}
            <div style={{ marginTop: 18, fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.3 }}>Media · carousel · 4 slides</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 10 }}>
              {[1,2,3,4].map(s => (
                <div key={s} style={{ position: 'relative' }}>
                  <Placeholder seed={s} style={{ aspectRatio: '1', borderRadius: 8, border: s === 1 ? '2px solid var(--coral)' : 'none' }} />
                  {s === 1 && <div style={{ position: 'absolute', top: 4, left: 4, fontSize: 10, background: 'var(--coral)', color: '#fff', padding: '1px 6px', borderRadius: 4 }}>COVER</div>}
                </div>
              ))}
              <div style={{ aspectRatio: '1', borderRadius: 8, border: '1.5px dashed var(--line-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--muted)', cursor: 'pointer' }}>
                <Icon.Plus size={18}/>
                <div style={{ fontSize: 11 }}>Add</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn"><Icon.Upload size={14}/> Upload</button>
              <button className="btn"><Icon.Sparkle size={14}/> AI image</button>
              <button className="btn"><Icon.Folder size={14}/> From library</button>
            </div>

            {/* Per-platform overrides */}
            <div style={{ marginTop: 22, fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.3 }}>Per-platform tweaks</div>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                {p:'instagram', n:'Instagram', note:'Caption shortened to 1,500 chars · 5 hashtags'},
                {p:'linkedin', n:'LinkedIn', note:'Opening hook rewritten for B2B tone'},
                {p:'threads', n:'Threads', note:'Split into 3-post thread'},
              ].map(r => {
                const P = Platform[r.p];
                return (
                  <div key={r.p} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, background: PlatformBg[r.p], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><P size={11}/></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 500 }}>{r.n}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{r.note}</div>
                    </div>
                    <Icon.Chevron size={14} style={{ opacity: 0.5 }}/>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Previews */}
          <div style={{ padding: '28px 24px', overflowY: 'auto', background: '#09090B', borderRight: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Live preview</div>
              <div style={{ flex: 1 }}/>
              <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--ink-2)', borderRadius: 8 }}>
                {['instagram','linkedin','threads'].map((p, i) => {
                  const P = Platform[p];
                  return (
                    <div key={p} style={{
                      width: 30, height: 26, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: i === 0 ? PlatformBg[p] : 'transparent', color: i === 0 ? '#fff' : 'var(--muted)', cursor: 'pointer',
                    }}><P size={13}/></div>
                  );
                })}
              </div>
            </div>

            {/* IG preview card */}
            <div style={{ background: '#fff', color: '#000', borderRadius: 10, overflow: 'hidden', width: 320, margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: 12, gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: PlatformBg.instagram, padding: 2 }}>
                  <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF5A1F', fontSize: 11, fontWeight: 700 }}>LS</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>lumastudio</div>
                <div style={{ flex: 1 }}/>
                <div style={{ fontSize: 16, color: '#666' }}>⋯</div>
              </div>
              <Placeholder seed={1} style={{ width: 320, height: 320, borderRadius: 0 }} />
              <div style={{ padding: 10, display: 'flex', gap: 12, alignItems: 'center', fontSize: 18 }}>
                <Icon.Heart size={22} stroke={1.8}/>
                <Icon.Send size={21} stroke={1.8}/>
                <Icon.Pen size={21} stroke={1.8}/>
                <div style={{ flex: 1 }}/>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: 3, background: i === 0 ? '#0095F6' : '#d0d0d0' }}/>)}
                </div>
              </div>
              <div style={{ padding: '0 12px 10px', fontSize: 12.5, lineHeight: 1.45 }}>
                <b>lumastudio</b> Issue 04 is almost here. "The long road" — a look at the makers we followed for 12 months, across 4 continents, through every season. Cover reveal Friday. 🧡 <span style={{ color: '#00376B' }}>#slowdesign #issue04…</span>
                <div style={{ color: '#8e8e8e', fontSize: 11, marginTop: 6 }}>View all 142 comments · 2h</div>
              </div>
            </div>

            {/* LI mini preview */}
            <div style={{ background: '#fff', color: '#000', borderRadius: 10, width: 320, margin: '16px auto 0', fontFamily: '-apple-system, sans-serif', fontSize: 12.5, overflow: 'hidden' }}>
              <div style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                <div className="av" style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--coral)', fontSize: 13 }}>LS</div>
                <div>
                  <div style={{ fontWeight: 600 }}>Luma Studio</div>
                  <div style={{ color: '#666', fontSize: 11 }}>Design studio · 38k followers</div>
                  <div style={{ color: '#666', fontSize: 11 }}>Now · 🌐</div>
                </div>
              </div>
              <div style={{ padding: '0 12px 10px', lineHeight: 1.45 }}>We followed 14 makers for 12 months across 4 continents. What we learned about slow design…</div>
              <Placeholder seed={2} style={{ width: 320, height: 200, borderRadius: 0 }} />
            </div>
          </div>

          {/* Scheduling sidebar */}
          <div style={{ padding: '28px 24px', overflowY: 'auto' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.3 }}>Scheduling</div>

            {/* Schedule options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {[
                {l:'Post now', i: Icon.Send, selected: false},
                {l:'Add to queue', i: Icon.Clock, sub:'Next slot · Thu 6pm', selected: true, hot: true},
                {l:'Pick a time', i: Icon.Calendar, sub:'Friday, Apr 25 · 10:30 AM', selected: false},
              ].map((o, i) => (
                <div key={i} style={{
                  padding: '12px 14px', background: o.selected ? 'rgba(212,255,58,0.08)' : 'var(--ink-2)',
                  border: '1px solid ' + (o.selected ? 'var(--lime)' : 'var(--line)'),
                  borderRadius: 10, display: 'flex', gap: 10, alignItems: 'center',
                }}>
                  <o.i size={16} style={{ color: o.selected ? 'var(--lime)' : 'var(--muted)' }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{o.l}</div>
                    {o.sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{o.sub}</div>}
                  </div>
                  {o.hot && <Icon.Sparkle size={14} style={{ color: 'var(--lime)' }}/>}
                  {o.selected && <div style={{ width: 14, height: 14, borderRadius: 7, background: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.Check size={9} style={{ color: '#0E0E10' }}/></div>}
                </div>
              ))}
            </div>

            {/* AI hint */}
            <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: 'rgba(212,255,58,0.06)', border: '1px solid rgba(212,255,58,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--lime)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                <Icon.Sparkle size={12}/> AI pick
              </div>
              <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.5 }}>Thu 6pm lands in your audience's peak window — 3.4× your daily average engagement.</div>
            </div>

            <div className="hr" style={{ margin: '20px 0' }}/>

            {/* Campaign */}
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.3, marginBottom: 10 }}>Campaign</div>
            <div style={{ padding: 12, background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #FF5A1F, #FF4D8F)' }}/>
              <div style={{ flex: 1, fontSize: 12.5 }}>
                <div style={{ fontWeight: 500 }}>Issue 04 launch</div>
                <div style={{ color: 'var(--muted)', fontSize: 11 }}>Post 3 of 9 · ends May 2</div>
              </div>
            </div>

            <div className="hr" style={{ margin: '20px 0' }}/>

            {/* Approval */}
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.3, marginBottom: 10 }}>Approval</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="av" style={{ width: 26, height: 26, borderRadius: 13, background: '#FF5A1F', fontSize: 11 }}>MT</div>
              <div style={{ fontSize: 12.5, flex: 1 }}>
                <div>Mae Tanaka</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Editor-in-chief</div>
              </div>
              <div className="chip coral" style={{ fontSize: 10 }}>Pending</div>
            </div>

            <div className="hr" style={{ margin: '20px 0' }}/>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.3, marginBottom: 10 }}>Linked event</div>
            <div style={{ padding: 12, background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 10 }}>
              <div style={{ fontSize: 12.5, fontWeight: 500 }}>Issue 04 Cover Reveal</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Fri, Apr 25 · 10:30 AM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ComposerScreen });
