import { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { OrderStatus } from '@/types';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: OrderStatus;
  onUpdateStatus: (newStatus: OrderStatus, note?: string) => void;
  orderNumber: string;
}

export default function UpdateStatusModal({
  isOpen,
  onClose,
  currentStatus,
  onUpdateStatus,
  orderNumber,
}: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Define status workflow with allowed transitions
  const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];
  const currentIndex = statusFlow.indexOf(currentStatus);

  // Get available next statuses
  const getAvailableStatuses = (): { value: OrderStatus; label: string; disabled: boolean; reason?: string }[] => {
    return [
      {
        value: 'pending',
        label: 'Pending',
        disabled: currentIndex > 0 && currentStatus !== 'cancelled',
        reason: 'Cannot move back to pending',
      },
      {
        value: 'confirmed',
        label: 'Confirmed',
        disabled: currentIndex > 1 && currentStatus !== 'cancelled',
        reason: 'Cannot move backwards',
      },
      {
        value: 'packed',
        label: 'Packed',
        disabled: currentIndex < 1 || (currentIndex > 2 && currentStatus !== 'cancelled'),
        reason: currentIndex < 1 ? 'Must confirm order first' : 'Cannot move backwards',
      },
      {
        value: 'shipped',
        label: 'Shipped',
        disabled: currentIndex < 2 || (currentIndex > 3 && currentStatus !== 'cancelled'),
        reason: currentIndex < 2 ? 'Must pack order first' : 'Cannot move backwards',
      },
      {
        value: 'delivered',
        label: 'Delivered',
        disabled: currentIndex < 3,
        reason: 'Must ship order first',
      },
      {
        value: 'cancelled',
        label: 'Cancelled',
        disabled: currentStatus === 'delivered',
        reason: 'Cannot cancel delivered orders',
      },
    ];
  };

  const availableStatuses = getAvailableStatuses();

  const handleSubmit = () => {
    if (selectedStatus === currentStatus) {
      setError('Please select a different status');
      return;
    }

    // Validation for cancelled status
    if (selectedStatus === 'cancelled' && !note.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    onUpdateStatus(selectedStatus, note.trim() || undefined);
    onClose();
    
    // Reset state
    setNote('');
    setError('');
  };

  const getStatusColor = (status: OrderStatus): string => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      packed: 'bg-purple-100 text-purple-800 border-purple-300',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || colors.pending;
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
        <div className="relative bg-white rounded-lg shadow-minimal-xl w-full max-w-md">
          {/* Header */}
          <div className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Update Order Status</h2>
              <p className="text-sm text-neutral-600 mt-1 font-mono">{orderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Current Status */}
            <div className="card p-4 bg-neutral-50">
              <p className="text-sm text-neutral-600 mb-2">Current Status</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize border ${getStatusColor(
                  currentStatus
                )}`}
              >
                {currentStatus}
              </span>
            </div>

            {/* Status Options */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-3">
                Select New Status
              </label>
              <div className="space-y-2">
                {availableStatuses.map((status) => (
                  <div key={status.value}>
                    <button
                      onClick={() => {
                        if (!status.disabled) {
                          setSelectedStatus(status.value);
                          setError('');
                        }
                      }}
                      disabled={status.disabled}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedStatus === status.value
                          ? 'border-neutral-900 bg-neutral-50'
                          : status.disabled
                          ? 'border-neutral-200 bg-neutral-50 cursor-not-allowed opacity-50'
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-medium capitalize ${
                            status.disabled ? 'text-neutral-400' : 'text-neutral-900'
                          }`}
                        >
                          {status.label}
                        </span>
                        {selectedStatus === status.value && !status.disabled && (
                          <CheckCircle className="w-5 h-5 text-neutral-900" />
                        )}
                      </div>
                      {status.disabled && status.reason && (
                        <p className="text-xs text-neutral-500 mt-1">{status.reason}</p>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Notes {selectedStatus === 'cancelled' && <span className="text-red-600">*</span>}
              </label>
              <textarea
                className="input"
                rows={3}
                placeholder={
                  selectedStatus === 'cancelled'
                    ? 'Please provide a reason for cancellation...'
                    : 'Add notes about this status change (optional)...'
                }
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setError('');
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Info Message */}
            {selectedStatus !== currentStatus && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-600">
                  Status will be updated from{' '}
                  <span className="font-semibold capitalize">{currentStatus}</span> to{' '}
                  <span className="font-semibold capitalize">{selectedStatus}</span>
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 px-6 py-4 flex items-center justify-end gap-3">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedStatus === currentStatus}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
