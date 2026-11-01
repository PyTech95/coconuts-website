#!/usr/bin/env bash
# =============================================================================
#  Mr. Coconetto — one-command install on your own VPS (Ubuntu 22.04 / 24.04)
#
#  Installs Nginx + PHP + MariaDB + WordPress + the Mr. Coconetto theme
#  (latest release from GitHub) and, if you want, a free SSL certificate.
#
#  Usage (as root, after pointing your domain's DNS A-record to this server):
#
#    curl -fsSL https://raw.githubusercontent.com/PyTech95/coconuts-website/main/scripts/vps-install.sh -o vps-install.sh
#    sudo DOMAIN=mrcoconetto.com ADMIN_EMAIL=you@example.com bash vps-install.sh
#
#  Optional settings (put them before "bash"):
#    ADMIN_USER=admin        WordPress login name            (default: admin)
#    ADMIN_PASS=...          WordPress password              (default: random, printed at the end)
#    WP_PATH=/var/www/mrcoconetto                            (where WordPress is installed)
#    SSL=yes|no              free Let's Encrypt certificate  (default: yes)
#    WWW=yes|no              also serve www.DOMAIN           (default: yes)
#    THEME_ZIP=/path/or/url  use this theme zip instead of the latest GitHub release
#
#  Safe to run again: it skips what is already installed and only updates the theme.
# =============================================================================
set -euo pipefail

DOMAIN="${DOMAIN:-}"
ADMIN_EMAIL="${ADMIN_EMAIL:-}"
ADMIN_USER="${ADMIN_USER:-admin}"
ADMIN_PASS="${ADMIN_PASS:-}"
WP_PATH="${WP_PATH:-/var/www/mrcoconetto}"
SSL="${SSL:-yes}"
WWW="${WWW:-yes}"
REPO="${REPO:-PyTech95/coconuts-website}"
THEME_ZIP="${THEME_ZIP:-https://github.com/$REPO/releases/latest/download/mr-coconetto-wordpress-theme.zip}"
DB_NAME="${DB_NAME:-mrcoconetto}"
DB_USER="${DB_USER:-mrcoconetto}"
CRED_FILE="/root/mrcoconetto-credentials.txt"

