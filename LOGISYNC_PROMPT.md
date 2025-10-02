You are an expert full-stack developer building LogiSync, a revolutionary SaaS platform that serves as the unified operating system for Indian logistics and supply chain management. This is a comprehensive project prompt - refer back to it throughout development.

## PROJECT OVERVIEW

LogiSync is a modular, cloud-native platform designed to transform India's fragmented $250B+ logistics industry. It empowers MSMEs, D2C brands, and agricultural businesses with enterprise-grade logistics capabilities through three integrated modules:

1. **LogiSphere (Marketplace)** - On-demand warehousing and freight aggregation
2. **LogiCore (Business OS)** - Inventory and order management system
3. **LogiMind (AI Engine)** - Predictive analytics and optimization

## TARGET USERS
- Micro, Small, and Medium Enterprises (MSMEs)
- Direct-to-Consumer (D2C) brands
- Agricultural businesses and Farmer Producer Organizations
- 3PL providers and logistics companies

## CORE TECHNICAL REQUIREMENTS

### Technology Stack
**Frontend:**
- React 18+ with TypeScript for type safety
- Tailwind CSS for responsive, modern UI
- Recharts/D3.js for data visualizations
- Lucide React for consistent iconography
- React Router for navigation

**State Management:**
- React Context API + useReducer for global state
- React Query for server state management
- localStorage for user preferences (non-critical data only)

**Backend Architecture (for future API development):**
- Node.js with Express or Next.js API routes
- PostgreSQL for relational data (orders, inventory, users)
- MongoDB for logs and unstructured data
- Redis for caching and real-time features

**AI/ML Stack (for LogiMind module):**
- TensorFlow.js for client-side predictions
- Python microservices (FastAPI) for heavy ML workloads
- scikit-learn for demand forecasting models
- OpenRouteService/Mapbox for route optimization

**Cloud & DevOps:**
- AWS (EC2, S3, Lambda, RDS) or Google Cloud Platform
- Docker for containerization
- GitHub Actions for CI/CD
- Vercel/Netlify for frontend hosting

### Architecture Principles
1. **Modular Design**: Each module (LogiSphere, LogiCore, LogiMind) should be independently scalable
2. **API-First**: RESTful APIs with clear documentation for third-party integrations
3. **Mobile-Responsive**: 60% of MSME owners will access via mobile
4. **Offline Capability**: Critical features should work with intermittent connectivity
5. **Security-First**: JWT authentication, role-based access control (RBAC), data encryption

## MVP FEATURE SPECIFICATIONS

### Phase 1: LogiCore (Business OS) - BUILD THIS FIRST
This is the foundation module. Focus on these features:

#### 1.1 Dashboard (Home Screen)
- **Key Metrics Cards**: Total orders (today, this week, this month), pending shipments, low stock alerts, revenue overview
- **Interactive Charts**: Order trends (line chart), top-selling products (bar chart), delivery status breakdown (pie chart)
- **Quick Actions**: Create order, add inventory, find warehouse, book shipment
- **Recent Activity Feed**: Last 10 transactions with timestamps
- **Design**: Clean, card-based layout with color-coded status indicators (green=delivered, yellow=in-transit, red=delayed)

#### 1.2 Inventory Management System
**Inventory List View:**
- Searchable/filterable table with columns: Product Name, SKU, Category, Current Stock, Location(s), Reorder Level, Status
- Bulk actions: Import CSV, export data, bulk update
- Color-coded stock levels: Red (<reorder level), Yellow (low), Green (optimal)

**Add/Edit Product Form:**
- Fields: Product name, SKU (auto-generated option), category dropdown, description, unit price, cost price, current stock, reorder level, supplier info, storage requirements (temperature, humidity)
- Multi-location stock allocation
- Image upload capability (future: integrate with S3)
- Variant support (size, color, etc.)

**Stock Movements Tracker:**
- Log all stock in/out transactions with timestamp, user, reason (sale, return, damage, transfer)
- Generate stock reports (daily, weekly, monthly)

