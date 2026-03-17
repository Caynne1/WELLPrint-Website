import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import {
  Tag, Plus, Edit2, Trash2, Save, X, CheckCircle, XCircle,
  Loader2, ChevronUp, ChevronDown, Package, RefreshCw,
} from 'lucide-react'

/* ── Modal ── */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-sm border border-white/[0.10] overflow-hidden max-h-[90vh] flex flex-col"
        style={{ background: '#111' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] shrink-0"
          style={{ background: '#0a0a0a' }}>
          <span className="font-body text-[10px] tracking-widest uppercase text-wp-green">{title}</span>
          <button onClick={onClose} className="text-ivory-300/30 hover:text-white transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

/* ── Field ── */
function Field({ label, error, hint, children }) {
  return (
    <div className="mb-4">
      <label className="block font-body text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[9px] font-body" style={{ color: 'rgba(216,216,216,0.2)' }}>{hint}</p>}
      {error && <p className="mt-1 text-[10px] font-body" style={{ color: '#CD1B6E' }}>{error}</p>}
    </div>
  )
}

const inputClass = "w-full bg-ink-800 border border-white/[0.10] rounded-sm px-3 py-2.5 text-sm text-ivory-200 placeholder-ivory-300/20 outline-none focus:border-wp-green/60 transition-all"

