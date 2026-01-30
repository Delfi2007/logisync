import { X, Mail, Phone, MapPin, Building2, Hash, ShoppingBag, TrendingUp, Calendar } from 'lucide-react';
import { Customer, CustomerSegment } from '@/types';
import { mockOrders } from '@/data/mockData';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export default function CustomerDetailModal({ isOpen, onClose, customer }: CustomerDetailModalProps) {
  if (!isOpen || !customer) return null;

  // Get customer's orders
  const customerOrders = mockOrders.filter(order => order.customerId === customer.id);
  const sortedOrders = customerOrders.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getSegmentColor = (segment: CustomerSegment) => {
    const colors = {
      premium: 'text-purple-600 bg-purple-100 border-purple-200',
      regular: 'text-blue-600 bg-blue-100 border-blue-200',
      new: 'text-green-600 bg-green-100 border-green-200',
    };
    return colors[segment];
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-neutral-100 text-neutral-700',
      confirmed: 'bg-blue-100 text-blue-700',
      packed: 'bg-purple-100 text-purple-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-minimal-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">{customer.name}</h2>
              {customer.businessName && (
                <p className="text-sm text-neutral-600 mt-1">{customer.businessName}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Customer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-100 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-neutral-700" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Total Orders</p>
                    <p className="text-2xl font-bold text-neutral-900">{customer.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Lifetime Value</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(customer.lifetimeValue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getSegmentColor(customer.segment)}`}>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Segment</p>
                    <p className={`text-xl font-bold capitalize ${getSegmentColor(customer.segment)}`}>
                      {customer.segment}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-neutral-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-600">Email Address</p>
                    <p className="text-sm font-medium text-neutral-900">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-neutral-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-600">Phone Number</p>
                    <p className="text-sm font-medium text-neutral-900">{customer.phone}</p>
                  </div>
                </div>
                {customer.gstNumber && (
                  <div className="flex items-start gap-3">
                    <Hash className="w-5 h-5 text-neutral-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-neutral-600">GST Number</p>
                      <p className="text-sm font-medium text-neutral-900 font-mono">
                        {customer.gstNumber}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-neutral-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-600">Customer Since</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {formatDate(customer.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Billing Address */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-neutral-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Billing Address</h3>
                </div>
                <div className="text-sm text-neutral-700 space-y-1">
                  <p>{customer.billingAddress.line1}</p>
                  {customer.billingAddress.line2 && <p>{customer.billingAddress.line2}</p>}
                  <p>{customer.billingAddress.city}, {customer.billingAddress.state}</p>
                  <p>PIN: {customer.billingAddress.pincode}</p>
                </div>
              </div>

              {/* Shipping Addresses */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-neutral-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Shipping Addresses</h3>
                </div>
                <div className="space-y-4">
                  {customer.shippingAddresses.map((address, index) => (
                    <div key={index} className="text-sm text-neutral-700 space-y-1">
                      {customer.shippingAddresses.length > 1 && (
                        <p className="text-xs font-semibold text-neutral-500 uppercase">
                          Address {index + 1}
                        </p>
                      )}
                      <p>{address.line1}</p>
                      {address.line2 && <p>{address.line2}</p>}
                      <p>{address.city}, {address.state}</p>
                      <p>PIN: {address.pincode}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order History</h3>
              {sortedOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-600">No orders yet</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    This customer hasn't placed any orders
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        <th className="text-left text-xs font-semibold text-neutral-600 px-4 py-3">
                          Order #
                        </th>
                        <th className="text-left text-xs font-semibold text-neutral-600 px-4 py-3">
                          Date
                        </th>
                        <th className="text-left text-xs font-semibold text-neutral-600 px-4 py-3">
                          Status
                        </th>
                        <th className="text-right text-xs font-semibold text-neutral-600 px-4 py-3">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {sortedOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="text-sm font-mono font-medium text-neutral-900">
                              {order.orderNumber}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-600">
                              {formatDate(order.createdAt)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm font-medium text-neutral-900">
                              {formatCurrency(order.total)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <button onClick={onClose} className="btn-secondary">
                Close
              </button>
              <button className="btn-primary">
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
