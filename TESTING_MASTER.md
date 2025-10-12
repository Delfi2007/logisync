# 🧪 LogiSync - Master Testing Guide
**Version**: 1.0  
**Last Updated**: October 4, 2025  
**Status**: ✅ Ready for Complete Testing

---

## 📊 Quick Navigation

- [Environment Setup](#-environment-setup)
- [Quick Start (30 min)](#-quick-start-30-minute-testing)
- [Comprehensive Tests](#-comprehensive-testing-all-modules)
- [Test Credentials](#-test-credentials)
- [Issues Fixed](#-issues-fixed)
- [Common Problems](#-troubleshooting)

---

## 🔧 Environment Setup

### Current Status
| Component | Status | URL | Notes |
|-----------|--------|-----|-------|
| **Backend** | ✅ RUNNING | http://localhost:5000 | Node.js + Express + PostgreSQL |
| **Frontend** | ✅ RUNNING | http://localhost:5174 | React + Vite (Port 5173 was in use) |
| **Database** | ✅ CONNECTED | PostgreSQL | logisync_dev |
| **Demo User** | ✅ CREATED | - | demo@logisync.com |

### Start Commands

#### Backend
```powershell
cd c:\Mukesh\LogiSync\backend
npm start
```

#### Frontend
```powershell
cd c:\Mukesh\LogiSync
npm run dev
```

### Health Checks
- Backend: http://localhost:5000/health
- Frontend: http://localhost:5174

---

## 🔐 Test Credentials

### Demo Account (Pre-created)
```
Email: demo@logisync.com
Password: password123
```

### Create New Account
Navigate to `/register` and create a test account with:
- Full Name: Your Name
- Email: youremail@example.com
- Password: Min 8 characters (strength indicator will show)

---

## ⚡ Quick Start (30-Minute Testing)

**Use this for rapid testing of all core features**

### 1️⃣ Authentication (5 min)

**Login Test**
- [ ] Navigate to http://localhost:5174
- [ ] Enter demo credentials
- [ ] Click "Sign In"
- [ ] ✅ Should redirect to `/dashboard`
- [ ] ✅ Token stored in localStorage
- [ ] ✅ User name visible in sidebar

**Invalid Login Test**
- [ ] Try wrong password
- [ ] ✅ Should show error message
- [ ] ✅ Should NOT redirect

**Logout Test**
- [ ] Click red logout button at bottom of sidebar
- [ ] ✅ Confirmation dialog appears
- [ ] Confirm logout
- [ ] ✅ Redirects to `/login`
- [ ] ✅ Cannot access `/dashboard` anymore

---

### 2️⃣ Dashboard (3 min)

- [ ] **Stats Cards**: Verify all 4 cards show numbers
  - Total Products
  - Total Orders
  - Total Customers
  - Total Revenue (₹ format)
- [ ] **Revenue Chart**: 7-day trend displays
- [ ] **Recent Orders**: Table shows recent orders
- [ ] **Loading State**: Refresh page, spinner should appear
- [ ] ✅ No undefined/NaN values

---

### 3️⃣ Inventory Module (5 min)

**View Products**
- [ ] Navigate to `/inventory`
- [ ] ✅ Products load in table
- [ ] ✅ Stats cards show: Total, Low Stock, Out of Stock, Inventory Value

**Search & Filter**
- [ ] Type product name in search
- [ ] ✅ Results filter in real-time
- [ ] Select category filter
- [ ] ✅ Shows only selected category

**CRUD Operations**
- [ ] Click "Add Product"
- [ ] Fill form and save
- [ ] ✅ New product appears in list
- [ ] Click edit icon (pencil)
- [ ] Modify and save
- [ ] ✅ Changes reflected
- [ ] Click red delete icon (trash)
- [ ] ✅ Confirmation dialog
- [ ] Confirm delete
- [ ] ✅ Product removed

---

### 4️⃣ Customers Module (4 min)

**View Customers**
- [ ] Navigate to `/customers`
- [ ] ✅ Customer list loads
- [ ] ✅ Stats: Total, Premium, Regular, New

**Segment Filter**
- [ ] Filter by Premium (dark badge)
- [ ] ✅ Shows only premium customers
- [ ] Filter by Regular (gray badge)
- [ ] Filter by New (light badge)

**Search**
- [ ] Search by name
- [ ] Search by email
- [ ] Search by phone
- [ ] ✅ Real-time filtering works

**Delete**
- [ ] Click red delete button
- [ ] ✅ Confirmation appears
- [ ] Confirm
- [ ] ✅ Customer removed

---

### 5️⃣ Orders Module (5 min)

**View Orders**
- [ ] Navigate to `/orders`
- [ ] ✅ Orders load in table
- [ ] ✅ Stats cards show: Total, Pending, Processing (not "00" ✨), Delivered, Revenue

**Status Badges** (Check neutral grayscale design)
- [ ] ✅ Pending: Light gray
- [ ] ✅ Confirmed: Gray
- [ ] ✅ Processing: Medium gray
- [ ] ✅ Shipped: Dark gray
- [ ] ✅ Delivered: Black
- [ ] ✅ Cancelled: Hollow/white
- [ ] ✅ Returned: Minimal gray

**Dual Filters**
- [ ] Filter by Order Status (pending, delivered, etc.)
- [ ] ✅ Table updates
- [ ] Filter by Payment Status (paid, pending, failed)
- [ ] ✅ Combined filtering works
- [ ] Clear filters
- [ ] ✅ Shows all orders

**Quick Status Update**
- [ ] Hover over status badge
- [ ] ✅ Dropdown appears
- [ ] Select new status
- [ ] ✅ Status updates immediately

**View Details**
- [ ] Click "View" button
- [ ] ✅ Modal shows order details
- [ ] ✅ Order items listed
- [ ] ✅ Customer info visible

**Delete**
- [ ] Click red delete button
- [ ] ✅ Confirmation
- [ ] ✅ Order removed

---

### 6️⃣ Warehouses Module (5 min)

**View Warehouses**
- [ ] Navigate to `/warehouses`
- [ ] ✅ Warehouse list loads
- [ ] ✅ Stats: Total, Active, Capacity, Utilization

**Dual Filters**
- [ ] Filter by Status (active/inactive/maintenance)
- [ ] Filter by Verification (verified/pending/rejected)
- [ ] ✅ Combined filtering works

**Capacity Bars**
- [ ] ✅ Progress bars show utilization
- [ ] ✅ Different colors for different percentages

**View Details**
- [ ] Click "View"
- [ ] ✅ Shows warehouse details
- [ ] ✅ Amenities listed
- [ ] ✅ Map coordinates visible

**Quick Status Update**
- [ ] Hover over status
- [ ] Select new status
- [ ] ✅ Updates immediately

---

### 7️⃣ UI/UX Checks (3 min)

**Visual Consistency**
- [ ] ✅ All pages use minimalist black-and-white theme
- [ ] ✅ Delete buttons are RED across all pages
- [ ] ✅ Logout button is RED in sidebar
- [ ] ✅ No colorful badges (should be neutral gray)
- [ ] ✅ Consistent hover effects

**Responsive Design**
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test mobile view (375px)
- [ ] ✅ Sidebar collapses
- [ ] ✅ Tables are scrollable
- [ ] ✅ Forms stack vertically

**Loading & Error States**
- [ ] Refresh any page
- [ ] ✅ Loading spinner appears
- [ ] Stop backend server
- [ ] Try loading data
- [ ] ✅ Error message appears (gray background, not red)

---

## 🎯 Comprehensive Testing (All Modules)

**Use this for thorough, detailed testing**

---

## 📋 Module 1: Authentication Flow

### Test 1.1: User Registration

**Steps:**
1. Navigate to http://localhost:5174
2. Click "Sign up" or navigate to `/register`
3. Fill registration form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: TestPass123!
   - Confirm Password: TestPass123!
4. Click "Create Account"

**Expected Results:**
- [ ] Password strength indicator shows as you type
- [ ] "Strong" appears for complex passwords
- [ ] Form validates email format
- [ ] Passwords must match
- [ ] Success message appears
- [ ] Auto-redirects to `/dashboard`
- [ ] Token stored in localStorage
- [ ] User name appears in sidebar

**API Endpoint**: `POST /api/auth/register`

**Possible Errors:**
- Email already exists → Should show error
- Weak password → Should show warning
- Network error → Should show error message

---

### Test 1.2: Demo User Login

**Steps:**
1. Logout (if logged in)
2. Navigate to `/login`
3. Enter:
   - Email: demo@logisync.com
   - Password: password123
4. Click "Sign In"

**Expected Results:**
- [ ] Login successful
- [ ] Redirects to `/dashboard`
- [ ] Token stored in localStorage (check DevTools → Application)
- [ ] User info visible in sidebar (demo@logisync.com)
- [ ] Can navigate to all protected routes

**API Endpoint**: `POST /api/auth/login`

---

### Test 1.3: Invalid Credentials

**Steps:**
1. Try login with wrong password
2. Try login with non-existent email

**Expected Results:**
- [ ] Error message: "Invalid credentials"
- [ ] Does NOT redirect
- [ ] No token stored
- [ ] Form fields remain filled (except password)

---

### Test 1.4: Protected Routes

**Steps:**
1. Logout completely
2. Manually navigate to http://localhost:5174/dashboard
3. Try accessing `/inventory`, `/orders`, etc.

**Expected Results:**
- [ ] All protected routes redirect to `/login`
- [ ] After login, redirects back to originally requested page
- [ ] Cannot access protected routes without valid token

---

### Test 1.5: Token Persistence

**Steps:**
1. Login successfully
2. Refresh the page (F5)
3. Close browser tab and reopen
4. Navigate directly to http://localhost:5174/dashboard

**Expected Results:**
- [ ] User remains logged in after refresh
- [ ] Token persists in localStorage
- [ ] User info still displayed
- [ ] No need to login again

---

### Test 1.6: Logout Functionality

**Steps:**
1. Click red logout button at bottom of sidebar
2. Confirm in dialog

**Expected Results:**
- [ ] Confirmation dialog: "Are you sure you want to logout?"
- [ ] After confirm, redirects to `/login`
- [ ] Token removed from localStorage
- [ ] Cannot access protected routes
- [ ] Sidebar user info cleared

---

## 📋 Module 2: Dashboard

### Test 2.1: Dashboard Stats Cards

**Steps:**
1. Login and navigate to `/dashboard`
2. Observe the 4 stats cards at top

**Expected Results:**
- [ ] **Total Products**: Shows count (not undefined)
- [ ] **Total Orders**: Shows count with pending subtitle
- [ ] **Total Customers**: Shows count with new customers subtitle
- [ ] **Total Revenue**: Shows in ₹ format (e.g., "₹1,23,456")
- [ ] All numbers are properly formatted
- [ ] No NaN or undefined values
- [ ] Loading spinner appears before data loads

**API Endpoint**: `GET /api/dashboard/stats`

---

### Test 2.2: Revenue Chart

**Steps:**
1. Scroll to "Revenue Trend (Last 7 Days)" chart
2. Observe the bar chart

**Expected Results:**
- [ ] Chart displays with 7 days of data
- [ ] Bars are visible and properly sized
- [ ] Hover shows tooltip with exact amount
- [ ] Y-axis shows revenue values
- [ ] X-axis shows dates
- [ ] Chart is responsive (resize window)

**API Endpoint**: `GET /api/dashboard/revenue-chart`

---

### Test 2.3: Top Customers List

**Steps:**
1. Scroll to "Top Customers" section
2. Observe the table

**Expected Results:**
- [ ] Shows top customers by order value
- [ ] Displays: Name, Email, Orders, Total Spent
- [ ] Values are properly formatted
- [ ] Shows customer segment badge (Premium/Regular/New)
- [ ] Badges use neutral colors (not colorful)

**API Endpoint**: `GET /api/dashboard` (returns top customers)

---

### Test 2.4: Recent Orders Table

**Steps:**
1. Scroll to "Recent Orders" section
2. Check the orders table

**Expected Results:**
- [ ] Shows recent 5-10 orders
- [ ] Displays: Order Number, Customer, Amount, Status, Date
- [ ] Status badges use neutral grayscale
- [ ] Dates are properly formatted
- [ ] "View All" link navigates to `/orders`

**API Endpoint**: `GET /api/dashboard/recent-orders`

---

### Test 2.5: Dashboard Loading State

**Steps:**
1. Refresh the dashboard page
2. Observe loading behavior

**Expected Results:**
- [ ] Loading spinner appears immediately
- [ ] Stats cards show loading state
- [ ] Charts show loading state
- [ ] Everything loads within 1-2 seconds
- [ ] No layout shift after data loads

---

### Test 2.6: Dashboard Error Handling

**Steps:**
1. Stop the backend server
2. Refresh dashboard
3. Observe error handling

**Expected Results:**
- [ ] Error message appears (gray background)
- [ ] Message: "Failed to load dashboard data"
- [ ] No crash or blank screen
- [ ] Retry button available
- [ ] After restarting backend, retry works

---

## 📋 Module 3: Inventory/Products

### Test 3.1: View Products List

**Steps:**
1. Navigate to `/inventory`
2. Wait for products to load

**Expected Results:**
- [ ] Products table displays with columns:
  - Product name
  - SKU
  - Category
  - Stock
  - Price
  - Status badge
- [ ] Status badges: In Stock (green), Low Stock (yellow), Out of Stock (red)
- [ ] Pagination controls visible
- [ ] Shows total product count

**API Endpoint**: `GET /api/products`

---

### Test 3.2: Product Stats Cards

**Steps:**
1. Check the stats cards at top

**Expected Results:**
- [ ] **Total Products**: Count of all products
- [ ] **Low Stock**: Count of products below threshold
- [ ] **Out of Stock**: Count of products with 0 stock
- [ ] **Inventory Value**: Total value in ₹ format
- [ ] Stats cards use neutral backgrounds

**API Endpoint**: `GET /api/products` (stats calculated from response)

---

### Test 3.3: Search Products

**Steps:**
1. Type product name in search box
2. Type partial name
3. Clear search

**Expected Results:**
- [ ] Results filter in real-time as you type
- [ ] Search is case-insensitive
- [ ] Shows "No products found" if no match
- [ ] Clearing search shows all products again
- [ ] Search persists across pagination

---

### Test 3.4: Category Filter

**Steps:**
1. Click category dropdown
2. Select a category (e.g., "Electronics")
3. Select "All Categories"

**Expected Results:**
- [ ] Dropdown shows all available categories
- [ ] Selecting category filters products
- [ ] Shows only products from that category
- [ ] "All Categories" shows everything
- [ ] Filter works with search

---

### Test 3.5: Pagination

**Steps:**
1. Navigate between pages using pagination controls
2. Change page size (if available)

**Expected Results:**
- [ ] Shows 10 products per page by default
- [ ] "Next" button navigates forward
- [ ] "Previous" button navigates back
- [ ] Page numbers clickable
- [ ] Disabled buttons when on first/last page
- [ ] Total pages calculated correctly

---

### Test 3.6: Create Product

**Steps:**
1. Click "Add Product" button
2. Fill form:
   - Name: Test Product
   - SKU: TEST-001
   - Category: Electronics
   - Price: 999
   - Stock: 50
   - Reorder Level: 10
3. Click "Save"

**Expected Results:**
- [ ] Modal/form opens
- [ ] All fields are validated
- [ ] Success message appears
- [ ] New product appears in list
- [ ] List refreshes automatically
- [ ] Modal closes

**API Endpoint**: `POST /api/products`

---

### Test 3.7: Edit Product

**Steps:**
1. Click edit icon (pencil) on any product
2. Modify fields (e.g., change price)
3. Click "Save"

**Expected Results:**
- [ ] Modal opens with pre-filled data
- [ ] Can modify all fields
- [ ] Validation works
- [ ] Success message appears
- [ ] Changes reflected immediately in list
- [ ] Modal closes

**API Endpoint**: `PUT /api/products/:id`

---

### Test 3.8: Delete Product

**Steps:**
1. Click red delete icon (trash)
2. Confirm in dialog
3. Try canceling deletion

**Expected Results:**
- [ ] Delete button is RED
- [ ] Confirmation dialog appears
- [ ] Dialog shows product name
- [ ] Confirming removes product
- [ ] Success message appears
- [ ] List refreshes
- [ ] Canceling does nothing

**API Endpoint**: `DELETE /api/products/:id`

---

### Test 3.9: Low Stock Alerts

**Steps:**
1. Create/edit product with stock below reorder level
2. Check if alert appears

**Expected Results:**
- [ ] Low stock badge appears (yellow/orange)
- [ ] Alert icon visible
- [ ] Can filter to show only low stock products
- [ ] Stats card updates

**API Endpoint**: `GET /api/products/alerts/low-stock`

---

## 📋 Module 4: Customers

### Test 4.1: View Customers List

**Steps:**
1. Navigate to `/customers`
2. Wait for customers to load

**Expected Results:**
- [ ] Customers table displays with columns:
  - Name
  - Email
  - Phone
  - Segment (Premium/Regular/New)
  - Total Orders
  - Total Spent
  - Actions
- [ ] Segment badges use neutral grayscale:
  - Premium: Dark (neutral-900)
  - Regular: Medium gray (neutral-300)
  - New: Light gray (neutral-100)
- [ ] Pagination works

**API Endpoint**: `GET /api/customers`

---

### Test 4.2: Customer Stats Cards

**Steps:**
1. Check stats cards at top

**Expected Results:**
- [ ] **Total Customers**: Count of all
- [ ] **Premium Customers**: Count with premium segment
- [ ] **Regular Customers**: Count with regular segment
- [ ] **New Customers**: Count with new segment
- [ ] **Total Revenue**: From all customers in ₹ format
- [ ] All use neutral icon backgrounds

---

### Test 4.3: Search Customers

**Steps:**
1. Search by customer name
2. Search by email
3. Search by phone number

**Expected Results:**
- [ ] All three search types work
- [ ] Real-time filtering
- [ ] Case-insensitive
- [ ] Shows "No customers found" if no match
- [ ] Clear search shows all

---

### Test 4.4: Segment Filter

**Steps:**
1. Filter by "Premium"
2. Filter by "Regular"
3. Filter by "New"
4. Select "All Segments"

**Expected Results:**
- [ ] Each filter shows only that segment
- [ ] Badges match filter selected
- [ ] Count updates correctly
- [ ] "All Segments" shows everything
- [ ] Works with search

---

### Test 4.5: View Customer Details

**Steps:**
1. Click "View" button on any customer
2. Check modal/page content

**Expected Results:**
- [ ] Shows complete customer info:
  - Personal details
  - Business name (if any)
  - Addresses
  - Order history
  - Total spent
  - Segment
- [ ] Order history is clickable
- [ ] Close button works

**API Endpoint**: `GET /api/customers/:id`

---

### Test 4.6: Create Customer

**Steps:**
1. Click "Add Customer"
2. Fill form:
   - Name: Test Customer
   - Email: customer@test.com
   - Phone: 9876543210
   - Segment: Regular
3. Click "Save"

**Expected Results:**
- [ ] Form opens
- [ ] Email format validated
- [ ] Phone format validated
- [ ] Success message
- [ ] New customer in list
- [ ] Form closes

**API Endpoint**: `POST /api/customers`

---

### Test 4.7: Edit Customer

**Steps:**
1. Click edit icon
2. Modify fields
3. Save changes

**Expected Results:**
- [ ] Form pre-filled with data
- [ ] Can change segment
- [ ] Validation works
- [ ] Changes save successfully
- [ ] List updates

**API Endpoint**: `PUT /api/customers/:id`

---

### Test 4.8: Delete Customer

**Steps:**
1. Click red delete button
2. Confirm deletion

**Expected Results:**
- [ ] Delete button is RED
- [ ] Confirmation shows customer name
- [ ] Confirming removes customer
- [ ] Warning if customer has orders
- [ ] Success message
- [ ] List refreshes

**API Endpoint**: `DELETE /api/customers/:id`

---

## 📋 Module 5: Orders

### Test 5.1: View Orders List

**Steps:**
1. Navigate to `/orders`
2. Wait for orders to load

**Expected Results:**
- [ ] Orders table with columns:
  - Order Number
  - Customer Name
  - Items Count
  - Total Amount
  - Order Status
  - Payment Status
  - Date
  - Actions
- [ ] Order status badges use neutral grayscale
- [ ] Payment status badges neutral
- [ ] Pagination works

**API Endpoint**: `GET /api/orders`

---

### Test 5.2: Order Stats Cards

**Steps:**
1. Check stats cards

**Expected Results:**
- [ ] **Total Orders**: Count
- [ ] **Pending**: Pending orders count
- [ ] **Processing**: Confirmed + Processing count (NOT "00" ✨)
- [ ] **Delivered**: Delivered count
- [ ] **Total Revenue**: ₹ format
- [ ] All cards use neutral backgrounds

---

### Test 5.3: Order Status Filter

**Steps:**
1. Filter by each status:
   - Pending
   - Confirmed
   - Processing
   - Shipped
   - Delivered
   - Cancelled
   - Returned

**Expected Results:**
- [ ] Each filter shows only that status
- [ ] Badge colors match (neutral grayscale)
- [ ] Count updates
- [ ] "All Status" shows everything

---

### Test 5.4: Payment Status Filter

**Steps:**
1. Filter by:
   - Paid
   - Pending
   - Failed
   - Refunded

**Expected Results:**
- [ ] Shows only selected payment status
- [ ] Works independently of order status
- [ ] Correct badge colors (neutral)

---

### Test 5.5: Dual Filters (Combined)

**Steps:**
1. Select Order Status = "Delivered"
2. Select Payment Status = "Paid"
3. Try other combinations

**Expected Results:**
- [ ] Both filters apply simultaneously
- [ ] Shows orders matching BOTH criteria
- [ ] Clearing one filter keeps the other
- [ ] Clearing both shows all orders

---

### Test 5.6: Search Orders

**Steps:**
1. Search by order number
2. Search by customer name
3. Search by customer email

**Expected Results:**
- [ ] All search types work
- [ ] Real-time filtering
- [ ] Works with filters
- [ ] Case-insensitive

---

### Test 5.7: Quick Status Update

**Steps:**
1. Hover over order status badge
2. Click to show dropdown
3. Select new status

**Expected Results:**
- [ ] Dropdown appears on hover/click
- [ ] Shows all valid next statuses
- [ ] Selecting updates immediately
- [ ] Success message appears
- [ ] Badge updates visually
- [ ] No page reload needed

**API Endpoint**: `PATCH /api/orders/:id/status`

---

### Test 5.8: View Order Details

**Steps:**
1. Click "View" button
2. Check modal content

**Expected Results:**
- [ ] Shows complete order info:
  - Order number, date
  - Customer details
  - Shipping address
  - Order items table with:
    * Product name, SKU
    * Quantity, Unit Price
    * Subtotal
  - Order totals:
    * Subtotal
    * Tax
    * Shipping
    * Discount
    * Grand Total
  - Status history (if available)
- [ ] All amounts in ₹ format
- [ ] Close button works

**API Endpoint**: `GET /api/orders/:id`

---

### Test 5.9: Delete Order

**Steps:**
1. Click red delete button
2. Confirm deletion

**Expected Results:**
- [ ] Delete button is RED
- [ ] Confirmation dialog
- [ ] Shows order number
- [ ] Warning about permanent deletion
- [ ] Confirming removes order
- [ ] Success message
- [ ] List refreshes

**API Endpoint**: `DELETE /api/orders/:id`

---

## 📋 Module 6: Warehouses

### Test 6.1: View Warehouses List

**Steps:**
1. Navigate to `/warehouses`
2. Wait for warehouses to load

**Expected Results:**
- [ ] Warehouse cards/table with:
  - Name, Code
  - Location (City, State)
  - Status (Active/Inactive/Maintenance)
  - Verification status
  - Capacity utilization bar
  - Total capacity
  - Occupied space
  - Actions
- [ ] Status badges neutral colors
- [ ] Utilization bars colored based on %

**API Endpoint**: `GET /api/warehouses`

---

### Test 6.2: Warehouse Stats Cards

**Steps:**
1. Check stats at top

**Expected Results:**
- [ ] **Total Warehouses**: Count
- [ ] **Active**: Active warehouse count
- [ ] **Total Capacity**: Sum in sq ft
- [ ] **Average Utilization**: % format
- [ ] Neutral card backgrounds

---

### Test 6.3: Status Filter

**Steps:**
1. Filter by Active
2. Filter by Inactive
3. Filter by Maintenance

**Expected Results:**
- [ ] Shows only selected status
- [ ] Badge colors consistent
- [ ] Count updates

---

### Test 6.4: Verification Filter

**Steps:**
1. Filter by Verified
2. Filter by Pending
3. Filter by Rejected

**Expected Results:**
- [ ] Shows only selected verification
- [ ] Works independently
- [ ] Correct display

---

### Test 6.5: Dual Filters (Status + Verification)

**Steps:**
1. Select Status = "Active"
2. Select Verification = "Verified"

**Expected Results:**
- [ ] Both filters apply
- [ ] Shows warehouses matching both
- [ ] Clearing works correctly

---

### Test 6.6: Search Warehouses

**Steps:**
1. Search by name
2. Search by code
3. Search by city

**Expected Results:**
- [ ] All search types work
- [ ] Real-time filtering
- [ ] Works with filters

---

### Test 6.7: Quick Status Update

**Steps:**
1. Hover over status badge
2. Select new status

**Expected Results:**
- [ ] Dropdown appears
- [ ] Can change to Active/Inactive/Maintenance
- [ ] Updates immediately
- [ ] Success message

**API Endpoint**: `PATCH /api/warehouses/:id/status`

---

### Test 6.8: View Warehouse Details

**Steps:**
1. Click "View" button
2. Check modal/page

**Expected Results:**
- [ ] Shows complete info:
  - Basic details
  - Full address with map coordinates
  - Manager info
  - Amenities list
  - Capacity details with utilization bar
  - Status and verification
- [ ] Amenities displayed as badges
- [ ] Close button works

**API Endpoint**: `GET /api/warehouses/:id`

---

### Test 6.9: Capacity Utilization Display

**Steps:**
1. Check utilization bars on each warehouse

**Expected Results:**
- [ ] Progress bar shows % filled
- [ ] Color changes based on utilization:
  - Green: < 70%
  - Yellow: 70-90%
  - Red: > 90%
- [ ] Shows exact numbers (occupied/total)
- [ ] % calculated correctly

---

### Test 6.10: Delete Warehouse

**Steps:**
1. Click red delete button
2. Confirm

**Expected Results:**
- [ ] Delete button is RED (already implemented)
- [ ] Confirmation with warehouse name
- [ ] Warning if warehouse has inventory
- [ ] Confirming removes warehouse
- [ ] Success message

**API Endpoint**: `DELETE /api/warehouses/:id`

---

## 📋 Module 7: Error Handling & Edge Cases

### Test 7.1: Network Errors

**Steps:**
1. Stop backend server
2. Try loading any page
3. Try creating/editing data

**Expected Results:**
- [ ] Error message appears (gray background, not red)
- [ ] Message: "Failed to connect to server"
- [ ] No crash or blank page
- [ ] Retry button available
- [ ] After restarting backend, retry works

---

### Test 7.2: Invalid Data

**Steps:**
1. Try creating product with negative price
2. Try creating customer with invalid email
3. Try creating order with 0 items

**Expected Results:**
- [ ] Form validation catches errors
- [ ] Shows validation message
- [ ] Submit button disabled
- [ ] Backend also validates (double check)

---

### Test 7.3: Empty States

**Steps:**
1. Filter products to show none
2. Search for non-existent customer
3. Filter orders with impossible combination

**Expected Results:**
- [ ] Shows "No items found" message
- [ ] Suggests clearing filters
- [ ] No error or crash
- [ ] UI remains functional

---

### Test 7.4: Pagination Edge Cases

**Steps:**
1. Go to last page of products
2. Delete items until page is empty
3. Check if it goes back to previous page

**Expected Results:**
- [ ] Handles empty pages gracefully
- [ ] Auto-navigates to valid page
- [ ] Pagination controls update

---

### Test 7.5: Concurrent Edits

**Steps:**
1. Open same product in two tabs
2. Edit in both
3. Save second one

**Expected Results:**
- [ ] Second save succeeds
- [ ] Data reflects last save
- [ ] No data corruption
- [ ] (Ideally shows conflict warning)

---

### Test 7.6: Token Expiration

**Steps:**
1. Login
2. Wait for token to expire (or manually clear token)
3. Try accessing protected route

**Expected Results:**
- [ ] Redirects to login
- [ ] Shows "Session expired" message
- [ ] After re-login, returns to intended page

---

### Test 7.7: Large Data Sets

**Steps:**
1. Create 100+ products
2. Check pagination
3. Check search performance

**Expected Results:**
- [ ] Pagination handles large data
- [ ] Search remains fast
- [ ] No UI lag
- [ ] No memory issues

---

## ✅ Issues Fixed

### Issue #1: Dashboard Stats undefined/NaN ✅ FIXED
- **Problem**: Stats showed undefined/NaN
- **Cause**: Data structure mismatch
- **Fix**: Updated interfaces in dashboard.ts and Dashboard.tsx
- **Status**: Resolved

### Issue #2: Logout Button Not Visible ✅ VERIFIED
- **Problem**: User couldn't find logout
- **Location**: Bottom of left sidebar, next to user info
- **Status**: Already present

### Issue #3: Design Theme Inconsistency ✅ FIXED
- **Problem**: Colorful badges in Orders/Customers
- **Fix**: Converted to neutral grayscale
- **Status**: 100% consistency achieved

### Issue #4: Processing Stats Showing "00" ✅ FIXED
- **Problem**: Showed "00" instead of number
- **Cause**: String concatenation
- **Fix**: Explicit Number() conversion
- **Status**: Resolved

### Issue #5: Delete/Logout Button Colors ✅ FIXED
- **Problem**: Gray buttons not visually distinct
- **Fix**: Changed to red (text-red-600, hover:bg-red-50)
- **Files**: Orders, Customers, Inventory, MainLayout
- **Status**: Resolved

---

## 🐛 Troubleshooting

### Frontend Won't Start
```powershell
cd c:\Mukesh\LogiSync
npm install
npm run dev
```

### Backend Connection Error
1. Check backend is running on port 5000
2. Check PostgreSQL is running
3. Check backend console for errors

### Cannot Find Module 'axios'
```powershell
cd c:\Mukesh\LogiSync
npm install
```

### Immediately Redirects to Login
- Token expired or invalid
- Login again with demo credentials

### Data Not Loading
1. Check backend is running
2. Open DevTools → Network tab
3. Check for API call errors
4. Check backend console logs
5. Verify database has data

### Port 5173 Already in Use
- Frontend auto-switched to 5174
- Use http://localhost:5174 instead

---

## 📊 Testing Checklist Summary

### Quick Checklist (30 min)
- [ ] Authentication (login, logout)
- [ ] Dashboard (stats, charts)
- [ ] Inventory (CRUD, search, filter)
- [ ] Customers (CRUD, segment filter, search)
- [ ] Orders (dual filters, status update, delete)
- [ ] Warehouses (dual filters, utilization, delete)
- [ ] UI/UX (red buttons, neutral theme)

### Full Checklist (2-3 hours)
- [ ] All authentication tests (6 tests)
- [ ] All dashboard tests (6 tests)
- [ ] All inventory tests (9 tests)
- [ ] All customer tests (8 tests)
- [ ] All order tests (9 tests)
- [ ] All warehouse tests (10 tests)
- [ ] All error handling tests (7 tests)

**Total Tests**: 55 comprehensive test cases

---

## 🎯 Success Criteria

✅ **All Core Features Work**
- Login/logout functional
- All CRUD operations work
- Search and filters functional
- Pagination works

✅ **Data Display Correct**
- No undefined/NaN values
- Proper ₹ formatting
- Dates formatted correctly
- Badges use neutral colors

✅ **UI/UX Quality**
- Loading states appear
- Errors show with messages
- Responsive on mobile
- No layout breaks
- Delete/logout buttons RED
- Minimalist black-white theme consistent

✅ **Performance**
- Pages load within 2 seconds
- Search is real-time
- No lag on interactions
- Smooth navigation

---

## 📞 Support & Documentation

### Additional Documents
- **BUG_FIXES.md** - Detailed bug fix documentation
- **DESIGN_SYSTEM.md** - Complete design guidelines
- **DESIGN_ALIGNMENT_REPORT.md** - Design changes report
- **UI_IMPROVEMENTS.md** - Recent UI improvements
- **SESSION_10_COMPLETE_SUMMARY.md** - Full integration summary

### API Documentation
- Backend API endpoints: `backend/TESTING_GUIDE.md`
- Swagger docs (if available): http://localhost:5000/api-docs

---

## 🎉 Ready to Test!

1. **Start servers** (backend + frontend)
2. **Choose your path**:
   - Quick testing: Use Quick Start section (30 min)
   - Comprehensive: Use full test modules (2-3 hours)
3. **Check off items** as you test
4. **Document issues** if found
5. **Report results**

**Good luck with testing!** 🚀

---

**Last Updated**: October 4, 2025  
**Version**: 1.0  
**Status**: Ready for Complete E2E Testing
