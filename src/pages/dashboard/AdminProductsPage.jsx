import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  LayoutGrid,
  List,
  Loader2,
  Tag,
  Package,
  Archive,
  X,
  Save,
  RefreshCw,
  ChevronDown,
} from 'lucide-react'

function formatPeso(value) {
  return `₱${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function emptyForm() {
  return {
    id: null,
    name: '',
    description: '',
    price: '',
    unit: '',
    turnaround_time: '',
    category: '',
    image_url: '',
    is_active: true,
  }
}

function SummaryCard({ title, value, icon: Icon, color, isLight }) {
  return (
    <div
      className="rounded-[24px] border p-5"
      style={{
        background: isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)',
        borderColor: isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)',
        boxShadow: isLight
          ? '0 10px 30px rgba(15,23,42,0.05)'
          : '0 10px 30px rgba(0,0,0,0.24)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="text-xs uppercase tracking-[0.18em] mb-2"
            style={{ color: isLight ? '#94a3b8' : 'rgba(148,163,184,0.88)' }}
          >
            {title}
          </p>
          <h3
            className="text-2xl font-bold"
            style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
          >
            {value}
          </h3>
        </div>

        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: `${color}14`,
            border: `1px solid ${color}24`,
            color,
          }}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  )
}

export default function AdminProductsPage() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState('list')

  const [menuOpenId, setMenuOpenId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm())

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)

    const [{ data: productsData, error: productsError }, { data: categoriesData }] =
      await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name', { ascending: true }),
      ])

    if (productsError) {
      console.error('Failed to fetch products:', productsError)
      setProducts([])
    } else {
      setProducts(productsData || [])
    }

    setCategories(categoriesData || [])
    setLoading(false)
  }

  function openAddModal() {
    setForm(emptyForm())
    setShowModal(true)
  }

  function openEditModal(product) {
    setForm({
      id: product.id,
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      unit: product.unit || '',
      turnaround_time: product.turnaround_time || '',
      category: product.category || '',
      image_url: product.image_url || '',
      is_active: !!product.is_active,
    })
    setShowModal(true)
    setMenuOpenId(null)
  }

  function closeModal() {
    setShowModal(false)
    setForm(emptyForm())
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.name),
      description: form.description.trim() || null,
      price: Number(form.price || 0),
      unit: form.unit.trim() || null,
      turnaround_time: form.turnaround_time.trim() || null,
      category: form.category || null,
      image_url: form.image_url.trim() || null,
      is_active: !!form.is_active,
    }

    if (!payload.name) {
      setSaving(false)
      return
    }

    let error = null

    if (form.id) {
      const result = await supabase
        .from('products')
        .update(payload)
        .eq('id', form.id)

      error = result.error
    } else {
      const result = await supabase.from('products').insert([payload])
      error = result.error
    }

    if (error) {
      console.error('Save product error:', error)
      setSaving(false)
      return
    }

    closeModal()
    await fetchData()
    setSaving(false)
  }

  async function toggleProductStatus(product) {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id)

    if (error) {
      console.error('Toggle product status error:', error)
      return
    }

    setMenuOpenId(null)
    fetchData()
  }

  async function deleteProduct(productId) {
    const confirmed = window.confirm('Are you sure you want to delete this product?')
    if (!confirmed) return

    setDeletingId(productId)

    const { error } = await supabase.from('products').delete().eq('id', productId)

    if (error) {
      console.error('Delete product error:', error)
      setDeletingId(null)
      return
    }

    setMenuOpenId(null)
    setDeletingId(null)
    fetchData()
  }

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category === categoryFilter)
    }

    if (search.trim()) {
      const keyword = search.trim().toLowerCase()
      result = result.filter((p) => {
        const name = (p.name || '').toLowerCase()
        const description = (p.description || '').toLowerCase()
        const category = (p.category || '').toLowerCase()
        return (
          name.includes(keyword) ||
          description.includes(keyword) ||
          category.includes(keyword)
        )
      })
    }

    return result
  }, [products, categoryFilter, search])

  const summary = useMemo(() => {
    return {
      total: products.length,
      active: products.filter((p) => p.is_active).length,
      archived: products.filter((p) => !p.is_active).length,
    }
  }, [products])

  const sectionBg = isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)'
  const sectionBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const sectionShadow = isLight
    ? '0 10px 30px rgba(15,23,42,0.05)'
    : '0 10px 30px rgba(0,0,0,0.24)'
  const heading = isLight ? '#0f172a' : '#f8fafc'
  const subText = isLight ? '#64748b' : 'rgba(226,232,240,0.78)'
  const muted = isLight ? '#94a3b8' : 'rgba(148,163,184,0.82)'
  const softBg = isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)'
  const softBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const divider = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const listRowHover = isLight ? 'rgba(248,250,252,0.70)' : 'rgba(255,255,255,0.03)'

  return (
    <AdminLayout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(19,161,80,0.10)',
                border: '1px solid rgba(19,161,80,0.20)',
              }}
            >
              <Package size={15} style={{ color: '#13A150' }} />
            </div>
            <span
              className="text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: muted }}
            >
              Product Management
            </span>
          </div>

          <h1
            className="text-[2rem] font-bold mb-1 leading-none"
            style={{ color: heading }}
          >
            Products
          </h1>
          <p className="text-sm" style={{ color: subText }}>
            {products.length} total · {summary.active} active
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-[16px] text-sm font-semibold transition-all hover:scale-[1.01]"
          style={{
            background: 'rgba(19,161,80,0.10)',
            border: '1px solid rgba(19,161,80,0.20)',
            color: '#13A150',
          }}
        >
          <Plus size={14} />
          Add Product
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-7">
        <SummaryCard title="Total Products" value={summary.total} icon={Package} color="#1993D2" isLight={isLight} />
        <SummaryCard title="Active" value={summary.active} icon={Eye} color="#13A150" isLight={isLight} />
        <SummaryCard title="Archived" value={summary.archived} icon={Archive} color="#94a3b8" isLight={isLight} />
      </div>

      <div
        className="rounded-[24px] border p-5 mb-7"
        style={{
          background: sectionBg,
          borderColor: sectionBorder,
          boxShadow: sectionShadow,
        }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-3 flex-wrap">
            <div className="relative min-w-[280px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: muted }}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-[16px] border pl-9 pr-4 py-3 text-sm outline-none"
                style={{
                  background: softBg,
                  borderColor: softBorder,
                  color: heading,
                }}
              />
            </div>

            <div className="relative min-w-[230px]">
              <Tag
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: '#13A150' }}
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none rounded-[16px] border pl-9 pr-10 py-3 text-sm outline-none w-full"
                style={{
                  background: softBg,
                  borderColor: softBorder,
                  color: heading,
                }}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: muted }}
              />
            </div>
          </div>

          <div
            className="rounded-[16px] border flex overflow-hidden"
            style={{
              background: softBg,
              borderColor: softBorder,
            }}
          >
            <button
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all"
              style={{
                background: viewMode === 'list' ? 'rgba(19,161,80,0.10)' : 'transparent',
                color: viewMode === 'list' ? '#13A150' : subText,
              }}
            >
              <List size={14} />
              List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all"
              style={{
                background: viewMode === 'grid' ? 'rgba(19,161,80,0.10)' : 'transparent',
                color: viewMode === 'grid' ? '#13A150' : subText,
              }}
            >
              <LayoutGrid size={14} />
              Grid
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className="rounded-[24px] border py-20 text-center"
          style={{
            background: sectionBg,
            borderColor: sectionBorder,
            boxShadow: sectionShadow,
          }}
        >
          <div className="inline-flex items-center gap-2" style={{ color: subText }}>
            <Loader2 size={16} className="animate-spin" />
            Loading products...
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div
          className="rounded-[24px] border py-20 text-center"
          style={{
            background: sectionBg,
            borderColor: sectionBorder,
            boxShadow: sectionShadow,
          }}
        >
          <Package size={30} className="mx-auto mb-3" style={{ color: muted }} />
          <p className="text-sm" style={{ color: subText }}>No products found.</p>
        </div>
      ) : viewMode === 'list' ? (
        <div
          className="rounded-[24px] border overflow-hidden"
          style={{
            background: sectionBg,
            borderColor: sectionBorder,
            boxShadow: sectionShadow,
          }}
        >
          <div className="px-6 py-5 border-b" style={{ borderColor: divider }}>
            <p className="text-sm font-semibold" style={{ color: heading }}>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[72px_1fr_auto_auto] gap-4 items-center px-6 py-5 relative"
                style={{ borderTop: `1px solid ${divider}` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = listRowHover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <div
                  className="w-[72px] h-[72px] rounded-[18px] overflow-hidden border flex items-center justify-center"
                  style={{
                    borderColor: softBorder,
                    background: softBg,
                  }}
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package size={20} style={{ color: muted }} />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xl font-semibold truncate" style={{ color: heading }}>
                      {product.name}
                    </p>

                    {product.category && (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px]"
                        style={{
                          background: 'rgba(25,147,210,0.08)',
                          color: '#1993D2',
                          border: '1px solid rgba(25,147,210,0.14)',
                        }}
                      >
                        {product.category}
                      </span>
                    )}
                  </div>

                  <p className="text-sm mt-1 truncate" style={{ color: muted }}>
                    {product.description || 'No description'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: heading }}>
                    {formatPeso(product.price)}
                  </p>
                  <p className="text-sm" style={{ color: muted }}>
                    /{product.unit || 'unit'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: muted }}>
                    {product.turnaround_time || '—'}
                  </p>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpenId((prev) => (prev === product.id ? null : product.id))
                    }
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background: softBg,
                      border: `1px solid ${softBorder}`,
                      color: subText,
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>

                  {menuOpenId === product.id && (
                    <div
                      className="absolute right-0 top-12 w-48 rounded-[18px] border p-2 z-20"
                      style={{
                        background: isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.98)',
                        borderColor: sectionBorder,
                        boxShadow: isLight
                          ? '0 20px 50px rgba(15,23,42,0.10)'
                          : '0 20px 50px rgba(0,0,0,0.35)',
                      }}
                    >
                      <button
                        onClick={() => openEditModal(product)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[12px] text-sm transition-all"
                        style={{ color: heading }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = softBg
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => toggleProductStatus(product)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[12px] text-sm transition-all"
                        style={{ color: heading }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = softBg
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        {product.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                        {product.is_active ? 'Archive' : 'Activate'}
                      </button>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        disabled={deletingId === product.id}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[12px] text-sm transition-all"
                        style={{ color: '#dc2626' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(220,38,38,0.08)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        {deletingId === product.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-[24px] border overflow-hidden"
              style={{
                background: sectionBg,
                borderColor: sectionBorder,
                boxShadow: sectionShadow,
              }}
            >
              <div
                className="h-48 border-b flex items-center justify-center overflow-hidden"
                style={{
                  background: softBg,
                  borderColor: divider,
                }}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={28} style={{ color: muted }} />
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold truncate" style={{ color: heading }}>
                      {product.name}
                    </h3>
                    <p className="text-sm mt-1 line-clamp-2" style={{ color: muted }}>
                      {product.description || 'No description'}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setMenuOpenId((prev) => (prev === product.id ? null : product.id))
                    }
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: softBg,
                      border: `1px solid ${softBorder}`,
                      color: subText,
                    }}
                  >
                    <MoreVertical size={15} />
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap mt-4">
                  {product.category && (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px]"
                      style={{
                        background: 'rgba(25,147,210,0.08)',
                        color: '#1993D2',
                        border: '1px solid rgba(25,147,210,0.14)',
                      }}
                    >
                      {product.category}
                    </span>
                  )}

                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px]"
                    style={{
                      background: product.is_active
                        ? 'rgba(19,161,80,0.08)'
                        : 'rgba(100,116,139,0.10)',
                      color: product.is_active ? '#13A150' : '#64748b',
                      border: product.is_active
                        ? '1px solid rgba(19,161,80,0.14)'
                        : '1px solid rgba(100,116,139,0.14)',
                    }}
                  >
                    {product.is_active ? 'Active' : 'Archived'}
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-black" style={{ color: heading }}>
                      {formatPeso(product.price)}
                    </p>
                    <p className="text-sm" style={{ color: muted }}>
                      /{product.unit || 'unit'}
                    </p>
                  </div>

                  <p className="text-xs" style={{ color: muted }}>
                    {product.turnaround_time || '—'}
                  </p>
                </div>

                {menuOpenId === product.id && (
                  <div
                    className="mt-4 rounded-[18px] border p-2"
                    style={{
                      background: softBg,
                      borderColor: softBorder,
                    }}
                  >
                    <button
                      onClick={() => openEditModal(product)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[12px] text-sm transition-all"
                      style={{ color: heading }}
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => toggleProductStatus(product)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[12px] text-sm transition-all"
                      style={{ color: heading }}
                    >
                      {product.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                      {product.is_active ? 'Archive' : 'Activate'}
                    </button>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      disabled={deletingId === product.id}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[12px] text-sm transition-all"
                      style={{ color: '#dc2626' }}
                    >
                      {deletingId === product.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            className="w-full max-w-2xl rounded-[28px] border p-6"
            style={{
              background: isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.98)',
              borderColor: sectionBorder,
              boxShadow: isLight
                ? '0 25px 80px rgba(15,23,42,0.18)'
                : '0 25px 80px rgba(0,0,0,0.45)',
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: heading }}>
                  {form.id ? 'Edit Product' : 'Add Product'}
                </h2>
                <p className="text-sm mt-1" style={{ color: subText }}>
                  Fill in the product details below.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: softBg,
                  border: `1px solid ${softBorder}`,
                  color: subText,
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-2" style={{ color: muted }}>
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-[16px] border px-4 py-3 text-sm outline-none"
                    style={{
                      background: softBg,
                      borderColor: softBorder,
                      color: heading,
                    }}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-2" style={{ color: muted }}>
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-[16px] border px-4 py-3 text-sm outline-none resize-none"
                    style={{
                      background: softBg,
                      borderColor: softBorder,
                      color: heading,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: muted }}>
                    Price
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                    className="w-full rounded-[16px] border px-4 py-3 text-sm outline-none"
                    style={{
                      background: softBg,
                      borderColor: softBorder,
                      color: heading,
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: muted }}>
                    Unit
                  </label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
                    placeholder="e.g. pcs, sheets, sets"
                    className="w-full rounded-[16px] border px-4 py-3 text-sm outline-none"
                    style={{
                      background: softBg,
                      borderColor: softBorder,
                      color: heading,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: muted }}>
                    Turnaround Time
                  </label>
                  <input
                    type="text"
                    value={form.turnaround_time}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, turnaround_time: e.target.value }))
                    }
                    placeholder="e.g. 2d turnaround"
                    className="w-full rounded-[16px] border px-4 py-3 text-sm outline-none"
                    style={{
                      background: softBg,
                      borderColor: softBorder,
                      color: heading,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: muted }}>
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-[16px] border px-4 py-3 text-sm outline-none"
                    style={{
                      background: softBg,
                      borderColor: softBorder,
                      color: heading,
                    }}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id || cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-2" style={{ color: muted }}>
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
                    className="w-full rounded-[16px] border px-4 py-3 text-sm outline-none"
                    style={{
                      background: softBg,
                      borderColor: softBorder,
                      color: heading,
                    }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="inline-flex items-center gap-2 text-sm" style={{ color: heading }}>
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                    />
                    Active Product
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-3 rounded-[16px] text-sm font-semibold"
                  style={{
                    background: softBg,
                    border: `1px solid ${softBorder}`,
                    color: subText,
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-[16px] text-sm font-semibold transition-all"
                  style={{
                    background: 'rgba(19,161,80,0.10)',
                    border: '1px solid rgba(19,161,80,0.20)',
                    color: '#13A150',
                  }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}