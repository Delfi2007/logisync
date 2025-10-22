import { useState, useEffect, lazy, Suspense } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  DollarSign,
  User,
  Calendar
} from 'lucide-react';
import ModalLoader from '@/components/ModalLoader';
import { useDebounce } from '@/hooks/useDebounce';

// Lazy load the modal component
const OrderModal = lazy(() => import('@/components/orders/OrderModal'));
import ordersService, {
  Order,
  OrderStatus,
  PaymentStatus,
  OrderStats
} from '@/services/orders';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  
  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch orders - USING STATIC DATA
  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, paymentStatusFilter, debouncedSearchQuery]);

  // Fetch stats - USING STATIC DATA
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    // Simulate small delay then show static data
    setTimeout(() => {
      // STATIC MOCK DATA - NO API CALL
      const mockOrders: Order[] = [
        {
          id: 1,
          user_id: 1,
          customer_id: 1,
          order_number: 'ORD-2025-001',
          status: 'processing',
          payment_status: 'paid',
          payment_method: 'card',
          subtotal: 42000,
          tax_amount: 3600,
          shipping_cost: 0,
          discount_amount: 0,
          total_amount: 45600,
          shipping_street: '123 Business Park',
          shipping_city: 'Mumbai',
          shipping_state: 'Maharashtra',
          shipping_pincode: '400001',
          notes: 'Urgent delivery required',
          created_at: '2025-10-20T10:30:00Z',
          updated_at: '2025-10-20T14:20:00Z',
          customer_name: 'Acme Corp',
          customer_email: 'contact@acme.com',
          customer_phone: '+91 98765 43210'
        },
        {
          id: 2,
          user_id: 1,
          customer_id: 2,
          order_number: 'ORD-2025-002',
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'upi',
          subtotal: 72000,
          tax_amount: 6900,
          shipping_cost: 0,
          discount_amount: 0,
          total_amount: 78900,
          shipping_street: '456 Tech Street',
          shipping_city: 'Bangalore',
          shipping_state: 'Karnataka',
          shipping_pincode: '560001',
          notes: 'Standard delivery',
          created_at: '2025-10-19T09:15:00Z',
          updated_at: '2025-10-19T09:15:00Z',
          customer_name: 'TechHub Solutions',
          customer_email: 'info@techhub.com',
          customer_phone: '+91 98765 43211'
        },
        {
          id: 3,
          user_id: 1,
          customer_id: 3,
          order_number: 'ORD-2025-003',
          status: 'delivered',
          payment_status: 'paid',
          payment_method: 'netbanking',
          subtotal: 115000,
          tax_amount: 8400,
          shipping_cost: 0,
          discount_amount: 0,
          total_amount: 123400,
          shipping_street: '789 Industrial Area',
          shipping_city: 'Delhi',
          shipping_state: 'Delhi',
          shipping_pincode: '110001',
          notes: 'Delivered successfully',
          created_at: '2025-10-18T08:00:00Z',
          updated_at: '2025-10-21T16:30:00Z',
          delivered_at: '2025-10-21T16:30:00Z',
          customer_name: 'Global Industries',
          customer_email: 'orders@global.com',
          customer_phone: '+91 98765 43212'
        },
        {
          id: 4,
          user_id: 1,
          customer_id: 4,
          order_number: 'ORD-2025-004',
          status: 'delivered',
          payment_status: 'paid',
          payment_method: 'card',
          subtotal: 31500,
          tax_amount: 2700,
          shipping_cost: 0,
          discount_amount: 0,
          total_amount: 34200,
          shipping_street: '321 Metro Plaza',
          shipping_city: 'Pune',
          shipping_state: 'Maharashtra',
          shipping_pincode: '411001',
          notes: 'Order completed',
          created_at: '2025-10-17T11:45:00Z',
          updated_at: '2025-10-20T10:00:00Z',
          delivered_at: '2025-10-19T14:20:00Z',
          customer_name: 'Metro Supplies',
          customer_email: 'sales@metro.com',
          customer_phone: '+91 98765 43213'
        },
        {
          id: 5,
          user_id: 1,
          customer_id: 5,
          order_number: 'ORD-2025-005',
          status: 'processing',
          payment_status: 'paid',
          payment_method: 'upi',
          subtotal: 52000,
          tax_amount: 4700,
          shipping_cost: 0,
          discount_amount: 0,
          total_amount: 56700,
          shipping_street: '654 Logistics Hub',
          shipping_city: 'Hyderabad',
          shipping_state: 'Telangana',
          shipping_pincode: '500001',
          notes: 'In transit',
          created_at: '2025-10-16T14:30:00Z',
          updated_at: '2025-10-18T09:15:00Z',
          customer_name: 'Prime Logistics',
          customer_email: 'contact@prime.com',
          customer_phone: '+91 98765 43214'
        },
        {
          id: 6,
          user_id: 1,
          customer_id: 1,
          order_number: 'ORD-2025-006',
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'cash',
          subtotal: 26500,
          tax_amount: 2400,
          shipping_cost: 0,
          discount_amount: 0,
          total_amount: 28900,
          shipping_street: '123 Business Park',
          shipping_city: 'Mumbai',
          shipping_state: 'Maharashtra',
          shipping_pincode: '400001',
          notes: 'Awaiting payment confirmation',
          created_at: '2025-10-15T16:00:00Z',
          updated_at: '2025-10-15T16:00:00Z',
          customer_name: 'Acme Corp',
          customer_email: 'contact@acme.com',
          customer_phone: '+91 98765 43210'
        },
        {
          id: 7,
          user_id: 1,
          customer_id: 3,
          order_number: 'ORD-2025-007',
          status: 'shipped',
          payment_status: 'paid',
          payment_method: 'card',
          subtotal: 88000,
          tax_amount: 7600,
          shipping_cost: 0,
          discount_amount: 0,
          total_amount: 95600,
          shipping_street: '789 Industrial Area',
          shipping_city: 'Delhi',
          shipping_state: 'Delhi',
          shipping_pincode: '110001',
          notes: 'Out for delivery',
          created_at: '2025-10-14T10:20:00Z',
          updated_at: '2025-10-21T08:45:00Z',
          customer_name: 'Global Industries',
          customer_email: 'orders@global.com',
          customer_phone: '+91 98765 43212'
        }
      ];

      // Apply filters
      let filtered = [...mockOrders];
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(o => o.status === statusFilter);
      }
      
      if (paymentStatusFilter !== 'all') {
        filtered = filtered.filter(o => o.payment_status === paymentStatusFilter);
      }
      
      if (debouncedSearchQuery) {
        const search = debouncedSearchQuery.toLowerCase();
        filtered = filtered.filter(o => 
          o.order_number.toLowerCase().includes(search) ||
          o.customer_name?.toLowerCase().includes(search) ||
          o.customer_email?.toLowerCase().includes(search)
        );
      }
      
      // Pagination
      const startIndex = (currentPage - 1) * 10;
      const paginatedOrders = filtered.slice(startIndex, startIndex + 10);
      
      setOrders(paginatedOrders);
      setTotalPages(Math.ceil(filtered.length / 10));
      setTotalOrders(filtered.length);
      setLoading(false);
    }, 100);
  };

  const fetchStats = async () => {
    try {
      // STATIC MOCK STATS
      const mockStats: OrderStats = {
        total_orders: 7,
        pending_orders: 2,
        confirmed_orders: 0,
        processing_orders: 2,
        shipped_orders: 1,
        delivered_orders: 1,
        cancelled_orders: 0,
        returned_orders: 0,
        total_revenue: 463300,
        average_order_value: 66185.71
      };
      setStats(mockStats);
    } catch (err: any) {
      console.error('Error fetching order stats:', err);
    }
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const styles = {
      pending: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      confirmed: 'bg-neutral-200 text-neutral-800 border-neutral-300',
      processing: 'bg-neutral-300 text-neutral-900 border-neutral-400',
      shipped: 'bg-neutral-400 text-neutral-900 border-neutral-500',
      delivered: 'bg-neutral-900 text-white border-neutral-900',
      cancelled: 'bg-white text-neutral-600 border-neutral-300',
      returned: 'bg-neutral-50 text-neutral-500 border-neutral-200',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium border rounded capitalize ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: PaymentStatus) => {
    const styles = {
      pending: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      paid: 'bg-neutral-900 text-white border-neutral-900',
      failed: 'bg-white text-neutral-600 border-neutral-300',
      refunded: 'bg-neutral-50 text-neutral-500 border-neutral-200',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium border rounded capitalize ${styles[paymentStatus]}`}>
        {paymentStatus}
      </span>
    );
  };

  const getStatusIcon = (status: OrderStatus) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
      returned: RotateCcw,
    };
    const Icon = icons[status];
    return <Icon className="w-4 h-4" />;
  };

  const handleViewOrder = async (order: Order) => {
    try {
      // Fetch full order details including items
      const fullOrder = await ordersService.getById(order.id);
      // View order details in modal (can be enhanced with a view-only modal later)
      console.log('Viewing order:', fullOrder);
      alert(`Order #${fullOrder.id} - Status: ${fullOrder.status}\nCustomer: ${fullOrder.customer_name}\nTotal: ₹${fullOrder.total_amount}`);
    } catch (err: any) {
      alert('Failed to load order details: ' + err.message);
    }
  };

  const handleOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveSuccess = () => {
    fetchOrders(); // Refresh the list
    fetchStats(); // Refresh stats
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await ordersService.delete(orderId);
        fetchOrders(); // Refresh the list
        fetchStats(); // Refresh stats
      } catch (err: any) {
        alert('Failed to delete order: ' + err.message);
      }
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await ordersService.updateStatus(orderId, { status: newStatus });
      fetchOrders(); // Refresh the list
      fetchStats(); // Refresh stats
      alert(`Order status updated to ${newStatus}!`);
    } catch (err: any) {
      alert('Failed to update order status: ' + err.message);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on search
    fetchOrders();
  };

  if (loading && orders.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
          <p className="mt-4 text-neutral-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Order Management</h1>
          <p className="text-neutral-600 mt-1">Track and manage all your orders in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={handleOpenCreateModal} 
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Order
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-neutral-50 border border-neutral-300 text-neutral-900 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Orders</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total_orders}</p>
              </div>
              <div className="p-3 bg-neutral-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-neutral-700" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Pending</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.pending_orders}</p>
              </div>
              <div className="p-3 bg-neutral-100 rounded-lg">
                <Clock className="w-6 h-6 text-neutral-700" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Processing</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {(Number(stats.confirmed_orders) || 0) + (Number(stats.processing_orders) || 0)}
                </p>
              </div>
              <div className="p-3 bg-neutral-100 rounded-lg">
                <Package className="w-6 h-6 text-neutral-700" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Delivered</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.delivered_orders}</p>
              </div>
              <div className="p-3 bg-neutral-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-neutral-700" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Revenue</p>
                <p className="text-xl font-bold text-neutral-900 mt-1">
                  {formatCurrency(stats.total_revenue)}
                </p>
              </div>
              <div className="p-3 bg-neutral-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-neutral-700" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by order number or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
          </form>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-neutral-600" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-neutral-600" />
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-neutral-600">Order</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-neutral-600">Customer</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-neutral-600">Payment</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-neutral-600">Amount</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-neutral-600">Date</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No orders found. {searchQuery || statusFilter !== 'all' || paymentStatusFilter !== 'all' 
                      ? 'Try adjusting your filters.' 
                      : 'Create your first order to get started.'}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-neutral-900">{order.order_number}</p>
                        {order.notes && (
                          <p className="text-xs text-neutral-500 mt-1 truncate max-w-[200px]">
                            {order.notes}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {order.customer_name && (
                          <div className="flex items-center gap-2 text-sm text-neutral-900">
                            <User className="w-4 h-4 text-neutral-400" />
                            <span className="font-medium">{order.customer_name}</span>
                          </div>
                        )}
                        {order.customer_email && (
                          <p className="text-xs text-neutral-500 truncate max-w-[200px]">
                            {order.customer_email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getPaymentStatusBadge(order.payment_status)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-neutral-900 font-medium">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Quick Status Update Menu */}
                        <div className="relative group">
                          <button
                            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
                            title="Update Status"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-10">
                            <div className="py-1">
                              {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleUpdateStatus(order.id, status as OrderStatus)}
                                  className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 capitalize"
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteOrder(order.id)}
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
              Page {currentPage} of {totalPages} ({totalOrders} total orders)
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

      {/* Order Modal - Lazy Loaded */}
      {isModalOpen && (
        <Suspense fallback={<ModalLoader />}>
          <OrderModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSuccess={handleSaveSuccess}
            mode="create"
          />
        </Suspense>
      )}

      {/* TODO: Implement Order Detail Modal */}
      {/* <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onStatusUpdate={handleUpdateStatus}
      /> */}
    </div>
  );
}
