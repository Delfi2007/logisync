import { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  UserPlus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building2,
  MapPin
} from 'lucide-react';
import customersService, { 
  Customer, 
  CustomerAddress,
  CreateCustomerData,
  UpdateCustomerData 
} from '@/services/customers';

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
  
  // Modals
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Fetch customers
  useEffect(() => {
    fetchCustomers();
  }, [currentPage, segmentFilter, searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        page: currentPage,
        limit: 10,
        ...(segmentFilter !== 'all' && { segment: segmentFilter }),
        ...(searchTerm && { search: searchTerm }),
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
  };

  // Calculate statistics from current customers
  const stats = {
    total: totalCustomers,
    premium: customers.filter(c => c.segment === 'premium').length,
    regular: customers.filter(c => c.segment === 'regular').length,
    new: customers.filter(c => c.segment === 'new').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.total_revenue, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSegmentBadge = (segment: 'premium' | 'regular' | 'new') => {
    const styles = {
      premium: 'bg-purple-100 text-purple-800 border-purple-200',
      regular: 'bg-blue-100 text-blue-800 border-blue-200',
      new: 'bg-green-100 text-green-800 border-green-200',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium border rounded capitalize ${styles[segment]}`}>
        {segment}
      </span>
    );
  };

  const handleViewCustomer = async (customer: Customer) => {
    try {
      // Fetch full customer details including addresses
      const fullCustomer = await customersService.getById(customer.id);
      setSelectedCustomer(fullCustomer);
      setIsDetailModalOpen(true);
    } catch (err: any) {
      alert('Failed to load customer details: ' + err.message);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteCustomer = async (customerId: number) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        await customersService.delete(customerId);
        fetchCustomers(); // Refresh the list
      } catch (err: any) {
        alert('Failed to delete customer: ' + err.message);
      }
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsAddEditModalOpen(true);
  };

  const handleSaveCustomer = async (customerData: CreateCustomerData | UpdateCustomerData) => {
    try {
      if (editingCustomer) {
        // Update existing customer
        await customersService.update(editingCustomer.id, customerData as UpdateCustomerData);
      } else {
        // Add new customer
        await customersService.create(customerData as CreateCustomerData);
      }
      setIsAddEditModalOpen(false);
      fetchCustomers(); // Refresh the list
    } catch (err: any) {
      alert('Failed to save customer: ' + err.message);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on search
    fetchCustomers();
  };

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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Customers</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total}</p>
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
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.premium}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {stats.total > 0 ? ((stats.premium / stats.total) * 100).toFixed(0) : 0}% of total
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Regular</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.regular}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {stats.total > 0 ? ((stats.regular / stats.total) * 100).toFixed(0) : 0}% of total
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
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

      {/* Customers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
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
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No customers found. {searchTerm || segmentFilter !== 'all' ? 'Try adjusting your filters.' : 'Add your first customer to get started.'}
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-neutral-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-neutral-900">{customer.name}</p>
                        {customer.gst_number && (
                          <p className="text-xs text-neutral-500">GST: {customer.gst_number}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Mail className="w-4 h-4" />
                          <span className="truncate max-w-[200px]">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Phone className="w-4 h-4" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {customer.business_name ? (
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <Building2 className="w-4 h-4 text-neutral-400" />
                          <span>{customer.business_name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {getSegmentBadge(customer.segment)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-neutral-900 font-medium">{customer.total_orders}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-neutral-900 font-medium">
                        {formatCurrency(customer.total_revenue)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-neutral-600">{formatDate(customer.created_at)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
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

      {/* TODO: Implement modals */}
      {/* <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
      <AddEditCustomerModal
        customer={editingCustomer}
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveCustomer}
      /> */}
    </div>
  );
}
