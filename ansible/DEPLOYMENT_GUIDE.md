# Quick Deployment Guide

This guide walks you through deploying Sovra UI to your EC2 server with nginx, basic auth, and production build.

## Current Configuration

- **Server:** 44.247.48.76
- **SSH Key:** ~/.ssh/new-2025.pem
- **Deploy Path:** /var/www/sovra-ui
- **Mode:** HTTP-only (no SSL/domain yet)
- **Build Method:** Local build, then upload

## One-Time Setup

### 1. Install Ansible (if not installed)

```bash
brew install ansible
```

### 2. Review Configuration

Files are already configured for your server:
- `ansible/inventory.yml` - Server connection details
- `ansible/vars.yml` - Basic auth password, paths, etc.

**Important:** Change the `basic_auth_password` in `vars.yml` before running!

### 3. Run Ansible Playbook

```bash
cd ansible
ansible-playbook -i inventory.yml playbook.yml
```

This will:
- Install Node.js, nginx, and dependencies
- Create directory structure at `/var/www/sovra-ui`
- Set up basic authentication
- Configure nginx for HTTP on port 80
- Create deployment script on server

**Duration:** ~5-10 minutes

## Deploying Updates

### Quick Deploy (Recommended)

From project root:

```bash
./ansible/local-deploy.sh
```

This automatically:
1. Runs tests and lint
2. Builds production bundle
3. Uploads to server
4. Deploys and reloads nginx

### Manual Deploy

```bash
# Build locally
npm run build

# Package and upload
cd dist
tar -czf ../dist.tar.gz .
cd ..
scp -i ~/.ssh/new-2025.pem dist.tar.gz ubuntu@44.247.48.76:/var/www/sovra-ui/

# Deploy on server
ssh -i ~/.ssh/new-2025.pem ubuntu@44.247.48.76 "/var/www/sovra-ui/deploy.sh"
```

## Accessing the Application

Once deployed:

1. Open browser to: **http://44.247.48.76**
2. Enter basic auth credentials (from `vars.yml`)
3. Application loads

## Rollback to Previous Release

SSH into server:

```bash
ssh -i ~/.ssh/new-2025.pem ubuntu@44.247.48.76
cd /var/www/sovra-ui/releases
ls -lt  # List releases by date
sudo ln -nfs /var/www/sovra-ui/releases/YYYY-MM-DD-HHMMSS /var/www/sovra-ui/current
sudo systemctl reload nginx
```

## Rollback to Vite Dev Server

If you need to revert completely:

```bash
ssh -i ~/.ssh/new-2025.pem ubuntu@44.247.48.76
sudo systemctl stop nginx
sudo systemctl disable nginx
cd /path/to/your/vite/project
sudo npm run dev -- --host --port 80
```

## Troubleshooting

### Deployment fails with "tests failed"

Skip tests temporarily:

```bash
npm run build
cd dist && tar -czf ../dist.tar.gz . && cd ..
scp -i ~/.ssh/new-2025.pem dist.tar.gz ubuntu@44.247.48.76:/var/www/sovra-ui/
ssh -i ~/.ssh/new-2025.pem ubuntu@44.247.48.76 "/var/www/sovra-ui/deploy.sh"
```

### Application not loading

Check nginx logs:

```bash
ssh -i ~/.ssh/new-2025.pem ubuntu@44.247.48.76
sudo tail -f /var/www/sovra-ui/shared/logs/nginx-error.log
sudo systemctl status nginx
```

### Need to change basic auth password

```bash
ssh -i ~/.ssh/new-2025.pem ubuntu@44.247.48.76
sudo htpasswd /etc/nginx/.htpasswd admin
sudo systemctl reload nginx
```

## Adding SSL Later

When you have a domain name:

1. Update `vars.yml`:
   ```yaml
   domain_name: your-domain.com
   obtain_ssl_cert: true
   ssl_email: your-email@example.com
   ```

2. Point domain A record to 44.247.48.76

3. Re-run playbook:
   ```bash
   cd ansible
   ansible-playbook -i inventory.yml playbook.yml
   ```

This will obtain Let's Encrypt certificate and configure HTTPS.

## Directory Structure on Server

```
/var/www/sovra-ui/
├── current -> releases/2024-10-09-143022  # Symlink to active release
├── releases/
│   ├── 2024-10-09-143022/                 # Each deployment
│   │   └── dist/
│   │       ├── index.html
│   │       └── assets/
│   └── 2024-10-09-120045/                 # Previous deployment
├── shared/
│   └── logs/
│       ├── nginx-access.log
│       └── nginx-error.log
└── deploy.sh                              # Deployment script
```
