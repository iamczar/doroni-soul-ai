// screens.jsx — Home, Plans list, New flight, Profile, Logbook, Weather, Vehicle health
// All assume they're rendered inside the .doroni shell (tokens.css).

const PLANS_SEED = [
  { id: 'p1',  name: 'Brickell → Aventura',  from: 'BRK-VP01', to: 'AVE-VP02', dist: 14.2, etE: '00:09', status: 'ready' },
  { id: 'p2',  name: 'KFXE Test Loop',       from: 'KFXE',     to: 'KFXE',     dist: 22.7, etE: '00:14', status: 'draft' },
  { id: 'p3',  name: 'Coral Gables Commute', from: 'HOME-01',  to: 'OFFICE-A', dist:  8.6, etE: '00:06', status: 'ready' },
  { id: 'p4',  name: 'Key Biscayne Survey',  from: 'KBI-VP',   to: 'KBI-VP',   dist: 18.3, etE: '00:12', status: 'archived' },
];

const LOG_SEED = [
  { id:'l1', date:'2026·05·17', route:'BRK → AVE', dur:'00:09', dist:14.2, peak:480, ok:true },
  { id:'l2', date:'2026·05·16', route:'KFXE LOOP',  dur:'00:24', dist:32.0, peak:520, ok:true },
  { id:'l3', date:'2026·05·14', route:'BRK → HOME', dur:'00:11', dist:11.4, peak:430, ok:true },
  { id:'l4', date:'2026·05·12', route:'TEST · HOVER',dur:'00:06', dist: 0.8, peak: 80, ok:true },
  { id:'l5', date:'2026·05·10', route:'BRK → AVE',  dur:'00:10', dist:14.2, peak:500, ok:false, note:'WX abort' },
];

// ─────────────────────────────────────────────────────────────
function ScreenChrome({ title, subtitle, nav, right, children, scroll = true }) {
  return (
    <div className="col" style={{ height: '100%', gap: 0 }}>
      <header style={{
        padding: 'calc(var(--safe-top, 0px) + 14px) var(--pad-x) 10px',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 12, flexShrink: 0,
      }}>
        <div>
          {subtitle && <div className="label" style={{ marginBottom: 6 }}>{subtitle}</div>}
          <h1 style={{
            margin: 0, fontSize: 24, fontWeight: 300, letterSpacing: '-0.02em',
          }}>{title}</h1>
        </div>
        <div className="row" style={{ gap: 6 }}>{right}</div>
      </header>
      <div style={{
        flex: 1, overflow: scroll ? 'auto' : 'hidden',
        padding: '4px var(--pad-x) 14px',
      }}>
        {children}
      </div>
    </div>
  );
}

function BackBtn({ onClick, label }) {
  return (
    <button onClick={onClick} className="row" style={{
      gap: 4, padding: '6px 10px 6px 6px',
      borderRadius: 999, background: 'var(--bg-glass)',
      border: '1px solid var(--line-1)',
      fontSize: 12, color: 'var(--t-2)',
    }}>
      <IconChevL size={16}/> {label || 'Back'}
    </button>
  );
}

function IconBtn({ icon, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-glass)', border: '1px solid var(--line-1)',
      color: 'var(--t-1)', position: 'relative',
    }}>
      {icon}
      {badge && <span style={{
        position: 'absolute', top: 6, right: 6, width: 6, height: 6,
        borderRadius: 999, background: 'var(--orange)',
      }}/>}
    </button>
  );
}

function MetricBig({ label, value, unit, color = 'var(--t-1)' }) {
  return (
    <div className="col" style={{ gap: 4 }}>
      <div className="label">{label}</div>
      <div className="row" style={{ alignItems: 'baseline', gap: 4 }}>
        <span className="num" style={{ fontSize: 'var(--num-l)', color }}>{value}</span>
        {unit && <span className="mono" style={{ fontSize: 11, color: 'var(--t-2)', letterSpacing: '0.06em' }}>{unit}</span>}
      </div>
    </div>
  );
}

function StatusPill({ kind, children }) {
  const cls = kind === 'ready' ? 'chip chip-green'
            : kind === 'flight'? 'chip chip-orange'
            : kind === 'maint' ? 'chip chip-amber'
            : 'chip chip-cyan';
  return <span className={cls}>
    <span className={`dot dot-${kind === 'ready' ? 'green' : kind === 'flight' ? 'orange' : 'amber'}`} style={{ marginRight: 2 }}/>
    {children}
  </span>;
}

