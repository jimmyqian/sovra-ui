# SOVRA UI - Remote Server Setup Guide (Development Mode)

This guide provides step-by-step instructions for setting up the SOVRA UI web application in development mode on a new remote server.

## Prerequisites

### System Requirements
- Ubuntu 20.04+ / Debian 11+ / CentOS 8+ (or similar Linux distribution)
- At least 2GB RAM
- 10GB available disk space
- Root or sudo access

### Required Software
- Node.js 18.x or higher
- npm 9.x or higher
- Git

## Step 1: Connect to Your Remote Server

```bash
# SSH into your remote server
ssh username@your-server-ip

# Or if using a key file
ssh -i /path/to/key.pem username@your-server-ip
```

## Step 2: Install Node.js and npm

### Option A: Using NodeSource Repository (Recommended)

```bash
# Update package index
sudo apt update

# Install curl if not already installed
sudo apt install -y curl

# Add NodeSource repository for Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x or higher
```

### Option B: Using NVM (Node Version Manager)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node --version
npm --version
```

## Step 3: Install Git

```bash
# Install Git
sudo apt install -y git

# Verify installation
git --version
```

## Step 4: Clone the Repository

```bash
# Navigate to desired directory (e.g., home directory)
cd ~

# Clone the repository
git clone https://github.com/jimmyqian/sovra-ui.git

# Navigate into the project directory
cd sovra-ui

# Checkout the flow2 branch (or main branch as needed)
git checkout flow2
```

## Step 5: Install Dependencies

```bash
# Install all npm dependencies
npm install

# This will install all packages listed in package.json
# May take 2-5 minutes depending on server speed
```

## Step 6: Configure Firewall (if applicable)

```bash
# Allow port 5173 (Vite dev server default port)
sudo ufw allow 5173/tcp

# Allow port 5174 if running secondary dev server
sudo ufw allow 5174/tcp

# Reload firewall
sudo ufw reload
```

## Step 7: Start the Development Server

### Option A: Run with Host Binding (Access from External IP)

```bash
# Run dev server accessible from external IPs
npm run dev -- --host

# Server will be accessible at:
# - http://localhost:5173 (from server)
# - http://your-server-ip:5173 (from external)
# - http://0.0.0.0:5173 (all interfaces)
```

### Option B: Run Standard Dev Server (Localhost Only)

```bash
# Run dev server (localhost only)
npm run dev

# Only accessible at http://localhost:5173
# Requires SSH tunnel for external access
```

### Option C: Run as Background Process (Persistent)

```bash
# Install PM2 process manager
sudo npm install -g pm2

# Start app with PM2
pm2 start npm --name "sovra-ui" -- run dev -- --host

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup

# View logs
pm2 logs sovra-ui

# Other useful PM2 commands:
pm2 stop sovra-ui      # Stop the app
pm2 restart sovra-ui   # Restart the app
pm2 delete sovra-ui    # Remove from PM2
pm2 list               # List all apps
```

## Step 8: Access the Application

### Direct Access (if using --host flag)
```
http://your-server-ip:5173
```

### SSH Tunnel Access (if not using --host)
```bash
# From your local machine, create SSH tunnel
ssh -L 5173:localhost:5173 username@your-server-ip

# Then access at:
http://localhost:5173
```

## Step 9: Verify Installation

Once the server is running, verify the following:

1. **Application loads**: Visit the URL and confirm the landing page appears
2. **Search functionality**: Test the search feature
3. **Dashboard views**: Navigate to Robert Schmidt's dashboard (ID: e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b)
4. **Preston's dashboard**: Navigate to Preston's dashboard (ID: preston-cole-whitaker-iii)
5. **Console errors**: Check browser console for any errors

## Optional: Running Tests

```bash
# Run unit and integration tests
npm run test:run

# Run tests in watch mode
npm run test

# Run linter
npm run lint

# Run prettier
npm run format
```

## Troubleshooting

### GLIBC Version Error (node: version `GLIBC_2.28' not found)

This error means your system's GLIBC library is older than required by Node.js 20.x. Common on older Debian/Ubuntu versions.

**Solution 1: Use Node.js 18.x (Recommended for older systems)**
```bash
# Remove current Node.js
sudo apt remove nodejs -y

# Install Node.js 18.x (requires GLIBC 2.27)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify version
node --version  # Should show v18.x.x
```

