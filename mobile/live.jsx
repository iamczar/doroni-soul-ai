// live.jsx — Live flight tracking, HMI mirror

function useAnimatedTelemetry() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 600);
    return () => clearInterval(id);
  }, []);

  // procedurally walk values, anchored around realistic cruise numbers
  const t = tick;
  const speed = 95 + Math.round(Math.sin(t * 0.7) * 8);
  const alt   = 460 + Math.round(Math.sin(t * 0.3 + 1) * 30);
  const vert  = Math.round(Math.sin(t * 0.5) * 12);
  const remaining = Math.max(0.8, 3.6 - tick * 0.02);
  const heading = 235 + Math.sin(t * 0.2) * 6;
  const etE = `00:0${Math.max(1, Math.round(remaining / 0.06))}m`.replace('010m','10m');
  return { speed, alt, vert, remaining: +remaining.toFixed(1), heading, etE };
}

function LiveFlightScreen({ ctx, nav, tweaks }) {
  const tel = useAnimatedTelemetry();
  const battery = ctx.battery;
  const range = Math.round(battery * 1.0);
  const [view, setView] = React.useState('hero'); // hero | map | systems
  const [armed, setArmed] = React.useState(ctx.armed);

  return (
    <div style={{ height: '100%', position: 'relative', background: '#04080d', overflow: 'hidden' }}>
      {/* compass strip (top) */}
      <CompassStrip heading={tel.heading}/>

      {/* main hero */}
      {view === 'hero' && <HeroView heading={tel.heading} battery={battery} range={range} mapStyle={tweaks.mapStyle}/>}
      {view === 'map'  && <MapTrackView mapStyle={tweaks.mapStyle}/>}
      {view === 'systems' && <SystemsView battery={battery}/>}

      {/* right rail telemetry */}
      <RightRail battery={battery} range={range}/>

      {/* bottom HUD */}
      <BottomHUD tel={tel}/>

      {/* page dots */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 96, transform: 'translateX(-50%)',
        display: 'flex', gap: 6,
      }}>
        {['hero','map','systems'].map(v => (
          <button key={v} onClick={()=>setView(v)} style={{
            width: 5, height: 5, borderRadius: 999, padding: 0,
            background: view === v ? 'var(--t-1)' : 'var(--t-3)',
            opacity: view === v ? 1 : 0.6,
          }}/>
        ))}
      </div>

      {/* top-left back */}
      <button onClick={nav.back} style={{
        position: 'absolute', top: 'calc(var(--safe-top, 0px) + 50px)', left: 14,
        width: 32, height: 32, borderRadius: 999,
        background: 'rgba(4,8,13,0.6)',
        border: '1px solid var(--line-1)',
        color: 'var(--t-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
      }}>
        <IconChevL size={16}/>
      </button>

      {/* armed state pill (top-right under telemetry would clash) */}
      <div style={{
        position: 'absolute', top: 'calc(var(--safe-top, 0px) + 50px)', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 6, alignItems: 'center', zIndex: 10,
      }}>
        <button onClick={()=>{ setArmed(!armed); ctx.setArmed(!armed); }} style={{
          padding: '4px 10px', borderRadius: 999,
          background: armed ? 'var(--orange-soft)' : 'var(--bg-glass)',
          border: '1px solid ' + (armed ? 'var(--orange)' : 'var(--line-strong)'),
          color: armed ? 'var(--orange)' : 'var(--t-2)',
          fontSize: 10, letterSpacing: '0.14em', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span className={armed ? 'dot dot-orange pulse-orange' : 'dot dot-amber'}/>
          {armed ? 'ARMED · READY' : 'TAP TO ARM'}
        </button>
      </div>

      {/* abort */}
      <button style={{
        position: 'absolute', right: 14, bottom: 110,
        padding: '8px 14px', borderRadius: 999,
        background: 'rgba(255,77,87,0.12)',
        border: '1px solid var(--red)',
        color: 'var(--red)',
        fontSize: 11, fontWeight: 600, letterSpacing: '0.14em',
      }}>RTB</button>
    </div>
  );
}

// ─── Compass strip ───
function CompassStrip({ heading }) {
  const cardinals = [
    { d: 0, l: 'N' }, { d: 45, l: 'NE' }, { d: 90, l: 'E' }, { d: 135, l: 'SE' },
    { d: 180, l: 'S' }, { d: 225, l: 'SW' }, { d: 270, l: 'W' }, { d: 315, l: 'NW' },
  ];
  // Compass scrolls under fixed center marker. Width per degree = 3px.
  const dpx = 3;
  // visible range = 90 deg either side
  return (
    <div style={{
      position: 'absolute', top: 'var(--safe-top, 0px)', left: 0, right: 0, height: 50,
      background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
      pointerEvents: 'none', zIndex: 5,
    }}>
      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 30, left: '50%',
          transform: `translateX(${-heading * dpx}px)`,
        }}>
          {Array.from({length: 73}).map((_, i) => {
            const deg = i * 5;
            const major = deg % 45 === 0;
            const card = cardinals.find(c => c.d === deg);
            return (
              <div key={i} style={{
                position: 'absolute', left: deg * dpx, transform: 'translateX(-50%)',
                textAlign: 'center', fontFamily: 'Inter', fontWeight: major ? 400 : 300,
                color: major ? 'var(--t-1)' : 'var(--t-3)',
              }}>
                <div style={{
                  width: 1, height: major ? 6 : 3,
                  background: major ? 'var(--t-1)' : 'var(--t-3)', margin: '0 auto',
                }}/>
                {card && (
                  <div style={{ fontSize: card.l.length === 1 ? 14 : 9, fontWeight: 500, marginTop: 4, letterSpacing: '0.04em' }}>
                    {card.l}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* center marker */}
        <div style={{
          position: 'absolute', top: 26, left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0, borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent', borderTop: '6px solid var(--orange)',
        }}/>
        {/* heading number */}
        <div style={{
          position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--orange)',
          fontWeight: 500, letterSpacing: '0.1em',
        }}>{Math.round(heading)}°</div>
      </div>
    </div>
  );
}

// ─── Right rail telemetry ───
function RightRail({ battery, range }) {
  return (
    <div style={{
      position: 'absolute', right: 12, top: 'calc(var(--safe-top, 0px) + 80px)', bottom: 130,
      display: 'flex', flexDirection: 'column', gap: 18,
      pointerEvents: 'none', alignItems: 'flex-end', zIndex: 3,
    }}>
      <RailMetric label="BATT" value={battery} unit="%" big/>
      <RailMetric label="RANGE" value={range} unit="MI" big/>
      <RailMetric label="AIRFLOW" value={<IconWind size={20} style={{ color: 'var(--t-1)' }}/>} small showArrows/>
      <RailMetric label="TEMP" value="70" unit="°F" small showArrows tempArrow/>
    </div>
  );
}

function RailMetric({ label, value, unit, big, small, showArrows, tempArrow }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2,
    }}>
      <div className="row" style={{ gap: 6, alignItems: 'center' }}>
        <span className="label" style={{ fontSize: small ? 9 : 10 }}>{label}</span>
        {showArrows && <IconChevU size={12} style={{ color: tempArrow ? 'var(--orange)' : 'var(--t-3)' }}/>}
      </div>
      <div className="row" style={{ alignItems: 'baseline', gap: 4 }}>
        <span className="num" style={{ fontSize: big ? 44 : 26, color: 'var(--t-1)' }}>{value}</span>
        {unit && <span className="mono" style={{ fontSize: 11, color: 'var(--t-cyan)', letterSpacing: '0.06em' }}>{unit}</span>}
      </div>
      {showArrows && <IconChevD size={12} style={{ color: tempArrow ? 'var(--t-cyan)' : 'var(--t-3)', marginTop: -2 }}/>}
    </div>
  );
}

