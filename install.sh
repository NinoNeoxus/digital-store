#!/bin/bash

# ================================================
#   SCHNUFFELLL.SHOP - AUTO DEPLOYMENT SCRIPT
#   Author: @schnuffelll
#   Version: 2.1 - With Auto-Deploy Webhook
# ================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'
BOLD='\033[1m'

# Banner
print_banner() {
    clear
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║   ███████╗ ██████╗██╗  ██╗███╗   ██╗██╗   ██╗███████╗    ║"
    echo "║   ██╔════╝██╔════╝██║  ██║████╗  ██║██║   ██║██╔════╝    ║"
    echo "║   ███████╗██║     ███████║██╔██╗ ██║██║   ██║█████╗      ║"
    echo "║   ╚════██║██║     ██╔══██║██║╚██╗██║██║   ██║██╔══╝      ║"
    echo "║   ███████║╚██████╗██║  ██║██║ ╚████║╚██████╔╝██║         ║"
    echo "║   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝         ║"
    echo "║                                                           ║"
    echo "║         🚀 DIGITAL STORE AUTO DEPLOYMENT 🚀              ║"
    echo "║              schnuffelll.shop v2.1                        ║"
    echo "║           + GitHub Auto-Deploy Webhook                    ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Logging
log_info() { echo -e "${CYAN}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[!]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }

# Check root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "Script harus dijalankan sebagai root!"
        echo -e "${YELLOW}Jalankan: ${BOLD}sudo bash install.sh${NC}"
        exit 1
    fi
}

# Detect OS
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        VERSION=$VERSION_ID
    else
        log_error "OS tidak terdeteksi!"
        exit 1
    fi
    log_info "Detected OS: $OS $VERSION"
}

# Install dependencies
install_dependencies() {
    log_info "Menginstall dependencies..."
    
    apt update -y
    apt upgrade -y
    
    apt install -y \
        curl \
        wget \
        git \
        nginx \
        certbot \
        python3-certbot-nginx \
        ufw \
        fail2ban \
        htop \
        netcat-openbsd
    
    # Install Docker
    if ! command -v docker &> /dev/null; then
        log_info "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
        systemctl enable docker
        systemctl start docker
    else
        log_success "Docker sudah terinstall"
    fi
    
    # Install Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_info "Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    else
        log_success "Docker Compose sudah terinstall"
    fi
    
    log_success "Dependencies terinstall!"
}

# Setup firewall
setup_firewall() {
    log_info "Mengkonfigurasi Firewall..."
    
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 'Nginx Full'
    ufw allow 9000/tcp  # Webhook port
    ufw --force enable
    
    log_success "Firewall aktif!"
}

# Setup repository
setup_repository() {
    log_info "Setup Repository..."
    
    echo -e "${GREEN}[?] Masukkan URL Repository GitHub (HTTPS):${NC}"
    read -r REPO_URL
    
    echo -e "${GREEN}[?] Masukkan nama folder project:${NC}"
    read -r APP_NAME
    
    APP_DIR="/var/www/$APP_NAME"
    
    if [ -d "$APP_DIR" ]; then
        log_warning "Folder $APP_DIR sudah ada."
        echo -e "${YELLOW}[?] Hapus dan clone ulang? (y/n):${NC}"
        read -r CONFIRM
        if [ "$CONFIRM" = "y" ]; then
            rm -rf "$APP_DIR"
            git clone "$REPO_URL" "$APP_DIR"
        else
            cd "$APP_DIR" || exit
            git pull origin main
        fi
    else
        git clone "$REPO_URL" "$APP_DIR"
    fi
    
    cd "$APP_DIR" || exit
    log_success "Repository ready di $APP_DIR"
}

