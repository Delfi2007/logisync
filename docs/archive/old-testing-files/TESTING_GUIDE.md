# 🧪 LogiSync - Comprehensive Testing Guide

**Date**: October 4, 2025  
**Status**: Ready for End-to-End Testing  
**Backend**: ✅ Running on http://localhost:5000  
**Frontend**: Start with `npm run dev` on http://localhost:5173

---

## 📋 Testing Checklist Overview

- [ ] **Module 1**: Authentication Flow
- [ ] **Module 2**: Dashboard
- [ ] **Module 3**: Inventory/Products
- [ ] **Module 4**: Customers
- [ ] **Module 5**: Orders
- [ ] **Module 6**: Warehouses
- [ ] **Module 7**: Error Handling & Edge Cases

---

## 🔐 Module 1: Authentication Flow

### Test 1.1: User Registration
**Steps:**
1. Navigate to http://localhost:5173
2. Click "Sign up" or go to Register page
3. Fill in the registration form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: TestPass123! (should show strength indicator)
   - Confirm Password: TestPass123!
4. Click "Create Account"

**Expected Results:**
- ✅ Password strength indicator shows "Strong"
- ✅ Registration successful message
- ✅ Redirected to Dashboard
- ✅ Token stored in localStorage
- ✅ User name visible in header/sidebar

**API Endpoint**: `POST /api/auth/register`

---

### Test 1.2: Demo User Login
**Steps:**
1. Logout (if logged in)
2. Go to Login page
3. Enter credentials:
   - Email: demo@logisync.com
   - Password: password123
4. Click "Sign In"

**Expected Results:**
- ✅ Login successful
- ✅ Redirected to Dashboard
- ✅ Token stored in localStorage (key: 'authToken')
- ✅ User context updated with demo user info

**API Endpoint**: `POST /api/auth/login`

---

### Test 1.3: Protected Routes
**Steps:**
1. While logged out, try to access: http://localhost:5173/dashboard
2. Should be redirected to login
3. After login, access same URL
4. Should see dashboard

**Expected Results:**
- ✅ Unauthenticated access redirects to login
- ✅ After login, protected routes accessible
- ✅ Navigation menu shows all sections

---

### Test 1.4: Token Persistence
**Steps:**
1. Login successfully
2. Refresh the page (F5)
3. Check if still logged in

**Expected Results:**
- ✅ User remains logged in after refresh
- ✅ Token loaded from localStorage
- ✅ Dashboard data loads automatically

---

### Test 1.5: Logout
**Steps:**
1. While logged in, click "Logout" button
2. Observe behavior

**Expected Results:**
- ✅ Redirected to login page
- ✅ Token removed from localStorage
- ✅ Cannot access protected routes
- ✅ Auth context cleared

---

## 📊 Module 2: Dashboard

### Test 2.1: Stats Cards Loading
**Steps:**
1. Login as demo user
2. Observe the 6 stats cards at top

**Expected Results:**
- ✅ "Total Products" shows count
- ✅ "Low Stock" shows count of products with quantity < reorder_level
- ✅ "Total Customers" shows count
- ✅ "Active Orders" shows count of non-cancelled orders
- ✅ "Total Revenue" shows sum in ₹ format
- ✅ "Pending Orders" shows count with yellow badge
- ✅ All data fetched from API (not mock data)

**API Endpoint**: `GET /api/dashboard` or individual endpoints

---

### Test 2.2: Revenue Chart
**Steps:**
1. Scroll to "Revenue Overview" section
2. Check if chart displays

**Expected Results:**
- ✅ Chart shows monthly revenue data
- ✅ X-axis shows months
- ✅ Y-axis shows revenue amounts
- ✅ Bars/lines visible with data

**Note**: If no data, chart should show empty state

---

### Test 2.3: Recent Orders Table
**Steps:**
1. Scroll to "Recent Orders" section
2. Check if orders are displayed

**Expected Results:**
- ✅ Table shows recent 5-10 orders
- ✅ Columns: Order ID, Customer, Status, Amount, Date
- ✅ Status badges colored correctly (pending=yellow, processing=blue, etc.)
- ✅ Clicking row/button navigates to Orders page

**API Endpoint**: `GET /api/orders?limit=10&sortBy=created_at&order=DESC`

---

## 📦 Module 3: Inventory/Products

### Test 3.1: Products List & Pagination
**Steps:**
1. Navigate to Inventory page
2. Observe the products table

