# 🚀 Vercel Deployment Guide - LogiSync (Simplified)

## ✅ What's Been Done

Your project is now configured with:
- ✅ **SQLite Fallback Database** - No PostgreSQL setup required initially
- ✅ **Vercel Configuration Files** - Both frontend and backend ready
- ✅ **Environment Variable Templates** - Easy configuration
- ✅ **Automatic Database Creation** - SQLite tables created on first run

---

## 📦 Deployment Steps

### **Step 1: Deploy Backend First**

#### Using Vercel Dashboard (Recommended for First Time):

1. **Go to Vercel**: https://vercel.com/new

2. **Import Repository**:
   - Click "Import Git Repository"
   - Connect your GitHub account if not already connected
   - Select: `Delfi2007/log-sync`

3. **Configure Backend Project**:
   ```
   Project Name: logisync-backend
   Framework Preset: Other
   Root Directory: backend
   Build Command: (leave empty)
   Output Directory: (leave empty)
   Install Command: npm install
   ```

4. **Environment Variables** (Add these in the dashboard):
   
   **Required (Minimal Setup):**
   ```
   NODE_ENV=production
   ```

   **Optional (Add later when you want PostgreSQL):**
   ```
   DB_HOST=your-postgres-host
   DB_PORT=5432
   DB_NAME=logisync
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   JWT_SECRET=your-jwt-secret-here
   JWT_REFRESH_SECRET=your-refresh-secret-here
   ```

   > **Note**: Without DB credentials, the backend will automatically use SQLite!

5. **Click "Deploy"**

6. **Save Your Backend URL**: 
   - After deployment, you'll get a URL like: `https://logisync-backend.vercel.app`
   - **Copy this URL** - you'll need it for frontend deployment

---

### **Step 2: Deploy Frontend**

#### Using Vercel Dashboard:

1. **Go to Vercel**: https://vercel.com/new

2. **Import Same Repository Again**:
   - Click "Import Git Repository"
   - Select: `Delfi2007/log-sync` (same repo)

3. **Configure Frontend Project**:
   ```
   Project Name: logisync-frontend
   Framework Preset: Vite
   Root Directory: . (root - leave as is)
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables** (IMPORTANT):
   ```
   VITE_API_BASE_URL=https://logisync-backend.vercel.app/api
   ```
   
   > Replace `logisync-backend.vercel.app` with YOUR actual backend URL from Step 1

5. **Click "Deploy"**

6. **Your Frontend URL**: 
   - You'll get a URL like: `https://logisync-frontend.vercel.app`

---

### **Step 3: Update Backend CORS**

After frontend deployment, update backend to allow frontend requests:

1. Go to your **Backend Project** in Vercel Dashboard
2. Go to **Settings** → **Environment Variables**
3. Add new variable:
   ```
   CORS_ORIGIN=https://logisync-frontend.vercel.app
   ```
   (Use your actual frontend URL)

4. **Redeploy Backend**:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

---

## 🎉 You're Done!

Your application is now live:
- **Frontend**: https://logisync-frontend.vercel.app
- **Backend**: https://logisync-backend.vercel.app
- **Database**: SQLite (automatic, no setup needed)

---

## 🔄 Alternative: Using Vercel CLI

If you prefer command line:

### Install Vercel CLI:
```bash
npm install -g vercel
```

### Deploy Backend:
```bash
cd backend
vercel login
vercel --prod
```

### Deploy Frontend:
```bash
cd ..
vercel --prod
```

---

## 📊 Database Information

### Current Setup (SQLite):
- ✅ **No external database needed**
- ✅ **Automatic table creation**
- ✅ **Perfect for testing and demos**
- ⚠️ **Data resets on each deployment** (Vercel serverless limitation)

### Upgrade to PostgreSQL Later:

When you're ready for persistent data:

1. **Choose a PostgreSQL provider**:
   - **Vercel Postgres** (easiest): https://vercel.com/docs/storage/vercel-postgres
   - **Neon** (free tier): https://neon.tech
   - **Supabase** (free tier): https://supabase.com
   - **Railway** (free tier): https://railway.app

2. **Add environment variables** to backend:
   ```
   DB_HOST=your-postgres-host
   DB_PORT=5432
   DB_NAME=logisync
   DB_USER=your-username
   DB_PASSWORD=your-password
   ```

3. **Redeploy backend** - it will automatically switch to PostgreSQL!

---

## 🔧 Troubleshooting

### Backend Returns 404:
- Check that `vercel.json` exists in `backend/` folder
- Verify Root Directory is set to `backend` in Vercel dashboard

### Frontend Can't Connect to Backend:
- Verify `VITE_API_BASE_URL` environment variable in frontend
- Check CORS_ORIGIN in backend matches frontend URL
- Make sure both URLs use `https://`

### Database Errors:
- SQLite mode: Check logs for table creation errors
- PostgreSQL mode: Verify all DB_* environment variables are set

### Build Failures:
- Check Node.js version (should be >= 18)
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

---

## 📝 Important Notes

1. **SQLite Limitations on Vercel**:
   - Data is ephemeral (resets on deployment)
   - Good for testing, not for production
   - Upgrade to PostgreSQL for production use

2. **Environment Variables**:
   - Set separately for each project (frontend & backend)
   - Changes require redeployment
   - Never commit `.env` files to Git

3. **Serverless Functions**:
   - 10-second timeout on Hobby plan
   - 50MB max deployment size
   - Stateless (no persistent file storage)

4. **Custom Domains**:
   - Add in Vercel dashboard: Settings → Domains
   - Update CORS_ORIGIN and VITE_API_BASE_URL accordingly

---

## 🎯 Next Steps

1. ✅ Deploy and test your application
2. 📊 Monitor usage in Vercel dashboard
3. 🗄️ Upgrade to PostgreSQL when ready for production
4. 🔒 Add proper JWT secrets (generate with `openssl rand -base64 32`)
5. 📧 Configure email service (SMTP settings)
6. 🌐 Add custom domain (optional)

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Project Issues**: https://github.com/Delfi2007/log-sync/issues

---

**Happy Deploying! 🚀**
