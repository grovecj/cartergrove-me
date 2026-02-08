#!/usr/bin/env bash
# One-time setup for a fresh Ubuntu 24.04 droplet.
# Run as root: bash scripts/server-setup.sh
set -euo pipefail

DOMAIN="cartergrove.me"
APP_DIR="/opt/cartergrove-me"
DEPLOY_USER="deploy"

echo "==> Creating deploy user"
id -u "$DEPLOY_USER" &>/dev/null || adduser --disabled-password --gecos "" "$DEPLOY_USER"
mkdir -p /home/$DEPLOY_USER/.ssh
touch /home/$DEPLOY_USER/.ssh/authorized_keys
cat /root/.ssh/authorized_keys >> /home/$DEPLOY_USER/.ssh/authorized_keys
chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
chmod 700 /home/$DEPLOY_USER/.ssh
chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys

echo "==> Installing Node.js 20"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "==> Installing pm2"
npm install -g pm2
pm2 startup systemd -u $DEPLOY_USER --hp /home/$DEPLOY_USER

echo "==> Installing nginx"
apt-get install -y nginx

echo "==> Installing certbot"
apt-get install -y certbot python3-certbot-nginx

echo "==> Creating app directory"
mkdir -p "$APP_DIR"
chown $DEPLOY_USER:$DEPLOY_USER "$APP_DIR"

echo "==> Copying nginx config"
cp "$APP_DIR/nginx/cartergrove.me.conf" /etc/nginx/sites-available/cartergrove.me.conf 2>/dev/null || echo "  (nginx config will be copied after first deploy)"
ln -sf /etc/nginx/sites-available/cartergrove.me.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

echo "==> Obtaining SSL certificate"
certbot certonly --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "carter@cartergrove.me" || echo "  (SSL will be configured after DNS propagates)"

echo "==> Reloading nginx"
nginx -t && systemctl reload nginx

echo "==> Done! Next steps:"
echo "  1. Create /opt/cartergrove-me/.env with production DATABASE_URL, AUTH_SECRET, etc."
echo "  2. Push to main to trigger the first GitHub Actions deploy."
echo "  3. After first deploy: cp $APP_DIR/nginx/cartergrove.me.conf /etc/nginx/sites-available/ && nginx -t && systemctl reload nginx"