**Expected Results:**
- ✅ Products displayed in table format
- ✅ Columns: Product name, SKU, Category, Stock, Price, Status
- ✅ Pagination controls visible (if >10 products)
- ✅ Shows "Page X of Y"
- ✅ Previous/Next buttons work correctly

**API Endpoint**: `GET /api/products?page=1&limit=10`

---

### Test 3.2: Product Search
**Steps:**
1. Type a product name in search box (e.g., "Laptop")
2. Wait 500ms (debounce)
3. Observe filtered results

**Expected Results:**
- ✅ Products filtered by name/SKU match
- ✅ Search is case-insensitive
- ✅ Pagination resets to page 1
- ✅ "No products found" message if no matches

**API Endpoint**: `GET /api/products?search=Laptop`

---

### Test 3.3: Category Filter
**Steps:**
1. Select a category from dropdown
2. Observe filtered products

**Expected Results:**
- ✅ Only products from selected category shown
- ✅ Can combine with search
- ✅ "All Categories" shows everything

**API Endpoint**: `GET /api/products?category=Electronics`

---

### Test 3.4: Low Stock Filter
**Steps:**
1. Click "Low Stock Items" filter/button
2. Observe filtered products

**Expected Results:**
- ✅ Only products where quantity < reorder_level
- ✅ Red/orange indicators visible
- ✅ Shows alert message

**API Endpoint**: `GET /api/products?low_stock=true`

---

### Test 3.5: Create Product
**Steps:**
1. Click "+ Add Product" button
2. Fill in the form:
   - Name: Test Product
   - SKU: TEST-001
   - Category: Electronics
   - Quantity: 50
   - Price: 999
   - Reorder Level: 10
3. Click "Create"

**Expected Results:**
- ✅ Modal/form opens
- ✅ Validation works (required fields)
- ✅ Product created successfully
- ✅ New product appears in list
- ✅ Success message shown

**API Endpoint**: `POST /api/products`

---

### Test 3.6: Update Product
**Steps:**
1. Click "Edit" button on a product
2. Change quantity to 100
3. Click "Update"

**Expected Results:**
- ✅ Edit modal pre-filled with current data
- ✅ Product updated successfully
- ✅ Updated quantity reflected in table
- ✅ Success message shown

**API Endpoint**: `PUT /api/products/:id`

---

### Test 3.7: Delete Product
**Steps:**
1. Click "Delete" button on a product
2. Confirm deletion in dialog
3. Observe result

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Product deleted from database
- ✅ Product removed from list
- ✅ Success message shown

**API Endpoint**: `DELETE /api/products/:id`

---

## 👥 Module 4: Customers

### Test 4.1: Customers List
**Steps:**
1. Navigate to Customers page
2. Observe the customers table

**Expected Results:**
- ✅ Customers displayed with Name, Email, Phone, Segment
- ✅ Pagination works (10 per page)
- ✅ Stats cards show Total, VIP, Regular, New counts

**API Endpoint**: `GET /api/customers?page=1&limit=10`

---

### Test 4.2: Customer Search
**Steps:**
1. Search by name: "John"
2. Search by email: "@example.com"
3. Search by phone: "98"

**Expected Results:**
- ✅ Searches across name, email, and phone
- ✅ Results update with 500ms debounce
- ✅ Case-insensitive matching

**API Endpoint**: `GET /api/customers?search=John`

---

### Test 4.3: Segment Filter
**Steps:**
1. Filter by "VIP" segment
2. Filter by "Regular" segment
3. Set to "All Segments"

**Expected Results:**
- ✅ Only customers from selected segment shown
- ✅ VIP badge = purple, Regular = blue, New = green
- ✅ Combines with search

**API Endpoint**: `GET /api/customers?segment=VIP`

---

### Test 4.4: View Customer Details
**Steps:**
1. Click "View" button on a customer
2. Observe modal/detail view

**Expected Results:**
- ✅ Shows full customer information
- ✅ Shows addresses (if any)
- ✅ Shows order history count
- ✅ Shows total spent amount

**API Endpoint**: `GET /api/customers/:id`

---

### Test 4.5: Create Customer
**Steps:**
1. Click "+ Add Customer"
2. Fill form:
   - Name: New Customer
   - Email: newcust@example.com
   - Phone: 9876543210
   - Segment: Regular
3. Submit

**Expected Results:**
- ✅ Customer created
- ✅ Appears in list
- ✅ Success message

**API Endpoint**: `POST /api/customers`

---

