# React Memoization Quick Reference

**Quick guide for implementing memoized table rows in LogiSync**

---

## TL;DR Pattern

```tsx
// 1. Create row component with memo()
const ProductRow = memo<ProductRowProps>(({ product, isSelected, onSelect }) => {
  return <tr>{/* row content */}</tr>;
});

// 2. Wrap parent handlers with useCallback
const handleSelect = useCallback((id) => {
  setSelected(prev => new Set(prev).add(id));
}, []); // ← Use setState updater to minimize deps

// 3. Replace inline rendering
{products.map(product => (
  <ProductRow key={product.id} product={product} onSelect={handleSelect} />
))}
```

---

## Component Template

```tsx
import { memo } from 'react';
import { IconName } from 'lucide-react';
import { DataType } from '@/services/moduleName';

interface RowProps {
  data: DataType;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onEdit: (data: DataType) => void;
  onDelete: (id: number) => void;
}

const DataRow = memo<RowProps>(({ data, isSelected, onSelect, onEdit, onDelete }) => {
  // Move any row-specific calculations here
  const calculatedValue = data.field1 * data.field2;
  
  return (
    <tr className="hover:bg-neutral-50">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(data.id)}
        />
      </td>
      {/* More cells */}
    </tr>
  );
});

DataRow.displayName = 'DataRow';

export default DataRow;
```

---

## Parent Component Pattern

```tsx
import { useCallback } from 'react';
import DataRow from '@/components/module/DataRow';

export default function DataPage() {
  const [data, setData] = useState<DataType[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // ✅ Wrap fetch in useCallback
  const fetchData = useCallback(async () => {
    const response = await api.getAll();
    setData(response.data);
  }, [/* only add deps that affect the fetch */]);

  // ✅ Use setState updater pattern (no deps needed!)
  const handleSelect = useCallback((id: number) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // ✅ Wrap handlers with deps
  const handleDelete = useCallback(async (id: number) => {
    await api.delete(id);
    fetchData();
  }, [fetchData]);

  return (
    <table>
      <tbody>
        {data.map(item => (
          <DataRow
            key={item.id}
            data={item}
            isSelected={selected.has(item.id)}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </tbody>
    </table>
  );
}
```

---

## Common Patterns

### 1. setState Updater (Preferred)

```tsx
// ✅ GOOD: No dependencies needed
const handleSelect = useCallback((id) => {
  setSelected(prev => new Set(prev).add(id));
}, []);

// ❌ BAD: Depends on selected state
const handleSelect = useCallback((id) => {
  setSelected(selected.add(id));
}, [selected]); // ← Changes every time!
```

### 2. Handler with Dependencies

```tsx
// ✅ GOOD: Include all used functions
const handleDelete = useCallback((id) => {
  api.delete(id);
  fetchData();  // ← Used in function
}, [fetchData]); // ← Listed in deps

// ❌ BAD: Missing dependency
const handleDelete = useCallback((id) => {
  api.delete(id);
  fetchData();  // ← Used but not in deps
}, []); // ← Will use stale fetchData!
```

### 3. Multiple Operations

```tsx
// ✅ GOOD: List all dependencies
const handleSave = useCallback(async (data) => {
  await api.update(data);
  fetchProducts();
  fetchCategories();
  showNotification();
}, [fetchProducts, fetchCategories, showNotification]);
```

---

## Dos and Don'ts

### ✅ DO

- **Extract rows into separate components**
- **Wrap with `memo()`**
- **Use `useCallback` for all event handlers**
- **Use setState updater functions**
- **Add `displayName` for debugging**
- **Move row-specific logic into row component**
- **Define TypeScript interfaces for props**

### ❌ DON'T

- **Don't create inline functions in JSX** - `onClick={() => ...}`
- **Don't create new objects in render** - `style={{ color: 'red' }}`
- **Don't forget useCallback dependencies** - Add everything used in function
- **Don't over-memoize** - Only memoize expensive components
- **Don't use deep comparison** - Unless absolutely necessary
- **Don't memo the parent** - Only child rows need memo

---

