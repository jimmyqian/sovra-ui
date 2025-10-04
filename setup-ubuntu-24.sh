#!/bin/bash
# SOVRA UI Setup Script for Ubuntu 24.04
# Modern systems with GLIBC 2.28+

set -e  # Exit on error

echo "=========================================="
echo "SOVRA UI - Ubuntu 24.04 Setup"
echo "=========================================="
echo ""

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
echo ""
echo "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo ""
echo "Node.js installed:"
node --version
npm --version

# Install PM2 globally
echo ""
echo "Installing PM2 process manager..."
sudo npm install -g pm2

# Navigate to project and install dependencies
echo ""
echo "Installing project dependencies..."
cd ~/sovra/sovra-ui
npm install

# Configure firewall for port 80
echo ""
echo "Configuring firewall for port 80..."
sudo ufw allow 80/tcp
sudo ufw reload || true

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "To start the server on port 80:"
echo "  cd ~/sovra/sovra-ui"
echo "  sudo npm run dev -- --host --port 80"
echo ""
echo "Or with PM2 (recommended):"
echo "  cd ~/sovra/sovra-ui"
echo "  sudo pm2 start npm --name sovra-ui -- run dev -- --host --port 80"
echo "  sudo pm2 save"
echo "  sudo pm2 startup"
echo ""
echo "Access your app at: http://$(curl -s ifconfig.me)"
echo ""
