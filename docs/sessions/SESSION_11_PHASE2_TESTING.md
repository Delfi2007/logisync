# Session 11 - Phase 2 Testing: Bulk Actions

**Date:** October 5, 2025  
**Phase:** Phase 2 - Bulk Actions Testing  
**Status:** In Progress

## Overview

Testing comprehensive bulk action functionality across all modules:
- Products (Inventory page)
- Customers
- Warehouses

## Test Scenarios

### 1. Products Module (Inventory Page)

#### Test 1.1: Individual Selection
- [ ] Navigate to Inventory page
- [ ] Verify checkbox column appears in table header
- [ ] Verify checkbox appears in each product row
- [ ] Click on individual product checkbox
- [ ] Verify checkbox becomes checked
- [ ] Verify bulk actions toolbar appears
- [ ] Verify toolbar shows "1 product selected"

#### Test 1.2: Multiple Selection
- [ ] Select 3-4 products by clicking individual checkboxes
- [ ] Verify all selected checkboxes are checked
- [ ] Verify toolbar shows correct count (e.g., "4 products selected")
- [ ] Verify "Clear selection" button is visible

#### Test 1.3: Select All
- [ ] Click the checkbox in the table header
- [ ] Verify all product checkboxes become checked
- [ ] Verify toolbar shows total count (e.g., "10 products selected")
- [ ] Click header checkbox again
- [ ] Verify all checkboxes become unchecked
- [ ] Verify toolbar disappears

#### Test 1.4: Clear Selection
- [ ] Select 2-3 products
- [ ] Click "Clear selection" button in toolbar
- [ ] Verify all checkboxes become unchecked
- [ ] Verify toolbar disappears

#### Test 1.5: CSV Export (Selected Items)
- [ ] Select 2-3 products
- [ ] Click "Export CSV" button
- [ ] Verify file downloads with timestamp filename (e.g., `products_export_2025-10-05.csv`)
- [ ] Open downloaded CSV file
- [ ] Verify headers: Name, SKU, Category, Price, Cost, Stock, Reorder Level, Description
- [ ] Verify only selected products are in the file
- [ ] Verify data is properly formatted with quotes

#### Test 1.6: CSV Export (All Items)
- [ ] Ensure no products are selected
- [ ] Have at least 3-4 products in the list
- [ ] Click any product checkbox to show toolbar
- [ ] Click "Export CSV" button
- [ ] Verify file downloads
- [ ] Open CSV file
- [ ] Verify ALL products are exported (not just selected)

#### Test 1.7: Bulk Delete (Single Item)
- [ ] Select 1 product
- [ ] Click "Delete Selected" button
- [ ] Verify confirmation dialog appears showing "1 product"
- [ ] Click Cancel - verify nothing happens, selection remains
- [ ] Click "Delete Selected" again
- [ ] Confirm deletion
- [ ] Verify success message shows "Successfully deleted 1 product"
- [ ] Verify product is removed from list
- [ ] Verify selection is cleared
- [ ] Verify toolbar disappears

#### Test 1.8: Bulk Delete (Multiple Items)
- [ ] Select 3 products
- [ ] Click "Delete Selected" button
- [ ] Verify confirmation shows "3 products"
- [ ] Confirm deletion
- [ ] Verify success message
- [ ] Verify all 3 products are removed
- [ ] Verify list refreshes correctly

#### Test 1.9: Bulk Delete (During Operation)
- [ ] Select 2-3 products
- [ ] Click "Delete Selected" and confirm
- [ ] Verify "Delete Selected" button changes to "Deleting..."
- [ ] Verify buttons are disabled during operation
- [ ] Wait for completion
- [ ] Verify buttons become enabled again

#### Test 1.10: Edge Cases
- [ ] Try bulk delete with products that might have relationships (orders)
- [ ] Verify appropriate error handling if deletion fails
- [ ] Check if partial success is reported correctly (e.g., "Deleted 2 products. Failed to delete 1.")

---

### 2. Customers Module

#### Test 2.1: Individual Selection
- [ ] Navigate to Customers page
- [ ] Verify checkbox column appears
- [ ] Select individual customer
- [ ] Verify toolbar shows "1 customer selected"

#### Test 2.2: Multiple Selection
- [ ] Select 3-4 customers
- [ ] Verify toolbar shows correct count

#### Test 2.3: Select All
- [ ] Click header checkbox
- [ ] Verify all customers selected
- [ ] Click again to deselect all

#### Test 2.4: Clear Selection
- [ ] Select customers
- [ ] Click "Clear selection"
- [ ] Verify all deselected

#### Test 2.5: CSV Export (Selected)
- [ ] Select 2-3 customers
- [ ] Click "Export CSV"
- [ ] Verify file downloads: `customers_export_2025-10-05.csv`
- [ ] Open CSV and verify headers: Name, Email, Phone, Business Name, Segment, Total Orders, Total Revenue
- [ ] Verify only selected customers are exported
- [ ] Verify data formatting

#### Test 2.6: CSV Export (All)
- [ ] With no selection, export
- [ ] Verify all customers are exported

#### Test 2.7: Bulk Delete (Single)
- [ ] Select 1 customer
- [ ] Delete and confirm
- [ ] Verify success message
- [ ] Verify customer removed

