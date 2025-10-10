# Ansible Deployment for Sovra UI

This directory contains Ansible playbooks and configuration for setting up a production EC2 instance to host the Sovra UI application with SSL termination and basic authentication.

## Prerequisites

### On Your Local Machine

1. **Install Ansible**

   ```bash
   # macOS
   brew install ansible

   # Ubuntu/Debian
   sudo apt update
   sudo apt install ansible

   # Or via pip
   pip install ansible
   ```

2. **SSH Key for EC2**
   - Download your EC2 key pair (.pem file) from AWS
   - Set proper permissions: `chmod 400 ~/.ssh/your-ec2-key.pem`

### On AWS

1. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t3.small or larger
   - Storage: 20-30 GB gp3
   - Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **Allocate Elastic IP**
   - Associate the Elastic IP with your EC2 instance

3. **Configure DNS**
   - Point your domain's A record to the Elastic IP

## Configuration

### 1. Update Inventory File

Edit `inventory.yml` and replace:

- `YOUR_EC2_IP_ADDRESS` with your EC2 Elastic IP
- `~/.ssh/your-ec2-key.pem` with the path to your EC2 SSH key

```yaml
ansible_host: 1.2.3.4 # Your EC2 IP
ansible_ssh_private_key_file: ~/.ssh/my-ec2-key.pem
```

### 2. Update Variables File

Edit `vars.yml` and configure:

```yaml
# Domain settings
domain_name: your-actual-domain.com
ssl_email: your-email@example.com

# Basic Authentication
basic_auth_username: your_username
basic_auth_password: your_secure_password

# Git repository
git_repo_url: https://github.com/your-org/sovra-ui.git
git_branch: main # or production
```

**IMPORTANT**: Change the `basic_auth_password` to a strong password!

## Running the Playbook

### Test Connection First

```bash
cd ansible
ansible all -i inventory.yml -m ping
```

### Run the Full Setup

```bash
ansible-playbook -i inventory.yml playbook.yml
```

### Run with Verbose Output (for debugging)

```bash
ansible-playbook -i inventory.yml playbook.yml -v
```

### Skip SSL Certificate Generation

If you want to configure SSL manually later:

```bash
ansible-playbook -i inventory.yml playbook.yml --extra-vars "obtain_ssl_cert=false"
```

## What the Playbook Does

1. ✅ Updates system packages
2. ✅ Installs Node.js 20.x
3. ✅ Installs Nginx
4. ✅ Installs Certbot for SSL certificates
5. ✅ Creates application directory structure
6. ✅ Sets up HTTP Basic Authentication
7. ✅ Configures Nginx with SSL termination and SPA routing
8. ✅ Obtains Let's Encrypt SSL certificate
9. ✅ Creates deployment script for future updates
10. ✅ Sets up automatic SSL certificate renewal

## After Setup

### Initial Deployment

This setup uses a **local build and deploy** workflow. You build the application on your local machine and upload the built files to the server.

#### Option 1: Automated Local Deployment (Recommended)

Run the provided deployment script from your project root:

```bash
cd /path/to/sovra-ui
./ansible/local-deploy.sh
```

This script will:

1. Run tests and linting
2. Build the application locally
3. Create a tarball of the dist folder
4. Upload to the remote server
5. Execute the deployment script on the server
6. Clean up temporary files

#### Option 2: Manual Deployment

Build and deploy manually:

```bash
# Build locally
npm run build

# Create tarball
cd dist
tar -czf ../dist.tar.gz .
cd ..

# Upload to server
scp -i ~/.ssh/your-ec2-key.pem dist.tar.gz ubuntu@YOUR_EC2_IP:/var/www/sovra-ui/

# Run deployment script on server
ssh -i ~/.ssh/your-ec2-key.pem ubuntu@YOUR_EC2_IP
cd /var/www/sovra-ui
./deploy.sh
```

### Verify Deployment

Visit `http://your-domain-or-ip` in your browser. You should:

1. Be prompted for basic auth credentials
2. See your application running

**Note:** If you configured SSL, use `https://` instead of `http://`

## File Structure

```
ansible/
├── README.md                    # This file
├── playbook.yml                 # Main Ansible playbook
├── inventory.yml                # Server inventory
├── vars.yml                     # Configuration variables
├── local-deploy.sh              # Local build and deploy script
├── inventory.yml.example        # Example inventory file
├── vars.yml.example             # Example variables file
└── templates/
    ├── nginx.conf.j2            # Nginx configuration template
    └── deploy.sh.j2             # Deployment script template
```

## Rolling Back to Vite Dev Server

If you need to revert to the original Vite dev server setup:

```bash
# SSH into server
ssh -i ~/.ssh/new-2025.pem ubuntu@44.247.48.76

# Stop and disable nginx
sudo systemctl stop nginx
sudo systemctl disable nginx

# Kill any existing node processes
sudo pkill -9 node

# Navigate to your project directory (adjust path as needed)
cd /path/to/your/project

# Restart vite dev server
sudo npm run dev -- --host --port 80
```

To make it permanent again, you can re-enable your original startup method.

## Troubleshooting

### Nginx fails to start

```bash
# SSH into server
sudo nginx -t  # Test configuration
sudo systemctl status nginx
sudo journalctl -u nginx -n 50
```

### SSL certificate issues

```bash
# Check certificate status
sudo certbot certificates

# Manually renew
sudo certbot renew --dry-run
```

### Application not deploying

```bash
# Check deployment script
cat /var/www/sovra-ui/deploy.sh

# Check logs
tail -f /var/www/sovra-ui/shared/logs/nginx-error.log
```

### Permission issues

```bash
# Fix ownership
sudo chown -R ubuntu:ubuntu /var/www/sovra-ui
```

## Adding More Basic Auth Users

```bash
# SSH into server
sudo htpasswd /etc/nginx/.htpasswd newusername

# Reload nginx
sudo systemctl reload nginx
```

## Updating Configuration

If you need to update Nginx config or other settings:

1. Update the template files in `ansible/templates/`
2. Re-run the playbook:
   ```bash
   ansible-playbook -i inventory.yml playbook.yml
   ```

## Security Notes

- The `vars.yml` file contains sensitive passwords. **Do NOT commit it to git**.
- Consider using Ansible Vault to encrypt sensitive variables:
  ```bash
  ansible-vault encrypt vars.yml
  ansible-playbook -i inventory.yml playbook.yml --ask-vault-pass
  ```

## Next Steps

After the initial setup is complete, you can:

1. Set up GitHub Actions for automated deployments
2. Configure monitoring and alerts
3. Set up automated backups
4. Add additional security hardening
