import { useState } from 'react';
import { Search, Filter, MapPin, Building2, BarChart3, Package, Plus, Eye, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { mockWarehouses } from '@/data/mockData';
import { Warehouse } from '@/types';
import WarehouseDetailModal from '@/components/WarehouseDetailModal';
import AddEditWarehouseModal from '@/components/AddEditWarehouseModal';

export default function Warehouses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified'>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses);

  // Calculate statistics
  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter(w => w.isVerified).length;
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.totalArea, 0);
  const availableCapacity = warehouses.reduce((sum, w) => sum + w.availableArea, 0);
  const capacityUsed = ((totalCapacity - availableCapacity) / totalCapacity) * 100;

  // Filter and search warehouses
  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.location.pincode.includes(searchTerm);
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'verified' && warehouse.isVerified) ||
      (filterStatus === 'unverified' && !warehouse.isVerified);

    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDetailModalOpen(true);
  };

  const handleAddWarehouse = () => {
    setEditingWarehouse(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteWarehouse = (warehouseId: string) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      setWarehouses(warehouses.filter(w => w.id !== warehouseId));
    }
  };

  const handleSaveWarehouse = (warehouse: Warehouse) => {
    if (editingWarehouse) {
      // Update existing warehouse
      setWarehouses(warehouses.map(w => w.id === warehouse.id ? warehouse : w));
    } else {
      // Add new warehouse
      setWarehouses([...warehouses, warehouse]);
    }
    setIsAddEditModalOpen(false);
    setEditingWarehouse(null);
  };

  const formatArea = (sqft: number) => {
    if (sqft >= 100000) {
      return `${(sqft / 100000).toFixed(1)}L sq.ft`;
    } else if (sqft >= 1000) {
      return `${(sqft / 1000).toFixed(1)}K sq.ft`;
    }
    return `${sqft} sq.ft`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your warehouse locations and capacity</p>
        </div>
        <button
          onClick={handleAddWarehouse}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Warehouse
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Warehouses</p>
              <p className="text-2xl font-bold text-gray-900">{totalWarehouses}</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-gray-900" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Warehouses</p>
              <p className="text-2xl font-bold text-gray-900">{activeWarehouses}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">{formatArea(totalCapacity)}</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-900" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Capacity Used</p>
              <p className="text-2xl font-bold text-gray-900">{capacityUsed.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-gray-900" />
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${capacityUsed}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, city, or pincode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'verified' | 'unverified')}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Warehouses Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/sq.ft
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWarehouses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Building2 className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-sm font-medium">No warehouses found</p>
                      <p className="text-xs mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWarehouses.map((warehouse) => {
                  const utilizationPercent = ((warehouse.totalArea - warehouse.availableArea) / warehouse.totalArea) * 100;
                  
                  return (
                    <tr
                      key={warehouse.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(warehouse)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{warehouse.name}</p>
                            <p className="text-xs text-gray-500">{warehouse.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-900">{warehouse.location.city}, {warehouse.location.state}</p>
                            <p className="text-xs text-gray-500">{warehouse.location.pincode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{formatArea(warehouse.totalArea)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900 mb-1">{formatArea(warehouse.availableArea)}</p>
                          <div className="w-24 bg-gray-100 rounded-full h-1.5">
                            <div 
                              className="bg-gray-900 h-1.5 rounded-full"
                              style={{ width: `${utilizationPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">₹{warehouse.pricePerSqft}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          warehouse.isVerified
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-gray-50 text-gray-700 border border-gray-200'
                        }`}>
                          {warehouse.isVerified ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Unverified
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(warehouse);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditWarehouse(warehouse);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit Warehouse"
                          >
                            <Pencil className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWarehouse(warehouse.id);
                            }}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Warehouse"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      {filteredWarehouses.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>
            Showing <span className="font-medium text-gray-900">{filteredWarehouses.length}</span> of{' '}
            <span className="font-medium text-gray-900">{totalWarehouses}</span> warehouses
          </p>
        </div>
      )}

      {/* Modals */}
      {isDetailModalOpen && selectedWarehouse && (
        <WarehouseDetailModal
          warehouse={selectedWarehouse}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedWarehouse(null);
          }}
          onEdit={() => {
            setIsDetailModalOpen(false);
            handleEditWarehouse(selectedWarehouse);
          }}
        />
      )}

      {isAddEditModalOpen && (
        <AddEditWarehouseModal
          warehouse={editingWarehouse}
          onClose={() => {
            setIsAddEditModalOpen(false);
            setEditingWarehouse(null);
          }}
          onSave={handleSaveWarehouse}
        />
      )}
    </div>
  );
}
