#!/bin/bash
# SOVRA UI Setup Script for OLD Systems (GLIBC < 2.28)
# Compatible with Ubuntu 16.04, 18.04, Debian 9, etc.

set -e  # Exit on error

echo "=========================================="
echo "SOVRA UI - Old System Setup (GLIBC < 2.28)"
echo "=========================================="
echo ""

# Check GLIBC version
echo "Checking GLIBC version..."
GLIBC_VERSION=$(ldd --version | head -1 | awk '{print $NF}')
echo "Your GLIBC version: $GLIBC_VERSION"
echo ""

# Install Node.js 16.x using precompiled binary (GLIBC 2.17+ compatible)
echo "Installing Node.js 16.x (compatible with old GLIBC)..."
cd ~
wget -q https://nodejs.org/dist/v16.20.2/node-v16.20.2-linux-x64.tar.xz
tar -xf node-v16.20.2-linux-x64.tar.xz
rm node-v16.20.2-linux-x64.tar.xz

# Add to PATH
if ! grep -q "node-v16.20.2-linux-x64/bin" ~/.bashrc; then
    echo 'export PATH=~/node-v16.20.2-linux-x64/bin:$PATH' >> ~/.bashrc
fi
export PATH=~/node-v16.20.2-linux-x64/bin:$PATH

echo ""
echo "Node.js installed:"
node --version
npm --version

# Install dependencies
echo ""
echo "Installing project dependencies..."
cd ~/sovra/sovra-ui
npm install

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "To start the server:"
echo "  cd ~/sovra/sovra-ui"
echo "  npm run dev -- --host --port 80"
echo ""
echo "Or with PM2:"
echo "  sudo npm install -g pm2"
echo "  sudo pm2 start npm --name sovra-ui -- run dev -- --host --port 80"
echo ""
