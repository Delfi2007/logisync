# Quick Start Guide - Testing LogiSync

## 🚀 How to Run the Application

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ running
- Backend database setup complete

### Step 1: Create Demo User (First Time Only)
```powershell
cd backend
npm run seed:demo
```
This creates the demo account: demo@logisync.com / password123

### Step 2: Start Backend Server
```powershell
cd backend
npm start
```
Backend will run on: `http://localhost:5000`

### Step 3: Install Frontend Dependencies (If Not Done)
```powershell
cd c:\Mukesh\LogiSync
npm install
```

### Step 4: Start Frontend Development Server
```powershell
cd c:\Mukesh\LogiSync
npm run dev
```
Frontend will run on: `http://localhost:5173`

---

## 🔐 Test Credentials

### Demo Account
**Email**: `demo@logisync.com`  
**Password**: `password123`

### Create New Account
Use the Register page to create a new account with:
- Full Name
- Email address
- Password (minimum 8 characters)

---

## 🧪 Testing Checklist

### Authentication Tests
- [ ] **Register**: Create new account at `/register`
- [ ] **Login**: Sign in at `/login`
- [ ] **Invalid Credentials**: Try wrong password
- [ ] **Protected Routes**: Access `/dashboard` without login
- [ ] **Logout**: Click logout button in sidebar

### Dashboard Tests (`/dashboard`)
- [ ] **Stats Cards**: Check if numbers load
- [ ] **Revenue Chart**: Verify 7-day trend displays
- [ ] **Top Products**: Check bar chart renders
- [ ] **Recent Orders**: Verify table with data
- [ ] **Loading State**: Refresh to see spinner
- [ ] **Error Handling**: Turn off backend, see error

### Inventory Tests (`/inventory`)
- [ ] **Product List**: Verify products load in table
- [ ] **Stats Cards**: Check Total Products, Low Stock, etc.
- [ ] **Search**: Type product name in search box
- [ ] **Category Filter**: Select different categories
- [ ] **Pagination**: Navigate between pages
- [ ] **Create Product**: Click "Add Product" button
- [ ] **Edit Product**: Click edit icon on any product
- [ ] **Delete Product**: Click delete icon (with confirmation)
- [ ] **Low Stock Tab**: Switch to "Low Stock Alerts" tab

---

## 🐛 Common Issues & Solutions

### Issue: Frontend won't start
**Solution**: 
```powershell
cd c:\Mukesh\LogiSync
npm install
npm run dev
```

### Issue: Backend connection error
**Solution**: 
1. Verify backend is running on port 5000
2. Check backend console for errors
3. Ensure PostgreSQL is running

### Issue: "Cannot find module 'axios'"
**Solution**:
```powershell
cd c:\Mukesh\LogiSync
npm install
```

### Issue: Redirects to login immediately
**Reason**: Token expired or invalid  
**Solution**: Login again

### Issue: Data not loading
**Check**:
1. Backend server is running
2. Network tab shows API calls
3. Check backend console for errors
4. Verify database has data

---

## 📡 API Endpoints Being Used

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Dashboard
- `GET /api/dashboard` - All dashboard data
- `GET /api/dashboard/stats` - Statistics only
- `GET /api/dashboard/recent-orders` - Recent orders
- `GET /api/dashboard/revenue-chart` - Revenue data
- `GET /api/dashboard/top-products` - Top products

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories` - Categories list
- `GET /api/products/alerts/low-stock` - Low stock alerts

---

## 🔍 Debugging Tips

### Check Browser Console
```
F12 → Console tab
```
Look for:
- API errors
- React errors
- Network failures

### Check Network Tab
```
F12 → Network tab
```
Monitor:
- API requests
- Response status codes
- Response data

### Check Backend Logs
```powershell
# Backend terminal will show:
- Incoming requests
- SQL queries
- Errors
```

---

## 📱 Responsive Testing

Test on different screen sizes:
- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

Use Chrome DevTools:
```
F12 → Toggle device toolbar (Ctrl+Shift+M)
```

---

## ✅ Expected Behaviors

### On First Visit
1. Redirects to `/login`
2. Shows login form
3. Can navigate to `/register`

### After Login
1. Redirects to `/dashboard`
2. Shows dashboard with data
3. Navigation sidebar appears
4. User info in sidebar
5. Logout button visible

### On Logout
1. Confirmation dialog appears
2. Redirects to `/login`
3. Token cleared
4. Cannot access protected routes

---

## 🎯 Success Criteria

✅ **Authentication Works**
- Can register new user
- Can login with credentials
- Protected routes redirect to login
- Logout clears session

✅ **Dashboard Works**
- Stats cards show numbers
- Charts render with data
- Recent orders table populates
- No console errors

✅ **Inventory Works**
- Products list loads
- Search filters results
- Pagination works
- CRUD operations succeed
- Low stock alerts show

✅ **UI/UX Quality**
- Loading states appear
- Errors show with messages
- Responsive on mobile
- No layout breaks
- Smooth navigation

---

## 📞 Support

If you encounter issues:

1. **Check this guide** for common solutions
2. **Review console logs** for error details
3. **Verify backend** is running correctly
4. **Check database** for data
5. **Review documentation** in SESSION_10_COMPLETE_SUMMARY.md

---

## 🎉 Happy Testing!

The application is ready for comprehensive testing. Follow the checklist above and report any issues found.

**Last Updated**: October 4, 2025