function toSlug(str) { return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

export default function AdminCategoriesPage() {
  const [categories, setCategories]   = useState([])
  const [counts, setCounts]           = useState({})
  const [loading, setLoading]         = useState(true)
  const [fetchError, setFetchError]   = useState(null)
  const [showModal, setShowModal]     = useState(false)
  const [editTarget, setEditTarget]   = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [saving, setSaving]           = useState(false)
  const [toast, setToast]             = useState(null)

  const emptyForm = { name: '', slug: '', description: '' }
  const [form, setForm]     = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      // Use select * so we work with whatever columns exist in the DB
      // Try ordering by sort_order, fall back to name if column missing
      let { data: cats, error: catErr } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (catErr) {
        const fallback = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true })
        if (fallback.error) throw fallback.error
        cats = fallback.data
      }

      // Product counts per category
      const { data: prods, error: prodErr } = await supabase
        .from('products')
        .select('category_id')
      if (prodErr) throw prodErr

      setCategories(cats ?? [])
      const map = {}
      ;(prods ?? []).forEach(p => {
        if (p.category_id) map[p.category_id] = (map[p.category_id] || 0) + 1
      })
      setCounts(map)
    } catch (err) {
      setFetchError(err.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()

    // Real-time subscription — any change to categories table re-fetches everywhere
    const channel = supabase
      .channel('admin-categories-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        fetchAll()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchAll])

  function showToast(msg, ok = true) { setToast({ msg, ok }); setTimeout(() => setToast(null), 3500) }

  function openAdd() {
    setEditTarget(null)
    setForm(emptyForm)
    setErrors({})
    setShowModal(true)
  }

  function openEdit(c) {
    setEditTarget(c)
    setForm({ name: c.name, slug: c.slug, description: c.description ?? c.desc ?? '' })
    setErrors({})
    setShowModal(true)
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Category name is required'
    if (!form.slug.trim()) e.slug = 'Slug is required'
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)

    // Base payload — no sort_order on create so the DB default handles it
    // Build payload with only columns that exist in the DB
    const hasDescript = categories.length === 0 || 'description' in (categories[0] ?? {})
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      ...(hasDescript ? { description: form.description.trim() || null } : {}),
    }

    // Only add sort_order if the column seems to exist (we know from categories having it)
    const hasSortOrder = categories.length > 0 && 'sort_order' in categories[0]
    if (!editTarget && hasSortOrder) {
      const maxOrder = Math.max(0, ...categories.map(c => c.sort_order ?? 0))
      payload.sort_order = maxOrder + 1
    }

    try {
      if (editTarget) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editTarget.id)
        if (error) throw error
        showToast('Category updated.')
      } else {
        const { error } = await supabase.from('categories').insert(payload)
        if (error) throw error
        showToast('Category added.')
      }
      await fetchAll()
      setShowModal(false)
    } catch (err) {
      showToast(err.message || 'Something went wrong.', false)
    } finally {
      setSaving(false)
    }
  }

  async function deleteCategory(c) {
    const { error } = await supabase.from('categories').delete().eq('id', c.id)
    if (error) { showToast('Failed to delete. ' + (error.message || ''), false); return }
    setCategories(prev => prev.filter(x => x.id !== c.id))
    setDeleteConfirm(null)
    showToast('Category deleted.')
  }

  async function moveOrder(cat, direction) {
    const hasSortOrder = categories.length > 0 && 'sort_order' in categories[0]
    if (!hasSortOrder) return

    const idx = categories.findIndex(c => c.id === cat.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= categories.length) return

    const a = categories[idx]
    const b = categories[swapIdx]
    const aOrder = a.sort_order ?? idx
    const bOrder = b.sort_order ?? swapIdx

    await Promise.all([
      supabase.from('categories').update({ sort_order: bOrder }).eq('id', a.id),
      supabase.from('categories').update({ sort_order: aOrder }).eq('id', b.id),
    ])
    await fetchAll()
  }

  const hasSortOrder = categories.length > 0 && 'sort_order' in categories[0]

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "'Lora', serif" }}>Categories</h1>
          <p className="text-ivory-300/40 text-sm">
            {loading ? 'Loading…' : `${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'}`}
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-body font-bold transition-all"
          style={{ background: 'rgba(19,161,80,0.12)', border: '1px solid rgba(19,161,80,0.3)', color: 'var(--wp-green)' }}>
          <Plus size={13} /> Add Category
        </button>
      </div>

      {/* Info banner */}
      <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-sm border"
        style={{ background: 'rgba(25,147,210,0.06)', borderColor: 'rgba(25,147,210,0.2)' }}>
        <Tag size={13} style={{ color: '#1993D2', marginTop: 1, flexShrink: 0 }} />
        <p className="text-xs font-body" style={{ color: 'rgba(25,147,210,0.7)' }}>
          Categories group your products and appear as filters on the Products page. Adding or editing here reflects immediately across the entire site.
        </p>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-sm border"
          style={{ background: 'rgba(205,27,110,0.06)', borderColor: 'rgba(205,27,110,0.2)' }}>
          <XCircle size={13} style={{ color: '#CD1B6E', flexShrink: 0 }} />
          <p className="text-xs font-body flex-1" style={{ color: 'rgba(205,27,110,0.8)' }}>{fetchError}</p>
          <button onClick={fetchAll} className="flex items-center gap-1 text-[10px] font-body transition-colors"
            style={{ color: 'rgba(205,27,110,0.6)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#CD1B6E'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(205,27,110,0.6)'}>
            <RefreshCw size={10} /> Retry
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="py-16 flex items-center justify-center gap-2 text-ivory-300/30 bg-ink-800 border border-white/[0.07] rounded-sm">
          <Loader2 size={16} className="animate-spin" /> Loading categories…
        </div>
      ) : categories.length === 0 ? (
        <div className="py-20 text-center bg-ink-800 border border-white/[0.07] rounded-sm">
          <Tag size={28} className="mx-auto mb-3" style={{ color: 'rgba(216,216,216,0.12)' }} />
          <p className="text-ivory-300/30 font-body text-sm mb-4">No categories yet</p>
          <button onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-body font-bold transition-all"
            style={{ background: 'rgba(19,161,80,0.12)', border: '1px solid rgba(19,161,80,0.3)', color: 'var(--wp-green)' }}>
            <Plus size={13} /> Add your first category
          </button>
        </div>
      ) : (
        <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
          {/* Table header */}
          <div className="grid gap-3 px-5 py-2.5 border-b border-white/[0.05]"
            style={{ background: 'rgba(255,255,255,0.02)', gridTemplateColumns: hasSortOrder ? '2rem 1fr 10rem 6rem 6rem' : '1fr 10rem 6rem 6rem' }}>
            {hasSortOrder && <div />}
            <div className="font-body text-[9px] tracking-widest uppercase" style={{ color: 'rgba(216,216,216,0.3)' }}>Category</div>
            <div className="font-body text-[9px] tracking-widest uppercase" style={{ color: 'rgba(216,216,216,0.3)' }}>Slug</div>
            <div className="font-body text-[9px] tracking-widest uppercase text-center" style={{ color: 'rgba(216,216,216,0.3)' }}>Products</div>
            <div className="font-body text-[9px] tracking-widest uppercase text-right" style={{ color: 'rgba(216,216,216,0.3)' }}>Actions</div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {categories.map((cat, idx) => (
              <div key={cat.id}
                className="grid gap-3 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors group"
                style={{ gridTemplateColumns: hasSortOrder ? '2rem 1fr 10rem 6rem 6rem' : '1fr 10rem 6rem 6rem' }}>

                {/* Order controls (only if sort_order exists) */}
                {hasSortOrder && (
                  <div className="flex flex-col items-center gap-0.5">
                    <button onClick={() => moveOrder(cat, 'up')} disabled={idx === 0}
                      className="w-5 h-5 rounded-sm flex items-center justify-center transition-all disabled:opacity-20"
                      style={{ color: 'rgba(216,216,216,0.3)' }}
                      onMouseEnter={e => { if (idx > 0) e.currentTarget.style.color = 'white' }}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(216,216,216,0.3)'}>
                      <ChevronUp size={13} />
                    </button>
                    <button onClick={() => moveOrder(cat, 'down')} disabled={idx === categories.length - 1}
                      className="w-5 h-5 rounded-sm flex items-center justify-center transition-all disabled:opacity-20"
                      style={{ color: 'rgba(216,216,216,0.3)' }}
                      onMouseEnter={e => { if (idx < categories.length - 1) e.currentTarget.style.color = 'white' }}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(216,216,216,0.3)'}>
                      <ChevronDown size={13} />
                    </button>
                  </div>
                )}

                {/* Name + description */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(25,147,210,0.12)', border: '1px solid rgba(25,147,210,0.2)' }}>
                    <Tag size={11} style={{ color: '#1993D2' }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-sm font-semibold leading-snug">{cat.name}</div>
                    {cat.description != null && cat.description !== '' && (
                      <div className="text-ivory-300/30 text-[10px] font-body mt-0.5 truncate">{cat.description}</div>
                    )}
                  </div>
                </div>

                {/* Slug */}
                <div>
                  <code className="text-[10px] font-body px-2 py-1 rounded-sm inline-block max-w-full truncate"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(216,216,216,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {cat.slug}
                  </code>
                </div>

                {/* Product count */}
                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center gap-1.5 text-xs font-body px-2 py-1 rounded-sm"
                    style={{
                      background: counts[cat.id] > 0 ? 'rgba(19,161,80,0.08)' : 'transparent',
                      color: counts[cat.id] > 0 ? '#13A150' : 'rgba(216,216,216,0.2)',
                    }}>
                    <Package size={10} />
                    {counts[cat.id] ?? 0}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => openEdit(cat)}
                    className="w-7 h-7 rounded-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    style={{ color: 'rgba(216,216,216,0.5)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(216,216,216,0.5)' }}>
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => setDeleteConfirm(cat)}
                    className="w-7 h-7 rounded-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    style={{ color: 'rgba(205,27,110,0.5)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(205,27,110,0.08)'; e.currentTarget.style.color = '#CD1B6E' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(205,27,110,0.5)' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editTarget ? 'Edit Category' : 'Add Category'} onClose={() => setShowModal(false)}>
          <Field label="Category Name" error={errors.name}>
            <input className={inputClass} placeholder="e.g. Business Cards" value={form.name}
              autoFocus
              onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editTarget ? f.slug : toSlug(e.target.value) }))} />
          </Field>
          <Field label="Slug (URL)" error={errors.slug}
            hint="Used in product filters and URLs. Auto-generated from name — you can also edit it manually.">
            <input className={inputClass} placeholder="e.g. business-cards" value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: toSlug(e.target.value) }))} />
          </Field>
          <Field label="Description (optional)">
            <textarea className={inputClass} rows={2} placeholder="Brief description of this category…" value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'none' }} />
          </Field>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => setShowModal(false)}
              className="flex-1 py-2.5 rounded-sm text-xs font-body border border-white/[0.08] text-ivory-300/40 hover:text-white transition-all">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-xs font-body font-bold transition-all disabled:opacity-50"
              style={{ background: 'rgba(19,161,80,0.15)', border: '1px solid rgba(19,161,80,0.3)', color: 'var(--wp-green)' }}>
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {editTarget ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <Modal title="Delete Category" onClose={() => setDeleteConfirm(null)}>
          <p className="text-ivory-300/60 text-sm mb-2">
            Delete <span className="text-white font-semibold">{deleteConfirm.name}</span>?
          </p>
          {counts[deleteConfirm.id] > 0 && (
            <div className="mb-4 px-3 py-2.5 rounded-sm border"
              style={{ background: 'rgba(251,176,59,0.08)', borderColor: 'rgba(251,176,59,0.25)' }}>
              <p className="text-[11px] font-body" style={{ color: '#FDC010' }}>
                ⚠ This category has <strong>{counts[deleteConfirm.id]}</strong> product{counts[deleteConfirm.id] !== 1 ? 's' : ''} assigned to it.
                Deleting it will unassign those products.
              </p>
            </div>
          )}
          <p className="text-ivory-300/30 text-xs font-body mb-6">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setDeleteConfirm(null)}
              className="flex-1 py-2.5 rounded-sm text-xs font-body border border-white/[0.08] text-ivory-300/40 hover:text-white transition-all">
              Cancel
            </button>
            <button type="button" onClick={() => deleteCategory(deleteConfirm)}
              className="flex-1 py-2.5 rounded-sm text-xs font-body font-bold"
              style={{ background: 'rgba(236,0,140,0.12)', border: '1px solid rgba(236,0,140,0.3)', color: '#CD1B6E' }}>
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-sm border text-xs font-body shadow-xl"
          style={{ background: toast.ok ? 'rgba(19,161,80,0.15)' : 'rgba(236,0,140,0.15)', borderColor: toast.ok ? 'rgba(19,161,80,0.3)' : 'rgba(236,0,140,0.3)', color: toast.ok ? '#13A150' : '#CD1B6E' }}>
          {toast.ok ? <CheckCircle size={13} /> : <XCircle size={13} />} {toast.msg}
        </div>
      )}
    </AdminLayout>
  )
}