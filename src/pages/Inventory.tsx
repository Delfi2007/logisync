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
  Loader2
} from 'lucide-react';
import ModalLoader from '@/components/ModalLoader';
import ProductRow from '@/components/products/ProductRow';
import productsService, { Category, Product } from '@/services/products';
import { useDebounce } from '@/hooks/useDebounce';

// Lazy load the modal component
const ProductModal = lazy(() => import('@/components/products/ProductModal'));

type TabType = 'products' | 'movements' | 'alerts';

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
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'products'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'movements'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Stock Movements
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'alerts'
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
        <div className="card p-8 text-center">
          <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Stock Movements</h3>
          <p className="text-neutral-600">Track all stock in/out transactions with detailed history</p>
          <p className="text-sm text-neutral-500 mt-4">Coming in next iteration...</p>
        </div>
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
