#!/bin/bash
# Deployment commands for Hetzner VPS
# Copy-paste these commands one by one into your VPS terminal

# KROK 1: Update system
echo "🔄 Updating system..."
apt update && apt upgrade -y

# KROK 2: Install Node.js 20.x
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# KROK 3: Install Git
echo "🐙 Installing Git..."
apt install -y git

# KROK 4: Install Puppeteer dependencies
echo "🕷️ Installing Puppeteer dependencies..."
apt install -y \
  chromium-browser \
  libnspr4 \
  libnss3 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libasound2 \
  libpangocairo-1.0-0 \
  libcups2 \
  libxss1 \
  libxtst6 \
  fonts-liberation \
  libnss3-dev \
  libgdk-pixbuf2.0-0 \
  libxshmfence1

# KROK 5: Verify installations
echo "✅ Verifying installations..."
node --version
npm --version
git --version

echo "✅ System prepared! Ready for app deployment."
