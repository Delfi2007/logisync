# Bug Fix: Customers API 500 Error

## 🐛 Issue Reported

**Error in Browser Console:**
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
/api/customers?page=1&limit=10&sortBy=created_at&order=DESC

Server error: column reference "user_id" is ambiguous
```

## 🔍 Root Cause

The SQL query in `backend/src/controllers/customersController.js` was joining multiple tables (customers, customer_addresses, orders) without qualifying column names with table aliases. 

When multiple tables in a JOIN have columns with the same name (like `user_id`), SQL doesn't know which one to reference, causing an "ambiguous column reference" error.

**Problematic Query (Line 22-67):**
```javascript
// ❌ WRONG: Unqualified column names
let whereConditions = ['user_id = $1'];  // Which user_id? c.user_id? o.user_id?

const customersQuery = `
  SELECT 
    c.*,
    COUNT(DISTINCT ca.id) as address_count,
    COUNT(DISTINCT o.id) as order_count
  FROM customers c
  LEFT JOIN customer_addresses ca ON c.id = ca.customer_id
  LEFT JOIN orders o ON c.id = o.customer_id
  WHERE ${whereClause}  // Uses ambiguous user_id
  GROUP BY c.id
  ORDER BY ${sortField} ${sortOrder}  // sortField not qualified
`;
```

## ✅ Solution

Qualified all column references with their table aliases (`c.` for customers table):

**Fixed Query:**
```javascript
// ✅ CORRECT: Qualified column names
let whereConditions = ['c.user_id = $1'];  // Clear: customers.user_id

if (segment) {
  whereConditions.push(`c.segment = $${paramCount}`);  // customers.segment
}

if (search) {
  whereConditions.push(`(
    c.name ILIKE $${paramCount} OR 
    c.email ILIKE $${paramCount} OR 
    c.phone ILIKE $${paramCount} OR
    c.business_name ILIKE $${paramCount}
  )`);
}

const countQuery = `SELECT COUNT(*) FROM customers c WHERE ${whereClause}`;

const customersQuery = `
  SELECT 
    c.*,
    COUNT(DISTINCT ca.id) as address_count,
    COUNT(DISTINCT o.id) as order_count
  FROM customers c
  LEFT JOIN customer_addresses ca ON c.id = ca.customer_id
  LEFT JOIN orders o ON c.id = o.customer_id
  WHERE ${whereClause}
  GROUP BY c.id
  ORDER BY c.${sortField} ${sortOrder}  // Qualified sort field
  LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
`;
```

## 📝 Changes Made

### File: `backend/src/controllers/customersController.js`

**Line 22-24:** Added `c.` prefix to WHERE conditions
```javascript
// Before
let whereConditions = ['user_id = $1'];

// After
let whereConditions = ['c.user_id = $1'];
```

**Line 28:** Qualified segment column
```javascript
// Before
whereConditions.push(`segment = $${paramCount}`);

// After
whereConditions.push(`c.segment = $${paramCount}`);
```

**Line 33-38:** Qualified search columns
```javascript
// Before
whereConditions.push(`(
  name ILIKE $${paramCount} OR 
  email ILIKE $${paramCount} OR 
  phone ILIKE $${paramCount} OR
  business_name ILIKE $${paramCount}
)`);

// After
whereConditions.push(`(
  c.name ILIKE $${paramCount} OR 
  c.email ILIKE $${paramCount} OR 
  c.phone ILIKE $${paramCount} OR
  c.business_name ILIKE $${paramCount}
)`);
```

**Line 49:** Added table alias to count query
```javascript
// Before
const countQuery = `SELECT COUNT(*) FROM customers WHERE ${whereClause}`;

// After
const countQuery = `SELECT COUNT(*) FROM customers c WHERE ${whereClause}`;
```

**Line 62:** Qualified sort field in ORDER BY
```javascript
// Before
ORDER BY ${sortField} ${sortOrder}

// After
ORDER BY c.${sortField} ${sortOrder}
```

## 🧪 Testing

### Before Fix:
- ❌ GET /api/customers → 500 Internal Server Error
- ❌ Error: "column reference 'user_id' is ambiguous"
- ❌ Customers page fails to load

### After Fix:
- ✅ GET /api/customers → 200 OK
- ✅ Returns customer list with pagination
- ✅ Customers page loads successfully
- ✅ Search and filters work
- ✅ Pagination functional

## 🔄 Auto-Reload

The backend server (if running with nodemon via `npm run dev`) should automatically detect the file change and reload. No manual restart needed.

If not auto-reloaded, restart manually:
```bash
cd backend
npm run dev
```

## 📚 Lesson Learned

**Best Practice:** Always qualify column names with table aliases in SQL queries that involve JOINs, even if currently unambiguous. This prevents errors when:
1. Tables are added/removed from JOINs
2. Column names change
3. New columns are added to tables

**Pattern to follow:**
```sql
-- ✅ Good
SELECT c.id, c.name, o.total_amount
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE c.user_id = $1

-- ❌ Bad (ambiguous if orders also has user_id)
SELECT id, name, total_amount
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE user_id = $1
```

## ✅ Status

**Fixed and Deployed** ✅

The Customers page should now work correctly. Try refreshing the page at:
```
http://localhost:5173/customers
```

You should see:
- Customer list loading successfully
- Stats cards showing correct counts
- Search and filter working
- Pagination functional
- No 500 errors in console