# Setup environment
setup_env() {
    log_info "Setup Environment Variables..."
    
    ENV_FILE="$APP_DIR/.env"
    
    echo -e "${GREEN}[?] Masukkan Domain (contoh: schnuffelll.shop):${NC}"
    read -r DOMAIN_NAME
    
    echo -e "${GREEN}[?] Masukkan email untuk SSL (Let's Encrypt):${NC}"
    read -r SSL_EMAIL
    
    # Generate secrets
    JWT_SECRET=$(openssl rand -base64 32)
    DB_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')
    WEBHOOK_SECRET=$(openssl rand -hex 32)
    
    cat > "$ENV_FILE" << EOF
# ================================================
# Schnuffelll.Shop - Environment Configuration
# Generated: $(date)
# ================================================

NODE_ENV=production
APP_NAME=Schnuffelll Shop
APP_URL=https://${DOMAIN_NAME}

DATABASE_URL=postgresql://postgres:${DB_PASS}@db:5432/digital_store?schema=public
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${DB_PASS}
POSTGRES_DB=digital_store

JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

SERVER_PORT=3001
CORS_ORIGIN=https://${DOMAIN_NAME}

NEXT_PUBLIC_API_URL=https://${DOMAIN_NAME}/api
NEXT_PUBLIC_UPLOAD_URL=https://${DOMAIN_NAME}/uploads
NEXT_PUBLIC_APP_URL=https://${DOMAIN_NAME}

# Webhook Auto-Deploy
WEBHOOK_SECRET=${WEBHOOK_SECRET}
WEBHOOK_PORT=9000

# Payment Gateway (Isi manual)
TRIPAY_API_KEY=
TRIPAY_PRIVATE_KEY=
TRIPAY_MERCHANT_CODE=
TRIPAY_MODE=sandbox
EOF
    
    log_success "Environment file dibuat!"
    
    # Save webhook secret for later display
    echo "$WEBHOOK_SECRET" > "$APP_DIR/.webhook-secret"
}

# Setup webhook auto-deploy
setup_webhook() {
    log_info "Setting up Webhook Auto-Deploy..."
    
    WEBHOOK_SECRET=$(cat "$APP_DIR/.webhook-secret")
    
    # Make script executable
    chmod +x "$APP_DIR/scripts/webhook-deploy.sh"
    
    # Create systemd service
    cat > /etc/systemd/system/webhook-deploy.service << EOF
[Unit]
Description=GitHub Webhook Auto-Deploy for Schnuffelll.Shop
After=network.target docker.service

[Service]
Type=simple
User=root
Environment=WEBHOOK_PORT=9000
Environment=WEBHOOK_SECRET=${WEBHOOK_SECRET}
Environment=APP_DIR=${APP_DIR}
ExecStart=${APP_DIR}/scripts/webhook-deploy.sh start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    # Enable and start service
    systemctl daemon-reload
    systemctl enable webhook-deploy
    systemctl start webhook-deploy
    
    log_success "Webhook service running on port 9000!"
}

# Run Docker
run_docker() {
    log_info "Building & Running Docker Containers..."
    
    cd "$APP_DIR" || exit
    
    docker-compose down 2>/dev/null
    docker-compose up -d --build
    
    log_info "Menunggu containers ready..."
    sleep 10
    
    if docker-compose ps | grep -q "Up"; then
        log_success "Semua containers running!"
        docker-compose ps
    else
        log_error "Ada container yang gagal start!"
        docker-compose logs --tail=50
        exit 1
    fi
}

# Setup Nginx
setup_nginx() {
    log_info "Mengkonfigurasi Nginx..."
    
    NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"
    
    cat > "$NGINX_CONF" << 'NGINXEOF'
upstream frontend {
    server 127.0.0.1:3000;
}

upstream backend {
    server 127.0.0.1:3001;
}

upstream webhook {
    server 127.0.0.1:9000;
}

server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;
    
    ssl_certificate /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # Webhook endpoint for GitHub
    location /webhook/deploy {
        proxy_pass http://webhook;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Webhook-Secret $http_x_webhook_secret;
    }
    
    # API Backend
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Uploaded files
    location /uploads {
        alias APP_DIR_PLACEHOLDER/uploads;
        expires 30d;
        access_log off;
        add_header Cache-Control "public, immutable";
    }
    
    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF
    
    sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN_NAME/g" "$NGINX_CONF"
    sed -i "s|APP_DIR_PLACEHOLDER|$APP_DIR|g" "$NGINX_CONF"
    
    ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default 2>/dev/null
    
    nginx -t && log_success "Nginx config valid!"
}