**Alerts System:**
- Real-time notifications for low stock, out-of-stock items
- Predicted stockout dates based on sales velocity

#### 1.3 Order Management System
**Order Creation Flow:**
- Customer selection (searchable dropdown or create new)
- Product addition with quantity selector (validates against available stock)
- Auto-calculated totals with tax options (GST 5%, 12%, 18%)
- Shipping address with pin code validation
- Delivery preference: Standard, Express, Scheduled
- Payment status: Pending, Partial, Paid
- Order notes section

**Order List/Kanban View:**
- Toggle between table and kanban board (columns: New → Processing → Packed → Shipped → Delivered)
- Filters: Date range, status, customer, payment status, delivery type
- Bulk actions: Print invoices, export, bulk status update
- Order details modal with complete history timeline

**Order Tracking:**
- Visual timeline showing order journey (Placed → Confirmed → Packed → Dispatched → Out for Delivery → Delivered)
- Real-time status updates (simulate with mock data initially)
- Estimated delivery date calculator
- Customer-facing tracking page (unique URL)

**Invoice Generation:**
- PDF generation with company details, itemized list, tax breakdown, payment terms
- Email invoice functionality
- GST-compliant format

#### 1.4 Customer Management (CRM Lite)
- Customer directory with search/filter
- Customer profile: Name, business name, email, phone, billing/shipping addresses, GST number
- Order history per customer
- Customer lifetime value calculation
- Segment tags: Premium, Regular, New (auto-categorized by order value/frequency)

#### 1.5 Warehouse Location Manager
- Add warehouse/storage locations with address, capacity, operational hours
- Assign inventory to specific locations
- Location-wise stock view
- Distance calculator to customer pin codes (for LogiSphere integration)

### Phase 2: LogiSphere (Marketplace)
Build after LogiCore is stable:

#### 2.1 Warehouse Marketplace
**Search Interface:**
- Location-based search (city/pin code with map view)
- Filters: Size (sqft), price range, amenities (climate control, security, loading dock), availability
- List + Map toggle view (use Leaflet or Mapbox)
- Warehouse cards showing: Name, location, price/sqft/month, rating, available space, photos

**Warehouse Detail Page:**
- Photo gallery, detailed description, amenities list, pricing tiers
- Availability calendar
- Owner contact info (masked until booking)
- Reviews/ratings section
- "Request Quote" or "Instant Book" CTAs

**Booking Flow:**
- Space requirement input (sqft needed, duration)
- Date selection (start/end dates)
- Price calculation with breakdown (base price + GST + platform fee)
- Agreement upload/digital signature
- Payment integration (Razorpay/Stripe for India)

#### 2.2 Freight Aggregation
**Shipment Booking Interface:**
- Origin/destination pin codes with auto-complete
- Package details: Weight, dimensions, quantity, cargo type (general, fragile, perishable)
- Pickup/delivery date-time selection
- Special requirements (tail lift, temperature control)

**Carrier Comparison:**
- Display 5-10 carrier options with: Name, price, estimated delivery time, rating, vehicle type
- "Best Value" and "Fastest" badges
- Filter by: Price range, delivery time, vehicle type, carrier rating

**Booking Confirmation:**
- Selected carrier details, pickup scheduling, tracking number generation
- Driver details (name, phone, vehicle number) - assigned post-booking
- Real-time tracking link (integrate with mock GPS data initially)

**Carrier Onboarding (Supply-Side):**
- Carrier registration form: Business name, vehicle details, insurance, licenses
- Service area mapping (pin codes covered)
- Rate card setup (per km, per kg pricing)
- Verification status tracker

### Phase 3: LogiMind (AI Intelligence)
Build after marketplace has initial traction:

#### 3.1 Demand Forecasting Dashboard
- Historical sales chart (12-month view)
- ML-powered forecast for next 30/60/90 days (use simple time series models initially - exponential smoothing)
- Product-wise demand predictions with confidence intervals
- Seasonality indicators (festival season highlights for India - Diwali, Holi, etc.)
- Recommended stock levels based on forecast
- What-if scenario simulator (e.g., "What if sales increase 20%?")

