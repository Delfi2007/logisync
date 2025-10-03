# LogiSync - Quick Reference Card

## 🚀 Getting Started

### Run the App
```bash
cd c:\Mukesh\LogiSync
npm run dev
```
Open: **http://localhost:5173/**

---

## 📂 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── MainLayout.tsx      # Main app layout + sidebar
│   └── ProductModal.tsx         # Add/Edit product form
├── pages/
│   ├── Dashboard.tsx            # ✅ Home dashboard
│   ├── Inventory.tsx            # ✅ Full inventory management
│   ├── Orders.tsx               # 🚧 Coming next
│   ├── Marketplace.tsx          # 🚧 Future
│   ├── Analytics.tsx            # 🚧 Future
│   ├── Customers.tsx            # 🚧 Future
│   └── Settings.tsx             # 🚧 Future
├── data/
│   └── mockData.ts              # All mock data
├── types/
│   └── index.ts                 # TypeScript interfaces
├── App.tsx                      # Router setup
├── main.tsx                     # App entry point
└── index.css                    # Global styles + Tailwind
```

---

## 🎯 What's Complete

### ✅ Dashboard
- 4 metric cards (orders, revenue, shipments, alerts)
- Order trends line chart
- Top products bar chart  
- Delivery status pie chart
- Recent activity feed
- Quick action buttons

### ✅ Inventory Management
- Product list table (searchable/filterable)
- Add product modal
- Edit product modal
- Delete product (with confirmation)
- Low stock alerts tab
- Stock movements tab (placeholder)
- 4 stats cards (real-time)
- Auto-SKU generation
- Profit margin calculator

---

## 🔧 Key Features by Page

### Dashboard (`/`)
- View today's orders & revenue
- See pending shipments
- Check low stock alerts
- View order trends (last 7 days)
- Top 5 selling products
- Recent activity (last 10)

### Inventory (`/inventory`)
- View all products in table
- Search by name or SKU
- Filter by category
- Add new product
- Edit existing product
- Delete product
- View low stock alerts
- See total stock value

---

## 🎨 Design System

### Colors
```
Primary: Black (#171717)
Backgrounds: White, Neutral 50-100
Text: Neutral 600-900
Borders: Neutral 200
```

### Components
```css
.card              /* White card with shadow */
.btn-primary       /* Black button */
.btn-secondary     /* White button with border */
.input             /* Form input */
.badge             /* Status badge */
```

---

## 📝 Common Tasks

### Add Mock Data
**Location**: `src/data/mockData.ts`

#### Add a Product
```typescript
{
  id: 'PRD-006',
  sku: 'SKU-2024-006',
  name: 'New Product',
  description: 'Product description',
  category: 'Food & Beverages',
  unitPrice: 100,
  costPrice: 70,
  currentStock: 200,
  reorderLevel: 50,
  unit: 'pieces',
  locations: [{ warehouseId: 'WH-001', quantity: 200 }],
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

#### Add a Customer
```typescript
{
  id: 'CUST-004',
  name: 'New Customer',
  email: 'customer@email.com',
  phone: '+91 98765 44444',
  billingAddress: { /* ... */ },
  shippingAddresses: [{ /* ... */ }],
  totalOrders: 0,
  lifetimeValue: 0,
  segment: 'new',
  createdAt: new Date(),
}
```

### Create a New Page
1. Create file: `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`:
```typescript
<Route path="/newpage" element={<NewPage />} />
```
3. Add to navigation in `src/components/layout/MainLayout.tsx`

### Add a Category
**Location**: `src/components/ProductModal.tsx`
```tsx
<option value="New Category">New Category</option>
```

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Dependencies missing
```bash
npm install
```

### TypeScript errors
```bash
npm run build  # Check for errors
```

### Clear cache
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 📚 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Charts
- **Lucide React** - Icons

---

## 🎯 Next Steps

### Session 3: Order Management
- [ ] Order list view
- [ ] Create order flow
- [ ] Order details page
- [ ] Status management
- [ ] Invoice generation

### Future Sessions
- [ ] Customer Management (CRM)
- [ ] Marketplace module
- [ ] Analytics & AI features
- [ ] Authentication
- [ ] API integration

---

## 📖 Documentation Files

- `LOGISYNC_PROMPT.md` - Full project requirements
- `PROGRESS.md` - Development progress tracker
- `SESSION_2_SUMMARY.md` - Inventory module details
- `SESSION_3_SUMMARY.md` - Orders page & detail modal
- `SESSION_4_SUMMARY.md` - Order creation flow
- `SESSION_5_SUMMARY.md` - Order status management
- `SESSION_6_SUMMARY.md` - Invoice generation (GST)
- `VISUAL_GUIDE.md` - Component visual reference
- `README.md` - Project overview
- `QUICK_REFERENCE.md` - This file

---

## 💡 Tips

### Inventory Tips
1. **Search is instant** - No need to press Enter
2. **Stats update automatically** - Add/edit/delete products
3. **SKU auto-generates** - Toggle "Auto" button
4. **Profit calculates live** - Change prices to see margin
5. **Confirmation on delete** - Prevents accidents
6. **Tab navigation** - Switch between product views
7. **Responsive design** - Works on mobile

### Orders Tips
8. **Click order row** - Opens detailed view with timeline
9. **Status workflow** - Can only move forward (pending→confirmed→packed→shipped→delivered)
10. **Track shipments** - Tracking number auto-generates on ship status
11. **Generate invoices** - Click "Generate Invoice" for GST-compliant invoice
12. **Print invoices** - Use Ctrl+P or Print button in invoice modal
13. **Order notes** - Status changes append to order notes with timestamps
14. **Stock validation** - Order creation checks available stock

---

## 🎨 Status Badge Guide

| Badge | Color | Meaning |
|-------|-------|---------|
| ⚫ In Stock | Light gray | Stock > reorder level |
| ⚪ Low Stock | Medium gray | Stock < reorder level |
| ⬛ Out of Stock | Black | Stock = 0 |

---

## 🔑 Keyboard Shortcuts (Future)

```
Ctrl + K    → Open search
Ctrl + N    → New product
Esc         → Close modal
```

---

## 📞 Need Help?

1. Check `PROGRESS.md` for detailed feature list
2. Check `VISUAL_GUIDE.md` for design reference
3. Check `SESSION_2_SUMMARY.md` for inventory details
4. Check console for errors (F12 in browser)

---

---

## 🧾 Invoice Generation (NEW!)

### How to Generate Invoice
1. Go to **Orders** page
2. Click on any order row
3. Click **"Generate Invoice"** button
4. View GST-compliant invoice

### Invoice Actions
- **Print**: Click Print button or Ctrl+P
- **Download PDF**: Coming soon (placeholder)
- **Close**: Return to order details

### Invoice Features
- Company details with GSTIN & PAN
- Customer billing address
- Itemized product list with HSN codes
- Smart tax calculation:
  - **Intra-state**: CGST @ 9% + SGST @ 9%
  - **Inter-state**: IGST @ 18%
- Payment details & terms
- Professional A4 layout
- Print-optimized CSS

---

**Quick Reference v2.0**  
Last Updated: October 3, 2025
