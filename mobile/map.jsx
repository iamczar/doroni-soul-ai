// map.jsx — MapLibre GL real-tile map
// Exports: MapView (editor), LiveMapView (live screen), planRoute, haversine

const CARTO_DARK = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const MIAMI = { lng: -80.19, lat: 25.77 };

const NREL_KEY  = 'DEMO_KEY';
const NREL_BASE = 'https://developer.nrel.gov/api/alt-fuel-stations/v1.json';

// 61 real NREL stations across South/Central Florida (fetched 2026-05-21)
const FALLBACK_STATIONS = [
  { id:"37835", name:"City of Delray Beach - Banker's Row", lat:26.46531, lng:-80.07219, type:"level2", ports:{ dcFast:0, level2:3 } },
  { id:"39964", name:"Deland Nissan", lat:28.98386, lng:-81.30057, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"39965", name:"Delray Nissan", lat:26.4352, lng:-80.07223, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"39966", name:"Fort Lauderdale Nissan", lat:26.10983, lng:-80.1371, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"39970", name:"Bill Seidle's Nissan", lat:25.78297, lng:-80.36645, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"39971", name:"Palmetto 57 Nissan", lat:25.92605, lng:-80.29188, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"39972", name:"AutoNation Nissan - Miami", lat:25.76513, lng:-80.2504, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"39973", name:"AutoNation Nissan - Kendall", lat:25.60939, lng:-80.34824, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"39974", name:"AutoNation Nissan - Pembroke Pines", lat:26.00785, lng:-80.26257, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"39975", name:"Alan Jay Nissan", lat:27.48592, lng:-81.48172, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"39976", name:"Wallace Nissan", lat:27.15267, lng:-80.21792, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"39979", name:"Ferman Nissan - North Tampa", lat:28.04892, lng:-82.45832, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"39980", name:"Sutherlin Nissan - Vero Beach", lat:27.58549, lng:-80.37645, type:"dc-fast", ports:{ dcFast:1, level2:0 } },
  { id:"39982", name:"Hill Nissan", lat:27.98296, lng:-81.67626, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"40594", name:"Jupiter Town Hall Complex", lat:26.9322, lng:-80.1027, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"41800", name:"Lee County Gov Admin East", lat:26.64279, lng:-81.86913, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"43551", name:"Tampa Area Electrical JATC", lat:27.9882, lng:-82.39216, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"43971", name:"Carmine's Coal Fired Pizza", lat:26.89215, lng:-80.10267, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"46311", name:"Solar by Harrimans", lat:27.08303, lng:-82.42344, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"46560", name:"Harbor Nissan", lat:26.96684, lng:-82.07685, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"46571", name:"Sutherlin Nissan - Fort Myers", lat:26.53933, lng:-81.87082, type:"dc-fast", ports:{ dcFast:1, level2:0 } },
  { id:"46582", name:"Jenkins Nissan", lat:28.09826, lng:-81.94968, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"46597", name:"Pearson Nissan - Ocala", lat:29.17259, lng:-82.15999, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"46601", name:"Reed Motors", lat:28.55168, lng:-81.42456, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"46606", name:"Universal Nissan - Orlando", lat:28.38053, lng:-81.40366, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"46617", name:"Naples Nissan", lat:26.21039, lng:-81.74406, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"46627", name:"Gettel Nissan - Sarasota", lat:27.29839, lng:-82.49887, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"46634", name:"Pat Fischer Nissan", lat:28.60304, lng:-80.80927, type:"dc-fast", ports:{ dcFast:1, level2:1 } },
  { id:"46636", name:"Venice Nissan", lat:27.09076, lng:-82.4332, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"47665", name:"City of Lake Mary - Trailhead Park", lat:28.75658, lng:-81.3459, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"47670", name:"Rosen Medical Plaza", lat:28.45093, lng:-81.47344, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"48049", name:"Hills County Keel Library", lat:28.08675, lng:-82.49262, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"48650", name:"Hills County Plant City", lat:28.01757, lng:-82.12125, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"49943", name:"Hilton Orlando Bonnet Creek", lat:28.35464, lng:-81.534, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"50009", name:"City of DeLand - City Hall", lat:29.02764, lng:-81.30658, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"50453", name:"Sheraton Vistana Village", lat:28.38685, lng:-81.47679, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"51738", name:"City of Boynton Beach - Fire Station #5", lat:26.54829, lng:-80.07214, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"51740", name:"Publix #850 - Ft Lauderdale", lat:26.11424, lng:-80.14382, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"51970", name:"Sawgrass Ford", lat:26.14805, lng:-80.33903, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"52105", name:"Florida Mall Hotel", lat:28.45031, lng:-81.39801, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"52533", name:"Metro Ford - Miami", lat:25.85735, lng:-80.2104, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"62284", name:"The Ritz-Carlton Orlando", lat:28.40522, lng:-81.42777, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"67290", name:"Westgate Vacation Villas", lat:28.32904, lng:-81.59728, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"68382", name:"Publix #1182 - Tampa", lat:27.94146, lng:-82.48465, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"68485", name:"The Alfond Inn - Tesla Supercharger", lat:28.5955, lng:-81.34762, type:"dc-fast", ports:{ dcFast:1, level2:0 } },
  { id:"69116", name:"City of West Palm Beach - Clematis Garage", lat:26.71417, lng:-80.05557, type:"level2", ports:{ dcFast:0, level2:8 } },
  { id:"75060", name:"Hyatt Regency Orlando", lat:28.42695, lng:-81.46817, type:"level2", ports:{ dcFast:0, level2:60 } },
  { id:"77245", name:"FPL - Manatee Lagoon", lat:26.76284, lng:-80.0513, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"81085", name:"Publix #1494 - Miami", lat:25.7566, lng:-80.28836, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"81475", name:"Trump Tower Sunny Isles", lat:25.99625, lng:-80.11727, type:"level2", ports:{ dcFast:0, level2:1 } },
  { id:"82353", name:"Sawgrass Mills Mall", lat:26.14881, lng:-80.31787, type:"level2", ports:{ dcFast:0, level2:4 } },
  { id:"82582", name:"Frost Science Museum Miami", lat:25.78561, lng:-80.1875, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"86226", name:"Banyan Street Capital - Tampa", lat:27.94634, lng:-82.45848, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"86419", name:"City of Delray Beach - Fairfield Inn", lat:26.46112, lng:-80.08251, type:"level2", ports:{ dcFast:0, level2:2 } },
  { id:"87854", name:"Hills County Bloomingdale", lat:27.89456, lng:-82.25221, type:"level2", ports:{ dcFast:0, level2:2 } },
];

