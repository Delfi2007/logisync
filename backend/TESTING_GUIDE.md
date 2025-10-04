# 🚀 LogiSync Backend - Quick Setup & Test Guide

Follow these steps to set up and test the backend API.

---

## ✅ Step 1: Install Backend Dependencies

Open PowerShell in the backend directory and run:

```powershell
cd c:\Mukesh\LogiSync\backend
npm install
```

**Expected output:**
- Installing express, pg, bcrypt, jsonwebtoken, cors, etc.
- Should complete without errors

---

## ✅ Step 2: Set Up PostgreSQL

### Option A: Install PostgreSQL (if not installed)

1. **Download PostgreSQL 14+** from: https://www.postgresql.org/download/windows/
2. **Run installer** and remember your password
3. **Default settings:**
   - Port: 5432
   - Username: postgres
   - Password: (your choice)

### Option B: Use Docker (Alternative)

```powershell
docker run --name logisync-postgres `
  -e POSTGRES_DB=logisync_dev `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -p 5432:5432 `
  -d postgres:14
```

---

## ✅ Step 3: Create Database

### If using local PostgreSQL:

```powershell
# Connect to PostgreSQL (PowerShell)
psql -U postgres

# In psql, create database:
CREATE DATABASE logisync_dev;

# Verify:
\l

# Exit:
\q
```

### If using Docker:

```powershell
docker exec -it logisync-postgres psql -U postgres -c "CREATE DATABASE logisync_dev;"
```

---

## ✅ Step 4: Configure Environment

Create `.env` file from template:

```powershell
cd c:\Mukesh\LogiSync\backend
Copy-Item .env.example .env
```

**Edit `.env` file** (use your actual password):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=logisync_dev
DB_USER=postgres
DB_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE

JWT_SECRET=logisync_super_secret_jwt_key_minimum_32_characters_2025
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=development

CORS_ORIGIN=http://localhost:5173

BCRYPT_ROUNDS=10
```

⚠️ **Important:** Replace `YOUR_ACTUAL_PASSWORD_HERE` with your PostgreSQL password!

---

## ✅ Step 5: Run Database Migrations

This will create all tables and seed test data:

```powershell
cd c:\Mukesh\LogiSync\backend
npm run migrate
```

**Expected output:**
```
🚀 Starting database migrations...

Found 6 migration files:
  - 001_create_users.sql
  - 002_create_products.sql
  - 003_create_customers.sql
  - 004_create_warehouses.sql
  - 005_create_orders.sql
  - 006_seed_data.sql

📄 Running migration: 001_create_users.sql
✅ Migration 001_create_users.sql completed successfully
...
✅ All migrations completed successfully!

🔑 Default credentials:
   Admin: admin@logisync.com / Admin@123
   User:  test@logisync.com / Test@123
```

---

## ✅ Step 6: Start Backend Server

```powershell
cd c:\Mukesh\LogiSync\backend
npm run dev
```

**Expected output:**
```
═══════════════════════════════════════════════════════
  🚀 LogiSync Backend API
═══════════════════════════════════════════════════════
  Environment:  development
  Port:         5000
  URL:          http://localhost:5000
  Health:       http://localhost:5000/health
  Database:     logisync_dev
═══════════════════════════════════════════════════════

✅ Server is ready to accept requests
```

**Leave this terminal running!** The server will auto-reload on code changes.

---

## ✅ Step 7: Test the API

Open a **NEW PowerShell window** for testing.

### Test 1: Health Check

```powershell
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "LogiSync API is running",
  "timestamp": "2025-10-03T...",
  "environment": "development"
}
```

✅ **If you see this, the server is working!**

---

### Test 2: Register New User

```powershell
$body = @{
    email = "john@example.com"
    password = "SecurePass123!"
    full_name = "John Doe"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

**Expected response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 3,
      "email": "john@example.com",
      "full_name": "John Doe",
      "role": "user",
      "created_at": "2025-10-03T..."
    }
  }
}
```

**Copy the token value!** You'll need it for protected routes.

---

### Test 3: Login with Test User

```powershell
$loginBody = @{
    email = "test@logisync.com"
    password = "Test@123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method Post `
  -Body $loginBody `
  -ContentType "application/json"

# Save token for next test
$token = $response.data.token
Write-Host "Token saved: $token"
```

**Expected response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "email": "test@logisync.com",
      "full_name": "Test User",
      "role": "user"
    }
  }
}
```

---

### Test 4: Get Current User (Protected Route)

```powershell
# Use token from previous step
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
  -Method Get `
  -Headers @{ Authorization = "Bearer $token" }
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "email": "test@logisync.com",
      "full_name": "Test User",
      "role": "user"
    }
  }
}
```

✅ **If you see this, JWT authentication is working!**

---

### Test 5: Test Invalid Token

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
  -Method Get `
  -Headers @{ Authorization = "Bearer invalid_token_here" }
```

**Expected response:**
```json
{
  "success": false,
  "error": "Invalid token"
}
```

✅ **Error handling is working!**

---

## 🎯 Success Criteria

✅ All tests should pass:
- [x] Health check returns 200
- [x] Can register new user
- [x] Can login with test credentials
- [x] Can access protected route with token
- [x] Invalid token is rejected

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to PostgreSQL"

**Solutions:**
1. Check if PostgreSQL is running:
   ```powershell
   Get-Service postgresql*
   ```
   
2. If stopped, start it:
   ```powershell
   Start-Service postgresql-x64-14
   ```
   
3. Verify connection:
   ```powershell
   psql -U postgres -d logisync_dev -c "SELECT 1"
   ```

---

### Problem: "Port 5000 is already in use"

**Solutions:**
1. Find what's using port 5000:
   ```powershell
   netstat -ano | findstr :5000
   ```
   
2. Kill the process:
   ```powershell
   taskkill /PID <PID_NUMBER> /F
   ```
   
3. Or change port in `.env`:
   ```env
   PORT=5001
   ```

---

### Problem: "relation does not exist"

**Solution:** Run migrations again:
```powershell
npm run migrate
```

---

### Problem: "Password validation failed"

**Solution:** Password must have:
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*...)

Example valid password: `SecurePass123!`

---

### Problem: "User already exists"

**Solution:** Use a different email or login with existing account.

---

## 📊 Verify Database

Check that data was created:

```powershell
psql -U postgres -d logisync_dev

# In psql:
\dt                              # List all tables
SELECT * FROM users;             # View users
SELECT * FROM products LIMIT 5;  # View products
SELECT * FROM low_stock_products;# View low stock
\q                               # Exit
```

---

## 🎉 Next Steps

Once all tests pass:
1. ✅ Backend API is fully functional
2. ⏳ Build remaining API endpoints (Products, Orders, etc.)
3. ⏳ Integrate frontend with backend
4. ⏳ Test full-stack application

---

## 📝 Quick Reference

**Default Test Accounts:**
- Admin: `admin@logisync.com` / `Admin@123`
- User: `test@logisync.com` / `Test@123`

**API Endpoints:**
- `GET  /health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET  /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)

**Database:**
- Name: `logisync_dev`
- User: `postgres`
- Port: `5432`

---

## 💡 Tips

1. **Keep backend server running** in one terminal
2. **Use another terminal** for testing
3. **Check backend logs** if something fails
4. **Save your JWT token** when testing protected routes
5. **Use Postman** for easier API testing (optional)

---

**Ready to test? Start with Step 1!** 🚀
