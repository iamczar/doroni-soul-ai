// pickers.jsx — bottom-sheet pickers: location, date, time
// All match the dark cockpit aesthetic and share a <SheetShell> chrome.

// ────────────────────────────────────────────────────────────────────
// Sheet shell
// ────────────────────────────────────────────────────────────────────
function SheetShell({ title, subtitle, onClose, children, footer }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'absolute', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUpSheet { from { transform: translateY(30px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-2)',
          borderTopLeftRadius: 18, borderTopRightRadius: 18,
          borderTop: '1px solid var(--line-strong)',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '92%',
          animation: 'slideUpSheet 0.22s cubic-bezier(.2,.7,.3,1)',
          overflow: 'hidden',
        }}
      >
        {/* grip */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--line-strong)' }} />
        </div>
        {/* header */}
        <div style={{
          padding: '6px var(--pad-x) 12px',
          borderBottom: '1px solid var(--line-1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div className="col" style={{ gap: 2, flex: 1, minWidth: 0 }}>
            {subtitle && <span className="label" style={{ fontSize: 9 }}>{subtitle}</span>}
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>{title}</h3>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 999,
            background: 'var(--bg-glass)', color: 'var(--t-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><IconX size={16} /></button>
        </div>
        {/* body */}
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
        {footer && (
          <div style={{
            padding: '10px var(--pad-x) 14px',
            borderTop: '1px solid var(--line-1)',
            background: 'var(--bg-2)',
          }}>{footer}</div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Location picker
// ────────────────────────────────────────────────────────────────────
const LOC_BOOK = [
  { id:'cur',    code:'CUR',      name:'Current location',           sub:'GPS · 25.7745°N 80.1932°W',      kind:'cur',     lat:25.7745, lng:-80.1932 },
  { id:'brk',    code:'BRK-VP01', name:'Brickell Vertiport',          sub:'1100 SE 1st St · Miami FL',      kind:'saved',   lat:25.756,  lng:-80.200  },
  { id:'ave',    code:'AVE-VP02', name:'Aventura Skyport',            sub:'19501 Biscayne Blvd · Aventura', kind:'saved',   lat:25.957,  lng:-80.143  },
  { id:'home',   code:'HOME-01',  name:'Home pad',                    sub:'4150 Granada Blvd · Coral Gables',kind:'saved',  lat:25.745,  lng:-80.260  },
  { id:'kfxe',   code:'KFXE',     name:'KFXE — Fort Lauderdale Exec', sub:'Class D · 5000 NW 21st Ave',     kind:'airport', lat:26.197,  lng:-80.171  },
  { id:'kbi',    code:'KBI-VP',   name:'Key Biscayne Pad',            sub:'Crandon Park · MIA-DADE',        kind:'saved',   lat:25.690,  lng:-80.163  },
  { id:'office', code:'OFFICE-A', name:'Office helipad',              sub:'600 Brickell Ave · Suite PH',    kind:'saved',   lat:25.759,  lng:-80.193  },
  { id:'kmia',   code:'KMIA',     name:'Miami International',         sub:'Class B · 2100 NW 42nd Ave',     kind:'airport', lat:25.796,  lng:-80.287  },
  { id:'kopf',   code:'KOPF',     name:'Opa-Locka Exec',              sub:'Class D · 14201 NW 42nd Ave',    kind:'airport', lat:25.907,  lng:-80.278  },
  { id:'kmpb',   code:'KMPB',     name:'Miami Seaplane Base',         sub:'1000 MacArthur Cswy · Watson Is',kind:'airport', lat:25.782,  lng:-80.169  },
  { id:'klan',   code:'WAYPT-WL', name:'Wynwood landing',             sub:'2516 NW 2nd Ave · Miami FL',     kind:'saved',   lat:25.800,  lng:-80.197  },
  { id:'srch1',  code:'',         name:'2451 Brickell Ave',           sub:'Miami, FL 33129',                kind:'address', lat:25.751,  lng:-80.193  },
  { id:'srch2',  code:'',         name:'2333 Ponce de Leon Blvd',     sub:'Coral Gables, FL 33134',         kind:'address', lat:25.745,  lng:-80.257  },
  { id:'srch3',  code:'',         name:'4400 NW 36th St',             sub:'Miami Springs, FL 33166',        kind:'address', lat:25.818,  lng:-80.289  },
  { id:'srch4',  code:'',         name:'8888 SW 136th St',            sub:'Pinecrest, FL 33176',            kind:'address', lat:25.659,  lng:-80.330  },
  { id:'srch5',  code:'',         name:'19999 W Country Club Dr',     sub:'Aventura, FL 33180',             kind:'address', lat:25.957,  lng:-80.143  },
];

function LocationPicker({ title, subtitle, allowCurrent, onClose, onPick }) {
  const [q, setQ] = React.useState('');
  const norm = q.trim().toLowerCase();
  const list = LOC_BOOK.filter((l) => {
    if (l.kind === 'cur' && !allowCurrent) return false;
    if (!norm) return true;
    return (
      l.name.toLowerCase().includes(norm) ||
      l.sub.toLowerCase().includes(norm) ||
      l.code.toLowerCase().includes(norm)
    );
  });
  const saved   = list.filter((l) => l.kind === 'saved');
  const airports= list.filter((l) => l.kind === 'airport');
  const addrs   = list.filter((l) => l.kind === 'address');

  return (
    <SheetShell title={title || 'Pick location'} subtitle={subtitle} onClose={onClose}>
      {/* search */}
      <div style={{ padding: '10px var(--pad-x) 6px' }}>
        <label className="row" style={{
          gap: 8, padding: '10px 12px', borderRadius: 10,
          background: 'var(--bg-1)', border: '1px solid var(--line-1)',
        }}>
          <IconSearch size={16} style={{ color: 'var(--t-3)' }} />
          <input
            autoFocus
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search address, airport or saved place"
            style={{
              flex: 1, background: 'transparent', border: 0, outline: 'none',
              color: 'var(--t-1)', font: 'inherit', fontSize: 14, padding: 0,
            }}
          />
          {q && (
            <button onClick={() => setQ('')} style={{ color: 'var(--t-3)' }}>
              <IconX size={14} />
            </button>
          )}
        </label>
      </div>

      {allowCurrent && !q && (
        <button
          onClick={() => onPick(LOC_BOOK[0])}
          className="row"
          style={{
            width: '100%', textAlign: 'left',
            padding: '12px var(--pad-x)', gap: 12,
            color: 'var(--t-1)', borderBottom: '1px solid var(--line-1)',
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 999,
            background: 'var(--orange-soft)', color: 'var(--orange)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconPin size={16} />
          </div>
          <div className="col" style={{ flex: 1, gap: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Use current location</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--t-3)' }}>
              GPS · 25.7745°N 80.1932°W
            </span>
          </div>
        </button>
      )}

      {!q ? (
        <>
          {saved.length > 0    && <LocGroup label="Saved places"    items={saved}    onPick={onPick} />}
          {airports.length > 0 && <LocGroup label="Nearby airports" items={airports} onPick={onPick} />}
        </>
      ) : (
        <>
          {saved.length > 0    && <LocGroup label="Saved places"    items={saved}    onPick={onPick} />}
          {airports.length > 0 && <LocGroup label="Airports"        items={airports} onPick={onPick} />}
          {addrs.length > 0    && <LocGroup label="Addresses"       items={addrs}    onPick={onPick} />}
        </>
      )}

      {q && list.length === 0 && (
        <div style={{ padding: '24px var(--pad-x)', color: 'var(--t-3)', fontSize: 13, textAlign: 'center' }}>
          No matches for “{q}”
        </div>
      )}

      <div style={{ height: 18 }} />
    </SheetShell>
  );
}

function LocGroup({ label, items, onPick }) {
  return (
    <div>
      <div className="label" style={{ padding: '14px var(--pad-x) 6px', fontSize: 10 }}>{label}</div>
      {items.map((it, i) => (
        <button
          key={it.id}
          onClick={() => onPick(it)}
          className="row"
          style={{
            width: '100%', textAlign: 'left',
            padding: '11px var(--pad-x)', gap: 12,
            color: 'var(--t-1)',
            borderBottom: i < items.length - 1 ? '1px solid var(--line-1)' : 'none',
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--bg-glass)',
            color: it.kind === 'airport' ? 'var(--cyan)' : it.kind === 'address' ? 'var(--t-2)' : 'var(--orange)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {it.kind === 'airport' ? <IconCraft size={16} /> : <IconWaypoint size={16} />}
          </div>
          <div className="col" style={{ flex: 1, gap: 2, minWidth: 0 }}>
            <div className="row" style={{ gap: 8, minWidth: 0 }}>
              <span style={{
                fontSize: 14, fontWeight: 500, flex: 1, minWidth: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{it.name}</span>
              {it.code && (
                <span className="mono" style={{
                  fontSize: 10, color: 'var(--t-cyan)', letterSpacing: '0.06em',
                  background: 'var(--cyan-soft)', padding: '2px 6px', borderRadius: 4,
                }}>{it.code}</span>
              )}
            </div>
            <span style={{
              fontSize: 11, color: 'var(--t-3)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{it.sub}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Date picker (calendar grid)
// ────────────────────────────────────────────────────────────────────
function parseDateString(s) {
  // accepts "YYYY·MM·DD" or "YYYY-MM-DD"
  const m = String(s || '').match(/(\d{4})\D(\d{1,2})\D(\d{1,2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Date();
}
function fmtDate(d) {
  return `${d.getFullYear()}·${String(d.getMonth()+1).padStart(2,'0')}·${String(d.getDate()).padStart(2,'0')}`;
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function DatePicker({ value, onClose, onPick }) {
  const initial = parseDateString(value);
  const today = new Date();
  const [view, setView] = React.useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [sel, setSel] = React.useState(initial);

  const month = view.getMonth(), year = view.getFullYear();
  const firstDow = new Date(year, month, 1).getDay();
  const daysIn = new Date(year, month + 1, 0).getDate();
  const monthName = view.toLocaleString('en-US', { month: 'long' });

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const shift = (n) => setView(new Date(year, month + n, 1));

  return (
    <SheetShell
      title={`${monthName} ${year}`}
      subtitle="Pick date"
      onClose={onClose}
      footer={
        <div className="row" style={{ gap: 8 }}>
          <button
            onClick={() => { setSel(today); setView(new Date(today.getFullYear(), today.getMonth(), 1)); }}
            className="row"
            style={{
              gap: 6, padding: '10px 14px', borderRadius: 10,
              background: 'var(--bg-glass)', border: '1px solid var(--line-1)',
              color: 'var(--t-2)', fontSize: 13,
            }}
          >Today</button>
          <button
            onClick={() => onPick(fmtDate(sel))}
            style={{
              flex: 1, padding: '12px 14px', borderRadius: 10,
              background: 'var(--orange)', color: '#04080d',
              fontSize: 14, fontWeight: 600, letterSpacing: '0.04em',
            }}
          >Set {fmtDate(sel)}</button>
        </div>
      }
    >
      <div style={{ padding: '8px var(--pad-x) 4px' }}>
        <div className="row" style={{ justifyContent: 'space-between', padding: '4px 0 8px' }}>
          <button onClick={() => shift(-1)} style={navBtn}><IconChevL size={16} /></button>
          <span className="label" style={{ fontSize: 11, color: 'var(--t-2)' }}>{monthName} {year}</span>
          <button onClick={() => shift(1)} style={navBtn}><IconChevR size={16} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} className="mono" style={{
              textAlign: 'center', fontSize: 10, color: 'var(--t-3)',
              letterSpacing: '0.08em', paddingBottom: 4,
            }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const isSel = sameDay(d, sel);
            const isToday = sameDay(d, today);
            const isPast = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            return (
              <button
                key={i}
                onClick={() => setSel(d)}
                disabled={isPast}
                style={{
                  height: 40, borderRadius: 8,
                  background: isSel ? 'var(--orange)' : isToday ? 'var(--orange-soft)' : 'transparent',
                  color: isSel ? '#04080d'
                       : isPast ? 'var(--t-3)'
                       : isToday ? 'var(--orange)' : 'var(--t-1)',
                  fontFamily: 'var(--f-mono)',
                  fontSize: 13, fontWeight: isSel || isToday ? 600 : 400,
                  border: isToday && !isSel ? '1px solid var(--orange)' : '1px solid transparent',
                  opacity: isPast ? 0.4 : 1,
                  cursor: isPast ? 'not-allowed' : 'pointer',
                }}
              >{d.getDate()}</button>
            );
          })}
        </div>
      </div>
    </SheetShell>
  );
}
const navBtn = {
  width: 32, height: 32, borderRadius: 999,
  background: 'var(--bg-glass)', border: '1px solid var(--line-1)',
  color: 'var(--t-1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

// ────────────────────────────────────────────────────────────────────
// Time picker — scroll wheel
// ────────────────────────────────────────────────────────────────────
function parseTime(s) {
  // expects "HH:MM" (24h)
  const m = String(s || '').match(/(\d{1,2}):(\d{2})/);
  let h = m ? Number(m[1]) : 14;
  let mi = m ? Number(m[2]) : 30;
  return { h: Math.max(0, Math.min(23, h)), m: Math.max(0, Math.min(59, mi)) };
}
function fmt24(h, m) {
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function TimePicker({ value, onClose, onPick }) {
  const t = parseTime(value);
  const [h, setH] = React.useState(t.h);
  const [m, setM] = React.useState(t.m);

  return (
    <SheetShell
      title="Set departure time"
      subtitle="ETD · LOCAL"
      onClose={onClose}
      footer={
        <button
          onClick={() => onPick(fmt24(h, m))}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 10,
            background: 'var(--orange)', color: '#04080d',
            fontSize: 14, fontWeight: 600, letterSpacing: '0.04em',
          }}
        >Set {fmt24(h, m)}</button>
      }
    >
      <div style={{ padding: '14px var(--pad-x) 18px', display: 'flex', justifyContent: 'center' }}>
        <div className="row" style={{ gap: 4, alignItems: 'stretch' }}>
          <Wheel
            value={h}
            onChange={setH}
            range={Array.from({length: 24}, (_, i) => i)}
            format={(n) => String(n).padStart(2, '0')}
            label="HR"
          />
          <div className="num" style={{
            fontSize: 40, color: 'var(--t-2)',
            display: 'flex', alignItems: 'center', padding: '0 4px',
          }}>:</div>
          <Wheel
            value={m}
            onChange={setM}
            range={Array.from({length: 60}, (_, i) => i)}
            format={(n) => String(n).padStart(2, '0')}
            label="MIN"
          />
          <div style={{ width: 8 }} />
          <Wheel
            value={h >= 12 ? 1 : 0}
            onChange={(idx) => {
              const meridian = idx === 1;
              if (meridian && h < 12) setH(h + 12);
              if (!meridian && h >= 12) setH(h - 12);
            }}
            range={[0, 1]}
            format={(n) => (n === 0 ? 'AM' : 'PM')}
            label="ZONE"
            wide
          />
        </div>
      </div>
      <div style={{ padding: '0 var(--pad-x) 12px', display: 'flex', gap: 6, justifyContent: 'center' }}>
        {[
          ['Now', () => { const n = new Date(); setH(n.getHours()); setM(n.getMinutes()); }],
          ['+15', () => { let nm = m + 15, nh = h; if (nm >= 60) { nm -= 60; nh = (nh + 1) % 24; } setH(nh); setM(nm); }],
          ['+30', () => { let nm = m + 30, nh = h; if (nm >= 60) { nm -= 60; nh = (nh + 1) % 24; } setH(nh); setM(nm); }],
          ['+1h', () => { setH((h + 1) % 24); }],
        ].map(([l, fn]) => (
          <button key={l} onClick={fn} className="chip chip-line" style={{ cursor: 'pointer' }}>{l}</button>
        ))}
      </div>
    </SheetShell>
  );
}

const WHEEL_ITEM = 36;
const WHEEL_HEIGHT = 5 * WHEEL_ITEM;

function Wheel({ value, onChange, range, format, label, wide }) {
  const ref = React.useRef(null);
  const idx = range.indexOf(value);
  const scrollingRef = React.useRef(false);
  const settleRef = React.useRef(0);

  // External value change → scroll to it (unless mid-user-scroll)
  React.useEffect(() => {
    if (!ref.current || scrollingRef.current) return;
    ref.current.scrollTop = idx * WHEEL_ITEM;
  }, [idx]);

  const onScroll = () => {
    scrollingRef.current = true;
    const el = ref.current;
    const i = Math.round(el.scrollTop / WHEEL_ITEM);
    const v = range[Math.max(0, Math.min(range.length - 1, i))];
    if (v !== value) onChange(v);
    clearTimeout(settleRef.current);
    settleRef.current = setTimeout(() => {
      scrollingRef.current = false;
      // snap exactly
      if (ref.current) ref.current.scrollTop = i * WHEEL_ITEM;
    }, 120);
  };

  return (
    <div className="col" style={{ alignItems: 'center', gap: 6 }}>
      <span className="label" style={{ fontSize: 9 }}>{label}</span>
      <div style={{
        position: 'relative', width: wide ? 64 : 60, height: WHEEL_HEIGHT,
        borderRadius: 10,
        background: 'var(--bg-1)',
        border: '1px solid var(--line-1)',
        overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 24%, #000 76%, transparent 100%)',
                maskImage: 'linear-gradient(180deg, transparent 0%, #000 24%, #000 76%, transparent 100%)',
      }}>
        {/* center band */}
        <div style={{
          position: 'absolute', left: 4, right: 4,
          top: WHEEL_ITEM * 2, height: WHEEL_ITEM,
          borderTop: '1px solid var(--orange)',
          borderBottom: '1px solid var(--orange)',
          background: 'var(--orange-soft)',
          borderRadius: 6,
          pointerEvents: 'none', zIndex: 1,
        }} />
        <div
          ref={ref}
          onScroll={onScroll}
          style={{
            height: '100%', overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            paddingTop: WHEEL_ITEM * 2, paddingBottom: WHEEL_ITEM * 2,
            boxSizing: 'border-box',
          }}
        >
          {range.map((n, i) => {
            const dist = Math.abs(i - idx);
            return (
              <div key={n}
                style={{
                  height: WHEEL_ITEM,
                  scrollSnapAlign: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--f-mono)',
                  fontSize: dist === 0 ? 22 : dist === 1 ? 17 : 14,
                  fontWeight: dist === 0 ? 500 : 300,
                  color: dist === 0 ? 'var(--t-1)' : dist === 1 ? 'var(--t-2)' : 'var(--t-3)',
                  opacity: dist === 0 ? 1 : dist === 1 ? 0.85 : 0.5,
                  transition: 'font-size 0.12s, color 0.12s',
                }}
              >{format(n)}</div>
            );
          })}
        </div>
        {/* tap-to-step zones */}
        <button
          onClick={() => onChange(range[Math.max(0, idx - 1)])}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: WHEEL_ITEM * 2, background: 'transparent', zIndex: 2,
          }} aria-label="up" />
        <button
          onClick={() => onChange(range[Math.min(range.length - 1, idx + 1)])}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: WHEEL_ITEM * 2, background: 'transparent', zIndex: 2,
          }} aria-label="down" />
      </div>
    </div>
  );
}

Object.assign(window, {
  SheetShell, LocationPicker, DatePicker, TimePicker, LOC_BOOK,
  parseDateString, fmtDate, parseTime, fmt24,
});
