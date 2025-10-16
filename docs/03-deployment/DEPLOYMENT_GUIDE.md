# LogiSync Deployment Guide

**Version:** 1.0  
**Last Updated:** October 16, 2025

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Configuration](#environment-configuration)
4. [Docker Deployment](#docker-deployment)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Database Management](#database-management)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Docker:** Version 20.10 or higher
- **Docker Compose:** Version 2.0 or higher
- **Node.js:** Version 18 or higher (for local development)
- **Git:** For version control
- **PostgreSQL Client:** For database management (optional)

### Server Requirements

**Minimum (Development/Staging):**
- 2 CPU cores
- 4GB RAM
- 20GB disk space
- Ubuntu 20.04 LTS or similar

**Recommended (Production):**
- 4 CPU cores
- 8GB RAM
- 50GB SSD
- Ubuntu 22.04 LTS or similar
- SSL certificate

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/logisync.git
cd logisync
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Required Variables:**
```env
# Database
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_jwt_secret_min_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_min_32_characters

# Email
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password
```

### 3. Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Check health
./scripts/health-check.sh
```

### 4. Run Database Migrations

```bash
docker-compose exec backend npm run migrate
```

### 5. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000/api-docs (if configured)

---

## Environment Configuration

### Environment Files

Create separate `.env` files for each environment:

```
.env.development    # Local development
.env.staging        # Staging server
.env.production     # Production server
```

### Key Environment Variables

#### Application Settings
```env
NODE_ENV=production
FRONTEND_PORT=3000
BACKEND_PORT=5000
```

#### Database Configuration
```env
DB_HOST=postgres              # Docker service name
DB_PORT=5432
DB_NAME=logisync
DB_USER=postgres
DB_PASSWORD=strong_password   # CHANGE THIS!
```

#### JWT Configuration
```env
# Generate: openssl rand -base64 32
JWT_SECRET=your_32_char_secret
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

#### Email Configuration

**Gmail:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=LogiSync <noreply@logisync.com>
```

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

#### File Upload
```env
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760          # 10MB in bytes
```

#### CORS Configuration
```env
# Development
CORS_ORIGIN=http://localhost:3000

# Production
CORS_ORIGIN=https://your-domain.com
```

---

## Docker Deployment

### Build Docker Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Start Services

```bash
# Start all services (detached)
docker-compose up -d

# Start with custom compose file
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d

# Start specific service
docker-compose up -d backend
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100
```

### Execute Commands

```bash
# Run migrations
docker-compose exec backend npm run migrate

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d logisync

# Access backend shell
docker-compose exec backend sh
```

---

## CI/CD Pipeline

### GitHub Actions Setup

The project includes a complete CI/CD pipeline in `.github/workflows/ci-cd.yml`.

#### Required Secrets

Add these secrets in GitHub repository settings:

```
DOCKER_USERNAME          # Docker Hub username
DOCKER_PASSWORD          # Docker Hub password
STAGING_HOST             # Staging server IP/domain
STAGING_USERNAME         # SSH username for staging
STAGING_SSH_KEY          # SSH private key for staging
PRODUCTION_HOST          # Production server IP
PRODUCTION_USERNAME      # SSH username for production
PRODUCTION_SSH_KEY       # SSH private key for production
SENTRY_AUTH_TOKEN        # Sentry authentication token (optional)
SENTRY_ORG               # Sentry organization (optional)
```

#### Pipeline Stages

**On Pull Request:**
1. Backend tests
2. Frontend tests
3. Security audit

**On Push to `develop`:**
1. Run tests
2. Build Docker images
3. Deploy to staging

**On Push to `main`:**
1. Run tests
2. Build Docker images
3. Deploy to production
4. Create Sentry release

### Manual Deployment

#### Using Deployment Scripts

```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```

#### Manual Steps

```bash
# 1. SSH to server
ssh user@your-server.com

# 2. Navigate to project
cd /var/www/logisync

# 3. Pull latest changes
git pull origin main

# 4. Update environment
nano .env

# 5. Deploy
docker-compose pull
docker-compose up -d
docker-compose exec backend npm run migrate

# 6. Check health
curl http://localhost:5000/api/health
```

---

## Database Management

### Backup Database

#### Automated Backup Script

```bash
# Backup current database
./scripts/backup-db.sh production

# Backups are stored in ./backups/ directory
```

#### Manual Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres logisync > backup.sql

# Compress backup
gzip backup.sql
```

### Restore Database

#### Automated Restore Script

```bash
# List available backups
ls -lh ./backups/

# Restore from backup
./scripts/restore-db.sh ./backups/logisync_production_20241016.sql.gz production
```

#### Manual Restore

```bash
# 1. Copy backup file to container
docker cp backup.sql logisync-postgres:/tmp/

# 2. Drop and recreate database
docker-compose exec postgres psql -U postgres -c "DROP DATABASE logisync;"
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE logisync;"

# 3. Restore from backup
docker-compose exec postgres psql -U postgres logisync < /tmp/backup.sql

# 4. Restart backend
docker-compose restart backend
```

### Database Migrations

#### Run Migrations

```bash
# Run all pending migrations
docker-compose exec backend npm run migrate

# Run specific migration
docker-compose exec backend npm run migrate:up 001_initial_setup

# Rollback last migration
docker-compose exec backend npm run migrate:down
```

#### Create New Migration

```bash
# Create migration file
npm run migrate:create add_new_table

# Edit migration file
nano database/migrations/XXX_add_new_table.sql

# Run migration
npm run migrate
```

---

## Monitoring and Maintenance

### Health Checks

#### Automated Health Check

```bash
# Run health check script
./scripts/health-check.sh production
```

#### Manual Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend health
curl http://localhost:3000/health

# Database health
docker-compose exec postgres pg_isready -U postgres
```

### Container Management

#### View Running Containers

```bash
# List containers
docker-compose ps

# Container stats (CPU, memory)
docker stats
```

#### Resource Limits

Configured in `docker-compose.production.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
    reservations:
      cpus: '1'
      memory: 1G
```

### Log Management

#### View Logs

```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100 backend

# Search logs
docker-compose logs | grep "ERROR"
```

#### Log Rotation

Configured in `docker-compose.production.yml`:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Database Maintenance

#### Vacuum Database

```bash
docker-compose exec postgres psql -U postgres -d logisync -c "VACUUM ANALYZE;"
```

#### Check Database Size

```bash
docker-compose exec postgres psql -U postgres -d logisync -c "\l+"
```

#### Check Table Sizes

```bash
docker-compose exec postgres psql -U postgres -d logisync -c "
SELECT
  table_name,
  pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS size
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;
"
```

---

## Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check logs
docker-compose logs service_name

# Check container status
docker-compose ps

# Restart service
docker-compose restart service_name

# Recreate container
docker-compose up -d --force-recreate service_name
```

#### 2. Database Connection Error

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Verify connection
docker-compose exec postgres psql -U postgres -d logisync

# Check environment variables
docker-compose exec backend env | grep DB_
```

#### 3. Port Already in Use

```bash
# Find process using port
lsof -i :5000  # On macOS/Linux
netstat -ano | findstr :5000  # On Windows

# Kill process
kill -9 <PID>

# Or use different port in .env
BACKEND_PORT=5001
```

#### 4. Out of Disk Space

```bash
# Check disk usage
df -h

# Remove unused Docker images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused containers
docker container prune
```

#### 5. Migration Errors

```bash
# Check migration status
docker-compose exec backend npm run migrate:status

# Rollback last migration
docker-compose exec backend npm run migrate:down

# Reset database (⚠️ CAUTION)
docker-compose down -v
docker-compose up -d
docker-compose exec backend npm run migrate
```

### Performance Issues

#### Backend Slow

```bash
# Check resource usage
docker stats logisync-backend

# Check logs for errors
docker-compose logs backend | grep -i error

# Increase resource limits in docker-compose.production.yml
```

#### Database Slow

```bash
# Check connections
docker-compose exec postgres psql -U postgres -c "
SELECT count(*) FROM pg_stat_activity WHERE datname = 'logisync';"

# Check slow queries
docker-compose exec postgres psql -U postgres -c "
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;"

# Vacuum and analyze
docker-compose exec postgres psql -U postgres -d logisync -c "VACUUM ANALYZE;"
```

### Security Concerns

#### Update Secrets

```bash
# 1. Generate new secrets
openssl rand -base64 32

# 2. Update .env file
nano .env

# 3. Restart services
docker-compose restart
```

#### Check for Vulnerabilities

```bash
# Scan Docker images
docker scan logisync-backend:latest
docker scan logisync-frontend:latest

# Update dependencies
cd backend && npm audit fix
cd frontend && npm audit fix
```

---

## Additional Resources

### Documentation
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Monitoring Tools
- **Portainer:** Docker container management UI
- **Sentry:** Error tracking
- **Grafana + Prometheus:** Metrics and monitoring
- **Netdata:** Real-time performance monitoring

### Support
- GitHub Issues: https://github.com/your-org/logisync/issues
- Documentation: https://docs.logisync.com
- Email: support@logisync.com

---

**Document Version:** 1.0  
**Last Updated:** October 16, 2025  
**Maintainer:** DevOps Team
