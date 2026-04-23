// Calendar + events
function CalendarScreen() {
  // Build a fake month (April 2026)
  const days = Array.from({length: 35}, (_, i) => {
    const date = i - 2; // offset so Apr 1 is Wed
    return {
      date: date > 0 && date <= 30 ? date : null,
      prev: date <= 0 ? 31 + date : null,
      next: date > 30 ? date - 30 : null,
      isToday: date === 23,
    };
  });

  const postsByDay = {
    4: [{plats:['instagram'], label:'Studio tour', brand: BRANDS[0], t:'10a'}],
    7: [{plats:['linkedin'], label:'Chair story · thread', brand: BRANDS[1], t:'9a'}],
    10: [{plats:['instagram','threads'], label:'BTS · Issue 04', brand: BRANDS[0], t:'6p'},{plats:['facebook'], label:'Community shoutout', brand: BRANDS[2], t:'3p'}],
    14: [{plats:['youtube'], label:'Trail notes pt.1', brand: BRANDS[3], t:'12p'}],
    17: [{plats:['instagram'], label:'Pour-over bar', brand: BRANDS[2], t:'11a'}],
    18: [{plats:['instagram','linkedin'], label:'Team meeting 🗓', brand: BRANDS[0], t:'2p', event: true}],
    21: [{plats:['threads'], label:'Workshop diaries', brand: BRANDS[1], t:'4p'}],
    23: [
      {plats:['instagram','facebook'], label:'BTS · Issue 04 cover', brand: BRANDS[0], t:'2:30p'},
      {plats:['instagram','threads'], label:'Ritual drop · last call', brand: BRANDS[2], t:'6p'},
    ],
    24: [{plats:['linkedin'], label:'Chair story thread', brand: BRANDS[1], t:'9a'},{plats:['instagram','youtube'], label:'Trail notes', brand: BRANDS[3], t:'12p'}],
    25: [{plats:['instagram','facebook','threads'], label:'★ Cover reveal · Issue 04', brand: BRANDS[0], t:'10:30a', key: true}],
    27: [{plats:['instagram'], label:'Open studio 🎉', brand: BRANDS[0], t:'11a', event: true}],
    29: [{plats:['linkedin','instagram'], label:'Webinar · design intl.', brand: BRANDS[1], t:'3p', event: true}],
  };

  return (
    <div className="orbit" style={{ width: 1440, height: 900, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="calendar" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title="Calendar" sub="April 2026 · 42 posts · 4 events">
          <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--ink-2)', borderRadius: 8 }}>
            {['Month','Week','Day','Timeline'].map((v, i) => (
              <div key={v} style={{ padding: '6px 12px', borderRadius: 5, fontSize: 12, cursor: 'pointer', background: i === 0 ? 'var(--ink-4)' : 'transparent', color: i === 0 ? 'var(--fg)' : 'var(--fg-dim)', fontWeight: i === 0 ? 500 : 400 }}>{v}</div>
            ))}
          </div>
          <div className="chip"><Icon.Globe size={11}/> Audience time</div>
          <button className="btn"><Icon.Plus size={14}/> Event</button>
          <button className="btn primary"><Icon.Pen size={14}/> Compose</button>
        </TopBar>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', overflow: 'hidden' }}>
          {/* Calendar grid */}
          <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <h2 className="display" style={{ fontSize: 40, margin: 0, fontStyle: 'normal', fontWeight: 500 }}>April <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>2026</span></h2>
              <div style={{ flex: 1 }}/>
              <div style={{ display: 'flex', gap: 2 }}>
                <button className="btn ghost" style={{ padding: '8px' }}><Icon.Chevron size={16} style={{ transform: 'rotate(180deg)' }}/></button>
                <button className="btn ghost" style={{ padding: '6px 14px', fontSize: 12 }}>Today</button>
                <button className="btn ghost" style={{ padding: '8px' }}><Icon.Chevron size={16}/></button>
              </div>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
              {['MON','TUE','WED','THU','FRI','SAT','SUN'].map(d => (
                <div key={d} style={{ fontSize: 10.5, letterSpacing: 1.3, color: 'var(--muted)', fontWeight: 500, padding: '4px 8px' }}>{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: 6 }}>
              {days.map((d, i) => {
                const dayNum = d.date;
                const items = dayNum ? postsByDay[dayNum] || [] : [];
                const isFaded = !dayNum;
                return (
                  <div key={i} style={{
                    background: d.isToday ? 'rgba(255,90,31,0.06)' : isFaded ? 'transparent' : 'var(--ink-2)',
                    border: '1px solid ' + (d.isToday ? 'var(--coral)' : 'var(--line)'),
                    borderRadius: 10, padding: 8, position: 'relative', overflow: 'hidden',
                    opacity: isFaded ? 0.35 : 1,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                      <div className="numeral" style={{
                        fontSize: 13, fontWeight: d.isToday ? 600 : 400,
                        color: d.isToday ? 'var(--coral)' : isFaded ? 'var(--muted-2)' : 'var(--fg)',
                      }}>{dayNum || d.prev || d.next}</div>
                      {d.isToday && <div style={{ fontSize: 9, color: 'var(--coral)', marginLeft: 'auto', fontWeight: 500, letterSpacing: 1 }}>TODAY</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {items.slice(0, 3).map((it, j) => (
                        <div key={j} style={{
                          fontSize: 10.5,
                          background: it.key ? 'var(--coral)' : it.event ? 'rgba(107,92,255,0.2)' : 'rgba(255,255,255,0.04)',
                          color: it.key ? '#fff' : 'var(--fg)',
                          border: '1px solid ' + (it.key ? 'var(--coral)' : it.event ? 'rgba(107,92,255,0.4)' : 'var(--line)'),
                          padding: '3px 6px', borderRadius: 4,
                          display: 'flex', gap: 4, alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                        }}>
                          <div style={{ width: 5, height: 5, borderRadius: 3, background: it.brand.color, flexShrink: 0 }}/>
                          <span className="numeral" style={{ fontSize: 9, opacity: 0.8 }}>{it.t}</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span>
                        </div>
                      ))}
                      {items.length > 3 && <div style={{ fontSize: 10, color: 'var(--muted)' }}>+{items.length - 3} more</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right rail — events + campaigns */}
          <div style={{ padding: '20px 20px', borderLeft: '1px solid var(--line)', background: '#09090B', overflowY: 'auto' }}>
            <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Upcoming events</div>
            {[
              {title:'Issue 04 · Cover reveal', date:'Fri, Apr 25', time:'10:30 AM', posts: 3, type:'Launch', color:'var(--coral)'},
              {title:'Open Studio · Luma', date:'Sun, Apr 27', time:'11 AM – 5 PM', posts: 2, type:'In-person', color:'var(--lime)'},
              {title:'Design Intl. · Webinar', date:'Tue, Apr 29', time:'3 PM GMT', posts: 4, type:'Live stream', color:'var(--violet)'},
              {title:'Team content review', date:'Thu, May 1', time:'2 PM', posts: 0, type:'Internal', color:'var(--sky)'},
            ].map((e, i) => (
              <div key={i} className="card" style={{ padding: 14, marginBottom: 10, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: e.color }}/>
                <div style={{ fontSize: 10.5, color: e.color, letterSpacing: 1, textTransform: 'uppercase' }}>{e.type}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{e.title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4, display: 'flex', gap: 10 }}>
                  <span><Icon.Calendar size={11} style={{ display:'inline', marginRight: 4, verticalAlign:'-2px' }}/>{e.date}</span>
                  <span>{e.time}</span>
                </div>
                {e.posts > 0 && (
                  <div style={{ fontSize: 11, marginTop: 8, color: 'var(--fg-dim)' }}>
                    <b>{e.posts}</b> linked posts scheduled
                  </div>
                )}
              </div>
            ))}

            <div className="hr" style={{ margin: '18px 0' }}/>

            <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Active campaigns</div>
            {[
              {name:'Issue 04 launch', brand: BRANDS[0], progress: 33, posts: 3, total: 9, start:'Apr 18', end:'May 2', bg:'linear-gradient(135deg, #FF5A1F, #FF4D8F)'},
              {name:'Ritual drop', brand: BRANDS[2], progress: 75, posts: 6, total: 8, start:'Apr 10', end:'Apr 24', bg:'linear-gradient(135deg, #D4FF3A, #5AC8FF)'},
              {name:'Trail series', brand: BRANDS[3], progress: 22, posts: 2, total: 9, start:'Apr 24', end:'May 10', bg:'linear-gradient(135deg, #5AC8FF, #6B5CFF)'},
            ].map((c, i) => (
              <div key={i} className="card" style={{ padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: c.bg }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{c.brand.name} · {c.start} – {c.end}</div>
                  </div>
                </div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 4, background: 'var(--ink-3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${c.progress}%`, height: '100%', background: c.bg }}/>
                  </div>
                  <div className="numeral" style={{ fontSize: 11, color: 'var(--fg-dim)' }}>{c.posts}/{c.total}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CalendarScreen });