#### Test 2.8: Bulk Delete (Multiple)
- [ ] Select 3 customers
- [ ] Delete and confirm
- [ ] Verify all removed

#### Test 2.9: Button States
- [ ] Verify buttons disable during deletion
- [ ] Verify "Deleting..." text appears
- [ ] Verify buttons re-enable after completion

#### Test 2.10: Edge Cases
- [ ] Try deleting customers with orders
- [ ] Verify error handling

---

### 3. Warehouses Module

#### Test 3.1: Individual Selection
- [ ] Navigate to Warehouses page
- [ ] Verify checkbox column appears
- [ ] Select individual warehouse
- [ ] Verify toolbar shows "1 warehouse selected"

#### Test 3.2: Multiple Selection
- [ ] Select 3-4 warehouses
- [ ] Verify toolbar shows correct count

#### Test 3.3: Select All
- [ ] Click header checkbox
- [ ] Verify all warehouses selected
- [ ] Click again to deselect all

#### Test 3.4: Clear Selection
- [ ] Select warehouses
- [ ] Click "Clear selection"
- [ ] Verify all deselected

#### Test 3.5: CSV Export (Selected)
- [ ] Select 2-3 warehouses
- [ ] Click "Export CSV"
- [ ] Verify file downloads: `warehouses_export_2025-10-05.csv`
- [ ] Open CSV and verify headers: Name, Code, Location, Capacity, Occupied, Utilization %, Status, Verified
- [ ] Verify only selected warehouses are exported
- [ ] Verify data formatting (especially Location combines city + state)

#### Test 3.6: CSV Export (All)
- [ ] With no selection, export
- [ ] Verify all warehouses are exported

#### Test 3.7: Bulk Delete (Single)
- [ ] Select 1 warehouse
- [ ] Delete and confirm
- [ ] Verify success message
- [ ] Verify warehouse removed

#### Test 3.8: Bulk Delete (Multiple)
- [ ] Select 3 warehouses
- [ ] Delete and confirm
- [ ] Verify all removed

#### Test 3.9: Button States
- [ ] Verify buttons disable during deletion
- [ ] Verify "Deleting..." text appears
- [ ] Verify buttons re-enable after completion

#### Test 3.10: Edge Cases
- [ ] Try deleting warehouses with inventory
- [ ] Verify error handling

---

## Cross-Module Tests

### Test 4.1: UI Consistency
- [ ] Compare toolbar styling across all three modules
- [ ] Verify button colors and sizes are consistent
- [ ] Verify checkbox styling is uniform
- [ ] Verify spacing and layout is consistent

### Test 4.2: Navigation During Selection
- [ ] Select products in Inventory
- [ ] Navigate to Customers page
- [ ] Verify Products selection is cleared (or maintained if that's the design)
- [ ] Navigate back to Inventory
- [ ] Verify clean state

### Test 4.3: Filter Interaction
- [ ] In Inventory, select products
- [ ] Apply a category filter
- [ ] Verify selection state behavior (cleared or maintained)
- [ ] Test with search as well

### Test 4.4: Pagination Interaction
- [ ] If there are multiple pages, select items on page 1
- [ ] Navigate to page 2
- [ ] Verify selection state
- [ ] Navigate back to page 1
- [ ] Verify checkboxes still reflect selection

### Test 4.5: Performance
- [ ] Test with 10+ items in each module
- [ ] Verify bulk delete completes in reasonable time
- [ ] Check for any UI lag or freezing
- [ ] Verify CSV export is fast

---

## Browser Compatibility

### Test 5.1: Chrome/Edge
- [ ] Run all primary tests in Chrome/Edge
- [ ] Verify checkboxes render correctly
- [ ] Verify CSV downloads work

### Test 5.2: Firefox
- [ ] Run key tests in Firefox
- [ ] Verify checkbox styling
- [ ] Verify CSV downloads

### Test 5.3: Safari (if available)
- [ ] Run key tests in Safari
- [ ] Verify checkbox styling
- [ ] Verify CSV downloads

---

## Known Issues / Bugs Found

_Document any issues discovered during testing here:_

1. **Issue:** [Description]
   - **Severity:** Low/Medium/High/Critical
   - **Steps to Reproduce:**
   - **Expected Behavior:**
   - **Actual Behavior:**
   - **Fix Required:**

---

## Test Summary

**Total Test Cases:** 70+  
**Passed:** ___  
**Failed:** ___  
**Blocked:** ___  
**Not Tested:** ___

### Critical Issues Found
- [ ] None yet

### Minor Issues Found
- [ ] None yet

---

## Sign-off

**Phase 2 Testing Status:** ⏳ In Progress  
**Ready for Phase 3:** ⬜ Not yet  
**Tested By:** [Your Name]  
**Date Completed:** ___

---

## Next Steps After Testing

1. **If all tests pass:**
   - Mark Phase 2 as 100% complete ✅
   - Create Phase 2 completion documentation
   - Move to Phase 3: Performance Optimization

2. **If issues found:**
   - Fix critical bugs first
   - Re-test affected functionality
   - Then proceed to Phase 3

3. **Phase 3 Preview:**
   - Lazy loading for routes
   - Code splitting for large components
   - Memoization for expensive calculations
   - Debounced search optimization
   - Bundle size analysis
