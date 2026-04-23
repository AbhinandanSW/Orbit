// Content library — drafts, scheduled, published
function LibraryScreen() {
  const tabs = [
    {id:'all', l:'All', n: 284},
    {id:'drafts', l:'Drafts', n: 42},
    {id:'scheduled', l:'Scheduled', n: 18},
    {id:'published', l:'Published', n: 216},
    {id:'review', l:'Needs review', n: 6},
    {id:'failed', l:'Failed', n: 2},
  ];

  const posts = Array.from({length: 18}, (_, i) => {
    const plats = [['instagram'], ['linkedin'], ['instagram','threads'], ['linkedin','facebook'], ['youtube'], ['instagram','facebook','threads']];
    const statuses = ['scheduled','draft','published','published','scheduled','review','published','draft'];
    const captions = [
      'Issue 04 cover reveal — the long road.',
      'Why we scrapped the chair three times.',
      'Pour-over bar opens this weekend.',
      'Field notes from the Colorado backcountry.',
      'Meet the makers behind the Ritual drop.',
      'Workshop diaries · week 14.',
      'Open studio · April 27.',
      'A letter from the editor.',
    ];
    return {
      seed: i % 8,
      caption: captions[i % captions.length],
      plats: plats[i % plats.length],
      status: statuses[i % statuses.length],
      time: ['Today 6pm','Tomorrow 9am','Apr 25, 10:30 AM','Apr 26, 12pm','Apr 27, 8am','Apr 28, 2pm'][i % 6],
      brand: BRANDS[i % BRANDS.length],
      eng: (Math.random() * 8 + 2).toFixed(1),
      reach: Math.floor(Math.random() * 200 + 20),
    };
  });

  const statusStyle = (s) => ({
    scheduled: { bg:'rgba(107,92,255,0.14)', c:'#9B8FFF', l:'● Scheduled' },
    draft: { bg:'rgba(255,255,255,0.06)', c:'var(--fg-dim)', l:'○ Draft' },
    published: { bg:'rgba(212,255,58,0.1)', c:'var(--lime)', l:'✓ Published' },
    review: { bg:'rgba(255,90,31,0.12)', c:'var(--coral-2)', l:'◐ Needs review' },
  }[s]);

  return (
    <div className="orbit" style={{ width: 1440, height: 900, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="library" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title="Library" sub="284 posts across 5 brands · 12 pinned">
          <div className="chip"><Icon.Search size={12}/> Search captions, tags, people</div>
          <button className="btn"><Icon.Filter size={14}/> Filters · 2</button>
          <button className="btn primary"><Icon.Plus size={14}/> New post</button>
        </TopBar>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 40px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--line)', marginBottom: 20 }}>
            {tabs.map((t, i) => (
              <div key={t.id} style={{
                padding: '10px 16px', fontSize: 13,
                color: i === 2 ? 'var(--fg)' : 'var(--fg-dim)',
                borderBottom: '2px solid ' + (i === 2 ? 'var(--coral)' : 'transparent'),
                marginBottom: -1, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center',
                fontWeight: i === 2 ? 500 : 400,
              }}>
                {t.l}
                <span style={{ fontSize: 10.5, color: 'var(--muted)', background: 'var(--ink-2)', padding: '1px 6px', borderRadius: 10 }} className="numeral">{t.n}</span>
              </div>
            ))}
            <div style={{ flex: 1 }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="chip">All platforms</div>
              <div className="chip">Last 30 days</div>
              <div style={{ padding: 3, background: 'var(--ink-2)', borderRadius: 7, display: 'flex', gap: 2 }}>
                <div style={{ padding: '5px 8px', background: 'var(--ink-4)', borderRadius: 5 }}><Icon.Library size={13}/></div>
                <div style={{ padding: '5px 8px' }}><Icon.Menu size={13}/></div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
            {posts.map((p, i) => {
              const s = statusStyle(p.status);
              return (
                <div key={i} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ position: 'relative' }}>
                    <Placeholder seed={p.seed} style={{ width: '100%', aspectRatio: '1', borderRadius: 0 }} />
                    <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4 }}>
                      {p.plats.map(pl => {
                        const P = Platform[pl];
                        return <div key={pl} style={{ width: 20, height: 20, borderRadius: 5, background: PlatformBg[pl], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', backdropFilter: 'blur(10px)' }}><P size={11}/></div>;
                      })}
                    </div>
                    <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 9.5, background: s.bg, color: s.c, padding: '3px 7px', borderRadius: 5, fontWeight: 500, letterSpacing: 0.2 }}>{s.l}</div>
                    {p.status === 'published' && (
                      <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', padding: '3px 7px', borderRadius: 5, fontSize: 10, color: '#fff' }} className="numeral">
                        ❤ {p.reach}k · {p.eng}%
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--muted)' }}>
                      <div className="av" style={{ width: 12, height: 12, borderRadius: 3, background: p.brand.color, fontSize: 6 }}>{p.brand.initials}</div>
                      {p.brand.name}
                    </div>
                    <div style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.35, height: 34, overflow: 'hidden' }}>{p.caption}</div>
                    {(p.status === 'scheduled' || p.status === 'review') && (
                      <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon.Clock size={10}/> {p.time}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LibraryScreen });
