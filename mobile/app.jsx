// app.jsx — root prototype app
// Renders all screens in a phone-sized stack with bottom tab nav.
// Density and platform are injected by the host (design canvas).

const TAB_FOR_SCREEN = {
  home: 'home',
  plans: 'plans', 'new-flight': 'plans', editor: 'plans',
  checklist: 'fly', live: 'fly',
  vehicle: 'aircraft', weather: 'aircraft',
  profile: 'profile', logbook: 'profile',
};

const SCREEN_FOR_TAB = {
  home: 'home',
  plans: 'plans',
  fly: 'checklist',
  aircraft: 'vehicle',
  profile: 'profile',
};

function App({ density = 'spacious', topInset = 0, tweaks = {}, setTweak = () => {} }) {
  const [screen, setScreen] = React.useState('home');
  const [stack,  setStack]  = React.useState([]);
  const [plan,   setPlan]   = React.useState(null);
  const [waypoints, setWaypoints] = React.useState(SEED_WAYPOINTS);
  const [checklist, setChecklist] = React.useState({});
  const [armed, setArmed] = React.useState(false);
  const [flying, setFlying] = React.useState(false);
  const [userPlans, setUserPlans] = React.useState([]);
  const [toast, setToast] = React.useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const savePlan = (planObj) => {
    setUserPlans((ps) => {
      const idx = ps.findIndex((p) => p.id === planObj.id);
      if (idx >= 0) {
        const next = [...ps]; next[idx] = planObj; return next;
      }
      return [planObj, ...ps];
    });
    showToast('Plan saved');
  };

  const ctx = {
    plan, setPlan,
    waypoints, setWaypoints,
    checklist, setChecklist,
    armed, setArmed,
    flying, setFlying,
    userPlans,
    savePlan,
    battery: tweaks.battery ?? 87,
    setBattery: (b)=> setTweak('battery', b),
    showToast,
  };

  const nav = {
    go: (s, params) => { setStack(st => [...st, screen]); setScreen(s); },
    back: () => {
      if (stack.length) {
        const prev = stack[stack.length-1];
        setStack(st => st.slice(0, -1));
        setScreen(prev);
      } else {
        setScreen('home');
      }
    },
    tab: (t) => {
      setStack([]);
      setScreen(SCREEN_FOR_TAB[t]);
    },
  };

  const activeTab = TAB_FOR_SCREEN[screen] || 'home';
  const inLive = screen === 'live';

  return (
    <div className={`doroni d-${density}`} style={{
      height: '100%', width: '100%',
      background: 'var(--bg-1)',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      '--safe-top': topInset + 'px',
    }}>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {screen === 'home'        && <HomeScreen        ctx={ctx} nav={nav}/>}
        {screen === 'plans'       && <PlansScreen       ctx={ctx} nav={nav}/>}
        {screen === 'new-flight'  && <NewFlightScreen   ctx={ctx} nav={nav}/>}
        {screen === 'editor'      && <EditorScreen      ctx={ctx} nav={nav} tweaks={tweaks}/>}
        {screen === 'checklist'   && <ChecklistScreen   ctx={ctx} nav={nav}/>}
        {screen === 'live'        && <LiveFlightScreen  ctx={ctx} nav={nav} tweaks={tweaks}/>}
        {screen === 'vehicle'     && <VehicleScreen     ctx={ctx} nav={nav}/>}
        {screen === 'weather'     && <WeatherScreen     ctx={ctx} nav={nav}/>}
        {screen === 'logbook'     && <LogbookScreen     ctx={ctx} nav={nav}/>}
        {screen === 'profile'     && <ProfileScreen     ctx={ctx} nav={nav}/>}
      </div>

      {/* bottom tab bar (hidden on live for full-bleed HMI) */}
      {!inLive && (
        <nav className="tabbar" style={{ flexShrink: 0 }}>
          {[
            ['home',     'Home',   <IconHome size={20}/>],
            ['plans',    'Plans',  <IconRoute size={20}/>],
            ['fly',      'Fly',    <IconPower size={20}/>],
            ['aircraft', 'Craft',  <IconCraft size={20}/>],
            ['profile',  'You',    <IconUser size={20}/>],
          ].map(([t, l, ic]) => (
            <button key={t}
              className={`tab ${activeTab === t ? 'active' : ''}`}
              onClick={()=>nav.tab(t)}
            >
              <span className="tab-icon">{ic}</span>
              <span>{l}</span>
            </button>
          ))}
        </nav>
      )}

      {/* toast */}
      {toast && (
        <div style={{
          position: 'absolute', left: '50%', bottom: inLive ? 30 : 90,
          transform: 'translateX(-50%)',
          padding: '10px 16px', borderRadius: 999,
          background: 'var(--bg-3)', border: '1px solid var(--green)',
          color: 'var(--t-1)', fontSize: 13, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
          animation: 'toastIn 0.18s ease-out',
          zIndex: 200, whiteSpace: 'nowrap',
        }}>
          <IconCheck size={14} style={{ color: 'var(--green)' }}/>
          {toast}
          <style>{`@keyframes toastIn { from{transform:translate(-50%,12px);opacity:0} to{transform:translate(-50%,0);opacity:1} }`}</style>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { App });
