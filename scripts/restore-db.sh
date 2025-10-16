#!/bin/bash

# Database Restore Script for LogiSync
# Usage: ./restore-db.sh <backup-file> [environment]

set -e

BACKUP_FILE=$1
ENVIRONMENT=${2:-production}

if [ -z "$BACKUP_FILE" ]; then
    echo "Error: Backup file not specified"
    echo "Usage: ./restore-db.sh <backup-file> [environment]"
    echo ""
    echo "Available backups:"
    ls -lh ./backups/*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "========================================="
echo "LogiSync Database Restore"
echo "Environment: $ENVIRONMENT"
echo "Backup file: $BACKUP_FILE"
echo "========================================="

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    export $(cat ".env.$ENVIRONMENT" | grep -v '^#' | xargs)
else
    export $(cat ".env" | grep -v '^#' | xargs)
fi

# Warning
echo ""
echo "⚠️  WARNING: This will replace the current database!"
echo "Database: $DB_NAME"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Decompress if needed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo ""
    echo "Decompressing backup..."
    TEMP_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
    RESTORE_FILE="$TEMP_FILE"
else
    RESTORE_FILE="$BACKUP_FILE"
fi

# Create backup of current database first
echo ""
echo "Creating backup of current database before restore..."
CURRENT_BACKUP="./backups/pre_restore_$(date +"%Y%m%d_%H%M%S").sql"
docker-compose exec -T postgres pg_dump -U "$DB_USER" -d "$DB_NAME" > "$CURRENT_BACKUP"
gzip "$CURRENT_BACKUP"
echo "Current database backed up to: ${CURRENT_BACKUP}.gz"

# Drop and recreate database
echo ""
echo "Dropping existing database..."
docker-compose exec -T postgres psql -U "$DB_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;"
docker-compose exec -T postgres psql -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"

# Restore from backup
echo ""
echo "Restoring database from backup..."
docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" < "$RESTORE_FILE"

# Cleanup temp file
if [[ "$BACKUP_FILE" == *.gz ]]; then
    rm "$RESTORE_FILE"
fi

# Restart backend to reconnect to database
echo ""
echo "Restarting backend service..."
docker-compose restart backend

echo ""
echo "========================================="
echo "✅ Database restored successfully!"
echo "Database: $DB_NAME"
echo "From: $BACKUP_FILE"
echo "========================================="
