import { useState } from 'react';
import { X, MapPin, Building2, Package, DollarSign, Clock, Star, CheckCircle, Phone, Mail, Navigation } from 'lucide-react';
import { Warehouse } from '@/types';
import { mockProducts } from '@/data/mockData';
import { calculateDistanceByPincode, formatDistance, formatDeliveryTime, estimateDeliveryTime } from '@/utils/distance';

interface WarehouseDetailModalProps {
  warehouse: Warehouse;
  onClose: () => void;
  onEdit: () => void;
}

export default function WarehouseDetailModal({ warehouse, onClose, onEdit }: WarehouseDetailModalProps) {
  const [targetPincode, setTargetPincode] = useState('');
  const [distanceResult, setDistanceResult] = useState<{ distance: number; deliveryTime: number } | null>(null);

  // Get products assigned to this warehouse
  const assignedProducts = mockProducts.filter(product => 
    product.locations?.some(loc => loc.warehouseId === warehouse.id)
  );

  const formatArea = (sqft: number) => {
    if (sqft >= 100000) {
      return `${(sqft / 100000).toFixed(1)}L sq.ft`;
    } else if (sqft >= 1000) {
      return `${(sqft / 1000).toFixed(1)}K sq.ft`;
    }
    return `${sqft} sq.ft`;
  };

  const utilizationPercent = ((warehouse.totalArea - warehouse.availableArea) / warehouse.totalArea) * 100;

  const handleCalculateDistance = () => {
    if (!targetPincode || targetPincode.length !== 6) {
      return;
    }

    const distance = calculateDistanceByPincode(warehouse.location.pincode, targetPincode);
    if (distance !== null) {
      const deliveryTime = estimateDeliveryTime(distance);
      setDistanceResult({ distance, deliveryTime });
    } else {
      setDistanceResult(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-gray-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{warehouse.name}</h2>
              <p className="text-sm text-gray-500">{warehouse.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Status and Rating */}
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                warehouse.isVerified
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                <CheckCircle className="w-4 h-4" />
                {warehouse.isVerified ? 'Verified' : 'Unverified'}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-gray-900">{warehouse.rating}</span>
                <span className="text-sm text-gray-500">({warehouse.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-gray-600" />
                  <p className="text-xs font-medium text-gray-600">Total Area</p>
                </div>
                <p className="text-xl font-bold text-gray-900">{formatArea(warehouse.totalArea)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-green-600" />
                  <p className="text-xs font-medium text-gray-600">Available</p>
                </div>
                <p className="text-xl font-bold text-gray-900">{formatArea(warehouse.availableArea)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-gray-600" />
                  <p className="text-xs font-medium text-gray-600">Price/sq.ft</p>
                </div>
                <p className="text-xl font-bold text-gray-900">₹{warehouse.pricePerSqft}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <p className="text-xs font-medium text-gray-600">Operating Hours</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{warehouse.operationalHours}</p>
              </div>
            </div>

            {/* Utilization Bar */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Space Utilization</p>
                <p className="text-sm font-bold text-gray-900">{utilizationPercent.toFixed(1)}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gray-900 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${utilizationPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Occupied: {formatArea(warehouse.totalArea - warehouse.availableArea)}</span>
                <span>Available: {formatArea(warehouse.availableArea)}</span>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-900" />
                <h3 className="font-semibold text-gray-900">Location Details</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Address:</span> {warehouse.location.address}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">City:</span> {warehouse.location.city}, {warehouse.location.state}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Pincode:</span> {warehouse.location.pincode}
                </p>
                {warehouse.location.coordinates && (
                  <p className="text-gray-700">
                    <span className="font-medium">Coordinates:</span> {warehouse.location.coordinates.lat}, {warehouse.location.coordinates.lng}
                  </p>
                )}
              </div>
            </div>

            {/* Distance Calculator */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Navigation className="w-5 h-5 text-gray-900" />
                <h3 className="font-semibold text-gray-900">Distance Calculator</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">Calculate distance and estimated delivery time to any location</p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetPincode}
                  onChange={(e) => {
                    setTargetPincode(e.target.value);
                    setDistanceResult(null);
                  }}
                  placeholder="Enter destination pincode"
                  maxLength={6}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                />
                <button
                  onClick={handleCalculateDistance}
                  disabled={targetPincode.length !== 6}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Calculate
                </button>
              </div>

              {distanceResult && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Distance</p>
                      <p className="font-semibold text-gray-900">{formatDistance(distanceResult.distance)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Est. Delivery Time</p>
                      <p className="font-semibold text-gray-900">{formatDeliveryTime(distanceResult.deliveryTime)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Amenities & Features</h3>
              <div className="flex flex-wrap gap-2">
                {warehouse.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-lg border border-gray-200"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Inventory */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Assigned Inventory</h3>
                <span className="text-sm text-gray-500">{assignedProducts.length} products</span>
              </div>
              
              {assignedProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No inventory assigned to this warehouse yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">SKU</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Quantity</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {assignedProducts.map((product) => {
                        const locationData = product.locations?.find(loc => loc.warehouseId === warehouse.id);
                        const stockStatus = product.currentStock === 0 ? 'Out of Stock' : 
                                          product.currentStock <= product.reorderLevel ? 'Low Stock' : 'In Stock';
                        return (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{product.sku}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {locationData?.quantity || 0}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                stockStatus === 'In Stock'
                                  ? 'bg-green-50 text-green-700'
                                  : stockStatus === 'Low Stock'
                                  ? 'bg-yellow-50 text-yellow-700'
                                  : 'bg-red-50 text-red-700'
                              }`}>
                                {stockStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Contact Information (if available) */}
            {warehouse.ownerId && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Owner Information</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>Contact owner for details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>Owner ID: {warehouse.ownerId}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Edit Warehouse
          </button>
        </div>
      </div>
    </div>
  );
}
