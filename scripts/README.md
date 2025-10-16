# Deployment Scripts for LogiSync

This directory contains scripts for deploying LogiSync to various environments.

## Scripts

- `deploy.sh` - General deployment script
- `backup-db.sh` - Database backup script
- `restore-db.sh` - Database restore script
- `health-check.sh` - Health check script

## Usage

### Deploy to Production

```bash
./scripts/deploy.sh production
```

### Deploy to Staging

```bash
./scripts/deploy.sh staging
```

### Backup Database

```bash
./scripts/backup-db.sh
```

### Restore Database

```bash
./scripts/restore-db.sh backup-2024-10-16.sql
```

### Health Check

```bash
./scripts/health-check.sh
```

## Requirements

- Docker and Docker Compose installed
- SSH access to deployment servers
- Environment variables configured
