#!/usr/bin/env bash
# Builds a static, backend-less preview of the site (hash routing, demo editor that saves
# to the browser). Output: frontend/build-preview
set -euo pipefail
cd "$(dirname "$0")/../frontend"
REACT_APP_DEMO=1 REACT_APP_ROUTER=hash REACT_APP_BACKEND_URL= PUBLIC_URL=. BUILD_PATH=build-preview GENERATE_SOURCEMAP=false npx craco build
echo "Preview built in frontend/build-preview"
