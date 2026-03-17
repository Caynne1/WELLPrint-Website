import { useState, useEffect, useCallback, useRef } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import {
  Package, Plus, Edit2, Trash2, Search, X, Save, Eye, EyeOff,
  CheckCircle, XCircle, MoreVertical, Loader2, ImagePlus, Upload,
  Image, Grid, List, ChevronDown, Clock, Tag,
} from 'lucide-react'

function formatPHP(n) { return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }

/* ── Modal ── */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg rounded-sm border border-white/[0.10] overflow-hidden max-h-[90vh] flex flex-col"
        style={{ background: 'var(--ink-900,#111)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] shrink-0"
          style={{ background: 'var(--ink-950,#0a0a0a)' }}>
          <span className="font-body text-[10px] tracking-widest uppercase text-wp-green">{title}</span>
          <button onClick={onClose} className="text-ivory-300/30 hover:text-white transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

/* ── Field ── */
function Field({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className="block font-body text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">{label}</label>
      {children}
      {error && <p className="mt-1 text-[10px] font-body" style={{ color: '#CD1B6E' }}>{error}</p>}
    </div>
  )
}

const inputClass = "w-full bg-ink-800 border border-white/[0.10] rounded-sm px-3 py-2.5 text-sm text-ivory-200 placeholder-ivory-300/20 outline-none focus:border-wp-green/60 transition-all"

/* ── Image Upload ── */
function ImageUpload({ currentUrl, onUpload, uploading }) {
  const fileRef = useRef()
  const [preview, setPreview] = useState(currentUrl || null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => { setPreview(currentUrl || null) }, [currentUrl])

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(file)
    await onUpload(file)
  }

  function onDrop(e) {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <div
        className="relative rounded-sm border-2 border-dashed transition-all duration-200 overflow-hidden"
        style={{
          borderColor: dragOver ? 'var(--wp-green)' : 'rgba(255,255,255,0.12)',
          background: dragOver ? 'rgba(19,161,80,0.05)' : 'rgba(255,255,255,0.02)',
          aspectRatio: '4/3',
        }}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          <>
            <img src={preview} alt="Product" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Upload size={20} style={{ color: 'var(--wp-green)' }} />
                <span className="text-xs font-body text-white">Change image</span>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer">
            {uploading ? (
              <Loader2 size={24} className="animate-spin" style={{ color: 'var(--wp-green)' }} />
            ) : (
              <>
                <div className="w-12 h-12 rounded-sm flex items-center justify-center"
                  style={{ background: 'rgba(19,161,80,0.1)', border: '1px solid rgba(19,161,80,0.25)' }}>
                  <ImagePlus size={20} style={{ color: 'var(--wp-green)' }} />
                </div>
                <div className="text-center">
                  <p className="text-ivory-300/50 text-xs">Click or drag to upload</p>
                  <p className="text-ivory-300/25 text-[10px] font-body mt-0.5">JPG, PNG, WEBP · Max 5MB</p>
                </div>
              </>
            )}
          </div>
        )}
        {uploading && preview && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-white" />
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" className="hidden" accept="image/*"
        onChange={e => handleFile(e.target.files[0])} />
      {preview && (
        <button type="button"
          onClick={e => { e.stopPropagation(); setPreview(null); onUpload(null) }}
          className="mt-2 text-[10px] font-body text-ivory-300/30 hover:text-wp-magenta transition-colors flex items-center gap-1">
          <X size={10} /> Remove image
        </button>
      )}
    </div>
  )
}

/* ── Category Dropdown ── */
function CategoryDropdown({ categories, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selected = value === 'all'
    ? 'All Categories'
    : categories.find(c => c.id === value)?.name ?? 'All Categories'

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-sm border text-xs font-body transition-all min-w-[170px]"
        style={{
          background: value !== 'all' ? 'rgba(25,147,210,0.08)' : 'rgba(255,255,255,0.03)',
          borderColor: value !== 'all' ? 'rgba(25,147,210,0.35)' : 'rgba(255,255,255,0.10)',
          color: value !== 'all' ? '#1993D2' : 'rgba(216,216,216,0.5)',
        }}>
        <Tag size={11} />
        <span className="flex-1 text-left truncate">{selected}</span>
        <ChevronDown size={11} className="shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-30 w-60 rounded-sm border border-white/[0.10] shadow-2xl overflow-hidden"
          style={{ background: '#0d0d0d' }}>
          {/* All */}
          <button onClick={() => { onChange('all'); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-body transition-all text-left"
            style={{ color: value === 'all' ? 'var(--wp-green)' : 'rgba(216,216,216,0.55)', background: value === 'all' ? 'rgba(19,161,80,0.08)' : 'transparent' }}
            onMouseEnter={e => { if (value !== 'all') e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { if (value !== 'all') e.currentTarget.style.background = 'transparent' }}>
            <div className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: value === 'all' ? 'var(--wp-green)' : 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.15)' }} />
            All Categories
            {value === 'all' && <CheckCircle size={10} className="ml-auto" style={{ color: 'var(--wp-green)' }} />}
          </button>

          {categories.length > 0 && <div className="border-t border-white/[0.06]" />}

          {categories.map(c => (
            <button key={c.id} onClick={() => { onChange(c.id); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-body transition-all text-left"
              style={{ color: value === c.id ? '#1993D2' : 'rgba(216,216,216,0.55)', background: value === c.id ? 'rgba(25,147,210,0.08)' : 'transparent' }}
              onMouseEnter={e => { if (value !== c.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (value !== c.id) e.currentTarget.style.background = 'transparent' }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: value === c.id ? '#1993D2' : 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.15)' }} />
              {c.name}
              {value === c.id && <CheckCircle size={10} className="ml-auto" style={{ color: '#1993D2' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Grid Card ── */
function ProductGridCard({ p, onEdit, onToggleStatus, onDelete, openMenu, setOpenMenu }) {
  return (
    <div className="rounded-sm border border-white/[0.07] overflow-hidden flex flex-col transition-all hover:border-white/[0.14]"
      style={{ background: 'rgba(255,255,255,0.025)' }}>
      <div className="relative" style={{ aspectRatio: '4/3', background: 'rgba(255,255,255,0.03)' }}>
        {p.thumbnail_url
          ? <img src={p.thumbnail_url} alt={p.name} className="w-full h-full object-cover" />
          : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
              <Image size={20} style={{ color: 'rgba(216,216,216,0.1)' }} />
              <span className="text-[7px] font-body tracking-widest uppercase" style={{ color: 'rgba(216,216,216,0.12)' }}>No Photo</span>
            </div>
          )}
        {p.status !== 'active' && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-sm text-[7px] font-body font-bold tracking-wider uppercase"
            style={{ background: 'rgba(100,100,100,0.85)', color: '#fff' }}>Archived</div>
        )}
        {p.categories?.name && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-sm text-[7px] font-body font-bold"
            style={{ background: 'rgba(25,147,210,0.85)', color: '#fff', backdropFilter: 'blur(4px)' }}>
            {p.categories.name}
          </div>
        )}
        <div className="absolute top-2 right-2" onClick={e => e.stopPropagation()}>
          <button onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
            className="w-6 h-6 rounded-sm flex items-center justify-center text-white/70 hover:text-white transition-all"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <MoreVertical size={11} />
          </button>
          {openMenu === p.id && (
            <div className="absolute right-0 top-7 z-20 w-44 rounded-sm border border-white/[0.10] overflow-hidden shadow-xl" style={{ background: '#0a0a0a' }}>
              <button onClick={() => onEdit(p)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-body text-ivory-300/60 hover:text-white hover:bg-white/[0.04] transition-all text-left">
                <Edit2 size={12} /> Edit Product
              </button>
              <button onClick={() => onToggleStatus(p)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-body text-ivory-300/60 hover:text-white hover:bg-white/[0.04] transition-all text-left">
                {p.status === 'active' ? <><EyeOff size={12} /> Archive</> : <><Eye size={12} /> Restore</>}
              </button>
              <button onClick={() => onDelete(p)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-body transition-all text-left"
                style={{ color: '#CD1B6E' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(236,0,140,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-white text-xs font-semibold leading-snug mb-1 line-clamp-2" style={{ fontFamily: "'Lora', serif" }}>{p.name}</p>
        <p className="text-ivory-300/30 text-[10px] font-body line-clamp-1 flex-1 mb-2">{p.short_description || '—'}</p>
        <div className="flex items-center justify-between">
          <span className="text-white text-xs font-bold">{formatPHP(p.base_price)}</span>
          {p.turnaround_days && (
            <span className="flex items-center gap-1 text-ivory-300/25 text-[9px] font-body">
              <Clock size={8} /> {p.turnaround_days}d
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── List Row ── */
function ProductListRow({ p, onEdit, onToggleStatus, onDelete, openMenu, setOpenMenu }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
      <div className="w-12 h-12 rounded-sm overflow-hidden shrink-0 flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {p.thumbnail_url
          ? <img src={p.thumbnail_url} alt={p.name} className="w-full h-full object-cover" />
          : <Image size={16} style={{ color: 'rgba(216,216,216,0.2)' }} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white text-sm font-semibold">{p.name}</span>
          {p.categories?.name && (
            <span className="text-[9px] font-body px-2 py-0.5 rounded-sm" style={{ background: 'rgba(25,147,210,0.1)', color: '#1993D2' }}>{p.categories.name}</span>
          )}
          {p.status !== 'active' && (
            <span className="text-[9px] font-body px-2 py-0.5 rounded-sm" style={{ background: 'rgba(136,136,136,0.1)', color: '#666' }}>Archived</span>
          )}
          {!p.thumbnail_url && (
            <span className="text-[9px] font-body px-2 py-0.5 rounded-sm flex items-center gap-1" style={{ background: 'rgba(251,176,59,0.1)', color: '#FDC010' }}>
              <ImagePlus size={8} /> No image
            </span>
          )}
        </div>
        <div className="text-ivory-300/35 text-[10px] font-body mt-0.5 truncate">{p.short_description}</div>
      </div>
      <div className="hidden sm:block text-right shrink-0">
        <div className="text-white text-xs font-body font-bold">{formatPHP(p.base_price)}</div>
        <div className="text-ivory-300/25 text-[10px] font-body">/{p.unit ?? 'pcs'}</div>
        {p.turnaround_days && (
          <div className="text-ivory-300/20 text-[9px] font-body mt-0.5">{p.turnaround_days}d turnaround</div>
        )}
      </div>
      <div className="relative shrink-0" onClick={e => e.stopPropagation()}>
        <button onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
          className="w-7 h-7 rounded-sm flex items-center justify-center text-ivory-300/30 hover:text-white hover:bg-white/[0.06] transition-all">
          <MoreVertical size={14} />
        </button>
        {openMenu === p.id && (
          <div className="absolute right-0 top-8 z-50 w-48 rounded-sm border border-white/[0.10] shadow-xl" style={{ background: '#0a0a0a' }}>
            <button onClick={() => onEdit(p)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-body text-ivory-300/60 hover:text-white hover:bg-white/[0.04] transition-all text-left">
              <Edit2 size={12} /> Edit Product
            </button>
            <button onClick={() => onToggleStatus(p)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-body text-ivory-300/60 hover:text-white hover:bg-white/[0.04] transition-all text-left">
              {p.status === 'active' ? <><EyeOff size={12} /> Archive</> : <><Eye size={12} /> Restore</>}
            </button>
            <button onClick={() => onDelete(p)}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-body transition-all text-left"
              style={{ color: '#CD1B6E' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(236,0,140,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Trash2 size={12} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ══ Main Page ══ */
export default function AdminProductsPage() {
  const [products, setProducts]       = useState([])
  const [categories, setCategories]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [catFilter, setCatFilter]     = useState('all')
  const [view, setView]               = useState('list')
  const [showModal, setShowModal]     = useState(false)
  const [editTarget, setEditTarget]   = useState(null)
  const [openMenu, setOpenMenu]       = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [toast, setToast]             = useState(null)
  const [saving, setSaving]           = useState(false)
  const [uploading, setUploading]     = useState(false)
  const [uploadingExtra, setUploadingExtra] = useState(false)

  const emptyForm = {
    name: '', slug: '', category_id: '', base_price: '', unit: 'pcs',
    min_qty: '1', turnaround_days: '', short_description: '',
    status: 'active', thumbnail_url: '', images: [],
  }
  const [form, setForm]     = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products')
        .select('id, name, slug, short_description, base_price, thumbnail_url, images, status, sort_order, category_id, min_qty, unit, turnaround_days, categories(id, name, slug)')
        .order('sort_order', { ascending: true }),
      supabase.from('categories').select('id, name, slug').order('sort_order', { ascending: true }),
    ])
    setProducts(prods ?? [])
    setCategories(cats ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Close menus on outside click
  useEffect(() => {
    function handler() { setOpenMenu(null) }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

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
      name: p.name, slug: p.slug, category_id: p.category_id ?? '',
      base_price: String(p.base_price ?? ''),
      unit: p.unit ?? 'pcs',
      min_qty: String(p.min_qty ?? 1),
      turnaround_days: String(p.turnaround_days ?? ''),
      short_description: p.short_description ?? '',
      status: p.status ?? 'active',
      thumbnail_url: p.thumbnail_url ?? '',
      images: Array.isArray(p.images) ? p.images : [],
    })
    setErrors({})
    setShowModal(true)
    setOpenMenu(null)
  }

  async function handleImageUpload(file) {
    if (!file) { setForm(f => ({ ...f, thumbnail_url: '' })); return }
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
      setForm(f => ({ ...f, thumbnail_url: publicUrl }))
      showToast('Image uploaded.')
    } catch (err) {
      showToast('Image upload failed: ' + (err.message || 'Unknown error'), false)
    } finally {
      setUploading(false)
    }
  }

  async function handleExtraImageUpload(file) {
    if (!file) return
    setUploadingExtra(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `products/gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
      setForm(f => ({ ...f, images: [...(f.images || []), publicUrl] }))
      showToast('Gallery image added.')
    } catch (err) {
      showToast('Upload failed: ' + (err.message || 'Unknown error'), false)
    } finally {
      setUploadingExtra(false)
    }
  }

  function removeExtraImage(url) {
    setForm(f => ({ ...f, images: (f.images || []).filter(u => u !== url) }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Product name is required'
    if (!form.slug.trim()) e.slug = 'Slug is required'
    if (!form.base_price || isNaN(Number(form.base_price)) || Number(form.base_price) <= 0) e.base_price = 'Valid price required'
    if (!form.min_qty || isNaN(Number(form.min_qty)) || Number(form.min_qty) < 1) e.min_qty = 'Min. quantity must be ≥ 1'
    if (form.turnaround_days && (isNaN(Number(form.turnaround_days)) || Number(form.turnaround_days) < 1)) e.turnaround_days = 'Must be a positive number'
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    const payload = {
      name: form.name.trim(), slug: form.slug.trim(),
      category_id: form.category_id || null,
      base_price: Number(form.base_price),
      unit: form.unit || 'pcs',
      min_qty: Number(form.min_qty) || 1,
      turnaround_days: form.turnaround_days ? Number(form.turnaround_days) : null,
      short_description: form.short_description.trim(),
      status: form.status,
      thumbnail_url: form.thumbnail_url || null,
      images: form.images || [],
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
      {/* Header */}
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "'Lora', serif" }}>Products</h1>
          <p className="text-ivory-300/40 text-sm">{loading ? 'Loading…' : `${products.length} total · ${visibleCount} active`}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-body font-bold transition-all"
          style={{ background: 'rgba(19,161,80,0.12)', border: '1px solid rgba(19,161,80,0.3)', color: 'var(--wp-green)' }}>
          <Plus size={13} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Products', value: products.length,                color: '#1993D2' },
          { label: 'Active',         value: visibleCount,                   color: '#13A150' },
          { label: 'Archived',       value: products.length - visibleCount, color: '#888'    },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-ink-800 border border-white/[0.07] rounded-sm p-4">
            <div className="text-2xl font-black mb-0.5" style={{ fontFamily: "'Lora', serif", color }}>{value}</div>
            <div className="text-ivory-300/40 text-[10px] font-body uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
          <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-ink-800 border border-white/[0.10] rounded-sm pl-9 pr-8 py-2.5 text-sm text-ivory-200 placeholder-ivory-300/20 outline-none focus:border-wp-green/60 transition-all" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ivory-300/25 hover:text-white transition-colors">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <CategoryDropdown categories={categories} value={catFilter} onChange={setCatFilter} />

        <div className="flex-1" />

        {/* View toggle: List | Grid */}
        <div className="flex items-center rounded-sm border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
          {[
            { v: 'list', Icon: List, label: 'List' },
            { v: 'grid', Icon: Grid, label: 'Grid' },
          ].map(({ v, Icon, label }) => (
            <button key={v} onClick={() => setView(v)}
              className="flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-body transition-all"
              style={{
                background: view === v ? 'rgba(19,161,80,0.12)' : 'rgba(255,255,255,0.02)',
                color: view === v ? 'var(--wp-green)' : 'rgba(216,216,216,0.35)',
                borderRight: v === 'list' ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
              <Icon size={13} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-[10px] font-body mb-3" style={{ color: 'rgba(216,216,216,0.22)' }}>
        {loading ? '' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}${catFilter !== 'all' ? ` in ${categories.find(c => c.id === catFilter)?.name ?? ''}` : ''}`}
      </p>

      {/* Content */}
      {loading ? (
        <div className="py-16 flex items-center justify-center gap-2 text-ivory-300/30 bg-ink-800 border border-white/[0.07] rounded-sm">
          <Loader2 size={16} className="animate-spin" /> Loading products…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-ink-800 border border-white/[0.07] rounded-sm">
          <Package size={28} className="mx-auto mb-3" style={{ color: 'rgba(216,216,216,0.12)' }} />
          <p className="text-ivory-300/30 font-body text-sm">No products found</p>
          {(search || catFilter !== 'all') && (
            <button onClick={() => { setSearch(''); setCatFilter('all') }}
              className="mt-3 text-[10px] font-body text-ivory-300/30 hover:text-wp-green transition-colors inline-flex items-center gap-1">
              <X size={10} /> Clear filters
            </button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(p => (
            <ProductGridCard key={p.id} p={p}
              onEdit={openEdit}
              onToggleStatus={toggleStatus}
              onDelete={prod => { setDeleteConfirm(prod); setOpenMenu(null) }}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
            />
          ))}
        </div>
      ) : (
        <div className="bg-ink-800 border border-white/[0.07] rounded-sm divide-y divide-white/[0.04]">
          {filtered.map(p => (
            <ProductListRow key={p.id} p={p}
              onEdit={openEdit}
              onToggleStatus={toggleStatus}
              onDelete={prod => { setDeleteConfirm(prod); setOpenMenu(null) }}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editTarget ? 'Edit Product' : 'Add Product'} onClose={() => setShowModal(false)}>
          <Field label="Product Image (Main / Thumbnail)">
            <ImageUpload currentUrl={form.thumbnail_url} onUpload={handleImageUpload} uploading={uploading} />
          </Field>

          <Field label={`Gallery Images (${(form.images || []).length} added — carousel on detail page)`}>
            <div className="space-y-3">
              {(form.images || []).length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {(form.images || []).map((url, i) => (
                    <div key={url} className="relative group rounded-sm overflow-hidden"
                      style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExtraImage(url)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(205,27,110,0.85)' }}>
                        <X size={10} color="white" />
                      </button>
                      <div className="absolute bottom-1 left-1 text-[8px] font-body px-1 rounded-sm"
                        style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.5)' }}>{i + 1}</div>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-sm border border-dashed transition-all hover:border-wp-green/50"
                style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)' }}>
                {uploadingExtra
                  ? <Loader2 size={13} className="animate-spin" style={{ color: 'var(--wp-green)' }} />
                  : <ImagePlus size={13} style={{ color: 'var(--wp-green)' }} />}
                <span className="text-xs font-body" style={{ color: 'rgba(216,216,216,0.4)' }}>
                  {uploadingExtra ? 'Uploading…' : 'Add gallery image'}
                </span>
                <input type="file" className="hidden" accept="image/*" disabled={uploadingExtra}
                  onChange={e => { if (e.target.files[0]) { handleExtraImageUpload(e.target.files[0]); e.target.value = '' } }} />
              </label>
              <p className="text-[9px] font-body" style={{ color: 'rgba(216,216,216,0.2)' }}>
                These extra images appear in the carousel on the product detail page.
              </p>
            </div>
          </Field>

          <Field label="Product Name" error={errors.name}>
            <input className={inputClass} placeholder="e.g. Flyers A5" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editTarget ? f.slug : toSlug(e.target.value) }))} />
          </Field>
          <Field label="Slug (URL)" error={errors.slug}>
            <input className={inputClass} placeholder="e.g. flyers-a5" value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: toSlug(e.target.value) }))} />
          </Field>
          <Field label="Category">
            <select className={inputClass} value={form.category_id}
              onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} style={{ background: '#1a1a1a' }}>
              <option value="">No category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Base Price (₱)" error={errors.base_price}>
            <input className={inputClass} type="number" step="0.01" placeholder="0.00" value={form.base_price}
              onChange={e => setForm(f => ({ ...f, base_price: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Min. Quantity" error={errors.min_qty}>
              <input className={inputClass} type="number" placeholder="1" value={form.min_qty}
                onChange={e => setForm(f => ({ ...f, min_qty: e.target.value }))} />
            </Field>
            <Field label="Unit">
              <select className={inputClass} value={form.unit}
                onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} style={{ background: '#1a1a1a' }}>
                <option value="pcs">pcs</option>
                <option value="sheets">sheets</option>
                <option value="sets">sets</option>
                <option value="sq ft">sq ft</option>
                <option value="meters">meters</option>
                <option value="reams">reams</option>
              </select>
            </Field>
            <Field label="Turnaround (days)" error={errors.turnaround_days}>
              <input className={inputClass} type="number" placeholder="e.g. 3" value={form.turnaround_days}
                onChange={e => setForm(f => ({ ...f, turnaround_days: e.target.value }))} />
            </Field>
          </div>
          <Field label="Short Description">
            <textarea className={inputClass} rows={3} placeholder="Brief product description…" value={form.short_description}
              onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))} style={{ resize: 'none' }} />
          </Field>
          <Field label="Status">
            <div className="flex gap-2">
              {[{ v: 'active', label: 'Active', color: '#13A150' }, { v: 'archived', label: 'Archived', color: '#888' }].map(({ v, label, color }) => (
                <button key={v} type="button" onClick={() => setForm(f => ({ ...f, status: v }))}
                  className="flex-1 py-2.5 rounded-sm text-xs font-body border transition-all"
                  style={{ background: form.status === v ? `${color}14` : 'transparent', color: form.status === v ? color : 'rgba(216,216,216,0.35)', borderColor: form.status === v ? color + '40' : 'rgba(255,255,255,0.08)' }}>
                  {label}
                </button>
              ))}
            </div>
          </Field>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => setShowModal(false)}
              className="flex-1 py-2.5 rounded-sm text-xs font-body border border-white/[0.08] text-ivory-300/40 hover:text-white transition-all">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={saving || uploading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-xs font-body font-bold transition-all disabled:opacity-50"
              style={{ background: 'rgba(19,161,80,0.15)', border: '1px solid rgba(19,161,80,0.3)', color: 'var(--wp-green)' }}>
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {editTarget ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <Modal title="Delete Product" onClose={() => setDeleteConfirm(null)}>
          <p className="text-ivory-300/60 text-sm mb-1">Delete <span className="text-white font-semibold">{deleteConfirm.name}</span>?</p>
          <p className="text-ivory-300/30 text-xs font-body mb-6">This cannot be undone. Consider archiving instead.</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setDeleteConfirm(null)}
              className="flex-1 py-2.5 rounded-sm text-xs font-body border border-white/[0.08] text-ivory-300/40 hover:text-white transition-all">Cancel</button>
            <button type="button" onClick={() => deleteProduct(deleteConfirm)}
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