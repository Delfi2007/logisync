import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Package,
  AlertTriangle,
  TrendingDown,
  Trash2,
  Loader2,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  User,
  FileText,
  TrendingUp
} from 'lucide-react';
import ModalLoader from '@/components/ModalLoader';
import ProductRow from '@/components/products/ProductRow';
import productsService, { Category, Product } from '@/services/products';
import { useDebounce } from '@/hooks/useDebounce';

// Lazy load the modal component
const ProductModal = lazy(() => import('@/components/products/ProductModal'));

type TabType = 'products' | 'movements' | 'alerts';

// Stock Movement Types
interface StockMovement {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reference_number: string;
  notes: string;
  created_by: string;
  created_at: string;
  warehouse?: string;
}

// Stock Movements Tab Component
function StockMovementsTab({ products: _products }: { products: Product[] }) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'in' | 'out' | 'adjustment'>('all');
  const [dateFilter, setDateFilter] = useState<'7days' | '30days' | '90days' | 'all'>('30days');

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchMovements();
  }, [debouncedSearch, typeFilter, dateFilter]);

  const fetchMovements = () => {
    setLoading(true);

    setTimeout(() => {
      // STATIC MOCK DATA - Stock movements history
      const mockMovements: StockMovement[] = [
        {
          id: 1,
          product_id: 1,
          product_name: 'Industrial Pump XL-2000',
          product_sku: 'PUMP-XL-2000',
          type: 'in',
          quantity: 50,
          previous_stock: 125,
          new_stock: 175,
          reference_number: 'PO-2025-0234',
          notes: 'Restocking from supplier - Acme Industries',
          created_by: 'John Manager',
          created_at: '2025-10-21T14:30:00Z',
          warehouse: 'Mumbai Central Warehouse'
        },
        {
          id: 2,
          product_id: 2,
          product_name: 'Medical Supplies Kit Pro',
          product_sku: 'MED-KIT-PRO',
          type: 'out',
          quantity: 25,
          previous_stock: 89,
          new_stock: 64,
          reference_number: 'ORD-2025-001',
          notes: 'Fulfilled order for Apollo Hospitals',
          created_by: 'System',
          created_at: '2025-10-21T10:15:00Z',
          warehouse: 'Delhi Medical Hub'
        },
        {
          id: 3,
          product_id: 1,
          product_name: 'Industrial Pump XL-2000',
          product_sku: 'PUMP-XL-2000',
          type: 'out',
          quantity: 15,
          previous_stock: 175,
          new_stock: 160,
          reference_number: 'ORD-2025-002',
          notes: 'Sales order to construction company',
          created_by: 'System',
          created_at: '2025-10-20T16:45:00Z',
          warehouse: 'Mumbai Central Warehouse'
        },
        {
          id: 4,
          product_id: 3,
          product_name: 'Electronic Component Set',
          product_sku: 'ELEC-COMP-001',
          type: 'adjustment',
          quantity: -5,
          previous_stock: 234,
          new_stock: 229,
          reference_number: 'ADJ-2025-012',
          notes: 'Stock adjustment - damaged items removed',
          created_by: 'Sarah Warehouse',
          created_at: '2025-10-20T09:20:00Z',
          warehouse: 'Bangalore Tech Center'
        },
        {
          id: 5,
          product_id: 4,
          product_name: 'Construction Materials Bundle',
          product_sku: 'CONST-MAT-B01',
          type: 'in',
          quantity: 100,
          previous_stock: 45,
          new_stock: 145,
          reference_number: 'PO-2025-0235',
          notes: 'Bulk purchase for Q4 demand',
          created_by: 'Mike Procurement',
          created_at: '2025-10-19T11:00:00Z',
          warehouse: 'Pune Distribution Center'
        },
        {
          id: 6,
          product_id: 2,
          product_name: 'Medical Supplies Kit Pro',
          product_sku: 'MED-KIT-PRO',
          type: 'out',
          quantity: 18,
          previous_stock: 64,
          new_stock: 46,
          reference_number: 'ORD-2025-003',
          notes: 'Emergency shipment to clinic',
          created_by: 'System',
          created_at: '2025-10-19T08:30:00Z',
          warehouse: 'Delhi Medical Hub'
        },
        {
          id: 7,
          product_id: 5,
          product_name: 'Office Furniture Set',
          product_sku: 'OFF-FURN-S01',
          type: 'in',
          quantity: 30,
          previous_stock: 12,
          new_stock: 42,
          reference_number: 'PO-2025-0236',
          notes: 'New stock from manufacturer',
          created_by: 'John Manager',
          created_at: '2025-10-18T15:20:00Z',
          warehouse: 'Chennai Furniture Depot'
        },
        {
          id: 8,
          product_id: 3,
          product_name: 'Electronic Component Set',
          product_sku: 'ELEC-COMP-001',
          type: 'out',
          quantity: 45,
          previous_stock: 229,
          new_stock: 184,
          reference_number: 'ORD-2025-004',
          notes: 'Large order for electronics manufacturer',
          created_by: 'System',
          created_at: '2025-10-18T13:10:00Z',
          warehouse: 'Bangalore Tech Center'
        },
        {
          id: 9,
          product_id: 1,
          product_name: 'Industrial Pump XL-2000',
          product_sku: 'PUMP-XL-2000',
          type: 'adjustment',
          quantity: 3,
          previous_stock: 160,
          new_stock: 163,
          reference_number: 'ADJ-2025-013',
          notes: 'Stock count correction - found extra units',
          created_by: 'Sarah Warehouse',
          created_at: '2025-10-17T10:45:00Z',
          warehouse: 'Mumbai Central Warehouse'
        },
        {
          id: 10,
          product_id: 4,
          product_name: 'Construction Materials Bundle',
          product_sku: 'CONST-MAT-B01',
          type: 'out',
          quantity: 35,
          previous_stock: 145,
          new_stock: 110,
          reference_number: 'ORD-2025-005',
          notes: 'Delivered to construction site',
          created_by: 'System',
          created_at: '2025-10-17T07:30:00Z',
          warehouse: 'Pune Distribution Center'
        },
        {
          id: 11,
          product_id: 5,
          product_name: 'Office Furniture Set',
          product_sku: 'OFF-FURN-S01',
          type: 'out',
          quantity: 12,
          previous_stock: 42,
          new_stock: 30,
          reference_number: 'ORD-2025-006',
          notes: 'Corporate office setup order',
          created_by: 'System',
          created_at: '2025-10-16T14:00:00Z',
          warehouse: 'Chennai Furniture Depot'
        },
        {
          id: 12,
          product_id: 2,
          product_name: 'Medical Supplies Kit Pro',
          product_sku: 'MED-KIT-PRO',
          type: 'in',
          quantity: 75,
          previous_stock: 46,
          new_stock: 121,
          reference_number: 'PO-2025-0237',
          notes: 'Quarterly restocking from certified supplier',
          created_by: 'Mike Procurement',
          created_at: '2025-10-15T09:15:00Z',
          warehouse: 'Delhi Medical Hub'
        }
      ];

      // Apply filters
      let filtered = mockMovements;

      if (debouncedSearch) {
        filtered = filtered.filter(m =>
          m.product_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          m.product_sku.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          m.reference_number.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          m.notes.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      }

      if (typeFilter !== 'all') {
        filtered = filtered.filter(m => m.type === typeFilter);
      }

      // Date filtering
      const now = new Date();
      if (dateFilter !== 'all') {
        const daysMap = { '7days': 7, '30days': 30, '90days': 90 };
        const days = daysMap[dateFilter];
        const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(m => new Date(m.created_at) >= cutoffDate);
      }

      setMovements(filtered);
      setLoading(false);
    }, 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <ArrowUpCircle className="h-5 w-5 text-green-600" />;
      case 'out':
        return <ArrowDownCircle className="h-5 w-5 text-red-600" />;
      case 'adjustment':
        return <TrendingUp className="h-5 w-5 text-amber-600" />;
      default:
        return <Package className="h-5 w-5 text-neutral-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      in: 'bg-green-50 text-green-700 border-green-200',
      out: 'bg-red-50 text-red-700 border-red-200',
      adjustment: 'bg-amber-50 text-amber-700 border-amber-200'
    };
    const labels = { in: 'Stock In', out: 'Stock Out', adjustment: 'Adjustment' };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalIn = movements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0);
    const totalOut = movements.filter(m => m.type === 'out').reduce((sum, m) => sum + Math.abs(m.quantity), 0);
    const adjustments = movements.filter(m => m.type === 'adjustment').length;

    return { totalIn, totalOut, adjustments, total: movements.length };
  }, [movements]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Movements</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-neutral-400" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Stock In</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.totalIn}</p>
            </div>
            <ArrowUpCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Stock Out</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.totalOut}</p>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Adjustments</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.adjustments}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search movements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="input"
          >
            <option value="all">All Types</option>
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
            <option value="adjustment">Adjustments</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="input"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Movements List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Stock Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {movements.map((movement) => (
                <tr key={movement.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(movement.type)}
                      {getTypeBadge(movement.type)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{movement.product_name}</p>
                      <p className="text-xs text-neutral-500">{movement.product_sku}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${movement.type === 'in' ? 'text-green-600' :
                        movement.type === 'out' ? 'text-red-600' :
                          movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : movement.quantity > 0 ? '+' : ''}{Math.abs(movement.quantity)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      {movement.previous_stock} → {movement.new_stock}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{movement.reference_number}</p>
                      <p className="text-xs text-neutral-500">{movement.notes}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-neutral-700">{movement.warehouse}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-neutral-600">
                      <Calendar className="h-4 w-4" />
                      {formatDate(movement.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-neutral-600">
                      <User className="h-4 w-4" />
                      {movement.created_by}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {movements.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-neutral-900 mb-1">No movements found</h3>
              <p className="text-neutral-600">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Inventory() {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Bulk selection state
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch products (wrapped in useCallback for stable reference)
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getAll({
        page: currentPage,
        limit: 20,
        search: debouncedSearchQuery || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
      });
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, selectedCategory]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const data = await productsService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  // Fetch low stock products (wrapped in useCallback for stable reference)
  const fetchLowStock = useCallback(async () => {
    try {
      const data = await productsService.getLowStock();
      setLowStockProducts(data.products);
    } catch (err) {
      console.error('Failed to load low stock products:', err);
    }
  }, []);

  // Load data on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
    fetchLowStock();
  }, [fetchCategories, fetchLowStock]);

  // Memoized calculations for stats cards - Only recalculate when products array changes
  const outOfStockCount = useMemo(() => {
    return products.filter(p => p.stock === 0).length;
  }, [products]);

  const totalStockValue = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
  }, [products]);

  const formattedStockValue = useMemo(() => {
    return totalStockValue.toLocaleString('en-IN');
  }, [totalStockValue]);

  // Handle opening modal for create
  const handleOpenCreateModal = useCallback(() => {
    setModalMode('create');
    setEditingProduct(null);
    setIsModalOpen(true);
  }, []);

  // Handle opening modal for edit
  const handleOpenEditModal = useCallback((product: Product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setIsModalOpen(true);
  }, []);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingProduct(null);
  }, []);

  // Handle successful save
  const handleSaveSuccess = useCallback(() => {
    fetchProducts(); // Reload products
    fetchLowStock(); // Update low stock list
  }, [fetchProducts, fetchLowStock]);

  // Handle product delete
  const handleDeleteProduct = useCallback(async (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productsService.delete(productId);
        fetchProducts(); // Reload products
        fetchLowStock(); // Update low stock list
      } catch (err: any) {
        alert(err.message || 'Failed to delete product');
      }
    }
  }, [fetchProducts, fetchLowStock]);

  // Bulk selection handlers
  const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(products.map(p => p.id));
      setSelectedProducts(allIds);
    } else {
      setSelectedProducts(new Set());
    }
  }, [products]);

  const handleSelectProduct = useCallback((productId: number) => {
    setSelectedProducts(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  }, []);

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;

    const count = selectedProducts.size;
    if (!confirm(`Are you sure you want to delete ${count} product${count > 1 ? 's' : ''}? This action cannot be undone.`)) {
      return;
    }

    setBulkDeleting(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Delete products one by one (you could batch this if your API supports it)
      for (const productId of Array.from(selectedProducts)) {
        try {
          await productsService.delete(productId);
          successCount++;
        } catch (err: any) {
          console.error(`Failed to delete product ${productId}:`, err);
          console.error('Error details:', err.response?.data || err.message);
          errorCount++;
        }
      }

      // Show results
      if (errorCount === 0) {
        alert(`Successfully deleted ${successCount} product${successCount > 1 ? 's' : ''}`);
      } else {
        alert(`Deleted ${successCount} product${successCount > 1 ? 's' : ''}. Failed to delete ${errorCount}.`);
      }

      // Clear selection and refresh
      setSelectedProducts(new Set());
      await fetchProducts();
      await fetchLowStock();
    } catch (error: any) {
      console.error('Bulk delete error:', error);
      alert('Failed to complete bulk delete operation: ' + (error.message || 'Unknown error'));
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const dataToExport = selectedProducts.size > 0
      ? products.filter(p => selectedProducts.has(p.id))
      : products;

    // Create CSV content
    const headers = ['Name', 'SKU', 'Category', 'Price', 'Cost', 'Stock', 'Reorder Level', 'Status'];
    const rows = dataToExport.map(p => [
      p.name,
      p.sku,
      p.category || '',
      p.price,
      p.cost,
      p.stock,
      p.reorder_level,
      p.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Inventory Management</h1>
          <p className="text-neutral-600 mt-1">
            Manage your products, track stock levels, and monitor movements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Products</p>
              {loading ? (
                <div className="h-8 w-16 bg-neutral-200 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-2xl font-bold text-neutral-900 mt-1">{products.length}</p>
              )}
            </div>
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Low Stock Items</p>
              {loading ? (
                <div className="h-8 w-16 bg-neutral-200 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {lowStockProducts.length}
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Out of Stock</p>
              {loading ? (
                <div className="h-8 w-16 bg-neutral-200 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {outOfStockCount}
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-between">
              <AlertTriangle className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Stock Value</p>
              {loading ? (
                <div className="h-8 w-24 bg-neutral-200 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  ₹{formattedStockValue}
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'products'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'movements'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
          >
            Stock Movements
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'alerts'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
          >
            Low Stock Alerts
          </button>
        </div>
      </div>

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.category} value={cat.category}>
                    {cat.category} ({cat.product_count})
                  </option>
                ))}
              </select>
            </div>

            <button className="btn-secondary flex items-center gap-2 justify-center">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>

          {/* Bulk Actions Toolbar */}
          {selectedProducts.size > 0 && (
            <div className="card p-4 bg-neutral-50 border-neutral-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-neutral-900">
                    {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={() => setSelectedProducts(new Set())}
                    className="text-sm text-neutral-600 hover:text-neutral-900 underline"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="btn-secondary flex items-center gap-2 text-sm"
                    disabled={bulkDeleting}
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                    disabled={bulkDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                    {bulkDeleting ? 'Deleting...' : 'Delete Selected'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="card p-6 bg-red-50 border border-red-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-medium text-red-900">Error loading products</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
                <button
                  onClick={fetchProducts}
                  className="ml-auto btn-secondary text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={products.length > 0 && selectedProducts.size === products.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Current Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Reorder Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        Unit Price
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
                    {products.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        isSelected={selectedProducts.has(product.id)}
                        onSelect={handleSelectProduct}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDeleteProduct}
                      />
                    ))}
                  </tbody>
                </table>

                {/* Empty State */}
                {!loading && products.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-neutral-900 mb-1">No products found</h3>
                    <p className="text-neutral-600">Try adjusting your search or filters</p>
                  </div>
                )}

                {/* Pagination */}
                {!loading && products.length > 0 && totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-neutral-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stock Movements Tab */}
      {activeTab === 'movements' && (
        <StockMovementsTab products={products} />
      )}

      {/* Low Stock Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-neutral-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Low Stock Alerts</h3>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
                  </div>
                ) : (
                  <>
                    <p className="text-neutral-600 mb-4">
                      {lowStockProducts.length} products need attention
                    </p>

                    {lowStockProducts.length > 0 ? (
                      <div className="space-y-3">
                        {lowStockProducts.map(product => (
                          <div key={product.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Package className="w-5 h-5 text-neutral-600" />
                              <div>
                                <p className="font-medium text-neutral-900">{product.name}</p>
                                <p className="text-sm text-neutral-600">
                                  Current: {product.stock} {product.unit || 'units'} | Reorder Level: {product.reorder_level} {product.unit || 'units'}
                                </p>
                              </div>
                            </div>
                            <button className="btn-primary text-sm">
                              Reorder
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-neutral-900 mb-1">All Good!</h3>
                        <p className="text-neutral-600">No products are running low on stock</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal - Lazy Loaded */}
      {isModalOpen && (
        <Suspense fallback={<ModalLoader />}>
          <ProductModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSuccess={handleSaveSuccess}
            product={editingProduct}
            mode={modalMode}
          />
        </Suspense>
      )}
    </div>
  );
}
