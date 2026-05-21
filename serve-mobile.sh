#!/bin/bash
PORT=14607
DIR="$(cd "$(dirname "$0")/mobile" && pwd)"

IS_WSL=false
grep -qi microsoft /proc/version 2>/dev/null && IS_WSL=true
WSL_IP=$(ip -4 addr show eth0 2>/dev/null | grep -oP '(?<=inet\s)\d+(\.\d+){3}' || true)

PROXY_ADDED=false

cleanup() {
  $PROXY_ADDED && netsh.exe interface portproxy delete v4tov4 listenport=$PORT listenaddress=0.0.0.0 >/dev/null 2>&1 || true
  exit 0
}
trap cleanup INT TERM EXIT

echo "Doroni H1 X — Mobile Companion Demo"
echo ""
echo "  Local:   http://localhost:$PORT"

if $IS_WSL && [ -n "$WSL_IP" ]; then
  WIN_IP=$(ipconfig.exe 2>/dev/null | grep -A4 "Wi-Fi" | grep "IPv4" | grep -oP '\d+\.\d+\.\d+\.\d+' | head -1 || true)
  netsh.exe interface portproxy add v4tov4 \
    listenport=$PORT listenaddress=0.0.0.0 \
    connectport=$PORT connectaddress=$WSL_IP >/dev/null 2>&1 && PROXY_ADDED=true || true
  [ -n "${WIN_IP:-}" ] && echo "  Network: http://$WIN_IP:$PORT"
fi

echo ""
echo "Press Ctrl+C to stop."
echo ""

python3 -m http.server $PORT --directory "$DIR"
