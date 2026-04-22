import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../context/ThemeContext'
import {
  Tag,
  Plus,
  Search,
  RefreshCw,
  Loader2,
  Pencil,
  Trash2,
  X,
  Save,
  FolderTree,
  CheckCircle2,
} from 'lucide-react'

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

export default function AdminCategoriesPage() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm())

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)

    const [{ data: categoriesData, error: categoriesError }, { data: productsData }] =
      await Promise.all([
        supabase.from('categories').select('*').order('name', { ascending: true }),
        supabase.from('products').select('id, category'),
      ])

    if (categoriesError) {
      console.error('Failed to fetch categories:', categoriesError)
      setCategories([])
    } else {
      setCategories(categoriesData || [])
    }

    setProducts(productsData || [])
    setLoading(false)
  }

  function openAddModal() {
    setForm(emptyForm())
    setShowModal(true)
  }

  function openEditModal(category) {
    setForm({
      id: category.id,
      name: category.name || '',
      description: category.description || '',
      is_active: category.is_active !== false,
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setForm(emptyForm())
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) return

    setSaving(true)

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.name),
      description: form.description.trim() || null,
      is_active: !!form.is_active,
    }

    let error = null

    if (form.id) {
      const result = await supabase
        .from('categories')
        .update(payload)
        .eq('id', form.id)

      error = result.error
    } else {
      const result = await supabase.from('categories').insert([payload])
      error = result.error
    }

    if (error) {
      console.error('Save category error:', error)
      setSaving(false)
      return
    }

    closeModal()
    await fetchData()
    setSaving(false)
  }

  async function deleteCategory(categoryId, categoryName) {
    const productCount = products.filter((p) => p.category === categoryName).length
    if (productCount > 0) {
      alert('This category is currently used by one or more products and cannot be deleted yet.')
      return
    }

    const confirmed = window.confirm('Are you sure you want to delete this category?')
    if (!confirmed) return

    setDeletingId(categoryId)

    const { error } = await supabase.from('categories').delete().eq('id', categoryId)

    if (error) {
      console.error('Delete category error:', error)
      setDeletingId(null)
      return
    }

    setDeletingId(null)
    fetchData()
  }

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return categories

    return categories.filter((category) => {
      const name = (category.name || '').toLowerCase()
      const description = (category.description || '').toLowerCase()
      return name.includes(keyword) || description.includes(keyword)
    })
  }, [categories, search])

  const summary = useMemo(() => {
    return {
      total: categories.length,
      active: categories.filter((c) => c.is_active !== false).length,
      used: categories.filter((c) => products.some((p) => p.category === c.name)).length,
    }
  }, [categories, products])

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

  return (
    <AdminLayout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(25,147,210,0.10)',
                border: '1px solid rgba(25,147,210,0.20)',
              }}
            >
              <Tag size={15} style={{ color: '#1993D2' }} />
            </div>
            <span
              className="text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: muted }}
            >
              Category Management
            </span>
          </div>

          <h1
            className="text-[2rem] font-bold mb-1 leading-none"
            style={{ color: heading }}
          >
            Categories
          </h1>
          <p className="text-sm" style={{ color: subText }}>
            Organize your products using categories
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-[16px] text-sm font-semibold transition-all hover:scale-[1.01]"
            style={{
              background: sectionBg,
              border: `1px solid ${sectionBorder}`,
              color: subText,
              boxShadow: sectionShadow,
            }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>

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
            Add Category
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-7">
        <SummaryCard title="Total Categories" value={summary.total} icon={Tag} color="#1993D2" isLight={isLight} />
        <SummaryCard title="Active" value={summary.active} icon={CheckCircle2} color="#13A150" isLight={isLight} />
        <SummaryCard title="Used by Products" value={summary.used} icon={FolderTree} color="#8b5cf6" isLight={isLight} />
      </div>

      <div
        className="rounded-[24px] border p-5 mb-7"
        style={{
          background: sectionBg,
          borderColor: sectionBorder,
          boxShadow: sectionShadow,
        }}
      >
        <div className="relative max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: muted }}
          />
          <input
            type="text"
            placeholder="Search categories..."
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
            Loading categories...
          </div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div
          className="rounded-[24px] border py-20 text-center"
          style={{
            background: sectionBg,
            borderColor: sectionBorder,
            boxShadow: sectionShadow,
          }}
        >
          <Tag size={30} className="mx-auto mb-3" style={{ color: muted }} />
          <p className="text-sm" style={{ color: subText }}>No categories found.</p>
        </div>
      ) : (
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
              {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)' }}>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: muted }}>
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: muted }}>
                    Description
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: muted }}>
                    Products Using It
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: muted }}>
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: muted }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category) => {
                  const usedCount = products.filter((p) => p.category === category.name).length
                  const isActive = category.is_active !== false

                  return (
                    <tr
                      key={category.id}
                      style={{ borderTop: `1px solid ${divider}` }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isLight
                          ? 'rgba(248,250,252,0.70)'
                          : 'rgba(255,255,255,0.03)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                            style={{
                              background: 'rgba(25,147,210,0.10)',
                              border: '1px solid rgba(25,147,210,0.18)',
                            }}
                          >
                            <Tag size={16} style={{ color: '#1993D2' }} />
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: heading }}>
                              {category.name}
                            </p>
                            <p className="text-xs mt-1" style={{ color: muted }}>
                              {category.slug || slugify(category.name)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <p className="text-sm" style={{ color: subText }}>
                          {category.description || 'No description'}
                        </p>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
                          style={{
                            background: 'rgba(139,92,246,0.10)',
                            borderColor: 'rgba(139,92,246,0.20)',
                            color: '#8b5cf6',
                          }}
                        >
                          <FolderTree size={12} />
                          {usedCount} product{usedCount !== 1 ? 's' : ''}
                        </span>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
                          style={{
                            background: isActive
                              ? 'rgba(19,161,80,0.10)'
                              : 'rgba(100,116,139,0.10)',
                            borderColor: isActive
                              ? 'rgba(19,161,80,0.20)'
                              : 'rgba(100,116,139,0.20)',
                            color: isActive ? '#13A150' : '#64748b',
                          }}
                        >
                          {isActive ? <CheckCircle2 size={12} /> : <X size={12} />}
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="px-6 py-5 align-top text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(category)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border transition-all"
                            style={{
                              background: isLight
                                ? 'rgba(25,147,210,0.08)'
                                : 'rgba(25,147,210,0.14)',
                              color: '#1993D2',
                              borderColor: 'rgba(25,147,210,0.16)',
                            }}
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            onClick={() => deleteCategory(category.id, category.name)}
                            disabled={deletingId === category.id}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border transition-all"
                            style={{
                              background: 'rgba(220,38,38,0.10)',
                              color: '#dc2626',
                              borderColor: 'rgba(220,38,38,0.16)',
                            }}
                          >
                            {deletingId === category.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            className="w-full max-w-xl rounded-[28px] border p-6"
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
                  {form.id ? 'Edit Category' : 'Add Category'}
                </h2>
                <p className="text-sm mt-1" style={{ color: subText }}>
                  Fill in the category details below.
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
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: muted }}>
                  Category Name
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

              <div>
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
                <label className="inline-flex items-center gap-2 text-sm" style={{ color: heading }}>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                  />
                  Active Category
                </label>
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}