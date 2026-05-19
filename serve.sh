#!/bin/bash
PORT=14606
DIR="$(cd "$(dirname "$0")/presentation" && pwd)"

echo "Soul AI Presentation"
echo "Serving: $DIR"
echo "Open:    http://localhost:$PORT"
echo "Press Ctrl+C to stop."
echo ""

python3 -m http.server $PORT --directory "$DIR"
