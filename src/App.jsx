import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout               from './components/layout/Layout'
import HomePage             from './pages/HomePage'
import ServicesPage         from './pages/ServicesPage'
import AboutPage            from './pages/AboutPage'
import ContactPage          from './pages/ContactPage'
import ProductsPage         from './pages/ProductsPage'
import ProductDetailPage    from './pages/ProductDetailPage'
import CartPage             from './pages/CartPage'
import PlaceholderPage      from './pages/PlaceholderPage'
import LoginPage            from './pages/LoginPage'
import AdminDashboardPage   from './pages/dashboard/AdminDashboardPage'
import StaffDashboardPage   from './pages/dashboard/StaffDashboardPage'
import AdminOrdersPage      from './pages/dashboard/AdminOrdersPage'
import AdminOrderDetailPage from './pages/dashboard/AdminOrderDetailPage'
import AdminStaffPage       from './pages/dashboard/AdminStaffPage'
import AdminProductsPage    from './pages/dashboard/AdminProductsPage'
import AdminAnalyticsPage   from './pages/dashboard/AdminAnalyticsPage'
import AdminCategoriesPage  from './pages/dashboard/AdminCategoriesPage'

// ─── Route guards ─────────────────────────────────────────────────────────

/** Redirect to /login when not authenticated. */
function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null                                 // wait for session restore
  if (!user)   return <Navigate to="/login" replace />
  return children
}

/** Allow only admins; redirect staff to their dashboard. */
function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  if (loading)              return null
  if (!user)                return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

/** Gate a page behind a specific permission key.
 *  Falls back to /dashboard with a query param so the page can show an alert. */
function RequirePermission({ permission, children }) {
  const { user, loading, hasPermission } = useAuth()
  if (loading)                    return null
  if (!user)                      return <Navigate to="/login" replace />
  if (!hasPermission(permission)) return <Navigate to="/dashboard?denied=1" replace />
  return children
}

/** Smart redirect: Admin → AdminDashboardPage, Staff → StaffDashboardPage */
function DashboardRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user)   return <Navigate to="/login" replace />
  if (user.role === 'admin') return <AdminDashboardPage />
  return <StaffDashboardPage />
}

/** If the user is already logged in, skip the login page. */
function GuestOnly({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user)    return <Navigate to="/dashboard" replace />
  return children
}

function PublicLayout({ children }) {
  return <Layout>{children}</Layout>
}

// ─── App ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      {/* ── Public pages ── */}
      <Route path="/"           element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/products"   element={<PublicLayout><ProductsPage /></PublicLayout>} />
      <Route path="/products/:slug" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
      <Route path="/services"   element={<PublicLayout><ServicesPage /></PublicLayout>} />
      <Route path="/cart"       element={<PublicLayout><CartPage /></PublicLayout>} />
      <Route path="/checkout"   element={<PublicLayout><PlaceholderPage title="Checkout" phase="Phase 3" /></PublicLayout>} />
      <Route path="/track"      element={<PublicLayout><PlaceholderPage title="Track Your Order" phase="Phase 3" /></PublicLayout>} />
      <Route path="/about"      element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/contact"    element={<PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/faq"        element={<PublicLayout><PlaceholderPage title="FAQs" phase="Phase 5" /></PublicLayout>} />
      <Route path="/file-specs" element={<PublicLayout><PlaceholderPage title="File Specifications" phase="Phase 5" /></PublicLayout>} />

      {/* ── Auth ── */}
      {/* Single login for both Admin and Staff */}
      <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />

      {/* Legacy /admin/login redirect — keeps old bookmarks working */}
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />
      <Route path="/admin"       element={<Navigate to="/dashboard" replace />} />

      {/* ── Dashboard (shared entry point) ── */}
      <Route path="/dashboard" element={<RequireAuth><DashboardRedirect /></RequireAuth>} />

      {/* ── Shared pages (role-checked inside component or via permission guard) ── */}
      <Route path="/dashboard/orders"
        element={<RequirePermission permission="view_orders"><AdminOrdersPage /></RequirePermission>} />
      <Route path="/dashboard/orders/:id"
        element={<RequirePermission permission="view_orders"><AdminOrderDetailPage /></RequirePermission>} />
      <Route path="/dashboard/products"
        element={<RequirePermission permission="view_products"><AdminProductsPage /></RequirePermission>} />
      <Route path="/dashboard/categories"
        element={<RequirePermission permission="manage_categories"><AdminCategoriesPage /></RequirePermission>} />
      <Route path="/dashboard/analytics"
        element={<RequirePermission permission="view_analytics"><AdminAnalyticsPage /></RequirePermission>} />

      {/* ── Admin-only pages ── */}
      <Route path="/dashboard/staff"
        element={<RequireAdmin><AdminStaffPage /></RequireAdmin>} />

      {/* ── Legacy /admin/* redirects ── */}
      <Route path="/admin/dashboard"  element={<Navigate to="/dashboard" replace />} />
      <Route path="/admin/orders"     element={<Navigate to="/dashboard/orders" replace />} />
      <Route path="/admin/orders/:id" element={<Navigate to="/dashboard/orders/:id" replace />} />
      <Route path="/admin/products"   element={<Navigate to="/dashboard/products" replace />} />
      <Route path="/admin/analytics"  element={<Navigate to="/dashboard/analytics" replace />} />
      <Route path="/admin/staff"      element={<Navigate to="/dashboard/staff" replace />} />

      {/* ── 404 ── */}
      <Route path="*" element={<PublicLayout><PlaceholderPage title="404 — Page Not Found" phase="Error" /></PublicLayout>} />
    </Routes>
  )
}