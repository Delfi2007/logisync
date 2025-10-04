# LogiSync Backend Setup Guide

Welcome to LogiSync Backend! This guide will help you set up the backend server and database.

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** v18+ installed ([Download](https://nodejs.org/))
- **PostgreSQL** v14+ installed ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** package manager
- **Git** (optional, for cloning)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install all required packages:
- express (web framework)
- pg (PostgreSQL client)
- bcrypt (password hashing)
- jsonwebtoken (JWT auth)
- cors, helmet, morgan (middleware)
- dotenv (environment variables)
- express-validator (request validation)

### 2. Set Up PostgreSQL Database

#### Option A: Using Local PostgreSQL

1. **Start PostgreSQL service:**

```bash
# Windows (PowerShell as Administrator)
Start-Service postgresql-x64-14

# macOS/Linux
sudo systemctl start postgresql
# or
sudo service postgresql start
```

2. **Create database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql shell, create database:
CREATE DATABASE logisync_dev;

# Exit psql
\q
```

#### Option B: Using Docker

```bash
docker run --name logisync-postgres \
  -e POSTGRES_DB=logisync_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:14
```

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values
```

**Update `.env` file:**

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=logisync_dev
DB_USER=postgres
DB_PASSWORD=your_actual_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Bcrypt Configuration
BCRYPT_ROUNDS=10
```

⚠️ **Important:** Change `JWT_SECRET` to a strong, unique value in production!

### 4. Run Database Migrations

```bash
npm run migrate
```

This will:
- Create all database tables (users, products, customers, orders, warehouses)
- Set up indexes and constraints
- Create triggers for automation
- Seed sample data
- Create useful views

**Default test accounts created:**
- **Admin:** `admin@logisync.com` / `Admin@123`
- **User:** `test@logisync.com` / `Test@123`

### 5. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:

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

### 6. Test the API

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "full_name": "New User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@logisync.com",
    "password": "Test@123"
  }'
```

Save the `token` from the response!

**Get current user (protected route):**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js         # PostgreSQL connection
│   │   └── constants.js        # App constants
│   │
│   ├── controllers/
│   │   └── authController.js   # Auth business logic
│   │
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   ├── errorHandler.js     # Global error handling
│   │   └── validator.js        # Request validation
│   │
│   ├── routes/
│   │   └── auth.js             # Auth endpoints
│   │
│   ├── utils/
│   │   ├── jwt.js              # Token generation
│   │   ├── password.js         # Bcrypt helpers
│   │   └── distance.js         # Distance calculator
│   │
│   └── server.js               # Express app
│
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_products.sql
│   ├── 003_create_customers.sql
│   ├── 004_create_warehouses.sql
│   ├── 005_create_orders.sql
│   ├── 006_seed_data.sql
│   └── run-migrations.js       # Migration runner
│
├── .env.example                # Environment template
├── .gitignore
└── package.json
```

---

## 🔐 Authentication Flow

### 1. Registration
```
POST /api/auth/register
Body: { email, password, full_name }
Response: { token, user }
```

### 2. Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

### 3. Protected Requests
```
GET /api/auth/me
Header: Authorization: Bearer <token>
Response: { user }
```

### 4. Logout (Client-Side)
```
POST /api/auth/logout
Header: Authorization: Bearer <token>
Action: Remove token from localStorage
```

---

## 🗄️ Database Schema

### Key Tables

**users**
- Authentication and user profiles
- Columns: id, email, password_hash, full_name, role

**products**
- Product catalog with inventory
- Columns: id, user_id, name, sku, price, stock, etc.

**customers**
- Customer management
- Columns: id, user_id, name, email, phone, segment

**customer_addresses**
- Multiple addresses per customer
- Columns: id, customer_id, type, street, city, pincode

**warehouses**
- Warehouse locations
- Columns: id, user_id, name, code, capacity, occupied

**orders**
- Order management
- Columns: id, user_id, customer_id, order_number, status

**order_items**
- Order line items
- Columns: id, order_id, product_id, quantity, price

**stock_movements**
- Inventory audit trail
- Columns: id, product_id, warehouse_id, type, quantity

---

## 🧪 Testing

### Manual Testing

Use **Postman**, **Insomnia**, or **cURL** to test endpoints.

**Postman Collection** (Coming soon)

### Database Queries

```bash
# Connect to database
psql -U postgres -d logisync_dev

# List tables
\dt

# View users
SELECT * FROM users;

# View products
SELECT * FROM products LIMIT 10;

# Check low stock
SELECT * FROM low_stock_products;

# View warehouse utilization
SELECT * FROM warehouse_utilization;
```

---

## 🐛 Troubleshooting

### Issue: "Connection refused" to PostgreSQL

**Solution:**
1. Check if PostgreSQL is running:
   ```bash
   # Windows
   Get-Service postgresql*
   
   # macOS/Linux
   sudo systemctl status postgresql
   ```

2. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

3. Check credentials in `.env` file

### Issue: "relation does not exist"

**Solution:**
Run migrations:
```bash
npm run migrate
```

### Issue: "JWT secret not set"

**Solution:**
Update `.env` file with a strong JWT_SECRET value.

### Issue: Port 5000 already in use

**Solution:**
Either:
1. Change PORT in `.env` file
2. Kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :5000
   kill -9 <PID>
   ```

### Issue: Password validation fails

**Solution:**
Password must meet requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*...)

---

## 📝 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | PostgreSQL host | localhost | Yes |
| `DB_PORT` | PostgreSQL port | 5432 | Yes |
| `DB_NAME` | Database name | logisync_dev | Yes |
| `DB_USER` | Database user | postgres | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `JWT_SECRET` | Secret for JWT signing | - | Yes |
| `JWT_EXPIRES_IN` | Token expiration | 7d | No |
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `CORS_ORIGIN` | Allowed origin | http://localhost:5173 | No |
| `BCRYPT_ROUNDS` | Password hash rounds | 10 | No |

---

## 🎯 Next Steps

1. ✅ Backend API running
2. ⏳ Build remaining API endpoints (products, orders, etc.)
3. ⏳ Connect frontend to backend
4. ⏳ Test full-stack integration

**See:** `docs/sessions/SESSION_9_SUMMARY.md` for complete implementation details.

---

## 📞 Need Help?

- Check logs in terminal for error messages
- Review `SESSION_9_SUMMARY.md` for architecture details
- Verify all environment variables are set correctly
- Ensure PostgreSQL is running and accessible

---

**Happy Coding! 🚀**
