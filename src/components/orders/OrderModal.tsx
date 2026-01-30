import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import Modal from '../ui/Modal';
import ordersService, { CreateOrderData, CreateOrderItem, PaymentMethod } from '@/services/orders';
import customersService, { Customer } from '@/services/customers';
import productsService, { Product } from '@/services/products';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create'; // For now, only support creating orders
}

interface OrderItemForm {
  id: string; // Temporary ID for form management
  product_id: number | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

interface FormData {
  customer_id: number | null;
  customer_name: string;
  items: OrderItemForm[];
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  payment_method: PaymentMethod;
  notes: string;
}

interface FormErrors {
  customer_id?: string;
  items?: string;
  shipping_street?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pincode?: string;
}

export default function OrderModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
}: OrderModalProps) {
  const [formData, setFormData] = useState<FormData>({
    customer_id: null,
    customer_name: '',
    items: [],
    shipping_street: '',
    shipping_city: '',
    shipping_state: '',
    shipping_pincode: '',
    payment_method: 'cash',
    notes: '',
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch customers and products on mount
  useEffect(() => {
    if (isOpen) {
      fetchCustomersAndProducts();
    }
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && mode === 'create') {
      setFormData({
        customer_id: null,
        customer_name: '',
        items: [],
        shipping_street: '',
        shipping_city: '',
        shipping_state: '',
        shipping_pincode: '',
        payment_method: 'cash',
        notes: '',
      });
      setErrors({});
      setSubmitError(null);
    }
  }, [isOpen, mode]);

  const fetchCustomersAndProducts = async () => {
    try {
      setLoadingData(true);
      const [customersData, productsData] = await Promise.all([
        customersService.getAll({ limit: 100 }),
        productsService.getAll({ limit: 100, status: 'active' }),
      ]);
      setCustomers(customersData.customers);
      setProducts(productsData.products);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = parseInt(e.target.value);
    const customer = customers.find(c => c.id === customerId);
    
    setFormData(prev => ({
      ...prev,
      customer_id: customerId,
      customer_name: customer?.name || '',
    }));

    if (errors.customer_id) {
      setErrors(prev => ({ ...prev, customer_id: undefined }));
    }
  };

  const handleAddItem = () => {
    const newItem: OrderItemForm = {
      id: `temp-${Date.now()}`,
      product_id: null,
      product_name: '',
      unit_price: 0,
      quantity: 1,
      subtotal: 0,
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const handleItemProductChange = (itemId: string, productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              product_id: productId,
              product_name: product.name,
              unit_price: product.price,
              subtotal: product.price * item.quantity,
            }
          : item
      ),
    }));
  };

  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(1, quantity),
              subtotal: item.unit_price * Math.max(1, quantity),
            }
          : item
      ),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.subtotal, 0);
    const taxRate = 0.18; // 18% GST
    const taxAmount = subtotal * taxRate;
    const shippingCost = subtotal > 10000 ? 0 : 100; // Free shipping above ₹10,000
    const totalAmount = subtotal + taxAmount + shippingCost;

    return {
      subtotal,
      taxAmount,
      shippingCost,
      totalAmount,
    };
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customer_id) {
      newErrors.customer_id = 'Please select a customer';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'Please add at least one product';
    } else {
      const hasInvalidItem = formData.items.some(item => !item.product_id || item.quantity < 1);
      if (hasInvalidItem) {
        newErrors.items = 'Please ensure all items have a product selected and valid quantity';
      }
    }

    if (!formData.shipping_street.trim()) {
      newErrors.shipping_street = 'Street address is required';
    }

    if (!formData.shipping_city.trim()) {
      newErrors.shipping_city = 'City is required';
    }

    if (!formData.shipping_state.trim()) {
      newErrors.shipping_state = 'State is required';
    }

    if (!formData.shipping_pincode.trim()) {
      newErrors.shipping_pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.shipping_pincode)) {
      newErrors.shipping_pincode = 'Pincode must be 6 digits';
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
      const orderItems: CreateOrderItem[] = formData.items.map(item => ({
        product_id: item.product_id!,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      const createData: CreateOrderData = {
        customer_id: formData.customer_id!,
        items: orderItems,
        shipping_street: formData.shipping_street.trim(),
        shipping_city: formData.shipping_city.trim(),
        shipping_state: formData.shipping_state.trim(),
        shipping_pincode: formData.shipping_pincode.trim(),
        payment_method: formData.payment_method,
        notes: formData.notes.trim() || undefined,
      };

      await ordersService.create(createData);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to create order:', error);
      setSubmitError(
        error.response?.data?.message ||
        error.message ||
        'Failed to create order. Please try again.'
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

  const totals = calculateTotals();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Order"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        {submitError && (
          <div className="p-4 bg-neutral-50 border border-neutral-300 rounded-lg">
            <p className="text-sm text-neutral-900">{submitError}</p>
          </div>
        )}

        {/* Customer Selection */}
        <div>
          <label htmlFor="customer_id" className="block text-sm font-medium text-neutral-900 mb-1">
            Customer <span className="text-red-600">*</span>
          </label>
          <select
            id="customer_id"
            name="customer_id"
            value={formData.customer_id || ''}
            onChange={handleCustomerChange}
            className={`input ${errors.customer_id ? 'border-red-500' : ''}`}
            disabled={loading || loadingData}
          >
            <option value="">Select customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.email}
              </option>
            ))}
          </select>
          {errors.customer_id && (
            <p className="mt-1 text-sm text-red-600">{errors.customer_id}</p>
          )}
        </div>

        {/* Order Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-neutral-900">
              Order Items <span className="text-red-600">*</span>
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="btn-secondary text-sm flex items-center gap-1"
              disabled={loading || loadingData}
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {errors.items && (
            <p className="mb-2 text-sm text-red-600">{errors.items}</p>
          )}

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {formData.items.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-neutral-300 rounded-lg">
                <p className="text-sm text-neutral-600">No items added yet</p>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="mt-2 text-sm text-neutral-900 hover:underline"
                  disabled={loading || loadingData}
                >
                  Add your first item
                </button>
              </div>
            ) : (
              formData.items.map(item => (
                <div key={item.id} className="flex gap-2 items-start p-3 border border-neutral-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                    {/* Product Selection */}
                    <div className="md:col-span-6">
                      <select
                        value={item.product_id || ''}
                        onChange={(e) => handleItemProductChange(item.id, parseInt(e.target.value))}
                        className="input text-sm"
                        disabled={loading || loadingData}
                      >
                        <option value="">Select product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ₹{product.price}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemQuantityChange(item.id, parseInt(e.target.value))}
                        className="input text-sm"
                        min="1"
                        placeholder="Qty"
                        disabled={loading || loadingData}
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={`₹${item.unit_price.toFixed(2)}`}
                        className="input text-sm bg-neutral-50"
                        disabled
                      />
                    </div>

                    {/* Subtotal */}
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={`₹${item.subtotal.toFixed(2)}`}
                        className="input text-sm bg-neutral-50 font-medium"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={loading || loadingData}
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-neutral-900">Shipping Address</h3>
          
          <div>
            <label htmlFor="shipping_street" className="block text-xs text-neutral-700 mb-1">
              Street Address <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="shipping_street"
              name="shipping_street"
              value={formData.shipping_street}
              onChange={handleInputChange}
              className={`input ${errors.shipping_street ? 'border-red-500' : ''}`}
              placeholder="123 Main Street"
              disabled={loading}
            />
            {errors.shipping_street && (
              <p className="mt-1 text-xs text-red-600">{errors.shipping_street}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor="shipping_city" className="block text-xs text-neutral-700 mb-1">
                City <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="shipping_city"
                name="shipping_city"
                value={formData.shipping_city}
                onChange={handleInputChange}
                className={`input ${errors.shipping_city ? 'border-red-500' : ''}`}
                placeholder="Mumbai"
                disabled={loading}
              />
              {errors.shipping_city && (
                <p className="mt-1 text-xs text-red-600">{errors.shipping_city}</p>
              )}
            </div>

            <div>
              <label htmlFor="shipping_state" className="block text-xs text-neutral-700 mb-1">
                State <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="shipping_state"
                name="shipping_state"
                value={formData.shipping_state}
                onChange={handleInputChange}
                className={`input ${errors.shipping_state ? 'border-red-500' : ''}`}
                placeholder="Maharashtra"
                disabled={loading}
              />
              {errors.shipping_state && (
                <p className="mt-1 text-xs text-red-600">{errors.shipping_state}</p>
              )}
            </div>

            <div>
              <label htmlFor="shipping_pincode" className="block text-xs text-neutral-700 mb-1">
                Pincode <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="shipping_pincode"
                name="shipping_pincode"
                value={formData.shipping_pincode}
                onChange={handleInputChange}
                className={`input ${errors.shipping_pincode ? 'border-red-500' : ''}`}
                placeholder="400001"
                maxLength={6}
                disabled={loading}
              />
              {errors.shipping_pincode && (
                <p className="mt-1 text-xs text-red-600">{errors.shipping_pincode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Method & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="payment_method" className="block text-sm font-medium text-neutral-900 mb-1">
              Payment Method
            </label>
            <select
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleInputChange}
              className="input"
              disabled={loading}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-neutral-900 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="input"
              placeholder="Special instructions..."
              disabled={loading}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-neutral-50 p-4 rounded-lg space-y-2">
          <h3 className="text-sm font-medium text-neutral-900 mb-3">Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Subtotal</span>
            <span className="text-neutral-900">₹{totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Tax (18% GST)</span>
            <span className="text-neutral-900">₹{totals.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Shipping</span>
            <span className="text-neutral-900">
              {totals.shippingCost === 0 ? 'FREE' : `₹${totals.shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="border-t border-neutral-300 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-medium text-neutral-900">Total</span>
              <span className="font-bold text-lg text-neutral-900">₹{totals.totalAmount.toFixed(2)}</span>
            </div>
          </div>
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
            disabled={loading || loadingData}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Order...
              </span>
            ) : (
              'Create Order'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
