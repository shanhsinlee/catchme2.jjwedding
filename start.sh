#!/bin/sh
cd /app
NODE_ENV=production pm2 start dist/main.js -i 0 --name "api"
