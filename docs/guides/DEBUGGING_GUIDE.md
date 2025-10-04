# Debugging & Fix Guide

## Issues Found & Solutions

### Issue 1: Demo Account Not Logging In

**Problem**: The demo account (demo@logisync.com) doesn't exist in the database.

**Solution**: Run the demo user creation script.

#### Steps to Fix:

1. **Create the demo user** (Choose ONE method):

   **Method A: Using npm script (Recommended)**
   ```powershell
   cd backend
   npm run seed:demo
   ```

   **Method B: Using Node.js directly**
   ```powershell
   cd backend
   node scripts/create-demo-user.js
   ```

2. **Verify creation**:
   You should see:
   ```
   ✅ Demo user created successfully!
   📧 Email: demo@logisync.com
   🔑 Password: password123
   👤 Name: Demo User
   🎭 Role: admin
   ```

3. **Try logging in again** at `http://localhost:5173/login`

---

### Issue 2: Dashboard API Not Being Called

**Possible Causes**:
1. Token not being stored properly
2. Token not being sent in requests
3. Backend not running
4. CORS issues

#### Debugging Steps:

1. **Open Browser Console** (F12)
   - You should now see detailed logs:
     - `🔐 Storing auth token and user data` (on login)
     - `🌐 API Request: GET /dashboard` (when dashboard loads)
     - `🔑 Token present: true` (if token exists)
     - `📊 Fetching dashboard data...` (dashboard fetch start)
     - `✅ Dashboard data received` (on success)

2. **Check localStorage**:
   - Open DevTools → Application → Local Storage
   - Verify these keys exist:
     - `authToken`: Should contain JWT token
     - `user`: Should contain user object

3. **Check Network Tab** (F12 → Network):
   - Look for request to `/api/dashboard`
   - Check if it has `Authorization: Bearer <token>` header
   - Check response status (should be 200)

4. **Check Backend**:
   - Ensure backend is running on port 5000
   - Check backend console for incoming requests
   - Look for any error messages

#### Common Issues & Fixes:

**A. Token Not Being Sent**
- **Symptoms**: 401 Unauthorized errors
- **Fix**: Check browser console for "🔑 Token present: false"
- **Solution**: Re-login to store fresh token

**B. Backend Not Running**
- **Symptoms**: Network errors, "Failed to fetch"
- **Fix**: 
  ```powershell
  cd backend
  npm start
  ```

**C. CORS Errors**
- **Symptoms**: "Access-Control-Allow-Origin" errors
- **Fix**: Backend already has CORS enabled for `http://localhost:5173`
- **Verify**: Check `backend/src/middleware/cors.js`

**D. Database Connection Issues**
- **Symptoms**: 500 errors from backend
- **Fix**: 
  1. Check PostgreSQL is running
  2. Verify connection in `backend/.env`
  3. Test connection: `npm run migrate`

---

## Testing After Fixes

### 1. Fresh Login Test
```
1. Clear browser localStorage (DevTools → Application → Clear)
2. Go to http://localhost:5173
3. Should redirect to /login
4. Try demo account:
   - Email: demo@logisync.com
   - Password: password123
5. Should redirect to /dashboard
6. Check console for logs
```

### 2. Dashboard API Test
```
1. After logging in successfully
2. Open browser console (F12)
3. You should see:
   📊 Fetching dashboard data...
   🌐 API Request: GET /dashboard
   🔑 Token present: true
   ✅ Authorization header added
   ✅ Dashboard data received: {stats: {...}, ...}
4. Dashboard should display data
```

### 3. Token Persistence Test
```
1. Login successfully
2. Refresh the page (F5)
3. Should stay logged in
4. Should not redirect to login
5. Dashboard data should load again
```

---

## Debug Logs Reference

### On Login Success:
```
🔐 Storing auth token and user data
✅ Token stored: eyJhbGciOiJIUzI1NiI...
```

### On Dashboard Load:
```
📊 Fetching dashboard data...
🌐 API Request: GET /dashboard
🔑 Token present: true
✅ Authorization header added
✅ Dashboard data received: {...}
```

### On API Error:
```
❌ Dashboard fetch error: Error {message: "..."}
```

---

## Removing Debug Logs (After Testing)

Once everything works, you can remove the console.log statements:

**Files with debug logs:**
1. `src/services/api.ts` (lines ~26-28)
2. `src/services/auth.ts` (lines ~49-51)
3. `src/pages/Dashboard.tsx` (lines ~153, 155, 158)

---

## Additional Checks

### Backend Health Check
```powershell
# Test backend is responding
curl http://localhost:5000/api/health
# or in PowerShell:
Invoke-WebRequest http://localhost:5000/api/health
```

### Database Check
```powershell
# Verify demo user exists
cd backend
node -e "import('./src/config/database.js').then(db => db.query('SELECT email FROM users WHERE email = \$1', ['demo@logisync.com']).then(r => console.log(r.rows)))"
```

---

## Quick Fix Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] Demo user created (`npm run seed:demo`)
- [ ] PostgreSQL running
- [ ] Browser console open (F12)
- [ ] Network tab monitoring requests
- [ ] localStorage checked for authToken
- [ ] CORS not showing errors
- [ ] Login successful (no errors)
- [ ] Dashboard API called (check console logs)
- [ ] Dashboard data displayed

---

## Next Steps After Fixing

1. Test all authentication flows
2. Test dashboard data loading
3. Test inventory page
4. Remove debug console.logs
5. Continue with remaining module integration

---

**Created**: October 4, 2025  
**For**: LogiSync Frontend-Backend Integration Debugging
