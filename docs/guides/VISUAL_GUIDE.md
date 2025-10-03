# LogiSync - Visual Component Guide

## 🎨 Inventory Management System - Component Breakdown

### Page Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ INVENTORY MANAGEMENT                      [Export] [Import] [+] │
│ Manage your products, track stock levels, and monitor movements │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ 📦  5    │  │ ⬇️  2    │  │ ⚠️  0    │  │ 📦 ₹... │       │
│  │ Total    │  │ Low      │  │ Out of   │  │ Total    │       │
│  │ Products │  │ Stock    │  │ Stock    │  │ Value    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
├─────────────────────────────────────────────────────────────────┤
│ [Products] [Stock Movements] [Low Stock Alerts]                 │
├─────────────────────────────────────────────────────────────────┤
│ 🔍 Search...                    [All Categories ▼] [More Filters]│
├─────────────────────────────────────────────────────────────────┤
│ Product      │ SKU          │ Category │ Stock │ Status │ Actions│
│──────────────┼──────────────┼──────────┼───────┼────────┼───────│
│ 📦 Rice      │ SKU-2024-001 │ Food     │ 450kg │ ⚫ In  │ ✏️ 🗑️ ⋮│
│ Basmati rice │              │          │       │ Stock  │        │
│──────────────┼──────────────┼──────────┼───────┼────────┼───────│
│ 📦 Wheat     │ SKU-2024-002 │ Food     │ 85kg  │ ⚪ Low │ ✏️ 🗑️ ⋮│
│ Organic...   │              │          │       │ Stock  │        │
└─────────────────────────────────────────────────────────────────┘
```

### Product Modal Structure

```
┌───────────────────────────────────────────────────────────┐
│  Add New Product                                      [×] │
├───────────────────────────────────────────────────────────┤
│  BASIC INFORMATION                                        │
│  Product Name *: [________________]                       │
│  SKU *: [SKU-XXX-0000]  [Auto]                           │
│  Category *: [Food & Beverages ▼]                        │
│  Description: [___________________]                       │
│              [___________________]                       │
│                                                           │
│  PRICING                                                  │
│  Unit Price (₹) *: [180.00]  Cost Price (₹) *: [120.00] │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Profit Margin: ₹60.00 (50.0%)                     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  INVENTORY                                                │
│  Current Stock *: [450]  Reorder Level *: [100]          │
│  Unit *: [kg ▼]                                          │
│                                                           │
│  SUPPLIER INFORMATION                                     │
│  Supplier Name: [AgriSupply Co.]                         │
│  Supplier Contact: [+91 xxxxx xxxxx]                     │
│                                                           │
│                                   [Cancel] [Add Product] │
└───────────────────────────────────────────────────────────┘
```

### Low Stock Alerts Tab

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️  Low Stock Alerts                                        │
│    2 products need attention                                │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 📦  Organic Wheat Flour                      [Reorder]  ││
│ │     Current: 85 kg | Reorder Level: 100 kg             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 📦  Mustard Oil                              [Reorder]  ││
│ │     Current: 30 liters | Reorder Level: 50 liters      ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System Reference

### Colors Used

#### Backgrounds
```
White:        #ffffff   │ Card backgrounds
Neutral 50:   #fafafa   │ Table headers, hover states
Neutral 100:  #f5f5f5   │ Icon containers, badges
Neutral 900:  #171717   │ Primary buttons, text
```

#### Status Badge Colors
```
⚫ In Stock:      bg-neutral-100 text-neutral-700
⚪ Low Stock:     bg-neutral-300 text-neutral-900
⬛ Out of Stock:  bg-neutral-900 text-white
```

#### Borders
```
All borders: border-neutral-200 (#e5e5e5)
Active tab:  border-neutral-900 (#171717)
```

### Typography

```
Page Title:     text-3xl font-bold (30px bold)
Card Title:     text-lg font-bold (18px bold)
Section Title:  text-lg font-semibold (18px semi-bold)
Body Text:      text-sm (14px regular)
Table Header:   text-xs font-medium uppercase (12px medium)
```

### Spacing

```
Page padding:     p-8 (32px)
Card padding:     p-6 (24px)
Table cell:       px-6 py-4 (24px, 16px)
Button padding:   px-4 py-2 (16px, 8px)
Gap between:      gap-4 (16px)
```

### Border Radius

```
Cards:       rounded-lg (8px)
Buttons:     rounded-lg (8px)
Badges:      rounded-full (9999px)
Icons:       rounded-lg (8px)
```

---

## 📐 Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Stacked cards
- Full-width search
- Horizontal scroll on table
- Bottom actions

### Tablet (640px - 1024px)
- 2-column card grid
- Side-by-side filters
- Readable table

### Desktop (> 1024px)
- 4-column card grid
- Inline filters
- Full table visible
- Sidebar always visible

---

## 🎭 Interactive States

### Buttons
```
Default:  bg-neutral-900 text-white
Hover:    bg-neutral-800 (slightly lighter)
Focus:    ring-2 ring-neutral-500 (outline)
Active:   scale-down effect
```

### Table Rows
```
Default:  bg-white
Hover:    bg-neutral-50 (light gray)
```

### Inputs
```
Default:  border-neutral-300
Focus:    ring-2 ring-neutral-900 border-transparent
Error:    border-red-500 (future)
```

### Modal
```
Enter:    Fade in backdrop + scale up modal
Exit:     Fade out backdrop + scale down modal
```

---

## 🔧 Component Props

### ProductModal
```typescript
interface ProductModalProps {
  isOpen: boolean;          // Controls visibility
  onClose: () => void;      // Close callback
  product?: Product;        // If editing (undefined = add mode)
  onSave: (data) => void;   // Save callback
}
```

### Usage
```tsx
<ProductModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  product={editingProduct}  // or undefined
  onSave={handleSave}
/>
```

---

## 🎯 User Interaction Flows

### 1. Add Product Flow
```
Click "Add Product"
  ↓
Modal opens (empty form)
  ↓
Type product name
  ↓
SKU auto-generates (if Auto enabled)
  ↓
Fill required fields
  ↓
See profit calculate as you type
  ↓
Click "Add Product"
  ↓
Modal closes
  ↓
Table updates instantly
  ↓
Stats cards update
```

### 2. Edit Product Flow
```
Click Edit icon (✏️)
  ↓
Modal opens (pre-filled)
  ↓
Change any fields
  ↓
Click "Update Product"
  ↓
Table row updates instantly
  ↓
Stats recalculate
```

### 3. Search Flow
```
Type in search box
  ↓
Table filters in real-time
  ↓
Empty state if no matches
  ↓
Clear search → All products return
```

### 4. Alert Check Flow
```
Click "Low Stock Alerts" tab
  ↓
See count: "X products need attention"
  ↓
View filtered list
  ↓
Click "Reorder" (future feature)
```

---

## 📊 Data Flow

```
Mock Data (mockData.ts)
        ↓
  [useState] in Inventory.tsx
        ↓
  Filter by search/category
        ↓
  Render in table
        ↓
  User action (add/edit/delete)
        ↓
  Update state
        ↓
  Re-render (automatic)
        ↓
  Stats recalculate (automatic)
```

---

## 🎨 Icon Usage

| Icon | Meaning | Where Used |
|------|---------|------------|
| 📦 Package | Product/Inventory | Stats, table, alerts |
| ➕ Plus | Add action | Add Product button |
| ✏️ Edit | Edit action | Table actions |
| 🗑️ Trash | Delete action | Table actions |
| 🔍 Search | Search function | Search bar |
| ⬇️ Download | Export action | Export button |
| ⬆️ Upload | Import action | Import button |
| ⚠️ Alert | Warning/Alert | Low stock card |
| ⬇️ TrendingDown | Decreasing | Low stock card |
| ⋮ MoreVertical | More options | Table actions |
| ✖️ X | Close | Modal close |

---

**Visual Guide Complete!**  
Use this as reference for maintaining design consistency.
