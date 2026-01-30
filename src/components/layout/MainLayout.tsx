import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Store, 
  Brain, 
  Users, 
  Warehouse,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  User,
  LogOut,
  Sparkles,
  Link as LinkIcon,
  Leaf
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
  { name: 'Analytics', href: '/analytics', icon: Brain },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Warehouses', href: '/warehouses', icon: Warehouse },
  { name: 'AI & ML', href: '/ai/demand-forecasting', icon: Sparkles, badge: '7', badgeColor: 'bg-purple-600' },
  { name: 'Blockchain', href: '/blockchain/tracking', icon: LinkIcon, badge: '2', badgeColor: 'bg-violet-600' },
  { name: 'Sustainability', href: '/sustainability/carbon-footprint', icon: Leaf, badge: '3', badgeColor: 'bg-green-600' },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function MainLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-neutral-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LS</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">LogiSync</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                    ${active
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <Icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        active ? 'text-white' : 'text-neutral-500'
                      }`}
                    />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.badgeColor} text-white`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="flex-shrink-0 flex border-t border-neutral-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-neutral-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-neutral-900">{user?.full_name || 'User'}</p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out lg:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LS</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">LogiSync</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                    ${active
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <Icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        active ? 'text-white' : 'text-neutral-500'
                      }`}
                    />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.badgeColor} text-white`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="flex-shrink-0 flex border-t border-neutral-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-neutral-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-neutral-900">{user?.full_name || 'User'}</p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-neutral-100"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Search bar */}
              <div className="flex-1 max-w-2xl mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search orders, products, customers..."
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-neutral-50"
                  />
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-neutral-100">
                  <Bell className="w-5 h-5 text-neutral-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-neutral-900 rounded-full"></span>
                </button>

                {/* User menu - desktop only */}
                <div className="hidden lg:flex items-center space-x-3 pl-3 border-l border-neutral-200">
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900">{user?.full_name || 'User'}</p>
                    <p className="text-xs text-neutral-500">{user?.email}</p>
                  </div>
                  <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-neutral-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-neutral-200 mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-neutral-600">
              <p>© 2024 LogiSync. All rights reserved.</p>
              <p className="mt-2 sm:mt-0">Data stored in India 🇮🇳</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