### Test 4.6: Update Customer
**Steps:**
1. Edit a customer
2. Change segment to "VIP"
3. Update phone number
4. Save

**Expected Results:**
- ✅ Customer updated
- ✅ Changes reflected immediately
- ✅ Badge color updates

**API Endpoint**: `PUT /api/customers/:id`

---

### Test 4.7: Delete Customer
**Steps:**
1. Delete a customer
2. Confirm deletion

**Expected Results:**
- ✅ Confirmation dialog
- ✅ Customer removed
- ✅ Stats update

**API Endpoint**: `DELETE /api/customers/:id`

---

## 📋 Module 5: Orders

### Test 5.1: Orders List
**Steps:**
1. Navigate to Orders page
2. Observe orders table

**Expected Results:**
- ✅ Orders displayed with Order#, Customer, Status, Payment, Amount, Date
- ✅ Stats cards: Total Orders, Pending, Processing, Delivered, Revenue
- ✅ Pagination works

**API Endpoint**: `GET /api/orders?page=1&limit=10`

---

### Test 5.2: Order Status Filter
**Steps:**
1. Filter by "Pending"
2. Filter by "Processing"
3. Filter by "Delivered"
4. Try each of 7 statuses

**Expected Results:**
- ✅ Only orders with selected status shown
- ✅ Status badges colored:
  - Pending = Yellow
  - Confirmed = Blue
  - Processing = Purple
  - Shipped = Indigo
  - Delivered = Green
  - Cancelled = Red
  - Returned = Orange

**API Endpoint**: `GET /api/orders?status=pending`

---

### Test 5.3: Payment Status Filter
**Steps:**
1. Filter by "Paid"
2. Filter by "Pending"
3. Filter by "Failed"
4. Filter by "Refunded"

**Expected Results:**
- ✅ Orders filtered by payment status
- ✅ Can combine with order status filter (dual filtering)
- ✅ Payment badges colored correctly

**API Endpoint**: `GET /api/orders?payment_status=paid`

---

### Test 5.4: Search Orders
**Steps:**
1. Search by order number
2. Search by customer name

**Expected Results:**
- ✅ Searches across order number and customer
- ✅ Debounced search (500ms)
- ✅ Combines with filters

**API Endpoint**: `GET /api/orders?search=ORD-`

---

### Test 5.5: View Order Details
**Steps:**
1. Click "View" on an order
2. Check modal content

**Expected Results:**
- ✅ Shows order items with products, quantities, prices
- ✅ Shows customer info
- ✅ Shows shipping address
- ✅ Shows payment method
- ✅ Shows order timeline/status

**API Endpoint**: `GET /api/orders/:id`

---

### Test 5.6: Quick Status Update
**Steps:**
1. Hover over status badge in table
2. Dropdown menu appears
3. Select new status (e.g., "Processing")
4. Observe update

**Expected Results:**
- ✅ Dropdown shows all 7 status options
- ✅ Current status highlighted
- ✅ Status updates immediately
- ✅ Badge color changes
- ✅ No page reload

**API Endpoint**: `PUT /api/orders/:id/status`

---

### Test 5.7: Delete Order
**Steps:**
1. Delete an order
2. Confirm

**Expected Results:**
- ✅ Confirmation dialog
- ✅ Order removed
- ✅ Stats update

**API Endpoint**: `DELETE /api/orders/:id`

---

## 🏭 Module 6: Warehouses

### Test 6.1: Warehouses List
**Steps:**
1. Navigate to Warehouses page
2. Observe warehouses table

**Expected Results:**
- ✅ Warehouses displayed with Name, Code, Location, Capacity, Available, Utilization, Status, Verified
- ✅ Stats cards: Total, Active, Total Capacity, Avg Utilization
- ✅ Progress bars for utilization
- ✅ Pagination works

**API Endpoint**: `GET /api/warehouses?page=1&limit=10`

---

### Test 6.2: Warehouse Status Filter
**Steps:**
1. Filter by "Active"
2. Filter by "Inactive"
3. Filter by "Maintenance"
4. Set to "All Status"

**Expected Results:**
- ✅ Only warehouses with selected status shown
- ✅ Status badges colored:
  - Active = Green with CheckCircle
  - Inactive = Gray with XCircle
  - Maintenance = Yellow with AlertCircle

**API Endpoint**: `GET /api/warehouses?status=active`

---

### Test 6.3: Verification Filter
**Steps:**
1. Filter by "Verified Only"
2. Filter by "Unverified Only"
3. Set to "All Verified"

