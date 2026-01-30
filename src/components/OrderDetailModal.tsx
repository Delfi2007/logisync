import { useState } from 'react';
import { X, MapPin, Calendar, Truck, Package, CreditCard, FileText } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import UpdateStatusModal from './UpdateStatusModal';
import InvoiceModal from './InvoiceModal';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus, note?: string) => void;
}

export default function OrderDetailModal({ isOpen, onClose, order, onUpdateStatus }: OrderDetailModalProps) {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  if (!isOpen || !order) return null;

  const handleUpdateStatus = (newStatus: OrderStatus, note?: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(order.id, newStatus, note);
    }
    setIsStatusModalOpen(false);
  };

  const handleGenerateInvoice = () => {
    setIsInvoiceModalOpen(true);
  };

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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getStatusSteps = () => {
    const allSteps = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];
    const currentIndex = allSteps.indexOf(order.status);
    return allSteps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  const statusSteps = getStatusSteps();

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
              <h2 className="text-2xl font-bold text-neutral-900">Order Details</h2>
              <p className="text-sm text-neutral-600 mt-1 font-mono">{order.orderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Timeline */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Order Status</h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200">
                  <div
                    className="h-full bg-neutral-900 transition-all duration-300"
                    style={{
                      width: `${(statusSteps.filter(s => s.completed).length - 1) * 25}%`,
                    }}
                  />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => (
                    <div key={step.name} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          step.completed
                            ? 'bg-neutral-900 border-neutral-900 text-white'
                            : 'bg-white border-neutral-300 text-neutral-400'
                        }`}
                      >
                        {step.completed ? (
                          <Package className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium capitalize ${
                          step.completed ? 'text-neutral-900' : 'text-neutral-500'
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {order.customerName || 'N/A'}
                      </p>
                      <p className="text-sm text-neutral-600 mt-1">
                        {order.shippingAddress.line1}
                        {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                      <p className="text-sm text-neutral-600">
                        PIN: {order.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-neutral-600" />
                    <div>
                      <p className="text-xs text-neutral-500">Order Date</p>
                      <p className="text-sm font-medium text-neutral-900">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-neutral-600" />
                    <div>
                      <p className="text-xs text-neutral-500">Delivery Type</p>
                      <p className="text-sm font-medium text-neutral-900 capitalize">
                        {order.deliveryType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-neutral-600" />
                    <div>
                      <p className="text-xs text-neutral-500">Payment Status</p>
                      <p className="text-sm font-medium text-neutral-900 capitalize">
                        {order.paymentStatus}
                      </p>
                    </div>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-neutral-600" />
                      <div>
                        <p className="text-xs text-neutral-500">Tracking Number</p>
                        <p className="text-sm font-medium text-neutral-900 font-mono">
                          {order.trackingNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-neutral-200">
                        <Package className="w-6 h-6 text-neutral-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{item.productName}</p>
                        <p className="text-sm text-neutral-600">
                          Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neutral-900">{formatCurrency(item.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Tax (GST)</span>
                  <span className="font-medium text-neutral-900">{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium text-neutral-900">
                    {formatCurrency(order.shippingCost)}
                  </span>
                </div>
                <div className="pt-3 border-t border-neutral-200">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-neutral-900">Total</span>
                    <span className="text-lg font-bold text-neutral-900">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Notes</h3>
                <p className="text-sm text-neutral-700">{order.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-200">
              <button 
                onClick={handleGenerateInvoice}
                className="btn-secondary flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Generate Invoice
              </button>
              <div className="flex gap-3">
                <button onClick={onClose} className="btn-secondary">
                  Close
                </button>
                <button 
                  onClick={() => setIsStatusModalOpen(true)}
                  className="btn-primary"
                  disabled={order.status === 'delivered' || order.status === 'cancelled'}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      <UpdateStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={order.status}
        onUpdateStatus={handleUpdateStatus}
        orderNumber={order.orderNumber}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        order={order}
      />
    </div>
  );
}
