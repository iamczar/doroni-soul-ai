// editor.jsx — Flight plan editor with map, waypoints, and tabbed views

const SEED_WAYPOINTS = [
  { id: 'wp-t', kind: 'takeoff', lat: 25.756, lng: -80.200, alt: 0,   spd: 0,  name: 'BRK-VP01' },
  { id: 'wp-1', kind: 'wp',      lat: 25.810, lng: -80.188, alt: 350, spd: 65, name: 'WP-1' },
  { id: 'wp-2', kind: 'wp',      lat: 25.880, lng: -80.170, alt: 480, spd: 90, name: 'WP-2' },
  { id: 'wp-l', kind: 'landing', lat: 25.957, lng: -80.143, alt: 0,   spd: 0,  name: 'AVE-VP02' },
];

function legMiles(a, b) {
  const R = 3958.8;
  const φ1 = a.lat * Math.PI / 180, φ2 = b.lat * Math.PI / 180;
  const Δφ = (b.lat - a.lat) * Math.PI / 180, Δλ = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(Δφ/2)**2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function EditorScreen({ ctx, nav, tweaks }) {
  const [tab, setTab] = React.useState('map');
  const [waypoints, setWaypoints] = React.useState(ctx.waypoints.length ? ctx.waypoints : SEED_WAYPOINTS);
  const [selected, setSelected] = React.useState(null);
  const [adding, setAdding] = React.useState(false);

  React.useEffect(()=>{ ctx.setWaypoints(waypoints); }, [waypoints]);

  const total = waypoints.reduce((acc, w, i) =>
    i === 0 ? 0 : acc + legMiles(waypoints[i-1], w), 0);
  const etE = Math.round(total / 80 * 60);
  const battUse = Math.round(total * 0.9);

  const onMapTap = ({ lat, lng }) => {
    const next = [...waypoints];
    const landingIdx = next.findIndex(w => w.kind === 'landing');
    const newWp = {
      id: 'wp-' + Date.now(),
      kind: 'wp',
      lat, lng,
      alt: 400, spd: 75,
      name: `WP-${next.filter(w=>w.kind==='wp').length + 1}`,
    };
    next.splice(landingIdx >= 0 ? landingIdx : next.length, 0, newWp);
    setWaypoints(next);
    setSelected(newWp.id);
    setAdding(false);
  };

  const updateSel = (patch) => {
    setWaypoints(ws => ws.map(w => w.id === selected ? {...w, ...patch} : w));
  };
  const deleteSel = () => {
    setWaypoints(ws => ws.filter(w => w.id !== selected));
    setSelected(null);
  };

  const sel = waypoints.find(w => w.id === selected);
  const plan = ctx.plan || { name: 'New flight', from: 'BRK-VP01', to: 'AVE-VP02' };

  return (
    <div className="col" style={{ height: '100%', gap: 0 }}>
      {/* header */}
      <header style={{
        padding: 'calc(var(--safe-top, 0px) + 12px) var(--pad-x) 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 10, flexShrink: 0,
        borderBottom: '1px solid var(--line-1)',
      }}>
        <BackBtn onClick={nav.back}/>
        <div className="col" style={{ flex: 1, alignItems: 'center', gap: 1 }}>
          <span className="label" style={{ fontSize: 9 }}>EDITING</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{plan.name}</span>
        </div>
        <button
          onClick={() => {
            const saved = {
              ...(plan || {}),
              id: plan?.id && plan.id !== 'new' ? plan.id : 'p-' + Date.now(),
              name: plan?.name || 'New flight',
              from: plan?.from || waypoints[0]?.name || 'DEP',
              to:   plan?.to   || waypoints[waypoints.length-1]?.name || 'ARR',
              fromName: plan?.fromName,
              toName: plan?.toName,
              dist: +total.toFixed(1),
              etE:  `00:${String(etE).padStart(2,'0')}`,
              waypoints,
              status: 'ready',
            };
            ctx.savePlan(saved);
            ctx.setPlan(saved);
            setTimeout(() => nav.tab('plans'), 600);
          }}
          style={{
            fontSize: 12, padding: '6px 12px', borderRadius: 999,
            background: 'var(--orange)', color: '#04080d',
            letterSpacing: '0.06em', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}><IconCheck size={12}/>SAVE</button>
      </header>

      {/* tabs */}
      <div className="row" style={{
        gap: 0, padding: '8px var(--pad-x)', flexShrink: 0,
      }}>
        {[
          ['map','Map'],
          ['profile','Profile'],
          ['airspace','Airspace'],
          ['wb','W & B'],
        ].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{
            flex: 1, padding: '6px 0', fontSize: 12, fontWeight: 500,
            color: tab === k ? 'var(--t-1)' : 'var(--t-3)',
            borderBottom: tab === k ? '2px solid var(--orange)' : '2px solid transparent',
            letterSpacing: '0.02em',
          }}>{l}</button>
        ))}
      </div>

      {/* main */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--bg-1)' }}>
        {tab === 'map' && (
          <MapView
            waypoints={waypoints}
            selected={selected}
            setSelected={setSelected}
            onMapTap={onMapTap}
            adding={adding}
            setAdding={setAdding}
            rangeMiles={Math.round(Math.min(100, Math.max(0, (ctx.battery - 20) / 0.8)))}
            onDragWp={(id, lat, lng) => setWaypoints(ws => ws.map(w => w.id === id ? {...w, lat, lng} : w))}
          />
        )}
        {tab === 'profile' && <ProfileTab waypoints={waypoints}/>}
        {tab === 'airspace' && <AirspaceTab/>}
        {tab === 'wb' && <WBTab/>}

        {/* edit-waypoint sheet */}
        {sel && tab === 'map' && (
          <WaypointSheet wp={sel} onChange={updateSel} onClose={()=>setSelected(null)} onDelete={sel.kind==='wp' ? deleteSel : null}/>
        )}
      </div>

      {/* footer summary */}
      <div style={{
        padding: '10px var(--pad-x) 12px',
        borderTop: '1px solid var(--line-1)',
        background: 'var(--bg-1)',
        flexShrink: 0,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'center',
      }}>
        <FootStat label="Dist"   v={total.toFixed(1)} u="MI"/>
        <FootStat label="ETE"    v={`00:${String(etE).padStart(2,'0')}`}/>
        <FootStat label="Batt"   v={`-${battUse}`} u="%" tone={battUse > 60 ? 'amber' : ''}/>
        <button onClick={()=>nav.go('checklist')} style={{
          padding: '10px 14px', borderRadius: 10,
          background: 'var(--orange)', color: '#04080d',
          fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          Pre-flight <IconArrowR size={16}/>
        </button>
      </div>
    </div>
  );
}

function FootStat({ label, v, u, tone }) {
  const c = tone === 'amber' ? 'var(--amber)' : 'var(--t-1)';
  return (
    <div className="col" style={{ gap: 2 }}>
      <span className="label" style={{ fontSize: 9 }}>{label}</span>
      <span style={{ fontSize: 16, fontWeight: 400, color: c }} className="mono">
        {v}{u && <span style={{fontSize: 10, color: 'var(--t-3)'}}> {u}</span>}
      </span>
    </div>
  );
}

// MapView is provided by map.jsx (MapLibre GL)

function _MapView_REMOVED({ mapRef, waypoints, selected, setSelected, onMapTap, adding, setAdding, mapStyle, onDragWp }) {
  // viewBox state — center + zoom (1 = full 1000-unit field visible)
  const [vb, setVb] = React.useState({ cx: 500, cy: 500, zoom: 1 });
  const containerRef = React.useRef(null);
  const interactionRef = React.useRef({ mode: null }); // 'pan' | 'wp' | 'pinch'

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const setZoom = (next, ax = 0.5, ay = 0.5) => {
    setVb((s) => {
      const z = clamp(next, 0.6, 6);
      // anchor: keep the point under (ax, ay) of the viewport stable in world coords
      const size = 1000 / s.zoom;
      const wx = s.cx + (ax - 0.5) * size;
      const wy = s.cy + (ay - 0.5) * size;
      const newSize = 1000 / z;
      return {
        cx: clamp(wx - (ax - 0.5) * newSize, newSize/2, 1000 - newSize/2),
        cy: clamp(wy - (ay - 0.5) * newSize, newSize/2, 1000 - newSize/2),
        zoom: z,
      };
    });
  };
  const panBy = (dxPx, dyPx) => {
    if (!containerRef.current) return;
    setVb((s) => {
      const rect = containerRef.current.getBoundingClientRect();
      const size = 1000 / s.zoom;
      const dx = (dxPx / rect.width) * size;
      const dy = (dyPx / rect.height) * size;
      return {
        ...s,
        cx: clamp(s.cx - dx, size/2, 1000 - size/2),
        cy: clamp(s.cy - dy, size/2, 1000 - size/2),
      };
    });
  };

  // world-coords from a client point, using current vb
  const toWorld = (clientX, clientY) => {
    const svg = mapRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };

  // wheel zoom
  const onWheel = (e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const ax = (e.clientX - rect.left) / rect.width;
    const ay = (e.clientY - rect.top)  / rect.height;
    const factor = Math.exp(-e.deltaY * 0.0015);
    setZoom(vb.zoom * factor, ax, ay);
  };

  // pointer interactions (mouse + touch unified)
  const pointersRef = React.useRef(new Map());
  const moveAcc = React.useRef({ x: 0, y: 0 });

  const onPointerDown = (e, opts = {}) => {
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY, target: opts });
    if (pointersRef.current.size === 2) {
      interactionRef.current = { mode: 'pinch', startDist: pinchDist(), startZoom: vb.zoom };
      return;
    }
    if (opts.wpId) {
      interactionRef.current = { mode: 'wp', wpId: opts.wpId, moved: 0 };
    } else {
      interactionRef.current = { mode: 'pan' };
    }
  };

  const pinchDist = () => {
    const pts = [...pointersRef.current.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  };

  const onPointerMove = (e) => {
    const prev = pointersRef.current.get(e.pointerId);
    if (!prev) return;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    pointersRef.current.set(e.pointerId, { ...prev, x: e.clientX, y: e.clientY });

    const mode = interactionRef.current.mode;
    if (mode === 'pinch') {
      const d = pinchDist();
      if (!interactionRef.current.startDist) return;
      const ratio = d / interactionRef.current.startDist;
      const rect = containerRef.current.getBoundingClientRect();
      const pts = [...pointersRef.current.values()];
      const cx = (pts[0].x + pts[1].x) / 2 - rect.left;
      const cy = (pts[0].y + pts[1].y) / 2 - rect.top;
      setZoom(interactionRef.current.startZoom * ratio, cx/rect.width, cy/rect.height);
    } else if (mode === 'wp') {
      const loc = toWorld(e.clientX, e.clientY);
      const x = clamp(loc.x, 20, 980);
      const y = clamp(loc.y, 20, 980);
      onDragWp(interactionRef.current.wpId, x, y);
      interactionRef.current.moved += Math.abs(dx) + Math.abs(dy);
    } else if (mode === 'pan') {
      panBy(dx, dy);
      moveAcc.current.x += Math.abs(dx);
      moveAcc.current.y += Math.abs(dy);
    }
  };

  const onPointerUp = (e) => {
    const prev = pointersRef.current.get(e.pointerId);
    pointersRef.current.delete(e.pointerId);
    const moved = (moveAcc.current.x + moveAcc.current.y) > 6;
    const wpMoved = (interactionRef.current.moved || 0) > 4;
    moveAcc.current = { x: 0, y: 0 };

    if (interactionRef.current.mode === 'pan' && !moved && prev && adding) {
      // it was a tap in adding mode → add waypoint at this location
      onMapTap({ clientX: prev.x, clientY: prev.y });
    } else if (interactionRef.current.mode === 'wp' && !wpMoved && prev) {
      // it was a tap on a waypoint → select
      setSelected(interactionRef.current.wpId);
    } else if (interactionRef.current.mode === 'pan' && !moved && prev && !adding) {
      // tap on empty map → clear selection
      setSelected(null);
    }
    interactionRef.current = { mode: null };
  };

  // compute current viewBox
  const size = 1000 / vb.zoom;
  const vbStr = `${vb.cx - size/2} ${vb.cy - size/2} ${size} ${size}`;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute', inset: 0,
        cursor: adding ? 'crosshair' : 'grab',
        touchAction: 'none',
      }}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <svg
        ref={mapRef}
        viewBox={vbStr}
        preserveAspectRatio="xMidYMid slice"
        width="100%" height="100%"
        style={{ display: 'block', userSelect: 'none' }}
      >
        <MapBackground style={mapStyle}/>
        <MapAirspace/>
        <FlightPath waypoints={waypoints}/>
        {waypoints.map((w, i) => {
          const idx = waypoints.slice(0, i+1).filter(x => x.kind === 'wp').length;
          return (
            <g key={w.id}
              onPointerDown={(e) => {
                e.stopPropagation();
                onPointerDown(e, { wpId: w.id });
              }}
              style={{ cursor: 'pointer' }}
            >
              <WaypointMarker
                x={w.x} y={w.y}
                idx={idx}
                kind={w.kind}
                selected={w.id === selected}
              />
            </g>
          );
        })}
      </svg>

      {/* HUD controls top-left */}
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <MapHUDBtn icon={<IconLayers size={16}/>} label="LAYERS"/>
        <MapHUDBtn icon={<IconSearch size={16}/>} label="FIND"/>
      </div>

      {/* zoom controls + compass */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 999,
          background: 'rgba(4,8,13,0.72)',
          border: '1px solid var(--line-strong)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 4, height: 18, background: 'linear-gradient(180deg, var(--orange) 50%, var(--t-2) 50%)',
            borderRadius: 2,
          }}/>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column',
          background: 'rgba(4,8,13,0.72)',
          border: '1px solid var(--line-strong)',
          borderRadius: 8, overflow: 'hidden',
        }}>
          <button onClick={() => setZoom(vb.zoom * 1.4)} style={zoomBtn}>
            <IconPlus size={16}/>
          </button>
          <div style={{ height: 1, background: 'var(--line-1)' }}/>
          <button onClick={() => setZoom(vb.zoom / 1.4)} style={zoomBtn}>
            <span style={{ fontSize: 18, lineHeight: 1, fontWeight: 300 }}>−</span>
          </button>
        </div>
        <button onClick={() => setVb({ cx: 500, cy: 500, zoom: 1 })} style={{
          padding: '4px 8px', borderRadius: 6,
          background: 'rgba(4,8,13,0.72)',
          border: '1px solid var(--line-1)',
          color: 'var(--t-2)',
          fontSize: 9, letterSpacing: '0.1em',
        }}>FIT</button>
        <div className="mono" style={{
          fontSize: 9, color: 'var(--t-2)', letterSpacing: '0.08em',
          background: 'rgba(4,8,13,0.72)', padding: '3px 6px', borderRadius: 4,
          border: '1px solid var(--line-1)',
        }}>{(1 / vb.zoom).toFixed(1)} MI</div>
      </div>

      {/* add waypoint floating action */}
      <button onClick={() => setAdding(a => !a)} style={{
        position: 'absolute', right: 14, bottom: 14,
        width: 48, height: 48, borderRadius: 999,
        background: adding ? 'var(--orange)' : 'var(--bg-3)',
        color: adding ? '#04080d' : 'var(--orange)',
        border: '1px solid ' + (adding ? 'var(--orange)' : 'var(--line-strong)'),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        zIndex: 3,
      }}>
        {adding ? <IconX size={20}/> : <IconPlus size={22}/>}
      </button>
      {adding && (
        <div style={{
          position: 'absolute', left: 14, right: 76, bottom: 14,
          background: 'rgba(4,8,13,0.85)', backdropFilter: 'blur(8px)',
          padding: '10px 14px', borderRadius: 10,
          border: '1px solid var(--orange)',
          fontSize: 12, color: 'var(--orange)',
          display: 'flex', alignItems: 'center', gap: 8,
          zIndex: 3,
        }}>
          <IconWaypoint size={16}/>
          <span>Tap map to add waypoint</span>
        </div>
      )}
    </div>
  );
}

