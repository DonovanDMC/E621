#!/bin/bash
set -e
SCRIPT_DIR=$(dirname "$(realpath "$0")")
cd "$SCRIPT_DIR/.."

npm run test:build
python -m http.server 8080 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null' EXIT

xdg-open http://localhost:8080/scripts/browser-test.html
wait "$SERVER_PID"
