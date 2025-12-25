#!/bin/bash

# ================================================
#   SCHNUFFELLL.SHOP - AUTO DEPLOYMENT SCRIPT
#   Author: @schnuffelll
#   Version: 2.0
# ================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color
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
    echo "║                  schnuffelll.shop                         ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Logging
log_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if running as root
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
    
    # Install required packages
    apt install -y \
        curl \
        wget \
        git \
        nginx \
        certbot \
        python3-certbot-nginx \
        ufw \
        fail2ban \
        htop
    
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
    ufw --force enable
    
    log_success "Firewall aktif!"
}

# Clone or update repository
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

# Setup environment variables
setup_env() {
    log_info "Setup Environment Variables..."
    
    ENV_FILE="$APP_DIR/.env"
    
    echo -e "${GREEN}[?] Masukkan Domain (contoh: schnuffelll.shop):${NC}"
    read -r DOMAIN_NAME
    
    echo -e "${GREEN}[?] Masukkan email untuk SSL (Let's Encrypt):${NC}"
    read -r SSL_EMAIL
    
    # Generate random secrets
    JWT_SECRET=$(openssl rand -base64 32)
    DB_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')
    
    cat > "$ENV_FILE" << EOF
# ================================================
# Schnuffelll.Shop - Environment Configuration
# Generated: $(date)
# ================================================

# Application
NODE_ENV=production
APP_NAME=Schnuffelll Shop
APP_URL=https://${DOMAIN_NAME}

# Database
DATABASE_URL=postgresql://postgres:${DB_PASS}@db:5432/digital_store?schema=public
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${DB_PASS}
POSTGRES_DB=digital_store

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

# Server
SERVER_PORT=3001
CORS_ORIGIN=https://${DOMAIN_NAME}

# Frontend
NEXT_PUBLIC_API_URL=https://${DOMAIN_NAME}/api
NEXT_PUBLIC_APP_URL=https://${DOMAIN_NAME}

# Payment Gateway (Isi manual setelah deploy)
TRIPAY_API_KEY=
TRIPAY_PRIVATE_KEY=
TRIPAY_MERCHANT_CODE=
TRIPAY_MODE=sandbox
EOF
    
    log_success "Environment file dibuat!"
    log_warning "Jangan lupa isi API key payment gateway di $ENV_FILE"
}

# Build and run Docker
run_docker() {
    log_info "Building & Running Docker Containers..."
    
    cd "$APP_DIR" || exit
    
    # Stop existing containers
    docker-compose down 2>/dev/null
    
    # Build and start
    docker-compose up -d --build
    
    # Wait for containers to start
    log_info "Menunggu containers ready..."
    sleep 10
    
    # Check status
    if docker-compose ps | grep -q "Up"; then
        log_success "Semua containers running!"
        docker-compose ps
    else
        log_error "Ada container yang gagal start!"
        docker-compose logs --tail=50
        exit 1
    fi
}

# Setup Nginx as reverse proxy
setup_nginx() {
    log_info "Mengkonfigurasi Nginx..."
    
    NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"
    
    cat > "$NGINX_CONF" << 'EOF'
# Upstream definitions
upstream frontend {
    server 127.0.0.1:3000;
}

upstream backend {
    server 127.0.0.1:3001;
}

# HTTP -> HTTPS redirect
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

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;
    
    # SSL Configuration (will be updated by Certbot)
    ssl_certificate /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss;
    
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files caching
    location /_next/static {
        proxy_pass http://frontend;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable, max-age=31536000";
    }
}
EOF
    
    # Replace domain placeholder
    sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN_NAME/g" "$NGINX_CONF"
    
    # Enable site
    ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default 2>/dev/null
    
    # Test nginx config
    nginx -t
    
    if [ $? -eq 0 ]; then
        log_success "Nginx config valid!"
    else
        log_error "Nginx config error!"
        exit 1
    fi
}

# Setup SSL with Certbot
setup_ssl() {
    log_info "Menginstall SSL Certificate..."
    
    # Create webroot directory
    mkdir -p /var/www/certbot
    
    # First, start nginx without SSL to allow ACME challenge
    TEMP_CONF="/etc/nginx/sites-available/$APP_NAME-temp"
    cat > "$TEMP_CONF" << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }
}
EOF
    
    ln -sf "$TEMP_CONF" /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/$APP_NAME 2>/dev/null
    systemctl reload nginx
    
    # Get SSL certificate
    certbot certonly --webroot -w /var/www/certbot \
        -d "$DOMAIN_NAME" -d "www.$DOMAIN_NAME" \
        --email "$SSL_EMAIL" \
        --agree-tos --non-interactive
    
    if [ $? -eq 0 ]; then
        log_success "SSL Certificate installed!"
        
        # Enable full nginx config
        rm -f /etc/nginx/sites-enabled/$APP_NAME-temp
        ln -sf "/etc/nginx/sites-available/$APP_NAME" /etc/nginx/sites-enabled/
        rm "$TEMP_CONF"
        systemctl reload nginx
        
        # Setup auto renewal
        echo "0 12 * * * root certbot renew --quiet" >> /etc/crontab
        log_success "SSL auto-renewal configured!"
    else
        log_error "Gagal install SSL!"
        log_warning "Pastikan domain sudah pointing ke IP server ini"
        log_warning "Menggunakan HTTP sementara..."
        
        # Keep temp config but update for production
        rm -f /etc/nginx/sites-enabled/$APP_NAME-temp
        rm "$TEMP_CONF"
        
        # Create HTTP-only config
        cat > "/etc/nginx/sites-available/$APP_NAME" << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;
    
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
        ln -sf "/etc/nginx/sites-available/$APP_NAME" /etc/nginx/sites-enabled/
        systemctl reload nginx
    fi
}

# Final summary
print_summary() {
    echo ""
    echo -e "${GREEN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║           🎉 DEPLOYMENT BERHASIL! 🎉                      ║"
    echo "║                                                           ║"
    echo "╠═══════════════════════════════════════════════════════════╣"
    echo "║                                                           ║"
    echo "║  🌐 Website: https://$DOMAIN_NAME                    ║"
    echo "║  📁 Directory: $APP_DIR                     ║"
    echo "║  📄 Environment: $APP_DIR/.env              ║"
    echo "║                                                           ║"
    echo "╠═══════════════════════════════════════════════════════════╣"
    echo "║  📌 NEXT STEPS:                                           ║"
    echo "║                                                           ║"
    echo "║  1. Edit .env file untuk isi API keys:                    ║"
    echo "║     nano $APP_DIR/.env                      ║"
    echo "║                                                           ║"
    echo "║  2. Restart containers setelah edit .env:                 ║"
    echo "║     cd $APP_DIR && docker-compose restart   ║"
    echo "║                                                           ║"
    echo "║  3. Jalankan database seed:                               ║"
    echo "║     docker-compose exec server npm run db:seed            ║"
    echo "║                                                           ║"
    echo "║  4. Cek logs:                                             ║"
    echo "║     docker-compose logs -f                                ║"
    echo "║                                                           ║"
    echo "╠═══════════════════════════════════════════════════════════╣"
    echo "║  🔐 Default Admin:                                        ║"
    echo "║     Email: admin@digitalstore.com                         ║"
    echo "║     Password: admin123                                    ║"
    echo "║     (Ganti password ini segera!)                          ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Main execution
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
    print_summary
}

# Run
main "$@"