const zoomBtn = {
  width: 36, height: 32,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--t-1)', background: 'transparent',
};

function MapHUDBtn({ icon, label }) {
  return (
    <button style={{
      padding: '6px 8px', borderRadius: 8,
      background: 'rgba(4,8,13,0.72)',
      border: '1px solid var(--line-1)',
      color: 'var(--t-2)', display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 10, letterSpacing: '0.06em',
    }}>{icon}{label}</button>
  );
}

function WaypointSheet({ wp, onChange, onClose, onDelete }) {
  const c = wp.kind === 'takeoff' ? 'var(--green)' : wp.kind === 'landing' ? 'var(--cyan)' : 'var(--orange)';
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: 'var(--bg-2)',
      borderTop: '1px solid var(--line-strong)',
      padding: '12px var(--pad-x)',
      animation: 'slideUp 0.18s ease-out',
    }}>
      <style>{`@keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }`}</style>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="row" style={{ gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: c, color: '#04080d',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 600,
          }}>
            {wp.kind === 'takeoff' ? 'T' : wp.kind === 'landing' ? 'L' : wp.name.replace('WP-','')}
          </div>
          <div className="col" style={{ gap: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{wp.name}</span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--t-3)' }}>
              {wp.kind === 'takeoff' ? 'DEPARTURE' : wp.kind === 'landing' ? 'ARRIVAL' : 'WAYPOINT'}
              {wp.lat != null ? ` · ${wp.lat.toFixed(4)}N ${Math.abs(wp.lng).toFixed(4)}W` : ''}
            </span>
          </div>
        </div>
        <button onClick={onClose} style={{
          width: 28, height: 28, borderRadius: 999,
          background: 'var(--bg-glass)', color: 'var(--t-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><IconX size={16}/></button>
      </div>

      {wp.kind === 'wp' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingTop: 12 }}>
          <SliderField
            label="Altitude" unit="FT"
            value={wp.alt} min={100} max={1500} step={20}
            onChange={(v)=>onChange({ alt: v })}
          />
          <SliderField
            label="Cruise speed" unit="MPH"
            value={wp.spd} min={20} max={120} step={5}
            onChange={(v)=>onChange({ spd: v })}
          />
        </div>
      )}
      {wp.kind !== 'wp' && (
        <div className="row" style={{
          gap: 10, paddingTop: 12,
          padding: '12px var(--pad-x)', margin: '12px calc(-1*var(--pad-x)) 0',
          background: 'var(--bg-1)', borderTop: '1px solid var(--line-1)',
        }}>
          <IconInfo size={14} style={{ color: 'var(--t-cyan)' }}/>
          <span style={{ fontSize: 11, color: 'var(--t-2)' }}>
            {wp.kind === 'takeoff' ? 'Takeoff hover: 50 ft AGL · 90s spool-up' : 'Approach: 200 ft → ground · 4 mph descent'}
          </span>
        </div>
      )}

      {onDelete && (
        <button onClick={onDelete} className="row" style={{
          gap: 8, padding: '8px 12px',
          color: 'var(--red)', fontSize: 12, marginTop: 10,
        }}><IconTrash size={14}/>Remove waypoint</button>
      )}
    </div>
  );
}

