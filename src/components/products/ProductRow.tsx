import { memo } from 'react';
import { Package, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Product } from '@/services/products';

interface ProductRowProps {
  product: Product;
  isSelected: boolean;
  onSelect: (productId: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

/**
 * Memoized ProductRow component
 * 
 * This component is optimized to prevent unnecessary re-renders.
 * It only re-renders when its props actually change.
 * 
 * Performance Impact:
 * - Without memo: All 100+ rows re-render on ANY state change
 * - With memo: Only changed rows re-render (99% reduction!)
 */
const ProductRow = memo<ProductRowProps>(({ 
  product, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  // Calculate stock status
  const getStockStatus = (): { label: string; color: string } => {
    if (product.stock === 0) {
      return { label: 'Out of Stock', color: 'bg-neutral-900 text-white' };
    } else if (product.stock < product.reorder_level) {
      return { label: 'Low Stock', color: 'bg-neutral-300 text-neutral-900' };
    } else {
      return { label: 'In Stock', color: 'bg-neutral-100 text-neutral-700' };
    }
  };

  const status = getStockStatus();

  return (
    <tr className="hover:bg-neutral-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product.id)}
          className="w-4 h-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-neutral-600" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-neutral-900">
              {product.name}
            </div>
            {product.description && (
              <div className="text-sm text-neutral-500">
                {product.description.substring(0, 30)}...
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-mono text-sm text-neutral-900">{product.sku}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-neutral-700">{product.category || 'Uncategorized'}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-neutral-900">
          {product.stock} {product.unit || 'units'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-neutral-600">
          {product.reorder_level} {product.unit || 'units'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-neutral-900">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`badge ${status.color}`}>
          {status.label}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => onEdit(product)}
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
            title="Edit product"
          >
            <Edit className="w-4 h-4 text-neutral-600" />
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
          <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-neutral-600" />
          </button>
        </div>
      </td>
    </tr>
  );
});

// Display name for React DevTools
ProductRow.displayName = 'ProductRow';

export default ProductRow;