## Debugging

### Check if memo() is working

```tsx
const ProductRow = memo<ProductRowProps>(({ product }) => {
  console.log('ProductRow rendered:', product.id); // ← Add this
  return <tr>...</tr>;
});
```

**Expected:** Console log only for rows that actually changed

### Verify function stability

```tsx
const handleSelect = useCallback((id) => {
  console.log('handleSelect called');
}, []);

// In render:
console.log('Render count:', ++renderCount); // ← Track renders
```

### React DevTools Profiler

1. Install React DevTools extension
2. Open DevTools → Profiler tab
3. Click Record ⏺
4. Perform action (e.g., check box)
5. Click Stop ⏹
6. Analyze flamegraph

**Expected:** Only 1-2 components in flamegraph, not all 500 rows

---

## Performance Checklist

- [ ] Row component wrapped with `memo()`
- [ ] All event handlers wrapped with `useCallback`
- [ ] setState updater pattern used where possible
- [ ] No inline functions in JSX
- [ ] No new objects created in render
- [ ] TypeScript interfaces defined
- [ ] `displayName` added for debugging
- [ ] Build succeeds without errors
- [ ] Functionality works correctly
- [ ] Profiler shows < 5 components re-rendering

---

## When to Use

### ✅ Use memo() when:

- **Large lists** (100+ items)
- **Frequent updates** (checkboxes, selections)
- **Heavy rendering** (complex calculations, lots of JSX)
- **Noticeable lag** (user sees delay)

### ❌ Skip memo() when:

- **Small lists** (< 20 items)
- **Rare updates** (static content)
- **Light rendering** (simple text display)
- **No performance issue** (already fast)

---

## File Structure

```
src/
├── components/
│   ├── products/
│   │   ├── ProductRow.tsx        ← Memoized row
│   │   └── ProductModal.tsx
│   ├── customers/
│   │   ├── CustomerRow.tsx       ← Memoized row
│   │   └── CustomerModal.tsx
│   └── warehouses/
│       ├── WarehouseRow.tsx      ← Memoized row
│       └── WarehouseModal.tsx
└── pages/
    ├── Inventory.tsx             ← Uses ProductRow
    ├── Customers.tsx             ← Uses CustomerRow
    └── Warehouses.tsx            ← Uses WarehouseRow
```

---

## Naming Convention

- **Row Component:** `[Module]Row.tsx` (e.g., `ProductRow.tsx`)
- **Props Interface:** `[Module]RowProps` (e.g., `ProductRowProps`)
- **Display Name:** `'[Module]Row'` (e.g., `'ProductRow'`)
- **Handler Prefix:** `handle[Action]` (e.g., `handleSelect`)

---

## Quick Migration Steps

1. **Create row component file**
2. **Copy row JSX from parent**
3. **Define props interface**
4. **Wrap with `memo()`**
5. **Add `displayName`**
6. **Import `useCallback` in parent**
7. **Wrap all handlers**
8. **Replace inline rendering**
9. **Remove unused code**
10. **Build and test**

---

## Common Errors

### Error: "Cannot find name 'IconName'"

**Fix:** Import icon from lucide-react
```tsx
import { IconName } from 'lucide-react';
```

### Error: "'handler' is declared but never used"

**Fix:** Icon or handler is in imports but removed from JSX
```tsx
// Check if you're actually using it in JSX
```

### Error: "Type 'X' is not assignable to type 'Y'"

**Fix:** Check prop interface matches component usage
```tsx
interface RowProps {
  onSelect: (id: number) => void; // ← Must match parent
}
```

### Warning: "Missing dependencies in useCallback"

**Fix:** Add all used variables to dependency array
```tsx
useCallback(() => {
  doSomething();
  fetchData(); // ← Used here
}, [fetchData]); // ← Must be in deps
```

---

## Links

- [Full Documentation](./TABLE_ROW_MEMOIZATION.md)
- [React.memo API](https://react.dev/reference/react/memo)
- [useCallback Hook](https://react.dev/reference/react/useCallback)

---

**Last Updated:** October 12, 2025
