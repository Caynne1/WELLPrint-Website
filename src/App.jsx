import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { DashboardThemeProvider } from './context/DashboardThemeContext'
import { NotificationProvider } from './context/NotificationContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import ScrollToTop from './components/common/ScrollToTop'
import Layout from './components/layout/Layout'
import { Loader2 } from 'lucide-react'

// ─── Lazy-loaded pages ─────────────────────────────────────────
// Public pages
const HomePage          = lazy(() => import('./pages/HomePage'))
const ServicesPage      = lazy(() => import('./pages/ServicesPage'))
const AboutPage         = lazy(() => import('./pages/AboutPage'))
const ContactPage       = lazy(() => import('./pages/ContactPage'))
const ProductsPage      = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const CartPage          = lazy(() => import('./pages/CartPage'))
const TrackOrderPage    = lazy(() => import('./pages/TrackOrderPage'))
const LoginPage         = lazy(() => import('./pages/LoginPage'))
const PlaceholderPage   = lazy(() => import('./pages/PlaceholderPage'))
const FAQPage           = lazy(() => import('./pages/FAQPage'))
const FileSpecsPage     = lazy(() => import('./pages/FileSpecsPage'))
const PrivacyPage       = lazy(() => import('./pages/PrivacyPage'))
const TermsPage         = lazy(() => import('./pages/TermsPage'))

// Dashboard pages (heavier — kept out of public bundle)
const AdminDashboardPage  = lazy(() => import('./pages/dashboard/AdminDashboardPage'))
const StaffDashboardPage  = lazy(() => import('./pages/dashboard/StaffDashboardPage'))
const AdminOrdersPage     = lazy(() => import('./pages/dashboard/AdminOrdersPage'))
const AdminOrderDetailPage= lazy(() => import('./pages/dashboard/AdminOrderDetailPage'))
const AdminStaffPage      = lazy(() => import('./pages/dashboard/AdminStaffPage'))
const AdminProductsPage   = lazy(() => import('./pages/dashboard/AdminProductsPage'))
const AdminAnalyticsPage  = lazy(() => import('./pages/dashboard/AdminAnalyticsPage'))
const AdminCategoriesPage = lazy(() => import('./pages/dashboard/AdminCategoriesPage'))
const InboxPage           = lazy(() => import('./pages/dashboard/InboxPage'))
const AdminCustomersPage  = lazy(() => import('./pages/dashboard/AdminCustomersPage'))

// ─── Loading fallback ──────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2
          size={28}
          className="animate-spin"
          style={{ color: 'var(--wp-green)' }}
        />
        <span className="text-ivory-300/40 text-xs font-body tracking-widest uppercase">
          Loading…
        </span>
      </div>
    </div>
  )
}

// ─── Auth guards ───────────────────────────────────────────────
function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function RequirePermission({ permission, children }) {
  const { user, loading, hasPermission } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (!hasPermission(permission)) return <Navigate to="/dashboard?denied=1" replace />
  return children
}

function DashboardRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <AdminDashboardPage />
  return <StaffDashboardPage />
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

// ─── Layout wrappers ───────────────────────────────────────────
function PublicPage({ children }) {
  return (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </ErrorBoundary>
    </Layout>
  )
}

function DashboardPage({ children }) {
  return (
    <DashboardThemeProvider>
      <NotificationProvider>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>{children}</Suspense>
        </ErrorBoundary>
      </NotificationProvider>
    </DashboardThemeProvider>
  )
}

// ─── Legacy redirect helper (preserves :id param) ─────────────
function AdminOrderIdRedirect() {
  const { id } = useParams()
  return <Navigate to={`/dashboard/orders/${id}`} replace />
}

// ─── App ───────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public pages */}
      <Route path="/" element={<PublicPage><HomePage /></PublicPage>} />
      <Route path="/products" element={<PublicPage><ProductsPage /></PublicPage>} />
      <Route path="/products/:slug" element={<PublicPage><ProductDetailPage /></PublicPage>} />
      <Route path="/services" element={<PublicPage><ServicesPage /></PublicPage>} />
      <Route path="/cart" element={<PublicPage><CartPage /></PublicPage>} />
      <Route path="/track-order" element={<PublicPage><TrackOrderPage /></PublicPage>} />
      <Route path="/about" element={<PublicPage><AboutPage /></PublicPage>} />
      <Route path="/contact" element={<PublicPage><ContactPage /></PublicPage>} />

      {/* Placeholder pages */}
      <Route path="/checkout" element={<PublicPage><PlaceholderPage title="Checkout" phase="Phase 3" /></PublicPage>} />
      {/* /track → canonical /track-order */}
      <Route path="/track" element={<Navigate to="/track-order" replace />} />
      <Route path="/faq" element={<PublicPage><FAQPage /></PublicPage>} />
      <Route path="/file-specs" element={<PublicPage><FileSpecsPage /></PublicPage>} />
      <Route path="/privacy" element={<PublicPage><PrivacyPage /></PublicPage>} />
      <Route path="/terms" element={<PublicPage><TermsPage /></PublicPage>} />

      {/* Auth */}
      <Route path="/login" element={<GuestOnly><PublicPage><LoginPage /></PublicPage></GuestOnly>} />

      {/* Dashboard entry */}
      <Route path="/dashboard" element={<RequireAuth><DashboardPage><DashboardRedirect /></DashboardPage></RequireAuth>} />

      {/* Permission-gated dashboard pages */}
      <Route path="/dashboard/orders" element={<RequirePermission permission="view_orders"><DashboardPage><AdminOrdersPage /></DashboardPage></RequirePermission>} />
      <Route path="/dashboard/customers" element={<RequirePermission permission="view_orders"><DashboardPage><AdminCustomersPage /></DashboardPage></RequirePermission>} />
      <Route path="/dashboard/orders/:id" element={<RequirePermission permission="view_orders"><DashboardPage><AdminOrderDetailPage /></DashboardPage></RequirePermission>} />
      <Route path="/dashboard/products" element={<RequirePermission permission="view_products"><DashboardPage><AdminProductsPage /></DashboardPage></RequirePermission>} />
      <Route path="/dashboard/categories" element={<RequirePermission permission="manage_categories"><DashboardPage><AdminCategoriesPage /></DashboardPage></RequirePermission>} />
      <Route path="/dashboard/analytics" element={<RequirePermission permission="view_analytics"><DashboardPage><AdminAnalyticsPage /></DashboardPage></RequirePermission>} />
      <Route path="/dashboard/inbox" element={<RequireAuth><DashboardPage><InboxPage /></DashboardPage></RequireAuth>} />

      {/* Admin-only */}
      <Route path="/dashboard/staff" element={<RequireAdmin><DashboardPage><AdminStaffPage /></DashboardPage></RequireAdmin>} />

      {/* Legacy redirects */}
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />
      <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="/admin/orders" element={<Navigate to="/dashboard/orders" replace />} />
      <Route path="/admin/orders/:id" element={<AdminOrderIdRedirect />} />
      <Route path="/admin/products" element={<Navigate to="/dashboard/products" replace />} />
      <Route path="/admin/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
      <Route path="/admin/staff" element={<Navigate to="/dashboard/staff" replace />} />

      {/* 404 */}
      <Route path="*" element={<PublicPage><PlaceholderPage title="404 — Page Not Found" phase="Error" /></PublicPage>} />
    </Routes>
    </>
  )
}