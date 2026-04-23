// Social account verification / connection flow
function VerifyScreen() {
  const platforms = [
    { id: 'instagram', name: 'Instagram', bg: PlatformBg.instagram, status: 'connected', handle: '@lumastudio', account: 'Luma Studio · Business', Icon: Platform.instagram },
    { id: 'facebook', name: 'Facebook', bg: PlatformBg.facebook, status: 'connected', handle: 'Luma Studio', account: 'Page · 24.2k followers', Icon: Platform.facebook },
    { id: 'linkedin', name: 'LinkedIn', bg: PlatformBg.linkedin, status: 'verifying', handle: 'Luma Studio', account: 'Company page', Icon: Platform.linkedin },
    { id: 'youtube', name: 'YouTube', bg: PlatformBg.youtube, status: 'unconnected', Icon: Platform.youtube },
    { id: 'threads', name: 'Threads', bg: PlatformBg.threads, status: 'unconnected', Icon: Platform.threads },
  ];

  const count = platforms.filter(p => p.status === 'connected').length;

  return (
    <div className="orbit" style={{ width: 1440, height: 900, background: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 15 }}>O</div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Orbit</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Step 2 of 3 · Workspace setup</div>
        <div className="chip">Skip for now</div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 540px' }}>
        {/* Left — main */}
        <div style={{ padding: '56px 72px', overflowY: 'auto' }}>
          {/* Progress */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 3, background: 'var(--coral)', borderRadius: 2 }} />
            <div style={{ flex: 1, height: 3, background: 'var(--coral)', borderRadius: 2 }} />
            <div style={{ flex: 1, height: 3, background: 'var(--line)', borderRadius: 2 }} />
          </div>

          <h1 className="display" style={{ fontSize: 68, margin: 0, lineHeight: 1 }}>
            Connect the <span style={{ color: 'var(--coral)' }}>accounts</span><br/>
            you post to.
          </h1>
          <p style={{ fontSize: 15, color: 'var(--fg-dim)', maxWidth: 520, marginTop: 18, lineHeight: 1.6 }}>
            Verify ownership for each channel under <b style={{ color: 'var(--fg)' }}>Luma Studio</b>. You can always add more brands and accounts later from Settings.
          </p>

          {/* Count */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 36 }}>
            <div className="numeral" style={{ fontSize: 64, fontWeight: 500, letterSpacing: -0.04 + 'em' }}>{count}<span style={{ color: 'var(--muted-2)' }}>/5</span></div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>accounts verified</div>
            <div style={{ flex: 1 }} />
            <button className="btn"><Icon.Plus size={14} /> Add custom webhook</button>
          </div>

          {/* Platform rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
            {platforms.map(p => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 18,
                padding: '18px 20px',
                background: p.status === 'connected' ? 'rgba(212,255,58,0.04)' : 'var(--ink-2)',
                border: '1px solid ' + (p.status === 'connected' ? 'rgba(212,255,58,0.2)' : 'var(--line)'),
                borderRadius: 14,
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <p.Icon size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>
                    {p.status === 'connected' && <>{p.handle} · {p.account}</>}
                    {p.status === 'verifying' && <>Verifying domain ownership…</>}
                    {p.status === 'unconnected' && <>Not connected</>}
                  </div>
                </div>
                {p.status === 'connected' && (
                  <>
                    <div className="chip lime"><Icon.Check size={11}/> Verified</div>
                    <Icon.Dots size={18} style={{ opacity: 0.5, cursor: 'pointer' }} />
                  </>
                )}
                {p.status === 'verifying' && (
                  <>
                    <div className="chip coral">
                      <div style={{ width: 10, height: 10, border: '1.5px solid var(--coral)', borderTopColor: 'transparent', borderRadius: 5, animation: 'spin 0.8s linear infinite' }} />
                      Verifying
                    </div>
                    <button className="btn">Open link</button>
                  </>
                )}
                {p.status === 'unconnected' && (
                  <button className="btn primary">Connect {p.name}</button>
                )}
              </div>
            ))}
          </div>

          {/* Foot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 40 }}>
            <button className="btn">← Back</button>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>You can finish setup with the accounts you have.</div>
            <button className="btn primary">Continue to dashboard <Icon.Arrow size={15}/></button>
          </div>
        </div>

        {/* Right — preview panel */}
        <div style={{ padding: 32, background: '#09090B', borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, color: 'var(--muted-2)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 14 }}>Why we verify</div>
          <h3 className="display" style={{ fontSize: 34, margin: 0, color: 'var(--fg)', lineHeight: 1.05 }}>
            Verified accounts <span style={{ color: 'var(--coral)' }}>post 3.2×</span> faster — and never get rate-limited.
          </h3>

          <div className="card" style={{ marginTop: 28, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: PlatformBg.instagram, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Platform.instagram size={16}/></div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>@lumastudio</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Instagram Business · connected just now</div>
              </div>
              <Icon.Check size={16} style={{ marginLeft: 'auto', color: 'var(--lime)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
              {[0,1,2,3].map(i => <Placeholder key={i} seed={i+1} style={{ aspectRatio: '1', borderRadius: 6 }} />)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span>Recent posts synced</span>
              <span className="numeral">24</span>
            </div>
          </div>

          <div className="card" style={{ marginTop: 14, padding: 18, display: 'flex', gap: 14, alignItems: 'center' }}>
            <Icon.Users size={20} style={{ color: 'var(--violet)' }} />
            <div style={{ fontSize: 12.5, flex: 1 }}>
              <div style={{ fontWeight: 500 }}>Invite teammates</div>
              <div style={{ color: 'var(--muted)', marginTop: 2 }}>Share drafts, approvals, calendars.</div>
            </div>
            <button className="btn">Invite</button>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon.Check size={12} style={{ color: 'var(--lime)' }}/> End-to-end encrypted sync
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon.Check size={12} style={{ color: 'var(--lime)' }}/> SOC 2 Type II · ISO 27001
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { VerifyScreen });