function SliderField({ label, unit, value, min, max, step, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="col" style={{ gap: 6, background: 'var(--bg-1)', borderRadius: 10, padding: 10 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="label" style={{ fontSize: 9 }}>{label}</span>
        <span className="mono" style={{ fontSize: 12 }}>{value} <span style={{ color: 'var(--t-3)', fontSize: 10 }}>{unit}</span></span>
      </div>
      <div style={{ position: 'relative', height: 16 }}>
        <div style={{
          position: 'absolute', top: 7, left: 0, right: 0, height: 2,
          background: 'var(--line-1)', borderRadius: 2,
        }}/>
        <div style={{
          position: 'absolute', top: 7, left: 0, width: `${pct}%`, height: 2,
          background: 'var(--orange)', borderRadius: 2,
        }}/>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e)=>onChange(Number(e.target.value))}
          style={{
            position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'grab',
          }}/>
        <div style={{
          position: 'absolute', top: 2, left: `calc(${pct}% - 6px)`,
          width: 12, height: 12, borderRadius: 999,
          background: 'var(--orange)', boxShadow: '0 0 0 4px rgba(255,107,26,0.18)',
          pointerEvents: 'none',
        }}/>
      </div>
    </div>
  );
}

// ─── Profile tab — altitude chart ───
function ProfileTab({ waypoints }) {
  // build altitude profile across distance
  let cumDist = 0;
  const points = waypoints.map((w, i) => {
    if (i > 0) cumDist += legMiles(waypoints[i-1], w);
    return { d: cumDist, a: w.alt, name: w.name, kind: w.kind };
  });
  const maxD = points[points.length - 1]?.d || 1;
  const maxA = 1500;
  const path = points.map((p, i) =>
    `${i===0?'M':'L'} ${(p.d/maxD)*860 + 60} ${320 - (p.a/maxA)*260}`
  ).join(' ');
  const filled = path + ` L ${(points[points.length-1].d/maxD)*860 + 60} 320 L 60 320 Z`;
  return (
    <div className="col" style={{ padding: 'var(--pad-y) var(--pad-x)', height: '100%', overflow: 'auto', gap: 12 }}>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="label">Altitude profile</div>
          <span className="mono" style={{ fontSize: 11, color: 'var(--t-3)' }}>AGL · FT</span>
        </div>
        <svg viewBox="0 0 960 360" width="100%" height="220" style={{ marginTop: 8 }}>
          {/* grid */}
          {[0, 500, 1000, 1500].map(a => {
            const y = 320 - (a/maxA)*260;
            return <g key={a}>
              <line x1="60" y1={y} x2="920" y2={y} stroke="rgba(180,210,235,0.08)"/>
              <text x="46" y={y+4} textAnchor="end" fontFamily="JetBrains Mono" fontSize="11" fill="rgba(180,210,235,0.4)">{a}</text>
            </g>;
          })}
          {/* fill */}
          <path d={filled} fill="rgba(255,107,26,0.12)"/>
          <path d={path} stroke="var(--orange)" strokeWidth="2.4" fill="none" strokeLinejoin="round"/>
          {/* points */}
          {points.map((p, i) => {
            const x = (p.d/maxD)*860 + 60, y = 320 - (p.a/maxA)*260;
            return <g key={i}>
              <circle cx={x} cy={y} r="5" fill="#04080d" stroke="var(--orange)" strokeWidth="2"/>
              <text x={x} y={y - 12} fontFamily="JetBrains Mono" fontSize="10"
                fill="rgba(180,210,235,0.7)" textAnchor="middle">{p.name}</text>
              <text x={x} y={340} fontFamily="JetBrains Mono" fontSize="9"
                fill="rgba(180,210,235,0.4)" textAnchor="middle">{p.d.toFixed(1)}MI</text>
            </g>;
          })}
        </svg>
      </div>
      <div className="card">
        <div className="label">Climb / descent</div>
        <div className="row" style={{ paddingTop: 10, gap: 12 }}>
          <FootStat label="Peak"  v="480" u="FT"/>
          <FootStat label="Climb" v="+520" u="FPM"/>
          <FootStat label="Descent" v="-310" u="FPM"/>
        </div>
      </div>
    </div>
  );
}

