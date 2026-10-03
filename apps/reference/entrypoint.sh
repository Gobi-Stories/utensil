#!/bin/sh
# Configure nginx port if using nginx
if [ -d /etc/nginx ]; then
  mkdir -p /etc/nginx/conf.d
  envsubst '$PORT' < /app/nginx.conf.template > /etc/nginx/conf.d/default.conf
fi

exec "$@"
