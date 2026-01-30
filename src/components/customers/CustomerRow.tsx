import { memo } from 'react';
import { Eye, Edit, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import { Customer } from '@/services/customers';

interface CustomerRowProps {
  customer: Customer;
  isSelected: boolean;
  onSelect: (customerId: number) => void;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: number) => void;
}

const CustomerRow = memo<CustomerRowProps>(({ 
  customer, 
  isSelected, 
  onSelect, 
  onView,
  onEdit, 
  onDelete 
}) => {
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
      premium: 'bg-neutral-900 text-white border-neutral-900',
      regular: 'bg-neutral-300 text-neutral-900 border-neutral-400',
      new: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium border rounded capitalize ${styles[segment]}`}>
        {segment}
      </span>
    );
  };

  return (
    <tr className="hover:bg-neutral-50">
      <td className="py-4 px-6">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(customer.id)}
          className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
        />
      </td>
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
            onClick={() => onView(customer)}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(customer)}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(customer.id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
});

CustomerRow.displayName = 'CustomerRow';

export default CustomerRow;
