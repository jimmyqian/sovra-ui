# SOVRA UI - Quick Start Guide

## Choose Your Setup Method

### ⚡ Ubuntu 24.04 / Modern Systems (GLIBC 2.28+)

If you're on **Ubuntu 24.04, Ubuntu 22.04, Ubuntu 20.04, Debian 11+**, or any modern Linux:

```bash
cd ~/sovra/sovra-ui
chmod +x setup-ubuntu-24.sh
./setup-ubuntu-24.sh
```

This will:
- Install Node.js 20.x
- Install all dependencies
- Configure firewall for port 80
- Install PM2 process manager

**Start the server:**
```bash
# Option 1: Run directly on port 80 (requires sudo)
sudo npm run dev -- --host --port 80

# Option 2: Run with PM2 (recommended, auto-restart)
sudo pm2 start npm --name sovra-ui -- run dev -- --host --port 80
sudo pm2 save
sudo pm2 startup
```

Access at: `http://YOUR_SERVER_IP`

---

### 🐌 Old Systems (Ubuntu 18.04, Debian 9, GLIBC < 2.28)

If you're on **Ubuntu 18.04, Ubuntu 16.04, Debian 9**, or get GLIBC errors:

```bash
cd ~/sovra/sovra-ui
chmod +x setup-old-system.sh
./setup-old-system.sh
```

This will:
- Install Node.js 16.x (compatible with GLIBC 2.17+)
- Install all dependencies

**Start the server:**
```bash
# Option 1: Run on port 80 (requires sudo)
sudo npm run dev -- --host --port 80

# Option 2: Run on port 3000 (no sudo needed)
npm run dev -- --host --port 3000
```

---

## Post-Installation

### Verify Installation
```bash
node --version   # Should show v20.x.x (new) or v16.x.x (old)
npm --version
cd ~/sovra/sovra-ui
npm run dev -- --host --port 80
```

### Access the Application
- **Local**: http://localhost
- **Remote**: http://YOUR_SERVER_IP
- **Test dashboards**:
  - Robert Schmidt: http://YOUR_SERVER_IP/search/e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b
  - Preston Whitaker: http://YOUR_SERVER_IP/search/preston-cole-whitaker-iii

### PM2 Management Commands
```bash
pm2 list            # List all processes
pm2 logs sovra-ui   # View logs
pm2 restart sovra-ui # Restart app
pm2 stop sovra-ui   # Stop app
pm2 delete sovra-ui # Remove from PM2
```

### Troubleshooting

**GLIBC Error**
```
node: version `GLIBC_2.28' not found
```
→ Use `setup-old-system.sh` instead

**Permission Denied on Port 80**
```
Error: listen EACCES: permission denied 0.0.0.0:80
```
→ Use `sudo` before the command, or use port 3000+

**Port Already in Use**
```bash
# Check what's using port 80
sudo lsof -i :80
# Kill it or use a different port
```

---

## Manual Installation (if scripts fail)

### Ubuntu 24.04 / Modern Systems
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install dependencies
cd ~/sovra/sovra-ui
npm install

# Run on port 80
sudo npm run dev -- --host --port 80
```

### Old Systems (GLIBC < 2.28)
```bash
# Download Node.js 16 binary
cd ~
wget https://nodejs.org/dist/v16.20.2/node-v16.20.2-linux-x64.tar.xz
tar -xf node-v16.20.2-linux-x64.tar.xz
export PATH=~/node-v16.20.2-linux-x64/bin:$PATH
echo 'export PATH=~/node-v16.20.2-linux-x64/bin:$PATH' >> ~/.bashrc

# Install dependencies
cd ~/sovra/sovra-ui
npm install

# Run on port 80
sudo npm run dev -- --host --port 80
```
