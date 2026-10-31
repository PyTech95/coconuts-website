#!/usr/bin/env bash
# One-shot update on the server: pull latest main, install deps, build frontend, restart API.
# Usage: bash scripts/deploy.sh   (run from anywhere inside the repo)
set -euo pipefail
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

echo "▶ Pulling latest code"
git pull --ff-only origin main

echo "▶ Backend dependencies"
( cd backend && pip install -q -r requirements.txt )
[ -f backend/.env ] || { echo "!! backend/.env missing — copy backend/.env.example and fill it in"; exit 1; }

echo "▶ Frontend build"
( cd frontend && [ -f .env ] || echo "REACT_APP_BACKEND_URL=" > .env; yarn install --frozen-lockfile --silent && CI=true yarn build )

echo "▶ Restarting API"
if command -v systemctl >/dev/null && systemctl list-units --type=service 2>/dev/null | grep -q coconetto; then
  sudo systemctl restart coconetto-api || true
elif command -v pm2 >/dev/null && pm2 list 2>/dev/null | grep -q coconetto; then
  pm2 restart coconetto-api || true
elif command -v supervisorctl >/dev/null; then
  sudo supervisorctl restart backend || true
else
  echo "   (no known service manager found — restart the uvicorn process manually)"
fi
echo "✔ Done. Frontend build is in frontend/build — serve it as an SPA (all routes → index.html)."