# Setup SSL
setup_ssl() {
    log_info "Menginstall SSL Certificate..."
    
    mkdir -p /var/www/certbot
    
    # Temp config for ACME
    TEMP_CONF="/etc/nginx/sites-available/$APP_NAME-temp"
    cat > "$TEMP_CONF" << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
EOF
    
    ln -sf "$TEMP_CONF" /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/$APP_NAME 2>/dev/null
    systemctl reload nginx
    
    certbot certonly --webroot -w /var/www/certbot \
        -d "$DOMAIN_NAME" -d "www.$DOMAIN_NAME" \
        --email "$SSL_EMAIL" \
        --agree-tos --non-interactive
    
    if [ $? -eq 0 ]; then
        log_success "SSL Certificate installed!"
        rm -f /etc/nginx/sites-enabled/$APP_NAME-temp
        ln -sf "/etc/nginx/sites-available/$APP_NAME" /etc/nginx/sites-enabled/
        rm "$TEMP_CONF"
        systemctl reload nginx
        echo "0 12 * * * root certbot renew --quiet" >> /etc/crontab
    else
        log_error "SSL failed! Using HTTP..."
    fi
}

# Print summary
print_summary() {
    WEBHOOK_SECRET=$(cat "$APP_DIR/.webhook-secret")
    
    echo ""
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                                                                ║"
    echo "║              🎉 DEPLOYMENT BERHASIL! 🎉                       ║"
    echo "║                                                                ║"
    echo "╠════════════════════════════════════════════════════════════════╣"
    echo "║                                                                ║"
    echo "║  🌐 Website: https://$DOMAIN_NAME"
    echo "║  📁 Directory: $APP_DIR"
    echo "║                                                                ║"
    echo "╠════════════════════════════════════════════════════════════════╣"
    echo "║  🔄 GITHUB AUTO-DEPLOY SETUP:                                  ║"
    echo "║                                                                ║"
    echo "║  1. Buka GitHub Repo -> Settings -> Secrets and variables     ║"
    echo "║  2. Tambahkan Secrets berikut:                                 ║"
    echo "║                                                                ║"
    echo "║     WEBHOOK_URL = https://$DOMAIN_NAME/webhook/deploy"
    echo "║     WEBHOOK_SECRET = $WEBHOOK_SECRET"
    echo "║                                                                ║"
    echo "║  Sekarang setiap PUSH ke main, web auto update! 🚀            ║"
    echo "║                                                                ║"
    echo "╠════════════════════════════════════════════════════════════════╣"
    echo "║  🔐 Default Admin:                                             ║"
    echo "║     Email: admin@schnuffelll.shop                              ║"
    echo "║     Password: admin123                                         ║"
    echo "║                                                                ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Save secrets to file for reference
    cat > "$APP_DIR/DEPLOY_SECRETS.txt" << EOF
=== GITHUB SECRETS (Add to repo settings) ===

WEBHOOK_URL = https://$DOMAIN_NAME/webhook/deploy
WEBHOOK_SECRET = $WEBHOOK_SECRET

=== VPS SSH (Optional for fallback) ===
VPS_HOST = $(curl -s ifconfig.me)
VPS_USER = root
VPS_SSH_KEY = [Your SSH Private Key]

=== Generated $(date) ===
EOF
    
    log_success "Secrets saved to $APP_DIR/DEPLOY_SECRETS.txt"
}

# Main
main() {
    print_banner
    check_root
    detect_os
    install_dependencies
    setup_firewall
    setup_repository
    setup_env
    run_docker
    setup_nginx
    setup_ssl
    setup_webhook
    print_summary
}

main "$@"