// ─── Airspace tab ───
function AirspaceTab() {
  return (
    <div className="col" style={{ padding: 'var(--pad-y) var(--pad-x)', height: '100%', overflow: 'auto', gap: 10 }}>
      <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <IconAlert size={20} style={{ color: 'var(--orange)' }}/>
        <div className="col" style={{ gap: 4, flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>P-56 restricted area on route</div>
          <div style={{ fontSize: 12, color: 'var(--t-2)', lineHeight: 1.5 }}>
            Route passes within 0.4 mi of P-56 (W-1.2 to L-0.6). Re-route to maintain 2 mi buffer or request clearance.
          </div>
          <div className="row" style={{ paddingTop: 6, gap: 6 }}>
            <button className="chip chip-orange">Auto-reroute</button>
            <button className="chip chip-line">Override</button>
          </div>
        </div>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <AirspaceRow name="P-56" kind="Restricted" detail="0 - 18,000 FT · 24h" tone="red"/>
        <AirspaceRow name="R-2901" kind="MOA" detail="SFC - 5,000 FT · active" tone="amber"/>
        <AirspaceRow name="KMIA Class B" kind="Class B" detail="contact 119.40" tone="cyan"/>
        <AirspaceRow name="TFR · 5/2026" kind="Stadium" detail="3 NM · 14:00-18:00 EDT" tone="amber" last/>
      </div>
    </div>
  );
}
function AirspaceRow({ name, kind, detail, tone, last }) {
  const c = { red: 'var(--red)', amber: 'var(--amber)', cyan: 'var(--cyan)' }[tone];
  return (
    <div className="row" style={{
      padding: '12px var(--pad-x)',
      borderBottom: last ? 'none' : '1px solid var(--line-1)', gap: 12,
    }}>
      <div style={{ width: 6, alignSelf: 'stretch', borderRadius: 3, background: c }}/>
      <div className="col" style={{ flex: 1, gap: 3 }}>
        <div className="row" style={{ gap: 8 }}>
          <span className="mono" style={{ fontSize: 13, color: c }}>{name}</span>
          <span style={{ fontSize: 11, color: 'var(--t-2)' }}>{kind}</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--t-3)' }}>{detail}</span>
      </div>
    </div>
  );
}

// ─── W&B tab ───
function WBTab() {
  // CG envelope mock
  return (
    <div className="col" style={{ padding: 'var(--pad-y) var(--pad-x)', height: '100%', overflow: 'auto', gap: 10 }}>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="label">Weight & balance</div>
          <span className="chip chip-green">Within envelope</span>
        </div>
        <svg viewBox="0 0 600 320" width="100%" height="220" style={{ marginTop: 10 }}>
          {/* envelope */}
          <path d="M 100 240 L 200 240 L 280 200 L 460 200 L 500 240 L 500 100 L 460 70 L 200 70 L 100 100 Z"
            fill="rgba(78,201,126,0.10)" stroke="var(--green)" strokeWidth="1.5" strokeDasharray="4 3"/>
          {/* grid */}
          {[100, 150, 200, 250].map(x => (
            <line key={x} x1={x*2} y1="40" x2={x*2} y2="280" stroke="rgba(180,210,235,0.06)"/>
          ))}
          {/* axes */}
          <line x1="80" y1="280" x2="540" y2="280" stroke="var(--t-3)"/>
          <line x1="80" y1="40" x2="80" y2="280" stroke="var(--t-3)"/>
          <text x="540" y="298" textAnchor="end" fontFamily="JetBrains Mono" fontSize="10" fill="var(--t-3)">ARM (IN)</text>
          <text x="56" y="50" textAnchor="end" fontFamily="JetBrains Mono" fontSize="10" fill="var(--t-3)">LB</text>
          {/* current CG */}
          <circle cx="340" cy="160" r="6" fill="var(--orange)"/>
          <circle cx="340" cy="160" r="14" fill="none" stroke="var(--orange)" strokeOpacity="0.4"/>
          <text x="354" y="156" fontFamily="JetBrains Mono" fontSize="10" fill="var(--orange)">1,405 LB · 84.2"</text>
        </svg>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <WBRow name="Empty weight"   v="1,180 LB" arm='80.0"'/>
        <WBRow name="Pilot"          v="180 LB"   arm='90.0"'/>
        <WBRow name="Battery"        v="—"        arm='75.0"' note="fixed"/>
        <WBRow name="Cargo"          v="45 LB"    arm='110.0"'/>
        <WBRow name="Total"          v="1,405 LB" arm='84.2"' bold last/>
      </div>
    </div>
  );
}
function WBRow({ name, v, arm, note, bold, last }) {
  return (
    <div className="row" style={{
      padding: '10px var(--pad-x)',
      borderBottom: last ? 'none' : '1px solid var(--line-1)',
      fontSize: 13, fontWeight: bold ? 500 : 400,
    }}>
      <span style={{ flex: 1 }}>{name}{note && <span style={{ color: 'var(--t-3)', fontSize: 11, marginLeft: 6 }}>{note}</span>}</span>
      <span className="mono" style={{ minWidth: 80, textAlign: 'right' }}>{v}</span>
      <span className="mono" style={{ minWidth: 60, textAlign: 'right', color: 'var(--t-3)' }}>{arm}</span>
    </div>
  );
}

Object.assign(window, { EditorScreen, SEED_WAYPOINTS, legMiles });
