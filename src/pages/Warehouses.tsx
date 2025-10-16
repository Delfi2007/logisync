import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Building2, 
  BarChart3, 
  Package, 
  Plus,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import ModalLoader from '@/components/ModalLoader';
import { warehousesService, Warehouse, WarehouseStatus } from '@/services/warehouses';
import WarehouseRow from '@/components/warehouses/WarehouseRow';
import { useDebounce } from '@/hooks/useDebounce';

// Lazy load the modal component
const WarehouseModal = lazy(() => import('@/components/warehouses/WarehouseModal'));

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | WarehouseStatus>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Bulk selection state
  const [selectedWarehouses, setSelectedWarehouses] = useState<Set<number>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Debounce search term to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalCapacity: 0,
    totalOccupied: 0,
    averageUtilization: 0
  });

  const itemsPerPage = 10;

  // Fetch warehouses
  const fetchWarehouses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm || undefined,
      };

      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      if (verifiedFilter === 'verified') {
        filters.is_verified = true;
      } else if (verifiedFilter === 'unverified') {
        filters.is_verified = false;
      }

      const data = await warehousesService.getAll(filters);
      
      // Normalize warehouse data - backend returns 'available_space', frontend uses 'available'
      const normalizedWarehouses = data.warehouses.map(w => ({
        ...w,
        available: w.available_space ?? w.available ?? (w.capacity - w.occupied)
      }));
      
      setWarehouses(normalizedWarehouses);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.total);

      // Calculate stats from fetched data
      const totalCapacity = data.warehouses.reduce((sum, w) => sum + w.capacity, 0);
      const totalOccupied = data.warehouses.reduce((sum, w) => sum + w.occupied, 0);
      const activeCount = data.warehouses.filter(w => w.status === 'active').length;

      setStats({
        total: data.pagination.total || 0,
        active: activeCount,
        totalCapacity,
        totalOccupied,
        averageUtilization: totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0
      });
    } catch (err: any) {
      console.error('Error fetching warehouses:', err);
      setError(err.message || 'Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearchTerm, statusFilter, verifiedFilter]);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const handleViewDetails = useCallback(async (warehouse: Warehouse) => {
    try {
      // Fetch full warehouse details including amenities
      const fullWarehouse = await warehousesService.getById(warehouse.id);
      setSelectedWarehouse(fullWarehouse);
      setIsDetailModalOpen(true);
    } catch (err: any) {
      console.error('Error fetching warehouse details:', err);
      alert('Failed to load warehouse details');
    }
  }, []);

  const handleAddWarehouse = useCallback(() => {
    setModalMode('create');
    setEditingWarehouse(null);
    setIsModalOpen(true);
  }, []);

  const handleEditWarehouse = useCallback((warehouse: Warehouse) => {
    setModalMode('edit');
    setEditingWarehouse(warehouse);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingWarehouse(null);
  }, []);

  const handleSaveSuccess = useCallback(() => {
    fetchWarehouses(); // Refresh the list
  }, [fetchWarehouses]);

  const handleDeleteWarehouse = useCallback(async (warehouseId: number, warehouseName: string) => {
    if (window.confirm(`Are you sure you want to delete "${warehouseName}"? This action cannot be undone.`)) {
      try {
        await warehousesService.delete(warehouseId);
        await fetchWarehouses(); // Refresh list
        alert('Warehouse deleted successfully');
      } catch (err: any) {
        console.error('Error deleting warehouse:', err);
        alert(err.message || 'Failed to delete warehouse');
      }
    }
  }, [fetchWarehouses]);

  // Bulk selection handlers wrapped in useCallback
  const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(warehouses.map(w => w.id));
      setSelectedWarehouses(allIds);
    } else {
      setSelectedWarehouses(new Set());
    }
  }, [warehouses]);

  const handleSelectWarehouse = useCallback((warehouseId: number) => {
    setSelectedWarehouses(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(warehouseId)) {
        newSelected.delete(warehouseId);
      } else {
        newSelected.add(warehouseId);
      }
      return newSelected;
    });
  }, []);

  const handleBulkDelete = async () => {
    if (selectedWarehouses.size === 0) return;
    
    const count = selectedWarehouses.size;
    if (!confirm(`Are you sure you want to delete ${count} warehouse${count > 1 ? 's' : ''}? This action cannot be undone.`)) {
      return;
    }

    setBulkDeleting(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const warehouseId of Array.from(selectedWarehouses)) {
        try {
          await warehousesService.delete(warehouseId);
          successCount++;
        } catch (err) {
          console.error(`Failed to delete warehouse ${warehouseId}:`, err);
          errorCount++;
        }
      }

      if (errorCount === 0) {
        alert(`Successfully deleted ${successCount} warehouse${successCount > 1 ? 's' : ''}`);
      } else {
        alert(`Deleted ${successCount} warehouse${successCount > 1 ? 's' : ''}. Failed to delete ${errorCount}.`);
      }

      setSelectedWarehouses(new Set());
      fetchWarehouses();
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const dataToExport = selectedWarehouses.size > 0
      ? warehouses.filter(w => selectedWarehouses.has(w.id))
      : warehouses;

    const headers = ['Name', 'Code', 'Location', 'Capacity', 'Occupied', 'Utilization %', 'Status', 'Verified'];
    const rows = dataToExport.map(w => [
      w.name,
      w.code,
      `${w.city}, ${w.state}`,
      w.capacity,
      w.occupied || 0,
      w.capacity ? Math.round((w.occupied || 0) / w.capacity * 100) : 0,
      w.status,
      w.is_verified ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `warehouses_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateStatus = useCallback(async (warehouseId: number, newStatus: WarehouseStatus) => {
    try {
      await warehousesService.update(warehouseId, { status: newStatus });
      await fetchWarehouses(); // Refresh list
    } catch (err: any) {
      console.error('Error updating warehouse status:', err);
      alert(err.message || 'Failed to update warehouse status');
    }
  }, [fetchWarehouses]);

  const formatArea = (capacity: number) => {
    if (capacity >= 100000) {
      return `${(capacity / 100000).toFixed(1)}L units`;
    } else if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)}K units`;
    }
    return `${capacity} units`;
  };

  const getStatusBadge = (status: WarehouseStatus) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: CheckCircle,
        label: 'Active'
      },
      inactive: {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: XCircle,
        label: 'Inactive'
      },
      maintenance: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: AlertCircle,
        label: 'Maintenance'
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
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
              <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
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
              <p className="text-2xl font-bold text-gray-900">{formatArea(stats.totalCapacity)}</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-900" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageUtilization.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-gray-900" />
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(stats.averageUtilization, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, code, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | WarehouseStatus)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="relative">
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value as 'all' | 'verified' | 'unverified')}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Verified</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error Loading Warehouses</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchWarehouses}
              className="mt-2 text-sm text-red-700 underline hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      {selectedWarehouses.size > 0 && (
        <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-700">
              {selectedWarehouses.size} warehouse{selectedWarehouses.size > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedWarehouses(new Set())}
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              Clear selection
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              disabled={bulkDeleting}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export CSV
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bulkDeleting ? 'Deleting...' : 'Delete Selected'}
            </button>
          </div>
        </div>
      )}

      {/* Warehouses Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={warehouses.length > 0 && selectedWarehouses.size === warehouses.length}
                      onChange={handleSelectAll}
                      className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warehouse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {warehouses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Building2 className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-sm font-medium">No warehouses found</p>
                        <p className="text-xs mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  warehouses.map((warehouse) => (
                    <WarehouseRow
                      key={warehouse.id}
                      warehouse={warehouse}
                      isSelected={selectedWarehouses.has(warehouse.id)}
                      onSelect={handleSelectWarehouse}
                      onView={handleViewDetails}
                      onEdit={handleEditWarehouse}
                      onDelete={handleDeleteWarehouse}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{warehouses.length}</span> of{' '}
            <span className="font-medium text-gray-900">{totalCount}</span> warehouses
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Simple Detail Modal (TODO: Replace with proper modal component) */}
      {isDetailModalOpen && selectedWarehouse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedWarehouse.name}</h2>
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setSelectedWarehouse(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Warehouse Code</h3>
                <p className="text-sm text-gray-900">{selectedWarehouse.code}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                <p className="text-sm text-gray-900">
                  {selectedWarehouse.street}, {selectedWarehouse.city}, {selectedWarehouse.state} - {selectedWarehouse.pincode}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Capacity</h3>
                  <p className="text-sm text-gray-900">{formatArea(selectedWarehouse.capacity)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Occupied</h3>
                  <p className="text-sm text-gray-900">{formatArea(selectedWarehouse.occupied)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Available</h3>
                  <p className="text-sm text-gray-900">{formatArea(selectedWarehouse.available)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Utilization</h3>
                  <p className="text-sm text-gray-900">
                    {((selectedWarehouse.occupied / selectedWarehouse.capacity) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                {getStatusBadge(selectedWarehouse.status)}
              </div>
              {selectedWarehouse.amenities && selectedWarehouse.amenities.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWarehouse.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Warehouse Modal - Lazy Loaded */}
      {isModalOpen && (
        <Suspense fallback={<ModalLoader />}>
          <WarehouseModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSuccess={handleSaveSuccess}
            warehouse={editingWarehouse}
            mode={modalMode}
          />
        </Suspense>
      )}
    </div>
  );
}
