import { useState, useEffect } from 'react';
import { X, User, Package, MapPin, FileText, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { Customer, Product, Order, OrderItem } from '@/types';
import { mockCustomers, mockProducts } from '@/data/mockData';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Partial<Order>) => void;
}

type Step = 1 | 2 | 3 | 4;

interface OrderFormData {
  customer: Customer | null;
  items: OrderItem[];
  shippingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryType: 'standard' | 'express';
  paymentStatus: 'pending' | 'partial' | 'paid';
  notes: string;
}

export default function CreateOrderModal({ isOpen, onClose, onSubmit }: CreateOrderModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<OrderFormData>({
    customer: null,
    items: [],
    shippingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
    },
    deliveryType: 'standard',
    paymentStatus: 'pending',
    notes: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Map<string, number>>(new Map());

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setFormData({
        customer: null,
        items: [],
        shippingAddress: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          pincode: '',
        },
        deliveryType: 'standard',
        paymentStatus: 'pending',
        notes: '',
      });
      setSearchQuery('');
      setSelectedProducts(new Map());
    }
  }, [isOpen]);

  // Auto-fill shipping address when customer is selected
  useEffect(() => {
    if (formData.customer) {
      const address = formData.customer.shippingAddresses[0] || formData.customer.billingAddress;
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          line1: address.line1,
          line2: address.line2 || '',
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
      }));
    }
  }, [formData.customer]);

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.18; // 18% GST
    const shippingCost = formData.deliveryType === 'express' ? 200 : 100;
    const total = subtotal + tax + shippingCost;

    return { subtotal, tax, shippingCost, total };
  };

  const handleAddProduct = (product: Product) => {
    const quantity = selectedProducts.get(product.id) || 1;
    
    // Stock validation
    if (quantity > product.currentStock) {
      alert(`Only ${product.currentStock} units available in stock!`);
      return;
    }

    const existingItemIndex = formData.items.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...formData.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity,
        total: quantity * product.unitPrice,
      };
      setFormData(prev => ({ ...prev, items: updatedItems }));
    } else {
      // Add new item
      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity,
        unitPrice: product.unitPrice,
        total: quantity * product.unitPrice,
      };
      setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }
    
    setSelectedProducts(new Map());
    setSearchQuery('');
  };

  const handleRemoveProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId !== productId),
    }));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity > product.currentStock) {
      alert(`Only ${product.currentStock} units available!`);
      return;
    }

    if (newQuantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }

    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice }
          : item
      ),
    }));
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.customer !== null;
      case 2:
        return formData.items.length > 0;
      case 3:
        return (
          formData.shippingAddress.line1 &&
          formData.shippingAddress.city &&
          formData.shippingAddress.state &&
          formData.shippingAddress.pincode.length === 6
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!formData.customer) return;

    const { subtotal, tax, shippingCost, total } = calculateTotals();

    const newOrder: Partial<Order> = {
      orderNumber: `ORD-${Date.now()}`,
      customerId: formData.customer.id,
      customerName: formData.customer.name,
      items: formData.items,
      subtotal,
      tax,
      shippingCost,
      total,
      status: 'pending',
      paymentStatus: formData.paymentStatus,
      deliveryType: formData.deliveryType,
      shippingAddress: formData.shippingAddress,
      notes: formData.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onSubmit(newOrder);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Customer', icon: User },
    { number: 2, title: 'Products', icon: Package },
    { number: 3, title: 'Shipping', icon: MapPin },
    { number: 4, title: 'Review', icon: FileText },
  ];

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-minimal-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Create New Order</h2>
              <p className="text-sm text-neutral-600 mt-1">Step {currentStep} of 4</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted
                            ? 'bg-neutral-900 border-neutral-900 text-white'
                            : isActive
                            ? 'bg-white border-neutral-900 text-neutral-900'
                            : 'bg-white border-neutral-300 text-neutral-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            isActive || isCompleted ? 'text-neutral-900' : 'text-neutral-500'
                          }`}
                        >
                          {step.title}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 h-0.5 mx-4 bg-neutral-200">
                        <div
                          className={`h-full transition-all ${
                            isCompleted ? 'bg-neutral-900' : 'bg-neutral-200'
                          }`}
                          style={{ width: isCompleted ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Select Customer */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Search Customer
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => setFormData(prev => ({ ...prev, customer }))}
                      className={`card p-4 cursor-pointer transition-all ${
                        formData.customer?.id === customer.id
                          ? 'border-neutral-900 bg-neutral-50'
                          : 'hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-neutral-900">{customer.name}</h3>
                          <p className="text-sm text-neutral-600">{customer.email}</p>
                          <p className="text-sm text-neutral-600">{customer.phone}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-medium text-neutral-500 uppercase">
                            {customer.segment}
                          </span>
                          <p className="text-sm text-neutral-600 mt-1">
                            {customer.billingAddress.city}, {customer.billingAddress.state}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Products */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Search Products
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Search by name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Selected Products */}
                {formData.items.length > 0 && (
                  <div className="card p-4">
                    <h3 className="font-semibold text-neutral-900 mb-3">Selected Products</h3>
                    <div className="space-y-2">
                      {formData.items.map((item) => {
                        const product = mockProducts.find(p => p.id === item.productId);
                        return (
                          <div
                            key={item.productId}
                            className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-neutral-900">{item.productName}</p>
                              <p className="text-sm text-neutral-600">
                                {formatCurrency(item.unitPrice)} each
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-300 rounded hover:bg-neutral-100"
                                >
                                  -
                                </button>
                                <span className="w-12 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-300 rounded hover:bg-neutral-100"
                                  disabled={product && item.quantity >= product.currentStock}
                                >
                                  +
                                </button>
                              </div>
                              <p className="w-24 text-right font-bold text-neutral-900">
                                {formatCurrency(item.total)}
                              </p>
                              <button
                                onClick={() => handleRemoveProduct(item.productId)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Available Products */}
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Available Products</h3>
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="card p-4 hover:border-neutral-400 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-neutral-900">{product.name}</h4>
                            <p className="text-sm text-neutral-600">SKU: {product.sku}</p>
                            <p className="text-sm text-neutral-600">
                              Stock: {product.currentStock} {product.unit}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-lg font-bold text-neutral-900">
                              {formatCurrency(product.unitPrice)}
                            </p>
                            <input
                              type="number"
                              min="1"
                              max={product.currentStock}
                              value={selectedProducts.get(product.id) || 1}
                              onChange={(e) => {
                                const newMap = new Map(selectedProducts);
                                newMap.set(product.id, parseInt(e.target.value) || 1);
                                setSelectedProducts(newMap);
                              }}
                              className="w-20 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500"
                            />
                            <button
                              onClick={() => handleAddProduct(product)}
                              className="btn-primary"
                              disabled={product.currentStock === 0}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Shipping Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Street address, P.O. box"
                      value={formData.shippingAddress.line1}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          shippingAddress: { ...prev.shippingAddress, line1: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Apartment, suite, etc."
                      value={formData.shippingAddress.line2}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          shippingAddress: { ...prev.shippingAddress, line2: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="City"
                      value={formData.shippingAddress.city}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          shippingAddress: { ...prev.shippingAddress, city: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="State"
                      value={formData.shippingAddress.state}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          shippingAddress: { ...prev.shippingAddress, state: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="6-digit PIN code"
                      maxLength={6}
                      value={formData.shippingAddress.pincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData(prev => ({
                          ...prev,
                          shippingAddress: { ...prev.shippingAddress, pincode: value },
                        }));
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      Delivery Type
                    </label>
                    <select
                      className="input"
                      value={formData.deliveryType}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          deliveryType: e.target.value as 'standard' | 'express',
                        }))
                      }
                    >
                      <option value="standard">Standard (₹100)</option>
                      <option value="express">Express (₹200)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Any special instructions..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-4">
                {/* Customer Info */}
                <div className="card p-4">
                  <h3 className="font-semibold text-neutral-900 mb-3">Customer</h3>
                  <p className="text-sm text-neutral-600">{formData.customer?.name}</p>
                  <p className="text-sm text-neutral-600">{formData.customer?.email}</p>
                  <p className="text-sm text-neutral-600">{formData.customer?.phone}</p>
                </div>

                {/* Shipping Address */}
                <div className="card p-4">
                  <h3 className="font-semibold text-neutral-900 mb-3">Shipping Address</h3>
                  <p className="text-sm text-neutral-600">{formData.shippingAddress.line1}</p>
                  {formData.shippingAddress.line2 && (
                    <p className="text-sm text-neutral-600">{formData.shippingAddress.line2}</p>
                  )}
                  <p className="text-sm text-neutral-600">
                    {formData.shippingAddress.city}, {formData.shippingAddress.state} -{' '}
                    {formData.shippingAddress.pincode}
                  </p>
                  <p className="text-sm text-neutral-600 mt-2 capitalize">
                    Delivery: {formData.deliveryType}
                  </p>
                </div>

                {/* Order Items */}
                <div className="card p-4">
                  <h3 className="font-semibold text-neutral-900 mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {formData.items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-neutral-900">
                          {item.productName} × {item.quantity}
                        </span>
                        <span className="font-medium text-neutral-900">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="card p-4">
                  <h3 className="font-semibold text-neutral-900 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Subtotal</span>
                      <span className="font-medium text-neutral-900">
                        {formatCurrency(totals.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Tax (GST 18%)</span>
                      <span className="font-medium text-neutral-900">
                        {formatCurrency(totals.tax)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Shipping</span>
                      <span className="font-medium text-neutral-900">
                        {formatCurrency(totals.shippingCost)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-neutral-900">Total</span>
                        <span className="text-lg font-bold text-neutral-900">
                          {formatCurrency(totals.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Payment Status
                  </label>
                  <select
                    className="input"
                    value={formData.paymentStatus}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        paymentStatus: e.target.value as 'pending' | 'partial' | 'paid',
                      }))
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Footer with Navigation */}
          <div className="bg-neutral-50 border-t border-neutral-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as Step)}
              disabled={currentStep === 1}
              className="btn-secondary flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1) as Step)}
                disabled={!canProceedToNextStep()}
                className="btn-primary flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary">
                Create Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
