// icons.jsx — tiny line icons for the Doroni companion
// All draw at 24x24 viewBox unless noted; stroke=currentColor, fill=none.

const I = (path, opts = {}) => {
  const { size = 18, stroke = 1.6, fill = 'none', vb = '0 0 24 24', children } = opts;
  return (props = {}) => (
    <svg
      width={props.size || size}
      height={props.size || size}
      viewBox={vb}
      fill={fill}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={props.style}
    >
      {typeof path === 'string' ? <path d={path} /> : path}
      {children}
    </svg>
  );
};

const IconHome     = I(<><path d="M3 11.5L12 4l9 7.5"/><path d="M5 10v10h14V10"/></>);
const IconRoute    = I(<><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5v4a4 4 0 0 0 4 4h4"/></>);
const IconPower    = I(<><path d="M12 4v8"/><path d="M7.5 7a7 7 0 1 0 9 0"/></>);
const IconCraft    = I(<><path d="M4 13l8-7 8 7"/><path d="M7 13h10"/><path d="M9 16l3 3 3-3"/></>);
const IconUser     = I(<><circle cx="12" cy="9" r="3.5"/><path d="M5 20c1-3.5 4-5.5 7-5.5s6 2 7 5.5"/></>);

const IconPlus     = I('M5 12h14M12 5v14');
const IconChevR    = I('M9 6l6 6-6 6');
const IconChevL    = I('M15 6l-6 6 6 6');
const IconChevD    = I('M6 9l6 6 6-6');
const IconChevU    = I('M18 15l-6-6-6 6');
const IconX        = I('M6 6l12 12M6 18L18 6');
const IconCheck    = I('M5 12l4.5 4.5L19 7');
const IconClose    = I('M6 6l12 12M6 18L18 6');
const IconSearch   = I(<><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></>);
const IconFilter   = I('M4 6h16M7 12h10M10 18h4');
const IconMore     = I(<><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></>);

const IconBattery  = I(<><rect x="2.5" y="8" width="16" height="8" rx="1.6"/><path d="M21 11v2"/></>);
const IconBolt     = I('M13 3L4 14h6l-1 7 9-11h-6l1-7z');
const IconWind     = I(<><path d="M3 9h11a3 3 0 1 0-3-3"/><path d="M3 15h15a3 3 0 1 1-3 3"/></>);
const IconCloud    = I('M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 7 18z');
const IconRain     = I(<><path d="M7 15h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 7 15z"/><path d="M9 18l-1 3M13 18l-1 3M17 18l-1 3"/></>);
const IconSun      = I(<><circle cx="12" cy="12" r="3.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></>);
const IconMoon     = I('M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z');
const IconWaypoint = I(<><circle cx="12" cy="10" r="3.2"/><path d="M12 22s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z"/></>);
const IconTakeoff  = I(<><path d="M3 19h18"/><path d="M5 16l14-4a2 2 0 0 0 1-2.5l-1-1-5 2-5-4-2 1 3 5-4 1 1 2.5z"/></>);
const IconLanding  = I(<><path d="M3 19h18"/><path d="M5 15l14 1a2 2 0 0 0 2-2l-1-1-5-1-3-6h-2l1 5-5 1-1 2z"/></>);
const IconClock    = I(<><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></>);
const IconRadio    = I(<><circle cx="12" cy="12" r="2.5"/><path d="M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 19a10 10 0 0 1 0-14M19 5a10 10 0 0 1 0 14"/></>);
const IconGauge    = I(<><path d="M5 16a8 8 0 1 1 14 0"/><path d="M12 16l4-4"/></>);
const IconSettings = I(<><circle cx="12" cy="12" r="3"/><path d="M19 12l2-1.5-1.5-2.5L17 9l-1.5-1L15 5h-3l-.5 3-2 1L7 8 5.5 10.5 7 12l-1.5 2L7 16l2-1 1.5 1 .5 3h3l.5-3 2-1 2 1 1.5-2.5L19 12z"/></>);
const IconShield   = I(<><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></>);
const IconAlert    = I(<><path d="M12 3l10 17H2z"/><path d="M12 10v4M12 17h0"/></>);
const IconInfo     = I(<><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 8h0"/></>);
const IconHeart    = I('M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z');
const IconHistory  = I(<><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/><path d="M4 8l3-3"/></>);
const IconMaint    = I(<><path d="M14.5 4a3.5 3.5 0 0 0-4.5 4.5L4 14.5 9.5 20l6-6a3.5 3.5 0 0 0 4.5-4.5l-2.5 2.5L15 10l2-2.5z"/></>);
const IconLayers   = I(<><path d="M12 4l9 5-9 5-9-5z"/><path d="M3 14l9 5 9-5"/></>);
const IconCompass  = I(<><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="currentColor"/></>);
const IconArrowUp  = I('M12 19V5M5 12l7-7 7 7');
const IconArrowDn  = I('M12 5v14M19 12l-7 7-7-7');
const IconArrowR   = I('M5 12h14M12 5l7 7-7 7');
const IconLink     = I(<><path d="M10 14a4 4 0 0 1 0-5l3-3a4 4 0 0 1 5.5 5.5l-1 1"/><path d="M14 10a4 4 0 0 1 0 5l-3 3a4 4 0 0 1-5.5-5.5l1-1"/></>);
const IconBT       = I('M7 6l10 12-5 4V2l5 4L7 18');
const IconLock     = I(<><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>);
const IconCpu      = I(<><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 10h6v4H9z"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/></>);
const IconCell     = I(<><path d="M5 18l3-3M9 14l3-3M13 10l3-3M17 6l3-3"/><path d="M21 3v6"/></>);
const IconMic      = I(<><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></>);
const IconPin      = I(<><circle cx="12" cy="10" r="3"/><path d="M12 21s7-7 7-11a7 7 0 1 0-14 0c0 4 7 11 7 11z"/></>);
const IconEye      = I(<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>);
const IconCopy     = I(<><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>);
const IconTrash    = I(<><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/><path d="M9 7V4h6v3"/></>);

// Doroni "compass-blade" mark — small badge-like glyph for branding
function DoroniMark({ size = 28, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14.5" stroke={color} strokeOpacity="0.35" />
      <path d="M16 5 L19 16 L16 27 L13 16 Z" fill={color} />
      <path d="M5 16 L16 13 L27 16 L16 19 Z" fill={color} opacity="0.55"/>
      <circle cx="16" cy="16" r="2.2" fill="#ff6b1a"/>
    </svg>
  );
}

// Top-down craft silhouette for "tracking" view
function CraftTopDown({ size = 130, color = '#f4f7fb' }) {
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 240 130" fill="none">
      {/* fuselage */}
      <ellipse cx="120" cy="65" rx="22" ry="46" fill={color} opacity="0.92"/>
      {/* wings */}
      <path d="M30 60 Q90 50 110 65 Q90 80 30 70 Z" fill={color} opacity="0.78"/>
      <path d="M210 60 Q150 50 130 65 Q150 80 210 70 Z" fill={color} opacity="0.78"/>
      {/* rotors */}
      <circle cx="60" cy="65" r="18" fill="none" stroke={color} strokeOpacity="0.35"/>
      <circle cx="180" cy="65" r="18" fill="none" stroke={color} strokeOpacity="0.35"/>
      <line x1="42" y1="65" x2="78" y2="65" stroke={color} strokeOpacity="0.5"/>
      <line x1="60" y1="47" x2="60" y2="83" stroke={color} strokeOpacity="0.5"/>
      <line x1="162" y1="65" x2="198" y2="65" stroke={color} strokeOpacity="0.5"/>
      <line x1="180" y1="47" x2="180" y2="83" stroke={color} strokeOpacity="0.5"/>
      {/* nose */}
      <path d="M118 19 L120 9 L122 19 Z" fill="#ff6b1a"/>
      {/* tail dot */}
      <circle cx="120" cy="115" r="3" fill="#ff6b1a"/>
    </svg>
  );
}

// Front-on craft silhouette (matches HMI hero)
function CraftFront({ size = 180, color = '#e6edf5' }) {
  const w = size, h = size * 0.5;
  return (
    <svg width={w} height={h} viewBox="0 0 360 180" fill="none">
      {/* upper wing */}
      <path d="M20 75 Q110 65 165 78 L165 92 Q105 100 20 92 Z" fill={color} opacity="0.85"/>
      <path d="M340 75 Q250 65 195 78 L195 92 Q255 100 340 92 Z" fill={color} opacity="0.85"/>
      {/* canopy bulb */}
      <ellipse cx="180" cy="80" rx="28" ry="32" fill={color}/>
      <path d="M179 50 L181 50 L181 100 L179 100 Z" fill="#ff6b1a"/>
      {/* lower wing */}
      <path d="M50 122 Q120 115 165 120 L165 134 Q120 138 50 132 Z" fill={color} opacity="0.7"/>
      <path d="M310 122 Q240 115 195 120 L195 134 Q240 138 310 132 Z" fill={color} opacity="0.7"/>
      {/* rotors (small) */}
      <circle cx="148" cy="125" r="14" fill="none" stroke={color} strokeOpacity="0.4"/>
      <circle cx="212" cy="125" r="14" fill="none" stroke={color} strokeOpacity="0.4"/>
      {/* skids */}
      <rect x="18" y="155" width="324" height="4" rx="2" fill={color} opacity="0.5"/>
    </svg>
  );
}

Object.assign(window, {
  IconHome, IconRoute, IconPower, IconCraft, IconUser,
  IconPlus, IconChevR, IconChevL, IconChevD, IconChevU, IconX, IconCheck, IconClose,
  IconSearch, IconFilter, IconMore,
  IconBattery, IconBolt, IconWind, IconCloud, IconRain, IconSun, IconMoon,
  IconWaypoint, IconTakeoff, IconLanding, IconClock, IconRadio, IconGauge,
  IconSettings, IconShield, IconAlert, IconInfo, IconHeart, IconHistory, IconMaint,
  IconLayers, IconCompass, IconArrowUp, IconArrowDn, IconArrowR, IconLink, IconBT,
  IconLock, IconCpu, IconCell, IconMic, IconPin, IconEye, IconCopy, IconTrash,
  DoroniMark, CraftTopDown, CraftFront,
});