**Expected Results:**
- ✅ Filters by is_verified field
- ✅ Verified badge = green with checkmark
- ✅ Unverified badge = gray with X
- ✅ Combines with status filter (dual filtering)

**API Endpoint**: `GET /api/warehouses?is_verified=true`

---

### Test 6.4: Search Warehouses
**Steps:**
1. Search by warehouse name
2. Search by code (e.g., "WH-")
3. Search by city

**Expected Results:**
- ✅ Searches across name, code, and city
- ✅ Debounced search (500ms)
- ✅ Combines with both filters

**API Endpoint**: `GET /api/warehouses?search=Mumbai`

---

### Test 6.5: View Warehouse Details
**Steps:**
1. Click "View" on a warehouse
2. Check modal content

**Expected Results:**
- ✅ Shows warehouse name and code
- ✅ Shows full address (street, city, state, pincode)
- ✅ Shows capacity, occupied, available
- ✅ Shows utilization percentage
- ✅ Shows status badge
- ✅ Shows amenities list (if any)

**API Endpoint**: `GET /api/warehouses/:id`

---

### Test 6.6: Quick Status Update
**Steps:**
1. Hover over status badge in table
2. Dropdown appears
3. Select new status (e.g., "Maintenance")

**Expected Results:**
- ✅ Dropdown shows 3 status options
- ✅ Status updates immediately
- ✅ Badge changes color
- ✅ No page reload

**API Endpoint**: `PUT /api/warehouses/:id`

---

### Test 6.7: Delete Warehouse
**Steps:**
1. Delete a warehouse
2. Confirm

**Expected Results:**
- ✅ Confirmation dialog with warehouse name
- ✅ Warehouse removed
- ✅ Stats update
- ✅ Success message

**API Endpoint**: `DELETE /api/warehouses/:id`

---

## ⚠️ Module 7: Error Handling & Edge Cases

### Test 7.1: Invalid Login
**Steps:**
1. Try to login with wrong password
2. Try with non-existent email

**Expected Results:**
- ✅ Error message: "Invalid credentials"
- ✅ No redirect to dashboard
- ✅ Form stays on login page

---

### Test 7.2: Network Error Simulation
**Steps:**
1. Stop backend server
2. Try any API operation (e.g., load dashboard)
3. Observe error handling

**Expected Results:**
- ✅ Error message displayed
- ✅ "Try Again" button visible
- ✅ No crash or blank page

---

### Test 7.3: Validation Errors
**Steps:**
1. Try to create product with empty name
2. Try to create customer with invalid email
3. Try to register with weak password

**Expected Results:**
- ✅ Validation errors shown in red
- ✅ Submit button disabled or prevents submission
- ✅ Error messages clear and helpful

---

### Test 7.4: Token Expiration
**Steps:**
1. Login successfully
2. Manually expire token (wait 7 days or modify localStorage)
3. Try to access a protected route

**Expected Results:**
- ✅ Redirected to login page
- ✅ "Session expired" message
- ✅ Can re-login successfully

---

### Test 7.5: Empty States
**Steps:**
1. Search for non-existent product
2. Filter orders with no results
3. Check empty customer list

**Expected Results:**
- ✅ Friendly "No results found" message
- ✅ Icon displayed
- ✅ Suggestion to adjust filters
- ✅ No broken UI

---

### Test 7.6: Pagination Edge Cases
**Steps:**
1. Go to last page of products
2. Delete last item on that page
3. Check if pagination adjusts

**Expected Results:**
- ✅ Automatically goes to previous page if last page is empty
- ✅ Page numbers update correctly
- ✅ "Page X of Y" accurate

---

### Test 7.7: Concurrent Updates
**Steps:**
1. Open same product in two browser tabs
2. Update in tab 1
3. Try to update in tab 2

**Expected Results:**
- ✅ Both updates work (last write wins)
- ✅ Or shows conflict message
- ✅ No data corruption

---

## 🔄 Cross-Module Integration Tests

### Test 8.1: Create Order with Customer
**Steps:**
1. Create a new customer
2. Create an order for that customer
3. Check if customer shows in order details

**Expected Results:**
- ✅ Customer linked to order
- ✅ Order appears in customer's order history

---

### Test 8.2: Dashboard Stats Consistency
**Steps:**
1. Note dashboard stats
2. Create a new order
3. Refresh dashboard
4. Check if stats updated

**Expected Results:**
- ✅ Total Orders count increased
- ✅ Revenue updated (if paid)
- ✅ Recent orders shows new order

