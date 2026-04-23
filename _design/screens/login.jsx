// Login / Onboarding screen — Gmail sign in
function LoginScreen() {
  const [step, setStep] = React.useState('welcome'); // welcome | signing-in | signed-in

  return (
    <div className="orbit" style={{ width: 1440, height: 900, display: 'flex', overflow: 'hidden', position: 'relative' }}>
      {/* Left — brand side */}
      <div style={{
        width: 720, padding: '56px 64px',
        background: 'linear-gradient(135deg, #0E0E10 0%, #1A1A1E 100%)',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 18 }}>O</div>
          <div style={{ fontWeight: 600, letterSpacing: -0.3, fontSize: 17 }}>Orbit</div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div>
            <div className="chip coral" style={{ marginBottom: 22 }}>
              <span className="dot" style={{ background: 'var(--coral)' }} />
              For social teams & agencies
            </div>
            <h1 className="display" style={{ fontSize: 104, margin: 0, color: 'var(--fg)' }}>
              One workspace<br/>
              <span style={{ color: 'var(--coral)' }}>every</span> channel<br/>
              <span className="upright" style={{ fontStyle: 'normal', fontFamily: 'Geist, Inter, sans-serif', fontWeight: 500, fontSize: 88, letterSpacing: -0.05 + 'em' }}>one feed.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--fg-dim)', maxWidth: 480, marginTop: 28, lineHeight: 1.5 }}>
              Plan, schedule, and measure across Instagram, LinkedIn, YouTube, Threads, and Facebook — for every brand you run.
            </p>

            <div style={{ display: 'flex', gap: 24, marginTop: 44, color: 'var(--muted)', fontSize: 12.5 }}>
              <div><span style={{ color: 'var(--fg)', fontWeight: 600, fontSize: 22, display: 'block' }} className="numeral">12k</span> agencies</div>
              <div><span style={{ color: 'var(--fg)', fontWeight: 600, fontSize: 22, display: 'block' }} className="numeral">4.8M</span> posts/mo</div>
              <div><span style={{ color: 'var(--fg)', fontWeight: 600, fontSize: 22, display: 'block' }} className="numeral">56</span> countries</div>
            </div>
          </div>
        </div>

        {/* Decorative floating chips */}
        <div style={{ position: 'absolute', top: 140, right: -40, transform: 'rotate(8deg)' }}>
          <div style={{ background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 14, padding: 14, width: 260, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--muted)' }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, background: PlatformBg.instagram, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Platform.instagram size={11} /></div>
              Instagram · scheduled
            </div>
            <div style={{ fontSize: 13, marginTop: 6 }}>"Summer drop #3 — teaser carousel. Going live Thursday 6pm."</div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 120, right: 60, transform: 'rotate(-6deg)' }}>
          <div style={{ background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 14, padding: 12, width: 220, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: 1 }}>
              <Icon.ArrowUpRight size={12} /> +48% eng. week
            </div>
            <Spark data={[3,5,4,8,7,12,14,11,16,18]} stroke="#D4FF3A" width={200} height={38} />
          </div>
        </div>

        {/* Foot */}
        <div style={{ fontSize: 11.5, color: 'var(--muted-2)', display: 'flex', gap: 22 }}>
          <span>© 2026 Orbit Labs</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Status · All systems go</span>
        </div>
      </div>

      {/* Right — sign-in panel */}
      <div style={{ flex: 1, padding: '56px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--ink)' }}>
        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: 'var(--muted-2)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 14 }}>Sign in</div>
          <h2 className="display" style={{ fontSize: 56, margin: 0, color: 'var(--fg)', lineHeight: 1 }}>
            Welcome back.
          </h2>
          <p style={{ fontSize: 14.5, color: 'var(--fg-dim)', marginTop: 16, lineHeight: 1.6 }}>
            Pick up where you left off — your scheduled queue, analytics, and team comments are waiting.
          </p>

          {/* Google button */}
          <button
            onClick={() => setStep(step === 'signed-in' ? 'welcome' : step === 'welcome' ? 'signing-in' : 'signed-in')}
            style={{
              marginTop: 32, width: '100%', padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              background: '#fff', color: '#0E0E10', border: 'none', borderRadius: 12,
              fontSize: 15, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'inherit', boxShadow: '0 8px 24px rgba(255,255,255,0.08)',
            }}>
            <svg width="20" height="20" viewBox="0 0 20 20"><path d="M19.6 10.2c0-.7-.1-1.4-.2-2H10v3.7h5.4c-.2 1.3-.9 2.3-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2z" fill="#4285F4"/><path d="M10 20c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H1.1v2.6C2.8 17.8 6.1 20 10 20z" fill="#34A853"/><path d="M4.4 11.9c-.2-.6-.3-1.3-.3-1.9s.1-1.3.3-1.9V5.5H1.1a10 10 0 000 9l3.3-2.6z" fill="#FBBC05"/><path d="M10 4c1.5 0 2.8.5 3.8 1.5l2.8-2.8C15 1.2 12.7 0 10 0 6.1 0 2.8 2.2 1.1 5.5l3.3 2.6C5.2 5.7 7.4 4 10 4z" fill="#EA4335"/></svg>
            Continue with Google
            {step === 'signing-in' && <div style={{ marginLeft: 'auto', width: 14, height: 14, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0E0E10', borderRadius: 7, animation: 'spin 0.8s linear infinite' }} />}
            {step === 'signed-in' && <Icon.Check size={16} style={{ marginLeft: 'auto', color: '#0E9A3E' }} />}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '26px 0', fontSize: 11, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 1.4 }}>
            <div className="hr" style={{ flex: 1 }} /> or <div className="hr" style={{ flex: 1 }} />
          </div>

          {/* SSO / work email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              <Icon.Users size={16} />
              Sign in with Microsoft 365
            </button>
            <button className="btn" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              <Icon.Link size={16} />
              SSO · SAML for agencies
            </button>
          </div>

          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 36, lineHeight: 1.6 }}>
            By continuing, you agree to Orbit's <span style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 2 }}>Terms</span> and <span style={{ color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 2 }}>Privacy Notice</span>. We'll never post on your behalf without approval.
          </p>

          <div style={{ marginTop: 24, padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 10, background: 'rgba(212,255,58,0.04)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <Icon.Sparkle size={18} style={{ color: 'var(--lime)' }} />
            <div style={{ fontSize: 12.5, color: 'var(--fg-dim)' }}>
              <span style={{ color: 'var(--fg)', fontWeight: 500 }}>New:</span> AI caption studio — try it on your first post.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LoginScreen });
