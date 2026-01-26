#!/bin/bash
echo "🔌 Łączę się z VPS..."
ssh root@77.42.77.255 << 'ENDSSH'
echo "📍 Sprawdzam status PM2..."
/usr/local/node/bin/pm2 status

echo ""
echo "🔄 Restartuję backend..."
/usr/local/node/bin/pm2 restart wawerpolisy

echo ""
echo "✅ Status po restarcie:"
/usr/local/node/bin/pm2 status

echo ""
echo "📋 Ostatnie logi (20 linii):"
/usr/local/node/bin/pm2 logs wawerpolisy --lines 20 --nostream

echo ""
echo "🌐 Testuję API..."
curl -s http://localhost:3000/api/insurance/calculate?action=companies | head -20
ENDSSH
