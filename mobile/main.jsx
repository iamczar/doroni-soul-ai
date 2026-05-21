// main.jsx — demo mount
// Mobile (≤480px): full-bleed app, no chrome.
// Desktop: single centered iOS phone mockup on dark canvas.

const IS_MOBILE = window.matchMedia('(max-width: 480px)').matches;
const TWEAKS    = { mapStyle: 'vector', battery: 87 };

function Root() {
  if (IS_MOBILE) {
    return (
      <div style={{ width: '100%', height: '100dvh', overflow: 'hidden', background: 'var(--bg-1)' }}>
        <App density="spacious" topInset={0} tweaks={TWEAKS} setTweak={() => {}} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#060a10', padding: '48px 24px',
    }}>
      <IOSDevice dark width={402} height={874}>
        <div style={{ height: '100%', overflow: 'hidden' }}>
          <App density="dense" topInset={48} tweaks={TWEAKS} setTweak={() => {}} />
        </div>
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
