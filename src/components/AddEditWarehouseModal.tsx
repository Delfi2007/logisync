import { useState, useEffect } from 'react';
import { X, MapPin, Building2, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Warehouse } from '@/types';

interface AddEditWarehouseModalProps {
  warehouse: Warehouse | null;
  onClose: () => void;
  onSave: (warehouse: Warehouse) => void;
}

const amenitiesList = [
  'Climate Control',
  '24/7 Security',
  'Loading Dock',
  'Fire Safety',
  'CCTV',
  'Parking',
  'Cold Storage',
  'Forklifts Available',
  'Racking System',
  'Office Space',
  'Weighing Scale',
  'WMS Integration',
];

export default function AddEditWarehouseModal({ warehouse, onClose, onSave }: AddEditWarehouseModalProps) {
  const isEditing = !!warehouse;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    totalArea: '',
    availableArea: '',
    pricePerSqft: '',
    operationalHours: '24/7',
    isVerified: false,
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with warehouse data if editing
  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name,
        address: warehouse.location.address,
        city: warehouse.location.city,
        state: warehouse.location.state,
        pincode: warehouse.location.pincode,
        latitude: warehouse.location.coordinates?.lat.toString() || '',
        longitude: warehouse.location.coordinates?.lng.toString() || '',
        totalArea: warehouse.totalArea.toString(),
        availableArea: warehouse.availableArea.toString(),
        pricePerSqft: warehouse.pricePerSqft.toString(),
        operationalHours: warehouse.operationalHours,
        isVerified: warehouse.isVerified,
      });
      setSelectedAmenities(warehouse.amenities);
    }
  }, [warehouse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Warehouse name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (!formData.totalArea.trim()) {
      newErrors.totalArea = 'Total area is required';
    } else if (isNaN(Number(formData.totalArea)) || Number(formData.totalArea) <= 0) {
      newErrors.totalArea = 'Total area must be a positive number';
    }

    if (!formData.availableArea.trim()) {
      newErrors.availableArea = 'Available area is required';
    } else if (isNaN(Number(formData.availableArea)) || Number(formData.availableArea) < 0) {
      newErrors.availableArea = 'Available area must be a non-negative number';
    } else if (Number(formData.availableArea) > Number(formData.totalArea)) {
      newErrors.availableArea = 'Available area cannot exceed total area';
    }

    if (!formData.pricePerSqft.trim()) {
      newErrors.pricePerSqft = 'Price per sq.ft is required';
    } else if (isNaN(Number(formData.pricePerSqft)) || Number(formData.pricePerSqft) <= 0) {
      newErrors.pricePerSqft = 'Price must be a positive number';
    }

    if (formData.latitude && (isNaN(Number(formData.latitude)) || Number(formData.latitude) < -90 || Number(formData.latitude) > 90)) {
      newErrors.latitude = 'Invalid latitude (-90 to 90)';
    }

    if (formData.longitude && (isNaN(Number(formData.longitude)) || Number(formData.longitude) < -180 || Number(formData.longitude) > 180)) {
      newErrors.longitude = 'Invalid longitude (-180 to 180)';
    }

    if (!formData.operationalHours.trim()) {
      newErrors.operationalHours = 'Operational hours are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const warehouseData: Warehouse = {
      id: warehouse?.id || `WH-${Date.now()}`,
      name: formData.name.trim(),
      ownerId: warehouse?.ownerId || 'USR-001', // Default owner for new warehouses
      location: {
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        coordinates: formData.latitude && formData.longitude ? {
          lat: parseFloat(formData.latitude),
          lng: parseFloat(formData.longitude),
        } : undefined,
      },
      totalArea: parseFloat(formData.totalArea),
      availableArea: parseFloat(formData.availableArea),
      pricePerSqft: parseFloat(formData.pricePerSqft),
      amenities: selectedAmenities,
      operationalHours: formData.operationalHours.trim(),
      images: warehouse?.images || [],
      rating: warehouse?.rating || 0,
      reviewCount: warehouse?.reviewCount || 0,
      isVerified: formData.isVerified,
      createdAt: warehouse?.createdAt || new Date(),
    };

    onSave(warehouseData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Warehouse' : 'Add New Warehouse'}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing ? 'Update warehouse details' : 'Create a new warehouse location'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Basic Information
              </h3>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Mumbai Central Warehouse"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location Details
              </h3>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Plot 45, Industrial Area, Phase 1"
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Mumbai"
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Maharashtra"
                  />
                  {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    maxLength={6}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.pincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="400001"
                  />
                  {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
                </div>

                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.latitude ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="19.0760"
                  />
                  {errors.latitude && <p className="mt-1 text-xs text-red-500">{errors.latitude}</p>}
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.longitude ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="72.8777"
                  />
                  {errors.longitude && <p className="mt-1 text-xs text-red-500">{errors.longitude}</p>}
                </div>
              </div>
            </div>

            {/* Capacity & Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Capacity & Pricing
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="totalArea" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Area (sq.ft) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="totalArea"
                    name="totalArea"
                    value={formData.totalArea}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.totalArea ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="50000"
                  />
                  {errors.totalArea && <p className="mt-1 text-xs text-red-500">{errors.totalArea}</p>}
                </div>

                <div>
                  <label htmlFor="availableArea" className="block text-sm font-medium text-gray-700 mb-1">
                    Available Area (sq.ft) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="availableArea"
                    name="availableArea"
                    value={formData.availableArea}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.availableArea ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="15000"
                  />
                  {errors.availableArea && <p className="mt-1 text-xs text-red-500">{errors.availableArea}</p>}
                </div>

                <div>
                  <label htmlFor="pricePerSqft" className="block text-sm font-medium text-gray-700 mb-1">
                    Price/sq.ft (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="pricePerSqft"
                    name="pricePerSqft"
                    value={formData.pricePerSqft}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.pricePerSqft ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="25"
                  />
                  {errors.pricePerSqft && <p className="mt-1 text-xs text-red-500">{errors.pricePerSqft}</p>}
                </div>
              </div>
            </div>

            {/* Operational Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Operational Details
              </h3>

              <div>
                <label htmlFor="operationalHours" className="block text-sm font-medium text-gray-700 mb-1">
                  Operational Hours <span className="text-red-500">*</span>
                </label>
                <select
                  id="operationalHours"
                  name="operationalHours"
                  value={formData.operationalHours}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.operationalHours ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="24/7">24/7</option>
                  <option value="Mon-Fri: 9AM-6PM">Mon-Fri: 9AM-6PM</option>
                  <option value="Mon-Sat: 8AM-8PM">Mon-Sat: 8AM-8PM</option>
                  <option value="Mon-Sun: 6AM-10PM">Mon-Sun: 6AM-10PM</option>
                </select>
                {errors.operationalHours && <p className="mt-1 text-xs text-red-500">{errors.operationalHours}</p>}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVerified"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="isVerified" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Mark as Verified
                </label>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Amenities & Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenitiesList.map((amenity) => (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                      selectedAmenities.includes(amenity)
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="sr-only"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isEditing ? 'Update Warehouse' : 'Add Warehouse'}
          </button>
        </div>
      </div>
    </div>
  );
}
