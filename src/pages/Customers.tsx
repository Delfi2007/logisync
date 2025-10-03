import { useState } from 'react';
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
  Phone
} from 'lucide-react';
import { Customer, CustomerSegment } from '@/types';
import { mockCustomers } from '@/data/mockData';
import CustomerDetailModal from '@/components/CustomerDetailModal';
import AddEditCustomerModal from '@/components/AddEditCustomerModal';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<'all' | CustomerSegment>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Calculate statistics
  const stats = {
    total: customers.length,
    premium: customers.filter(c => c.segment === 'premium').length,
    regular: customers.filter(c => c.segment === 'regular').length,
    new: customers.filter(c => c.segment === 'new').length,
    totalLifetimeValue: customers.reduce((sum, c) => sum + c.lifetimeValue, 0),
    avgLifetimeValue: customers.length > 0 
      ? customers.reduce((sum, c) => sum + c.lifetimeValue, 0) / customers.length 
      : 0,
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      (customer.businessName?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSegment = segmentFilter === 'all' || customer.segment === segmentFilter;
    
    return matchesSearch && matchesSegment;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSegmentBadge = (segment: CustomerSegment) => {
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

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      setCustomers(customers.filter(c => c.id !== customerId));
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsAddEditModalOpen(true);
  };

  const handleSaveCustomer = (customer: Customer) => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers(customers.map(c => c.id === customer.id ? customer : c));
    } else {
      // Add new customer
      setCustomers([...customers, customer]);
    }
  };

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
              <p className="text-sm text-neutral-600">Total LTV</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(stats.totalLifetimeValue)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Avg: {formatCurrency(stats.avgLifetimeValue)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          {/* Segment Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-neutral-600" />
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value as 'all' | CustomerSegment)}
              className="input"
            >
              <option value="all">All Segments</option>
              <option value="premium">Premium</option>
              <option value="regular">Regular</option>
              <option value="new">New</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-neutral-600">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>

      {/* Customers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left text-xs font-semibold text-neutral-600 px-6 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-semibold text-neutral-600 px-6 py-3">
                  Contact
                </th>
                <th className="text-left text-xs font-semibold text-neutral-600 px-6 py-3">
                  Location
                </th>
                <th className="text-left text-xs font-semibold text-neutral-600 px-6 py-3">
                  Segment
                </th>
                <th className="text-right text-xs font-semibold text-neutral-600 px-6 py-3">
                  Orders
                </th>
                <th className="text-right text-xs font-semibold text-neutral-600 px-6 py-3">
                  Lifetime Value
                </th>
                <th className="text-right text-xs font-semibold text-neutral-600 px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-600">No customers found</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      {searchTerm || segmentFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Add your first customer to get started'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => handleViewCustomer(customer)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-neutral-900">{customer.name}</p>
                        {customer.businessName && (
                          <p className="text-sm text-neutral-500">{customer.businessName}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[200px]">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Phone className="w-3 h-3" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-600">
                        <p>{customer.billingAddress.city}</p>
                        <p className="text-neutral-500">{customer.billingAddress.state}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getSegmentBadge(customer.segment)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-medium text-neutral-900">{customer.totalOrders}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-medium text-neutral-900">
                        {formatCurrency(customer.lifetimeValue)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCustomer(customer);
                          }}
                          className="p-1 hover:bg-neutral-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-neutral-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCustomer(customer);
                          }}
                          className="p-1 hover:bg-neutral-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-neutral-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomer(customer.id);
                          }}
                          className="p-1 hover:bg-neutral-100 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      <CustomerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        customer={selectedCustomer}
      />

      {/* Add/Edit Customer Modal */}
      <AddEditCustomerModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
      />
    </div>
  );
}
