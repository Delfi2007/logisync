# LogiSync Backend API

RESTful API server for LogiSync - Unified Logistics Operating System

## 🚀 Quick Start

**New to the backend?** Follow these guides in order:

1. **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - ⭐ **START HERE!** Step-by-step setup and testing
2. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions and troubleshooting

## 📦 Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL 14+
- **Authentication:** JWT + bcrypt
- **Validation:** express-validator

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/          # Database & constants
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation, errors
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Express app
├── migrations/          # Database migrations
├── TESTING_GUIDE.md     # Testing instructions
├── SETUP_GUIDE.md       # Setup documentation
└── package.json
```

## ⚡ Commands

```bash
# Install dependencies
npm install

# Run migrations (first time setup)
npm run migrate

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Lint code
npm run lint
```

## 🔐 Authentication

All endpoints except `/api/auth/register` and `/api/auth/login` require authentication.

**Header format:**
```
Authorization: Bearer <your_jwt_token>
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Coming Soon
- Products API
- Customers API
- Orders API
- Warehouses API
- Dashboard API

## 🧪 Testing

**Manual testing:**
```powershell
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123","full_name":"Test User"}'
```

See **[TESTING_GUIDE.md](TESTING_GUIDE.md)** for complete testing instructions.

## 🗄️ Database

**Schema includes:**
- users (authentication)
- products (inventory)
- customers (CRM)
- customer_addresses (multi-address)
- warehouses (locations)
- warehouse_amenities (features)
- orders (order management)
- order_items (line items)
- stock_movements (audit trail)

**Sample data:** 20 products, 15 customers, 5 warehouses

## 🔒 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with configurable expiry
- Helmet for security headers
- CORS configured for frontend origin
- Input validation on all endpoints
- SQL injection protection (parameterized queries)

## 🐛 Troubleshooting

See **[TESTING_GUIDE.md](TESTING_GUIDE.md)** troubleshooting section.

**Common issues:**
- PostgreSQL not running → `Start-Service postgresql*`
- Port in use → Change PORT in `.env`
- Connection refused → Check DB credentials in `.env`
- Migration errors → Drop database and recreate

## 📚 Documentation

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Complete testing walkthrough
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup guide
- **[../docs/sessions/SESSION_9_SUMMARY.md](../docs/sessions/SESSION_9_SUMMARY.md)** - Architecture overview

## 🎯 Development Status

- ✅ Backend structure
- ✅ PostgreSQL database
- ✅ Authentication system
- ✅ Error handling
- ⏳ Products API
- ⏳ Customers API
- ⏳ Orders API
- ⏳ Warehouses API
- ⏳ Dashboard API

## 💡 Environment Variables

Required variables (see `.env.example`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=logisync_dev
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
BCRYPT_ROUNDS=10
```

## 🤝 Contributing

1. Follow existing code structure
2. Use async/await for async operations
3. Add error handling
4. Test before committing

---

**Version:** 1.0.0  
**Phase:** Phase 2 - Session 9  
**Status:** Authentication Complete ✅

🚀 **Ready to test? Open [TESTING_GUIDE.md](TESTING_GUIDE.md)!**
