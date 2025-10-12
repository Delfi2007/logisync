import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import productsService, { Product, CreateProductData, UpdateProductData } from '@/services/products';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  sku: string;
  category: string;
  price: string;
  cost: string;
  stock: string;
  reorder_level: string;
  description: string;
}

interface FormErrors {
  name?: string;
  sku?: string;
  category?: string;
  price?: string;
  cost?: string;
  stock?: string;
  reorder_level?: string;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSuccess,
  product,
  mode,
}: ProductModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    sku: '',
    category: '',
    price: '',
    cost: '',
    stock: '',
    reorder_level: '10',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Categories (you can fetch these from API later)
  const categories = [
    'Electronics',
    'Clothing',
    'Food & Beverage',
    'Furniture',
    'Books',
    'Toys',
    'Sports',
    'Other',
  ];

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category || '',
        price: product.price.toString(),
        cost: product.cost.toString(),
        stock: product.stock.toString(),
        reorder_level: product.reorder_level?.toString() || '10',
        description: product.description || '',
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        name: '',
        sku: '',
        category: '',
        price: '',
        cost: '',
        stock: '',
        reorder_level: '10',
        description: '',
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [mode, product, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Product name must not exceed 100 characters';
    }

    // SKU validation
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    } else if (!/^[A-Za-z0-9-_]+$/.test(formData.sku)) {
      newErrors.sku = 'SKU can only contain letters, numbers, hyphens, and underscores';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        newErrors.price = 'Price must be a positive number';
      } else if (price > 1000000) {
        newErrors.price = 'Price seems too high';
      }
    }

    // Cost validation
    if (!formData.cost) {
      newErrors.cost = 'Cost is required';
    } else {
      const cost = parseFloat(formData.cost);
      if (isNaN(cost) || cost < 0) {
        newErrors.cost = 'Cost must be a positive number';
      } else if (cost > 1000000) {
        newErrors.cost = 'Cost seems too high';
      }
    }

    // Stock validation
    if (!formData.stock) {
      newErrors.stock = 'Stock is required';
    } else {
      const stock = parseInt(formData.stock);
      if (isNaN(stock) || stock < 0) {
        newErrors.stock = 'Stock must be a non-negative integer';
      }
    }

    // Reorder level validation
    if (formData.reorder_level) {
      const reorderLevel = parseInt(formData.reorder_level);
      if (isNaN(reorderLevel) || reorderLevel < 0) {
        newErrors.reorder_level = 'Reorder level must be a non-negative integer';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      if (mode === 'create') {
        const createData: CreateProductData = {
          name: formData.name.trim(),
          sku: formData.sku.trim(),
          category: formData.category,
          price: parseFloat(formData.price),
          cost: parseFloat(formData.cost),
          stock: parseInt(formData.stock),
          reorder_level: formData.reorder_level ? parseInt(formData.reorder_level) : 10,
          description: formData.description.trim() || undefined,
        };
        await productsService.create(createData);
      } else if (mode === 'edit' && product) {
        const updateData: UpdateProductData = {
          name: formData.name.trim(),
          sku: formData.sku.trim(),
          category: formData.category,
          price: parseFloat(formData.price),
          cost: parseFloat(formData.cost),
          stock: parseInt(formData.stock),
          reorder_level: formData.reorder_level ? parseInt(formData.reorder_level) : 10,
          description: formData.description.trim() || undefined,
        };
        await productsService.update(product.id, updateData);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to save product:', error);
      setSubmitError(
        error.response?.data?.message ||
        error.message ||
        `Failed to ${mode} product. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? 'Create Product' : 'Edit Product'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Alert */}
        {submitError && (
          <div className="p-4 bg-neutral-50 border border-neutral-300 rounded-lg">
            <p className="text-sm text-neutral-900">{submitError}</p>
          </div>
        )}

        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-900 mb-1">
            Product Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter product name"
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* SKU and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SKU */}
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-neutral-900 mb-1">
              SKU <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`input ${errors.sku ? 'border-red-500' : ''}`}
              placeholder="e.g., PROD-001"
              disabled={loading}
            />
            {errors.sku && (
              <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-neutral-900 mb-1">
              Category <span className="text-red-600">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`input ${errors.category ? 'border-red-500' : ''}`}
              disabled={loading}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Price, Cost, Stock, and Reorder Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-neutral-900 mb-1">
              Selling Price (₹) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`input ${errors.price ? 'border-red-500' : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
              disabled={loading}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Cost */}
          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-neutral-900 mb-1">
              Cost Price (₹) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className={`input ${errors.cost ? 'border-red-500' : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
              disabled={loading}
            />
            {errors.cost && (
              <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-neutral-900 mb-1">
              Stock Quantity <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`input ${errors.stock ? 'border-red-500' : ''}`}
              placeholder="0"
              min="0"
              disabled={loading}
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
            )}
          </div>

          {/* Reorder Level */}
          <div>
            <label htmlFor="reorder_level" className="block text-sm font-medium text-neutral-900 mb-1">
              Reorder Level
            </label>
            <input
              type="number"
              id="reorder_level"
              name="reorder_level"
              value={formData.reorder_level}
              onChange={handleChange}
              className={`input ${errors.reorder_level ? 'border-red-500' : ''}`}
              placeholder="10"
              min="0"
              disabled={loading}
            />
            {errors.reorder_level && (
              <p className="mt-1 text-sm text-red-600">{errors.reorder_level}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-900 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input"
            placeholder="Enter product description (optional)"
            rows={3}
            disabled={loading}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              mode === 'create' ? 'Create Product' : 'Save Changes'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
