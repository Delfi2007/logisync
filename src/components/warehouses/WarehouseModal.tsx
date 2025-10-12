import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import warehousesService, { Warehouse, CreateWarehouseData, UpdateWarehouseData } from '@/services/warehouses';

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  warehouse?: Warehouse | null;
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  code: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
  capacity: string;
  occupied: string;
  is_verified: boolean;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  cost_per_sqft: string;
}

interface FormErrors {
  name?: string;
  code?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: string;
  longitude?: string;
  capacity?: string;
  occupied?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  cost_per_sqft?: string;
}

export default function WarehouseModal({
  isOpen,
  onClose,
  onSuccess,
  warehouse,
  mode,
}: WarehouseModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    code: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    capacity: '',
    occupied: '0',
    is_verified: false,
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    cost_per_sqft: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && warehouse) {
      setFormData({
        name: warehouse.name,
        code: warehouse.code,
        street: warehouse.street,
        city: warehouse.city,
        state: warehouse.state,
        pincode: warehouse.pincode,
        latitude: warehouse.latitude?.toString() || '',
        longitude: warehouse.longitude?.toString() || '',
        capacity: warehouse.capacity.toString(),
        occupied: warehouse.occupied.toString(),
        is_verified: warehouse.is_verified,
        contact_person: warehouse.contact_person || '',
        contact_phone: warehouse.contact_phone || '',
        contact_email: warehouse.contact_email || '',
        cost_per_sqft: warehouse.cost_per_sqft?.toString() || '',
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        name: '',
        code: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: '',
        capacity: '',
        occupied: '0',
        is_verified: false,
        contact_person: '',
        contact_phone: '',
        contact_email: '',
        cost_per_sqft: '',
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [mode, warehouse, isOpen]);

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
      newErrors.name = 'Warehouse name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must not exceed 100 characters';
    }

    // Code validation
    if (!formData.code.trim()) {
      newErrors.code = 'Warehouse code is required';
    } else if (!/^[A-Z0-9-_]+$/.test(formData.code)) {
      newErrors.code = 'Code must contain only uppercase letters, numbers, hyphens, and underscores';
    }

    // Street validation
    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    // Pincode validation
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    // Latitude validation
    if (!formData.latitude) {
      newErrors.latitude = 'Latitude is required';
    } else {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'Latitude must be between -90 and 90';
      }
    }

    // Longitude validation
    if (!formData.longitude) {
      newErrors.longitude = 'Longitude is required';
    } else {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'Longitude must be between -180 and 180';
      }
    }

    // Capacity validation
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else {
      const capacity = parseInt(formData.capacity);
      if (isNaN(capacity) || capacity <= 0) {
        newErrors.capacity = 'Capacity must be a positive number';
      }
    }

    // Occupied validation
    if (formData.occupied) {
      const occupied = parseInt(formData.occupied);
      const capacity = parseInt(formData.capacity);
      if (isNaN(occupied) || occupied < 0) {
        newErrors.occupied = 'Occupied space must be a non-negative number';
      } else if (!isNaN(capacity) && occupied > capacity) {
        newErrors.occupied = 'Occupied space cannot exceed capacity';
      }
    }

    // Contact person validation
    if (!formData.contact_person.trim()) {
      newErrors.contact_person = 'Contact person is required';
    }

    // Contact phone validation
    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = 'Contact phone is required';
    } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.contact_phone)) {
      newErrors.contact_phone = 'Invalid phone number format';
    }

    // Contact email validation (optional)
    if (formData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }

    // Cost per sqft validation (optional)
    if (formData.cost_per_sqft && parseFloat(formData.cost_per_sqft) < 0) {
      newErrors.cost_per_sqft = 'Cost must be a positive number';
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
        const createData: CreateWarehouseData = {
          name: formData.name.trim(),
          code: formData.code.trim(),
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          capacity: parseInt(formData.capacity),
          contact_person: formData.contact_person.trim(),
          contact_phone: formData.contact_phone.trim(),
          ...(formData.contact_email && { contact_email: formData.contact_email.trim() }),
          ...(formData.cost_per_sqft && { cost_per_sqft: parseFloat(formData.cost_per_sqft) }),
        };
        await warehousesService.create(createData);
      } else if (mode === 'edit' && warehouse) {
        const updateData: UpdateWarehouseData = {
          name: formData.name.trim(),
          code: formData.code.trim(),
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          capacity: parseInt(formData.capacity),
          occupied: parseInt(formData.occupied),
          is_verified: formData.is_verified,
          contact_person: formData.contact_person.trim(),
          contact_phone: formData.contact_phone.trim(),
          ...(formData.contact_email && { contact_email: formData.contact_email.trim() }),
          ...(formData.cost_per_sqft && { cost_per_sqft: parseFloat(formData.cost_per_sqft) }),
        };
        await warehousesService.update(warehouse.id, updateData);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to save warehouse:', error);
      setSubmitError(
        error.response?.data?.message ||
        error.message ||
        `Failed to ${mode} warehouse. Please try again.`
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
      title={mode === 'create' ? 'Create Warehouse' : 'Edit Warehouse'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Alert */}
        {submitError && (
          <div className="p-4 bg-neutral-50 border border-neutral-300 rounded-lg">
            <p className="text-sm text-neutral-900">{submitError}</p>
          </div>
        )}

        {/* Name and Code Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Warehouse Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-900 mb-1">
              Warehouse Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Main Warehouse"
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Warehouse Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-neutral-900 mb-1">
              Warehouse Code <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={`input ${errors.code ? 'border-red-500' : ''}`}
              placeholder="WH-001"
              disabled={loading}
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code}</p>
            )}
          </div>
        </div>

        {/* Street Address */}
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-neutral-900 mb-1">
            Street Address <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className={`input ${errors.street ? 'border-red-500' : ''}`}
            placeholder="123 Industrial Area"
            disabled={loading}
          />
          {errors.street && (
            <p className="mt-1 text-sm text-red-600">{errors.street}</p>
          )}
        </div>

        {/* City, State, Pincode Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-neutral-900 mb-1">
              City <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`input ${errors.city ? 'border-red-500' : ''}`}
              placeholder="Mumbai"
              disabled={loading}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-neutral-900 mb-1">
              State <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`input ${errors.state ? 'border-red-500' : ''}`}
              placeholder="Maharashtra"
              disabled={loading}
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-neutral-900 mb-1">
              Pincode <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className={`input ${errors.pincode ? 'border-red-500' : ''}`}
              placeholder="400001"
              maxLength={6}
              disabled={loading}
            />
            {errors.pincode && (
              <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
            )}
          </div>
        </div>

        {/* Latitude and Longitude Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Latitude */}
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-neutral-900 mb-1">
              Latitude <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className={`input ${errors.latitude ? 'border-red-500' : ''}`}
              placeholder="19.0760"
              disabled={loading}
            />
            {errors.latitude && (
              <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
            )}
          </div>

          {/* Longitude */}
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-neutral-900 mb-1">
              Longitude <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className={`input ${errors.longitude ? 'border-red-500' : ''}`}
              placeholder="72.8777"
              disabled={loading}
            />
            {errors.longitude && (
              <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
            )}
          </div>
        </div>

        {/* Capacity and Occupied Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Capacity */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-neutral-900 mb-1">
              Capacity (sq ft) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className={`input ${errors.capacity ? 'border-red-500' : ''}`}
              placeholder="10000"
              min="1"
              disabled={loading}
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
            )}
          </div>

          {/* Occupied */}
          <div>
            <label htmlFor="occupied" className="block text-sm font-medium text-neutral-900 mb-1">
              Occupied Space (sq ft)
            </label>
            <input
              type="number"
              id="occupied"
              name="occupied"
              value={formData.occupied}
              onChange={handleChange}
              className={`input ${errors.occupied ? 'border-red-500' : ''}`}
              placeholder="0"
              min="0"
              disabled={loading}
            />
            {errors.occupied && (
              <p className="mt-1 text-sm text-red-600">{errors.occupied}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Available: {(parseInt(formData.capacity) || 0) - (parseInt(formData.occupied) || 0)} sq ft
              {formData.capacity && formData.occupied && (
                <span className="ml-2">
                  ({(((parseInt(formData.occupied) || 0) / (parseInt(formData.capacity) || 1)) * 100).toFixed(1)}% utilized)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Verification Status */}
        {mode === 'edit' && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              id="is_verified"
              checked={formData.is_verified}
              onChange={(e) => setFormData(prev => ({ ...prev, is_verified: e.target.checked }))}
              className="w-4 h-4 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
              disabled={loading}
            />
            <label htmlFor="is_verified" className="text-sm font-medium text-neutral-900 cursor-pointer">
              Mark as Verified Warehouse
            </label>
          </div>
        )}

        {/* Contact Person and Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Person */}
          <div>
            <label htmlFor="contact_person" className="block text-sm font-medium text-neutral-900 mb-1">
              Contact Person <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="contact_person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              className={`input ${errors.contact_person ? 'border-red-500' : ''}`}
              placeholder="John Doe"
              disabled={loading}
            />
            {errors.contact_person && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_person}</p>
            )}
          </div>

          {/* Contact Phone */}
          <div>
            <label htmlFor="contact_phone" className="block text-sm font-medium text-neutral-900 mb-1">
              Contact Phone <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              id="contact_phone"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              className={`input ${errors.contact_phone ? 'border-red-500' : ''}`}
              placeholder="+91 98765 43210"
              disabled={loading}
            />
            {errors.contact_phone && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>
            )}
          </div>
        </div>

        {/* Contact Email and Cost Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Email (Optional) */}
          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-neutral-900 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              id="contact_email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              className={`input ${errors.contact_email ? 'border-red-500' : ''}`}
              placeholder="contact@warehouse.com"
              disabled={loading}
            />
            {errors.contact_email && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
            )}
          </div>

          {/* Cost per sqft (Optional) */}
          <div>
            <label htmlFor="cost_per_sqft" className="block text-sm font-medium text-neutral-900 mb-1">
              Cost per sq ft (₹)
            </label>
            <input
              type="number"
              id="cost_per_sqft"
              name="cost_per_sqft"
              value={formData.cost_per_sqft}
              onChange={handleChange}
              className={`input ${errors.cost_per_sqft ? 'border-red-500' : ''}`}
              placeholder="50"
              min="0"
              step="0.01"
              disabled={loading}
            />
            {errors.cost_per_sqft && (
              <p className="mt-1 text-sm text-red-600">{errors.cost_per_sqft}</p>
            )}
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
              mode === 'create' ? 'Create Warehouse' : 'Save Changes'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