**Solution 2: Use NVM (Best compatibility)**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 18 (better compatibility)
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version
```

**Solution 3: Upgrade system (if possible)**
```bash
# Check current OS version
cat /etc/os-release

# For Ubuntu < 20.04 or Debian < 10, consider upgrading
# Ubuntu upgrade:
sudo do-release-upgrade

# Debian upgrade (example 9 -> 10):
# Edit /etc/apt/sources.list and update to newer version
# Then: sudo apt update && sudo apt upgrade
```

**Solution 4: Use precompiled Node.js binaries**
```bash
# Download Node.js 18.x binary
cd ~
wget https://nodejs.org/dist/v18.19.0/node-v18.19.0-linux-x64.tar.xz

# Extract
tar -xf node-v18.19.0-linux-x64.tar.xz

# Move to /opt
sudo mv node-v18.19.0-linux-x64 /opt/nodejs

# Add to PATH
echo 'export PATH=/opt/nodejs/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Verify
node --version
npm --version
```

### Port Already in Use
```bash
# Check what's using port 5173
sudo lsof -i :5173

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or use a different port
npm run dev -- --port 3000 --host
```

### Permission Errors
```bash
# Fix npm permissions
sudo chown -R $USER:$(id -gn $USER) ~/.npm
sudo chown -R $USER:$(id -gn $USER) ~/.config

# Clear npm cache
npm cache clean --force
```

### Module Not Found Errors
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Out of Memory
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev -- --host
```

### Connection Refused from External IP
```bash
# Ensure firewall allows the port
sudo ufw status
sudo ufw allow 5173/tcp

# Verify server is listening on all interfaces
netstat -tuln | grep 5173

# Should show 0.0.0.0:5173, not 127.0.0.1:5173
```

## Environment Variables (Optional)

If the app requires environment variables, create a `.env` file:

```bash
# Create .env file in project root
nano .env

# Add any required variables (example):
VITE_API_URL=http://your-api-server.com
VITE_APP_NAME=SOVRA UI
```

## Security Considerations for Production

⚠️ **Important**: This setup is for **development only**. For production deployment:

1. Use `npm run build` to create optimized production build
2. Serve static files with Nginx or Apache
3. Use HTTPS/SSL certificates
4. Configure proper CORS settings
5. Set up authentication/authorization
6. Use environment-specific configurations
7. Implement rate limiting and security headers
8. Use a reverse proxy (Nginx/Apache)

## Updating the Application

```bash
# Navigate to project directory
cd ~/sovra-ui

# Pull latest changes
git pull origin flow2

# Install any new dependencies
npm install

# Restart the server
# If using PM2:
pm2 restart sovra-ui

# If running manually, stop (Ctrl+C) and restart:
npm run dev -- --host
```

## Useful Commands Reference

```bash
# Project commands
npm run dev              # Start dev server
npm run dev -- --host    # Start dev server (external access)
npm run build            # Build for production
npm run preview          # Preview production build
npm run test:run         # Run all tests once
npm run test             # Run tests in watch mode
npm run lint             # Run ESLint
npm run format           # Run Prettier

# Git commands
git status               # Check current status
git pull origin flow2    # Pull latest changes
git log --oneline -10    # View last 10 commits

# System monitoring
htop                     # Monitor system resources
pm2 monit               # Monitor PM2 processes
tail -f ~/.pm2/logs/*   # Follow PM2 logs
```

## Support

For issues or questions:
- Check the project README: `/sovra-ui/README.md`
- Review existing issues: https://github.com/jimmyqian/sovra-ui/issues
- Check project documentation in `/sovra-ui/CLAUDE_PROJECT_INFO.md`

## Quick Setup Script

For convenience, here's a complete setup script:

```bash
#!/bin/bash
# SOVRA UI Quick Setup Script

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# Clone repository
cd ~
git clone https://github.com/jimmyqian/sovra-ui.git
cd sovra-ui
git checkout flow2

# Install dependencies
npm install

# Install PM2
sudo npm install -g pm2

# Configure firewall
sudo ufw allow 5173/tcp
sudo ufw reload

# Start application
pm2 start npm --name "sovra-ui" -- run dev -- --host
pm2 save
pm2 startup

echo "Setup complete! Access the app at http://$(curl -s ifconfig.me):5173"
```

Save this as `setup.sh`, make it executable with `chmod +x setup.sh`, and run with `./setup.sh`.