let _chargerCache = null;

async function loadChargers() {
  if (_chargerCache) return _chargerCache;
  // Show real Florida data immediately while live fetch runs
  _chargerCache = FALLBACK_STATIONS;
  window.NREL_CHARGERS = _chargerCache;
  try {
    // state=FL works with DEMO_KEY (location/radius params are ignored by DEMO_KEY)
    const p = new URLSearchParams({
      api_key: NREL_KEY, fuel_type: 'ELEC', status: 'E', access: 'public',
      state: 'FL', limit: '200',
    });
    const res = await fetch(`${NREL_BASE}?${p}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const stations = (data.fuel_stations || [])
      .map(s => {
        const lat = Number(s.latitude), lng = Number(s.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return {
          id: String(s.id), name: s.station_name,
          lat, lng,
          type: s.ev_dc_fast_num > 0 ? 'dc-fast' : 'level2',
          ports: { dcFast: s.ev_dc_fast_num || 0, level2: s.ev_level2_evse_num || 0 },
        };
      })
      .filter(Boolean);
    if (stations.length > 10) {
      _chargerCache = stations;
      window.NREL_CHARGERS = stations;
    }
  } catch (e) {
    console.warn('[NREL] live fetch failed, using Florida data:', e.message);
  }
  return _chargerCache;
}

function buildRangeCircle(center, radiusMiles, steps = 64) {
  const R = 3958.8;
  const lat = center.lat * Math.PI / 180;
  const lng = center.lng * Math.PI / 180;
  const d   = radiusMiles / R;
  const coords = [];
  for (let i = 0; i <= steps; i++) {
    const bearing = (i * 2 * Math.PI) / steps;
    const sinLat2 = Math.sin(lat)*Math.cos(d) + Math.cos(lat)*Math.sin(d)*Math.cos(bearing);
    const lat2 = Math.asin(sinLat2);
    const y = Math.sin(bearing)*Math.sin(d)*Math.cos(lat);
    const x = Math.cos(d) - Math.sin(lat)*sinLat2;
    const lng2 = lng + Math.atan2(y, x);
    coords.push([lng2 * 180/Math.PI, lat2 * 180/Math.PI]);
  }
  return { type:'Feature', properties:{}, geometry:{ type:'Polygon', coordinates:[coords] } };
}

function haversine(a, b) {
  const R = 3958.8;
  const φ1 = a.lat * Math.PI/180, φ2 = b.lat * Math.PI/180;
  const Δφ = (b.lat - a.lat) * Math.PI/180, Δλ = (b.lng - a.lng) * Math.PI/180;
  const x = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function planRoute(origin, destination, batteryPct, chargers) {
  const MAX_RANGE = 100, RESERVE = 20, BURN = 0.8;
  const range = (soc) => Math.min(MAX_RANGE, Math.max(0, (soc - RESERVE) / BURN));

  const stops = [];
  let current = origin;
  let soc = batteryPct;
  const visited = new Set();

  for (let iter = 0; iter < 15; iter++) {
    if (haversine(current, destination) <= range(soc)) break;

    const distToDest = haversine(current, destination);
    const scored = chargers
      .filter(c => !visited.has(c.id))
      .map(c => ({ c, d: haversine(current, c), rem: haversine(c, destination) }))
      .filter(r => r.d <= range(soc) && r.rem < distToDest)
      .sort((a, b) => {
        const aFast = (a.c.ports?.dcFast || 0) > 0 ? 1 : 0;
        const bFast = (b.c.ports?.dcFast || 0) > 0 ? 1 : 0;
        if (aFast !== bFast) return bFast - aFast;
        return a.rem - b.rem;
      });

    if (!scored.length) return null;
    const best = scored[0];
    stops.push(best.c);
    visited.add(best.c.id);
    current = best.c;
    soc = 100;
  }

  return stops;
}

const lineGeoJSON = (wps) => ({
  type: 'Feature',
  geometry: { type: 'LineString', coordinates: wps.map(w => [w.lng, w.lat]) },
});

const chargersGeoJSON = (stations) => ({
  type: 'FeatureCollection',
  features: (stations || FALLBACK_STATIONS).map(cs => ({
    type: 'Feature', properties: cs,
    geometry: { type: 'Point', coordinates: [cs.lng, cs.lat] },
  })),
});

function addMapSources(map) {
  // range circle — drawn first so it renders beneath everything
  map.addSource('range-circle', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addLayer({ id: 'range-fill', type: 'fill', source: 'range-circle',
    paint: { 'fill-color': '#5ec0e8', 'fill-opacity': 0.05 } });
  map.addLayer({ id: 'range-outline', type: 'line', source: 'range-circle',
    paint: { 'line-color': '#5ec0e8', 'line-width': 1.4, 'line-opacity': 0.65, 'line-dasharray': [3, 2] } });

  map.addSource('route', { type: 'geojson', data: lineGeoJSON([]) });
  map.addLayer({ id: 'route-glow', type: 'line', source: 'route',
    paint: { 'line-color': '#ff6b1a', 'line-width': 8, 'line-opacity': 0.18, 'line-blur': 4 } });
  map.addLayer({ id: 'route-line', type: 'line', source: 'route',
    paint: { 'line-color': '#ff6b1a', 'line-width': 2.5, 'line-opacity': 0.9 },
    layout: { 'line-cap': 'round' } });

  map.addSource('chargers', { type: 'geojson', data: chargersGeoJSON() });
  map.addLayer({ id: 'charger-dot', type: 'circle', source: 'chargers',
    paint: {
      'circle-radius': 5,
      'circle-color': ['case', ['==', ['get', 'type'], 'dc-fast'], '#5ec0e8', '#4ec97e'],
      'circle-stroke-width': 1.5,
      'circle-stroke-color': 'rgba(0,0,0,0.4)',
    },
  });
}

// ─── Interactive editor map ────────────────────────────────────────────────
function MapView({ waypoints, selected, setSelected, onMapTap, adding, setAdding, onDragWp, rangeMiles }) {
  const containerRef  = React.useRef(null);
  const mlRef         = React.useRef(null);
  const markersRef    = React.useRef({});
  const [mapLoaded, setMapLoaded] = React.useState(false);

  // Always-current refs so map event handlers never see stale closures
  const addingRef    = React.useRef(adding);
  const onMapTapRef  = React.useRef(onMapTap);
  const onDragWpRef  = React.useRef(onDragWp);
  const setSelRef    = React.useRef(setSelected);
  addingRef.current   = adding;
  onMapTapRef.current = onMapTap;
  onDragWpRef.current = onDragWp;
  setSelRef.current   = setSelected;

  // Init map once
  React.useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: CARTO_DARK,
      center: [MIAMI.lng, MIAMI.lat],
      zoom: 11,
      attributionControl: false,
    });
    mlRef.current = map;

    map.on('load', () => {
      addMapSources(map);
      setMapLoaded(true);
      // Show fallback data immediately, then refresh from live NREL
      map.getSource('chargers').setData(chargersGeoJSON(FALLBACK_STATIONS));
      loadChargers().then(stations => {
        if (mlRef.current) mlRef.current.getSource('chargers').setData(chargersGeoJSON(stations));
      });
    });

    map.on('click', (e) => {
      if (!addingRef.current) return;
      onMapTapRef.current({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    });

    return () => { map.remove(); mlRef.current = null; };
  }, []);

  // Update route line
  React.useEffect(() => {
    const map = mlRef.current;
    if (!map || !mapLoaded) return;
    map.getSource('route').setData(lineGeoJSON(waypoints));
  }, [waypoints, mapLoaded]);

  // Sync waypoint markers
  React.useEffect(() => {
    const map = mlRef.current;
    if (!map || !mapLoaded) return;

    // Remove markers for deleted waypoints
    const wpIds = new Set(waypoints.map(w => w.id));
    Object.keys(markersRef.current).forEach(id => {
      if (!wpIds.has(id)) { markersRef.current[id].remove(); delete markersRef.current[id]; }
    });

    waypoints.forEach(wp => {
      const fill  = wp.kind === 'takeoff' ? '#4ec97e' : wp.kind === 'landing' ? '#5ec0e8' : '#ff6b1a';
      const wpNum = waypoints.filter(w => w.kind === 'wp').indexOf(wp) + 1;
      const label = wp.kind === 'takeoff' ? 'T' : wp.kind === 'landing' ? 'L' : String(wpNum);
      const isSel = wp.id === selected;
      const shadow = isSel ? `0 0 0 3px ${fill}, 0 0 0 5px rgba(0,0,0,0.55)` : 'none';

      if (markersRef.current[wp.id]) {
        markersRef.current[wp.id].setLngLat([wp.lng, wp.lat]);
        markersRef.current[wp.id].getElement().style.boxShadow = shadow;
      } else {
        const el = document.createElement('div');
        el.style.cssText = `
          width:28px; height:28px; border-radius:50%;
          background:${fill}; border:2px solid #04080d;
          display:flex; align-items:center; justify-content:center;
          font:600 12px/1 Inter,system-ui; color:#04080d;
          cursor:pointer; box-shadow:${shadow};
        `;
        el.textContent = label;
        el.addEventListener('click', e => { e.stopPropagation(); setSelRef.current(wp.id); });

        const marker = new maplibregl.Marker({ element: el, draggable: !!onDragWp })
          .setLngLat([wp.lng, wp.lat]).addTo(map);

        marker.on('dragend', () => {
          const ll = marker.getLngLat();
          if (onDragWpRef.current) onDragWpRef.current(wp.id, ll.lat, ll.lng);
        });

        markersRef.current[wp.id] = marker;
      }
    });
  }, [waypoints, selected, mapLoaded]);

  // Range circle centred on takeoff waypoint
  React.useEffect(() => {
    const map = mlRef.current;
    if (!map || !mapLoaded) return;
    const takeoff = waypoints.find(w => w.kind === 'takeoff');
    if (!takeoff || !rangeMiles) {
      map.getSource('range-circle').setData({ type: 'FeatureCollection', features: [] });
      return;
    }
    map.getSource('range-circle').setData(buildRangeCircle({ lat: takeoff.lat, lng: takeoff.lng }, rangeMiles));
  }, [waypoints, rangeMiles, mapLoaded]);

  // Crosshair cursor in adding mode
  React.useEffect(() => {
    const map = mlRef.current;
    if (map) map.getCanvas().style.cursor = adding ? 'crosshair' : '';
  }, [adding]);

  const zoomMap = (dir) => {
    const map = mlRef.current;
    if (!map) return;
    if (dir === '+') { map.zoomIn(); return; }
    if (dir === '-') { map.zoomOut(); return; }
    // FIT
    if (waypoints.length < 2) return;
    const lngs = waypoints.map(w => w.lng), lats = waypoints.map(w => w.lat);
    map.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      { padding: 60, duration: 600, maxZoom: 14 }
    );
  };

  const hudBtn = {
    padding: '6px 8px', borderRadius: 8,
    background: 'rgba(4,8,13,0.72)',
    border: '1px solid var(--line-1)',
    color: 'var(--t-2)', display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 10, letterSpacing: '0.06em',
  };
  const zoomBtn = {
    width: 36, height: 32,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--t-1)', background: 'transparent',
  };

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}/>

      {/* HUD — top left */}
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 10 }}>
        <button style={hudBtn}><IconLayers size={16}/>LAYERS</button>
        <button style={hudBtn}><IconSearch size={16}/>FIND</button>
      </div>

      {/* HUD — top right */}
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', zIndex: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 999, background: 'rgba(4,8,13,0.72)', border: '1px solid var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 4, height: 18, background: 'linear-gradient(180deg, var(--orange) 50%, var(--t-2) 50%)', borderRadius: 2 }}/>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(4,8,13,0.72)', border: '1px solid var(--line-strong)', borderRadius: 8, overflow: 'hidden' }}>
          <button onClick={() => zoomMap('+')} style={zoomBtn}><IconPlus size={16}/></button>
          <div style={{ height: 1, background: 'var(--line-1)' }}/>
          <button onClick={() => zoomMap('-')} style={zoomBtn}><span style={{ fontSize: 18, lineHeight: 1, fontWeight: 300 }}>−</span></button>
        </div>
        <button onClick={() => zoomMap('fit')} style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(4,8,13,0.72)', border: '1px solid var(--line-1)', color: 'var(--t-2)', fontSize: 9, letterSpacing: '0.1em' }}>FIT</button>
      </div>

      {/* Legend — charger types */}
      <div style={{
        position: 'absolute', left: 12, bottom: 108,
        background: 'rgba(4,8,13,0.75)', backdropFilter: 'blur(6px)',
        border: '1px solid var(--line-1)', borderRadius: 8, padding: '6px 10px',
        display: 'flex', flexDirection: 'column', gap: 5,
        pointerEvents: 'none', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: '#5ec0e8', flexShrink: 0 }}/>
          <span style={{ fontSize: 10, color: 'var(--t-2)', letterSpacing: '0.04em' }}>DC Fast</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: '#4ec97e', flexShrink: 0 }}/>
          <span style={{ fontSize: 10, color: 'var(--t-2)', letterSpacing: '0.04em' }}>Level 2</span>
        </div>
      </div>

      {/* Range label */}
      {rangeMiles > 0 && (
        <div style={{
          position: 'absolute', left: 12, bottom: 70,
          background: 'rgba(4,8,13,0.75)', backdropFilter: 'blur(6px)',
          border: '1px solid rgba(94,192,232,0.4)', borderRadius: 8, padding: '5px 10px',
          display: 'flex', alignItems: 'center', gap: 6,
          pointerEvents: 'none', zIndex: 10,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: 2,
            border: '1.5px dashed rgba(94,192,232,0.7)', flexShrink: 0 }}/>
          <span className="mono" style={{ fontSize: 11, color: 'var(--t-cyan)', letterSpacing: '0.06em' }}>
            {rangeMiles} MI RANGE
          </span>
        </div>
      )}

      {/* FAB — add waypoint */}
      <button onClick={() => setAdding(a => !a)} style={{
        position: 'absolute', right: 14, bottom: 14,
        width: 48, height: 48, borderRadius: 999,
        background: adding ? 'var(--orange)' : 'var(--bg-3)',
        color: adding ? '#04080d' : 'var(--orange)',
        border: '1px solid ' + (adding ? 'var(--orange)' : 'var(--line-strong)'),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 10,
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
          display: 'flex', alignItems: 'center', gap: 8, zIndex: 10,
        }}>
          <IconWaypoint size={16}/>
          <span>Tap map to add waypoint</span>
        </div>
      )}
    </div>
  );
}

// ─── Live flight map (read-only) ───────────────────────────────────────────
function LiveMapView({ waypoints }) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const wps = (waypoints && waypoints.length >= 2) ? waypoints : [];
    const center = wps.length
      ? [(wps[0].lng + wps[wps.length - 1].lng) / 2, (wps[0].lat + wps[wps.length - 1].lat) / 2]
      : [MIAMI.lng, MIAMI.lat];

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: CARTO_DARK,
      center,
      zoom: 11,
      attributionControl: false,
      interactive: false,
    });

    map.on('load', () => {
      addMapSources(map);

      if (wps.length) {
        map.getSource('route').setData(lineGeoJSON(wps));
        const lngs = wps.map(w => w.lng), lats = wps.map(w => w.lat);
        map.fitBounds(
          [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
          { padding: 40, duration: 0, maxZoom: 13 }
        );

        // Waypoint markers (non-draggable)
        wps.forEach((wp, i) => {
          const fill  = wp.kind === 'takeoff' ? '#4ec97e' : wp.kind === 'landing' ? '#5ec0e8' : '#ff6b1a';
          const wpNum = wps.filter(w => w.kind === 'wp').indexOf(wp) + 1;
          const label = wp.kind === 'takeoff' ? 'T' : wp.kind === 'landing' ? 'L' : String(wpNum);
          const el = document.createElement('div');
          el.style.cssText = `width:22px;height:22px;border-radius:50%;background:${fill};border:2px solid #04080d;display:flex;align-items:center;justify-content:center;font:600 10px/1 Inter,system-ui;color:#04080d;`;
          el.textContent = label;
          new maplibregl.Marker({ element: el }).setLngLat([wp.lng, wp.lat]).addTo(map);
        });

        // Animated craft marker — positioned between WP1 and WP2 (or midpoint)
        const mid = wps.length > 2 ? wps[Math.floor(wps.length / 2)] : wps[0];
        const next = wps.length > 2 ? wps[Math.ceil(wps.length / 2)] : wps[wps.length - 1];
        const craftLat = (mid.lat + next.lat) / 2;
        const craftLng = (mid.lng + next.lng) / 2;

        const craftEl = document.createElement('div');
        craftEl.innerHTML = `<svg width="36" height="36" viewBox="-18 -18 36 36" style="display:block">
          <circle r="18" fill="rgba(255,107,26,0.10)"/>
          <circle r="11" fill="rgba(255,107,26,0.20)"/>
          <ellipse rx="6" ry="14" fill="#f4f7fb"/>
          <path d="M-22-2 L-6-4 L-6 4 L-22 2Z" fill="#f4f7fb" opacity="0.85"/>
          <path d="M22-2 L6-4 L6 4 L22 2Z" fill="#f4f7fb" opacity="0.85"/>
          <path d="M-1-14 L0-20 L1-14Z" fill="#ff6b1a"/>
          <circle cx="-12" cy="0" r="4" fill="none" stroke="#f4f7fb" stroke-opacity="0.6"/>
          <circle cx="12" cy="0" r="4" fill="none" stroke="#f4f7fb" stroke-opacity="0.6"/>
        </svg>`;
        craftEl.style.transform = 'rotate(45deg)';
        new maplibregl.Marker({ element: craftEl }).setLngLat([craftLng, craftLat]).addTo(map);
      }
    });

    return () => map.remove();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }}/>;
}

Object.assign(window, { MapView, LiveMapView, planRoute, haversine });
