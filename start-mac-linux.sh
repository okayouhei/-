#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
echo "Instagram account link app will start at http://localhost:3000"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js was not found. Please install Node.js 18 or later from https://nodejs.org/ and run this script again." >&2
  exit 1
fi
npm start
