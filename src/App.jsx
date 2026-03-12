import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout           from './components/layout/Layout'
import HomePage         from './pages/HomePage'
import ServicesPage     from './pages/ServicesPage'
import AboutPage        from './pages/AboutPage'
import ContactPage      from './pages/ContactPage'
import ProductsPage     from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage         from './pages/CartPage'
import PlaceholderPage  from './pages/PlaceholderPage'
import AdminLoginPage       from './pages/admin/AdminLoginPage'
import AdminDashboardPage   from './pages/admin/AdminDashboardPage'
import AdminOrdersPage      from './pages/admin/AdminOrdersPage'
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage'

function RequireAuth({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}

function PublicLayout({ children }) {
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <Routes>
      {/* Public pages wrapped in site Layout */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
      <Route path="/products/:slug" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
      <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
      <Route path="/checkout" element={<PublicLayout><PlaceholderPage title="Checkout" phase="Phase 3" /></PublicLayout>} />
      <Route path="/track" element={<PublicLayout><PlaceholderPage title="Track Your Order" phase="Phase 3" /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><PlaceholderPage title="FAQs" phase="Phase 5" /></PublicLayout>} />
      <Route path="/file-specs" element={<PublicLayout><PlaceholderPage title="File Specifications" phase="Phase 5" /></PublicLayout>} />

      {/* Admin — no site layout, own full-screen layout */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<RequireAuth><AdminDashboardPage /></RequireAuth>} />
      <Route path="/admin/orders" element={<RequireAuth><AdminOrdersPage /></RequireAuth>} />
      <Route path="/admin/orders/:id" element={<RequireAuth><AdminOrderDetailPage /></RequireAuth>} />

      {/* 404 */}
      <Route path="*" element={<PublicLayout><PlaceholderPage title="404 — Page Not Found" phase="Error" /></PublicLayout>} />
    </Routes>
  )
}
