#!/bin/sh
set -eo pipefail
SCRIPT_DIR=$(dirname "$(realpath "$0")")
cd "$SCRIPT_DIR/.."

rm -rf dist build
pnpm run generate
tsx scripts/replace-openapi.ts
mv lib lib-bck
mv build lib

cleanup() {
  if [[ -d lib-bck ]]; then
    rm -rf build
    mv lib build 2>/dev/null || true
    mv lib-bck lib
  fi
}

trap cleanup EXIT

tsc -p tsconfig.build.json
mv lib build
mv lib-bck lib
rm -rf build

trap - EXIT
