#!/bin/bash
# Fix Node.js GLIBC compatibility issue
# This script installs Node.js 18.x which has better compatibility with older systems

echo "Fixing Node.js GLIBC compatibility issue..."
echo "This will install Node.js 18.x (compatible with older GLIBC versions)"
echo ""

# Check current GLIBC version
echo "Current GLIBC version:"
ldd --version | head -1

echo ""
echo "Removing current Node.js installation..."
sudo apt remove nodejs -y 2>/dev/null || true

echo ""
echo "Installing Node.js 18.x from NodeSource..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

echo ""
echo "Verifying installation..."
node --version
npm --version

echo ""
echo "Node.js installation complete!"
echo "You can now run: npm install"
