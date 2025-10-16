#!/bin/bash

# LogiSync Deployment Script
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e

ENVIRONMENT=${1:-staging}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "========================================="
echo "LogiSync Deployment Script"
echo "Environment: $ENVIRONMENT"
echo "========================================="

# Load environment variables
if [ -f "$PROJECT_ROOT/.env.$ENVIRONMENT" ]; then
    echo "Loading environment variables from .env.$ENVIRONMENT"
    export $(cat "$PROJECT_ROOT/.env.$ENVIRONMENT" | xargs)
else
    echo "Warning: .env.$ENVIRONMENT not found, using default .env"
    export $(cat "$PROJECT_ROOT/.env" | xargs)
fi

# Validate environment
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "Error: Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

# Navigate to project root
cd "$PROJECT_ROOT"

echo ""
echo "Step 1: Pulling latest changes..."
git pull origin main

echo ""
echo "Step 2: Building Docker images..."
docker-compose -f docker-compose.yml -f docker-compose.$ENVIRONMENT.yml build

echo ""
echo "Step 3: Stopping existing containers..."
docker-compose -f docker-compose.yml -f docker-compose.$ENVIRONMENT.yml down

echo ""
echo "Step 4: Starting containers..."
docker-compose -f docker-compose.yml -f docker-compose.$ENVIRONMENT.yml up -d

echo ""
echo "Step 5: Waiting for services to be healthy..."
sleep 10

echo ""
echo "Step 6: Running database migrations..."
docker-compose exec -T backend npm run migrate

echo ""
echo "Step 7: Health check..."
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${BACKEND_PORT:-5000}/api/health)
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${FRONTEND_PORT:-3000}/health)

if [ "$BACKEND_HEALTH" -eq 200 ] && [ "$FRONTEND_HEALTH" -eq 200 ]; then
    echo "✅ Deployment successful!"
    echo "Backend: http://localhost:${BACKEND_PORT:-5000}"
    echo "Frontend: http://localhost:${FRONTEND_PORT:-3000}"
else
    echo "❌ Deployment failed! Health check failed."
    echo "Backend health: $BACKEND_HEALTH"
    echo "Frontend health: $FRONTEND_HEALTH"
    echo ""
    echo "Checking logs..."
    docker-compose logs --tail=50
    exit 1
fi

echo ""
echo "Step 8: Cleaning up old images..."
docker image prune -f

echo ""
echo "========================================="
echo "Deployment completed successfully!"
echo "========================================="
