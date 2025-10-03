import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Customer, CustomerSegment, Address } from '@/types';

interface AddEditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSave: (customer: Customer) => void;
}

interface CustomerFormData {
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  gstNumber?: string;
  billingAddress: Address;
  shippingAddresses: Address[];
  segment: CustomerSegment;
}

const emptyAddress: Address = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
};

export default function AddEditCustomerModal({ isOpen, onClose, customer, onSave }: AddEditCustomerModalProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    gstNumber: '',
    billingAddress: { ...emptyAddress },
    shippingAddresses: [{ ...emptyAddress }],
    segment: 'new',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        businessName: customer.businessName || '',
        email: customer.email,
        phone: customer.phone,
        gstNumber: customer.gstNumber || '',
        billingAddress: { ...customer.billingAddress },
        shippingAddresses: customer.shippingAddresses.map(addr => ({ ...addr })),
        segment: customer.segment,
      });
    } else {
      // Reset form for new customer
      setFormData({
        name: '',
        businessName: '',
        email: '',
        phone: '',
        gstNumber: '',
        billingAddress: { ...emptyAddress },
        shippingAddresses: [{ ...emptyAddress }],
        segment: 'new',
      });
    }
    setErrors({});
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    // Validate billing address
    if (!formData.billingAddress.line1.trim()) newErrors.billingLine1 = 'Address line 1 is required';
    if (!formData.billingAddress.city.trim()) newErrors.billingCity = 'City is required';
    if (!formData.billingAddress.state.trim()) newErrors.billingState = 'State is required';
    if (!formData.billingAddress.pincode.trim()) newErrors.billingPincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.billingAddress.pincode)) {
      newErrors.billingPincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newCustomer: Customer = {
      id: customer?.id || `CUST-${Date.now()}`,
      name: formData.name,
      businessName: formData.businessName || undefined,
      email: formData.email,
      phone: formData.phone,
      gstNumber: formData.gstNumber || undefined,
      billingAddress: formData.billingAddress,
      shippingAddresses: formData.shippingAddresses.filter(
        addr => addr.line1.trim() !== '' // Only include addresses with at least line1
      ),
      totalOrders: customer?.totalOrders || 0,
      lifetimeValue: customer?.lifetimeValue || 0,
      segment: formData.segment,
      createdAt: customer?.createdAt || new Date(),
    };

    onSave(newCustomer);
    onClose();
  };

  const handleAddressChange = (type: 'billing' | 'shipping', index: number, field: keyof Address, value: string) => {
    if (type === 'billing') {
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        shippingAddresses: prev.shippingAddresses.map((addr, i) =>
          i === index ? { ...addr, [field]: value } : addr
        ),
      }));
    }
  };

  const handleAddShippingAddress = () => {
    setFormData(prev => ({
      ...prev,
      shippingAddresses: [...prev.shippingAddresses, { ...emptyAddress }],
    }));
  };

  const handleRemoveShippingAddress = (index: number) => {
    if (formData.shippingAddresses.length > 1) {
      setFormData(prev => ({
        ...prev,
        shippingAddresses: prev.shippingAddresses.filter((_, i) => i !== index),
      }));
    }
  };

  const handleCopyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shippingAddresses: [{ ...prev.billingAddress }],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-minimal-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-neutral-900">
              {customer ? 'Edit Customer' : 'Add New Customer'}
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
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`input w-full ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Rajesh Sharma"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="input w-full"
                    placeholder="Sharma Retail Store"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`input w-full ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="rajesh@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`input w-full ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                    className="input w-full font-mono"
                    placeholder="29ABCDE1234F1Z5"
                    maxLength={15}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Customer Segment
                  </label>
                  <select
                    value={formData.segment}
                    onChange={(e) => setFormData({ ...formData, segment: e.target.value as CustomerSegment })}
                    className="input w-full"
                  >
                    <option value="new">New (&lt; ₹10K LTV)</option>
                    <option value="regular">Regular (₹10K - ₹1L LTV)</option>
                    <option value="premium">Premium (&gt; ₹1L LTV)</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-1">
                    Segment auto-updates based on lifetime value
                  </p>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Billing Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.line1}
                    onChange={(e) => handleAddressChange('billing', 0, 'line1', e.target.value)}
                    className={`input w-full ${errors.billingLine1 ? 'border-red-500' : ''}`}
                    placeholder="123 MG Road"
                  />
                  {errors.billingLine1 && <p className="text-xs text-red-500 mt-1">{errors.billingLine1}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.line2 || ''}
                    onChange={(e) => handleAddressChange('billing', 0, 'line2', e.target.value)}
                    className="input w-full"
                    placeholder="Near Central Mall"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.city}
                    onChange={(e) => handleAddressChange('billing', 0, 'city', e.target.value)}
                    className={`input w-full ${errors.billingCity ? 'border-red-500' : ''}`}
                    placeholder="Bangalore"
                  />
                  {errors.billingCity && <p className="text-xs text-red-500 mt-1">{errors.billingCity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.state}
                    onChange={(e) => handleAddressChange('billing', 0, 'state', e.target.value)}
                    className={`input w-full ${errors.billingState ? 'border-red-500' : ''}`}
                    placeholder="Karnataka"
                  />
                  {errors.billingState && <p className="text-xs text-red-500 mt-1">{errors.billingState}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress.pincode}
                    onChange={(e) => handleAddressChange('billing', 0, 'pincode', e.target.value)}
                    className={`input w-full ${errors.billingPincode ? 'border-red-500' : ''}`}
                    placeholder="560001"
                    maxLength={6}
                  />
                  {errors.billingPincode && <p className="text-xs text-red-500 mt-1">{errors.billingPincode}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Addresses */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">Shipping Addresses</h3>
                <button
                  type="button"
                  onClick={handleCopyBillingToShipping}
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Copy from billing
                </button>
              </div>

              {formData.shippingAddresses.map((address, index) => (
                <div key={index} className="mb-4 p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-neutral-700">
                      Shipping Address {formData.shippingAddresses.length > 1 ? `#${index + 1}` : ''}
                    </h4>
                    {formData.shippingAddresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveShippingAddress(index)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={address.line1}
                        onChange={(e) => handleAddressChange('shipping', index, 'line1', e.target.value)}
                        className="input w-full"
                        placeholder="123 MG Road"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={address.line2 || ''}
                        onChange={(e) => handleAddressChange('shipping', index, 'line2', e.target.value)}
                        className="input w-full"
                        placeholder="Near Central Mall"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => handleAddressChange('shipping', index, 'city', e.target.value)}
                        className="input w-full"
                        placeholder="Bangalore"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => handleAddressChange('shipping', index, 'state', e.target.value)}
                        className="input w-full"
                        placeholder="Karnataka"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => handleAddressChange('shipping', index, 'pincode', e.target.value)}
                        className="input w-full"
                        placeholder="560001"
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddShippingAddress}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Shipping Address
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {customer ? 'Update Customer' : 'Add Customer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
