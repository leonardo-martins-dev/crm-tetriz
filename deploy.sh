#!/usr/bin/env bash
# Build de producao + reinicio do PM2 (use apos git pull)
set -euo pipefail
cd "$(dirname "$0")"
export NODE_ENV=production
npm run build
if pm2 describe crm-frontend >/dev/null 2>&1; then
  pm2 restart crm-frontend
else
  pm2 start ecosystem.config.cjs
fi
pm2 save
echo "OK: crm-frontend no ar em http://127.0.0.1:4540 (Nginx crm.noponto.io)"