say() { printf '\n\033[1;32m▶ %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31m✖ %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Run as root (sudo …)."
[ -n "$DOMAIN" ] || die "Set DOMAIN, e.g.  sudo DOMAIN=mrcoconetto.com ADMIN_EMAIL=you@example.com bash vps-install.sh"
[ -n "$ADMIN_EMAIL" ] || die "Set ADMIN_EMAIL (used for the WordPress login and the SSL certificate)."
command -v apt-get >/dev/null || die "This script supports Ubuntu / Debian."

export DEBIAN_FRONTEND=noninteractive

# ---------------------------------------------------------------- packages
say "Installing Nginx, PHP and MariaDB"
apt-get update -y
apt-get install -y nginx mariadb-server curl unzip ca-certificates \
  php-fpm php-mysql php-curl php-gd php-intl php-mbstring php-xml php-zip php-imagick php-bcmath
PHP_VER="$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')"
PHP_SOCK="/run/php/php${PHP_VER}-fpm.sock"
systemctl enable --now mariadb nginx "php${PHP_VER}-fpm"

# Bigger uploads (photos and short videos from the editor).
cat > "/etc/php/${PHP_VER}/fpm/conf.d/90-mrcoconetto.ini" <<INI
upload_max_filesize = 64M
post_max_size = 70M
memory_limit = 256M
max_execution_time = 120
INI
systemctl restart "php${PHP_VER}-fpm"

# ---------------------------------------------------------------- WP-CLI
if ! command -v wp >/dev/null; then
  say "Installing WP-CLI"
  curl -fsSL -o /usr/local/bin/wp https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
  chmod +x /usr/local/bin/wp
fi
WP() { sudo -u www-data -- wp --path="$WP_PATH" "$@"; }

# ---------------------------------------------------------------- database
if [ -f "$CRED_FILE" ] && grep -q '^DB_PASS=' "$CRED_FILE"; then
  DB_PASS="$(grep '^DB_PASS=' "$CRED_FILE" | cut -d= -f2-)"
else
  DB_PASS="$(openssl rand -hex 16)"
fi
say "Creating the database"
mysql <<SQL
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
ALTER USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
SQL

# ---------------------------------------------------------------- WordPress
mkdir -p "$WP_PATH"
chown -R www-data:www-data "$WP_PATH"
if [ ! -f "$WP_PATH/wp-load.php" ]; then
  say "Downloading WordPress"
  WP core download --locale=en_US
fi

SCHEME="http"; [ "$SSL" = "yes" ] && SCHEME="https"
if [ ! -f "$WP_PATH/wp-config.php" ]; then
  WP config create --dbname="$DB_NAME" --dbuser="$DB_USER" --dbpass="$DB_PASS" --dbhost=localhost --skip-check
  WP config set FS_METHOD direct
  WP config set DISALLOW_FILE_EDIT true --raw
fi

if ! WP core is-installed 2>/dev/null; then
  [ -n "$ADMIN_PASS" ] || ADMIN_PASS="$(openssl rand -base64 18 | tr -d '/+=' | cut -c1-16)"
  say "Installing WordPress"
  WP core install --url="$SCHEME://$DOMAIN" --title="Mr. Coconetto" --admin_user="$ADMIN_USER" \
    --admin_password="$ADMIN_PASS" --admin_email="$ADMIN_EMAIL" --skip-email
  WP option update timezone_string "Asia/Kolkata"
  WP rewrite structure '/%postname%/'
  WP plugin delete hello akismet >/dev/null 2>&1 || true
fi

# ---------------------------------------------------------------- Nginx
say "Configuring Nginx for $DOMAIN"
NAMES="$DOMAIN"; [ "$WWW" = "yes" ] && NAMES="$DOMAIN www.$DOMAIN"
cat > /etc/nginx/sites-available/mrcoconetto <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $NAMES;
    root $WP_PATH;
    index index.php;
    client_max_body_size 70M;

    location / {
        try_files \$uri \$uri/ /index.php?\$args;
    }
    location ~ \.php\$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:$PHP_SOCK;
        fastcgi_read_timeout 120;
    }
    location ~* \.(?:css|js|jpg|jpeg|png|gif|webp|svg|ico|woff2?|mp4|webm)\$ {
        try_files \$uri /index.php?\$args;
        expires 30d;
        access_log off;
    }
    location ~ /\.(?!well-known) { deny all; }
    location = /xmlrpc.php { deny all; }
}
NGINX
ln -sf /etc/nginx/sites-available/mrcoconetto /etc/nginx/sites-enabled/mrcoconetto
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ---------------------------------------------------------------- SSL
if [ "$SSL" = "yes" ]; then
  say "Getting a free SSL certificate (Let's Encrypt)"
  apt-get install -y certbot python3-certbot-nginx
  CERT_DOMAINS=(-d "$DOMAIN"); [ "$WWW" = "yes" ] && CERT_DOMAINS+=(-d "www.$DOMAIN")
  if certbot --nginx --non-interactive --agree-tos --redirect -m "$ADMIN_EMAIL" "${CERT_DOMAINS[@]}"; then
    WP option update home "https://$DOMAIN"
    WP option update siteurl "https://$DOMAIN"
  else
    echo "   SSL could not be issued yet (is the domain pointing to this server?). The site works on http://$DOMAIN — run this script again later for SSL."
    WP option update home "http://$DOMAIN"
    WP option update siteurl "http://$DOMAIN"
  fi
fi

# ---------------------------------------------------------------- theme
say "Installing the Mr. Coconetto theme"
WP theme install "$THEME_ZIP" --force --activate
WP rewrite flush

# Uploads folder for photos / videos from the editor.
mkdir -p "$WP_PATH/wp-content/uploads"
chown -R www-data:www-data "$WP_PATH"

# ---------------------------------------------------------------- done
{
  echo "SITE=$SCHEME://$DOMAIN"
  echo "LOGIN=$SCHEME://$DOMAIN/wp-admin"
  echo "ADMIN_USER=$ADMIN_USER"
  [ -n "$ADMIN_PASS" ] && echo "ADMIN_PASS=$ADMIN_PASS"
  echo "DB_NAME=$DB_NAME"
  echo "DB_USER=$DB_USER"
  echo "DB_PASS=$DB_PASS"
  echo "WP_PATH=$WP_PATH"
} > "$CRED_FILE.new"
# keep the first admin password if this is a re-run
if [ -f "$CRED_FILE" ] && [ -z "$ADMIN_PASS" ]; then grep '^ADMIN_PASS=' "$CRED_FILE" >> "$CRED_FILE.new" || true; fi
mv "$CRED_FILE.new" "$CRED_FILE"; chmod 600 "$CRED_FILE"

say "All done!"
cat "$CRED_FILE" | grep -v '^DB_'
echo
echo "  Saved in $CRED_FILE (keep it safe)."
echo "  Log in, then press  ✏️ Edit the website."
echo "  Tip: install the 'WP Mail SMTP' plugin so order / enquiry emails are delivered."
