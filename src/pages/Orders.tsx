import { useState } from 'react';
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
} from 'lucide-react';
import { mockOrders } from '@/data/mockData';
import { Order, OrderStatus } from '@/types';
import OrderDetailModal from '@/components/OrderDetailModal';
import CreateOrderModal from '@/components/CreateOrderModal';

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status: OrderStatus): string => {
    const colors = {
      pending: 'bg-neutral-200 text-neutral-900',
      confirmed: 'bg-neutral-300 text-neutral-900',
      packed: 'bg-neutral-400 text-white',
      shipped: 'bg-neutral-700 text-white',
      delivered: 'bg-neutral-900 text-white',
      cancelled: 'bg-neutral-100 text-neutral-600',
    };
    return colors[status];
  };

  // Get status icon
  const getStatusIcon = (status: OrderStatus) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      packed: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: Trash2,
    };
    const Icon = icons[status];
    return <Icon className="w-4 h-4" />;
  };

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => ['confirmed', 'packed'].includes(o.status)).length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    totalRevenue: orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0),
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  // Handle create order
  const handleCreateOrder = (newOrder: Partial<Order>) => {
    // Calculate estimated delivery based on delivery type
    const today = new Date();
    const estimatedDelivery = new Date(today);
    estimatedDelivery.setDate(today.getDate() + (newOrder.deliveryType === 'express' ? 2 : 5));

    const completeOrder: Order = {
      ...newOrder,
      id: `ord-${Date.now()}`,
      orderNumber: newOrder.orderNumber || `ORD-${Date.now()}`,
      customerId: newOrder.customerId || '',
      customerName: newOrder.customerName || '',
      items: newOrder.items || [],
      subtotal: newOrder.subtotal || 0,
      tax: newOrder.tax || 0,
      shippingCost: newOrder.shippingCost || 0,
      total: newOrder.total || 0,
      status: newOrder.status || 'pending',
      paymentStatus: newOrder.paymentStatus || 'pending',
      deliveryType: newOrder.deliveryType || 'standard',
      shippingAddress: newOrder.shippingAddress || {
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
      },
      estimatedDelivery,
      notes: newOrder.notes,
      trackingNumber: newOrder.trackingNumber,
      createdAt: newOrder.createdAt || new Date(),
      updatedAt: newOrder.updatedAt || new Date(),
    };
    
    setOrders([completeOrder, ...orders]);
    alert('Order created successfully!');
  };

  // Handle status update
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          // Generate tracking number when shipped
          const trackingNumber = newStatus === 'shipped' && !order.trackingNumber
            ? `TRK-${Date.now()}`
            : order.trackingNumber;

          // Update notes if provided
          const updatedNotes = note
            ? `${order.notes ? order.notes + '\n\n' : ''}[${new Date().toLocaleString('en-IN')}] Status updated to ${newStatus}: ${note}`
            : order.notes;

          return {
            ...order,
            status: newStatus,
            trackingNumber,
            notes: updatedNotes,
            updatedAt: new Date(),
          };
        }
        return order;
      })
    );

    // Update selected order if it's the one being updated
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => {
        if (!prev) return null;
        const trackingNumber = newStatus === 'shipped' && !prev.trackingNumber
          ? `TRK-${Date.now()}`
          : prev.trackingNumber;
        
        const updatedNotes = note
          ? `${prev.notes ? prev.notes + '\n\n' : ''}[${new Date().toLocaleString('en-IN')}] Status updated to ${newStatus}: ${note}`
          : prev.notes;

        return {
          ...prev,
          status: newStatus,
          trackingNumber,
          notes: updatedNotes,
          updatedAt: new Date(),
        };
      });
    }

    alert(`Order status updated to ${newStatus}!`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Order Management</h1>
          <p className="text-neutral-600 mt-1">
            Track and manage all your orders in one place
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Order</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Orders</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Pending</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Processing</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.processing}</p>
            </div>
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Shipped</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.shipped}</p>
            </div>
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Revenue</p>
              <p className="text-xl font-bold text-neutral-900 mt-1">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by order number or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button className="btn-secondary flex items-center gap-2 justify-center">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900 font-mono">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {order.deliveryType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">
                      {order.customerName}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {order.shippingAddress.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      {formatDate(order.createdAt)}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {new Date(order.createdAt).toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-neutral-900">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-neutral-900">
                      {formatCurrency(order.total)}
                    </div>
                    <div className="text-xs text-neutral-500">
                      incl. tax
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`badge ${
                        order.paymentStatus === 'paid'
                          ? 'bg-neutral-900 text-white'
                          : order.paymentStatus === 'partial'
                          ? 'bg-neutral-300 text-neutral-900'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </button>
                      <button 
                        className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                        title="Edit order"
                      >
                        <Edit className="w-4 h-4 text-neutral-600" />
                      </button>
                      <button 
                        className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="w-4 h-4 text-neutral-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-neutral-900 mb-1">No orders found</h3>
            <p className="text-neutral-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOrder}
      />
    </div>
  );
}
