import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import customersService, { Customer, CreateCustomerData, UpdateCustomerData } from '@/services/customers';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?: Customer | null;
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  business_name: string;
  gst_number: string;
  segment: 'premium' | 'regular' | 'new';
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  business_name?: string;
  gst_number?: string;
  segment?: string;
}

export default function CustomerModal({
  isOpen,
  onClose,
  onSuccess,
  customer,
  mode,
}: CustomerModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    business_name: '',
    gst_number: '',
    segment: 'regular',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        business_name: customer.business_name || '',
        gst_number: customer.gst_number || '',
        segment: customer.segment,
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        name: '',
        email: '',
        phone: '',
        business_name: '',
        gst_number: '',
        segment: 'regular',
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [mode, customer, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      newErrors.name = 'Customer name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must not exceed 100 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Accept various phone formats: +91-9876543210, 9876543210, (123) 456-7890
      const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
      }
    }

    // GST number validation (optional, but validate format if provided)
    if (formData.gst_number.trim()) {
      // Indian GST format: 22AAAAA0000A1Z5
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(formData.gst_number.trim())) {
        newErrors.gst_number = 'Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)';
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
        const createData: CreateCustomerData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          business_name: formData.business_name.trim() || undefined,
          gst_number: formData.gst_number.trim() || undefined,
          segment: formData.segment,
        };
        await customersService.create(createData);
      } else if (mode === 'edit' && customer) {
        const updateData: UpdateCustomerData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          business_name: formData.business_name.trim() || undefined,
          gst_number: formData.gst_number.trim() || undefined,
          segment: formData.segment,
        };
        await customersService.update(customer.id, updateData);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to save customer:', error);
      setSubmitError(
        error.response?.data?.message ||
        error.message ||
        `Failed to ${mode} customer. Please try again.`
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
      title={mode === 'create' ? 'Create Customer' : 'Edit Customer'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Alert */}
        {submitError && (
          <div className="p-4 bg-neutral-50 border border-neutral-300 rounded-lg">
            <p className="text-sm text-neutral-900">{submitError}</p>
          </div>
        )}

        {/* Customer Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-900 mb-1">
            Customer Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter customer name"
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email and Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-1">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="customer@example.com"
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-900 mb-1">
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="+91-9876543210"
              disabled={loading}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Business Name and GST Number Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Business Name */}
          <div>
            <label htmlFor="business_name" className="block text-sm font-medium text-neutral-900 mb-1">
              Business Name
            </label>
            <input
              type="text"
              id="business_name"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className={`input ${errors.business_name ? 'border-red-500' : ''}`}
              placeholder="Company name (optional)"
              disabled={loading}
            />
            {errors.business_name && (
              <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>
            )}
          </div>

          {/* GST Number */}
          <div>
            <label htmlFor="gst_number" className="block text-sm font-medium text-neutral-900 mb-1">
              GST Number
            </label>
            <input
              type="text"
              id="gst_number"
              name="gst_number"
              value={formData.gst_number}
              onChange={handleChange}
              className={`input ${errors.gst_number ? 'border-red-500' : ''}`}
              placeholder="22AAAAA0000A1Z5 (optional)"
              disabled={loading}
            />
            {errors.gst_number && (
              <p className="mt-1 text-sm text-red-600">{errors.gst_number}</p>
            )}
          </div>
        </div>

        {/* Segment */}
        <div>
          <label htmlFor="segment" className="block text-sm font-medium text-neutral-900 mb-1">
            Customer Segment <span className="text-red-600">*</span>
          </label>
          <select
            id="segment"
            name="segment"
            value={formData.segment}
            onChange={handleChange}
            className={`input ${errors.segment ? 'border-red-500' : ''}`}
            disabled={loading}
          >
            <option value="new">New Customer</option>
            <option value="regular">Regular Customer</option>
            <option value="premium">Premium Customer</option>
          </select>
          {errors.segment && (
            <p className="mt-1 text-sm text-red-600">{errors.segment}</p>
          )}
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
              mode === 'create' ? 'Create Customer' : 'Save Changes'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
