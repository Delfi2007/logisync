#!/bin/bash

# Health Check Script for LogiSync
# Usage: ./health-check.sh [environment]

set -e

ENVIRONMENT=${1:-production}

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    export $(cat ".env.$ENVIRONMENT" | grep -v '^#' | xargs)
else
    export $(cat ".env" | grep -v '^#' | xargs)
fi

BACKEND_URL="http://localhost:${BACKEND_PORT:-5000}"
FRONTEND_URL="http://localhost:${FRONTEND_PORT:-3000}"

echo "========================================="
echo "LogiSync Health Check"
echo "Environment: $ENVIRONMENT"
echo "========================================="

# Check Backend
echo ""
echo "Checking Backend..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/health" || echo "000")

if [ "$BACKEND_STATUS" -eq 200 ]; then
    echo "✅ Backend: Healthy"
    BACKEND_RESPONSE=$(curl -s "$BACKEND_URL/api/health")
    echo "   Response: $BACKEND_RESPONSE"
else
    echo "❌ Backend: Unhealthy (Status: $BACKEND_STATUS)"
fi

# Check Frontend
echo ""
echo "Checking Frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/health" || echo "000")

if [ "$FRONTEND_STATUS" -eq 200 ]; then
    echo "✅ Frontend: Healthy"
else
    echo "❌ Frontend: Unhealthy (Status: $FRONTEND_STATUS)"
fi

# Check Database
echo ""
echo "Checking Database..."
DB_STATUS=$(docker-compose exec -T postgres pg_isready -U "$DB_USER" -d "$DB_NAME" 2>&1 || echo "failed")

if [[ "$DB_STATUS" == *"accepting connections"* ]]; then
    echo "✅ Database: Healthy"
else
    echo "❌ Database: Unhealthy"
fi

# Check Docker Containers
echo ""
echo "Checking Docker Containers..."
CONTAINERS=$(docker-compose ps --format json | jq -r '.Name + " - " + .State')
echo "$CONTAINERS"

# Summary
echo ""
echo "========================================="
if [ "$BACKEND_STATUS" -eq 200 ] && [ "$FRONTEND_STATUS" -eq 200 ] && [[ "$DB_STATUS" == *"accepting connections"* ]]; then
    echo "✅ All services are healthy!"
    exit 0
else
    echo "❌ Some services are unhealthy!"
    echo ""
    echo "For more details, check logs:"
    echo "  docker-compose logs backend"
    echo "  docker-compose logs frontend"
    echo "  docker-compose logs postgres"
    exit 1
fi
