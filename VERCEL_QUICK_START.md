# ⚡ Quick Vercel Dashboard Settings

## For the screen you're currently on:

### **Backend Deployment Settings:**

```
Framework Preset: Other
Root Directory: backend
Build Command: (leave empty)
Output Directory: (leave empty) 
Install Command: npm install (or leave default)
```

### **Environment Variables to Add:**

**Minimal (Just to get started):**
```
NODE_ENV = production
```

**That's it!** The backend will use SQLite automatically.

---

### **Optional - Add Later:**

If you want to use PostgreSQL instead of SQLite, add these:

```
DB_HOST = your-database-host
DB_PORT = 5432
DB_NAME = logisync
DB_USER = your-db-username
DB_PASSWORD = your-db-password
JWT_SECRET = (generate with: openssl rand -base64 32)
JWT_REFRESH_SECRET = (generate with: openssl rand -base64 32)
```

---

## 🎯 What You Should Do Now:

1. **Remove** `DB_PORT` environment variable (you have it set to 5432)
   - Click the minus button next to it
   - We don't need it for SQLite mode

2. **Keep** `NODE_ENV = production`

3. **Click "Deploy"** button at the bottom

4. **Wait for deployment** to complete

5. **Copy the deployment URL** (will be like `https://logisync-backend-xxx.vercel.app`)

6. **Then deploy frontend** using that URL

---

## 📋 After Backend Deploys:

### **Frontend Deployment Settings:**

```
Framework Preset: Vite
Root Directory: . (leave as root)
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### **Frontend Environment Variables:**

```
VITE_API_BASE_URL = https://your-backend-url.vercel.app/api
```

(Replace with your actual backend URL from step 5 above)

---

## ✅ Summary:

- **Backend**: Minimal setup, just `NODE_ENV=production`
- **Frontend**: Needs backend URL in `VITE_API_BASE_URL`
- **Database**: SQLite (automatic, no setup)
- **Upgrade Later**: Add DB credentials to switch to PostgreSQL

---

**You're almost there! Just click Deploy! 🚀**