---

### Test 8.3: Product Inventory Update
**Steps:**
1. Note product quantity
2. Create order with that product
3. Check product inventory

**Expected Results:**
- ✅ Product quantity decreased
- ✅ Low stock alert if below reorder level

---

## 📊 Performance Tests

### Test 9.1: Load Time
- ✅ Dashboard loads in < 2 seconds
- ✅ Product list loads in < 1 second
- ✅ Search results appear in < 500ms

### Test 9.2: Pagination Performance
- ✅ Navigating pages is smooth
- ✅ No lag when switching filters
- ✅ Debounced search prevents excessive API calls

---

## 🎯 Testing Summary Report Template

Use this template to document your test results:

```
## Test Results - [Date]

### Module 1: Authentication
- [ ] Registration: PASS/FAIL - Notes:
- [ ] Login: PASS/FAIL - Notes:
- [ ] Protected Routes: PASS/FAIL - Notes:
- [ ] Token Persistence: PASS/FAIL - Notes:
- [ ] Logout: PASS/FAIL - Notes:

### Module 2: Dashboard
- [ ] Stats Loading: PASS/FAIL - Notes:
- [ ] Revenue Chart: PASS/FAIL - Notes:
- [ ] Recent Orders: PASS/FAIL - Notes:

### Module 3: Inventory
- [ ] Product List: PASS/FAIL - Notes:
- [ ] Search: PASS/FAIL - Notes:
- [ ] Filters: PASS/FAIL - Notes:
- [ ] Create: PASS/FAIL - Notes:
- [ ] Update: PASS/FAIL - Notes:
- [ ] Delete: PASS/FAIL - Notes:

### Module 4: Customers
- [ ] Customer List: PASS/FAIL - Notes:
- [ ] Search: PASS/FAIL - Notes:
- [ ] Segment Filter: PASS/FAIL - Notes:
- [ ] View Details: PASS/FAIL - Notes:
- [ ] Create: PASS/FAIL - Notes:
- [ ] Update: PASS/FAIL - Notes:
- [ ] Delete: PASS/FAIL - Notes:

### Module 5: Orders
- [ ] Order List: PASS/FAIL - Notes:
- [ ] Status Filter: PASS/FAIL - Notes:
- [ ] Payment Filter: PASS/FAIL - Notes:
- [ ] Search: PASS/FAIL - Notes:
- [ ] View Details: PASS/FAIL - Notes:
- [ ] Status Update: PASS/FAIL - Notes:
- [ ] Delete: PASS/FAIL - Notes:

### Module 6: Warehouses
- [ ] Warehouse List: PASS/FAIL - Notes:
- [ ] Status Filter: PASS/FAIL - Notes:
- [ ] Verification Filter: PASS/FAIL - Notes:
- [ ] Search: PASS/FAIL - Notes:
- [ ] View Details: PASS/FAIL - Notes:
- [ ] Status Update: PASS/FAIL - Notes:
- [ ] Delete: PASS/FAIL - Notes:

### Module 7: Error Handling
- [ ] Invalid Login: PASS/FAIL - Notes:
- [ ] Network Errors: PASS/FAIL - Notes:
- [ ] Validation: PASS/FAIL - Notes:
- [ ] Empty States: PASS/FAIL - Notes:

### Overall Assessment
- Critical Issues: [Number]
- Major Issues: [Number]
- Minor Issues: [Number]
- Overall Status: READY FOR PRODUCTION / NEEDS FIXES

### Next Steps
1. [Action item 1]
2. [Action item 2]
```

---

## 🚀 Quick Start Testing

To start testing immediately:

1. **Start Backend** (if not running):
   ```bash
   cd backend
   npm start
   # Should run on http://localhost:5000
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   # Should run on http://localhost:5173
   ```

3. **Login with Demo User**:
   - Email: demo@logisync.com
   - Password: password123

4. **Follow Module Tests** in order (1 → 7)

5. **Document Issues** in a separate file or issue tracker

---

## 📝 Common Issues & Solutions

### Issue: "Network Error" on API calls
**Solution**: Check if backend is running on port 5000

### Issue: Token not persisting
**Solution**: Check localStorage in DevTools, clear and re-login

### Issue: "Cannot read property" errors
**Solution**: Check if API response structure matches TypeScript interfaces

### Issue: Filters not working
**Solution**: Check API endpoint query parameters in Network tab

---

**Happy Testing! 🎉**

For any issues or questions, refer to the API documentation or backend logs.