#### 3.2 Route Optimization Tool
**Input Interface:**
- Multiple delivery addresses upload (CSV or manual entry)
- Vehicle capacity constraints (weight, volume)
- Time windows (customer availability)
- Starting point (warehouse location)

**Optimization Output:**
- Optimized route map with stop sequence
- Total distance/time saved vs. manual routing
- Fuel cost estimates
- Turn-by-turn directions for driver
- Export route to driver app

**Algorithm:**
- Start with greedy nearest-neighbor
- Later: Implement genetic algorithm or use OR-Tools library

#### 3.3 AgriTech Module
**Crop Management:**
- Crop type selection, planting date, location
- Weather data integration (OpenWeatherMap API)
- Harvest readiness predictor based on crop cycle + weather
- Spoilage risk alerts (temperature, humidity thresholds)

**Cold Chain Monitor:**
- IoT sensor data visualization (temperature, humidity over time)
- Alert system for threshold breaches
- Compliance reports for food safety norms

**Market Insights:**
- Mandi prices near farmer location (scrape government websites or use Agmarknet API)
- Best time to sell recommendations
- Demand hotspots for their crop

## UI/UX DESIGN GUIDELINES

### Design System
**Color Palette:**
- Primary: #2563EB (Blue - trust, technology)
- Secondary: #10B981 (Green - growth, sustainability)
- Accent: #F59E0B (Amber - energy, logistics)
- Neutral: #F3F4F6 (Light gray), #1F2937 (Dark gray)
- Status Colors: Red (#EF4444), Yellow (#FBBF24), Green (#10B981)

**Typography:**
- Headings: Inter or Poppins (bold, 600-700 weight)
- Body: Inter or System UI (regular, 400 weight)
- Monospace: JetBrains Mono (for SKUs, tracking numbers)

**Component Library:**
- Use shadcn/ui components (already specified in your stack)
- Buttons: Primary (solid), Secondary (outline), Ghost, Destructive
- Inputs: Floating labels, error states, helper text
- Cards: Subtle shadow, hover effect, clear hierarchy
- Modals: Center-aligned, max-width 600px, backdrop blur
- Tables: Sticky headers, row hover, sortable columns, pagination

**Responsive Breakpoints:**
- Mobile: 320px - 640px (single column, bottom navigation)
- Tablet: 641px - 1024px (2-column grid, collapsible sidebar)
- Desktop: 1025px+ (3-column grid, persistent sidebar)

### Navigation Structure
**Main Sidebar (Desktop) / Bottom Nav (Mobile):**
1. Dashboard (home icon)
2. Inventory (package icon)
3. Orders (shopping cart icon)
4. Marketplace (store icon)
5. Analytics/LogiMind (brain/chart icon)
6. Customers (users icon)
7. Settings (gear icon)

**Top Bar:**
- LogiSync logo (left)
- Search bar (center) - global search across orders, products, customers
- Notifications bell (right)
- User profile dropdown (right)

### Key User Flows to Optimize
1. **New Order in 3 Clicks**: Dashboard → Add Order → Select Customer → Add Products → Submit
2. **Stock Alert Resolution**: Notification → View Product → Reorder from Supplier/Transfer from Another Warehouse
3. **Find Warehouse in 2 Minutes**: Marketplace → Search Location → Compare 3 Options → Book
4. **Track Shipment Instantly**: Orders → Click Tracking → See Live Map

## DATA MODELS (for mock data initially)

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff';
  businessName: string;
  gstNumber?: string;
  subscriptionTier: 'starter' | 'growth' | 'enterprise';
  createdAt: Date;
}
```

### Product
```typescript
interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  currentStock: number;
  reorderLevel: number;
  unit: 'pieces' | 'kg' | 'liters';
  locations: Array<{
    warehouseId: string;
    quantity: number;
  }>;
  supplier?: {
    name: string;
    contact: string;
  };
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order
```typescript
interface Order {
  id: string;
  orderNumber: string; // AUTO-ORD-001
  customerId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number; // GST
  shippingCost: number;
  total: number;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'partial';
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryType: 'standard' | 'express' | 'scheduled';
  estimatedDelivery: Date;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Customer
```typescript
interface Customer {
  id: string;
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  gstNumber?: string;
  billingAddress: Address;
  shippingAddresses: Address[];
  totalOrders: number;
  lifetimeValue: number;
  segment: 'new' | 'regular' | 'premium';
  createdAt: Date;
}
```

### Warehouse (for marketplace)
```typescript
interface Warehouse {
  id: string;
  name: string;
  ownerId: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: { lat: number; lng: number };
  };
  totalArea: number; // sqft
  availableArea: number;
  pricePerSqft: number; // monthly
  amenities: string[]; // ['climate-control', 'security', 'loading-dock']
  operationalHours: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  createdAt: Date;
}
```

### Shipment (for freight)
```typescript
interface Shipment {
  id: string;
  orderId?: string; // optional link to order
  trackingNumber: string;
  origin: { address: string; pincode: string };
  destination: { address: string; pincode: string };
  package: {
    weight: number; // kg
    dimensions: { length: number; width: number; height: number }; // cm
    cargoType: string;
  };
  carrierId: string;
  carrierName: string;
  price: number;
  status: 'booked' | 'picked-up' | 'in-transit' | 'out-for-delivery' | 'delivered';
  estimatedDelivery: Date;
  actualDelivery?: Date;
  driverDetails?: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  trackingHistory: Array<{
    status: string;
    location: string;
    timestamp: Date;
  }>;
  createdAt: Date;
}
```
## DEVELOPMENT WORKFLOW
- Step 1: Project Setup
- Step 2: Folder Structure
- Step 3: Mock Data Strategy
- Step 4: Authentication Flow (Simplified MVP)
- Step 5: Build Order

## INDIAN MARKET CONSIDERATIONS

### Localization:

- Currency: ₹ (INR) everywhere, use commas for lakhs/crores (₹100,000 not ₹100,000)
- Date format: DD/MM/YYYY
- GST tax tiers: 5%, 12%, 18%, 28% (selector in order form)
- Indian holidays awareness: Diwali, Holi, Eid should trigger high demand notifications
- Language: English (primary), Hindi support (future)
- Pin Code Validation: 6-digit numeric
- API: India Post API or Google Maps Geocoding for city/state lookup
- Payment Integration: Razorpay (preferred for India) Support UPI, cards, net banking, wallets

### Compliance:

- GST invoice format compliance
- Data residency: Mention "Data stored in India" in footer
- FSSAI number field for food products

## DEVELOPMENT BEST PRACTICES

- TypeScript Strict Mode: Enable strict checks, no any types
- Component Composition: Prefer small, reusable components
- Custom Hooks: Extract logic (useFetch, useLocalStorage, useDebounce)
- Error Boundaries: Wrap route components to catch errors
- Accessibility: Semantic HTML, ARIA labels, keyboard navigation
- Performance: Lazy load routes: const Orders = lazy(() => import('./pages/Orders')), Memoize expensive calculations: useMemo, useCallback, Virtual scrolling for large lists (react-window)
- Testing: Jest + React Testing Library (write tests for critical flows)
- Code Quality: ESLint + Prettier, pre-commit hooks with Husky

## FUTURE SCALABILITY CONSIDERATIONS
**While building MVP, architect with these in mind:**
- Multi-tenancy: Each business is a separate tenant (database per tenant or shared schema with tenant_id)
- Microservices: LogiCore, LogiSphere, LogiMind can eventually be separate services
- Real-time: Use WebSockets for live tracking, notifications (Socket.io)
- API Gateway: For third-party integrations (Shopify, Amazon)
- Rate Limiting: Prevent abuse on public APIs
- Audit Logs: Track all data changes (who, what, when)
