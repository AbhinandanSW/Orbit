// Shared data + layout primitives for Orbit screens.

const BRANDS = [
  { id: 'luma', name: 'Luma Studio', color: '#FF5A1F', initials: 'LS' },
  { id: 'arc', name: 'Arc & Oak', color: '#6B5CFF', initials: 'AO' },
  { id: 'kin', name: 'Kinfolk Coffee', color: '#D4FF3A', initials: 'KC' },
  { id: 'verge', name: 'Verge Athletics', color: '#5AC8FF', initials: 'VA' },
  { id: 'mira', name: 'Mira Botanics', color: '#FF4D8F', initials: 'MB' },
];

const USER = { name: 'Noor Idris', email: 'noor@studiofield.co', initials: 'NI', role: 'Social lead', agency: 'Field Studio' };

// Sidebar nav — shared across in-product screens.
function Sidebar({ active = 'dashboard', compact = false, brand = BRANDS[0] }) {
  const items = [
    { id: 'autopilot', label: 'Autopilot', icon: Icon.Sparkle },
    { id: 'goals', label: 'Goals', icon: Icon.Crown },
    { id: 'dashboard', label: 'Dashboard', icon: Icon.Home },
    { id: 'composer', label: 'Compose', icon: Icon.Pen },
    { id: 'library', label: 'Library', icon: Icon.Library },
    { id: 'calendar', label: 'Calendar', icon: Icon.Calendar },
    { id: 'performance', label: 'Performance', icon: Icon.Chart },
    { id: 'automations', label: 'Automations', icon: Icon.Settings },
    { id: 'assistant', label: 'Ask Orbit', icon: Icon.Send, badge: 'AI' },
  ];
  return (
    <aside style={{
      width: compact ? 72 : 240, flexShrink: 0,
      background: '#0A0A0C',
      borderRight: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 20px' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>O</div>
        {!compact && <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: -0.3 }}>Orbit</div>}
        {!compact && <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)', padding: '2px 6px', border: '1px solid var(--line)', borderRadius: 4 }}>⌘K</div>}
      </div>

      {!compact && (
        <div style={{ padding: '10px 10px 14px' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--muted-2)', marginBottom: 8 }}>Workspace</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', borderRadius: 10, cursor: 'pointer' }}>
            <div className="av" style={{ width: 24, height: 24, borderRadius: 6, background: brand.color, fontSize: 10 }}>{brand.initials}</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{brand.name}</div>
            <Icon.ChevronDown size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
          </div>
        </div>
      )}

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
        {items.map(it => {
          const isActive = it.id === active;
          return (
            <div key={it.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: compact ? '10px' : '9px 12px', borderRadius: 10,
              background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
              color: isActive ? 'var(--fg)' : 'var(--fg-dim)',
              fontSize: 13.5, fontWeight: isActive ? 500 : 400,
              cursor: 'pointer',
              justifyContent: compact ? 'center' : 'flex-start',
              position: 'relative',
            }}>
              <it.icon size={17} />
              {!compact && <span>{it.label}</span>}
              {!compact && it.badge && <span style={{ marginLeft: 'auto', fontSize: 10, background: it.badge === 'AI' ? 'var(--lime)' : 'var(--coral)', color: it.badge === 'AI' ? '#0E0E10' : '#fff', padding: '1px 6px', borderRadius: 10, fontWeight: 600, letterSpacing: 0.5 }}>{it.badge}</span>}
              {isActive && <div style={{ position: 'absolute', left: -14, top: 10, bottom: 10, width: 2, background: 'var(--coral)', borderRadius: 2 }} />}
            </div>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {!compact && (
        <>
          <div style={{ padding: '10px 10px 6px' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--muted-2)', marginBottom: 8 }}>Other brands</div>
            {BRANDS.slice(1, 4).map(b => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 12.5, color: 'var(--fg-dim)', cursor: 'pointer' }}>
                <div className="av" style={{ width: 18, height: 18, borderRadius: 4, background: b.color, fontSize: 8 }}>{b.initials}</div>
                <span>{b.name}</span>
              </div>
            ))}
          </div>
          <div className="hr" style={{ margin: '12px 0' }} />
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px' }}>
        <div className="av" style={{ width: 28, height: 28, borderRadius: 14, background: 'var(--violet)', color: '#fff', fontSize: 11 }}>{USER.initials}</div>
        {!compact && (
          <>
            <div style={{ fontSize: 12.5, lineHeight: 1.15 }}>
              <div style={{ fontWeight: 500 }}>{USER.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{USER.agency}</div>
            </div>
            <Icon.Settings size={15} style={{ marginLeft: 'auto', opacity: 0.5, cursor: 'pointer' }} />
          </>
        )}
      </div>
    </aside>
  );
}

// Top bar used on most screens
function TopBar({ title, sub, rightExtra, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '18px 28px',
      borderBottom: '1px solid var(--line)',
      background: 'var(--ink)',
      position: 'sticky', top: 0, zIndex: 5,
    }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.5 }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ flex: 1 }} />
      {children}
      {rightExtra}
      <div style={{ position: 'relative' }}>
        <Icon.Bell size={18} style={{ opacity: 0.7, cursor: 'pointer' }} />
        <div style={{ position: 'absolute', top: -3, right: -3, width: 7, height: 7, borderRadius: 4, background: 'var(--coral)' }} />
      </div>
    </div>
  );
}

// Lightweight SVG sparkline
function Spark({ data, stroke = '#FF5A1F', fill, width = 120, height = 36, area = true }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 4) - 2}`);
  const line = `M ${pts.join(' L ')}`;
  const fillPath = `M 0,${height} L ${pts.join(' L ')} L ${width},${height} Z`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {area && <path d={fillPath} fill={fill || stroke} opacity={0.15} />}
      <path d={line} stroke={stroke} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Fake placeholder image blocks — gradient pattern
function Placeholder({ seed = 0, children, style, label }) {
  const grads = [
    'linear-gradient(135deg, #FF5A1F, #FF4D8F)',
    'linear-gradient(135deg, #6B5CFF, #5AC8FF)',
    'linear-gradient(135deg, #D4FF3A, #5AC8FF)',
    'linear-gradient(135deg, #1A1A1E, #35353D)',
    'linear-gradient(135deg, #FF4D8F, #FF5A1F)',
    'linear-gradient(135deg, #0E0E10, #6B5CFF)',
    'linear-gradient(135deg, #F6F2EA, #D4FF3A)',
    'linear-gradient(135deg, #FF5A1F 40%, #0E0E10)',
  ];
  return (
    <div style={{
      background: grads[seed % grads.length],
      borderRadius: 8, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 500,
      letterSpacing: 0.5, textTransform: 'uppercase',
      position: 'relative',
      ...style,
    }}>
      {label && <div style={{ position: 'absolute', bottom: 8, left: 8, fontSize: 10, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{label}</div>}
      {children}
    </div>
  );
}

Object.assign(window, { Sidebar, TopBar, Spark, Placeholder, BRANDS, USER });