// ─── Hero view: front-on craft on dark backdrop ───
function HeroView({ heading, battery, range, mapStyle }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* radial vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(94,192,232,0.06) 0%, transparent 60%)',
      }}/>
      {/* horizon line */}
      <div style={{
        position: 'absolute', top: '54%', left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(94,192,232,0.18) 30%, rgba(94,192,232,0.18) 70%, transparent 100%)',
      }}/>
      <div style={{
        position: 'absolute', top: '54%', left: '50%', transform: 'translate(-50%, -50%)',
        marginTop: 0, width: '78%', maxWidth: 320,
      }}>
        <img src="assets/h1x-front.png" alt="Doroni H1 X"
          style={{
            width: '100%', height: 'auto', display: 'block',
            filter: 'drop-shadow(0 24px 40px rgba(94,192,232,0.18))',
          }}/>
      </div>
      {/* sun toggle (matches HMI) */}
      <button style={{
        position: 'absolute', left: 14, top: '54%', transform: 'translateY(-50%)',
        width: 34, height: 34, borderRadius: 999,
        background: 'rgba(4,8,13,0.6)',
        border: '1px solid var(--line-1)',
        color: 'var(--t-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><IconSun size={16}/></button>
    </div>
  );
}

// ─── Map track view: map with craft moving ───
function MapTrackView({ mapStyle }) {
  return (
    <div style={{ position: 'absolute', top: 'calc(var(--safe-top, 0px) + 50px)', left: 0, right: 0, bottom: 60 }}>
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <MapBackground style={mapStyle}/>
        <MapAirspace/>
        <FlightPath waypoints={SEED_WAYPOINTS} animate/>
        {SEED_WAYPOINTS.map((w, i) => {
          const idx = SEED_WAYPOINTS.slice(0, i+1).filter(x => x.kind === 'wp').length;
          return <WaypointMarker key={w.id} x={w.x} y={w.y} idx={idx} kind={w.kind}/>;
        })}
        {/* live craft between WP-1 and WP-2 */}
        <LiveCraftMarker x={460} y={490} heading={45}/>
      </svg>
      <style>{`
        @keyframes dash { to { stroke-dashoffset: -240; } }
      `}</style>
    </div>
  );
}

