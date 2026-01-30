# ✅ Fix for "Network Error" When Creating Warehouse

## 🐛 Problem
When clicking "Create Warehouse", you get: **"Network error - please check your connection"**

## 🔍 Root Cause
The **backend server is not running**, so the frontend cannot connect to the API.

---

## ✅ SOLUTION: Start the Backend Server

### Step 1: Open TWO Separate Terminals

You need to run both **frontend** and **backend** servers simultaneously.

---

### Terminal 1: Start Backend Server

```bash
# Navigate to backend folder
cd d:\logsync\LogiSync\backend

# Install dependencies (if not already done)
npm install

# Start the backend server
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:5000
Connected to PostgreSQL database
```

**⚠️ IMPORTANT:** Keep this terminal window open! The backend must stay running.

---

### Terminal 2: Start Frontend Server

```bash
# Navigate to main LogiSync folder
cd d:\logsync\LogiSync

# Start the frontend (if not already running)
npm run dev
```

**Expected Output:**
```
VITE vX.X.X ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 🧪 Test the Fix

1. ✅ Both servers should now be running:
   - **Backend:** http://localhost:5000
   - **Frontend:** http://localhost:5173

2. Go to your browser: http://localhost:5173/warehouses

3. Click **"+ Add Warehouse"**

4. Fill in the form (as you did before):
   ```
   Warehouse Name: karnataka warehouse
   Warehouse Code: 3047
   Street Address: Semmenchery, Old Mahabalipuram Road
   City: Chennai
   State: Tamil Nadu
   Pincode: 600119
   Latitude: 19.20
   Longitude: 72.60
   Capacity: 110000
   Occupied Space: 4
   Contact Person: MUKESHKUMAR M
   Contact Phone: +91987563883
   Contact Email: mukesh@gmail.com
   Cost per sq ft: 30
   ```

5. Click **"Create Warehouse"**

6. ✅ It should now work without any network error!

---

## 📝 What I Fixed

### 1. Created `.env` File
**Location:** `d:\logsync\LogiSync\.env`

**Content:**
```env
# API Base URL (Backend Server)
VITE_API_BASE_URL=http://localhost:5000/api
```

This tells the frontend where to find the backend API.

---

## 🔍 How to Verify Backend is Running

### Method 1: Check Terminal
Look for this message in the backend terminal:
```
Server running on http://localhost:5000
```

### Method 2: Test API Directly
Open browser and go to:
```
http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2026-01-29T..."
}
```

If you see this, backend is working! ✅

---

## 🐛 Troubleshooting

### Problem 1: Backend won't start

**Error:** `Port 5000 already in use`

**Solution:**
```bash
# Stop any process using port 5000
# On Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Then restart backend:
npm run dev
```

---

### Problem 2: Database connection error

**Error:** `Failed to connect to PostgreSQL`

**Solution:**
1. Make sure PostgreSQL is installed and running
2. Check `backend\.env` file has correct database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=logisync_dev
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```
3. Start PostgreSQL service:
   ```bash
   # On Windows (as Administrator):
   Start-Service postgresql*
   ```

---

### Problem 3: Still getting "Network error"

**Checklist:**
- [ ] Backend server is running (Terminal 1)
- [ ] Frontend server is running (Terminal 2)
- [ ] `.env` file exists in `LogiSync` folder
- [ ] Backend console shows no errors
- [ ] Try hard refresh: Ctrl+F5
- [ ] Check browser console (F12) for detailed errors

---

## 🚀 Quick Start (Both Servers)

For convenience, here's a single script to start both:

### Option A: Two Separate Terminals (Recommended)

**Terminal 1 (Backend):**
```bash
cd d:\logsync\LogiSync\backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd d:\logsync\LogiSync
npm run dev
```

### Option B: Use npm-run-all (Advanced)

If you want to start both from one terminal:

1. Install npm-run-all:
   ```bash
   npm install --save-dev npm-run-all
   ```

2. Add to `package.json` (root):
   ```json
   "scripts": {
     "dev:all": "npm-run-all --parallel dev:frontend dev:backend",
     "dev:frontend": "npm run dev",
     "dev:backend": "cd backend && npm run dev"
   }
   ```

3. Run:
   ```bash
   npm run dev:all
   ```

---

## ✅ Success Checklist

After following the steps above:

- [ ] Backend terminal shows: "Server running on http://localhost:5000"
- [ ] Frontend terminal shows: "Local: http://localhost:5173/"
- [ ] http://localhost:5000/health returns JSON response
- [ ] Can access warehouse page: http://localhost:5173/warehouses
- [ ] "Create Warehouse" button opens modal
- [ ] Submitting form works without "Network error"
- [ ] New warehouse appears in the list

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────┐
│  Browser (http://localhost:5173)        │
│  Frontend (React + Vite)                │
└──────────────┬──────────────────────────┘
               │ API Requests
               │ (VITE_API_BASE_URL)
               ↓
┌─────────────────────────────────────────┐
│  Backend (http://localhost:5000/api)    │
│  Express.js Server                      │
└──────────────┬──────────────────────────┘
               │ SQL Queries
               ↓
┌─────────────────────────────────────────┐
│  PostgreSQL Database                    │
│  (localhost:5432)                       │
└─────────────────────────────────────────┘
```

**All three layers must be running** for the app to work:
1. ✅ Frontend (npm run dev)
2. ✅ Backend (cd backend && npm run dev)
3. ✅ Database (PostgreSQL service)

---

## 🎯 Summary

**The "Network error" occurred because:**
- Backend server was not running
- Frontend couldn't connect to API

**The fix:**
1. ✅ Created `.env` file with API URL
2. ✅ Start backend server: `cd backend && npm run dev`
3. ✅ Start frontend server: `npm run dev`
4. ✅ Keep both running while using the app

---

## 💡 Pro Tips

1. **Always start backend FIRST**, then frontend
2. **Keep both terminals visible** to see errors
3. **Check backend logs** when frontend fails
4. **Use Ctrl+C** to stop servers (then restart if needed)
5. **Hard refresh browser** (Ctrl+F5) after .env changes

---

**Now your warehouse creation should work perfectly!** 🎉

If you still have issues, check the backend terminal for specific error messages and let me know what you see.