// ─────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────
function HomeScreen({ ctx, nav }) {
  const battery = ctx.battery;
  const range = Math.round(battery * 1.0);
  const status = ctx.flying ? 'flight' : (battery < 25 ? 'maint' : 'ready');

  return (
    <ScreenChrome
      title="Doroni H1 X"
      subtitle="N-DRX-1 · CRAFT 0041"
      right={<>
        <IconBtn icon={<IconRadio size={16}/>} badge/>
        <IconBtn icon={<IconUser size={16}/>} onClick={()=>nav.tab('profile')}/>
      </>}
    >
      <div className="col">
        {/* status hero */}
        <div className="card" style={{
          background: 'linear-gradient(180deg, var(--bg-2) 0%, var(--bg-1) 100%)',
          padding: 'var(--pad-y) var(--pad-x)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <StatusPill kind={status}>
              {ctx.flying ? 'In Flight' : status === 'maint' ? 'Charge req' : 'Ready'}
            </StatusPill>
            <span className="mono" style={{ fontSize: 11, color: 'var(--t-3)' }}>
              SYNC 0.3s · BT
            </span>
          </div>

          {/* Aircraft: zoom 140% wide so wings fill card, crop 46px from top to center on body */}
          <div style={{
            overflow: 'hidden',
            width: 'calc(100% + 2 * var(--pad-x))',
            height: '185px',
            margin: '4px calc(-1 * var(--pad-x)) 0',
          }}>
            <img src="assets/h1x-front.png" alt="Doroni H1 X"
              style={{
                display: 'block',
                width: '140%',
                marginLeft: '-20%',
                marginTop: '-46px',
                mixBlendMode: 'screen',
              }}/>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
            paddingTop: 8, borderTop: '1px solid var(--line-1)',
          }}>
            <MetricBig label="Battery" value={battery} unit="%" color={battery < 25 ? 'var(--amber)' : 'var(--t-1)'}/>
            <MetricBig label="Range"   value={range}   unit="MI"/>
          </div>
        </div>

        {/* quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
          <QuickAction
            icon={<IconPlus size={18}/>}
            label="Plan flight"
            tone="orange"
            onClick={()=>nav.go('new-flight')}
          />
          <QuickAction
            icon={<IconShield size={18}/>}
            label="Pre-flight"
            tone="cyan"
            onClick={()=>nav.go('checklist')}
          />
          <QuickAction
            icon={<IconCloud size={18}/>}
            label="Weather"
            tone="muted"
            onClick={()=>nav.go('weather')}
          />
          <QuickAction
            icon={<IconCraft size={18}/>}
            label="Aircraft"
            tone="muted"
            onClick={()=>nav.tab('aircraft')}
          />
        </div>

        {/* recent flights */}
        <div className="col" style={{ gap: 8 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="label">Saved plans</div>
            <button onClick={()=>nav.tab('plans')} style={{
              fontSize: 11, color: 'var(--t-cyan)', letterSpacing: '0.04em',
            }}>VIEW ALL <IconChevR size={12} style={{verticalAlign:'middle'}}/></button>
          </div>
          {PLANS_SEED.slice(0,1).concat(ctx.userPlans.slice(0,1)).slice(0,2).map(p => (
            <PlanRow key={p.id} plan={p} onClick={()=>{ ctx.setPlan(p); nav.go('editor'); }}/>
          ))}
        </div>

        {/* system strip */}
        <div className="card" style={{ padding: '10px var(--pad-x)' }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="label">Systems</div>
            <span className="chip chip-green" style={{ padding: '2px 8px' }}>All nominal</span>
          </div>
          <div className="row" style={{
            justifyContent: 'space-between', paddingTop: 10, gap: 0,
            color: 'var(--t-2)',
          }}>
            {[
              ['Motors','4·OK'],
              ['Sensors','12·OK'],
              ['GPS','SAT 14'],
              ['Link','BT·LTE'],
            ].map(([l,v])=>(
              <div key={l} className="col" style={{ gap: 2, alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--t-3)' }}>{l.toUpperCase()}</span>
                <span style={{ fontSize: 12 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenChrome>
  );
}

function QuickAction({ icon, label, tone, onClick }) {
  const tones = {
    orange: { color: 'var(--orange)', bg: 'var(--orange-soft)' },
    cyan:   { color: 'var(--cyan)',   bg: 'var(--cyan-soft)' },
    muted:  { color: 'var(--t-1)',    bg: 'var(--bg-glass)' },
  };
  const t = tones[tone] || tones.muted;
  return (
    <button onClick={onClick} className="card" style={{
      textAlign: 'left',
      display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: t.bg, color: t.color,
      }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
    </button>
  );
}

function PlanRow({ plan, onClick }) {
  return (
    <button onClick={onClick} className="card" style={{
      width: '100%', textAlign: 'left', padding: '10px var(--pad-x)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-glass)', color: 'var(--orange)',
      }}>
        <IconWaypoint size={18}/>
      </div>
      <div className="col" style={{ flex: 1, gap: 3, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
        }}>{plan.name}</div>
        <div className="row" style={{ gap: 8, color: 'var(--t-2)', fontSize: 11 }}>
          <span className="mono">{plan.from}</span>
          <IconChevR size={10}/>
          <span className="mono">{plan.to}</span>
        </div>
      </div>
      <div className="col" style={{ alignItems: 'flex-end', gap: 4 }}>
        <span className="mono" style={{ fontSize: 13 }}>{plan.dist}<span style={{color:'var(--t-3)', fontSize: 10}}>MI</span></span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--t-3)' }}>{plan.etE}</span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// PLANS LIST
// ─────────────────────────────────────────────────────────────
function PlansScreen({ ctx, nav }) {
  const [filter, setFilter] = React.useState('all');
  const combined = [...ctx.userPlans, ...PLANS_SEED];
  const plans = combined.filter(p => filter === 'all' || p.status === filter);
  return (
    <ScreenChrome
      title="Flight plans"
      subtitle={`ROUTING · ${combined.length} SAVED`}
      right={
        <IconBtn icon={<IconPlus size={18}/>} onClick={()=>nav.go('new-flight')}/>
      }
    >
      <div className="col">
        <div className="row" style={{ gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            ['all','All'],
            ['ready','Ready'],
            ['draft','Draft'],
            ['archived','Archived'],
          ].map(([k,l])=>(
            <button key={k} onClick={()=>setFilter(k)} className="chip"
              style={{
                background: filter===k ? 'var(--orange)' : 'transparent',
                color: filter===k ? '#04080d' : 'var(--t-2)',
                border: filter===k ? 'none' : '1px solid var(--line-strong)',
              }}>{l}</button>
          ))}
        </div>
        {ctx.userPlans.length > 0 && filter === 'all' && (
          <div className="label" style={{ paddingTop: 4 }}>Created by you</div>
        )}
        {plans.map(p => (
          <PlanRow key={p.id} plan={p} onClick={()=>{ ctx.setPlan(p); nav.go('editor'); }}/>
        ))}
        <button onClick={()=>nav.go('new-flight')} className="card" style={{
          padding: 'var(--pad-y) var(--pad-x)',
          border: '1px dashed var(--line-strong)',
          color: 'var(--orange)', display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: 'center',
        }}>
          <IconPlus size={18}/>
          <span style={{ fontSize: 14, fontWeight: 500 }}>New flight plan</span>
        </button>
      </div>
    </ScreenChrome>
  );
}

// ─────────────────────────────────────────────────────────────
// NEW FLIGHT
// ─────────────────────────────────────────────────────────────
function NewFlightScreen({ ctx, nav }) {
  const [form, setForm] = React.useState({
    name: 'New flight',
    from: 'BRK-VP01',
    fromName: 'Brickell Vertiport',
    to: '',
    toName: '',
    toLat: null,
    toLng: null,
    date: '2026·05·20',
    time: '14:30',
    pax: 1,
    cargo: 25,
  });
  const [picker, setPicker] = React.useState(null); // 'from' | 'to' | 'date' | 'time'
  const [routeStops, setRouteStops] = React.useState([]);
  const [routeWarning, setRouteWarning] = React.useState(null); // 'planned' | 'beyond-range' | null
  const upd = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const mtow = 1980;
  const empty = 1180;
  const paxLb = form.pax * 180;
  const totalLb = empty + paxLb + form.cargo;
  const overweight = totalLb > mtow;

  const canSubmit = form.to && form.to.trim().length > 0;

  return (
    <>
      <ScreenChrome
        title="New flight"
        subtitle="CREATE · STEP 1 / 2"
        right={<BackBtn onClick={nav.back} />}
      >
        <div className="col">
          <FormField label="Plan name">
            <input value={form.name} onChange={(e) => upd('name', e.target.value)} />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
            <PickField
              label="Departure" icon={<IconTakeoff size={14} />}
              code={form.from} sub={form.fromName}
              onClick={() => setPicker('from')}
            />
            <PickField
              label="Destination" icon={<IconLanding size={14} />}
              code={form.to} sub={form.toName}
              placeholder="Tap to set"
              onClick={() => setPicker('to')}
            />
          </div>

          {routeWarning === 'beyond-range' && (
            <div style={{ padding: '10px 12px', borderRadius: 8,
              background: 'rgba(255,77,87,0.10)', border: '1px solid var(--red)',
              color: 'var(--red)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconAlert size={14}/>
              Destination beyond range — no charging stops found along route.
            </div>
          )}
          {routeWarning === 'planned' && (
            <div style={{ padding: '10px 12px', borderRadius: 8,
              background: 'rgba(94,192,232,0.08)', border: '1px solid var(--t-cyan)',
              color: 'var(--t-cyan)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconInfo size={14}/>
              Route planned via {routeStops.length} charging stop{routeStops.length > 1 ? 's' : ''} — stops added to flight plan.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--gap)' }}>
            <PickField
              label="Date" icon={<IconClock size={14} />}
              code={form.date}
              onClick={() => setPicker('date')}
            />
            <PickField
              label="ETD (local)" icon={<IconClock size={14} />}
              code={fmtTimeDisplay(form.time)}
              onClick={() => setPicker('time')}
            />
          </div>

          <div className="card">
            <div className="label" style={{ marginBottom: 8 }}>Load</div>
            <StepperRow
              label="Passengers" value={form.pax}
              onChange={(v) => upd('pax', Math.max(0, Math.min(2, v)))}
              max={2}
            />
            <hr style={{ margin: '10px 0' }} />
            <StepperRow
              label="Cargo" value={form.cargo} unit="LB" step={5}
              onChange={(v) => upd('cargo', Math.max(0, Math.min(120, v)))}
              max={120}
            />
            <div className="row" style={{
              justifyContent: 'space-between', paddingTop: 10,
              color: overweight ? 'var(--red)' : 'var(--t-2)', fontSize: 12,
            }}>
              <span className="label">Max takeoff</span>
              <span className="mono">{totalLb} / {mtow} LB</span>
            </div>
            <div className="bar" style={{ marginTop: 6 }}>
              <i style={{
                width: `${Math.min(100, (totalLb / mtow) * 100)}%`,
                background: overweight ? 'var(--red)' : 'var(--green)',
              }} />
            </div>
            {overweight && (
              <div className="row" style={{ gap: 6, paddingTop: 8, color: 'var(--red)', fontSize: 11 }}>
                <IconAlert size={14} />
                Over MTOW by {totalLb - mtow} LB — reduce cargo
              </div>
            )}
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconAlert size={18} style={{ color: 'var(--amber)' }} />
            <div className="col" style={{ gap: 2, flex: 1 }}>
              <div style={{ fontSize: 13 }}>VFR conditions required</div>
              <div style={{ fontSize: 11, color: 'var(--t-2)' }}>Ceiling 1500 ft · vis 3+ SM</div>
            </div>
          </div>

          <button
            disabled={!canSubmit || overweight}
            onClick={() => {
              const newPlan = {
                id: 'p-' + Date.now(),
                name: form.name,
                from: form.from,
                to: form.to || 'DEST-?',
                fromName: form.fromName,
                toName: form.toName,
                date: form.date,
                time: form.time,
                pax: form.pax,
                cargo: form.cargo,
                dist: 14.2,
                etE: '00:09',
                status: 'draft',
              };
              ctx.setPlan(newPlan);

              const fromLoc = LOC_BOOK.find(l => l.code === form.from) || LOC_BOOK[1];
              const wps = [
                { id:'wp-t', kind:'takeoff', lat: fromLoc.lat, lng: fromLoc.lng, alt:0, spd:0, name: fromLoc.code || fromLoc.name },
                ...routeStops.map(cs => ({
                  id: 'cs-' + cs.id, kind:'wp',
                  lat: cs.lat, lng: cs.lng,
                  alt: 400, spd: 75, name: cs.name,
                })),
                { id:'wp-l', kind:'landing',
                  lat: form.toLat || 25.957, lng: form.toLng || -80.143,
                  alt:0, spd:0, name: form.to || form.toName },
              ];
              ctx.setWaypoints(wps);
              nav.go('editor');
            }}
            style={{
              padding: '14px 20px', borderRadius: 12,
              background: canSubmit && !overweight ? 'var(--orange)' : 'var(--bg-glass)',
              color:      canSubmit && !overweight ? '#04080d' : 'var(--t-3)',
              border:     canSubmit && !overweight ? 'none' : '1px solid var(--line-1)',
              fontSize: 15, fontWeight: 600, letterSpacing: '0.02em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              marginTop: 4, cursor: canSubmit && !overweight ? 'pointer' : 'not-allowed',
            }}
          >
            {canSubmit ? <>Continue to map <IconArrowR size={18} /></> : 'Set a destination'}
          </button>
        </div>
      </ScreenChrome>

      {picker === 'from' && (
        <LocationPicker
          title="Departure" subtitle="WHERE YOU TAKE OFF"
          allowCurrent
          onClose={() => setPicker(null)}
          onPick={(l) => {
            upd('from', l.kind === 'cur' ? 'CURRENT' : l.code || 'CUSTOM');
            upd('fromName', l.name);
            setPicker(null);
          }}
        />
      )}
      {picker === 'to' && (
        <LocationPicker
          title="Destination" subtitle="WHERE YOU LAND"
          onClose={() => setPicker(null)}
          onPick={(dest) => {
            upd('to', dest.code || 'CUSTOM');
            upd('toName', dest.name);
            upd('toLat', dest.lat);
            upd('toLng', dest.lng);
            setPicker(null);

            const origin = LOC_BOOK.find(l => l.code === form.from) || LOC_BOOK[1];
            if (dest.lat && dest.lng && origin?.lat && window.haversine) {
              const rangeMiles = Math.min(100, Math.max(0, (ctx.battery - 20) / 0.8));
              const directMi = window.haversine(origin, dest);
              if (directMi <= rangeMiles) {
                setRouteStops([]);
                setRouteWarning(null);
              } else {
                const chargers = window.NREL_CHARGERS || [];
                const stops = window.planRoute ? window.planRoute(origin, dest, ctx.battery, chargers) : null;
                if (stops && stops.length) {
                  setRouteStops(stops);
                  setRouteWarning('planned');
                } else {
                  setRouteStops([]);
                  setRouteWarning('beyond-range');
                }
              }
            }
          }}
        />
      )}
      {picker === 'date' && (
        <DatePicker
          value={form.date}
          onClose={() => setPicker(null)}
          onPick={(d) => { upd('date', d); setPicker(null); }}
        />
      )}
      {picker === 'time' && (
        <TimePicker
          value={form.time}
          onClose={() => setPicker(null)}
          onPick={(t) => { upd('time', t); setPicker(null); }}
        />
      )}
    </>
  );
}

function fmtTimeDisplay(t) {
  const m = String(t).match(/(\d{1,2}):(\d{2})/);
  if (!m) return t;
  let h = Number(m[1]);
  const mi = m[2];
  const mer = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (h === 0) h = 12;
  return `${String(h).padStart(2, '0')}:${mi} ${mer}`;
}

function PickField({ label, icon, code, sub, placeholder, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card"
      style={{
        textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6,
        color: 'var(--t-1)', cursor: 'pointer',
        padding: 'var(--pad-y) var(--pad-x)',
      }}
    >
      <span className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon}{label}
      </span>
      <div className="col" style={{ gap: 2, minWidth: 0 }}>
        <span className="mono" style={{
          fontSize: 14, letterSpacing: '0.04em',
          color: code ? 'var(--t-1)' : 'var(--t-3)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {code || placeholder || 'Tap to set'}
        </span>
        {sub && (
          <span style={{
            fontSize: 11, color: 'var(--t-3)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{sub}</span>
        )}
      </div>
    </button>
  );
}

function FormField({ label, icon, children }) {
  return (
    <label className="card" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon}{label}
      </span>
      <div className="ff-wrap">
        {children}
      </div>
      <style>{`
        .ff-wrap input {
          background: transparent; border: 0; color: var(--t-1);
          font: inherit; font-size: 15px; width: 100%; outline: none;
          padding: 0; font-weight: 400;
        }
        .ff-wrap input::placeholder { color: var(--t-3); }
        .ff-wrap input.mono { font-family: var(--f-mono); font-size: 14px; letter-spacing: 0.04em; }
      `}</style>
    </label>
  );
}

function StepperRow({ label, value, onChange, step = 1, unit, max }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <span style={{ fontSize: 14 }}>{label}</span>
      <div className="row" style={{ gap: 8 }}>
        <button onClick={()=>onChange(value - step)} style={btnSquare}>−</button>
        <span className="mono" style={{ minWidth: 36, textAlign: 'center', fontSize: 15 }}>
          {value}{unit && <span style={{ color: 'var(--t-3)', fontSize: 10 }}> {unit}</span>}
        </span>
        <button onClick={()=>onChange(value + step)} style={btnSquare}>+</button>
      </div>
    </div>
  );
}
const btnSquare = {
  width: 30, height: 30, borderRadius: 8,
  background: 'var(--bg-glass)', border: '1px solid var(--line-1)',
  color: 'var(--t-1)', fontSize: 16, fontWeight: 300, lineHeight: 1,
};

// ─────────────────────────────────────────────────────────────
// CHECKLIST
// ─────────────────────────────────────────────────────────────
const CHECKLIST_SECTIONS = [
  { id:'pf', label:'Pre-flight inspection', items: [
    { id:'pf1', t:'External walk-around',          d:'rotors, skids, hull' },
    { id:'pf2', t:'Doors & latches',               d:'seated · secure' },
    { id:'pf3', t:'Tie-downs & chocks',            d:'removed' },
    { id:'pf4', t:'Battery temperature',           d:'within 0–35°C' },
  ]},
  { id:'cb', label:'Cabin', items: [
    { id:'cb1', t:'Harnesses',          d:'tested · locked' },
    { id:'cb2', t:'Cargo secured',      d:'≤ 60 LB · strapped' },
    { id:'cb3', t:'Avionics power',     d:'ON · BUS V > 24' },
  ]},
  { id:'ru', label:'Run-up', items: [
    { id:'ru1', t:'Motor spool 50%',    d:'no vib · symmetric' },
    { id:'ru2', t:'Control surface check', d:'L · R · P · Y' },
    { id:'ru3', t:'Telemetry link',     d:'BT + LTE bonded' },
    { id:'ru4', t:'Geofence loaded',    d:'plan locked' },
  ]},
];

function ChecklistScreen({ ctx, nav }) {
  const [state, setState] = React.useState(ctx.checklist);
  const toggle = (id) => {
    const next = { ...state, [id]: state[id] === 'pass' ? null : 'pass' };
    setState(next); ctx.setChecklist(next);
  };
  const all = CHECKLIST_SECTIONS.flatMap(s=>s.items);
  const done = all.filter(i => state[i.id] === 'pass').length;
  const pct = (done / all.length) * 100;
  const complete = done === all.length;

  return (
    <ScreenChrome
      title="Pre-flight"
      subtitle="CHECKLIST · 11 STEPS"
      right={<BackBtn onClick={nav.back}/>}
    >
      <div className="col">
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span className="num" style={{ fontSize: 32 }}>{done}</span>
              <span style={{ color: 'var(--t-3)', fontSize: 14 }}> / {all.length}</span>
            </div>
            <span className={complete ? 'chip chip-green' : 'chip chip-amber'}>
              {complete ? 'Ready to arm' : `${Math.round(pct)}% complete`}
            </span>
          </div>
          <div className="bar" style={{ marginTop: 10 }}>
            <i style={{ width: `${pct}%`, background: complete ? 'var(--green)' : 'var(--orange)' }}/>
          </div>
        </div>

        {CHECKLIST_SECTIONS.map(s => {
          const sDone = s.items.filter(i=>state[i.id]==='pass').length;
          return (
            <div key={s.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="row" style={{
                justifyContent: 'space-between', padding: '10px var(--pad-x)',
                borderBottom: '1px solid var(--line-1)',
              }}>
                <span className="label">{s.label}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--t-3)' }}>
                  {sDone}/{s.items.length}
                </span>
              </div>
              {s.items.map((it, idx) => {
                const passed = state[it.id] === 'pass';
                return (
                  <button key={it.id} onClick={()=>toggle(it.id)} style={{
                    width: '100%', textAlign: 'left',
                    padding: '10px var(--pad-x)',
                    display: 'flex', alignItems: 'center', gap: 12,
                    borderBottom: idx < s.items.length-1 ? '1px solid var(--line-1)' : 'none',
                    color: 'var(--t-1)',
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      border: '1.5px solid ' + (passed ? 'var(--green)' : 'var(--line-strong)'),
                      background: passed ? 'var(--green)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#04080d',
                    }}>
                      {passed && <IconCheck size={14}/>}
                    </span>
                    <div className="col" style={{ gap: 2, flex: 1 }}>
                      <span style={{ fontSize: 13, opacity: passed ? 0.6 : 1, textDecoration: passed ? 'line-through' : 'none' }}>{it.t}</span>
                      <span style={{ fontSize: 11, color: 'var(--t-3)' }}>{it.d}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}

        <button
          disabled={!complete}
          onClick={()=>{ ctx.setArmed(true); nav.go('live'); }}
          style={{
            padding: '14px 20px', borderRadius: 12,
            background: complete ? 'var(--orange)' : 'var(--bg-glass)',
            color: complete ? '#04080d' : 'var(--t-3)',
            fontSize: 15, fontWeight: 600, letterSpacing: '0.04em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            border: complete ? 'none' : '1px solid var(--line-1)',
          }}>
          {complete ? <><IconPower size={18}/>Arm & continue</> : 'Complete all items to arm'}
        </button>
      </div>
    </ScreenChrome>
  );
}

// ─────────────────────────────────────────────────────────────
// VEHICLE HEALTH
// ─────────────────────────────────────────────────────────────
function VehicleScreen({ ctx, nav }) {
  const motors = [
    { id:1, hp:'34 hrs', t:'42°', ok:true },
    { id:2, hp:'34 hrs', t:'43°', ok:true },
    { id:3, hp:'34 hrs', t:'41°', ok:true },
    { id:4, hp:'34 hrs', t:'44°', ok:true },
  ];
  const battery = ctx.battery;
  return (
    <ScreenChrome
      title="Aircraft"
      subtitle="N-DRX-1 · S/N 0041"
      right={
        <IconBtn icon={<IconHistory size={16}/>} onClick={()=>nav.go('logbook')}/>
      }
    >
      <div className="col">
        {/* battery hero */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="label">Pack · 28 cells · 800 V</div>
            <StatusPill kind={battery > 50 ? 'ready' : battery > 25 ? 'flight' : 'maint'}>
              {battery > 25 ? 'Healthy' : 'Charge req'}
            </StatusPill>
          </div>
          <div className="row" style={{ alignItems: 'flex-end', gap: 4, paddingTop: 12 }}>
            <span className="num" style={{ fontSize: 'var(--num-xl)' }}>{battery}</span>
            <span className="mono" style={{ fontSize: 12, color: 'var(--t-cyan)', paddingBottom: 14, letterSpacing: '0.08em' }}>STATE OF CHARGE %</span>
          </div>
          {/* 28 cells visualization */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 3, paddingTop: 10,
          }}>
            {Array.from({length: 28}).map((_,i)=>{
              const charged = (i / 28) * 100 < battery;
              return <div key={i} style={{
                height: 14, borderRadius: 2,
                background: charged ? 'var(--orange)' : 'rgba(255,107,26,0.12)',
              }}/>;
            })}
          </div>
          <div className="row" style={{
            justifyContent: 'space-between', paddingTop: 10, fontSize: 11, color: 'var(--t-2)',
          }}>
            <span className="mono">CELLS · 28 OK</span>
            <span className="mono">ΔV 0.02 V</span>
            <span className="mono">TEMP 38°C</span>
          </div>
        </div>

        {/* motors grid */}
        <div className="col" style={{ gap: 6 }}>
          <div className="label">Motors</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
            {motors.map(m => (
              <div key={m.id} className="card" style={{ padding: '10px 12px' }}>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--t-cyan)' }}>M{m.id}</span>
                  <span className="dot dot-green"/>
                </div>
                <div className="num" style={{ fontSize: 24, paddingTop: 6 }}>{m.t}</div>
                <div className="row" style={{ justifyContent: 'space-between', fontSize: 11, color: 'var(--t-3)', paddingTop: 4 }}>
                  <span>{m.hp}</span><span>NOMINAL</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* systems */}
        <div className="col" style={{ gap: 6 }}>
          <div className="label">Systems</div>
          <div className="card" style={{ padding: 0 }}>
            <SystemRow icon={<IconRadio size={16}/>}    name="Telemetry link" detail="BT · LTE bonded" status="ok"/>
            <SystemRow icon={<IconCpu size={16}/>}      name="Flight computer" detail="FCS-2 · v4.18.2" status="ok"/>
            <SystemRow icon={<IconCompass size={16}/>}  name="IMU + GPS" detail="14 sats · HDOP 0.7" status="ok"/>
            <SystemRow icon={<IconWind size={16}/>}     name="Air data" detail="pitot · static · OAT" status="ok"/>
            <SystemRow icon={<IconMaint size={16}/>}    name="Service due" detail="in 16 hrs" status="warn" last/>
          </div>
        </div>
      </div>
    </ScreenChrome>
  );
}
function SystemRow({ icon, name, detail, status, last }) {
  const dot = status === 'ok' ? 'dot-green' : status === 'warn' ? 'dot-amber' : 'dot-orange';
  return (
    <div className="row" style={{
      padding: '12px var(--pad-x)',
      borderBottom: last ? 'none' : '1px solid var(--line-1)', gap: 12,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: 'var(--bg-glass)', color: 'var(--t-cyan)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div className="col" style={{ flex: 1, gap: 2 }}>
        <span style={{ fontSize: 14 }}>{name}</span>
        <span style={{ fontSize: 11, color: 'var(--t-3)' }}>{detail}</span>
      </div>
      <span className={`dot ${dot}`}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WEATHER
// ─────────────────────────────────────────────────────────────
function WeatherScreen({ ctx, nav }) {
  return (
    <ScreenChrome
      title="Weather"
      subtitle="ROUTE · BRK → AVE"
      right={<BackBtn onClick={nav.back}/>}
    >
      <div className="col">
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="label">Departure now</div>
              <div className="row" style={{ gap: 6, paddingTop: 4 }}>
                <IconCloud size={26} style={{ color: 'var(--cyan)' }}/>
                <span className="num" style={{ fontSize: 'var(--num-l)' }}>78</span>
                <span className="mono" style={{ alignSelf: 'flex-end', paddingBottom: 6, fontSize: 11, color: 'var(--t-2)' }}>°F</span>
              </div>
            </div>
            <div className="col" style={{ alignItems: 'flex-end', gap: 6 }}>
              <span className="chip chip-green">VFR</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--t-2)' }}>METAR 14:25Z</span>
            </div>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
            paddingTop: 12, marginTop: 12, borderTop: '1px solid var(--line-1)',
          }}>
            {[
              ['WIND','120·08 KT'],
              ['VIS','10 SM'],
              ['CEIL','5000 FT'],
              ['DEW','64°F'],
            ].map(([l,v]) => (
              <div key={l} className="col" style={{ gap: 4, alignItems: 'flex-start' }}>
                <span className="label">{l}</span>
                <span className="mono" style={{ fontSize: 12 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* route strip */}
        <div className="card">
          <div className="label" style={{ marginBottom: 10 }}>En route · next 15 min</div>
          <div style={{ position: 'relative', height: 64 }}>
            <svg viewBox="0 0 320 64" width="100%" height="64" preserveAspectRatio="none">
              <line x1="20" y1="32" x2="300" y2="32" stroke="var(--line-strong)" strokeDasharray="4 4"/>
              {[
                {x: 30, t: 'BRK',  ok: true,  d: '14:30'},
                {x: 120, t: 'WP-1', ok: true,  d: '14:34'},
                {x: 210, t: 'WP-2', ok: false, d: '14:38'},
                {x: 290, t: 'AVE',  ok: true,  d: '14:42'},
              ].map((p,i)=>(
                <g key={i}>
                  <circle cx={p.x} cy="32" r="5" fill={p.ok ? '#4ec97e' : '#ffb547'} />
                  <text x={p.x} y="14" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="9" fontFamily="JetBrains Mono">{p.t}</text>
                  <text x={p.x} y="56" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono">{p.d}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="col" style={{ gap: 6 }}>
          <div className="label">Advisories</div>
          <div className="card" style={{ padding: 0 }}>
            <AdvRow tone="amber"  icon={<IconWind size={16}/>}  name="LL Wind shear"   detail="WP-2 area · 14:35-14:50Z"/>
            <AdvRow tone="orange" icon={<IconAlert size={16}/>} name="TFR active"      detail="P-56 · effective until 18:00Z"/>
            <AdvRow tone="cyan"   icon={<IconRain size={16}/>}  name="Light precip"    detail="Coast · 30% next hour" last/>
          </div>
        </div>
      </div>
    </ScreenChrome>
  );
}

function AdvRow({ tone, icon, name, detail, last }) {
  const c = { amber: 'var(--amber)', orange: 'var(--orange)', cyan: 'var(--cyan)' }[tone];
  return (
    <div className="row" style={{
      padding: '12px var(--pad-x)',
      borderBottom: last ? 'none' : '1px solid var(--line-1)',
      gap: 12,
    }}>
      <div style={{ width: 30, height: 30, borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-glass)', color: c,
      }}>{icon}</div>
      <div className="col" style={{ flex: 1, gap: 2 }}>
        <span style={{ fontSize: 13 }}>{name}</span>
        <span style={{ fontSize: 11, color: 'var(--t-3)' }}>{detail}</span>
      </div>
      <IconChevR size={14} style={{ color: 'var(--t-3)' }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LOGBOOK
// ─────────────────────────────────────────────────────────────
function LogbookScreen({ ctx, nav }) {
  return (
    <ScreenChrome
      title="Logbook"
      subtitle="HISTORY · 5 FLIGHTS"
      right={<BackBtn onClick={nav.back}/>}
    >
      <div className="col">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--gap)' }}>
          <SumStat label="Hours" value="14.6"/>
          <SumStat label="Flights" value="38"/>
          <SumStat label="Miles" value="412"/>
        </div>
        <div className="card" style={{ padding: 0 }}>
          {LOG_SEED.map((f, i) => (
            <div key={f.id} className="row" style={{
              padding: '12px var(--pad-x)', gap: 12,
              borderBottom: i < LOG_SEED.length - 1 ? '1px solid var(--line-1)' : 'none',
            }}>
              <span className={`dot ${f.ok ? 'dot-green' : 'dot-amber'}`} style={{ flexShrink: 0 }}/>
              <div className="col" style={{ flex: 1, gap: 3, minWidth: 0 }}>
                <div className="row" style={{ justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{f.route}</span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--t-3)' }}>{f.date}</span>
                </div>
                <div className="row" style={{ gap: 12, fontSize: 11, color: 'var(--t-2)' }}>
                  <span className="mono">{f.dur}</span>
                  <span className="mono">{f.dist} mi</span>
                  <span className="mono">PEAK {f.peak} FT</span>
                  {f.note && <span style={{ color: 'var(--amber)' }}>{f.note}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenChrome>
  );
}
function SumStat({ label, value }) {
  return (
    <div className="card" style={{ alignItems: 'flex-start' }}>
      <div className="label">{label}</div>
      <div className="num" style={{ fontSize: 28, paddingTop: 4 }}>{value}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────
function ProfileScreen({ ctx, nav }) {
  return (
    <ScreenChrome
      title="Profile"
      subtitle="PILOT · OPERATOR"
      right={<IconBtn icon={<IconSettings size={16}/>}/>}
    >
      <div className="col">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 54, height: 54, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--orange) 0%, #c33d0a 100%)',
            color: '#04080d', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 600,
          }}>MS</div>
          <div className="col" style={{ gap: 4, flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Mauricio S.</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--t-cyan)' }}>OP·1027 · BFR 09/2026</div>
          </div>
          <IconChevR size={16} style={{ color: 'var(--t-3)' }}/>
        </div>

        <div className="col" style={{ gap: 6 }}>
          <div className="label">My aircraft</div>
          <div className="card row" style={{ gap: 14, alignItems: 'center' }}>
            <img src="assets/h1x-front.png" alt="Doroni H1 X"
              style={{ width: 90, height: 'auto', flexShrink: 0, mixBlendMode: 'screen' }}/>
            <div className="col" style={{ flex: 1, gap: 3 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Doroni H1 X</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--t-3)' }}>N-DRX-1 · S/N 0041</div>
              <div className="row" style={{ gap: 6, paddingTop: 4 }}>
                <span className="chip chip-green" style={{ padding: '2px 8px' }}>Registered</span>
                <span className="chip chip-cyan"  style={{ padding: '2px 8px' }}>Paired</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col" style={{ gap: 6 }}>
          <div className="label">More</div>
          <div className="card" style={{ padding: 0 }}>
            <ProfileRow icon={<IconHistory size={16}/>} name="Flight log" onClick={()=>nav.go('logbook')}/>
            <ProfileRow icon={<IconShield size={16}/>}  name="Certifications" detail="Verified"/>
            <ProfileRow icon={<IconLink size={16}/>}    name="Paired devices" detail="2"/>
            <ProfileRow icon={<IconLock size={16}/>}    name="Security & passcode"/>
            <ProfileRow icon={<IconInfo size={16}/>}    name="About H1 X firmware" detail="v4.18.2" last/>
          </div>
        </div>

        <button className="row" style={{
          padding: '14px', borderRadius: 12,
          background: 'transparent', border: '1px solid var(--line-strong)',
          color: 'var(--red)', justifyContent: 'center', fontSize: 14, fontWeight: 500,
        }}>Sign out</button>
      </div>
    </ScreenChrome>
  );
}
function ProfileRow({ icon, name, detail, onClick, last }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', color: 'var(--t-1)',
      padding: '12px var(--pad-x)',
      display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: last ? 'none' : '1px solid var(--line-1)',
    }}>
      <div style={{ width: 28, height: 28, color: 'var(--t-cyan)' }}>{icon}</div>
      <span style={{ flex: 1, fontSize: 14 }}>{name}</span>
      {detail && <span className="mono" style={{ fontSize: 11, color: 'var(--t-3)' }}>{detail}</span>}
      <IconChevR size={14} style={{ color: 'var(--t-3)' }}/>
    </button>
  );
}

Object.assign(window, {
  ScreenChrome, BackBtn, IconBtn, MetricBig, StatusPill,
  HomeScreen, PlansScreen, NewFlightScreen, ChecklistScreen,
  VehicleScreen, WeatherScreen, LogbookScreen, ProfileScreen,
  PLANS_SEED, LOG_SEED,
});
