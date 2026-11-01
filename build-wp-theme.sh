#!/usr/bin/env bash
# Builds the WordPress theme zip:  dist/mr-coconetto-wordpress-theme.zip
#
#   bash build-wp-theme.sh                 # version from style.css
#   THEME_VERSION=2.0.7 bash build-wp-theme.sh
#
# Needs Node 18+ and Yarn 1 (npm i -g yarn). Upload the zip in WordPress:
# Appearance → Themes → Add New → Upload Theme.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
THEME_SLUG="mr-coconetto"
OUT="${OUT_DIR:-$ROOT/dist}"
mkdir -p "$OUT"

echo "▶ Building the website (React)…"
cd "$ROOT/frontend"
[ -d node_modules ] || yarn install --frozen-lockfile --non-interactive
PUBLIC_URL="/wp-content/themes/$THEME_SLUG/build" GENERATE_SOURCEMAP=false CI=false yarn build

echo "▶ Packing the theme…"
STAGE="$(mktemp -d)"
cp -r "$ROOT/wordpress-theme/$THEME_SLUG" "$STAGE/$THEME_SLUG"
rm -rf "$STAGE/$THEME_SLUG/build"
cp -r "$ROOT/frontend/build" "$STAGE/$THEME_SLUG/build"
rm -rf "$STAGE/$THEME_SLUG/build/downloads"
if [ -n "${THEME_VERSION:-}" ]; then
  sed -i.bak "s/^Version: .*/Version: $THEME_VERSION/" "$STAGE/$THEME_SLUG/style.css" && rm -f "$STAGE/$THEME_SLUG/style.css.bak"
fi
(cd "$STAGE" && rm -f "$OUT/$THEME_SLUG-wordpress-theme.zip" && zip -qr "$OUT/$THEME_SLUG-wordpress-theme.zip" "$THEME_SLUG")
rm -rf "$STAGE" "$ROOT/frontend/build"

echo "✔ Done: $OUT/$THEME_SLUG-wordpress-theme.zip"
