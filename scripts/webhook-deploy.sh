#!/bin/bash

# ================================================
#   SCHNUFFELLL.SHOP - WEBHOOK AUTO-DEPLOY
#   Listens for GitHub webhook and auto-deploys
# ================================================

# Configuration (will be set by install.sh)
WEBHOOK_PORT=${WEBHOOK_PORT:-9000}
WEBHOOK_SECRET=${WEBHOOK_SECRET:-"change-this-secret"}
APP_DIR=${APP_DIR:-"/var/www/digital-store"}
LOG_FILE="/var/log/webhook-deploy.log"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Deploy function
deploy() {
    log "${CYAN}[DEPLOY]${NC} Starting deployment..."
    
    cd "$APP_DIR" || exit 1
    
    # Pull latest code
    log "${CYAN}[GIT]${NC} Pulling latest changes..."
    git fetch origin main
    git reset --hard origin/main
    
    # Rebuild containers
    log "${CYAN}[DOCKER]${NC} Rebuilding containers..."
    docker-compose down
    docker-compose up -d --build
    
    # Run migrations
    log "${CYAN}[DB]${NC} Running migrations..."
    docker-compose exec -T server npx prisma migrate deploy
    
    # Cleanup old images
    log "${CYAN}[CLEANUP]${NC} Removing old Docker images..."
    docker image prune -f
    
    log "${GREEN}[SUCCESS]${NC} Deployment completed!"
}

# Simple HTTP server to receive webhooks
start_webhook_server() {
    log "${GREEN}[WEBHOOK]${NC} Starting webhook server on port $WEBHOOK_PORT..."
    
    while true; do
        # Read HTTP request
        REQUEST=$(nc -l -p "$WEBHOOK_PORT" -q 1)
        
        # Extract headers and body
        HEADER_SECRET=$(echo "$REQUEST" | grep -i "X-Webhook-Secret:" | cut -d: -f2 | tr -d ' \r\n')
        
        # Validate secret
        if [ "$HEADER_SECRET" = "$WEBHOOK_SECRET" ]; then
            log "${GREEN}[WEBHOOK]${NC} Valid webhook received, deploying..."
            deploy &
            echo -e "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"status\":\"deploying\"}"
        else
            log "${RED}[WEBHOOK]${NC} Invalid secret, rejecting..."
            echo -e "HTTP/1.1 403 Forbidden\r\nContent-Type: application/json\r\n\r\n{\"error\":\"forbidden\"}"
        fi
    done
}

# Main
case "$1" in
    start)
        start_webhook_server
        ;;
    deploy)
        deploy
        ;;
    *)
        echo "Usage: $0 {start|deploy}"
        exit 1
        ;;
esac
