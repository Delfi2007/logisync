# CI/CD Configuration - Setup Instructions

**File:** `.github/workflows/ci-cd.yml`  
**Status:** ✅ Syntactically Correct  
**Issues:** ⚠️ GitHub Secrets Need Configuration

---

## Understanding the "Errors"

The errors you're seeing are **not actual errors** in the YAML file. They are **warnings** from your IDE/editor indicating that:

1. **GitHub Secrets are not defined yet** (expected before first deployment)
2. **GitHub Environments need to be created** (staging, production)

The workflow file is **syntactically correct** and will work once you configure the required secrets.

---

## Required GitHub Secrets

Before deploying, you need to add these secrets in your GitHub repository:

### Step 1: Go to GitHub Repository Settings

1. Open your repository on GitHub
2. Click **Settings** (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

---

### Step 2: Add Required Secrets

**For Docker Hub (Required for image building):**

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DOCKER_USERNAME` | Your Docker Hub username | `mukeshdev` |
| `DOCKER_PASSWORD` | Your Docker Hub password or token | `dckr_pat_xxxxx` |

**For Staging Deployment (Optional):**

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `STAGING_HOST` | Staging server IP or domain | `staging.logisync.com` or `192.168.1.100` |
| `STAGING_USERNAME` | SSH username | `ubuntu` or `root` |
| `STAGING_SSH_KEY` | SSH private key | `-----BEGIN RSA PRIVATE KEY-----...` |

**For Production Deployment (Optional):**

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `PRODUCTION_HOST` | Production server IP or domain | `logisync.com` or `192.168.1.200` |
| `PRODUCTION_USERNAME` | SSH username | `ubuntu` or `root` |
| `PRODUCTION_SSH_KEY` | SSH private key | `-----BEGIN RSA PRIVATE KEY-----...` |

**For Error Tracking (Optional):**

| Secret Name | Description | Where to Get |
|-------------|-------------|--------------|
| `SENTRY_AUTH_TOKEN` | Sentry authentication token | https://sentry.io/settings/account/api/auth-tokens/ |
| `SENTRY_ORG` | Sentry organization slug | Your Sentry org name |

---

## Step 3: Create GitHub Environments

**For environment-specific secrets and protection rules:**

1. Go to repository **Settings**
2. Click **Environments** in left sidebar
3. Click **New environment**
4. Create two environments:
   - **staging** (URL: https://staging.logisync.com)
   - **production** (URL: https://logisync.com)

**Optional: Add Protection Rules**
- Required reviewers before deployment
- Deployment branches (only deploy from main/develop)
- Wait timer before deployment

---

## How to Generate SSH Key

**For STAGING_SSH_KEY and PRODUCTION_SSH_KEY:**

```bash
# 1. Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@logisync.com" -f ~/.ssh/logisync_deploy

# 2. Copy public key to server
ssh-copy-id -i ~/.ssh/logisync_deploy.pub user@your-server.com

# 3. Copy private key content for GitHub secret
cat ~/.ssh/logisync_deploy
# Copy the entire output including BEGIN and END lines
```

---

## Workflow Behavior

### On Pull Request
- ✅ Run backend tests
- ✅ Run frontend tests
- ✅ Run security audit
- ❌ Does NOT build Docker images
- ❌ Does NOT deploy

### On Push to `develop` Branch
- ✅ Run all tests
- ✅ Build Docker images
- ✅ Push images to Docker Hub
- ✅ Deploy to **staging** environment
- ✅ Run database migrations on staging

### On Push to `main` Branch
- ✅ Run all tests
- ✅ Build Docker images
- ✅ Push images to Docker Hub
- ✅ Deploy to **production** environment
- ✅ Run database migrations on production
- ✅ Create Sentry release (if configured)

---

## What Works Without Secrets

**You can still use the workflow without any secrets!**

The following will work on every pull request and push:
- ✅ Backend tests (with PostgreSQL service)
- ✅ Frontend tests
- ✅ Linting and type checking
- ✅ Security audit
- ✅ Code coverage upload (if Codecov configured)

**What requires secrets:**
- ❌ Docker image building and pushing (needs DOCKER_USERNAME, DOCKER_PASSWORD)
- ❌ Deployment to staging/production (needs SSH credentials)
- ❌ Sentry release creation (needs SENTRY tokens)

---

## Modified Workflow (Without Docker Hub)

If you want to skip Docker Hub and only run tests, the workflow is already configured with:

```yaml
if: github.ref == 'refs/heads/main'
```

This means:
- Docker login only happens on `main` branch
- Build jobs will run but won't push images
- Tests will always run regardless of secrets

---

## Quick Start - Minimal Setup

**To get started with just testing (no deployment):**

1. **No secrets needed!** Just push your code
2. Tests will run automatically on every push/PR
3. You'll see results in the **Actions** tab

**To enable Docker Hub deployment:**

1. Add `DOCKER_USERNAME` secret
2. Add `DOCKER_PASSWORD` secret
3. Push to `main` branch
4. Images will be built and pushed

**To enable full deployment:**

1. Add all Docker Hub secrets
2. Add staging/production SSH secrets
3. Create GitHub environments
4. Push to `develop` (staging) or `main` (production)

---

## Testing the Workflow

### Test Locally First

```bash
# 1. Run tests locally
cd backend
npm test

cd ../frontend
npm test

# 2. Build Docker images locally
docker-compose build

# 3. Test deployment locally
docker-compose up -d
```

### Test on GitHub

```bash
# 1. Create a test branch
git checkout -b test-ci-cd

# 2. Make a small change (add comment)
echo "# Test CI/CD" >> README.md

# 3. Commit and push
git add .
git commit -m "Test: CI/CD workflow"
git push origin test-ci-cd

# 4. Create Pull Request
# Go to GitHub and create PR from test-ci-cd to main

# 5. Check Actions tab
# You'll see the workflow running tests
```

---

## Troubleshooting

### "Context access might be invalid" Warnings

**This is NORMAL!** Your IDE is warning you that the secrets don't exist yet in your repository. Once you add them in GitHub Settings, they'll work fine.

**To suppress these warnings:**
- Ignore them (they're just warnings, not errors)
- Or add them to your repository (see steps above)

### Workflow Not Running

**Check:**
1. Workflow file is in `.github/workflows/` directory
2. File has `.yml` or `.yaml` extension
3. Syntax is valid YAML (no tabs, proper indentation)
4. Branch matches trigger (main or develop)

### Tests Failing

**Check:**
1. Tests pass locally: `npm test`
2. Database migrations work: `npm run migrate`
3. Environment variables are set correctly in workflow

### Docker Build Fails

**Check:**
1. Dockerfile exists in backend/ and frontend/
2. Dockerfile syntax is correct
3. Docker secrets are configured correctly

### Deployment Fails

**Check:**
1. SSH key is correct and has no passphrase
2. Server is accessible from GitHub Actions IP
3. Docker and Docker Compose are installed on server
4. Project directory exists on server

---

## Alternative: Disable Docker/Deployment Jobs

If you want to run only tests without Docker building:

**Option 1: Comment out jobs**

```yaml
  # build-docker:
  #   name: Build Docker Images
  #   ...

  # deploy-staging:
  #   ...

  # deploy-production:
  #   ...
```

**Option 2: Add if condition**

```yaml
  build-docker:
    name: Build Docker Images
    if: false  # Temporarily disable
    ...
```

---

## Summary

**Current Status:**
- ✅ Workflow file is syntactically correct
- ✅ Tests will run automatically
- ⚠️ Secrets need to be configured for Docker/deployment
- ⚠️ Environments need to be created for staging/production

**Next Steps:**
1. Push code to GitHub
2. Tests will run automatically ✅
3. Add secrets when ready to deploy
4. Create environments for deployment protection

**The "errors" you see are just warnings. The workflow is ready to use!**

---

**Last Updated:** October 16, 2025  
**Status:** ✅ Ready to Use (with or without secrets)
