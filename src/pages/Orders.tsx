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
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, paymentStatusFilter, searchQuery]);

  // Fetch stats
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        page: currentPage,
        limit: 10,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(paymentStatusFilter !== 'all' && { payment_status: paymentStatusFilter }),
        ...(searchQuery && { search: searchQuery }),
        sortBy: 'created_at' as const,
        order: 'DESC' as const
      };
      
      const response = await ordersService.getAll(filters);
      setOrders(response.orders);
      setTotalPages(response.pagination.totalPages);
      setTotalOrders(response.pagination.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await ordersService.getStats();
      setStats(statsData);
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
