import { X } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSave: (product: Partial<Product>) => void;
}

export default function ProductModal({ isOpen, onClose, product, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category || '',
    description: product?.description || '',
    unitPrice: product?.unitPrice || 0,
    costPrice: product?.costPrice || 0,
    currentStock: product?.currentStock || 0,
    reorderLevel: product?.reorderLevel || 0,
    unit: product?.unit || 'pieces' as const,
    supplierName: product?.supplier?.name || '',
    supplierContact: product?.supplier?.contact || '',
  });

  const [autoGenerateSKU, setAutoGenerateSKU] = useState(!product);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Price') || name.includes('Stock') || name.includes('Level') 
        ? parseFloat(value) || 0 
        : value
    }));

    // Auto-generate SKU based on product name
    if (name === 'name' && autoGenerateSKU) {
      const skuPrefix = value.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 3);
      const skuNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setFormData(prev => ({
        ...prev,
        sku: `SKU-${skuPrefix}-${skuNumber}`
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Partial<Product> = {
      ...product,
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      description: formData.description,
      unitPrice: formData.unitPrice,
      costPrice: formData.costPrice,
      currentStock: formData.currentStock,
      reorderLevel: formData.reorderLevel,
      unit: formData.unit,
      supplier: {
        name: formData.supplierName,
        contact: formData.supplierContact,
      },
      updatedAt: new Date(),
    };

    if (!product) {
      productData.id = `PRD-${Math.floor(Math.random() * 10000)}`;
      productData.createdAt = new Date();
      productData.locations = [{ warehouseId: 'WH-001', quantity: formData.currentStock }];
    }

    onSave(productData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-minimal-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    SKU *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      required
                      disabled={autoGenerateSKU}
                      className="input"
                      placeholder="SKU-XXX-0000"
                    />
                    {!product && (
                      <button
                        type="button"
                        onClick={() => setAutoGenerateSKU(!autoGenerateSKU)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          autoGenerateSKU 
                            ? 'bg-neutral-900 text-white border-neutral-900' 
                            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                        }`}
                      >
                        Auto
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    <option value="">Select category</option>
                    <option value="Food & Beverages">Food & Beverages</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="input resize-none"
                    placeholder="Enter product description"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Unit Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Cost Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="0.00"
                  />
                </div>

                <div className="md:col-span-2 p-3 bg-neutral-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Profit Margin:</span>
                    <span className="font-medium text-neutral-900">
                      ₹{(formData.unitPrice - formData.costPrice).toFixed(2)} 
                      {formData.costPrice > 0 && (
                        <span className="text-neutral-500 ml-2">
                          ({((formData.unitPrice - formData.costPrice) / formData.costPrice * 100).toFixed(1)}%)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    name="currentStock"
                    value={formData.currentStock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="input"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Reorder Level *
                  </label>
                  <input
                    type="number"
                    name="reorderLevel"
                    value={formData.reorderLevel}
                    onChange={handleChange}
                    required
                    min="0"
                    className="input"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Unit *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    <option value="pieces">Pieces</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="liters">Liters (L)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Supplier Information */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Supplier Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter supplier name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Supplier Contact
                  </label>
                  <input
                    type="text"
                    name="supplierContact"
                    value={formData.supplierContact}
                    onChange={handleChange}
                    className="input"
                    placeholder="+91 xxxxx xxxxx"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {product ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
