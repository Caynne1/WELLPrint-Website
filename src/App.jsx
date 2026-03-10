import { Routes, Route } from 'react-router-dom'
import Layout          from './components/layout/Layout'
import HomePage        from './pages/HomePage'
import ServicesPage    from './pages/ServicesPage'
import AboutPage       from './pages/AboutPage'
import ContactPage     from './pages/ContactPage'
import ProductsPage    from './pages/ProductsPage'
import PlaceholderPage from './pages/PlaceholderPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* ── Phase 1 ── */}
        <Route path="/" element={<HomePage />} />

        {/* ── Phase 2 (Product Catalog) ── */}
        <Route
          path="/products"
          element={<ProductsPage />}
        />
        <Route
          path="/products/:slug"
          element={<PlaceholderPage title="Product Detail" phase="Phase 2" />}
        />
        <Route
          path="/services"
          element={<ServicesPage />}
        />

        {/* ── Phase 3 (Cart & Checkout) ── */}
        <Route
          path="/cart"
          element={<PlaceholderPage title="Your Cart" phase="Phase 3" />}
        />
        <Route
          path="/checkout"
          element={<PlaceholderPage title="Checkout" phase="Phase 3" />}
        />
        <Route
          path="/track"
          element={<PlaceholderPage title="Track Your Order" phase="Phase 3" />}
        />

        {/* ── Phase 4 (Admin) ── */}
        <Route
          path="/admin"
          element={<PlaceholderPage title="Admin Dashboard" phase="Phase 4" />}
        />
        <Route
          path="/admin/login"
          element={<PlaceholderPage title="Staff Login" phase="Phase 4" />}
        />

        {/* ── Misc pages ── */}
        <Route
          path="/about"
          element={<AboutPage />}
        />
        <Route
          path="/contact"
          element={<ContactPage />}
        />
        <Route
          path="/faq"
          element={<PlaceholderPage title="FAQs" phase="Phase 5" />}
        />
        <Route
          path="/file-specs"
          element={<PlaceholderPage title="File Specifications" phase="Phase 5" />}
        />
        <Route
          path="*"
          element={<PlaceholderPage title="404 — Page Not Found" phase="Error" />}
        />
      </Routes>
    </Layout>
  )
}