#!/bin/bash
set -e

# Local build and deploy script for Sovra UI
# Run this from your local machine to build and deploy to the remote server

# Configuration - these will be read from inventory.yml and vars.yml by ansible
# For manual runs, update these values
REMOTE_HOST="44.247.48.76"
REMOTE_USER="ubuntu"
SSH_KEY="~/.ssh/new-2025.pem"
REMOTE_PATH="/var/www/sovra-ui"

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}==> Starting local build and deployment${NC}"

# Get the project root (parent of ansible directory)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Change to project root
cd "$PROJECT_ROOT"

# Clean old dist
echo -e "${BLUE}==> Cleaning old build artifacts${NC}"
rm -rf dist dist.tar.gz

# Run tests
echo -e "${BLUE}==> Running tests${NC}"
npm run test:unit || {
    echo -e "${RED}ERROR: Tests failed. Aborting deployment.${NC}"
    exit 1
}

# Run linter
echo -e "${BLUE}==> Running linter${NC}"
npm run lint || {
    echo -e "${RED}ERROR: Linting failed. Aborting deployment.${NC}"
    exit 1
}

# Build application
echo -e "${BLUE}==> Building application${NC}"
npm run build || {
    echo -e "${RED}ERROR: Build failed. Aborting deployment.${NC}"
    exit 1
}

# Verify build output
if [ ! -f "dist/index.html" ]; then
    echo -e "${RED}ERROR: Build succeeded but dist/index.html not found${NC}"
    exit 1
fi

# Create tarball
echo -e "${BLUE}==> Creating deployment tarball${NC}"
cd dist
tar -czf ../dist.tar.gz .
cd ..

# Get tarball size
TARBALL_SIZE=$(du -h dist.tar.gz | cut -f1)
echo -e "${GREEN}✓ Created dist.tar.gz ($TARBALL_SIZE)${NC}"

# Upload tarball
echo -e "${BLUE}==> Uploading to remote server${NC}"
scp -i "$SSH_KEY" dist.tar.gz "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/" || {
    echo -e "${RED}ERROR: Upload failed${NC}"
    exit 1
}

echo -e "${GREEN}✓ Upload complete${NC}"

# Run deployment script on remote server
echo -e "${BLUE}==> Running deployment script on remote server${NC}"
ssh -i "$SSH_KEY" "${REMOTE_USER}@${REMOTE_HOST}" "${REMOTE_PATH}/deploy.sh" || {
    echo -e "${RED}ERROR: Deployment script failed${NC}"
    echo -e "${RED}You may need to SSH in and investigate:${NC}"
    echo -e "${RED}  ssh -i $SSH_KEY ${REMOTE_USER}@${REMOTE_HOST}${NC}"
    exit 1
}

# Clean up local tarball
rm -f dist.tar.gz

echo -e "${GREEN}==> Deployment complete!${NC}"
echo -e "${GREEN}==> Application is now live at http://${REMOTE_HOST}${NC}"
echo -e "${BLUE}==> Login with username: sovra${NC}"