// ─── Systems view ───
function SystemsView({ battery }) {
  return (
    <div style={{
      position: 'absolute', top: 'calc(var(--safe-top, 0px) + 60px)', left: 14, right: 14, bottom: 130,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12,
    }}>
      {[
        { id:1, name:'MOTOR 1', t:'42°', rpm:'2,840', ok:true },
        { id:2, name:'MOTOR 2', t:'43°', rpm:'2,860', ok:true },
        { id:3, name:'MOTOR 3', t:'41°', rpm:'2,830', ok:true },
        { id:4, name:'MOTOR 4', t:'44°', rpm:'2,870', ok:true },
      ].map(m => (
        <div key={m.id} style={{
          padding: '10px 12px', borderRadius: 8,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--line-1)',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 16px', alignItems: 'center', gap: 12,
        }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--t-cyan)', letterSpacing: '0.08em' }}>{m.name}</span>
          <span className="mono" style={{ fontSize: 14, color: 'var(--t-1)' }}>{m.t}</span>
          <span className="mono" style={{ fontSize: 13, color: 'var(--t-2)' }}>{m.rpm} RPM</span>
          <span className={`dot ${m.ok ? 'dot-green' : 'dot-amber'}`}/>
        </div>
      ))}
    </div>
  );
}

// ─── Bottom HUD ───
function BottomHUD({ tel }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      padding: '8px 14px 14px',
      background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
      zIndex: 4,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
        <HudCell label="SPEED" value={tel.speed} unit="MPH"/>
        <HudCell label="NAVIGATION" value={tel.remaining} unit="MILES REMAINING" wide/>
        <HudCell label="VERTICAL" value={tel.vert > 0 ? `+${tel.vert}` : tel.vert} unit="FT/MIN"/>
        <HudCell label="ALTITUDE" value={tel.alt} unit="FT"/>
        <HudCell label="ETE" value={tel.etE} mono unit=""/>
      </div>
    </div>
  );
}

function HudCell({ label, value, unit, wide, mono }) {
  return (
    <div className="col" style={{ gap: 4, alignItems: 'flex-start' }}>
      <span className="label" style={{ fontSize: 8 }}>{label}</span>
      <div className="row" style={{ alignItems: 'baseline', gap: 3 }}>
        <span className="num" style={{ fontSize: 22, color: 'var(--t-1)' }}>{value}</span>
        {unit && <span className="mono" style={{ fontSize: 7, color: 'var(--t-cyan)', letterSpacing: '0.04em', maxWidth: 64, lineHeight: 1.2 }}>{unit}</span>}
      </div>
    </div>
  );
}

Object.assign(window, { LiveFlightScreen });
