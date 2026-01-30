import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  UserPlus, 
  Search, 
  Filter
} from 'lucide-react';
import CustomerRow from '@/components/customers/CustomerRow';
import ModalLoader from '@/components/ModalLoader';
import customersService, { 
  Customer
} from '@/services/customers';
import { useDebounce } from '@/hooks/useDebounce';

// Lazy load the modal component
const CustomerModal = lazy(() => import('@/components/customers/CustomerModal'));

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<'all' | 'premium' | 'regular' | 'new'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  
  // Bulk selection state
  const [selectedCustomers, setSelectedCustomers] = useState<Set<number>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Debounce search term to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch customers wrapped in useCallback
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        page: currentPage,
        limit: 10,
        ...(segmentFilter !== 'all' && { segment: segmentFilter }),
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        sortBy: 'created_at' as const,
        order: 'DESC' as const
      };
      
      const response = await customersService.getAll(filters);
      setCustomers(response.customers);
      setTotalPages(response.pagination.totalPages);
      setTotalCustomers(response.pagination.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, segmentFilter, debouncedSearchTerm]);

  // Fetch customers
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Memoize statistics calculations - Only recalculate when customers array changes
  const stats = useMemo(() => {
    const premium = customers.filter(c => c.segment === 'premium').length;
    const regular = customers.filter(c => c.segment === 'regular').length;
    const newCustomers = customers.filter(c => c.segment === 'new').length;
    const totalRevenue = customers.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
    
    return {
      total: totalCustomers || 0,
      premium,
      regular,
      new: newCustomers,
      totalRevenue,
    };
  }, [customers, totalCustomers]);

  // Memoize currency formatter to avoid recreating on every render
  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    });
    return (amount: number) => formatter.format(amount);
  }, []);

  const handleViewCustomer = useCallback(async (customer: Customer) => {
    try {
      // Fetch full customer details including addresses
      const fullCustomer = await customersService.getById(customer.id);
      // Open edit modal to view customer details
      setEditingCustomer(fullCustomer);
      setModalMode('edit');
      setIsModalOpen(true);
    } catch (err: any) {
      alert('Failed to load customer details: ' + err.message);
    }
  }, []);

  const handleEditCustomer = useCallback((customer: Customer) => {
    setModalMode('edit');
    setEditingCustomer(customer);
    setIsModalOpen(true);
  }, []);

  const handleDeleteCustomer = useCallback(async (customerId: number) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        await customersService.delete(customerId);
        fetchCustomers(); // Refresh the list
      } catch (err: any) {
        alert('Failed to delete customer: ' + err.message);
      }
    }
  }, [fetchCustomers]);

  // Bulk selection handlers wrapped in useCallback
  const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(customers.map(c => c.id));
      setSelectedCustomers(allIds);
    } else {
      setSelectedCustomers(new Set());
    }
  }, [customers]);

  const handleSelectCustomer = useCallback((customerId: number) => {
    setSelectedCustomers(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(customerId)) {
        newSelected.delete(customerId);
      } else {
        newSelected.add(customerId);
      }
      return newSelected;
    });
  }, []);

  const handleBulkDelete = async () => {
    if (selectedCustomers.size === 0) return;
    
    const count = selectedCustomers.size;
    if (!confirm(`Are you sure you want to delete ${count} customer${count > 1 ? 's' : ''}? This action cannot be undone.`)) {
      return;
    }

    setBulkDeleting(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const customerId of Array.from(selectedCustomers)) {
        try {
          await customersService.delete(customerId);
          successCount++;
        } catch (err: any) {
          console.error(`Failed to delete customer ${customerId}:`, err);
          console.error('Error details:', err.response?.data || err.message);
          errorCount++;
        }
      }

      if (errorCount === 0) {
        alert(`Successfully deleted ${successCount} customer${successCount > 1 ? 's' : ''}`);
      } else {
        alert(`Deleted ${successCount} customer${successCount > 1 ? 's' : ''}. Failed to delete ${errorCount}.`);
      }

      setSelectedCustomers(new Set());
      await fetchCustomers();
    } catch (error: any) {
      console.error('Bulk delete error:', error);
      alert('Failed to complete bulk delete operation: ' + (error.message || 'Unknown error'));
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const dataToExport = selectedCustomers.size > 0
      ? customers.filter(c => selectedCustomers.has(c.id))
      : customers;

    const headers = ['Name', 'Email', 'Phone', 'Business Name', 'Segment', 'Total Orders', 'Total Revenue'];
    const rows = dataToExport.map(c => [
      c.name,
      c.email,
      c.phone,
      c.business_name || '',
      c.segment,
      c.total_orders,
      c.total_revenue
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddCustomer = useCallback(() => {
    setModalMode('create');
    setEditingCustomer(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  }, []);

  const handleSaveSuccess = useCallback(() => {
    fetchCustomers(); // Refresh the list
  }, [fetchCustomers]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on search
    fetchCustomers();
  }, [fetchCustomers]);

  if (loading && customers.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
          <p className="mt-4 text-neutral-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Customers</h1>
          <p className="text-neutral-600 mt-1">Manage your customer relationships</p>
        </div>
        <button onClick={handleAddCustomer} className="btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-neutral-50 border border-neutral-300 text-neutral-900 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Customers</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total || 0}</p>
            </div>
            <div className="p-3 bg-neutral-100 rounded-lg">
              <Users className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Premium</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.premium}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {stats.total > 0 ? ((stats.premium / stats.total) * 100).toFixed(0) : 0}% of total
              </p>
            </div>
            <div className="p-3 bg-neutral-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Regular</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.regular}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {stats.total > 0 ? ((stats.regular / stats.total) * 100).toFixed(0) : 0}% of total
              </p>
            </div>
            <div className="p-3 bg-neutral-100 rounded-lg">
              <Users className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Revenue</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-neutral-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or business..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
          </form>

          {/* Segment Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-neutral-600" />
            <select
              value={segmentFilter}
              onChange={(e) => {
                setSegmentFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              <option value="all">All Segments</option>
              <option value="premium">Premium</option>
              <option value="regular">Regular</option>
              <option value="new">New</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedCustomers.size > 0 && (
        <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-700">
              {selectedCustomers.size} customer{selectedCustomers.size > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedCustomers(new Set())}
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

      {/* Customers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="py-3 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={customers.length > 0 && selectedCustomers.size === customers.length}
                    onChange={handleSelectAll}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-neutral-600">Customer</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-neutral-600">Contact</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-neutral-600">Business</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-neutral-600">Segment</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-neutral-600">Orders</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-neutral-600">Revenue</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-neutral-600">Joined</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500">
                    No customers found. {searchTerm || segmentFilter !== 'all' ? 'Try adjusting your filters.' : 'Add your first customer to get started.'}
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    isSelected={selectedCustomers.has(customer.id)}
                    onSelect={handleSelectCustomer}
                    onView={handleViewCustomer}
                    onEdit={handleEditCustomer}
                    onDelete={handleDeleteCustomer}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-neutral-200 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-neutral-600">
              Page {currentPage} of {totalPages} ({totalCustomers} total customers)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Modal - Lazy Loaded */}
      {isModalOpen && (
        <Suspense fallback={<ModalLoader />}>
          <CustomerModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSuccess={handleSaveSuccess}
            customer={editingCustomer}
            mode={modalMode}
          />
        </Suspense>
      )}

      {/* TODO: Implement Customer Detail Modal */}
      {/* <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      /> */}
    </div>
  );
}
