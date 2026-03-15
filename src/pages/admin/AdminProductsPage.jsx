import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import {
  Package, Plus, Edit2, Trash2, Search, X, Save, Eye, EyeOff,
  CheckCircle, XCircle, MoreVertical, Loader2
} from 'lucide-react'

function formatPHP(n) { return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-sm border border-white/[0.10] overflow-hidden" style={{ background: 'var(--ink-900)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]" style={{ background: 'var(--ink-950)' }}>
          <span className="font-mono text-[10px] tracking-widest uppercase text-wp-green">{title}</span>
          <button onClick={onClose} className="text-ivory-300/30 hover:text-white transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className="block font-mono text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">{label}</label>
      {children}
      {error && <p className="mt-1 text-[10px] font-mono" style={{ color: '#EC008C' }}>{error}</p>}
    </div>
  )
}

const inputClass = "w-full bg-ink-800 border border-white/[0.10] rounded-sm px-3 py-2.5 text-sm text-ivory-200 placeholder-ivory-300/20 outline-none focus:border-wp-green/60 transition-all"

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  const emptyForm = { name: '', slug: '', category_id: '', base_price: '', unit: 'pcs', min_qty: '1', short_description: '', status: 'active' }
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase
        .from('products')
        .select('id, name, slug, short_description, base_price, status, sort_order, category_id, categories(id, name, slug)')
        .order('sort_order', { ascending: true }),
      supabase.from('categories').select('id, name, slug').order('sort_order', { ascending: true }),
    ])
    setProducts(prods ?? [])
    setCategories(cats ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  function showToast(msg, ok = true) { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }

  function toSlug(str) { return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

  function openAdd() {
    setEditTarget(null)
    setForm({ ...emptyForm, category_id: categories[0]?.id ?? '' })
    setErrors({})
    setShowModal(true)
  }

  function openEdit(p) {
    setEditTarget(p)
    setForm({
      name: p.name,
      slug: p.slug,
      category_id: p.category_id ?? '',
      base_price: String(p.base_price ?? ''),
      unit: p.unit ?? 'pcs',
      min_qty: String(p.min_qty ?? 1),
      short_description: p.short_description ?? '',
      status: p.status ?? 'active',
    })
    setErrors({})
    setShowModal(true)
    setOpenMenu(null)
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Product name is required'
    if (!form.slug.trim()) e.slug = 'Slug is required'
    if (!form.base_price || isNaN(Number(form.base_price)) || Number(form.base_price) <= 0) e.base_price = 'Valid price required'
    if (!form.min_qty || isNaN(Number(form.min_qty)) || Number(form.min_qty) < 1) e.min_qty = 'Min. quantity must be ≥ 1'
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category_id: form.category_id || null,
      base_price: Number(form.base_price),
      unit: form.unit,
      min_qty: Number(form.min_qty),
      short_description: form.short_description.trim(),
      status: form.status,
    }

    try {
      if (editTarget) {
        const { error } = await supabase.from('products').update(payload).eq('id', editTarget.id)
        if (error) throw error
        showToast('Product updated.')
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
        showToast('Product added.')
      }
      await fetchAll()
      setShowModal(false)
    } catch (err) {
      showToast(err.message || 'Something went wrong.', false)
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(p) {
    const newStatus = p.status === 'active' ? 'archived' : 'active'
    const { error } = await supabase.from('products').update({ status: newStatus }).eq('id', p.id)
    if (error) { showToast('Failed to update visibility.', false); return }
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, status: newStatus } : x))
    setOpenMenu(null)
    showToast('Visibility updated.')
  }

  async function deleteProduct(p) {
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (error) { showToast('Failed to delete product.', false); return }
    setProducts(prev => prev.filter(x => x.id !== p.id))
    setDeleteConfirm(null)
    showToast('Product deleted.')
  }

  const filtered = products
    .filter(p => catFilter === 'all' || p.category_id === catFilter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.short_description?.toLowerCase().includes(search.toLowerCase()))

  const visibleCount = products.filter(p => p.status === 'active').length

  return (
    <AdminLayout>
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>Products</h1>
          <p className="text-ivory-300/40 text-sm">{loading ? 'Loading…' : `${products.length} total · ${visibleCount} active`}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-mono font-bold transition-all"
          style={{ background: 'rgba(45,176,75,0.12)', border: '1px solid rgba(45,176,75,0.3)', color: 'var(--wp-green)' }}>
          <Plus size={13} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Products', value: products.length, color: '#29ABE2' },
          { label: 'Active',         value: visibleCount,    color: '#2DB04B' },
          { label: 'Archived',       value: products.length - visibleCount, color: '#888' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-ink-800 border border-white/[0.07] rounded-sm p-4">
            <div className="text-2xl font-black mb-0.5" style={{ fontFamily: "'Playfair Display', serif", color }}>{value}</div>
            <div className="text-ivory-300/40 text-[10px] font-mono uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
          <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-ink-800 border border-white/[0.10] rounded-sm pl-9 pr-4 py-2.5 text-sm text-ivory-200 placeholder-ivory-300/20 outline-none focus:border-wp-green/60 transition-all" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setCatFilter('all')}
            className="text-[10px] font-mono px-3 py-1.5 rounded-sm border transition-all"
            style={{ background: catFilter === 'all' ? 'rgba(41,171,226,0.1)' : 'transparent', color: catFilter === 'all' ? '#29ABE2' : 'rgba(216,216,216,0.35)', borderColor: catFilter === 'all' ? 'rgba(41,171,226,0.3)' : 'rgba(255,255,255,0.08)' }}>
            All
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setCatFilter(c.id)}
              className="text-[10px] font-mono px-3 py-1.5 rounded-sm border transition-all"
              style={{ background: catFilter === c.id ? 'rgba(41,171,226,0.1)' : 'transparent', color: catFilter === c.id ? '#29ABE2' : 'rgba(216,216,216,0.35)', borderColor: catFilter === c.id ? 'rgba(41,171,226,0.3)' : 'rgba(255,255,255,0.08)' }}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-ivory-300/30">
            <Loader2 size={16} className="animate-spin" /> Loading products…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-ivory-300/30 font-mono text-sm">No products found</div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(p => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0"
                  style={{ background: p.status === 'active' ? 'rgba(41,171,226,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${p.status === 'active' ? 'rgba(41,171,226,0.25)' : 'rgba(255,255,255,0.06)'}` }}>
                  <Package size={15} style={{ color: p.status === 'active' ? '#29ABE2' : 'rgba(216,216,216,0.2)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-semibold">{p.name}</span>
                    {p.categories?.name && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm" style={{ background: 'rgba(41,171,226,0.1)', color: '#29ABE2' }}>{p.categories.name}</span>
                    )}
                    {p.status !== 'active' && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm" style={{ background: 'rgba(136,136,136,0.1)', color: '#666' }}>Archived</span>
                    )}
                  </div>
                  <div className="text-ivory-300/35 text-[10px] font-mono mt-0.5 truncate">{p.short_description}</div>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <div className="text-white text-xs font-mono font-bold">{formatPHP(p.base_price)}</div>
                  <div className="text-ivory-300/25 text-[10px] font-mono">/{p.unit ?? 'pcs'}</div>
                </div>
                <div className="relative shrink-0">
                  <button onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                    className="w-7 h-7 rounded-sm flex items-center justify-center text-ivory-300/30 hover:text-white hover:bg-white/[0.06] transition-all">
                    <MoreVertical size={14} />
                  </button>
                  {openMenu === p.id && (
                    <div className="absolute right-0 top-8 z-20 w-44 rounded-sm border border-white/[0.10] overflow-hidden shadow-xl" style={{ background: 'var(--ink-950)' }}>
                      <button onClick={() => openEdit(p)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-mono text-ivory-300/60 hover:text-white hover:bg-white/[0.04] transition-all text-left">
                        <Edit2 size={12} /> Edit Product
                      </button>
                      <button onClick={() => toggleStatus(p)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-mono text-ivory-300/60 hover:text-white hover:bg-white/[0.04] transition-all text-left">
                        {p.status === 'active' ? <><EyeOff size={12} /> Archive</> : <><Eye size={12} /> Restore</>}
                      </button>
                      <button onClick={() => { setDeleteConfirm(p); setOpenMenu(null) }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-mono transition-all text-left"
                        style={{ color: '#EC008C' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(236,0,140,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editTarget ? 'Edit Product' : 'Add Product'} onClose={() => setShowModal(false)}>
          <Field label="Product Name" error={errors.name}>
            <input className={inputClass} placeholder="e.g. Flyers A5" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editTarget ? f.slug : toSlug(e.target.value) }))} />
          </Field>
          <Field label="Slug (URL)" error={errors.slug}>
            <input className={inputClass} placeholder="e.g. flyers-a5" value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: toSlug(e.target.value) }))} />
          </Field>
          <Field label="Category">
            <select className={inputClass} value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
              style={{ background: '#1a1a1a' }}>
              <option value="">No category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Base Price (₱)" error={errors.base_price}>
              <input className={inputClass} type="number" step="0.01" placeholder="0.00" value={form.base_price}
                onChange={e => setForm(f => ({ ...f, base_price: e.target.value }))} />
            </Field>
            <Field label="Min. Quantity" error={errors.min_qty}>
              <input className={inputClass} type="number" placeholder="1" value={form.min_qty}
                onChange={e => setForm(f => ({ ...f, min_qty: e.target.value }))} />
            </Field>
          </div>
          <Field label="Short Description">
            <textarea className={inputClass} rows={3} placeholder="Brief product description…" value={form.short_description}
              onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))} style={{ resize: 'none' }} />
          </Field>
          <Field label="Status">
            <div className="flex gap-2">
              {[{ v: 'active', label: 'Active', color: '#2DB04B' }, { v: 'archived', label: 'Archived', color: '#888' }].map(({ v, label, color }) => (
                <button key={v} onClick={() => setForm(f => ({ ...f, status: v }))}
                  className="flex-1 py-2.5 rounded-sm text-xs font-mono border transition-all"
                  style={{ background: form.status === v ? `${color}14` : 'transparent', color: form.status === v ? color : 'rgba(216,216,216,0.35)', borderColor: form.status === v ? color + '40' : 'rgba(255,255,255,0.08)' }}>
                  {label}
                </button>
              ))}
            </div>
          </Field>
          <div className="flex gap-3 mt-2">
            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-sm text-xs font-mono border border-white/[0.08] text-ivory-300/40 hover:text-white transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-xs font-mono font-bold transition-all disabled:opacity-50"
              style={{ background: 'rgba(45,176,75,0.15)', border: '1px solid rgba(45,176,75,0.3)', color: 'var(--wp-green)' }}>
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {editTarget ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal title="Delete Product" onClose={() => setDeleteConfirm(null)}>
          <p className="text-ivory-300/60 text-sm mb-1">Delete <span className="text-white font-semibold">{deleteConfirm.name}</span>?</p>
          <p className="text-ivory-300/30 text-xs font-mono mb-6">This cannot be undone. Consider archiving instead.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-sm text-xs font-mono border border-white/[0.08] text-ivory-300/40 hover:text-white transition-all">Cancel</button>
            <button onClick={() => deleteProduct(deleteConfirm)}
              className="flex-1 py-2.5 rounded-sm text-xs font-mono font-bold"
              style={{ background: 'rgba(236,0,140,0.12)', border: '1px solid rgba(236,0,140,0.3)', color: '#EC008C' }}>
              Delete
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-sm border text-xs font-mono shadow-xl"
          style={{ background: toast.ok ? 'rgba(45,176,75,0.15)' : 'rgba(236,0,140,0.15)', borderColor: toast.ok ? 'rgba(45,176,75,0.3)' : 'rgba(236,0,140,0.3)', color: toast.ok ? '#2DB04B' : '#EC008C' }}>
          {toast.ok ? <CheckCircle size={13} /> : <XCircle size={13} />} {toast.msg}
        </div>
      )}
    </AdminLayout>
  )
}