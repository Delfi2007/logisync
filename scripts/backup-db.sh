#!/bin/bash

# Database Backup Script for LogiSync
# Usage: ./backup-db.sh [environment]

set -e

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
BACKUP_FILE="$BACKUP_DIR/logisync_${ENVIRONMENT}_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "========================================="
echo "LogiSync Database Backup"
echo "Environment: $ENVIRONMENT"
echo "Timestamp: $TIMESTAMP"
echo "========================================="

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    export $(cat ".env.$ENVIRONMENT" | grep -v '^#' | xargs)
else
    export $(cat ".env" | grep -v '^#' | xargs)
fi

echo ""
echo "Backing up database: $DB_NAME"
echo "Backup file: $BACKUP_FILE"

# Create backup using Docker
docker-compose exec -T postgres pg_dump -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"

# Compress backup
echo ""
echo "Compressing backup..."
gzip "$BACKUP_FILE"

COMPRESSED_FILE="${BACKUP_FILE}.gz"
FILE_SIZE=$(du -h "$COMPRESSED_FILE" | cut -f1)

echo ""
echo "========================================="
echo "✅ Backup completed successfully!"
echo "File: $COMPRESSED_FILE"
echo "Size: $FILE_SIZE"
echo "========================================="

# Keep only last 7 days of backups
echo ""
echo "Cleaning up old backups (keeping last 7 days)..."
find "$BACKUP_DIR" -name "logisync_${ENVIRONMENT}_*.sql.gz" -mtime +7 -delete

# Optional: Upload to cloud storage (uncomment if needed)
# echo "Uploading to cloud storage..."
# aws s3 cp "$COMPRESSED_FILE" s3://your-bucket/backups/

echo ""
echo "Available backups:"
ls -lh "$BACKUP_DIR"/logisync_${ENVIRONMENT}_*.sql.gz
