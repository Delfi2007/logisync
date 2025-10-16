# Deployment Documentation

Complete guides for deploying LogiSync to various environments.

## 📁 Contents

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Comprehensive deployment guide (600+ lines)
- **[CI_CD_SETUP.md](./CI_CD_SETUP.md)** - GitHub Actions CI/CD setup
- **[CI_CD_ERROR_RESOLUTION.md](./CI_CD_ERROR_RESOLUTION.md)** - Troubleshooting CI/CD issues

## 🚀 Quick Start Guides

### Deploy to Development
```bash
cd scripts/deployment
./deploy.sh development
```

### Deploy to Staging
```bash
./deploy.sh staging
```

### Deploy to Production
```bash
./deploy.sh production
```

## 🎯 Deployment Options

### 1. Docker Compose (Recommended)
- **Best for**: Development, staging, small production deployments
- **Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Section 5
- **Prerequisites**: Docker, Docker Compose

### 2. CI/CD Pipeline
- **Best for**: Automated deployments, staging/production
- **Guide**: [CI_CD_SETUP.md](./CI_CD_SETUP.md)
- **Prerequisites**: GitHub repository, secrets configured

### 3. Manual Deployment
- **Best for**: Initial setup, troubleshooting
- **Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Section 7

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured (`.env` files)
- [ ] Database migrations ready
- [ ] SSL certificates obtained (production)
- [ ] GitHub secrets configured (CI/CD)
- [ ] Backup strategy in place
- [ ] Monitoring tools set up

## 🛠️ Deployment Scripts

Located in `scripts/deployment/`:

- **deploy.sh** - Main deployment script
- **backup.sh** - Database backup utility
- **restore.sh** - Database restore utility
- **health-check.sh** - Service health monitoring

## 🔐 Security Considerations

### Required GitHub Secrets

For CI/CD pipeline:
```
DOCKER_USERNAME
DOCKER_PASSWORD
SERVER_HOST
SERVER_USER
SSH_PRIVATE_KEY
DATABASE_URL
JWT_SECRET
SENTRY_DSN
SENTRY_AUTH_TOKEN
```

See [CI_CD_SETUP.md](./CI_CD_SETUP.md) for detailed setup instructions.

### Environment Variables

Required for all environments:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing key
- `NODE_ENV` - Environment (development/staging/production)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Section 3 for complete list.

## 🏗️ Architecture

### Development
- Docker Compose with local volumes
- Hot reload enabled
- Debug mode on

### Staging
- Docker Compose on staging server
- Automated deployment via GitHub Actions
- SSL with Let's Encrypt
- Database backups enabled

### Production
- Multi-container Docker setup
- Load balancing ready
- Automated SSL renewal
- Daily backups
- Monitoring with Sentry

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- Backend: `http://your-domain/health`
- Frontend: `http://your-domain/`

### Monitoring Tools
- **Sentry**: Error tracking and performance monitoring
- **Docker**: Container health status
- **Custom Scripts**: `health-check.sh`

## 🔄 Rollback Procedure

If deployment fails:

```bash
# 1. Stop new containers
docker-compose down

# 2. Restore from backup
./restore.sh <backup-date>

# 3. Deploy previous version
git checkout <previous-tag>
./deploy.sh production
```

## 🐛 Troubleshooting

### Common Issues

1. **Container won't start**
   - Check logs: `docker-compose logs -f`
   - Verify environment variables
   - Check disk space

2. **Database connection failed**
   - Verify `DATABASE_URL`
   - Check PostgreSQL container status
   - Review network configuration

3. **CI/CD pipeline fails**
   - See [CI_CD_ERROR_RESOLUTION.md](./CI_CD_ERROR_RESOLUTION.md)
   - Verify all secrets are set
   - Check GitHub Actions logs

## 📚 Related Documentation

- **Development Setup**: [../02-development/](../02-development/)
- **Docker Files**: `../../docker/` and `../../docker-compose.*.yml`
- **Deployment Scripts**: `../../scripts/deployment/`
- **CI/CD Workflows**: `../../.github/workflows/`

## 🎓 Learning Resources

### First Time Deploying?
1. Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) start-to-finish
2. Try development deployment first
3. Set up CI/CD with staging environment
4. Deploy to production after testing

### Experienced Developer?
- Jump to [CI_CD_SETUP.md](./CI_CD_SETUP.md)
- Configure secrets
- Push to main branch
- Monitor deployment

---

**Need Help?** 
- Check [CI_CD_ERROR_RESOLUTION.md](./CI_CD_ERROR_RESOLUTION.md)
- Review [Master Index](../INDEX.md)
- Consult [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) troubleshooting section
