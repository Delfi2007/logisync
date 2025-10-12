import { memo } from 'react';
import { 
  MapPin, 
  Building2, 
  Eye, 
  Pencil, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle
} from 'lucide-react';
import { Warehouse, WarehouseStatus } from '@/services/warehouses';

interface WarehouseRowProps {
  warehouse: Warehouse;
  isSelected: boolean;
  onSelect: (warehouseId: number) => void;
  onView: (warehouse: Warehouse) => void;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouseId: number, warehouseName: string) => void;
  onUpdateStatus: (warehouseId: number, status: WarehouseStatus) => void;
}

const WarehouseRow = memo<WarehouseRowProps>(({ 
  warehouse, 
  isSelected, 
  onSelect, 
  onView,
  onEdit, 
  onDelete,
  onUpdateStatus
}) => {
  const formatArea = (capacity: number) => {
    if (capacity >= 100000) {
      return `${(capacity / 100000).toFixed(1)}L units`;
    } else if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)}K units`;
    }
    return `${capacity} units`;
  };

  const getStatusBadge = (status: WarehouseStatus) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: CheckCircle,
        label: 'Active'
      },
      inactive: {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: XCircle,
        label: 'Inactive'
      },
      maintenance: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: AlertCircle,
        label: 'Maintenance'
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const utilizationPercent = warehouse.capacity > 0 
    ? (warehouse.occupied / warehouse.capacity) * 100 
    : 0;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(warehouse.id)}
          className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{warehouse.name}</p>
            <p className="text-xs text-gray-500">{warehouse.code}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-900">{warehouse.city}, {warehouse.state}</p>
            <p className="text-xs text-gray-500">{warehouse.pincode}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-gray-900">{formatArea(warehouse.capacity)}</p>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-gray-900">{formatArea(warehouse.available)}</p>
      </td>
      <td className="px-6 py-4">
        <div>
          <p className="text-sm text-gray-900 mb-1">{utilizationPercent.toFixed(1)}%</p>
          <div className="w-24 bg-gray-100 rounded-full h-1.5">
            <div 
              className="bg-gray-900 h-1.5 rounded-full"
              style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 relative group">
        {getStatusBadge(warehouse.status)}
        
        {/* Quick Status Update Dropdown */}
        <div className="hidden group-hover:block absolute left-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]">
          {(['active', 'inactive', 'maintenance'] as WarehouseStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => onUpdateStatus(warehouse.id, status)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                warehouse.status === status ? 'bg-gray-50 font-medium' : ''
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
          warehouse.is_verified
            ? 'bg-green-50 text-green-700'
            : 'bg-gray-50 text-gray-700'
        }`}>
          {warehouse.is_verified ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Verified
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3" />
              Unverified
            </>
          )}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onView(warehouse)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onEdit(warehouse)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit Warehouse"
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(warehouse.id, warehouse.name)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Warehouse"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  );
});

WarehouseRow.displayName = 'WarehouseRow';

export default WarehouseRow;
