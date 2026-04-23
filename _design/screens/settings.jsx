// Settings
function SettingsScreen() {
  return (
    <div className="orbit" style={{ width: 1440, height: 900, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="settings" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title="Settings" sub="Workspace · Field Studio">
          <button className="btn"><Icon.Upload size={14}/> Export data</button>
          <button className="btn primary">Save changes</button>
        </TopBar>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '220px 1fr', overflow: 'hidden' }}>
          {/* Settings nav */}
          <div style={{ borderRight: '1px solid var(--line)', padding: '20px 16px', overflowY: 'auto' }}>
            {[
              {s:'Personal', items:['Profile','Notifications','Appearance']},
              {s:'Workspace', items:['General','Team members','Brands','Billing','Integrations']},
              {s:'Publishing', items:['Connected accounts','Approval flows','Best-time rules']},
              {s:'Privacy', items:['Security','API keys','Audit log']},
            ].map((grp, gi) => (
              <div key={gi} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 10.5, letterSpacing: 1.3, textTransform: 'uppercase', color: 'var(--muted)', padding: '6px 10px' }}>{grp.s}</div>
                {grp.items.map((it, i) => {
                  const active = gi === 1 && i === 2; // Brands
                  return (
                    <div key={it} style={{
                      padding: '8px 12px', borderRadius: 8, fontSize: 13,
                      background: active ? 'rgba(255,90,31,0.1)' : 'transparent',
                      color: active ? 'var(--coral-2)' : 'var(--fg-dim)',
                      cursor: 'pointer', fontWeight: active ? 500 : 400,
                    }}>{it}</div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Content — Brands & connected accounts */}
          <div style={{ padding: '28px 40px', overflowY: 'auto' }}>
            <h2 className="display" style={{ fontSize: 44, margin: 0, fontStyle: 'normal', fontWeight: 500 }}>Brands & <span style={{ color: 'var(--coral)', fontStyle: 'italic' }}>accounts</span></h2>
            <p style={{ fontSize: 14, color: 'var(--fg-dim)', marginTop: 10, maxWidth: 640 }}>Manage the brands you publish for. Each brand can have its own verified social accounts, approval flow, and team.</p>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn primary"><Icon.Plus size={14}/> Add brand</button>
              <button className="btn"><Icon.Upload size={14}/> Import from CSV</button>
              <div style={{ flex: 1 }}/>
              <div className="chip"><Icon.Users size={11}/> 6 teammates</div>
              <div className="chip">Plan · Agency Pro</div>
            </div>

            {/* Brand rows */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {BRANDS.map((b, i) => {
                const accts = [
                  [{p:'instagram',h:'@lumastudio',v:true},{p:'facebook',h:'Luma Studio',v:true},{p:'linkedin',h:'Luma Studio',v:'pending'},{p:'threads',h:'@lumastudio',v:false}],
                  [{p:'instagram',h:'@arcandoak',v:true},{p:'linkedin',h:'Arc & Oak',v:true},{p:'youtube',h:'@arc-oak',v:true}],
                  [{p:'instagram',h:'@kinfolkcoffee',v:true},{p:'threads',h:'@kinfolk',v:true}],
                  [{p:'instagram',h:'@vergeath',v:true},{p:'youtube',h:'@vergeathletics',v:true},{p:'facebook',h:'Verge',v:'pending'}],
                  [{p:'instagram',h:'@mirabotanics',v:true}],
                ][i];
                return (
                  <div key={b.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div className="av" style={{ width: 40, height: 40, borderRadius: 10, background: b.color, fontSize: 14 }}>{b.initials}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 500 }}>{b.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{accts.length} accounts · {['Noor + Mae','Devon + Ines','Ines','Devon','Noor'][i]} manage</div>
                      </div>
                      {i === 0 && <div className="chip coral">Active</div>}
                      <button className="btn ghost" style={{ padding: 6 }}><Icon.Dots size={16}/></button>
                    </div>
                    <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {accts.map((a, j) => {
                        const P = Platform[a.p];
                        return (
                          <div key={j} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '7px 12px', background: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 10,
                          }}>
                            <div style={{ width: 18, height: 18, borderRadius: 4, background: PlatformBg[a.p], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><P size={10}/></div>
                            <div style={{ fontSize: 12 }}>{a.h}</div>
                            {a.v === true && <Icon.Check size={12} style={{ color: 'var(--lime)' }}/>}
                            {a.v === 'pending' && <div style={{ fontSize: 10, color: 'var(--coral-2)' }}>pending</div>}
                            {a.v === false && <div style={{ fontSize: 10, color: 'var(--muted)' }}>token expired</div>}
                          </div>
                        );
                      })}
                      <div style={{ padding: '7px 12px', border: '1.5px dashed var(--line-2)', borderRadius: 10, fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                        <Icon.Plus size={12}/> Add account
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Team block */}
            <h3 className="display" style={{ fontSize: 28, margin: '36px 0 14px', fontStyle: 'normal', fontWeight: 500 }}>Team</h3>
            <div className="card" style={{ padding: 0 }}>
              {[
                {n:'Noor Idris', r:'Owner · Social lead', c:'var(--violet)', b:'All brands'},
                {n:'Mae Tanaka', r:'Editor-in-chief', c:'var(--coral)', b:'Luma Studio, Kinfolk'},
                {n:'Devon Hale', r:'Producer', c:'var(--lime)', b:'Arc & Oak, Verge'},
                {n:'Ines Olsen', r:'Creative', c:'var(--sky)', b:'All brands'},
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}>
                  <div className="av" style={{ width: 32, height: 32, borderRadius: 16, background: m.c, fontSize: 12 }}>{m.n.split(' ').map(s=>s[0]).join('')}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{m.n}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>{m.r}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-dim)' }}>{m.b}</div>
                  <Icon.Dots size={16} style={{ opacity: 0.5 }}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SettingsScreen });
